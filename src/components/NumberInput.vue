<!-- todo 计数器 -->
<template>
  <q-input
    outlined
    type="number"
    v-model="number"
    :dense="dense"
    :input-style="{
      'text-align': 'center',
    }"
    debounce="1000"
  >
    <template v-slot:prepend>
      <q-btn flat icon="remove" :dense="dense" @click="subtract"></q-btn>
    </template>
    <template v-slot:append>
      <q-btn flat icon="add" :dense="dense" @click="augment"></q-btn>
    </template>

    <template v-slot:before>
      <slot name="before"></slot>
    </template>
    <template v-slot:after>
      <slot name="after"></slot>
    </template>
  </q-input>
</template>

<script setup>
const props = defineProps({
  // 最大值
  maxValue: {
    type: Number,
    default: 1000,
  },
  // 最小值
  minValue: {
    type: Number,
    default: 0,
  },
  // 步长
  step: {
    type: Number,
    default: 1,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

let number = defineModel();

watch(number, handleUpdate); // 监听number变化

// *更新
function handleUpdate(newNumber, oldNumber) {
  // 判断是否超过最大值
  if (newNumber > props.maxValue) {
    number.value = oldNumber;
  }
  // 判断是否小于最小值
  if (newNumber < props.minValue) {
    number.value = oldNumber;
  }
}

// *递增
function augment() {
  number.value += props.step;
}

// *递减
function subtract() {
  number.value -= props.step;
}
</script>
