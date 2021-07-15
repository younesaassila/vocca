<template>
  <Page #default="{}">
    <h1>Mes listes de vocabulaire</h1>

    <b-button-toolbar key-nav class="mt-4 mb-2">
      <b-button-group>
        <b-button v-if="user.teacher" v-b-modal.create-list-modal class="mr-2">
          <b-icon icon="plus" /> Nouvelle liste
        </b-button>

        <b-dropdown id="sort-dropdown" class="mr-2">
          <template v-slot:button-content>
            <b-icon icon="funnel" />
            Trier
          </template>

          <b-dropdown-form>
            <b-form-group>
              <b-form-text>Professeurs</b-form-text>

              <b-form-checkbox
                v-for="author in authors"
                :key="author"
                v-model="filter.authors"
                :value="author"
              >
                {{
                  getUserById(author)
                    ? getUserById(author).lastName
                    : "Chargement..."
                }}
              </b-form-checkbox>
            </b-form-group>

            <b-form-group>
              <b-form-text>Langues</b-form-text>

              <b-form-checkbox
                v-for="language in languages"
                :key="language"
                v-model="filter.languages"
                :value="language"
              >
                {{ languageName(language) }}
              </b-form-checkbox>
            </b-form-group>

            <b-form-group>
              <b-form-text>Mots</b-form-text>

              <b-form-checkbox v-model="filter.words" value="1+">
                1 et plus
              </b-form-checkbox>

              <b-form-checkbox v-model="filter.words" value="0">
                0
              </b-form-checkbox>
            </b-form-group>
          </b-dropdown-form>
        </b-dropdown>
      </b-button-group>
    </b-button-toolbar>

    <b-list-group v-if="filteredLists.length > 0">
      <ListListItem v-for="list in filteredLists" :key="list.id" :list="list" />
    </b-list-group>

    <div v-else class="text-center">
      <h5>Aucune liste de vocabulaire.</h5>
    </div>

    <CreateListModal id="create-list-modal" :user-id="user.data.id" />
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import ListListItem from "@/components/list_items/ListListItem.vue";
import CreateListModal from "@/components/modals/CreateListModal.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Lists",
  components: {
    Page,
    ListListItem,
    CreateListModal,
  },
  data() {
    return {
      authors: [],
      filter: {
        authors: [],
        languages: [],
        words: ["0", "1+"],
      },
      languages: [],
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("lists", ["lists"]),
    ...mapGetters("lists", ["languageName"]),
    ...mapGetters("users", ["getUserById"]),
    filteredLists() {
      return this.lists.filter((list) => {
        return (
          this.filter.authors.includes(list.author) &&
          this.filter.languages.includes(list.firstLanguage) &&
          this.filter.languages.includes(list.secondLanguage) &&
          (list.words.length > 1
            ? this.filter.words.includes("1+")
            : this.filter.words.includes("0"))
        );
      });
    },
  },
  watch: {
    lists: {
      immediate: true,
      handler() {
        this.authors = [];
        this.filter = {
          authors: [],
          languages: [],
          words: ["0", "1+"],
        };
        this.languages = [];

        for (const list of this.lists) {
          if (!this.filter.authors.includes(list.author)) {
            this.authors.push(list.author);
            this.filter.authors.push(list.author);
          }
          if (!this.filter.languages.includes(list.firstLanguage)) {
            this.languages.push(list.firstLanguage);
            this.filter.languages.push(list.firstLanguage);
          }
          if (!this.filter.languages.includes(list.secondLanguage)) {
            this.languages.push(list.secondLanguage);
            this.filter.languages.push(list.secondLanguage);
          }
        }
      },
    },
  },
};
</script>
