<template>
  <q-page>
    <Header title="系统" :showBackButton="false" bgClass="bg-secondary text-white text-center" />
    <q-list bordered>
      <q-item clickable v-ripple>
        <q-item-section avatar class="flex justify-start items-center">
          <q-icon color="primary" name="bluetooth" />
          <div>{{ dataSwitch ? "服务" : "缓存" }}</div>
        </q-item-section>
        <q-item-section>
          <q-toggle v-model="dataSwitch" label="Visible image" class="q-mb-md" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import Header from "@/components/Header/index.vue";
import { reactive } from "vue";
const dataSwitch = ref(false)


</script>
