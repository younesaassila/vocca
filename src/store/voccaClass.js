import { firestoreAction } from "vuexfire";
import firebase from "@/firebase";
import db from "@/db";

const state = {
  voccaClass: {},
  lists: [],
  error: null,
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
  /**
   * Binds the class object to the specified class ID.
   * @param {String} classId ID of the class
   */
  initVoccaClass: firestoreAction(({ bindFirestoreRef }, classId) => {
    return bindFirestoreRef(
      "voccaClass",
      db.collection("classes").doc(classId)
    );
  }),
  /**
   * Sets the lists state from the given array of lists IDs.
   * @param {Array} classLists Array of IDs corresponding to a class' lists.
   */
  initLists({ commit }, classLists) {
    if (classLists.length <= 0) {
      return commit("SET_LISTS", null);
    }
    // Get the data for all given lists.
    db.collection("lists")
      .where("id", "in", classLists)
      .get()
      .then((querySnapshot) => {
        let lists = [];
        // Get the data of each student.
        querySnapshot.forEach((doc) => {
          lists.push(doc.data());
        });
        // Sort lists alphabetically.
        lists.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        commit("SET_LISTS", lists);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Updates the specified class' status.
   * @param {*} payload Payload has to contain 'status' and 'classObj'
   */
  async updateClassStatus({ commit }, payload) {
    //#region Error Handling

    if (!["public", "private"].includes(payload.status)) {
      commit("SET_ERROR", "Veuillez spécifier un statut de classe valide.");
    }

    //#endregion

    return db
      .collection("classes")
      .doc(payload.classObj.id)
      .update({
        status: payload.status,
      })
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Removes the specified student from the class.
   * @param {Object} studentId ID of the student to remove
   */
  async removeStudent({ commit, state }, studentId) {
    if (!state.voccaClass.id) return;

    const classDocRef = db.collection("classes").doc(state.voccaClass.id);

    return db
      .runTransaction((transaction) => {
        return transaction.get(classDocRef).then((classDoc) => {
          //#region Error Handling

          if (!classDoc.exists) {
            commit("SET_ERROR", "Cette classe est introuvable.");
          }
          if (!classDoc.data().students.includes(studentId)) {
            commit("SET_ERROR", "Cet élève est introuvable.");
          }

          //#endregion

          transaction.update(classDocRef, {
            students: firebase.firestore.FieldValue.arrayRemove(studentId),
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
