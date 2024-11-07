src/layouts/MainLayout.vue<template>
  <q-layout view="lHh lpR lFf">
    <q-page-container class="h-screen">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>
