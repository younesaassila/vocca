import firebase from "@/firebase";
import db from "@/db";
import router from "@/router";

const state = {
  user: {
    loggedIn: false,
    teacher: false,
    student: false,
    data: {},
  },
  error: null,
};

const mutations = {
  SET_USER(state, user) {
    if (user) {
      state.user = {
        loggedIn: true,
        teacher: user.role === "teacher",
        student: user.role === "student",
        data: user,
      };
    } else {
      state.user = {
        loggedIn: false,
        teacher: false,
        student: false,
        data: {},
      };
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
  /**
   * Registers a new user.
   * @param {{ commit: function; dispatch: function; }} context
   * @param {{ role: string; lastName: string; firstName: string; school: string; email: string; password: string; acceptedTOS: boolean; validCaptcha: boolean; }} payload
   */
  async register({ commit, dispatch }, payload) {
    //#region Error Handling

    if (!["student", "teacher"].includes(payload.role.toLowerCase())) {
      commit(
        "SET_ERROR",
        "Veuillez sélectionner un type de compte : élève ou enseignant."
      );
    }
    if (payload.lastName.replace(/\s+/g, "") === "") {
      commit("SET_ERROR", "Veuillez entrer votre nom.");
    }
    if (payload.firstName.replace(/\s+/g, "") === "") {
      commit("SET_ERROR", "Veuillez entrer votre prénom.");
    }
    if (payload.school.replace(/\s+/g, "") === "") {
      commit(
        "SET_ERROR",
        "Veuillez entrer le nom de votre établissement scolaire."
      );
    }
    // Email address is checked on the server side by Firebase.
    if (payload.password.length < 6) {
      commit(
        "SET_ERROR",
        "Votre mot de passe doit comporter un minimum de 6 caractères."
      );
    }
    if (!payload.acceptedTOS) {
      commit(
        "SET_ERROR",
        "Vous devez accepter les conditions générales d'utilisation pour pouvoir vous inscrire."
      );
    }
    if (!payload.validCaptcha) {
      return commit(
        "SET_ERROR",
        "Veuillez confirmer que vous n'êtes pas un robot en cochant la case à cocher au dessus du bouton « Inscription »."
      );
    }

    //#endregion

    const toTitleCase = (name) => {
      let newName = "";
      let parts = name.trim().toLowerCase().split("-");
      for (const part of parts) {
        newName += `${part.charAt(0).toUpperCase()}${part.substr(1)}-`;
      }
      newName = newName.substr(0, newName.length - 1);
      parts = newName.split(" ");
      newName = "";
      for (const part of parts) {
        newName += `${part.charAt(0).toUpperCase()}${part.substr(1)} `;
      }
      newName = newName.substr(0, newName.length - 1);
      return newName;
    };

    return firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then((data) => {
        db.collection("users")
          .doc(data.user.uid)
          .set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            firstName: toTitleCase(payload.firstName).trim(),
            id: data.user.uid,
            lastName: payload.lastName.trim().toUpperCase(),
            role: payload.role.toLowerCase(),
            school: payload.school,
          });
        dispatch("sendEmailVerification");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            return commit(
              "SET_ERROR",
              "Cette adresse e-mail est déjà utilisée."
            );

          case "auth/invalid-email":
            return commit("SET_ERROR", "Cette adresse e-mail est invalide.");

          case "auth/operation-not-allowed":
            return commit(
              "SET_ERROR",
              "Opération non autorisé. Merci de nous contacter si cette erreur persiste afin que nous puissions résoudre le problème."
            );

          case "auth/weak-password":
            return commit("SET_ERROR", "Votre mot de passe est trop faible.");

          default:
            return commit("SET_ERROR", error.message);
        }
      });
  },
  /**
   * Sends a verification email to the current user.
   */
  async sendEmailVerification({ commit }) {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Logs in the specified user.
   * @param {Object} user User object
   */
  async login({ commit }, user) {
    if (user.persistent) {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }

    return firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return commit("SET_ERROR", "Cette adresse e-mail est invalide.");

          case "auth/user-disabled":
            return commit("SET_ERROR", "Ce compte a été désactivé.");

          case "auth/user-not-found":
            return commit(
              "SET_ERROR",
              "Aucun compte utilisateur ne correspond à cette adresse e-mail."
            );

          case "auth/wrong-password":
            return commit("SET_ERROR", "Mot de passe incorrect.");

          default:
            return commit("SET_ERROR", error.message);
        }
      });
  },
  /**
   * Updates the user's name.
   * @param {*} payload Payload has to contain 'lastName' and 'firstName'
   */
  async updateName({ state, commit }, payload) {
    const { lastName, firstName } = payload;

    //#region Error Handling

    if (
      lastName.trim() === state.user.data.lastName &&
      firstName.trim() === state.user.data.firstName
    ) {
      return commit(
        "SET_ERROR",
        "Veuillez entrer un nom différent de votre nom actuel."
      );
    }
    if (lastName.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre nom.");
    }
    if (firstName.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre prénom.");
    }

    //#endregion

    return db
      .collection("users")
      .doc(state.user.data.id)
      .update({
        lastName: lastName.trim(),
        firstName: firstName.trim(),
      })
      .then(() => {
        commit("SET_USER", {
          ...state.user.data,
          lastName: lastName.trim(),
          firstName: firstName.trim(),
        });
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Sends a verification email to the user's new email address.
   * @param {*} newEmail New email address
   */
  async verifyBeforeUpdateEmail({ state, commit }, newEmail) {
    if (newEmail.trim() === state.user.data.email) {
      return commit(
        "SET_ERROR",
        "Veuillez choisir une adresse e-mail différente de votre adresse e-mail actuelle."
      );
    }

    return firebase
      .auth()
      .currentUser.verifyBeforeUpdateEmail(newEmail)
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Updates the user's password.
   * @param {*} payload Payload has to contain 'currentPassword' and 'newPassword'
   */
  async updatePassword({ commit }, payload) {
    const { currentPassword, newPassword } = payload;
    const user = firebase.auth().currentUser;

    if (newPassword.replace(/\s+/g, "") === "") {
      return commit("SET_ERROR", "Veuillez entrer votre nouveau mot de passe.");
    }

    // Check if current password is correct.
    const credential = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser.email,
      currentPassword
    );

    return user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // Set new password.
        user
          .updatePassword(newPassword)
          .then(() => {
            return commit("SET_ERROR", null);
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/weak-password":
                return commit(
                  "SET_ERROR",
                  "Votre nouveau mot de passe est trop faible."
                );

              case "auth/requires-recent-login":
                return commit(
                  "SET_ERROR",
                  "Vous êtes connecté depuis trop longtemps pour pouvoir effectuer cette action. Veuillez vous déconnecter puis vous reconnecter."
                );

              default:
                return commit("SET_ERROR", error.message);
            }
          });
      })
      .catch(() => {
        return commit("SET_ERROR", "Votre mot de passe actuel est incorrect.");
      });
  },
  /**
   * Sends a password reset email.
   */
  async sendPasswordResetEmail({ commit }, email) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return commit("SET_ERROR", "Cette adresse e-mail est invalide.");

          case "auth/user-not-found":
            return commit(
              "SET_ERROR",
              "Aucun compte utilisateur ne correspond à cette adresse e-mail."
            );

          default:
            return commit("SET_ERROR", error.message);
        }
      });
  },
  /**
   * Logs out the current user.
   */
  async logout({ commit }) {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        commit("SET_ERROR", null);
        router.push("/").catch(() => {});
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
