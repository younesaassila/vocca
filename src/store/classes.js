import { firestoreAction } from "vuexfire";
import firebase from "@/firebase";
import db from "@/db";

const classes = db.collection("classes");

const state = {
  classes: [],
  error: null,
};

const mutations = {
  SET_CLASSES(state, classes) {
    if (classes) {
      state.classes = classes;
    } else {
      state.classes = [];
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

const isExistingClass = async (classId) => {
  return classes
    .doc(classId)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        return true;
      } else {
        return false;
      }
    });
};

const actions = {
  /**
   * Binds the classes array to the classes the user has created or joined.
   * @param {Object} user Current user
   */
  initClasses: firestoreAction(({ bindFirestoreRef, commit }, user) => {
    if (!user.data.id) {
      return commit("SET_CLASSES", null);
    }

    if (user.teacher) {
      return bindFirestoreRef(
        "classes",
        classes
          .where("teacher", "==", user.data.id)
          .orderBy("createdAt", "desc")
      );
    }

    if (user.student) {
      return bindFirestoreRef(
        "classes",
        classes
          .where("students", "array-contains", user.data.id)
          .orderBy("name")
      );
    }

    return commit("SET_CLASSES", null);
  }),
  /**
   * Creates a class and assigns it an ID.
   * @param {Object} payload Payload has to contain 'classObj' and 'userId'
   */
  async createClass({ commit }, payload) {
    const { classObj, userId } = payload;

    //#region Error Handling

    if (classObj.name.replace(/\s+/g, "") === "") {
      commit("SET_ERROR", "Veuillez entrer un nom de classe.");
    }
    if (classObj.slots < 1) {
      commit(
        "SET_ERROR",
        "Veuillez entrer un nombre d'élèves supérieur ou égal à 1."
      );
    }
    if (classObj.slots > 50) {
      commit(
        "SET_ERROR",
        "Vous ne pouvez pas créer de classe avec plus de 50 élèves."
      );
    }

    //#endregion

    const generateRandomId = () => {
      const numbers = "0123456789";
      const idLength = 5;
      let id = "";
      for (let i = 0; i < idLength; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      return id;
    };

    let classId = "";
    do {
      classId = generateRandomId();
    } while (await isExistingClass(classId));

    return classes
      .doc(classId)
      .set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        id: classId,
        lists: [],
        name: classObj.name.trim(),
        slots: parseInt(classObj.slots),
        status: "public",
        students: [],
        teacher: userId,
      })
      .then(() => {
        commit("SET_ERROR", null);
      })
      .catch((error) => {
        commit("SET_ERROR", error.message);
      });
  },
  /**
   * Makes a user join the specified class.
   * @param {Object} payload Payload has to contain 'classId' and 'userId'
   */
  async joinClass({ commit }, payload) {
    const { classId, userId } = payload;
    const classDocRef = classes.doc(classId);

    return db
      .runTransaction((transaction) => {
        return transaction.get(classDocRef).then((classDoc) => {
          //#region Error Handling

          if (!classDoc.exists) {
            commit("SET_ERROR", "Cette classe est introuvable.");
          }
          if (classDoc.data().status !== "public") {
            commit("SET_ERROR", "Vous ne pouvez pas rejoindre cette classe.");
          }
          if (classDoc.data().students.includes(userId)) {
            commit("SET_ERROR", "Vous avez déjà rejoint cette classe !");
          }
          if (classDoc.data().students.length + 1 > classDoc.data().slots) {
            commit("SET_ERROR", "Cette classe est pleine.");
          }

          //#endregion

          transaction.update(classDocRef, {
            students: firebase.firestore.FieldValue.arrayUnion(userId),
          });

          commit("SET_ERROR", null);
        });
      })
      .catch((error) => {
        commit("SET_ERROR", error);
      });
  },
  /**
   * Adds the specified list to the specified class.
   * @param {Object} payload Payload has to contain 'classId' and 'listId'
   */
  async addList({ commit }, payload) {
    const { classId, listId } = payload;
    const classDocRef = classes.doc(classId);

    return db
      .runTransaction((transaction) => {
        return transaction.get(classDocRef).then((classDoc) => {
          //#region Error Handling

          if (!classDoc.exists) {
            commit("SET_ERROR", "Cette classe est introuvable.");
          }
          if (classDoc.data().lists.includes(listId)) {
            return;
          }

          //#endregion

          transaction.update(classDocRef, {
            lists: firebase.firestore.FieldValue.arrayUnion(listId),
          });

          commit("SET_ERROR", null);
        });
      })
      .catch((error) => {
        commit("SET_ERROR", error);
      });
  },
  /**
   * Removes the specified list from the specified class.
   * @param {Object} payload Payload has to contain 'classId' and 'listId'
   */
  async removeList({ commit }, payload) {
    const { classId, listId } = payload;
    const classDocRef = classes.doc(classId);

    return db
      .runTransaction((transaction) => {
        return transaction.get(classDocRef).then((classDoc) => {
          //#region Error Handling

          if (!classDoc.exists) {
            commit("SET_ERROR", "Cette classe est introuvable.");
          }
          if (!classDoc.data().lists.includes(listId)) {
            return;
          }

          //#endregion

          transaction.update(classDocRef, {
            lists: firebase.firestore.FieldValue.arrayRemove(listId),
          });

          commit("SET_ERROR", null);
        });
      })
      .catch((error) => {
        commit("SET_ERROR", error);
      });
  },
  /**
   * Deletes the specified class.
   * @param {Object} classId ID of the class
   */
  async deleteClass({ commit }, classId) {
    return classes
      .doc(classId)
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
  mutations,
  actions,
};
