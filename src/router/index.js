import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Vocca",
    },
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
    meta: {
      title: "Page introuvable – Vocca",
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
    meta: {
      title: "Nous contacter – Vocca",
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      title: "À propos – Vocca",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Connexion – Vocca",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      title: "Inscription – Vocca",
    },
  },
  {
    path: "/tos",
    name: "TermsOfService",
    component: () => import("../views/TermsOfService.vue"),
    meta: {
      title: "Conditions générales d'utilisation – Vocca",
    },
  },
  {
    path: "/classes",
    name: "Classes",
    component: () => import("../views/Classes.vue"),
    meta: {
      title: "Mes classes – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/class/:id",
    name: "Class",
    component: () => import("../views/Class.vue"),
    meta: {
      title: "Classe – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/lists",
    name: "Lists",
    component: () => import("../views/Lists.vue"),
    meta: {
      title: "Mes listes de vocabulaire – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/list/:id",
    name: "List",
    component: () => import("../views/List.vue"),
    meta: {
      title: "Liste – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/list/:id/edit",
    name: "ListEditor",
    component: () => import("../views/ListEditor.vue"),
    meta: {
      title: "Modifier une liste – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/list/:id/training",
    name: "ListTraining",
    component: () => import("../views/ListTraining.vue"),
    meta: {
      title: "Liste (Entraînement) – Vocca",
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Paramètres – Vocca",
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { loggedIn } = store.state.auth.user;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((record) => record.meta.title);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  if (requiresAuth && !loggedIn && from.name !== "Login") {
    next({
      name: "Login",
      query: { redirect: to.path },
    });
  } else {
    next();
  }
});

export default router;
