import { defineStore } from 'pinia'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'

export const useBasemapStore = defineStore({
  id: 'basemap',
  state: () => ({
    selectedBasemap: 'osm' as 'osm' | 'esri' | 'google',
    map: null as Map | null
  }),
  actions: {
    initializeMap() {
      this.map = new Map({
        target: 'map',
        layers: [],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2
        })
      })
      this.updateBasemap()
    },
    updateBasemap() {
      const newBasemap = this.selectedBasemap
      // Remove existing layers
      if (this.map) {
        this.map.getLayers().clear()
      }

      // Add the selected basemap layer
      switch (newBasemap) {
        case 'osm':
          this.addOpenStreetMapLayer()
          break
        case 'esri':
          this.addEsriBasemapLayer()
          break
        case 'google':
          this.addGoogleMapLayer()
          break
      }
    },
    addOpenStreetMapLayer() {
      if (this.map) {
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        )
      }
    },
    addEsriBasemapLayer() {
      if (this.map) {
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              attributions:
                'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
              url:
                'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
              projection: 'EPSG:3857',
              maxZoom: 19
            })
          })
        )
      }
    },
    addGoogleMapLayer() {
      if (this.map) {
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              attributions:
                'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
              url:
                'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
              projection: 'EPSG:3857',
              maxZoom: 19
            })
          })
        )
      }
    }
  }
})
