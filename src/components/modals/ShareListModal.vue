<template>
  <b-modal :id="id" size="lg" centered>
    <template v-slot:modal-title>Partager « {{ list.name }} »</template>

    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

    <b-form v-if="classes.length > 0" @submit.prevent>
      <p>
        Sélectionnez les classes avec lesquelles partager cette liste de
        vocabulaire :
      </p>

      <b-form-checkbox
        v-for="voccaClass in classes"
        :key="voccaClass.id"
        v-model="isSharedWithClass[voccaClass.id]"
      >
        {{ voccaClass.name }}
      </b-form-checkbox>

      <b-form-text class="mt-4">
        <b-icon icon="info-circle" />
        Vous pouvez désélectionner une classe pour ne plus partager «
        {{ list.name }} » avec celle-ci.
      </b-form-text>
    </b-form>

    <div v-else class="text-center">
      <p class="m-2">
        Aucune classe disponible. (Avez-vous acheté vos classes en attente de
        paiement ?)
      </p>
    </div>

    <template v-slot:modal-footer>
      <b-button variant="secondary" @click="onReset()"> Annuler </b-button>
      <b-button variant="success" :disabled="saving" @click="onShareList()">
        <b-spinner v-if="saving" small></b-spinner>
        Partager
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ShareListModal",
  props: {
    id: {
      type: String,
      default: "share-list-modal",
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
      isSharedWithClass: {},
      saving: false,
    };
  },
  computed: {
    ...mapState("classes", ["error"]),
    ...mapState("classes", ["classes"]),
  },
  created() {
    for (const voccaClass of this.classes) {
      this.isSharedWithClass[voccaClass.id] = voccaClass.lists.includes(
        this.list.id
      );
    }
  },
  methods: {
    ...mapActions("classes", ["addList", "removeList"]),
    async onShareList() {
      this.saving = true;

      for (const [classId, value] of Object.entries(this.isSharedWithClass)) {
        if (value === true) {
          await this.addList({
            classId: classId,
            listId: this.list.id,
          });
        } else if (value === false) {
          await this.removeList({
            classId: classId,
            listId: this.list.id,
          });
        }
      }

      this.saving = false;
      this.$bvModal.hide(this.id);
      this.onReset();
    },
    onReset() {
      this.$bvModal.hide(this.id);
    },
  },
};
</script>
