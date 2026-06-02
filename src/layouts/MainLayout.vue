<template>
  <q-layout view="lHh LpR lFf" :data-theme="currentTheme">
    <!-- 顶部导航栏 -->
    <q-header elevated class="bg-primary text-primary-content">
      <q-toolbar>
        <q-toolbar-title class="text-lg font-bold flex items-center gap-2">
          <span class="icon-[material-symbols--calculate-rounded] text-2xl"></span>
          {{ pageTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- 页面内容 -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
      </router-view>
    </q-page-container>

    <!-- 底部导航栏 -->
    <BottomNav />
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "@/components/BottomNav/index.vue";
import { useTheme, initTheme } from "@/utils/theme";

const route = useRoute();
const currentTheme = useTheme();

// 页面标题
const pageTitle = computed(() => route.meta.pageTitle || "记账助手");

onMounted(() => {
  initTheme();
});
</script>
