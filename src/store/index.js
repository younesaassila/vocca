import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreOptions } from "vuexfire";

import auth from "./auth";
import classes from "./classes";
import contact from "./contact";
import list from "./list";
import lists from "./lists";
import users from "./users";
import voccaClass from "./voccaClass";

Vue.use(Vuex);

firestoreOptions.wait = true;

const store = new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    auth,
    classes,
    contact,
    list,
    lists,
    users,
    voccaClass,
  },
});

store.watch(
  (state) => state.auth.user,
  async (user) => {
    await store.dispatch("classes/initClasses", user);

    if (user.teacher) store.dispatch("lists/initTeacherLists", user);
  }
);

store.watch(
  (state) => state.classes.classes,
  (classes) => {
    const user = store.state.auth.user;

    let users = [];
    if (user.data.id) {
      users.push(user.data.id);
    }
    for (const voccaClass of classes) {
      users.push(voccaClass.teacher);
      users.push(...voccaClass.students);
    }

    store.dispatch("users/initUsers", users);
  }
);

store.watch(
  (state) => state.classes.classes.length,
  () => {
    const user = store.state.auth.user;
    const classes = store.state.classes.classes;

    if (user.teacher) return;

    store.dispatch("lists/initStudentLists", classes);
  }
);

export default store;
