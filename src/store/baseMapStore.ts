import { defineStore } from 'pinia'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Stroke, Circle, Text } from 'ol/style'
import { Select } from 'ol/interaction';

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
          center: fromLonLat([105.461909, -3.84270186, 0]),
          zoom: 6
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
              url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
              maxZoom: 19
            })
          })
        )
      }
    },
    uploadFile(file: any) {
      if (!file) {
        console.error('No file selected.')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          const geojsonFormat = new GeoJSON();
          const features = geojsonFormat.readFeatures(data.data);

          const vectorSource = new VectorSource({
            features,
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 0, 0, 0.2)',
              }),
              stroke: new Stroke({
                color: 'red',
                width: 2,
              }),
              image: new Circle({
                radius: 6,
                fill: new Fill({
                  color: 'blue',
                }),
              }),
            }),
          });

          this.map?.addLayer(vectorLayer);

          const select = new Select({
            layers: [vectorLayer],
          });
          this.map?.addInteraction(select)

        })
        .catch((error) => {
          console.error('Error fetching and rendering geospatial data:', error)
        })
    }
  }
})
