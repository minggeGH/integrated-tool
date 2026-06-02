<!-- 设置页面 -->
<template>
  <q-page class="flex flex-col bg-base-200" :data-theme="currentTheme">
    <div class="w-full max-w-4xl mx-auto p-4 space-y-4">
      <!-- 日期设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--calendar-month-rounded] text-xl"></span>
            日期设置
          </h3>

          <div class="mt-4 space-y-3">
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">起始日期</div>
                  <div class="text-sm text-base-content/60">设置计算周期的起始日期</div>
                </div>
                <q-input v-model="startDate" type="date" outlined dense class="w-40"
                  @update:model-value="saveDateSettings" />
              </div>
            </div>

            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">结束日期</div>
                  <div class="text-sm text-base-content/60">设置计算周期的结束日期</div>
                </div>
                <q-input v-model="endDate" type="date" outlined dense class="w-40"
                  @update:model-value="saveDateSettings" />
              </div>
            </div>

            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">使用自定义日期</div>
                  <div class="text-sm text-base-content/60">开启后使用设置的日期范围计算剩余天数</div>
                </div>
                <q-toggle v-model="useCustomDate" @update:model-value="saveDateSettings" color="primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主题设置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--palette-rounded] text-xl"></span>
            主题设置
          </h3>

          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">暗色主题</div>
                <div class="text-sm text-base-content/60">切换亮色/暗色主题</div>
              </div>
              <q-toggle :model-value="isDark" @update:model-value="toggleTheme" color="primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--storage-rounded] text-xl"></span>
            数据管理
          </h3>

          <div class="mt-4 space-y-3">
            <!-- 导出数据 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">导出数据</div>
                  <div class="text-sm text-base-content/60">将所有数据导出为 JSON 文件</div>
                </div>
                <q-btn color="primary" label="导出" icon="icon-[material-symbols--download-rounded]"
                  @click="exportData" />
              </div>
            </div>

            <!-- 导入数据 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">导入数据</div>
                  <div class="text-sm text-base-content/60">从 JSON 文件导入数据</div>
                </div>
                <q-btn color="secondary" label="导入" icon="icon-[material-symbols--upload-rounded]"
                  @click="importData" />
              </div>
            </div>

            <!-- 清除数据 -->
            <div class="bg-base-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-negative">清除所有数据</div>
                  <div class="text-sm text-base-content/60">删除所有缓存数据（不可恢复）</div>
                </div>
                <q-btn color="negative" label="清除" icon="icon-[material-symbols--delete-forever-rounded]"
                  @click="clearAllData" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4">
          <h3 class="card-title text-base">
            <span class="icon-[material-symbols--info-rounded] text-xl"></span>
            关于
          </h3>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-base-content/60">应用名称</span>
              <span class="font-medium">记账助手</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/60">版本号</span>
              <span class="font-medium">{{ appVersion }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/60">开发者</span>
              <span class="font-medium">luxrg</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileImport" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, LocalStorage } from "quasar";
import { toggleTheme as switchTheme, isDark as checkIsDark, useTheme } from "@/utils/theme";

const $q = useQuasar();
const currentTheme = useTheme();
const isDark = ref(checkIsDark());
const fileInput = ref(null);

// 日期设置
const startDate = ref("");
const endDate = ref("");
const useCustomDate = ref(false);

// 应用版本
const appVersion = ref(APP_VERSION || "0.0.2");

// 切换主题
function toggleTheme(value) {
  switchTheme();
  isDark.value = value;
}

// 保存日期设置
function saveDateSettings() {
  LocalStorage.set("date_settings", {
    startDate: startDate.value,
    endDate: endDate.value,
    useCustomDate: useCustomDate.value
  });
  $q.notify({ message: "日期设置已保存", color: "positive", position: "top", icon: "check" });
}

// 导出数据
function exportData() {
  const data = {
    accounting_data: LocalStorage.getItem("accounting_data"),
    month_summaries: LocalStorage.getItem("month_summaries"),
    theme: LocalStorage.getItem("theme"),
    exportTime: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `记账数据_${new Date().toLocaleDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  $q.notify({ message: "导出成功", color: "positive", position: "top", icon: "check" });
}

// 导入数据
function importData() {
  fileInput.value.click();
}

// 处理文件导入
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (data.accounting_data) {
        LocalStorage.set("accounting_data", data.accounting_data);
      }
      if (data.month_summaries) {
        LocalStorage.set("month_summaries", data.month_summaries);
      }
      if (data.theme) {
        LocalStorage.set("theme", data.theme);
      }

      $q.notify({ message: "导入成功，请刷新页面", color: "positive", position: "top", icon: "check" });
    } catch (err) {
      $q.notify({ message: "导入失败：文件格式错误", color: "negative", position: "top", icon: "warning" });
    }
  };
  reader.readAsText(file);

  // 清空文件输入
  event.target.value = "";
}

// 清除所有数据
function clearAllData() {
  $q.dialog({
    title: "警告",
    message: "确定要清除所有数据吗？此操作不可恢复！",
    ok: { label: "确认清除", color: "negative" },
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    LocalStorage.remove("accounting_data");
    LocalStorage.remove("month_summaries");
    LocalStorage.remove("theme");
    $q.notify({ message: "已清除所有数据", color: "positive", position: "top", icon: "check" });
  });
}

onMounted(() => {
  // 初始化主题状态
  isDark.value = checkIsDark();

  // 加载日期设置
  const dateSettings = LocalStorage.getItem("date_settings");
  if (dateSettings) {
    startDate.value = dateSettings.startDate || "";
    endDate.value = dateSettings.endDate || "";
    useCustomDate.value = dateSettings.useCustomDate || false;
  }
});
</script>
