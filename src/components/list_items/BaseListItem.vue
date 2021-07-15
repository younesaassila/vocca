<template>
  <b-list-group-item class="list-item">
    <div class="ctr left-ctr">
      <h5 class="title">{{ title }}</h5>

      <p class="desc" :style="descriptionStyle">
        <slot name="description"></slot>
      </p>
    </div>

    <div class="ctr right-ctr">
      <slot name="action-bar"></slot>
    </div>
  </b-list-group-item>
</template>

<script>
export default {
  name: "BaseListItem",
  props: {
    title: {
      type: String,
      default: "",
    },
    descriptionVariant: {
      type: String,
      default: "secondary",
    },
  },
  computed: {
    descriptionStyle() {
      return `color: var(--${this.descriptionVariant});`;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  align-items: center;
  animation: showItem 400ms ease-out;
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
}

.ctr {
  .title {
    margin: 0 0 0 0;
  }

  .desc {
    margin: 0.5rem 0 0 0;
  }
}

.left-ctr {
  text-align: left;
}

.right-ctr {
  text-align: right;
}

@media (max-width: 992px) {
  .list-item {
    flex-direction: column;
  }

  .left-ctr {
    width: 100%;
  }

  .right-ctr {
    margin-top: 1rem;
    text-align: center;
  }
}

// Note: Little delay to account for the teacher's name loading time.
@keyframes showItem {
  0% {
    opacity: 0;
    transform: scale(0.95, 0.95);
  }
  25% {
    opacity: 0;
    transform: scale(0.95, 0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}
</style>
