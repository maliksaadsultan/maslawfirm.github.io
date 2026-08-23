window.MAP_CONFIG = Object.freeze({
  provider: "leaflet",
  googleMapsApiKey: "",
  initialView: { center: [33.66, 72.93], zoom: 10, minZoom: 7, maxZoom: 19 },
  tileLayers: {
    road: {
      name: "Road",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }
    },
    satellite: {
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: { maxZoom: 19, attribution: "Tiles &copy; Esri" }
    },
    terrain: {
      name: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      options: { maxZoom: 17, attribution: "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap" }
    }
  },
  googleAdapter: {
    enabledWhenApiKeyPresent: true,
    mapTypes: ["roadmap", "satellite", "terrain"],
    note: "Load the Google Maps JavaScript API and implement the same adapter interface before changing provider to 'google'."
  }
});
