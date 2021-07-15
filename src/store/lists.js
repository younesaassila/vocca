import { firestoreAction } from "vuexfire";
import firebase from "@/firebase";
import db from "@/db";

const lists = db.collection("lists");

const state = {
  lists: [],
  error: null,
};

const getters = {
  getListById: (state) => (listId) => {
    return state.lists.find((list) => list.id === listId);
  },
  languageName: () => (iso) => {
    switch (iso) {
      case "fr":
        return "Français";

      case "de":
        return "Allemand";

      case "en":
        return "Anglais";

      case "es":
        return "Espagnol";

      case "la":
        return "Latin";

      default:
        return "";
    }
  },
};

const mutations = {
  SET_LISTS(state, lists) {
    if (lists) {
      state.lists = lists;
    } else {
      state.lists = [];
    }
  },
  SET_ERROR(state, error) {
    if (error) {
      state.error = error;
      throw error;
    } else {
      state.error = null;
    }
  },
};

const actions = {
  initTeacherLists: firestoreAction(({ bindFirestoreRef, commit }, user) => {
    if (!user.data.id) {
      return commit("SET_LISTS", null);
    }

    return bindFirestoreRef(
      "lists",
      lists.where("author", "==", user.data.id).orderBy("createdAt", "desc")
    );
  }),
  initStudentLists: firestoreAction(({ bindFirestoreRef, commit }, classes) => {
    let listsIDs = [];

    for (const voccaClass of classes) {
      listsIDs.push(...voccaClass.lists);
    }

    if (listsIDs.length <= 0) {
      return commit("SET_LISTS", null);
    }

    return bindFirestoreRef(
      "lists",
      lists.where("id", "in", listsIDs).orderBy("createdAt", "desc")
    );
  }),
  /**
   * Creates a list.
   * @param {Object} payload Payload has to contain 'list' and 'userId'
   */
  async createList({ commit }, payload) {
    const { list, userId } = payload;

    //#region Error Handling

    if (list.name.replace(/\s+/g, "") === "") {
      commit("SET_ERROR", "Veuillez nommer la liste.");
    }
    if (list.firstLanguage === null) {
      commit(
        "SET_ERROR",
        "Veuillez sélectionner une langue en tant que langue n°1."
      );
    }
    if (list.secondLanguage === null) {
      commit(
        "SET_ERROR",
        "Veuillez sélectionner une langue en tant que langue n°2."
      );
    }
    if (list.firstLanguage === list.secondLanguage) {
      commit("SET_ERROR", "Veuillez sélectionner deux langues différentes.");
    }

    //#endregion

    return lists
      .add({
        author: userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        firstLanguage: list.firstLanguage,
        name: list.name,
        secondLanguage: list.secondLanguage,
        words: [],
      })
      .then((docRef) => {
        lists
          .doc(docRef.id)
          .update({
            id: docRef.id,
          })
          .then(() => {
            commit("SET_ERROR", null);
          });
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Renames the specified list.
   * @param {Object} payload Payload has to contain 'listId' and 'newName'
   */
  async renameList({ commit }, payload) {
    const { listId, newName } = payload;

    // Keep current name if new name is empty.
    if (newName.replace(/\s+/g, "") === "") {
      return;
    }

    return lists
      .doc(listId)
      .update({
        name: newName,
      })
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  async deleteList({ commit }, listId) {
    return lists
      .doc(listId)
      .delete()
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
