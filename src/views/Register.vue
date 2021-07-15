<template>
  <Page #default="{}">
    <b-card
      title="Créer votre compte Vocca"
      class="m-auto"
      style="max-width: 800px"
    >
      <b-form @submit.prevent="onRegister()">
        <b-card-text>
          Vous avez déjà un compte Vocca ?
          <b-link to="/login"> Connectez-vous. </b-link>
        </b-card-text>

        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

        <b-form-group label="Je suis :">
          <b-form-radio-group>
            <b-form-radio v-model="form.role" value="student">
              élève
            </b-form-radio>
            <b-form-radio v-model="form.role" value="teacher">
              enseignant
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group label="Nom :" label-for="input-last-name">
          <b-form-input
            id="input-last-name"
            v-model="form.lastName"
            type="text"
            required
            autocomplete="familty-name"
            spellcheck="false"
            autocapitalize="words"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Prénom :" label-for="input-first-name">
          <b-form-input
            id="input-first-name"
            v-model="form.firstName"
            type="text"
            required
            autocomplete="given-name"
            spellcheck="false"
            autocapitalize="characters"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Établissement scolaire :" label-for="input-school">
          <b-form-input
            id="input-school"
            v-model="form.school"
            type="text"
            required
            autocomplete="organization"
            spellcheck="true"
            autocapitalize="sentences"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Adresse e-mail :" label-for="input-email">
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            spellcheck="false"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Mot de passe :"
          description="Votre mot de passe doit comporter un minimum de 6 caractères."
        >
          <b-input-group>
            <b-form-input
              v-model="form.password"
              autocomplete="new-password"
              required
              :type="showPassword ? 'text' : 'password'"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                variant="outline-primary"
                @click="showPassword = !showPassword"
              >
                <b-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox-group v-model="form.checked">
            <b-form-checkbox value="tos">
              J'accepte les
              <b-link to="/tos" target="_blank">
                conditions générales d'utilisation
              </b-link>
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <VueRecaptcha
          sitekey="6LdLpb8ZAAAAAKq80DV7jpc9n-ZXrW6qeBBqdBu6"
          @verify="form.validCaptcha = true"
          @expired="form.validCaptcha = false"
          @error="form.validCaptcha = false"
        />

        <b-button
          class="mt-4"
          type="submit"
          variant="primary"
          :disabled="registering"
        >
          <b-spinner v-if="registering" small></b-spinner>
          Inscription
        </b-button>
      </b-form>
    </b-card>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import VueRecaptcha from "vue-recaptcha";
import { mapActions, mapState } from "vuex";
import router from "@/router";

export default {
  name: "Register",
  components: {
    Page,
    VueRecaptcha,
  },
  data() {
    return {
      form: {
        role: "",
        lastName: "",
        firstName: "",
        school: "",
        email: "",
        password: "",
        checked: [],
        validCaptcha: false,
      },
      registering: false,
      showPassword: false,
    };
  },
  computed: mapState("auth", ["error"]),
  methods: {
    ...mapActions("auth", ["register"]),
    onRegister() {
      this.registering = true;
      this.register({
        role: this.form.role,
        lastName: this.form.lastName,
        firstName: this.form.firstName,
        school: this.form.school,
        email: this.form.email,
        password: this.form.password,
        acceptedTOS: this.form.checked.includes("tos"),
        validCaptcha: this.form.validCaptcha,
      })
        .then(() => {
          this.registering = false;
          router.push(this.$route.query.redirect || "/");
        })
        .catch(() => {
          this.registering = false;
        });
    },
  },
};
</script>
