<template>
  <q-dialog class="ActionSheet" position="bottom">
    <q-card class="pb-8 text-base w-full">
      <q-card-section v-if="title" class="opacity-60 text-center text-sm">
        {{ title }}
      </q-card-section>
      <q-separator />
      <div>
        <slot></slot>
      </div>

      <q-list bordered separator class="text-lg">
        <q-item
          clickable
          v-ripple
          v-close-popup
          class="h-14"
          @click="emits('onOk')"
        >
          <q-item-section class="text-center text-primary">
            {{ ok }}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          v-close-popup
          class="h-14"
          @click="emits('onCancel')"
        >
          <q-item-section class="text-center text-error">
            {{ cancel }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>
<script setup>
const props = defineProps({
  title: String,
  ok: { type: String, default: "确定" },
  cancel: { type: String, default: "取消" },
});

const emits = defineEmits(["onOk", "onCancel"]);
</script>

<style lang="scss">
.ActionSheet {
  // 强制圆角
  .q-dialog__inner > div {
    border-radius: 12px 12px 0 0;
  }
}
</style>
