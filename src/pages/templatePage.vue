<template>
  <q-page class="app-page">
    <div class="app-page__inner">
      <section class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="app-surface p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="app-section-title">
                <q-icon name="calendar_month" color="primary" />
                <span>下月记账模板</span>
              </div>
              <div class="mt-2 text-sm text-base-content opacity-70">
                把当前月的常用结构提前整理好，下个月打开后可以直接套用。
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

        <div class="rounded-[32px] bg-gradient-to-br from-secondary to-primary p-5 text-white shadow-2xl">
          <div class="text-sm opacity-80">模板摘要</div>
          <div class="mt-2 text-3xl font-bold">{{ template.monthLabel || "未命名模板" }}</div>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="app-kpi bg-white text-slate-700">
              <div class="text-xs uppercase tracking-[0.2em] text-white/70">预设余额</div>
              <div class="mt-2 text-2xl font-semibold">{{ Number(template.balance) || 0 }}</div>
            </div>
            <div class="app-kpi bg-white text-slate-700">
              <div class="text-xs uppercase tracking-[0.2em] text-white/70">伙食费</div>
              <div class="mt-2 text-2xl font-semibold">{{ Number(template.dailyFoodCost) || 0 }}</div>
            </div>
          </div>
          <div class="mt-5 rounded-3xl bg-white p-4 text-sm text-slate-700">
            {{ template.note || "可以写下预计的大额支出、固定项目或提醒内容。" }}
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="app-surface p-5">
          <div class="flex items-center justify-between gap-3">
            <div class="app-section-title">
              <q-icon name="sell" color="secondary" />
              <span>预设扣除项</span>
            </div>
            <q-btn flat color="primary" icon="add" label="添加一项" @click="addTemplateItem" />
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="(item, idx) in template.subtractItems"
              :key="`${item.tag}-${idx}`"
              class="app-surface-soft p-4"
            >
              <div class="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
                <q-input v-model="item.tag" filled label="标签" />
                <q-input v-model="item.value" filled type="number" label="金额" />
                <q-btn flat color="negative" icon="delete" label="删除" @click="removeTemplateItem(idx)" />
              </div>
            </div>
            <div v-if="!template.subtractItems.length" class="rounded-3xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content opacity-60">
              还没有模板扣除项，可以先从本月生成，也可以手动补充。
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

          <div class="mt-5 rounded-3xl border border-base-300 bg-base-200 p-4 text-sm text-base-content">
            应用模板会直接覆盖 `记账` 页当前数据，适合月初快速建账。
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { LocalStorage, useQuasar } from "quasar";

const $q = useQuasar();

const STORAGE_KEY = "next_month_template";

const template = reactive({
  monthLabel: "",
  balance: "",
  dailyFoodCost: "",
  note: "",
  subtractItems: [],
});

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
  template.note = "从本月数据生成，可按下个月计划微调。";
  template.subtractItems = Array.isArray(current.subtractItems)
    ? current.subtractItems.map((item) => ({ tag: item.tag, value: item.value }))
    : [];
  $q.notify({ type: "positive", message: "已按本月数据生成下月模板" });
}

function addTemplateItem() {
  template.subtractItems.push({ tag: "其他", value: "" });
}

function removeTemplateItem(index) {
  template.subtractItems.splice(index, 1);
}

function saveTemplate() {
  LocalStorage.set(STORAGE_KEY, JSON.parse(JSON.stringify(template)));
  $q.notify({ type: "positive", message: "模板已保存" });
}

function restoreTemplate() {
  const cached = LocalStorage.getItem(STORAGE_KEY);
  if (!cached) {
    $q.notify({ type: "warning", message: "还没有已保存模板" });
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
  if (!template.monthLabel) {
    template.monthLabel = getNextMonthLabel();
  }
});
</script>
