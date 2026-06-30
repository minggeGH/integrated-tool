<template>
  <q-page class="app-page">
    <div class="app-page__inner">
      <section class="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="rounded-[32px] bg-gradient-to-br from-primary to-info p-4 text-white shadow-2xl sm:p-5">
          <div class="flex items-start justify-between gap-3 pl-3">
            <div>
              <div class="text-sm opacity-80">本月可用余额</div>
              <div class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{{ countResult }}</div>
              <div class="mt-2 text-sm opacity-80">{{ summaryText }}</div>
            </div>
            <q-btn flat round color="white" icon="content_copy" size="md" @click="copyText(countText)" />
          </div>
        </div>

        <div class="app-surface p-5">
          <div class="app-section-title">
            <q-icon name="schedule" color="primary" />
            <span>周期概览</span>
          </div>
          <div class="mt-4 grid gap-3">
            <div class="app-surface-soft p-4">
              <div class="text-sm text-base-content opacity-70">剩余天数</div>
              <div class="mt-2 text-3xl font-bold text-info">{{ remainingDays }}</div>
            </div>
            <div class="app-surface-soft p-4">
              <div class="flex items-center justify-between text-sm text-base-content opacity-70">
                <span>每日伙食费</span>
                <span>{{ dailyFoodDisplay }}/天</span>
              </div>
              <div class="mt-3 h-2 rounded-full bg-base-300">
                <div class="h-2 rounded-full bg-info" :style="{ width: `${foodProgress}%` }"></div>
              </div>
            </div>
            <q-btn unelevated color="primary" label="重置本月数据" @click="onClear" />
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div class="app-surface p-5">
          <div class="flex items-center justify-between gap-3">
            <div class="app-section-title">
              <q-icon name="sell" color="secondary" />
              <span>扣除项</span>
            </div>
            <q-badge color="secondary" outline>{{ subtractItems.length }} 项</q-badge>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button v-for="(item, idx) in subtractItems" :key="`${item.tag}-${idx}`"
              class="rounded-2xl border border-base-300 bg-base-200 px-3 py-2 text-left hover:-translate-y-0.5 hover:border-primary hover:bg-base-100"
              @click="openEditDialog(idx)">
              <div class="flex items-center gap-2">
                <q-badge :color="getTagColor(item.tag)" rounded>{{ item.tag }}</q-badge>
                <span class="font-semibold">-{{ item.value }}</span>
              </div>
            </button>
            <div v-if="!subtractItems.length"
              class="w-full rounded-3xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content opacity-60">
              暂无扣除项，先从右侧表单添加一条
            </div>
          </div>
        </div>

        <div class="app-surface p-5">
          <div class="app-section-title">
            <q-icon name="edit_note" color="primary" />
            <span>本月录入</span>
          </div>

          <div class="mt-4 space-y-4">
            <q-input v-model="balance" filled type="number" label="余额" />

            <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
              <q-input v-model="subtractInput" filled type="number" label="新增扣除金额" @keyup.enter="onAddItem" />
              <q-btn unelevated color="primary" label="添加" class="sm:min-w-[96px]" @click="onAddItem" />
            </div>

            <div>
              <div class="mb-2 text-sm font-medium text-base-content opacity-80">常用标签</div>
              <div class="flex flex-wrap gap-2">
                <q-btn v-for="tag in presetTags" :key="tag" unelevated no-caps size="sm"
                  :color="selectedTag === tag ? 'primary' : isDark ? 'grey-8' : 'grey-3'"
                  :text-color="selectedTag === tag ? 'white' : isDark ? 'white' : 'dark'" :label="tag"
                  class="rounded-full" @click="selectedTag = tag" />
              </div>
            </div>

            <q-input v-model="customTag" filled label="自定义标签" />
            <q-input v-model="dailyFoodCost" filled type="number" label="每日伙食费" />
          </div>
        </div>
      </section>
    </div>

    <q-dialog v-model="editDialog">
      <q-card class="w-full max-w-md rounded-[28px]">
        <q-card-section class="pb-2">
          <div class="text-lg font-semibold">编辑扣除项</div>
          <div class="text-sm text-base-content opacity-70">删除后会直接关闭当前编辑框</div>
        </q-card-section>

        <q-card-section class="space-y-4">
          <q-input v-model="editForm.value" filled type="number" label="金额" />
          <q-input v-model="editForm.tag" filled label="标签" />
        </q-card-section>

        <q-card-actions align="between" class="px-4 pb-4">
          <q-btn flat color="negative" label="删除" @click="deleteEditingItem" />
          <div class="flex gap-2">
            <q-btn flat label="取消" v-close-popup />
            <q-btn unelevated color="primary" label="保存" @click="saveEditingItem" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import * as Api from "@/api/api";
import { useAppTheme } from "@/utils/appTheme";

const $q = useQuasar();
const currentTheme = useAppTheme();

const isDark = computed(() => currentTheme.value === "dark");
const heroMetricClass = computed(() =>
  isDark.value ? "border-white/10 bg-black/20 text-white" : "border-white/35 bg-white/90 text-slate-800"
);
const heroMetricLabelClass = computed(() =>
  isDark.value ? "text-white/65" : "text-slate-500"
);

