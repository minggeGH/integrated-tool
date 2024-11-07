<template>
  <div id="amap-container" />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { AMAP } from "@/utils/amapApi";
let map = null;
let AMap = null

onMounted(async () => {
});

function init(mapOption) {
  return new Promise(async resolve => {
    const amap = new AMAP()
    AMap = await amap.load()
    map = new AMap.Map("amap-container", mapOption);
    resolve(map);
  });
}
/**
 * 绘制marker
 * @param {*} icon图标、anchor偏移位置
 */
function drawMaker({ position: [lng, lat], ...args }) {
  return new AMap.Marker({
    position: new AMap.LngLat(lng, lat),
    ...args
  })
}
// 生成图标
function icon({ imageSize: [width, height], image }) {
  return new AMap.Icon({
    imageSize: new AMap.Size(width, height),
    image
  })
}
// 地图定位
function bounds(lnglats) {
  const myBounds = new AMap.Bounds(lnglats)
  map.setBounds(myBounds)
}

// 绘制圆形
function drawCircle(circleOptions) {
  return new AMap.Circle(circleOptions)
}

// 初始化图层组
function initLayerGroup(isAddMap) {
  const overlays = new AMap.OverlayGroup([])
  isAddMap && map.add(overlays)
  return overlays
}

// 创建新的信息窗口
function newInfoWindow(infoOptions) {
  return new AMap.InfoWindow(infoOptions)
}

// 绘制文本
function drawText({ position, ...args }, isAddMap) {
  // 创建文本对象
  const text = new AMap.Text({
    position: new AMap.LngLat(position[0], position[1]),
    ...args
  });
  // 如果isAddMap为true，则将文本对象添加到地图上
  isAddMap && map.add(text);
  // 返回文本对象
  return text
}

onUnmounted(() => {
  map?.destroy();
});

defineExpose({
  init,
  drawMaker,
  icon,
  bounds,
  drawCircle,
  initLayerGroup,
  newInfoWindow,
  drawText
});
</script>

<style lang="scss">
#amap-container {

  .amap-logo,
  .amap-copyright {
    visibility: hidden;
  }
}
</style>
