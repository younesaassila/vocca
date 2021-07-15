import { firestoreAction } from "vuexfire";
import db from "@/db";

const users = db.collection("users");

const state = {
  users: [],
};

const getters = {
  getUserById: (state) => (userId) => {
    return state.users.find((user) => user.id === userId);
  },
};

const mutations = {
  SET_USERS(state, users) {
    if (users) {
      state.users = users;
    } else {
      state.users = [];
    }
  },
};

const actions = {
  initUsers: firestoreAction(({ bindFirestoreRef, commit }, userIDs) => {
    if (userIDs.length <= 0) {
      commit("SET_USERS", null);
      return;
    }

    return bindFirestoreRef("users", users.where("id", "in", userIDs));
  }),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
