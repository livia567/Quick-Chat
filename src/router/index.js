import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";

//后台路由配置
const backendRoutes = [
  {
    path: "/back",
    //已登录时访问/back时，实际跳转到/back/dashboard页面（重定向）
    redirect: "/back/dashboard",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consultations",
        component: () => import("@/views/consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotional",
        component: () => import("@/views/emotional.vue"),
        meta: {
          title: "情感记录",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        component: () => import("@/views/register.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];

//前台路由配置
const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "consultation",
        component: () => import("@/views/consultation.vue"),
      },
      {
        path: "emotion-diary",
        component: () => import("@/views/emotionDiary.vue"),
      },
      {
        path: "knowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
      },
      {
        //跳转到这个路径时，Vue Router会自动拿到id参数（article/后面的即为id）
        //然后把id存进route.params.id
        //点击会话列表时会传入相应id
        path: "/knowledge/article/:id",
        component: () => import("@/views/articleDetail.vue"),
        props: true, //props:true就一个作用，把route.params里的东西，自动当成props传给组件
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  //合并后台路由和前台路由
  routes: [...backendRoutes, ...frontendRoutes],
});

//路由前置守卫（页面跳转之前做的事情）
router.beforeEach((to, from, next) => {
  //判断是否登录
  const token = localStorage.getItem("token");
  if (token) {
    //userInfo是一个字符串，需要转为对象
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //如果是后台用户
    if (userInfo.userType == "2") {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        //已登录的后台用户，如果想要访问不是/back开头的，自动返回首页
        next("/back/dashboard");
      }
      //如果是前台已登录用户
    } else if (userInfo.userType == "1") {
      // 前台用户想访问后台或登录页 → 没权限，跳转到前台首页
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/");
      } else {
        // 前台用户访问前台页面 → 放行
        next();
      }
    } else {
      // userType 是其他值时的兜底，否则页面卡死
      next("/auth/login");
    }

    //未登录
  } else {
    if (to.path.startsWith("/back")) {
      //如果要访问后台页面，那么未登录时跳转到登录页
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router;
