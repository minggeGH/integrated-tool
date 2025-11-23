<!-- todo 计算器 -->
<template>
  <q-layout>
    <Header title="计算器" :showBackButton="false" bgClass="text-white text-center">
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
          <!-- ?预览方程式区域 -->
          <q-card>
            <q-card-section class="p-4">
              <div class="text-xl font-medium p-2 rounded">
                <div v-if="exprParts.length" class="row items-center wrap">
                  <q-chip v-for="(p, idx) in exprParts" :key="'chip-' + idx" clickable
                    :color="selectedIndex === idx ? 'primary' : 'grey-6'" text-color="white" class="q-mr-sm q-mb-sm"
                    @click="selectPart(idx)">
                    <span v-if="idx === 0">{{ p.value }}</span>
                    <span v-else>{{ p.op }} {{ p.value }}</span>
                  </q-chip>
                </div>
                <div v-else>
                  请输入计算表达式
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- ?计算结果 -->
          <q-card class="mt-3">
            <q-card-section>
              <div class="row flex-wrap items-center justify-center">
                计算结果：<span class="text-xl font-bold text-green-600">{{ countResult }}</span>
              </div>
              <!-- ?重置和复制按钮 -->
              <div class="row space-x-2 mt-3 flex justify-center">
                <q-btn outline color="red" label="重置" class="w-1/2 flex-1" @click="onClear" />
                <q-btn outline color="green-6" label="复制" class="w-1/2 flex-1" @click="copyText(countText)" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ?操作区域 - 操作类型和输入框融为一体 -->
        <div class="w-full">
          <q-card class="shadow-md mt-3">
            <q-card-section>
              <!-- 操作类型 -->
              <div class="row items-center mb-3">
                <div class="text-sm mr-4">选择操作类型：</div>
                <div class="row space-x-4">
                  <q-radio v-model="operationType" val="default" label="默认值" />
                  <q-radio v-model="operationType" val="add" label="新增值" />
                  <q-radio v-model="operationType" val="subtract" label="减去值" />
                </div>
              </div>

              <!-- 输入区域 -->
              <q-input v-model="inputValue" placeholder="请输入数值" type="number" filled class="w-full">
                <template v-slot:append>
                  <q-btn color="primary" label="新增" @click="onAddValue" />
                </template>
              </q-input>

              <!-- 单项编辑区 -->
              <div class="mt-4">
                <div class="text-sm mb-2">编辑所选表达式项：</div>
                <div v-if="selectedIndex !== -1 && exprParts[selectedIndex]" class="row items-center q-my-sm">
                  <q-select v-if="selectedIndex !== 0" dense outlined class="q-mr-sm" :options="['+', '-']"
                    :model-value="exprParts[selectedIndex].op"
                    @update:model-value="val => updatePartOp(selectedIndex, val)" style="width:70px" />
                  <q-input dense outlined type="number" :model-value="exprParts[selectedIndex].value"
                    @update:model-value="val => updatePartValue(selectedIndex, val)" class="q-mr-sm" style="flex:1" />
                  <q-btn dense flat color="negative" label="删除" @click="removePart(selectedIndex)" />
                </div>
                <div v-else class="text-italic text-grey">请在上方点击某一项进行编辑</div>
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
const inputValue = ref("")
const operationType = ref("default")
const currentTheme = ref("mytheme")

const exprParts = ref([])
const selectedIndex = ref(-1)

const countText = computed(() => {
  if (!exprParts.value.length) return ""
  return exprParts.value
    .map((p, idx) => {
      const v = (p.value ?? "").toString()
      if (idx === 0) return v
      return `${p.op === '-' ? '-' : '+'} ${v}`
    })
    .join(' ')
})

const countResult = computed(() => {
  if (!exprParts.value.length) return ""
  let total = 0
  for (let i = 0; i < exprParts.value.length; i++) {
    const part = exprParts.value[i]
    const val = Number(part.value) || 0
    if (i === 0) {
      total = val
    } else {
      total += part.op === '-' ? -val : val
    }
  }
  return total
})

function addPart(op, val) {
  const num = parseFloat(val)
  if (Number.isNaN(num)) return
  if (!exprParts.value.length) {
    exprParts.value.push({ op: '+', value: num })
    selectedIndex.value = 0
  } else {
    exprParts.value.push({ op: op === '-' ? '-' : '+', value: num })
    selectedIndex.value = exprParts.value.length - 1
  }
}

function onAddValue() {
  if (!inputValue.value) {
    $q.notify({ message: '请输入数值', color: 'negative', position: 'top' })
    return
  }
  const op = operationType.value === 'subtract' ? '-' : '+'
  if (operationType.value === 'default' && exprParts.value.length > 0) {
    $q.notify({ message: '已有默认值', color: 'warning', position: 'top' })
    return
  }
  addPart(op, inputValue.value)
  inputValue.value = ''
}

function updatePartOp(index, op) {
  if (index === 0) return
  exprParts.value[index].op = op === '-' ? '-' : '+'
}

function updatePartValue(index, val) {
  if (val === '' || val === null) {
    exprParts.value[index].value = 0
    return
  }
  const num = Number(val)
  if (!Number.isFinite(num)) return
  exprParts.value[index].value = num
}

function removePart(index) {
  exprParts.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = Math.min(index, exprParts.value.length - 1)
    if (exprParts.value.length === 0) selectedIndex.value = -1
  } else if (selectedIndex.value > index) {
    selectedIndex.value -= 1
  }
}

function onClear() {
  $q.dialog({ title: '提示', message: '是否重置?', ok: '确认', cancel: '取消', persistent: true })
    .onOk(() => {
      exprParts.value = []
      LocalStorage.remove('calculator_data')
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

function parseExpressionToParts(s) {
  const parts = []
  if (!s) return parts
  const firstMatch = s.trim().match(/^\s*([+\-]?\d+(?:\.\d+)?)/)
  if (!firstMatch) return parts
  parts.push({ op: '+', value: parseFloat(firstMatch[1]) })
  const re = /([+\-])\s*(\d+(?:\.\d+)?)/g
  let m
  while ((m = re.exec(s)) !== null) {
    parts.push({ op: m[1] === '-' ? '-' : '+', value: parseFloat(m[2]) })
  }
  return parts
}

watch(exprParts, () => {
  try {
    Api.tool.updataToolData({ countText: countText.value, countResult: countResult.value })
    LocalStorage.set('calculator_data', {
      countText: countText.value,
      countResult: countResult.value,
      exprParts: exprParts.value,
      timestamp: new Date().getTime()
    })
  } catch (e) { }
}, { deep: true })

onMounted(() => {
  Dark.set(true)
  currentTheme.value = 'dark'
  const cached = LocalStorage.getItem('calculator_data')
  if (cached && cached.exprParts) {
    exprParts.value = cached.exprParts
    selectedIndex.value = exprParts.value.length ? 0 : -1
  } else if (cached && cached.countText) {
    exprParts.value = parseExpressionToParts(cached.countText)
    selectedIndex.value = exprParts.value.length ? 0 : -1
  }
})

function selectPart(idx) {
  selectedIndex.value = idx
}

</script>
