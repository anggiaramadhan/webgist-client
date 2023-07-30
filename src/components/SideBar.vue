<template>
  <nav id="sidebar-menu">
    <div class="mb-3">
      <label for="formFile" class="form-label">Map Input</label>
      <input class="form-control" type="file" id="formFile" @change="onFileChange" />
    </div>

    <div class="mb-5">
      <label for="basemap">Select Basemap:</label>
      <select class="form-select" v-model="selectedBasemap" @change="updateBasemap">
        <option value="osm">OpenStreetMap</option>
        <option value="esri">Esri Basemap</option>
        <option value="google">Google Map</option>
      </select>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBasemapStore } from '@/store/baseMapStore';

const basemapStore = useBasemapStore();
const selectedBasemap = ref(basemapStore.selectedBasemap);

function onFileChange(event: Event) {
  const target = (event.target as HTMLInputElement)
  if (target && target.files) {
    const file = target.files[0]
    basemapStore.uploadFile(file)
  }
}

function updateBasemap() {
  basemapStore.selectedBasemap = selectedBasemap.value;
  basemapStore.updateBasemap();
}
</script>

<style>
#sidebar-menu {
  padding: 20px 10px;
  position: static;
  height: 100vh;
  background-color: white;
}
</style>
