<template>
  <Page
    #default="{}"
    :loading="!list || !list.id"
    :not-found="!user.teacher || user.data.uid !== list.author"
  >
    <h1 class="mb-4">Modifier « {{ list.name }} »</h1>

    <b-alert variant="info" show>
      Astuce : Pour inclure d'autres variantes à un même mot, séparez celles-ci
      par une virgule. Exemple : « bonjour, salut » pour « hi, hello ».
    </b-alert>

    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-card class="my-2">
      <template v-slot:header>
        Mots de vocabulaire –
        {{ languageName(list.firstLanguage) }} ↔
        {{ languageName(list.secondLanguage) }}
      </template>

      <b-row v-for="(word, index) in words" :key="`word-${index}`" class="my-2">
        <b-col>
          <b-form-input
            :ref="`input-lang-1-word-${index}`"
            class="text-center mb-2"
            type="text"
            :value="word[list.firstLanguage].join(',')"
            @change="onEditWord(index)"
          ></b-form-input>
        </b-col>

        <b-col>
          <b-form-input
            :ref="`input-lang-2-word-${index}`"
            class="text-center mb-2"
            type="text"
            :value="word[list.secondLanguage].join(',')"
            @change="onEditWord(index)"
          ></b-form-input>
        </b-col>

        <b-col cols="2">
          <b-button
            class="w-100 mb-2 float-bottom"
            variant="danger"
            @click="onDeleteWord(index)"
          >
            Supprimer
          </b-button>
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col>
          <b-form-input
            :ref="`input-lang-1-word-${words.length}`"
            class="text-center mb-2"
            type="text"
            :placeholder="`Mot en ${languageName(
              list.firstLanguage
            ).toLowerCase()}`"
          ></b-form-input>
        </b-col>

        <b-col>
          <b-form-input
            :ref="`input-lang-2-word-${words.length}`"
            class="text-center mb-2"
            type="text"
            :placeholder="`Mot en ${languageName(
              list.secondLanguage
            ).toLowerCase()}`"
          ></b-form-input>
        </b-col>

        <b-col cols="2">
          <b-button class="w-100 mb-2" variant="success" @click="onAddWord()">
            Ajouter
          </b-button>
        </b-col>
      </b-row>

      <hr />

      <div class="text-right">
        <b-button
          v-if="edited && !saving"
          class="my-2 mr-0 ml-0"
          variant="secondary"
          @click="onCancel()"
        >
          Annuler les modifications
        </b-button>

        <b-button
          class="my-2 mr-0 ml-2"
          variant="primary"
          :disabled="saving"
          @click="onSave()"
        >
          <b-spinner v-if="saving" small></b-spinner>
          Sauvegarder
        </b-button>

        <b-form-text v-if="saved && !saving" text-variant="success">
          <b-icon icon="check2" variant="success" />
          Vos modifications ont été sauvegardées avec succès.
        </b-form-text>
      </div>
    </b-card>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "ListEditor",
  components: {
    Page,
  },
  data() {
    return {
      edited: false,
      error: null,
      saving: false,
      saved: false,
      words: [],
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("list", ["list"]),
    ...mapGetters("lists", ["languageName"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.initList(this.$route.params.id).then(() => {
          document.title = `Modifier « ${this.list.name} » – Vocca`;
          this.words = JSON.parse(JSON.stringify(this.list.words));
        });
      },
    },
    edited(value) {
      if (value) {
        this.saved = false;
      }
    },
  },
  methods: {
    ...mapActions("list", ["initList", "setListWords"]),
    onAddWord() {
      const index = this.words.length;
      const inputLang1 = this.$refs[`input-lang-1-word-${index}`];
      const inputLang2 = this.$refs[`input-lang-2-word-${index}`];

      if (
        inputLang1.localValue.replace(/\s+/g, "") === "" ||
        inputLang2.localValue.replace(/\s+/g, "") === ""
      ) {
        this.error = "Vous ne pouvez pas ajouter de mot vide !";
        return;
      }

      let word = {};
      word[this.list.firstLanguage] = inputLang1.localValue.split(",");
      word[this.list.secondLanguage] = inputLang2.localValue.split(",");

      this.edited = true;
      this.error = null;
      inputLang1.localValue = "";
      inputLang2.localValue = "";

      this.words.push(word);
    },
    onEditWord(index) {
      const inputLang1 = this.$refs[`input-lang-1-word-${index}`][0];
      const inputLang2 = this.$refs[`input-lang-2-word-${index}`][0];

      if (
        inputLang1.localValue.replace(/\s+/g, "") === "" ||
        inputLang2.localValue.replace(/\s+/g, "") === ""
      ) {
        this.error = "Vous ne pouvez pas modifier ce mot pour un mot vide !";
        return;
      }

      let word = {};
      word[this.list.firstLanguage] = inputLang1.localValue.split(",");
      word[this.list.secondLanguage] = inputLang2.localValue.split(",");

      this.edited = true;
      this.error = null;
      this.words.splice(index, 1, word);
    },
    onDeleteWord(index) {
      this.edited = true;
      this.words.splice(index, 1);
    },
    onCancel() {
      if (!this.edited) return;

      this.$bvModal
        .msgBoxConfirm(
          "Annuler toutes les modifications ? Cette action est irréversible !",
          {
            title: "Êtes-vous sûr ?",
            okVariant: "danger",
            okTitle: "Annuler les modifications",
            cancelTitle: "Ne rien faire",
            centered: true,
          }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.words = JSON.parse(JSON.stringify(this.list.words));
          }
        })
        .catch(() => {});
    },
    async onSave() {
      this.saving = true;
      await this.setListWords(this.words).then(() => {
        this.edited = false;
        this.saved = true;
      });
      this.saving = false;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.edited) return next();

    this.$bvModal
      .msgBoxConfirm(
        "Vous avez des modifications non sauvegardées. Quitter tout de même cette page ?",
        {
          title: "Êtes-vous sûr ?",
          okVariant: "danger",
          okTitle: "Quitter",
          cancelTitle: "Annuler",
          centered: true,
        }
      )
      .then((confirmed) => {
        if (confirmed) {
          next();
        }
      })
      .catch(() => {});
  },
};
</script>
