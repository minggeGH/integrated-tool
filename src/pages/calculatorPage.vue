<!-- todo 计算器 -->
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- 顶部导航栏 -->
    <q-header elevated class="bg-primary text-primary-content">
      <q-toolbar>
        <q-toolbar-title class="text-lg font-bold flex items-center gap-2">
          <span class="icon-[material-symbols--calculate-rounded] text-2xl"></span>
          记账助手
        </q-toolbar-title>
        <q-btn flat round dense :icon="isDark ? 'brightness_5' : 'brightness_6'" @click="toggleTheme"
          class="transition-all duration-300">
          <q-tooltip>{{ isDark ? '切换亮色主题' : '切换暗色主题' }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- 页面内容 -->
    <q-page-container>
      <q-page class="flex flex-col bg-base-200">
        <div class="w-full max-w-4xl mx-auto p-4 space-y-4 flex-1" style="min-height: 0;">
          <!-- 余额概览卡片 -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <div class="flex items-center justify-between mb-3">
                <h2 class="card-title text-base-content/70">
                  <span class="icon-[material-symbols--account-balance-wallet] text-xl"></span>
                  余额
                </h2>
                <div class="text-3xl font-bold text-primary">{{ balanceDisplay }}</div>
              </div>

              <!-- 减去值列表 -->
              <div class="divider my-2">减去值</div>
              <div class="flex flex-wrap gap-2 min-h-[40px]">
                <div v-for="(v, idx) in subtractValues" :key="'sv-' + idx"
                  class="badge badge-lg cursor-pointer transition-all duration-200 hover:scale-105"
                  :class="selectedIndex === idx ? 'badge-primary' : 'badge-ghost'" @click="selectSubtract(idx)">
                  - {{ v }}
                </div>
                <div v-if="!subtractValues.length" class="text-base-content/40 text-sm italic">
                  暂无减去值
                </div>
              </div>
              <div v-if="subtractValues.length" class="mt-2 text-sm text-base-content/60">
                合计：<span class="font-semibold text-secondary">{{ sumSubtract }}</span>
              </div>

              <!-- 日常开销 -->
              <div class="divider my-2">日常开销</div>
              <div class="flex items-center justify-between bg-base-200 rounded-lg p-3">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-semibold text-accent">{{ dailyValueADisplay }}</span>
                  <span class="text-base-content/50">×</span>
                  <span class="text-lg font-semibold text-accent">{{ dailyValueBDisplay }}</span>
                </div>
                <div class="text-xl font-bold text-accent">= {{ dailyExpense }}</div>
              </div>
            </div>
          </div>

          <!-- 计算结果卡片 -->
          <div class="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
            <div class="card-body p-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm opacity-80">计算结果</div>
                  <div class="text-4xl font-bold mt-1">{{ countResult }}</div>
                </div>
                <span class="icon-[material-symbols--savings-rounded] text-6xl opacity-20"></span>
              </div>
              <div class="card-actions justify-end mt-3">
                <q-btn outline color="white" label="重置" class="flex-1" @click="onClear" />
                <q-btn outline color="white" label="复制" class="flex-1" @click="copyText(countText)" />
              </div>
            </div>
          </div>

          <!-- 输入表单卡片 -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <h3 class="card-title text-base">
                <span class="icon-[material-symbols--edit-rounded] text-xl"></span>
                编辑数据
              </h3>

              <!-- 余额输入 -->
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">余额</span>
                </label>
                <q-input v-model="balance" placeholder="请输入余额" type="number" outlined dense
                  class="bg-base-200 rounded-lg" clearable />
              </div>

              <!-- 减去值输入 -->
              <div class="form-control w-full mt-4">
                <label class="label">
                  <span class="label-text font-medium">减去值</span>
                </label>
                <div class="flex gap-2">
                  <q-input v-model="subtractInput" placeholder="请输入减去值" type="number" outlined dense
                    class="bg-base-200 rounded-lg flex-1" clearable @keyup.enter="onAddSubtract" />
                  <q-btn color="primary" label="新增" @click="onAddSubtract" class="h-10" />
                </div>
              </div>

              <!-- 编辑选中项 -->
              <div v-if="selectedIndex !== -1 && subtractValues[selectedIndex] !== undefined"
                class="mt-4 p-3 bg-base-200 rounded-lg">
                <div class="text-sm font-medium mb-2">编辑第 {{ selectedIndex + 1 }} 项</div>
                <div class="flex gap-2">
                  <q-input dense outlined type="number" :model-value="subtractValues[selectedIndex]" clearable
                    @update:model-value="val => updateSubtractValue(selectedIndex, val)"
                    class="bg-base-100 rounded-lg flex-1" />
                  <q-btn flat color="negative" label="删除" @click="removeSubtract(selectedIndex)" />
                </div>
              </div>

              <!-- 日常开销输入 -->
              <div class="form-control w-full mt-4">
                <label class="label">
                  <span class="label-text font-medium">日常开销</span>
                </label>
                <div class="flex items-center gap-2">
                  <q-input v-model="dailyValueA" clearable dense outlined type="number"
                    class="bg-base-200 rounded-lg flex-1" placeholder="单价/次数" />
                  <span class="text-base-content/50 text-lg">×</span>
                  <q-input v-model="dailyValueB" clearable dense outlined type="number"
                    class="bg-base-200 rounded-lg flex-1" placeholder="数量/单价" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar, LocalStorage, Dark } from "quasar";
