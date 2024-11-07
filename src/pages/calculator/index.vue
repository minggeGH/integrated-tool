<!-- todo 计算器 -->
<template>
  <q-layout>
    <Header title="计算器" :showBackButton="false" bgClass="bg-secondary text-white text-center" />
    <q-page-container class="h-screen">
      <q-page class="h-full w-full p-3 bg-gray-300">
        <!-- ?编辑器 -->
        <q-card class="bg-white">
          <q-card-section class="p-0">
            <q-input v-model="countText" @keyup.enter="onSubmit" debounce="100" bg-color="white" inputClass="text-xl"
              filled type="textarea">
              <template v-slot:append>
                <q-btn flat icon="style" @click="copyText(countText)"></q-btn>
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
import { useQuasar, LocalStorage } from "quasar";
import * as Api from "@/api/api";
const $q = useQuasar()
// 计算字符串
const countText = ref("")
// 计算结果
const countResult = ref("")

function onSubmit() {
  countResult.value = eval(countText.value)
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

onMounted(() => {
  Api.tool.getToolData().then(res => {
    countText.value = res.countText
    countResult.value = res.countResult
  })
})

</script>