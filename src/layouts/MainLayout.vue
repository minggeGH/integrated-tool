<template>
  <q-layout view="lHh lpR lFf">
    <q-page-container class="h-screen">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
      </router-view>
    </q-page-container>
    <q-footer class="bg-primary text-white">
      <q-tabs v-model="nowView" dense class="bg-grey-2 text-grey-7" active-color="primary" @update="changeView">
        <q-route-tab name="index" icon="home" label="首页" to="/" />
        <q-route-tab name="system" icon="settings" label="系统" to="/system" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { Dark, LocalStorage } from "quasar";
const route = useRoute();

const nowView = ref("index");
Dark.set(LocalStorage.getItem("themeDark") || false)

</script>
