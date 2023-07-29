<template>
    <div ref="mapElement" class="map"></div>
</template>

<script>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default {
    setup() {
        const mapElement = ref(null)
        onMounted(() => {
            new Map({
                target: mapElement.value,
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 2
                })
            })
        })

        return {
            mapElement
        }
    }
}
</script>

<style>
.map {
    width: 100%;
    height: 100vh;
}
</style>
