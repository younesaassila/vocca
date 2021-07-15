<template>
  <Page #default="{}">
    <h1>Mes classes</h1>

    <b-button-toolbar key-nav class="mt-4 mb-2">
      <b-button-group v-if="user.teacher">
        <b-button v-b-modal.create-class-modal class="mr-2">
          <b-icon icon="plus" /> Nouvelle classe
        </b-button>
      </b-button-group>

      <b-button-group v-else-if="user.student">
        <b-button v-b-modal.join-class-modal class="mr-2">
          <b-icon icon="person-plus" /> Rejoindre une classe
        </b-button>
      </b-button-group>
    </b-button-toolbar>

    <b-list-group v-if="classes.length > 0">
      <ClassListItem
        v-for="voccaClass in classes"
        :key="voccaClass.id"
        class="class-list-item"
        :vocca-class="voccaClass"
      ></ClassListItem>
    </b-list-group>

    <div v-else class="text-center">
      <h5>Aucune classe.</h5>
    </div>

    <CreateClassModal
      id="create-class-modal"
      :user-id="user.data.uid"
    ></CreateClassModal>

    <JoinClassModal
      id="join-class-modal"
      :user-id="user.data.uid"
    ></JoinClassModal>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import ClassListItem from "@/components/list_items/ClassListItem.vue";
import CreateClassModal from "@/components/modals/CreateClassModal.vue";
import JoinClassModal from "@/components/modals/JoinClassModal.vue";
import { mapState } from "vuex";

export default {
  name: "Classes",
  components: {
    Page,
    ClassListItem,
    CreateClassModal,
    JoinClassModal,
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("classes", ["classes"]),
  },
};
</script>
