import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "./firebase";
import db from "./db";
import "./app.scss";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueCookie from "vue-cookie";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueCookie);

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // Get all properties attached to the signed in user.
    // These may include role, firstName, lastName...
    await db
      .collection("users")
      .doc(user.uid)
      .get()
      .then(async (doc) => {
        const data = doc.data();
        // Append any existing property to the user object.
        for (const [key, value] of Object.entries(data)) {
          user[key] = value;
        }

        store.commit("auth/SET_USER", user);
      });
  } else {
    store.commit("auth/SET_USER", null);
  }

  // Create the Vue app once the auth state changed to avoid the signed out
  // delay when waiting for Firebase to authenticate the current user.
  // Note: This has to be positioned at the very end of the function to prevent
  // the UI from loading before the user signs in.
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
