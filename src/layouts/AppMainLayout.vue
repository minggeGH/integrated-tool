<template>
  <q-layout view="lHh Lpr lFf" :data-theme="currentTheme" class="app-layout">
    <div class="app-layout__bg"></div>

    <q-header class="bg-transparent text-base-content" bordered>
      <q-toolbar class="mx-auto flex w-full max-w-6xl px-4 pt-3">
        <div class="w-full rounded-[28px] border border-base-300 bg-base-100 px-4 py-3 shadow-xl backdrop-blur sm:px-5">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-primary">
                <q-icon name="account_balance_wallet" size="24px" />
              </div>
              <div>
                <div class="text-lg font-bold leading-tight sm:text-xl">{{ pageTitle }}</div>
                <div class="text-sm text-base-content opacity-70">{{ pageSubtitle }}</div>
              </div>
            </div>

            <q-btn
              flat
              round
              color="primary"
              :icon="isDark ? 'light_mode' : 'dark_mode'"
              @click="toggleAppTheme()"
            >
              <q-tooltip>{{ isDark ? "切换浅色主题" : "切换深色主题" }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="relative z-10">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
      </router-view>
    </q-page-container>

    <AppBottomNav />
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppBottomNav from "@/components/AppBottomNav.vue";
import { initTheme, toggleTheme, useAppTheme } from "@/utils/appTheme";

const route = useRoute();
const currentTheme = useAppTheme();

const pageTitle = computed(() => route.meta.pageTitle || "记账助手");
const pageSubtitle = computed(
  () => route.meta.pageSubtitle || "月度预算、模板复用和临时计算放在同一套工作流里"
);
const isDark = computed(() => currentTheme.value === "dark");

function toggleAppTheme() {
  toggleTheme();
}

onMounted(() => {
  initTheme();
});
</script>

<style scoped>
.app-layout {
  position: relative;
}

.app-layout__bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 22%),
    radial-gradient(circle at bottom center, rgba(250, 204, 21, 0.1), transparent 26%);
}

[data-theme="dark"] .app-layout__bg {
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.12), transparent 28%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 24%),
    radial-gradient(circle at bottom center, rgba(14, 165, 233, 0.16), transparent 28%);
}
</style>
