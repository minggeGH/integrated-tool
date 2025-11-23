<!-- todo 系统页 -->
<template>
  <q-page :class="{ 'bg-grey-1': !isDark, 'bg-grey-10': isDark }">
    <Header title="系统" :showBackButton="false" bgClass="bg-indigo-10 text-white text-center" />
    <q-list bordered>
      <q-item clickable v-ripple>
        <q-item-section avatar class="p-0">
          <q-icon size="md" color="positive" name="dns" />
        </q-item-section>
        <q-item-section>
          <span class="text-base">请求方式</span>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="dataSwitch" :label="dataSwitch ? ' 服务' : '缓存'" @update:model-value="updataServerState" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar class="p-0">
          <q-icon size="md" color="positive" :name="isDark ? 'dark_mode' : 'contrast'" />
        </q-item-section>
        <q-item-section>
          <span class="text-base">主题</span>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="themeSwitch" :label="themeSwitch ? '暗黑' : '高亮'"
            @update:model-value="$q.dark.toggle($event)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import Header from "@/components/Header/index.vue";
import { useQuasar, Dark, LocalStorage } from "quasar";
import { useSettingStore } from "@/stores/modules/settingStore";
const $q = useQuasar()
const dataSwitch = ref(false)
const themeSwitch = ref(false)
const isDark = computed(() => Dark.isActive)
const { serverState, setServerState } = useSettingStore()

onMounted(() => {
  themeSwitch.value = LocalStorage.getItem("themeDark") || false
  dataSwitch.value = serverState
})

watch(isDark, (newTheme) => {
  LocalStorage.set('themeDark', newTheme)
})

function updataServerState(newState) {
  setServerState(newState)
}

</script>
