<template>
  <b-modal
    :id="id"
    title="Nouvelle liste de vocabulaire"
    size="lg"
    centered
    ok-title="Créer"
    cancel-title="Annuler"
    @ok.prevent="onCreate()"
    @cancel="onReset()"
  >
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form @submit.prevent>
      <b-form-group label="Nom de la liste :" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="list.name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Langues :" label-for="input-first-language">
        <b-form-select
          id="input-first-language"
          v-model="list.firstLanguage"
          class="mb-2"
          :options="languages"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>
              -- Sélectionnez la langue n°1 --
            </b-form-select-option>
          </template>
        </b-form-select>

        <b-form-select
          v-model="list.secondLanguage"
          class="mb-2"
          :options="languages"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>
              -- Sélectionnez la langue n°2 --
            </b-form-select-option>
          </template>
        </b-form-select>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "@/store";

export default {
  name: "CreateListModal",
  props: {
    id: {
      type: String,
      default: "create-list-modal",
    },
    userId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      list: {
        name: "",
        firstLanguage: null,
        secondLanguage: "fr",
      },
      // TODO: Get all languages from store/lists.js
      languages: [
        { value: "de", text: "Allemand" },
        { value: "en", text: "Anglais" },
        { value: "es", text: "Espagnol" },
        { value: "fr", text: "Français" },
        { value: "la", text: "Latin" },
      ],
    };
  },
  computed: mapState("lists", ["error"]),
  methods: {
    ...mapActions("lists", ["createList"]),
    onCreate() {
      this.createList({
        list: this.list,
        userId: this.userId,
      }).then(() => {
        this.$bvModal.hide(this.id);
        this.onReset();
      });
    },
    onReset() {
      this.list = {
        name: "",
        firstLanguage: null,
        secondLanguage: "fr",
      };
      store.commit("lists/SET_ERROR", null);
    },
  },
};
</script>
