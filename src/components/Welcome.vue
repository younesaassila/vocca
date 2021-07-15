<template>
  <div>
    <b-jumbotron
      header="Bienvenue sur Vocca !"
      lead="L'outil idéal pour apprendre et réviser le vocabulaire vu en classe."
      style="word-wrap: break-word"
    >
      <b-button class="mt-4 mr-2" to="/register" variant="primary">
        Créer un compte
      </b-button>

      <b-button class="mt-4 mr-2" to="/contact" variant="secondary">
        Nous contacter
      </b-button>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>
