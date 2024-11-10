<!-- todo 计算器 -->
<template>
  <q-layout>
    <Header title="计算器" :showBackButton="false" bgClass="bg-indigo-10 text-white text-center" />
    <q-page-container class="h-screen">
      <q-page class="h-full w-full p-3" :class="{
        'bg-grey-2': !isDark,
        'bg-grey-10': isDark
      }">
        <!-- ?编辑器 -->
        <q-card class="bg-white">
          <q-card-section class="p-0">
            <q-input v-model="countText" @keyup.enter="onSubmit" debounce="100" :bg-color="!isDark ? 'white' : 'grey-9'"
              inputClass="text-xl" filled type="textarea">
              <template v-slot:append>
                <q-btn flat icon="style" color="blue-grey" @click="copyText(countText)"></q-btn>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <!-- ?计算结果 -->
        <q-card @click="copyText(countResult)" class="mt-3">
          <q-card-section class="row flex-wrap items-center justify-center">
            计算结果：<span class="text-xl font-bold text-green-600">{{ countResult }}</span>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
    <!-- ?操作按钮 -->
    <q-footer class="p-3 pb-16 bg-white row space-x-2 flex-nowrap">
      <q-btn outline color="green-6" label="重置" class="w-1/2" @click="onClear" />
      <q-btn color="primary" size="1rem" glossy label="计算" class="w-1/2" @click="onSubmit" />
    </q-footer>
  </q-layout>
</template>

<script setup>
import Header from "@/components/Header/index.vue";
import { useQuasar, Dark, LocalStorage } from "quasar";
import * as Api from "@/api/api";
import { useSettingStore } from "@/stores/modules/settingStore";

const $q = useQuasar()
console.log("🚀 ~ $q:", $q)
// 计算字符串
const countText = ref("")
// 计算结果
const countResult = ref("")

const isDark = computed(() => Dark.isActive)
const { serverState } = useSettingStore()

onMounted(() => {
  console.log("🚀 ~ onMounted ~ serverState:", serverState)
  if (serverState) {
    Api.tool.getToolData().then(res => {
      countText.value = res.countText
      countResult.value = res.countResult
    })
  } else {
    const toolData = LocalStorage.getItem("toolData")
    if (toolData) {
      countText.value = toolData.countText || ''
      countResult.value = toolData.countResult || ''
    }

  }

})


function onSubmit() {
  countResult.value = eval(countText.value)
  if (serverState) {
    Api.tool.updataToolData({
      countText: countText.value,
      countResult: countResult.value
    }).then(res => {
      $q.notify({
        message: '计算成功',
        color: 'positive',
        position: 'top',
      })
    })
  } else {
    LocalStorage.set("toolData", {
      countText: countText.value,
      countResult: countResult.value
    })
  }

}

function onClear() {
  $q.dialog({
    title: '提示',
    message: '是否重置?',
    ok: "确认",
    cancel: "取消",
    persistent: true
  }).onOk(() => {
    countText.value = ''
    countResult.value = ''
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

</script>