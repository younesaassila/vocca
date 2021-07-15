<template>
  <div class="page">
    <div v-if="loading" class="text-center">
      <b-spinner
        variant="primary"
        label="Chargement"
        aria-label="Chargement"
      ></b-spinner>
    </div>

    <NotFound v-else-if="notFound" />

    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import NotFound from "@/views/NotFound.vue";

export default {
  name: "Page",
  components: {
    NotFound,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    notFound: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  margin: 2rem auto 2rem auto;
  width: 80%;
}
</style>
