<template>
  <b-modal
    :id="id"
    class="join-class-modal"
    title="Rejoindre une classe"
    size="sm"
    centered
    ok-title="Rejoindre"
    cancel-title="Annuler"
    @ok.prevent="onJoinClass()"
    @cancel="onReset()"
  >
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form @submit.prevent>
      <b-form-group
        label="Code de la classe :"
        label-for="input-id"
        description="Code à 5 chiffres fourni par votre professeur."
      >
        <b-form-input
          id="input-id"
          v-model="classId"
          inputmode="numeric"
          pattern="[0-9]*"
          required
          size="lg"
          style="text-align: center"
          type="number"
        ></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "@/store";

export default {
  name: "JoinClassModal",
  props: {
    id: {
      type: String,
      default: "join-class-modal",
    },
    userId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      classId: "",
    };
  },
  computed: mapState("classes", ["error"]),
  methods: {
    ...mapActions("classes", ["joinClass"]),
    onJoinClass() {
      this.joinClass({
        classId: this.classId,
        userId: this.userId,
      }).then(() => {
        this.$bvModal.hide(this.id);
        this.onReset();
      });
    },
    onReset() {
      this.classId = "";
      store.commit("classes/SET_ERROR", null);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
