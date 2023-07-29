<script lang="ts">
import { defineComponent } from 'vue'
import OpenLayerMap from '@/components/OpenLayerMap.vue'

export default defineComponent({
    components: {
        OpenLayerMap
    }
})
</script>

<template>
    <main class="container">
        <OpenLayerMap />
    </main>
</template>
