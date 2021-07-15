<template>
  <b-modal
    :id="id"
    class="create-class-modal"
    title="Nouvelle classe"
    size="lg"
    centered
    ok-title="Créer"
    cancel-title="Annuler"
    @ok.prevent="onCreateClass()"
    @cancel="onReset()"
  >
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form @submit.prevent>
      <b-form-group label="Nom de la classe :" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="classObj.name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Nombre d'élèves que la classe peut accueillir :"
        label-for="input-slots"
      >
        <b-form-input
          id="input-slots"
          v-model="classObj.slots"
          type="number"
          min="1"
          max="50"
          required
        ></b-form-input>
        <small style="color: var(--danger)">
          Une fois la classe créée, ce nombre ne peut plus être modifié.
        </small>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "@/store";

export default {
  name: "CreateClassModal",
  props: {
    id: {
      type: String,
      default: "create-class-modal",
    },
    userId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      classObj: {
        name: "",
        slots: 1,
      },
    };
  },
  computed: mapState("classes", ["error"]),
  methods: {
    ...mapActions("classes", ["createClass"]),
    onCreateClass() {
      this.createClass({
        classObj: this.classObj,
        userId: this.userId,
      }).then(() => {
        this.$bvModal.hide(this.id);
        this.onReset();
      });
    },
    onReset() {
      this.classObj = {
        name: "",
        slots: 1,
      };
      store.commit("classes/SET_ERROR", null);
    },
  },
};
</script>
