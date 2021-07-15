<template>
  <Page #default="{}">
    <h1>Nous contacter</h1>
    <h5 style="color: var(--secondary)">Besoin d'aide ? Contactez-nous !</h5>

    <b-alert v-if="error" class="mt-4" variant="danger" show>
      {{ error }}
    </b-alert>

    <b-card class="mt-4">
      <b-form @submit.prevent="onSend()">
        <b-form-group label="Nom et prénom :">
          <b-form-input
            v-model="name"
            autocapitalize="words"
            autocomplete="name"
            required
            spellcheck="false"
            type="text"
            :disabled="!!user.data.lastName"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Adresse e-mail :">
          <b-form-input
            v-model="email"
            autocomplete="email"
            required
            spellcheck="false"
            type="email"
            :disabled="!!user.data.email"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Sujet :">
          <b-form-input
            v-model="subject"
            autocapitalize="sentences"
            autocomplete="off"
            required
            spellcheck="true"
            type="text"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Message :">
          <b-form-textarea v-model="message" rows="5"></b-form-textarea>
        </b-form-group>

        <VueRecaptcha
          sitekey="6LdLpb8ZAAAAAKq80DV7jpc9n-ZXrW6qeBBqdBu6"
          @verify="validCaptcha = true"
          @expired="validCaptcha = false"
          @error="validCaptcha = false"
        />

        <b-button
          class="mt-4"
          type="submit"
          variant="primary"
          :disabled="messageSending"
        >
          <b-spinner v-if="messageSending" small></b-spinner>
          Envoyer
        </b-button>

        <b-form-text
          v-if="messageSent && !messageSending"
          text-variant="success"
        >
          <b-icon icon="check2" variant="success" />
          Votre message a été envoyé.
        </b-form-text>
      </b-form>
    </b-card>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import VueRecaptcha from "vue-recaptcha";
import { mapState, mapActions } from "vuex";

export default {
  name: "Contact",
  components: {
    Page,
    VueRecaptcha,
  },
  data() {
    return {
      name: "",
      email: "",
      subject: "",
      message: "",
      validCaptcha: false,
      messageSending: false,
      messageSent: false,
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("contact", ["error"]),
  },
  mounted() {
    if (this.user.data.id) {
      this.name = `${this.user.data.lastName} ${this.user.data.firstName}`;
      this.email = this.user.data.email;
    }
  },
  methods: {
    ...mapActions("contact", ["sendEmail"]),
    async onSend() {
      this.messageSending = true;
      await this.sendEmail({
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message,
        validCaptcha: this.validCaptcha,
      })
        .then(() => {
          this.messageSent = true;
        })
        .catch(() => {
          this.messageSent = false;
        });
      this.messageSending = false;
    },
  },
};
</script>
