<template>
  <Page #default="{}" :loading="loadingUser">
    <Dashboard v-if="user.loggedIn" />
    <Welcome v-else />
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import Dashboard from "@/components/Dashboard.vue";
import Welcome from "@/components/Welcome.vue";
import firebase from "@/firebase";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    Page,
    Dashboard,
    Welcome,
  },
  computed: {
    ...mapState("auth", ["user"]),
    loadingUser() {
      return firebase.auth().currentUser && !this.user.data.id;
    },
  },
};
</script>
