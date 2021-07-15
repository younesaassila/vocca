<template>
  <b-modal
    :id="id"
    size="md"
    centered
    ok-title="Renommer"
    cancel-title="Annuler"
    @ok.prevent="onRenameList()"
    @cancel="onHide()"
  >
    <template v-slot:modal-title>Renommer « {{ list.name }} »</template>

    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form @submit.prevent>
      <b-form-group label="Nouveau nom :" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="newName"
          type="text"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "RenameListModal",
  props: {
    id: {
      type: String,
      default: "rename-list-modal",
    },
    list: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      newName: "",
    };
  },
  computed: mapState("lists", ["error"]),
  methods: {
    ...mapActions("lists", ["renameList"]),
    async onRenameList() {
      await this.renameList({
        listId: this.list.id,
        newName: this.newName,
      });

      this.onHide();
    },
    onHide() {
      this.newName = "";
      this.$bvModal.hide(this.id);
    },
  },
};
</script>