const balance = ref("");
const subtractItems = ref([]);
const subtractInput = ref("");
const dailyFoodCost = ref("");
const presetTags = ["外卖", "购物", "话费", "交通", "娱乐", "其他"];
const selectedTag = ref("外卖");
const customTag = ref("");
const editDialog = ref(false);
const editingIndex = ref(-1);
const editForm = reactive({ tag: "", value: "" });

const tagColors = {
  外卖: "warning",
  购物: "primary",
  话费: "info",
  交通: "secondary",
  娱乐: "accent",
  其他: "grey-7",
};

const remainingDays = computed(() => {
  const dateSettings = LocalStorage.getItem("date_settings");
  if (dateSettings?.useCustomDate && dateSettings.startDate && dateSettings.endDate) {
    const start = new Date(dateSettings.startDate);
    const end = new Date(dateSettings.endDate);
    const today = new Date();
    if (today < start || today > end) return 0;
    return Math.ceil((end.getTime() - today.getTime()) / 86400000) + 1;
  }

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate() + 1;
});

const sumSubtract = computed(() => subtractItems.value.reduce((sum, item) => sum + (Number(item.value) || 0), 0));
const dailyFoodDisplay = computed(() => Number(dailyFoodCost.value) || 0);
const totalFoodExpense = computed(() => dailyFoodDisplay.value * remainingDays.value);
const balanceDisplay = computed(() => Number(balance.value) || 0);
const countResult = computed(() => balanceDisplay.value - sumSubtract.value - totalFoodExpense.value);
const summaryText = computed(
  () => `余额 ${balanceDisplay.value}，扣除 ${sumSubtract.value}，伙食 ${totalFoodExpense.value}`
);
const countText = computed(() => {
  const items = subtractItems.value.map((item) => `${item.tag}:${item.value}`).join("，");
  return `余额 ${balanceDisplay.value} - 扣除项(${items || "无"}) - 伙食费(${dailyFoodDisplay.value}×${remainingDays.value}=${totalFoodExpense.value})`;
});
const foodProgress = computed(() => {
  if (!balanceDisplay.value) return 0;
  return Math.min(100, Math.round((totalFoodExpense.value / balanceDisplay.value) * 100));
});

function getTagColor(tag) {
  return tagColors[tag] || "grey-7";
}

function onAddItem() {
  const amount = Number(subtractInput.value);
  if (!Number.isFinite(amount) || subtractInput.value === "") {
    $q.notify({ type: "negative", message: "请输入有效的扣除金额" });
    return;
  }

  subtractItems.value.push({
    tag: customTag.value.trim() || selectedTag.value,
    value: amount,
  });
  subtractInput.value = "";
  customTag.value = "";
  $q.notify({ type: "positive", message: "扣除项已添加" });
}

function openEditDialog(index) {
  const item = subtractItems.value[index];
  editingIndex.value = index;
  editForm.tag = item.tag;
  editForm.value = `${item.value}`;
  editDialog.value = true;
}

function saveEditingItem() {
  const amount = Number(editForm.value);
  if (editingIndex.value < 0 || !Number.isFinite(amount)) {
    $q.notify({ type: "negative", message: "请输入有效金额" });
    return;
  }

  subtractItems.value[editingIndex.value] = {
    tag: editForm.tag.trim() || "其他",
    value: amount,
  };
  editDialog.value = false;
  $q.notify({ type: "positive", message: "扣除项已更新" });
}

function deleteEditingItem() {
  if (editingIndex.value < 0) return;
  subtractItems.value.splice(editingIndex.value, 1);
  editingIndex.value = -1;
  editDialog.value = false;
  $q.notify({ type: "positive", message: "扣除项已删除" });
}

function onClear() {
  $q.dialog({
    title: "重置确认",
    message: "是否清空本月记账数据？",
    ok: { label: "清空", color: "negative" },
    cancel: { flat: true, label: "取消" },
    persistent: true,
  }).onOk(() => {
    balance.value = "";
    subtractItems.value = [];
    subtractInput.value = "";
    dailyFoodCost.value = "";
    customTag.value = "";
    LocalStorage.remove("accounting_data");
    $q.notify({ type: "positive", message: "本月数据已清空" });
  });
}

function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  $q.notify({ type: "positive", message: "结果说明已复制" });
}

watch(
  [balance, subtractItems, dailyFoodCost],
  () => {
    const payload = {
      balance: balance.value,
      subtractItems: subtractItems.value,
      dailyFoodCost: dailyFoodCost.value,
      countText: countText.value,
      countResult: countResult.value,
      timestamp: Date.now(),
    };

    LocalStorage.set("accounting_data", payload);

    try {
      Api.tool.updataToolData({
        countText: countText.value,
        countResult: countResult.value,
      });
    } catch (error) {
    }
  },
  { deep: true }
);

onMounted(() => {
  const cached = LocalStorage.getItem("accounting_data");
  if (!cached) return;
  balance.value = cached.balance ?? "";
  subtractItems.value = Array.isArray(cached.subtractItems) ? cached.subtractItems : [];
  dailyFoodCost.value = cached.dailyFoodCost ?? "";
});
</script>
