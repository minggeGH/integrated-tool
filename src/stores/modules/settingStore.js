import { defineStore } from "pinia";

// pinia setUp 写法
export const useSettingStore = defineStore("setting", () => {
  const serverState = ref(false); // 请求方式


  // *设置请求方式
  function setServerState(newValue) {
    serverState.value = newValue;
  }

  return {
    serverState,
    setServerState
  };
})