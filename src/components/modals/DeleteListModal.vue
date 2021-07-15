<template>
  <b-modal
    :id="id"
    size="md"
    centered
    ok-title="Supprimer"
    cancel-title="Annuler"
    ok-variant="danger"
    @ok.prevent="onDeleteList()"
    @cancel="onHide()"
  >
    <template v-slot:modal-title>Supprimer « {{ list.name }} » ?</template>

    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <p>
      Êtes-vous sûr de vouloir supprimer « {{ list.name }} » ? Cette action est
      irréversible !
    </p>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "DeleteListModal",
  props: {
    id: {
      type: String,
      default: "delete-list-modal",
    },
    list: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState("lists", ["error"]),
    ...mapState("classes", ["classes"]),
  },
  methods: {
    ...mapActions("lists", ["deleteList"]),
    ...mapActions("classes", ["removeList"]),
    async onDeleteList() {
      // Unshare list from all classes it is shared with.
      for (const voccaClass of this.classes) {
        if (voccaClass.lists.includes(this.list.id)) {
          await this.removeList({
            classId: voccaClass.id,
            listId: this.list.id,
          });
        }
      }

      this.deleteList(this.list.id);
      this.onHide();
    },
    onHide() {
      this.$bvModal.hide(this.id);
    },
  },
};
</script>
