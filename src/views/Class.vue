<template>
  <Page
    #default="{}"
    :loading="voccaClass !== null && !voccaClass.teacher"
    :not-found="
      voccaClass === null ||
      !user.teacher ||
      user.data.uid !== voccaClass.teacher
    "
  >
    <h1 class="mb-2">{{ voccaClass.name }}</h1>

    <b-alert v-if="error" variant="danger" show>
      {{ error }}
    </b-alert>

    <b-container class="p-2 mw-100">
      <b-row class="d-flex flex-column flex-lg-row">
        <b-col class="m-2 p-0">
          <ClassDetailsCard
            class="h-100"
            :teacher-last-name="user.data.lastName"
            :teacher-first-name="user.data.firstName"
            :vocca-class="voccaClass"
          />
        </b-col>

        <b-col class="m-2 p-0">
          <ClassSettingsCard class="h-100" :vocca-class="voccaClass" />
        </b-col>
      </b-row>

      <b-row class="d-flex flex-column flex-lg-row">
        <b-col class="m-2 p-0">
          <ClassStudentListCard :vocca-class="voccaClass" />
        </b-col>

        <b-col class="m-2 p-0">
          <ClassListListCard :vocca-class="voccaClass" />
        </b-col>
      </b-row>
    </b-container>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import ClassDetailsCard from "@/components/cards/ClassDetailsCard.vue";
import ClassSettingsCard from "@/components/cards/ClassSettingsCard.vue";
import ClassStudentListCard from "@/components/cards/ClassStudentListCard.vue";
import ClassListListCard from "@/components/cards/ClassListListCard.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "Class",
  components: {
    Page,
    ClassDetailsCard,
    ClassSettingsCard,
    ClassStudentListCard,
    ClassListListCard,
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("voccaClass", ["voccaClass", "error"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.initVoccaClass(this.$route.params.id).then(() => {
          document.title = `${this.voccaClass.name} – Vocca`;
        });
      },
    },
  },
  methods: mapActions("voccaClass", ["initVoccaClass"]),
};
</script>
