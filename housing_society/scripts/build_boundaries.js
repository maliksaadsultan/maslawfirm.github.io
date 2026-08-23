const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lookup = JSON.parse(fs.readFileSync(path.join(root, "research", "way_geometries.json"), "utf8"));
const projectsByWay = {
  619698946: { id: "dha-islamabad", name: "DHA Islamabad (DHA Phase 2)" },
  894217563: { id: "capital-smart-city", name: "Capital Smart City" },
  1534265768: { id: "dha-margalla-enclave", name: "DHA Margalla Enclave" },
  1134245679: { id: "eighteen", name: "Eighteen" },
  867010470: { id: "mumtaz-city-rawalpindi", name: "Mumtaz City Rawalpindi" },
  1014286385: { id: "taj-residencia", name: "Taj Residencia" },
  899731818: { id: "pwd-housing-society", name: "PWD Housing Society" },
  396565497: { id: "new-city-wah", name: "New City Wah (mapped B Block, Phase 2)" },
  956597992: { id: "blue-world-city", name: "Blue World City" },
  1135480104: { id: "seven-wonders-city", name: "Seven Wonders City" }
};

const collection = {
  type: "FeatureCollection",
  name: "Reviewed public housing-society boundaries",
  features: lookup.filter((item) => item.geojson && projectsByWay[item.osm_id]).map((item) => ({
    type: "Feature",
    properties: {
      project_id: projectsByWay[item.osm_id].id,
      name: projectsByWay[item.osm_id].name,
      geometry_scope: item.osm_id === 396565497 ? "mapped block only" : "mapped society landuse",
      source: `https://www.openstreetmap.org/way/${item.osm_id}`,
      source_label: "OpenStreetMap mapped landuse",
      retrieved_at: "2026-08-23",
      disclaimer: "Public map geometry for orientation only; not a cadastral or legal boundary."
    },
    geometry: item.geojson
  }))
};

const polygonDirectory = path.join(root, "polygons");
const dataDirectory = path.join(root, "data");
fs.mkdirSync(polygonDirectory, { recursive: true });
fs.mkdirSync(dataDirectory, { recursive: true });
fs.writeFileSync(path.join(polygonDirectory, "society_boundaries.geojson"), JSON.stringify(collection, null, 2) + "\n");
fs.writeFileSync(path.join(dataDirectory, "boundaries-data.js"), `window.SOCIETY_BOUNDARIES = ${JSON.stringify(collection)};\n`);
console.log(`Generated ${collection.features.length} reviewed boundary features.`);
