const appRoutes = [
  {
    path: "/",
    component: () => import("layouts/AppMainLayout.vue"),
    children: [
      {
        path: "",
        name: "accounting",
        component: () => import("pages/accountingModernPage.vue"),
        meta: {
          pageTitle: "记账",
          pageSubtitle: "专注本月预算、扣除项和剩余可用金额",
          keepAlive: true,
        },
      },
      {
        path: "/template",
        name: "template",
        component: () => import("pages/templateModernPage.vue"),
        meta: {
          pageTitle: "下月模板",
          pageSubtitle: "优先准备下个月的记账结构，月初可一键带入",
          keepAlive: true,
        },
      },
      {
        path: "/calculator",
        name: "calculator",
        component: () => import("pages/calculatorModernPage.vue"),
        meta: {
          pageTitle: "计算器",
          pageSubtitle: "随手做预算、减法、日均花费和临时表达式计算",
          keepAlive: true,
        },
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("pages/settingsHubPage.vue"),
        meta: {
          pageTitle: "设置",
          pageSubtitle: "主题、日期范围和本地数据管理",
          keepAlive: false,
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default appRoutes;
