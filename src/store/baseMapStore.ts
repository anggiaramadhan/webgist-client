import { defineStore } from 'pinia';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

export const useBasemapStore = defineStore({
  id: 'basemap',
  state: () => ({
    selectedBasemap: 'osm' as 'osm' | 'esri' | 'google',
    map: null as Map | null,
  }),
  actions: {
    initializeMap() {
      this.map = new Map({
        target: 'map',
        layers: [],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });
      this.updateBasemap();
    },
    updateBasemap() {
      const newBasemap = this.selectedBasemap;
      // Remove existing layers
      if (this.map) {
        this.map.getLayers().clear();
      }

      // Add the selected basemap layer
      switch (newBasemap) {
        case 'osm':
          this.addOpenStreetMapLayer();
          break;
        case 'esri':
          this.addEsriBasemapLayer();
          break;
        case 'google':
          this.addGoogleMapLayer();
          break;
      }
    },
    addOpenStreetMapLayer() {
      if (this.map) {
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            }),
          })
        );
      }
    },
    addEsriBasemapLayer() {
      if (this.map) {
        this.map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/{basemap}/MapServer/tile/{z}/{y}/{x}',
              attributions: [
                '<a href="https://www.esri.com/">Esri</a>',
              ],
              projection: 'EPSG:3857',
              maxZoom: 19,
            }),
          })
        );
      }
    },
    addGoogleMapLayer() {
      // Add your Google Maps layer here (Google Maps has specific usage and API restrictions)
      // Note: You may need to use an alternative mapping service like Mapbox or Bing Maps.
      // Be sure to check their terms of service and usage limitations.
    },
  },
});
