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
    <q-footer class="bg-primary text-white">
      <q-tabs v-model="nowView" dense class="bg-grey-2 text-grey-7" active-color="primary" @update="changeView">
        <q-tab name="index" icon="home" label="首页" @click="router.push('/')" />
        <q-tab name="system" icon="settings" label="系统" @click="router.push('/system')" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
const route = useRoute();
const router = useRouter();


const nowView = ref("index");

</script>
