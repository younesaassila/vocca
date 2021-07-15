import firebase from "@/firebase";
import db from "@/db";

const state = {
  error: null,
};

const mutations = {
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
  async sendEmail({ commit }, email) {
    //#region Error Handling

    if (email.name.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre nom.");
    }
    if (email.email.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre adresse e-mail.");
    }
    if (email.subject.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer un sujet.");
    }
    if (email.message.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre message.");
    }
    if (!email.validCaptcha) {
      return commit(
        "SET_ERROR",
        "Veuillez confirmer que vous n'êtes pas un robot en cochant la case à cocher au dessus du bouton « Envoyer »."
      );
    }

    //#endregion

    return db
      .collection("emails")
      .add({
        sentAt: firebase.firestore.FieldValue.serverTimestamp(),
        name: email.name,
        email: email.email,
        subject: email.subject,
        message: email.message,
      })
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
  mutations,
  actions,
};
