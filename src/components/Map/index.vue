<template>
  <div id="mapContainer"></div>
</template>

<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, defineExpose } from "vue";
onMounted(() => {});
let map = null;
defineExpose({ initMap, map });
function initMap() {
  return new Promise((resolve, reject) => {
    map = L.map("mapContainer", {
      center: [23, 113],
      zoom: 16,
      zoomControl: false,
    });
    L.tileLayer(
      "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
      {}
    ).addTo(map);
    resolve(map);
  });
}
</script>

<style lang="scss">
#mapContainer {
  .leaflet-right {
    display: none;
  }
}
</style>
