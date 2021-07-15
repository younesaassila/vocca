<template>
  <Page #default="{}" class="text-justify">
    <h1 class="mb-4 text-left">À propos de Vocca</h1>

    <p>
      Vocca est un site web éducatif ayant pour but de proposer une solution
      ludique aux élèves afin d'apprendre et réviser le vocabulaire vu en cours
      de langue. Grâce à celui-ci, l'élève dispose d'une interface simple lui
      permettant de consulter tous les mots compilés par son professeur et de
      s'entraîner afin de tester ses connaissances.
    </p>

    <p>
      Le vocabulaire constitue une part primordiale dans l'apprentissage d'une
      langue ; c'est pourquoi nous avons souhaité en faciliter son apprentissage
      via l'intermédiaire de ce site internet.
    </p>

    <p>
      Vocca fait suite à un précédent projet intitulé «
      <a href="https://vokabeln.aassila.com/">Vokabeln!</a> » en y ajoutant un
      système de gestion de comptes et de classes.
    </p>

    <p class="mt-4 mb-2">
      <span class="font-weight-bold">Liens utiles :</span>
    </p>

    <ul>
      <li><b-link to="/contact">Formulaire de contact</b-link></li>
      <li><b-link to="/tos">Conditions générales d'utilisation</b-link></li>
    </ul>
  </Page>
</template>

<script>
import Page from "@/components/Page.vue";

export default {
  name: "About",
  components: {
    Page,
  },
};
</script>
