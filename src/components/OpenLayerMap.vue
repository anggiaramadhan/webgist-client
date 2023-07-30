<template>
  <div ref="mapElement" id="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBasemapStore } from '@/store/baseMapStore'
import { Map } from 'ol';
import "ol/ol.css"

const map = ref<Map | null>(null);

const basemapStore = useBasemapStore();

onMounted(() => {
  basemapStore.initializeMap();
  map.value = basemapStore.map;
});
</script>

<style>
#map {
  width: 100%;
  height: 100vh;
}
</style>
