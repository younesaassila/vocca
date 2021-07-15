<template>
  <b-card header="Paramètres">
    <b-form @submit.prevent="onSaveSettings()">
      <b-form-checkbox v-model="settings.data.public" switch>
        Autoriser de nouveaux élèves à rejoindre cette classe
      </b-form-checkbox>

      <b-button
        class="mt-4"
        type="submit"
        variant="primary"
        :disabled="settings.saving"
      >
        <b-spinner v-if="settings.saving" small></b-spinner>
        Enregistrer les modifications
      </b-button>

      <b-form-text
        v-if="settings.saved && !settings.saving"
        text-variant="success"
      >
        <b-icon icon="check2" variant="success" />
        Vos modifications ont été enregistrées avec succès.
      </b-form-text>
    </b-form>
  </b-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ClassSettingsCard",
  props: {
    voccaClass: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      settings: {
        data: {
          // Setting: Allow new students to join the class.
          public: true,
        },
        saved: false,
        saving: false,
      },
    };
  },
  watch: {
    "settings.data": {
      deep: true,
      handler() {
        this.settings.saved = false;
      },
    },
  },
  mounted() {
    this.settings.data.public = this.voccaClass.status === "public";
  },
  methods: {
    ...mapActions("voccaClass", ["updateClassStatus"]),
    async onSaveSettings() {
      this.settings.saving = true;

      await this.updateClassStatus({
        classObj: this.voccaClass,
        status: this.settings.data.public ? "public" : "private",
      })
        .then(() => {
          this.settings.saved = true;
        })
        .catch(() => {
          this.settings.saved = false;
        });

      this.settings.saving = false;
    },
  },
};
</script>
