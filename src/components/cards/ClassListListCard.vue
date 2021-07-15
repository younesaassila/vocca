<template>
  <b-card no-body>
    <b-card-header>
      Listes de vocabulaire partagées – {{ voccaClass.lists.length }}
    </b-card-header>

    <b-list-group v-if="sortedLists.length > 0" flush>
      <b-list-group-item
        v-for="list in sortedLists"
        :key="list.id"
        class="d-flex justify-content-between align-items-center"
      >
        {{ list.name }}
        <b-button variant="danger" @click="onRemoveList(list)">
          Ne plus partager
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <b-card-text v-else class="m-4">
      Aucune liste de vocabulaire partagée. Pour partager une liste, rendez-vous
      sur la page « <b-link to="/lists">Mes listes de vocabulaire</b-link> ».
    </b-card-text>
  </b-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "ClassListListCard",
  props: {
    voccaClass: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState("voccaClass", ["lists"]),
    ...mapGetters("lists", ["getListById"]),
    sortedLists() {
      let sortedLists = [];

      for (const listId of this.voccaClass.lists) {
        const listObj = this.getListById(listId);
        if (listObj) {
          sortedLists.push(listObj);
        }
      }

      sortedLists.reverse();

      return sortedLists;
    },
  },
  methods: {
    ...mapActions("classes", ["removeList"]),
    onRemoveList(listObj) {
      this.$bvModal
        .msgBoxConfirm(
          `Ne plus partager « ${listObj.name} » à la classe « ${this.voccaClass.name} » empêchera les élèves de cette classe d'avoir accès à cette liste de vocabulaire.`,
          {
            title: "Êtes-vous sûr ?",
            okVariant: "danger",
            okTitle: "Ne plus partager",
            cancelTitle: "Annuler",
            centered: true,
          }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.removeList({
              classId: this.voccaClass.id,
              listId: listObj.id,
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>
