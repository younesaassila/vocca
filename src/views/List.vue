<template>
  <Page
    #default="{}"
    :loading="list !== null && !list.id"
    :not-found="list === null || !lists.find((obj) => obj.id === list.id)"
  >
    <h1 class="mb-4">{{ list.name }}</h1>

    <div v-if="list.words.length > 0">
      <b-row
        v-for="(word, index) in list.words"
        :key="`word-${index}`"
        class="my-2"
      >
        <b-col class="text-right" style="word-wrap: break-word">
          <h5>
            {{ word[list.firstLanguage].join(",") }}
          </h5>
        </b-col>

        <b-col class="text-left" style="word-wrap: break-word">
          <h5 style="color: var(--secondary)">
            {{ word[list.secondLanguage].join(",") }}
          </h5>
        </b-col>
      </b-row>
    </div>

    <div v-else class="text-center">
      <h5>Cette liste est vide.</h5>
    </div>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "List",
  components: {
    Page,
  },
  computed: {
    ...mapState("list", ["list"]),
    ...mapState("lists", ["lists"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.initList(this.$route.params.id).then(() => {
          document.title = `${this.list.name} – Vocca`;
        });
      },
    },
  },
  methods: mapActions("list", ["initList"]),
};
</script>
