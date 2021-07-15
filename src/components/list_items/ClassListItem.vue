<template>
  <BaseListItem :title="voccaClass.name">
    <template v-slot:description>
      <span class="tag">
        <b-icon icon="person-fill" />
        {{
          getUserById(voccaClass.teacher)
            ? getUserById(voccaClass.teacher).lastName
            : "Chargement..."
        }}
      </span>

      <span v-if="user.teacher" class="tag">
        <b-icon icon="people-fill" />
        {{ voccaClass.students.length }} / {{ voccaClass.slots }}
        {{ voccaClass.slots > 1 ? "élèves" : "élève" }}
      </span>

      <span v-else class="tag">
        <b-icon icon="people-fill" />
        {{ voccaClass.students.length }}
        {{ voccaClass.students.length > 1 ? "élèves" : "élève" }}
      </span>

      <span class="tag">
        <b-icon icon="list-ul" />
        {{ voccaClass.lists.length }}
        {{ voccaClass.lists.length > 1 ? "listes" : "liste" }}
      </span>

      <span v-if="user.teacher" class="tag">
        <b-icon icon="hash" />
        Code de connexion : {{ voccaClass.id }}
      </span>
    </template>

    <template v-slot:action-bar class="buttons">
      <b-button
        v-if="user.teacher"
        :to="{ name: 'Class', params: { id: voccaClass.id } }"
        variant="primary"
      >
        Gérer
      </b-button>
    </template>
  </BaseListItem>
</template>

<script>
import BaseListItem from "@/components/list_items/BaseListItem.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "ClassListItem",
  components: {
    BaseListItem,
  },
  props: {
    voccaClass: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapGetters("users", ["getUserById"]),
  },
};
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 1rem;
}
</style>
