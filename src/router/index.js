import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";

//路由配置
const backendRoutes = [
  {
    path: "/back",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes,
});

export default router;
