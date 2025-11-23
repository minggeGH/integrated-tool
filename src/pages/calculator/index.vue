<!-- todo 计算器 -->
<template>
  <q-layout>
    <Header title="计算器" :showBackButton="false" bgClass="bg-secondary text-white text-center">
      <template v-slot:right>
        <q-btn flat round dense icon="brightness_6" @click="toggleTheme" />
      </template>
    </Header>
    <q-page-container class="h-screen">
      <q-page class="h-full w-full p-3 flex flex-col">
        <div class="flex-1">
          <!-- ?预览方程式区域 -->
          <q-card>
            <q-card-section class="p-4">
              <div class="text-xl font-medium p-2 rounded">
                {{ countText || '请输入计算表达式' }}
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
        <div class="w-full pb-5">
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
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from "@/components/Header/index.vue";
import { ref, onMounted, getCurrentInstance } from "vue";
import { useQuasar, LocalStorage, Dark } from "quasar";
import * as Api from "@/api/api";
const $q = useQuasar()
const app = getCurrentInstance()
// 计算字符串
const countText = ref("")
// 计算结果
const countResult = ref("")
// 输入值
const inputValue = ref("")
// 操作类型
const operationType = ref("default")

// 新增值处理函数
function onAddValue() {
  if (!inputValue.value) {
    $q.notify({
      message: '请输入数值',
      color: 'negative',
      position: 'top',
    })
    return
  }

  const num = parseFloat(inputValue.value)

  if (operationType.value === 'default') {
    // 默认值，直接设置
    countText.value = num.toString()
  } else if (operationType.value === 'add') {
    // 新增值
    if (!countText.value) {
      countText.value = num.toString()
    } else {
      countText.value = `${countText.value} + ${num}`
    }
  } else if (operationType.value === 'subtract') {
    // 减去值
    if (!countText.value) {
      countText.value = num.toString()
    } else {
      countText.value = `${countText.value} - ${num}`
    }
  }

  // 自动计算
  onSubmit()
  // 清空输入框
  inputValue.value = ''
}

function onSubmit() {
  if (!countText.value) return

  try {
    countResult.value = eval(countText.value)

    // 保存数据到API
    Api.tool.updataToolData({
      countText: countText.value,
      countResult: countResult.value
    })

    // 保存数据到本地缓存
    LocalStorage.set('calculator_data', {
      countText: countText.value,
      countResult: countResult.value,
      timestamp: new Date().getTime()
    })
  } catch (error) {
    $q.notify({
      message: '计算表达式有误',
      color: 'negative',
      position: 'top',
    })
  }
}

function onClear() {
  $q.dialog({
    title: 'Confirm',
    message: '是否重置?',
    ok: "确认",
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    countText.value = ''
    countResult.value = ''
    // 清除本地缓存
    LocalStorage.remove('calculator_data')
  })

}

// * 复制文本
function copyText(text) {
  // 复制文本  
  var textarea = document.createElement('textarea');
  textarea.value = text
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  $q.notify({
    message: '复制成功',
    color: 'positive',
    position: 'top',
  })
}

// 切换主题功能
function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme
  const newTheme = currentTheme === 'winter' ? 'mytheme' : 'winter'
  app.appContext.config.globalProperties.$theme.setTheme(newTheme)
  LocalStorage.set('app_theme', newTheme)
}

onMounted(() => {
  // 首先尝试从本地缓存获取数据
  const cachedData = LocalStorage.getItem('calculator_data')
  if (cachedData) {
    countText.value = cachedData.countText
    countResult.value = cachedData.countResult
  }

  // 然后从API获取最新数据
  Api.tool.getToolData().then(res => {
    if (res.countText || res.countResult) {
      countText.value = res.countText
      countResult.value = res.countResult
      // 更新本地缓存
      LocalStorage.set('calculator_data', {
        countText: res.countText,
        countResult: res.countResult,
        timestamp: new Date().getTime()
      })
    }
  })

  // 从本地缓存恢复主题设置
  const savedTheme = LocalStorage.getItem('app_theme')
  if (savedTheme) {
    app.appContext.config.globalProperties.$theme.setTheme(savedTheme)
  }
})

</script>
