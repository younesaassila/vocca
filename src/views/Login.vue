<template>
  <Page #default="{}">
    <b-card title="Connexion" class="m-auto" style="max-width: 800px">
      <b-form @submit.prevent="onLogin()">
        <b-card-text>
          Vous n'avez pas de compte Vocca ?
          <b-link to="/register"> Créez-en un aujourd'hui ! </b-link>
        </b-card-text>

        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

        <b-form-group label="Adresse e-mail :" label-for="input-email">
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Mot de passe :">
          <b-input-group>
            <b-form-input
              v-model="form.password"
              autocomplete="current-password"
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

          <b-link v-b-modal.reset-password-modal>Mot de passe oublié ?</b-link>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox-group v-model="form.checked">
            <b-form-checkbox value="persistent">
              Rester connecté
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <b-button type="submit" variant="primary" :disabled="loggingIn">
          <b-spinner v-if="loggingIn" small></b-spinner>
          Connexion
        </b-button>
      </b-form>
    </b-card>

    <ResetPasswordModal id="reset-password-modal" />
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal.vue";
import { mapActions, mapState } from "vuex";
import router from "@/router";

export default {
  name: "Login",
  components: {
    Page,
    ResetPasswordModal,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        checked: [],
      },
      loggingIn: false,
      showPassword: false,
    };
  },
  computed: mapState("auth", ["error"]),
  methods: {
    ...mapActions("auth", ["login"]),
    onLogin() {
      this.loggingIn = true;
      this.login({
        email: this.form.email,
        password: this.form.password,
        persistent: this.form.checked.includes("persistent"),
      })
        .then(() => {
          this.loggingIn = false;
          router.push(this.$route.query.redirect || "/");
        })
        .catch(() => {
          this.loggingIn = false;
        });
    },
  },
};
</script>