import * as Api from "@/api/api";
import { initTheme, toggleTheme as switchTheme, getCurrentTheme, isDark as checkIsDark } from "@/utils/theme";

const $q = useQuasar()
const currentTheme = ref('dark')
const isDark = computed(() => currentTheme.value === "dark")

const balance = ref("")
const subtractValues = ref([])
const subtractInput = ref("")
const dailyValueA = ref("")
const dailyValueB = ref("")
const selectedIndex = ref(-1)

const sumSubtract = computed(() => {
  return subtractValues.value.reduce((s, v) => s + (Number(v) || 0), 0)
})

const dailyExpense = computed(() => {
  const a = Number(dailyValueA.value) || 0
  const b = Number(dailyValueB.value) || 0
  return a * b
})

const balanceDisplay = computed(() => {
  if (balance.value === "" || balance.value === null) return 0
  const n = Number(balance.value)
  return Number.isFinite(n) ? n : 0
})

const dailyValueADisplay = computed(() => {
  const n = Number(dailyValueA.value)
  return Number.isFinite(n) ? n : 0
})

const dailyValueBDisplay = computed(() => {
  const n = Number(dailyValueB.value)
  return Number.isFinite(n) ? n : 0
})

const countResult = computed(() => {
  if (balance.value === "" || balance.value === null) return ""
  const base = Number(balance.value) || 0
  return base - sumSubtract.value - dailyExpense.value
})

const countText = computed(() => {
  const base = Number(balance.value) || 0
  const subs = subtractValues.value.map(v => Number(v) || 0).join(" + ")
  const a = Number(dailyValueA.value) || 0
  const b = Number(dailyValueB.value) || 0
  const d = a * b
  return `余额 ${base} - 减去值(${subs || 0}) - 日常开销(${a}×${b}=${d})`
})

function onAddSubtract() {
  if (!subtractInput.value) {
    $q.notify({ message: '请输入减去值', color: 'negative', position: 'top', icon: 'warning' })
    return
  }
  const num = Number(subtractInput.value)
  if (!Number.isFinite(num)) {
    $q.notify({ message: '请输入有效数字', color: 'negative', position: 'top', icon: 'warning' })
    return
  }
  subtractValues.value.push(num)
  selectedIndex.value = subtractValues.value.length - 1
  subtractInput.value = ''
}

function updateSubtractValue(index, val) {
  if (val === '' || val === null) {
    subtractValues.value[index] = 0
    return
  }
  const num = Number(val)
  if (!Number.isFinite(num)) return
  subtractValues.value[index] = num
}

function removeSubtract(index) {
  subtractValues.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = Math.min(index, subtractValues.value.length - 1)
    if (subtractValues.value.length === 0) selectedIndex.value = -1
  } else if (selectedIndex.value > index) {
    selectedIndex.value -= 1
  }
}

function onClear() {
  $q.dialog({ title: '提示', message: '是否重置?', ok: '确认', cancel: '取消', persistent: true })
    .onOk(() => {
      balance.value = ''
      subtractValues.value = []
      subtractInput.value = ''
      dailyValueA.value = ''
      dailyValueB.value = ''
      selectedIndex.value = -1
      LocalStorage.remove('accounting_data')
      $q.notify({ message: '已重置', color: 'positive', position: 'top', icon: 'check' })
    })
}

function copyText(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  $q.notify({ message: '复制成功', color: 'positive', position: 'top', icon: 'check' })
}

function toggleTheme() {
  const newTheme = switchTheme()
  currentTheme.value = newTheme
}

watch([balance, subtractValues, dailyValueA, dailyValueB], () => {
  try {
    Api.tool.updataToolData({ countText: countText.value, countResult: countResult.value })
    LocalStorage.set('accounting_data', {
      balance: balance.value,
      subtractValues: subtractValues.value,
      dailyValueA: dailyValueA.value,
      dailyValueB: dailyValueB.value,
      countText: countText.value,
      countResult: countResult.value,
      timestamp: new Date().getTime()
    })
  } catch (e) { }
}, { deep: true })

onMounted(() => {
  // 初始化主题
  const savedTheme = initTheme()
  currentTheme.value = savedTheme

  // 加载保存的数据
  const cached = LocalStorage.getItem('accounting_data')
  if (cached) {
    balance.value = cached.balance ?? ''
    subtractValues.value = Array.isArray(cached.subtractValues) ? cached.subtractValues : []
    dailyValueA.value = cached.dailyValueA ?? ''
    dailyValueB.value = cached.dailyValueB ?? ''
    selectedIndex.value = subtractValues.value.length ? 0 : -1
  }
})

function selectSubtract(idx) {
  selectedIndex.value = idx
}

</script>

<style scoped>
/* 主题过渡动画 */
.q-layout {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* 输入框样式优化 */
:deep(.q-field__control) {
  border-radius: 0.5rem;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
}
</style>
