import { firestoreAction } from "vuexfire";
import db from "@/db";

const state = {
  list: {},
  error: null,
};

const mutations = {
  SET_LIST(state, list) {
    if (list) {
      state.list = list;
    } else {
      state.list = {};
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
  initList: firestoreAction(({ bindFirestoreRef }, listId) => {
    return bindFirestoreRef("list", db.collection("lists").doc(listId));
  }),
  async setListWords({ commit }, words) {
    if (!state.list.id) return;

    const listDocRef = db.collection("lists").doc(state.list.id);

    return db
      .runTransaction((transaction) => {
        return transaction.get(listDocRef).then((listDoc) => {
          //#region Error Handling

          if (!listDoc.exists) {
            commit("SET_ERROR", "Cette liste est introuvable.");
          }

          //#endregion

          transaction.update(listDocRef, {
            words: words,
          });

          commit("SET_ERROR", null);
        });
      })
      .catch((error) => {
        commit("SET_ERROR", error);
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
