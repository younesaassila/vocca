<template>
  <BaseListItem :title="list.name">
    <template v-slot:description>
      <span class="tag">
        <b-icon icon="person-fill" />
        {{
          getUserById(list.author)
            ? getUserById(list.author).lastName
            : "Chargement..."
        }}
      </span>

      <span class="tag">
        <b-icon icon="flag-fill" />
        {{ languageName(list.firstLanguage) }} ↔
        {{ languageName(list.secondLanguage) }}
      </span>

      <span class="tag">
        <b-icon icon="type" />
        {{ list.words.length }}
        {{ list.words.length > 1 ? "mots" : "mot" }}
      </span>

      <span v-if="user.teacher" class="tag" :style="shareTagStyle">
        <b-icon icon="link45deg" />
        {{
          shareCount === 0
            ? "Non partagée"
            : shareCount > 1
            ? `Partagée avec ${shareCount} classes`
            : `Partagée avec ${shareCount} classe`
        }}
      </span>
    </template>

    <template v-slot:action-bar>
      <div v-if="user.student && list.words.length > 0">
        <b-button
          class="my-2 mr-2"
          :to="{ name: 'List', params: { id: list.id } }"
          variant="primary"
        >
          Afficher
        </b-button>

        <b-button
          class="my-2 mr-2"
          :to="{ name: 'ListTraining', params: { id: list.id } }"
          variant="success"
        >
          S'entraîner
        </b-button>
      </div>

      <div v-else-if="user.teacher">
        <b-dropdown class="mt-2 mr-2 mb-2 ml-0" text="Gérer" variant="primary">
          <b-dropdown-item
            v-if="list.words.length > 0"
            class="mb-2"
            :to="{ name: 'List', params: { id: list.id } }"
          >
            <b-icon icon="eye" />
            Afficher
          </b-dropdown-item>

          <b-dropdown-item
            v-if="list.words.length > 0"
            class="mt-2"
            :to="{ name: 'ListTraining', params: { id: list.id } }"
          >
            <b-icon icon="play" />
            S'entraîner
          </b-dropdown-item>

          <hr v-if="list.words.length > 0" class="my-2" />

          <b-dropdown-item
            class="mb-2"
            :to="{ name: 'ListEditor', params: { id: list.id } }"
          >
            <b-icon icon="pencil" />
            Modifier
          </b-dropdown-item>

          <!-- <b-dropdown-item>
            <b-icon icon="bar-chart" />
            Statistiques
          </b-dropdown-item> -->

          <b-dropdown-item
            class="my-2"
            @click="$bvModal.show(`modal-rename-${list.id}`)"
          >
            <b-icon icon="cursor-text" />
            Renommer
          </b-dropdown-item>

          <b-dropdown-item
            class="mt-2"
            @click="$bvModal.show(`modal-delete-${list.id}`)"
          >
            <b-icon icon="trash" />
            Supprimer
          </b-dropdown-item>
        </b-dropdown>

        <b-button
          class="mt-2 mr-2 mb-2 ml-0"
          variant="success"
          @click="$bvModal.show(`modal-share-${list.id}`)"
        >
          Partager
        </b-button>
      </div>

      <ShareListModal :id="shareModalId" :list="list" />
      <RenameListModal :id="renameModalId" :list="list" />
      <DeleteListModal :id="deleteModalId" :list="list" />
    </template>
  </BaseListItem>
</template>

<script>
import BaseListItem from "@/components/list_items/BaseListItem.vue";
import ShareListModal from "@/components/modals/ShareListModal.vue";
import RenameListModal from "@/components/modals/RenameListModal.vue";
import DeleteListModal from "@/components/modals/DeleteListModal.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "ListListItem",
  components: {
    BaseListItem,
    ShareListModal,
    RenameListModal,
    DeleteListModal,
  },
  props: {
    list: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("classes", ["classes"]),
    ...mapGetters("lists", ["languageName"]),
    ...mapGetters("users", ["getUserById"]),
    shareModalId() {
      return `modal-share-${this.list.id}`;
    },
    renameModalId() {
      return `modal-rename-${this.list.id}`;
    },
    deleteModalId() {
      return `modal-delete-${this.list.id}`;
    },
    shareCount() {
      let count = 0;
      for (const voccaClass of this.classes) {
        if (voccaClass.lists.includes(this.list.id)) count++;
      }
      return count;
    },
    shareTagStyle() {
      return this.shareCount === 0
        ? "color: var(--danger);"
        : "color: var(--success);";
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 1rem;
}
</style>
