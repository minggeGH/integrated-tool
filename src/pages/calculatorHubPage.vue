<template>
  <q-page class="app-page">
    <div class="app-page__inner">
      <section class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="app-surface p-5">
          <div class="app-section-title">
            <q-icon name="calculate" color="primary" />
            <span>速算器</span>
          </div>
          <div class="mt-4 rounded-[28px] bg-base-200 p-4">
            <div class="min-h-[28px] text-right text-sm text-base-content opacity-60">{{ expression || "输入表达式" }}</div>
            <div class="mt-2 text-right text-4xl font-bold">{{ displayValue }}</div>
          </div>

          <div class="mt-4 grid grid-cols-4 gap-3">
            <q-btn
              v-for="key in keys"
              :key="key.label"
              unelevated
              no-caps
              :color="key.color"
              class="h-14 rounded-2xl text-lg"
              :label="key.label"
              @click="handleKey(key)"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="history" color="secondary" />
              <span>最近计算</span>
            </div>
            <div class="mt-4 space-y-3">
              <button
                v-for="(item, idx) in history"
                :key="`${item.expression}-${idx}`"
                class="app-surface-soft block w-full p-4 text-left hover:border-primary"
                @click="reuseHistory(item)"
              >
                <div class="text-sm text-base-content opacity-70">{{ item.expression }}</div>
                <div class="mt-1 text-lg font-semibold">{{ item.result }}</div>
              </button>
              <div v-if="!history.length" class="rounded-3xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content opacity-60">
                暂无历史记录
              </div>
            </div>
          </div>

          <div class="app-surface p-5">
            <div class="app-section-title">
              <q-icon name="tips_and_updates" color="warning" />
              <span>快捷公式</span>
            </div>
            <div class="mt-4 grid gap-3">
              <q-btn flat class="justify-start rounded-2xl bg-base-200 px-4 py-3" label="余额 - 扣除 - 伙食" @click="expression = '1000-200-30*10'" />
              <q-btn flat class="justify-start rounded-2xl bg-base-200 px-4 py-3" label="工资 - 房租 - 通勤" @click="expression = '8000-2500-600'" />
              <q-btn flat class="justify-start rounded-2xl bg-base-200 px-4 py-3" label="本周日均预算" @click="expression = '(1500-300)/7'" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { LocalStorage, useQuasar } from "quasar";

const $q = useQuasar();
const expression = ref("");
const displayValue = ref("0");
const history = ref([]);

const HISTORY_KEY = "calculator_history";

const keys = [
  { label: "C", color: "negative" },
  { label: "⌫", color: "warning" },
  { label: "(", color: "primary" },
  { label: ")", color: "primary" },
  { label: "7", color: "grey-2" },
  { label: "8", color: "grey-2" },
  { label: "9", color: "grey-2" },
  { label: "/", color: "primary" },
  { label: "4", color: "grey-2" },
  { label: "5", color: "grey-2" },
  { label: "6", color: "grey-2" },
  { label: "*", color: "primary" },
  { label: "1", color: "grey-2" },
  { label: "2", color: "grey-2" },
  { label: "3", color: "grey-2" },
  { label: "-", color: "primary" },
  { label: "0", color: "grey-2" },
  { label: ".", color: "grey-2" },
  { label: "=", color: "secondary" },
  { label: "+", color: "primary" },
];

const sanitizedExpression = computed(() => expression.value.replace(/\s+/g, ""));

function safeEvaluate(raw) {
  if (!/^[0-9+\-*/().\s]+$/.test(raw)) {
    throw new Error("表达式包含不支持的字符");
  }

  const result = Function(`"use strict"; return (${raw})`)();
  if (!Number.isFinite(result)) {
    throw new Error("计算结果无效");
  }
  return Number(Number(result).toFixed(6));
}

function pushHistory(exp, result) {
  history.value = [{ expression: exp, result: `${result}` }, ...history.value.filter((item) => item.expression !== exp)].slice(0, 8);
  LocalStorage.set(HISTORY_KEY, history.value);
}

function calculate() {
  if (!expression.value) return;

  try {
    const result = safeEvaluate(sanitizedExpression.value);
    displayValue.value = `${result}`;
    pushHistory(expression.value, result);
  } catch (error) {
    $q.notify({ type: "negative", message: "表达式不合法" });
  }
}

function handleKey(key) {
  if (key.label === "C") {
    expression.value = "";
    displayValue.value = "0";
    return;
  }

  if (key.label === "⌫") {
    expression.value = expression.value.slice(0, -1);
    return;
  }

  if (key.label === "=") {
    calculate();
    return;
  }

  expression.value += key.label;
}

function reuseHistory(item) {
  expression.value = item.expression;
  displayValue.value = item.result;
}

onMounted(() => {
  const cached = LocalStorage.getItem(HISTORY_KEY);
  history.value = Array.isArray(cached) ? cached : [];
});
</script>
