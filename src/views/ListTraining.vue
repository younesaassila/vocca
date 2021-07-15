<template>
  <Page
    #default="{}"
    :loading="!list || !list.id"
    :not-found="!lists.find((obj) => obj.id === list.id)"
  >
    <h1 class="mb-4">{{ list.name }}</h1>

    <div v-if="list.words.length <= 0" class="text-center">
      <h5>Cette liste est vide.</h5>
    </div>

    <div v-else>
      <div v-if="state !== 'ended'" class="text-center">
        <b-form @submit.prevent>
          <h5 v-if="state === 'answering'" class="my-2">
            Traduis en {{ languageName(answerLanguage).toLowerCase() }} :
          </h5>

          <h5
            v-else-if="state === 'answered'"
            class="my-2"
            :style="`color: var(--${isAnswerCorrect ? 'success' : 'danger'});`"
          >
            {{
              isAnswerCorrect
                ? "Correct ! La bonne réponse est en effet :"
                : "Incorrect ! La bonne réponse est :"
            }}
          </h5>

          <h4 v-if="state === 'answering'" class="my-2">
            {{ questionVariant }}
          </h4>

          <h4
            v-else-if="state === 'answered'"
            class="my-2"
            :style="`color: var(--${isAnswerCorrect ? 'success' : 'danger'});`"
          >
            {{ correctAnswer }}
          </h4>

          <b-form-input
            ref="input-answer"
            v-model="userAnswer"
            class="mx-auto my-4 text-center"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            placeholder="La réponse est..."
            spellcheck="false"
            style="font-size: 15pt; max-width: 500px"
            type="text"
            :disabled="state === 'answered'"
          ></b-form-input>

          <b-button
            v-if="state === 'answering'"
            class="mt-0 mb-4"
            type="submit"
            variant="primary"
            @click="state = 'answered'"
          >
            Vérifier
          </b-button>

          <b-button
            v-else-if="state === 'answered'"
            ref="button-next"
            class="mt-0 mb-4"
            type="submit"
            variant="primary"
            @click="state = 'answering'"
          >
            Suivant
          </b-button>
        </b-form>

        <b-button
          class="my-2"
          variant="primary"
          :disabled="questionCount <= 0"
          @click="state = 'ended'"
        >
          Terminer l'entraînement
        </b-button>
      </div>

      <div v-else class="result-container">
        <h5 class="my-2">Votre note est :</h5>

        <h4 class="my-2">
          {{ Number(((userScore / questionCount) * 20).toFixed(1)) }} / 20
        </h4>

        <p class="mt-4">
          Vous avez répondu correctement à {{ userScore }}
          {{ userScore > 1 ? "questions" : "question" }} sur
          {{ questionCount }}.
        </p>

        <b-button class="m-2" variant="primary" @click="onReset()">
          Recommencer
        </b-button>

        <b-button class="m-2" to="/lists" variant="primary">
          Retour aux listes
        </b-button>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "ListTraining",
  components: {
    Page,
  },
  data() {
    return {
      state: "",
      questionLanguage: "",
      questionWord: "",
      questionVariant: "",
      answerLanguage: "",
      userAnswer: "",
      isAnswerCorrect: false,
      correctAnswer: "",
      userScore: 0,
      questionCount: 0,
    };
  },
  computed: {
    ...mapState("list", ["list"]),
    ...mapState("lists", ["lists"]),
    ...mapGetters("lists", ["languageName"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.initList(this.$route.params.id).then(() => {
          document.title = `${this.list.name} (Entraînement) – Vocca`;
          this.state = "answering";
        });
      },
    },
    state(value) {
      if (this.list.words.length <= 0) return;

      switch (value) {
        case "answering":
          this.loadQuestion();
          this.$nextTick(() => {
            if (this.$refs["input-answer"]) {
              this.$refs["input-answer"].focus();
            }
          });
          break;

        case "answered":
          this.verifyAnswer();
          this.$nextTick(() => {
            if (this.$refs["button-next"]) {
              this.$refs["button-next"].focus();
            }
          });
          break;
      }
    },
  },
  methods: {
    ...mapActions("list", ["initList"]),
    loadQuestion() {
      // Select a random language.
      const languageIndex = Math.floor(Math.random() * 2);
      const language =
        languageIndex === 0
          ? this.list.firstLanguage
          : this.list.secondLanguage;
      // Select a random word from the list.
      const wordIndex = Math.floor(Math.random() * this.list.words.length);
      const word = this.list.words[wordIndex];
      // Select a random variant from the word.
      // Reminder: word is an array of variants!
      const variantIndex = Math.floor(Math.random() * word[language].length);
      const variant = word[language][variantIndex];
      // Update data with our newly chosen values.
      this.questionWord = word;
      this.questionVariant = variant;
      this.questionLanguage = language;
      this.answerLanguage =
        languageIndex - 1 === 0
          ? this.list.firstLanguage
          : this.list.secondLanguage;
      this.userAnswer = "";
      this.isAnswerCorrect = false;
      this.correctAnswer = "";
    },
    verifyAnswer() {
      const answer = this.normalizeString(this.userAnswer);

      if (answer === "") {
        return this.setAnswer(false, this.questionWord[this.answerLanguage][0]);
      }

      let correctAnswerVariants = Array.from(
        this.questionWord[this.answerLanguage]
      );

      for (let i = 0; i < correctAnswerVariants.length; i++) {
        correctAnswerVariants[i] = this.normalizeString(
          correctAnswerVariants[i]
        );

        // Test for a perfect match with every correct answer variant.
        if (answer === correctAnswerVariants[i]) {
          return this.setAnswer(
            true,
            this.questionWord[this.answerLanguage][i]
          );
        }
      }

      // Every answer that did not match any correct answer variant is
      // necessarily composed of more than one word.

      const answerWords = answer.split(" ");

      // Create an array of arrays each containing every word from a correct
      // answer variant.
      let correctAnswers = [];

      for (const correctAnswerVariant of correctAnswerVariants) {
        correctAnswers.push(correctAnswerVariant.split(" "));
      }

      // The number of words the user got correctly.
      let correctCount = 0;
      let correctIndex = 0;

      for (let [index, correctAnswer] of correctAnswers.entries()) {
        for (let correctAnswerWord of correctAnswer) {
          for (let answerWord of answerWords) {
            if (answerWord === correctAnswerWord) {
              correctCount++;
              correctIndex = index;
            }
          }
        }
      }

      // If the user got at least half of the correct answer's words, flag their
      // answer as correct.
      let threshold = Math.round(correctAnswers[correctIndex].length / 2);
      if (threshold < 1) threshold = 1;

      if (correctCount >= threshold) {
        return this.setAnswer(
          true,
          this.questionWord[this.answerLanguage][correctIndex]
        );
      }

      // No matches for the user's answer.
      return this.setAnswer(false, this.questionWord[this.answerLanguage][0]);
    },
    normalizeString(str) {
      // TODO: Check list settings.
      let result = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.toLowerCase();
      result = result.replace(/ß/g, "ss");
      result = result.replace(/œ/g, "oe");
      result = result.replace(/'/g, " ");
      result = result.replace(/’/g, " ");
      result = result.trim();
      return result;
    },
    setAnswer(correct, correctAnswer) {
      if (correct) this.userScore++;

      this.isAnswerCorrect = correct;
      this.correctAnswer = correctAnswer;
      this.questionCount++;
    },
    onReset() {
      this.state = "answering";
      this.userScore = 0;
      this.questionCount = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.result-container {
  animation: showResultContainer 300ms normal ease-out;
  text-align: center;
}

@keyframes showResultContainer {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
