<template>
  <b-modal
    :id="id"
    title="Réinitialiser votre mot de passe"
    size="md"
    centered
    ok-title="Envoyer un e-mail de réinitialisation"
    cancel-title="Retour"
    @ok.prevent="onSendPasswordResetEmail()"
    @cancel="onHide()"
  >
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form @submit.prevent>
      <b-form-group
        label="Adresse e-mail associée à votre compte :"
        label-for="input-email"
      >
        <b-form-input
          id="input-email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
        ></b-form-input>
      </b-form-group>

      <b-form-text v-if="sent" text-variant="success">
        <b-icon icon="check2" variant="success" />
        Un e-mail de réinitialisation de mot de passe vous a été envoyé.
      </b-form-text>
    </b-form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ResetPasswordModal",
  props: {
    id: {
      type: String,
      default: "reset-password-modal",
    },
  },
  data() {
    return {
      email: "",
      sent: false,
    };
  },
  computed: mapState("auth", ["error"]),
  methods: {
    ...mapActions("auth", ["sendPasswordResetEmail"]),
    onSendPasswordResetEmail() {
      this.sendPasswordResetEmail(this.email).then(() => {
        this.sent = true;
      });
    },
    onHide() {
      this.email = "";
      this.sent = false;
      this.$bvModal.hide(this.id);
    },
  },
};
</script>
