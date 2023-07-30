import { defineStore } from 'pinia'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'

export const useBasemapStore = defineStore({
  id: 'basemap',
  state: () => ({
    selectedBasemap: 'osm' as 'osm' | 'esri' | 'google',
    map: null as Map | null,
    geoSpatialDataUrl: 'http://localhost:5000/wfs/1',
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

      if (this.geoSpatialDataUrl) {
        this.loadGeospatialData()
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
    addGeospatialUrl(url: string) {
      this.geoSpatialDataUrl = url
    },
    loadGeospatialData() {
      if (!this.map && !this.geoSpatialDataUrl) return

      this.map?.getLayers().forEach((layer) => {
        if (layer instanceof VectorLayer) {
          this.map?.removeLayer(layer)
        }

        

        fetch(this.geoSpatialDataUrl)
          .then((response) => response.json())
          .then((data) => {
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(data)
            })

            const vectorLayer = new VectorLayer({
              source: vectorSource
            })

            this.map?.addLayer(vectorLayer)
          })
          .catch((err) => console.error('error while fetching gespatial data', err))
      })
    },
    uploadFile(file: any) {
      if (!file) {
        console.error('No file selected.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(data.data)
        })

        const vectorLayer = new VectorLayer({
          source: vectorSource
        })

        this.map?.addLayer(vectorLayer)
      })
      .catch(error => {
        console.error('Error:', error);
      });
    },
  }
})
