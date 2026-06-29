<template>
  <q-page class="app-page">
    <div class="app-page__inner">
      <section class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div class="app-surface p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="app-section-title">
                <q-icon name="calendar_month" color="primary" />
                <span>下月记账模板</span>
              </div>
              <div class="mt-2 text-sm text-base-content opacity-70">
                这里的扣除项录入方式和本月记账页保持一致，月初可以直接应用模板快速建账。
              </div>
            </div>
            <q-btn unelevated color="primary" label="从本月生成" @click="seedFromCurrent" />
          </div>

          <div class="mt-5 grid gap-4">
            <q-input v-model="template.monthLabel" filled label="模板月份" hint="例如 2026-07" />
            <q-input v-model="template.balance" filled type="number" label="预设余额" />
            <q-input v-model="template.dailyFoodCost" filled type="number" label="预设每日伙食费" />
            <q-input v-model="template.note" filled type="textarea" autogrow label="备注" />
          </div>
        </div>

        <div class="rounded-[32px] bg-gradient-to-br from-secondary to-primary p-4 text-white shadow-2xl sm:p-5">
          <div class="text-sm opacity-80">模板摘要</div>
          <div class="mt-2 text-3xl font-bold">{{ template.monthLabel || "未命名模板" }}</div>
          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            <div class="rounded-2xl border px-3 py-3 shadow-lg backdrop-blur" :class="heroMetricClass">
              <div class="text-[11px] uppercase tracking-[0.18em]" :class="heroMetricLabelClass">预设余额</div>
              <div class="mt-1 text-lg font-semibold sm:text-xl">{{ Number(template.balance) || 0 }}</div>
            </div>
            <div class="rounded-2xl border px-3 py-3 shadow-lg backdrop-blur" :class="heroMetricClass">
              <div class="text-[11px] uppercase tracking-[0.18em]" :class="heroMetricLabelClass">每日伙食</div>
              <div class="mt-1 text-lg font-semibold sm:text-xl">{{ Number(template.dailyFoodCost) || 0 }}</div>
            </div>
          </div>
          <div class="mt-4 rounded-2xl border px-4 py-4 backdrop-blur" :class="heroMetricClass">
            <div class="text-sm" :class="heroMetricLabelClass">模板备注</div>
            <div class="mt-2 text-sm leading-6">{{ template.note || "可以提前写好固定支出、月初提醒或计划内消费。" }}</div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div class="app-surface p-5">
          <div class="app-section-title">
            <q-icon name="edit_note" color="primary" />
            <span>预设录入</span>
          </div>

          <div class="mt-4 space-y-4">
            <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
              <q-input v-model="subtractInput" filled type="number" label="新增扣除金额" @keyup.enter="addTemplateItem" />
              <q-btn unelevated color="primary" label="添加" class="sm:min-w-[96px]" @click="addTemplateItem" />
            </div>

            <div>
              <div class="mb-2 text-sm font-medium text-base-content opacity-80">常用标签</div>
              <div class="flex flex-wrap gap-2">
                <q-btn
                  v-for="tag in presetTags"
                  :key="tag"
                  unelevated
                  no-caps
                  size="sm"
                  :color="selectedTag === tag ? 'primary' : isDark ? 'grey-8' : 'grey-3'"
                  :text-color="selectedTag === tag ? 'white' : isDark ? 'white' : 'dark'"
                  :label="tag"
                  class="rounded-full"
                  @click="selectedTag = tag"
                />
              </div>
            </div>

            <q-input v-model="customTag" filled label="自定义标签" />

            <div>
              <div class="mb-2 text-sm font-medium text-base-content opacity-80">已增加的扣除项</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(item, idx) in template.subtractItems"
                  :key="`${item.tag}-${idx}`"
                  class="rounded-2xl border border-base-300 bg-base-200 px-3 py-2 text-left hover:-translate-y-0.5 hover:border-primary hover:bg-base-100"
                  @click="openEditDialog(idx)"
                >
                  <div class="flex items-center gap-2">
                    <q-badge :color="getTagColor(item.tag)" rounded>{{ item.tag }}</q-badge>
                    <span class="font-semibold">-{{ item.value }}</span>
                  </div>
                </button>
                <div
                  v-if="!template.subtractItems.length"
                  class="w-full rounded-3xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content opacity-60"
                >
                  还没有模板扣除项，可以先从本月生成，也可以手动添加
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="app-surface p-5">
          <div class="app-section-title">
            <q-icon name="bolt" color="warning" />
            <span>快速操作</span>
          </div>

          <div class="mt-4 grid gap-3">
            <q-btn unelevated color="primary" label="保存模板" @click="saveTemplate" />
            <q-btn unelevated color="secondary" label="应用到记账页" @click="applyTemplate" />
            <q-btn flat color="dark" label="恢复上次保存" @click="restoreTemplate" />
          </div>

          <div class="mt-5 rounded-3xl border border-base-300 bg-base-200 p-4 text-sm text-base-content opacity-80">
            应用模板会覆盖“记账”页当前数据，适合月初快速建立下个月基础账本。
          </div>
        </div>
      </section>
    </div>

    <q-dialog v-model="editDialog">
      <q-card class="w-full max-w-md rounded-[28px]">
        <q-card-section class="pb-2">
          <div class="text-lg font-semibold">编辑模板扣除项</div>
          <div class="text-sm text-base-content opacity-70">这里的编辑方式也和本月记账页保持一致</div>
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
import { computed, onMounted, reactive, ref } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { useAppTheme } from "@/utils/appTheme";

