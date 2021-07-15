<template>
  <b-card header="Informations">
    <p>
      Professeur de la classe : {{ teacherLastName }} {{ teacherFirstName }}
    </p>
    <hr />
    <p>Nombre d'élèves : {{ voccaClass.students.length }}</p>
    <hr />
    <p>Nombre maximal d'élèves : {{ voccaClass.slots }}</p>
    <hr />
    <p>Listes de vocabulaire partagées : {{ voccaClass.lists.length }}</p>
    <hr />
    <p>
      Code de connexion : {{ voccaClass.id }}
      <b-icon
        v-b-popover.hover.top="
          'Code à transmettre à vos élèves afin qu\'ils puissent rejoindre la classe'
        "
        icon="question-circle"
        variant="secondary"
      />
    </p>
    <b-button variant="outline-primary" @click="onCopyToClipboard()">
      <b-icon icon="clipboard" />
      Copier le code de connexion
    </b-button>
  </b-card>
</template>

<script>
export default {
  name: "ClassDetailsCard",
  props: {
    teacherLastName: {
      type: String,
      default: "",
    },
    teacherFirstName: {
      type: String,
      default: "",
    },
    voccaClass: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onCopyToClipboard() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.voccaClass.id);
      }
    },
  },
};
</script>
