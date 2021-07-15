<template>
  <div class="not-found">
    <h1 class="title">404</h1>

    <h5 class="message">Cette page est introuvable !</h5>

    <div class="btn-container">
      <b-button class="mb-2" to="/" variant="primary">
        Retour à l'accueil
      </b-button>

      <b-button variant="outline-primary" @click="$router.back()">
        Retour à la page précédente
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.title {
  font-size: 48pt;
  font-weight: bold;
}

.message {
  margin-bottom: 3rem;
}

.btn-container {
  display: flex;
  flex-direction: column;
  max-width: max-content;
  margin: 0 auto 0 auto;
}
</style>
