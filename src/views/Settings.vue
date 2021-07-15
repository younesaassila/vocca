<template>
  <Page #default="{}">
    <b-card title="Paramètres" class="m-auto" style="max-width: 800px">
      <b-alert v-if="authError" variant="danger" show>
        {{ authError }}
      </b-alert>

      <hr />

      <b-form @submit.prevent>
        <b-form-group label="Nom :" label-for="input-last-name">
          <b-form-input
            id="input-last-name"
            v-model="name.lastName"
            autocapitalize="words"
            autocomplete="familty-name"
            spellcheck="false"
            type="text"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Prénom :" label-for="input-first-name">
          <b-form-input
            id="input-first-name"
            v-model="name.firstName"
            autocapitalize="characters"
            autocomplete="given-name"
            spellcheck="false"
            type="text"
          ></b-form-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="name.saving"
          @click="onUpdateName()"
        >
          <b-spinner v-if="name.saving" small></b-spinner>
          Modifier mon nom
        </b-button>

        <b-form-text v-if="name.saved && !name.saving" text-variant="success">
          <b-icon icon="check2" variant="success" />
          Votre nom a été modifié avec succès.
        </b-form-text>
      </b-form>

      <hr />

      <b-form @submit.prevent>
        <b-alert v-if="!user.data.emailVerified" variant="warning" show>
          Vous n'avez pas vérifié « {{ user.data.email }} ».
          <b-link
            class="float-right"
            :disabled="email.sentEmailVerification"
            @click="
              sendEmailVerification().then(() => {
                email.sentEmailVerification = true;
              })
            "
          >
            {{ email.sentEmailVerification ? "Envoyé" : "Vérifier" }}
          </b-link>
        </b-alert>

        <b-form-group
          label="Adresse e-mail :"
          label-for="input-email"
          description="Un e-mail de confirmation vous sera envoyé à la nouvelle adresse."
        >
          <b-form-input
            id="input-email"
            v-model="email.newEmail"
            autocomplete="email"
            spellcheck="false"
            type="email"
          ></b-form-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="email.sending"
          @click="onUpdateEmail()"
        >
          <b-spinner v-if="email.sending" small></b-spinner>
          Modifier mon adresse e-mail
        </b-button>

        <b-form-text v-if="email.sent && !email.sending" text-variant="success">
          <b-icon icon="check2" variant="success" />
          Un e-mail de confirmation a été envoyé à {{ email.newEmail }}.
        </b-form-text>
      </b-form>

      <hr />

      <b-form @submit.prevent>
        <b-form-group label="Mot de passe actuel :">
          <b-input-group>
            <b-form-input
              v-model="password.currentPassword"
              autocomplete="current-password"
              spellcheck="false"
              :type="password.showCurrentPassword ? 'text' : 'password'"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                variant="outline-primary"
                @click="
                  password.showCurrentPassword = !password.showCurrentPassword
                "
              >
                <b-icon
                  :icon="password.showCurrentPassword ? 'eye-slash' : 'eye'"
                />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group
          label="Nouveau mot de passe :"
          description="Votre nouveau mot de passe doit comporter un minimum de 6 caractères."
        >
          <b-input-group>
            <b-form-input
              v-model="password.newPassword"
              autocomplete="new-password"
              spellcheck="false"
              :type="password.showNewPassword ? 'text' : 'password'"
            ></b-form-input>

            <b-input-group-append>
              <b-button
                variant="outline-primary"
                @click="password.showNewPassword = !password.showNewPassword"
              >
                <b-icon
                  :icon="password.showNewPassword ? 'eye-slash' : 'eye'"
                />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="password.saving"
          @click="onUpdatePassword()"
        >
          <b-spinner v-if="password.saving" small></b-spinner>
          Modifier mon mot de passe
        </b-button>

        <b-form-text
          v-if="password.saved && !password.saving"
          text-variant="success"
        >
          <b-icon icon="check2" variant="success" />
          Votre mot de passe a été modifié avec succès.
        </b-form-text>
      </b-form>

      <hr />

      <b-form @submit.prevent>
        <b-form-group label="Demande de suppression de compte">
          <b-form-text>
            Si vous souhaitez supprimer votre compte, veuillez en faire la
            demande via <b-link to="/contact">le formulaire de contact</b-link>.
          </b-form-text>
        </b-form-group>
      </b-form>
    </b-card>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "Settings",
  components: {
    Page,
  },
  data() {
    return {
      name: {
        lastName: "",
        firstName: "",
        saving: false,
        saved: false,
      },
      email: {
        newEmail: "",
        sending: false,
        sent: false,
        sentEmailVerification: false,
      },
      password: {
        currentPassword: "",
        newPassword: "",
        saving: false,
        saved: false,
        showCurrentPassword: false,
        showNewPassword: false,
      },
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("auth", {
      authError: "error",
    }),
  },
  mounted() {
    this.name = {
      lastName: this.user.data.lastName,
      firstName: this.user.data.firstName,
      saving: false,
      saved: false,
    };
    this.email = {
      newEmail: this.user.data.email,
      sending: false,
      sent: false,
      sentEmailVerification: false,
    };
    this.password = {
      currentPassword: "",
      newPassword: "",
      saving: false,
      saved: false,
      showCurrentPassword: false,
      showNewPassword: false,
    };
  },
  methods: {
    ...mapActions("auth", [
      "updateName",
      "sendEmailVerification",
      "verifyBeforeUpdateEmail",
      "updatePassword",
    ]),
    async onUpdateName() {
      this.name.saving = true;
      await this.updateName({
        lastName: this.name.lastName,
        firstName: this.name.firstName,
      })
        .then(() => {
          this.name.saved = true;
        })
        .catch(() => {
          this.name.saved = false;
        });
      this.name.saving = false;
    },
    async onUpdateEmail() {
      this.email.sending = true;
      await this.verifyBeforeUpdateEmail(this.email.newEmail)
        .then(() => {
          this.email.sent = true;
        })
        .catch(() => {
          this.email.sent = false;
        });
      this.email.sending = false;
    },
    async onUpdatePassword() {
      this.password.saving = true;
      await this.updatePassword({
        currentPassword: this.password.currentPassword,
        newPassword: this.password.newPassword,
      })
        .then(() => {
          this.password.saved = true;
        })
        .catch(() => {
          this.password.saved = false;
        });
      this.password.saving = false;
    },
  },
};
</script>
