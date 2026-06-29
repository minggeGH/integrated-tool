<template>
  <q-page class="app-page">
    <div class="app-page__inner">
      <section class="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div class="space-y-4">
          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="palette" color="primary" />
              <span>主题与外观</span>
            </div>
            <div class="mt-4 flex items-center justify-between rounded-3xl bg-base-200 p-4">
              <div>
                <div class="font-medium">深色模式</div>
                <div class="mt-1 text-sm text-base-content opacity-70">所有新页面都跟随这一套主题切换</div>
              </div>
              <q-toggle :model-value="isDark" color="primary" @update:model-value="toggleAppTheme" />
            </div>
          </div>

          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="date_range" color="secondary" />
              <span>日期范围</span>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <q-input v-model="startDate" filled type="date" label="开始日期" />
              <q-input v-model="endDate" filled type="date" label="结束日期" />
            </div>
            <div class="mt-4 flex items-center justify-between rounded-3xl bg-base-200 p-4">
              <div>
                <div class="font-medium">启用自定义周期</div>
                <div class="mt-1 text-sm text-base-content opacity-70">记账页会优先使用这里的日期范围计算剩余天数</div>
              </div>
              <q-toggle v-model="useCustomDate" color="secondary" />
            </div>
            <div class="mt-4">
              <q-btn unelevated color="secondary" label="保存日期设置" @click="saveDateSettings" />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="folder_zip" color="primary" />
              <span>数据管理</span>
            </div>
            <div class="mt-4 grid gap-3">
              <q-btn unelevated color="primary" icon="download" label="导出数据" @click="exportData" />
              <q-btn unelevated color="secondary" icon="upload" label="导入数据" @click="pickFile" />
              <q-btn unelevated color="negative" icon="delete_forever" label="清空所有数据" @click="clearAllData" />
            </div>
          </div>

          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="info" color="warning" />
              <span>关于</span>
            </div>
            <div class="mt-4 space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-base-content opacity-70">应用名</span>
                <span class="font-medium">记账助手</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base-content opacity-70">版本</span>
                <span class="font-medium">{{ appVersion }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base-content opacity-70">设计方向</span>
                <span class="font-medium">主题自适应 / 月初模板 / 快速计算</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileImport" />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { isDarkTheme, toggleTheme } from "@/utils/appTheme";

const $q = useQuasar();
const fileInput = ref(null);
const startDate = ref("");
const endDate = ref("");
const useCustomDate = ref(false);
const darkState = ref(isDarkTheme());

const isDark = computed(() => darkState.value);
const appVersion = APP_VERSION || "0.0.3";

function toggleAppTheme(value) {
  toggleTheme(value);
  darkState.value = value;
}

function saveDateSettings() {
  LocalStorage.set("date_settings", {
    startDate: startDate.value,
    endDate: endDate.value,
    useCustomDate: useCustomDate.value,
  });
  $q.notify({ type: "positive", message: "日期设置已保存" });
}

function exportData() {
  const data = {
    accounting_data: LocalStorage.getItem("accounting_data"),
    next_month_template: LocalStorage.getItem("next_month_template"),
    calculator_history: LocalStorage.getItem("calculator_history"),
    theme: LocalStorage.getItem("theme"),
    date_settings: LocalStorage.getItem("date_settings"),
    exportTime: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `记账助手备份_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  $q.notify({ type: "positive", message: "数据已导出" });
}

function pickFile() {
  fileInput.value?.click();
}

function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "exportTime") {
          LocalStorage.set(key, value);
        }
      });
      if (data.theme) {
        toggleTheme(data.theme === "dark");
        darkState.value = data.theme === "dark";
      }
      $q.notify({ type: "positive", message: "数据导入成功" });
    } catch (error) {
      $q.notify({ type: "negative", message: "导入失败，文件格式不正确" });
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function clearAllData() {
  $q.dialog({
    title: "清空确认",
    message: "这会删除记账、模板和计算器历史，是否继续？",
    ok: { label: "清空", color: "negative" },
    cancel: { flat: true, label: "取消" },
    persistent: true,
  }).onOk(() => {
    ["accounting_data", "next_month_template", "calculator_history", "date_settings"].forEach((key) => {
      LocalStorage.remove(key);
    });
    $q.notify({ type: "positive", message: "本地数据已清空" });
  });
}

onMounted(() => {
  const dateSettings = LocalStorage.getItem("date_settings");
  if (dateSettings) {
    startDate.value = dateSettings.startDate || "";
    endDate.value = dateSettings.endDate || "";
    useCustomDate.value = !!dateSettings.useCustomDate;
  }
  darkState.value = isDarkTheme();
});
</script>
