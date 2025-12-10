<!-- todo 计算器 -->
<template>
  <q-layout>
    <Header title="记账" :showBackButton="false" bgClass="text-white text-center">
      <template v-slot:right>
        <div class="row items-center h-full">
          <q-btn flat round dense icon="brightness_6" @click="toggleTheme" />
        </div>
      </template>
    </Header>
    <q-page-container class="h-screen">
      <q-page class="h-full w-full p-3 flex flex-col" style="min-height: 0;" :class="{
        'bg-dark': $q.dark.isActive,
        'bg-grey-7': !$q.dark.isActive
      }">
        <div class="flex-1" style="overflow-y: auto;">
          <q-card>
            <q-card-section class="p-4">
              <div class="text-xl font-medium p-2 rounded">
                <div class="q-mb-sm">余额：<span class="text-primary">{{ balanceDisplay }}</span></div>
                <div class="q-mb-sm">减去值：</div>
                <div class="row items-center wrap">
                  <q-chip v-for="(v, idx) in subtractValues" :key="'sv-' + idx" clickable
                    :color="selectedIndex === idx ? 'primary' : 'grey-6'" text-color="white" class="q-mr-sm q-mb-sm"
                    @click="selectSubtract(idx)">
                    - {{ v }}
                  </q-chip>
                  <div v-if="!subtractValues.length" class="text-grey">暂无</div>
                </div>
                <div class="q-mt-sm">日常开销：<span class="text-primary">{{ dailyValueADisplay }}</span> × <span
                    class="text-primary">{{ dailyValueBDisplay }}</span> = <span class="text-primary">{{ dailyExpense
                    }}</span></div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="mt-3">
            <q-card-section>
              <div class="row flex-wrap items-center justify-center">
                计算结果：<span class="text-xl font-bold text-green-600">{{ countResult }}</span>
              </div>
              <div class="row space-x-2 mt-3 flex justify-center">
                <q-btn outline color="red" label="重置" class="w-1/2 flex-1" @click="onClear" />
                <q-btn outline color="green-6" label="复制" class="w-1/2 flex-1" @click="copyText(countText)" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="w-full">
          <q-card class="shadow-md mt-3">
            <q-card-section>
              <div class="q-mb-md">
                <div class="text-sm mb-2">余额：</div>
                <q-input v-model="balance" placeholder="请输入余额" type="number" filled class="w-full" clearable />
              </div>

              <div class="q-mb-md">
                <div class="text-sm mb-2">减去值：</div>
                <q-input v-model="subtractInput" placeholder="请输入减去值" type="number" filled class="w-full" clearable>
                  <template v-slot:append>
                    <div class="px-2 pl-6">
                      <q-btn color="primary" label="新增" @click="onAddSubtract" />
                    </div>
                  </template>
                </q-input>
                <div class="mt-4">
                  <div class="text-sm mb-2">编辑所选项：</div>
                  <div v-if="selectedIndex !== -1 && subtractValues[selectedIndex] !== undefined"
                    class="row items-center q-my-sm">
                    <q-input dense outlined type="number" :model-value="subtractValues[selectedIndex]" clearable
                      @update:model-value="val => updateSubtractValue(selectedIndex, val)" class="q-mr-sm"
                      style="flex:1" />
                    <q-btn dense flat color="negative" label="删除" @click="removeSubtract(selectedIndex)" />
                  </div>
                  <div v-else class="text-italic text-grey">请在上方点击某一项进行编辑</div>
                </div>
              </div>

              <div>
                <div class="text-sm mb-2">日常开销：</div>
                <div class="row items-center">
                  <q-input v-model="dailyValueA" clearable dense outlined type="number" class="q-mr-sm" style="flex:1"
                    placeholder="请输入单价或次数" />
                  <div class="q-mx-sm">×</div>
                  <q-input v-model="dailyValueB" clearable dense outlined type="number" style="flex:1"
                    placeholder="请输入数量或单价" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from "@/components/Header/index.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar, LocalStorage, Dark } from "quasar";
import * as Api from "@/api/api";

const $q = useQuasar()
const currentTheme = ref("mytheme")

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
    $q.notify({ message: '请输入减去值', color: 'negative', position: 'top' })
    return
  }
  const num = Number(subtractInput.value)
  if (!Number.isFinite(num)) {
    $q.notify({ message: '请输入有效数字', color: 'negative', position: 'top' })
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
    })
}

function copyText(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  $q.notify({ message: '复制成功', color: 'positive', position: 'top' })
}

function toggleTheme() {
  Dark.set(!Dark.isActive)
  currentTheme.value = Dark.isActive ? 'dark' : 'light'
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
  Dark.set(true)
  currentTheme.value = 'dark'
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
