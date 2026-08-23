const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const prompt = fs.readFileSync(path.resolve(root, "..", "masterprompt.md"), "utf8").split(/\r?\n/);
const start = prompt.indexOf("Islamabad / Rawalpindi");
const end = prompt.indexOf("8. Performance Requirements");
const sourceRows = prompt.slice(start + 1, end).filter((line) => line.trim() && line !== "Taxila / Wah / Fateh Jang Corridor");
const uniqueNames = [...new Set(sourceRows)];
const societies = JSON.parse(fs.readFileSync(path.join(root, "data", "societies.json"), "utf8"));
const locations = JSON.parse(fs.readFileSync(path.join(root, "data", "locations_verified.json"), "utf8"));
const statistics = JSON.parse(fs.readFileSync(path.join(root, "data", "statistics.json"), "utf8"));
const boundaries = JSON.parse(fs.readFileSync(path.join(root, "polygons", "society_boundaries.geojson"), "utf8"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(sourceRows.length === 100, `Expected 100 source rows, found ${sourceRows.length}`);
assert(uniqueNames.length === 98, `Expected 98 unique source names, found ${uniqueNames.length}`);
assert(societies.length === uniqueNames.length, `Expected ${uniqueNames.length} society profiles, found ${societies.length}`);
assert(locations.length === societies.length, "Location record count differs from society count");
assert(statistics.brief_entry_count === 100 && statistics.unique_project_count === 98, "Statistics source counts are inconsistent");

const ids = new Set();
const names = new Set();
const coordinates = new Set();
for (const society of societies) {
  assert(!ids.has(society.id), `Duplicate id: ${society.id}`); ids.add(society.id);
  assert(!names.has(society.name), `Duplicate project profile: ${society.name}`); names.add(society.name);
  assert(uniqueNames.includes(society.name), `Profile not found in source brief: ${society.name}`);
  const { lat, lng } = society.coordinates || {};
  assert(Number.isFinite(lat) && lat >= 33 && lat <= 34.5, `Invalid regional latitude for ${society.name}: ${lat}`);
  assert(Number.isFinite(lng) && lng >= 72.3 && lng <= 73.7, `Invalid regional longitude for ${society.name}: ${lng}`);
  const coordinateKey = `${Number(lat).toFixed(7)},${Number(lng).toFixed(7)}`;
  assert(!coordinates.has(coordinateKey), `Duplicate marker coordinate: ${society.name} at ${coordinateKey}`); coordinates.add(coordinateKey);
  assert(["Residential", "Commercial", "Mixed Development", "Hotel", "Government"].includes(society.category), `Invalid category for ${society.name}`);
  assert(["Developed", "Developing", "Upcoming", "Needs review"].includes(society.development_status), `Invalid status for ${society.name}`);
  assert(Array.isArray(society.verification_sources) && society.verification_sources.length > 0, `No verification source for ${society.name}`);
  assert(Array.isArray(society.source_occurrences) && society.source_occurrences.length >= 1, `No source occurrence for ${society.name}`);
  if (society.verified) assert(society.verification_status === "source-backed", `Verified flag mismatch for ${society.name}`);
  else assert(society.development_status === "Needs review", `Unverified project status mismatch for ${society.name}`);
}

for (const name of uniqueNames) assert(names.has(name), `Missing brief project: ${name}`);
assert(societies.find((item) => item.name === "Park View City Islamabad")?.source_occurrences.length === 2, "Park View duplicate occurrence not preserved");
assert(societies.find((item) => item.name === "Gulberg Greens")?.source_occurrences.length === 2, "Gulberg Greens duplicate occurrence not preserved");
assert(boundaries.type === "FeatureCollection", "Boundary file is not GeoJSON FeatureCollection");
assert(boundaries.features.length === 10, `Expected 10 reviewed boundaries, found ${boundaries.features.length}`);
for (const feature of boundaries.features) {
  assert(ids.has(feature.properties?.project_id), `Boundary refers to unknown project: ${feature.properties?.project_id}`);
  assert(["Polygon", "MultiPolygon"].includes(feature.geometry?.type), `Unsupported boundary geometry: ${feature.geometry?.type}`);
  assert(/^https:\/\/www\.openstreetmap\.org\//.test(feature.properties?.source || ""), `Boundary source missing for ${feature.properties?.name}`);
}

for (const required of ["map", "searchInput", "societyList", "detailDrawer", "heatButton", "boundaryButton", "measureButton", "areaFilter"]) {
  assert(html.includes(`id="${required}"`), `Required UI element missing: #${required}`);
}
for (const requiredFile of ["assets/dashboard.css", "assets/dashboard.js", "config/map_config.js", "data/societies-data.js", "data/boundaries-data.js"]) {
  assert(html.includes(requiredFile), `index.html does not load ${requiredFile}`);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Validation passed: ${sourceRows.length} brief rows, ${societies.length} unique markers, ${societies.filter((item) => item.verified).length} source-backed positions, ${boundaries.features.length} reviewed boundaries.`);
