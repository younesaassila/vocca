<template>
  <BaseWidget title="Suggestions de listes de vocabulaire">
    <div v-if="suggestedLists.length > 0">
      <b-list-group flush>
        <ListListItem
          v-for="list in suggestedLists"
          :key="list.id"
          :list="list"
        />

        <b-list-group-item v-if="user.teacher" class="text-center">
          <p class="m-2">
            <b-link to="/lists">
              Accéder à la page « Mes listes de vocabulaire »
            </b-link>
          </p>
        </b-list-group-item>

        <b-list-group-item
          v-else-if="suggestedLists.length < lists.length"
          class="text-center"
        >
          <p class="m-2">
            <b-link to="/lists">
              Afficher toutes les listes de vocabulaire disponibles
            </b-link>
          </p>
        </b-list-group-item>
      </b-list-group>
    </div>

    <div v-else class="text-center">
      <p v-if="user.student && lists.length <= 0" class="m-4">
        Aucune liste de vocabulaire partagée pour le moment.
      </p>

      <p v-else-if="user.student && lists.length > 0" class="m-4">
        <b-link to="/lists">
          Afficher toutes les listes de vocabulaire disponibles
        </b-link>
      </p>

      <p v-else-if="user.teacher" class="m-4">
        Aucune liste de vocabulaire créée pour le moment. Pour en créer une,
        rendez-vous sur la page «
        <b-link to="/lists">Mes listes de vocabulaire</b-link> ».
      </p>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from "@/components/widgets/BaseWidget.vue";
import ListListItem from "@/components/list_items/ListListItem.vue";
import { mapState } from "vuex";

export default {
  name: "ListsWidget",
  components: {
    BaseWidget,
    ListListItem,
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("lists", ["lists"]),
    suggestedLists() {
      if (this.user.student) {
        return this.lists.filter((list) => list.words.length > 0).slice(0, 3);
      } else {
        return this.lists.slice(0, 3);
      }
    },
  },
};
</script>
