<template>
  <div id="app">
    <Navbar class="sticky-top" />
    <router-view />
    <AnalyticsConsentBanner />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import AnalyticsConsentBanner from "@/components/AnalyticsConsentBanner.vue";
import { mapState } from "vuex";

export default {
  components: {
    Navbar,
    AnalyticsConsentBanner,
  },
  computed: mapState("auth", ["user"]),
};
</script>

<style lang="scss">
html,
#app {
  background-color: var(--light);
  font-family: "Mulish", sans-serif;
}
</style>
