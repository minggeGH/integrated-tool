<template>
  <q-footer class="bg-transparent">
    <div class="mx-auto max-w-6xl px-4 pb-4">
      <div class="mx-auto grid max-w-3xl grid-cols-4 rounded-[28px] border border-base-300 bg-base-100 p-2 shadow-2xl backdrop-blur">
        <q-btn
          v-for="item in items"
          :key="item.name"
          flat
          no-caps
          :to="item.to"
          class="nav-btn"
          :class="activeTab === item.name ? 'nav-btn--active' : ''"
        >
          <div class="flex flex-col items-center gap-1 py-1">
            <q-icon :name="item.icon" size="22px" />
            <span class="text-xs font-medium">{{ item.label }}</span>
          </div>
        </q-btn>
      </div>
    </div>
  </q-footer>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const items = [
  { name: "accounting", label: "记账", icon: "wallet", to: "/" },
  { name: "template", label: "下月模板", icon: "calendar_month", to: "/template" },
  { name: "calculator", label: "计算器", icon: "calculate", to: "/calculator" },
  { name: "settings", label: "设置", icon: "tune", to: "/settings" },
];

const activeTab = computed(() => route.name || "accounting");
</script>

<style scoped>
.nav-btn {
  border-radius: 20px;
}

.nav-btn--active {
  background: color-mix(in srgb, var(--q-primary) 14%, transparent);
  color: var(--q-primary);
}
</style>