const $q = useQuasar();
const currentTheme = useAppTheme();

const STORAGE_KEY = "next_month_template";
const presetTags = ["外卖", "购物", "话费", "交通", "娱乐", "其他"];
const selectedTag = ref("外卖");
const customTag = ref("");
const subtractInput = ref("");
const editDialog = ref(false);
const editingIndex = ref(-1);
const editForm = reactive({ tag: "", value: "" });
const template = reactive({
  monthLabel: "",
  balance: "",
  dailyFoodCost: "",
  note: "",
  subtractItems: [],
});

const isDark = computed(() => currentTheme.value === "dark");
const heroMetricClass = computed(() =>
  isDark.value ? "border-white/10 bg-black/20 text-white" : "border-white/35 bg-white/90 text-slate-800"
);
const heroMetricLabelClass = computed(() =>
  isDark.value ? "text-white/65" : "text-slate-500"
);

const tagColors = {
  外卖: "warning",
  购物: "primary",
  话费: "info",
  交通: "secondary",
  娱乐: "accent",
  其他: "grey-7",
};

function getTagColor(tag) {
  return tagColors[tag] || "grey-7";
}

function getNextMonthLabel() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;
}

function seedFromCurrent() {
  const current = LocalStorage.getItem("accounting_data") || {};
  template.monthLabel = getNextMonthLabel();
  template.balance = current.balance ?? "";
  template.dailyFoodCost = current.dailyFoodCost ?? "";
  template.note = "已按本月数据生成，下个月开始前可再微调。";
  template.subtractItems = Array.isArray(current.subtractItems)
    ? current.subtractItems.map((item) => ({ tag: item.tag, value: item.value }))
    : [];
  $q.notify({ type: "positive", message: "已按本月数据生成模板" });
}

function addTemplateItem() {
  const amount = Number(subtractInput.value);
  if (!Number.isFinite(amount) || subtractInput.value === "") {
    $q.notify({ type: "negative", message: "请输入有效的扣除金额" });
    return;
  }

  template.subtractItems.push({
    tag: customTag.value.trim() || selectedTag.value,
    value: amount,
  });
  subtractInput.value = "";
  customTag.value = "";
  $q.notify({ type: "positive", message: "模板扣除项已添加" });
}

function openEditDialog(index) {
  const item = template.subtractItems[index];
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

  template.subtractItems[editingIndex.value] = {
    tag: editForm.tag.trim() || "其他",
    value: amount,
  };
  editDialog.value = false;
  $q.notify({ type: "positive", message: "模板扣除项已更新" });
}

function deleteEditingItem() {
  if (editingIndex.value < 0) return;
  template.subtractItems.splice(editingIndex.value, 1);
  editingIndex.value = -1;
  editDialog.value = false;
  $q.notify({ type: "positive", message: "模板扣除项已删除" });
}

function saveTemplate() {
  LocalStorage.set(STORAGE_KEY, JSON.parse(JSON.stringify(template)));
  $q.notify({ type: "positive", message: "模板已保存" });
}

function restoreTemplate() {
  const cached = LocalStorage.getItem(STORAGE_KEY);
  if (!cached) {
    template.monthLabel = getNextMonthLabel();
    return;
  }

  template.monthLabel = cached.monthLabel || getNextMonthLabel();
  template.balance = cached.balance ?? "";
  template.dailyFoodCost = cached.dailyFoodCost ?? "";
  template.note = cached.note || "";
  template.subtractItems = Array.isArray(cached.subtractItems)
    ? cached.subtractItems.map((item) => ({ tag: item.tag, value: item.value }))
    : [];
}

function applyTemplate() {
  $q.dialog({
    title: "应用模板",
    message: "这会覆盖记账页当前数据，是否继续？",
    ok: { label: "应用", color: "primary" },
    cancel: { flat: true, label: "取消" },
    persistent: true,
  }).onOk(() => {
    LocalStorage.set("accounting_data", {
      balance: template.balance,
      dailyFoodCost: template.dailyFoodCost,
      subtractItems: template.subtractItems.map((item) => ({
        tag: item.tag || "其他",
        value: Number(item.value) || 0,
      })),
      timestamp: Date.now(),
    });
    saveTemplate();
    $q.notify({ type: "positive", message: "模板已应用到记账页" });
  });
}

onMounted(() => {
  restoreTemplate();
});
</script>
