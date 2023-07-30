<script lang="ts">
import { defineComponent } from 'vue'
import OpenLayerMap from '@/components/OpenLayerMap.vue'
import SideBar from '@/components/SideBar.vue'

export default defineComponent({
  components: {
    OpenLayerMap,
    SideBar
  }
})
</script>

<template>
  <main class="container-fluid">
    <div class="row">
      <div class="col-2">
        <SideBar />
      </div>
      <div class="col">
        <OpenLayerMap />
      </div>
    </div>
  </main>
</template>
