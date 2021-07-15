<template>
  <b-card no-body>
    <b-card-header> Élèves – {{ voccaClass.students.length }} </b-card-header>

    <b-list-group v-if="sortedStudents.length > 0" flush>
      <b-list-group-item
        v-for="student in sortedStudents"
        :key="student.id"
        class="d-flex justify-content-between align-items-center"
      >
        {{ student.lastName }} {{ student.firstName }}
        <b-button variant="danger" @click="onRemoveStudent(student)">
          Retirer
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <b-card-text v-else class="m-4">
      Aucun élève dans cette classe.
    </b-card-text>
  </b-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "ClassStudentListCard",
  props: {
    voccaClass: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState("users", ["users"]),
    ...mapGetters("users", ["getUserById"]),
    sortedStudents() {
      let sortedStudents = [];

      for (const studentId of this.voccaClass.students) {
        const studentObj = this.getUserById(studentId);
        if (studentObj) {
          sortedStudents.push(studentObj);
        }
      }

      sortedStudents.sort((a, b) => {
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return -1;
        return 0;
      });

      return sortedStudents;
    },
  },
  methods: {
    ...mapActions("voccaClass", ["removeStudent"]),
    onRemoveStudent(studentObj) {
      this.$bvModal
        .msgBoxConfirm(
          `Retirer « ${studentObj.lastName} ${studentObj.firstName} » de la classe « ${this.voccaClass.name} » l'empêchera d'accéder aux listes de vocabulaire partagées au sein de cette même classe.`,
          {
            title: "Êtes-vous sûr ?",
            okVariant: "danger",
            okTitle: "Retirer l'élève",
            cancelTitle: "Annuler",
            centered: true,
          }
        )
        .then((confirmed) => {
          if (confirmed) {
            this.removeStudent(studentObj.id);
          }
        })
        .catch(() => {});
    },
  },
};
</script>
