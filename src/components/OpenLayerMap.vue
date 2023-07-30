<template>
  <div ref="mapElement" id="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBasemapStore } from '@/store/baseMapStore'
import { Map } from 'ol';

const map = ref<Map | null>(null);

const basemapStore = useBasemapStore();

onMounted(() => {
  // Initialize the map and set the map instance in the store
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
