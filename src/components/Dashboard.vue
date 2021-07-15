<template>
  <div>
    <h1 class="mb-4">Bonjour, {{ user.data.firstName }} !</h1>
    <ListsWidget class="mb-4" />
    <ClassesWidget />
  </div>
</template>

<script>
import ListsWidget from "@/components/widgets/ListsWidget.vue";
import ClassesWidget from "@/components/widgets/ClassesWidget.vue";
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  components: {
    ListsWidget,
    ClassesWidget,
  },
  computed: mapState("auth", ["user"]),
};
</script>
