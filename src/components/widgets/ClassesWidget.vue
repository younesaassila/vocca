<template>
  <BaseWidget title="Mes classes">
    <div v-if="recentClasses.length > 0">
      <b-list-group flush>
        <ClassListItem
          v-for="voccaClass in recentClasses"
          :key="voccaClass.id"
          :vocca-class="voccaClass"
        />

        <b-list-group-item
          v-if="recentClasses.length < classes.length"
          class="text-center"
        >
          <p class="m-2">
            <b-link to="/classes"> Afficher toutes mes classes </b-link>
          </p>
        </b-list-group-item>
      </b-list-group>
    </div>

    <div v-else class="text-center">
      <p v-if="user.student" class="m-4">
        Aucune classe rejointe. Pour rejoindre une classe, rendez-vous sur la
        page «
        <b-link to="/classes">Mes classes</b-link> ».
      </p>

      <p v-else-if="user.teacher" class="m-4">
        Aucune classe créée. Pour créer une classe, rendez-vous sur la page «
        <b-link to="/classes">Mes classes</b-link> ».
      </p>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from "@/components/widgets/BaseWidget.vue";
import ClassListItem from "@/components/list_items/ClassListItem.vue";
import { mapState } from "vuex";

export default {
  name: "ClassesWidget",
  components: {
    BaseWidget,
    ClassListItem,
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("classes", ["classes"]),
    recentClasses() {
      return this.classes.slice(0, 3);
    },
  },
};
</script>
