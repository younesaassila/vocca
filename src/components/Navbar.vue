<template>
  <div>
    <b-navbar class="nav-background" toggleable="md" type="light">
      <b-navbar-brand class="nav-brand" to="/">Vocca</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/contact">Contact</b-nav-item>
          <b-nav-item to="/about">À propos</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-button
            v-if="!user.loggedIn"
            class="my-1 ml-2"
            to="/login"
            variant="primary"
          >
            Connexion
          </b-button>
          <b-button
            v-if="!user.loggedIn"
            class="my-1 ml-2"
            to="/register"
            variant="outline-primary"
          >
            Inscription
          </b-button>

          <b-nav-item-dropdown v-else class="my-1 ml-2" right>
            <template v-slot:button-content>
              {{ user.data.lastName }} {{ user.data.firstName }}
            </template>
            <b-dropdown-item to="/">
              <b-icon icon="house" class="mr-2" />
              Accueil
            </b-dropdown-item>
            <hr />
            <b-dropdown-item to="/classes">
              <b-icon icon="people" class="mr-2" />
              Mes classes
            </b-dropdown-item>
            <b-dropdown-item to="/lists">
              <b-icon icon="list-ul" class="mr-2" />
              Mes listes de vocabulaire
            </b-dropdown-item>
            <hr />
            <b-dropdown-item to="/settings">
              <b-icon icon="gear" class="mr-2" />
              Paramètres
            </b-dropdown-item>
            <b-dropdown-item @click="logout()">
              <b-icon icon="power" class="mr-2" />
              Déconnexion
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Navbar",
  computed: mapState("auth", ["user"]),
  methods: mapActions("auth", ["logout"]),
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap");

.nav-background {
  background-color: var(--white);
  box-shadow: 0 0 8px #0000001f;
}
.nav-brand {
  font-family: "Pacifico", cursive;
  font-size: 24px;
}
</style>
