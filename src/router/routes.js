const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "accounting",
        component: () => import("pages/accountingPage.vue"),
        meta: {
          pageTitle: "记账",
          keepAlive: true
        }
      },
      {
        path: "/statistics",
        name: "statistics",
        component: () => import("pages/statisticsPage.vue"),
        meta: {
          pageTitle: "统计",
          keepAlive: true
        }
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("pages/settingsPage.vue"),
        meta: {
          pageTitle: "设置",
          keepAlive: false
        }
      }
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
