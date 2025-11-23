const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/calculatorPage.vue"),
        meta: {
          pageTitle: "计算器"
        }
      },
      // {
      //   path: "/system",
      //   component: () => import("pages/systemPage.vue"),
      //   meta: {
      //     pageTitle: "系统",
      //     keepAlive: true
      //   }
      // }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
