<template>
  <b-card :header="title" no-body="">
    <slot></slot>
  </b-card>
</template>

<script>
export default {
  name: "BaseWidget",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
