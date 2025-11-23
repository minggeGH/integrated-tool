<template>
  <q-header :class="dark ? 'bg-transparent' : bgClass + ' text-base-content'">
    <q-toolbar>
      <q-btn v-if="showBackButton" flat round dense class="icon-[material-symbols--chevron-left-rounded] text-sm"
        @click="router.back()" />
      <q-toolbar-title :class="{ 'absolute-center': isTextCenter }">{{ title }}</q-toolbar-title>
      <div class="q-ml-auto">
        <slot name="right"></slot>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  dark: {
    type: Boolean,
    default: false,
  },
  bgClass: {
    type: String,
    default: "bg-base-100",
  },
  isTextCenter: {
    type: Boolean,
    default: false,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  }
});
</script>
