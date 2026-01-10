import { createRouter, createWebHistory } from "vue-router";
import loginView from "@/views/loginView.vue";
import homeView from "../views/homeView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: loginView,
  },
  {
    path: "/home",
    component: homeView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
