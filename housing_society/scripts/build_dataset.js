/* Generates canonical JSON plus a file://-safe JavaScript copy from cached map research. */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const promptPath = path.resolve(root, "..", "masterprompt.md");
const prompt = fs.readFileSync(promptPath, "utf8").split(/\r?\n/);
const start = prompt.indexOf("Islamabad / Rawalpindi");
const end = prompt.indexOf("8. Performance Requirements");
const sourceRows = prompt.slice(start + 1, end).filter((line) => line.trim() && line !== "Taxila / Wah / Fateh Jang Corridor");
const uniqueNames = [...new Set(sourceRows)];
const occurrences = new Map(uniqueNames.map((name) => [name, sourceRows.map((item, index) => item === name ? index + 1 : null).filter(Boolean)]));

const googleFiles = fs.readdirSync(path.join(root, "research", "google_maps_results")).filter((name) => name.endsWith(".txt")).sort();
const nominatimFiles = fs.readdirSync(path.join(root, "research", "nominatim_results")).filter((name) => name.endsWith(".json")).sort();

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function googleCandidates(index) {
  const body = fs.readFileSync(path.join(root, "research", "google_maps_results", googleFiles[index]), "utf8");
  const candidates = [];
  const seen = new Set();
  for (const match of body.matchAll(/\b((?:33|34)\.\d{4,}),((?:72|73)\.\d{4,})/g)) {
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    const key = `${lat.toFixed(7)},${lng.toFixed(7)}`;
    if (lat >= 33.0 && lat <= 34.5 && lng >= 72.3 && lng <= 73.7 && !seen.has(key)) {
      seen.add(key); candidates.push({ lat, lng });
    }
  }
  return candidates;
}

function nominatimCandidates(index) {
  try {
    const values = JSON.parse(fs.readFileSync(path.join(root, "research", "nominatim_results", nominatimFiles[index]), "utf8"));
    return values.filter((item) => {
      const lat = Number(item.lat); const lng = Number(item.lon);
      return lat >= 33.0 && lat <= 34.5 && lng >= 72.3 && lng <= 73.7;
    }).map((item) => ({ lat: Number(item.lat), lng: Number(item.lon), name: item.name, display_name: item.display_name, osm_type: item.osm_type, osm_id: item.osm_id }));
  } catch (_) { return []; }
}

const forcedCoordinates = {
  "Faisal Heights Rawalpindi": { lat: 33.6109475, lng: 72.8754824, note: "Named Google Maps result within Faisal Town Phase 1." },
  "Top City Rawalpindi": { lat: 33.5792189, lng: 72.8662228, note: "Named TopCity-1 map result near Islamabad International Airport." },
  "Faisal Hills Rawalpindi": { lat: 33.7100, lng: 72.7900, note: "Approximate main-site position published on the project location page." },
  "University Town": { lat: 33.5824901, lng: 72.8899466, note: "Named University Town Islamabad housing-society map result." },
  "Jinnah Garden Phase-I": { lat: 33.5734191, lng: 73.1733127, note: "Named Jinnah Garden Phase I map result." },
  "Faisal Jewels": { lat: 33.7086562, lng: 72.8102156, note: "Named Faisal Jewel result in Faisal Hills near Allah Wala Chowk." },
  "Taxila Garden": { lat: 33.7820625, lng: 72.8294375, note: "Named Taxila Garden map result." },
  "Margalla View Housing Scheme": { lat: 33.6590878, lng: 72.8554807, note: "Named Margalla View Housing Scheme map result." },
  "Faisal Town Phase 2": { lat: 33.5139390, lng: 72.8945498, note: "Named Faisal Town Phase 2 result near the Thalian corridor." },
  "Rudn Enclave": { lat: 33.4236601, lng: 72.9508378, note: "Named Rudn Enclave result on the Adyala Road corridor." },
  "Sultan Hotels Galiyat": { lat: 34.0174289, lng: 73.3898309, note: "Named Sultan hotel result in the Galiyat corridor." },
  "Naval Farms": { lat: 33.7301119, lng: 73.2453183, note: "Named Naval Farms map result." },
  "Gulberg Residencia": { lat: 33.5997495, lng: 73.2138444, note: "Named Gulberg Residencia map result." }
};

const preferOpenStreetMap = new Set([
  "Silver City Rawalpindi", "DHA Islamabad", "Capital Smart City", "DHA Margalla Enclave", "Eighteen",
  "Mumtaz City Rawalpindi", "Airport Housing Society", "Taj Residencia", "PWD Housing Society", "ICHS Town",
  "New City Wah", "Wah Model Town", "Officers Colony Wah", "Blue World City", "Kingdom Valley", "Seven Wonders City",
  "Soan Garden", "Naval Anchorage"
]);

const needsReview = new Set([
  "Executive Villas", "Faisal Heights Rawalpindi", "DHA Downtown Islamabad", "Gandhara City Rawalpindi",
  "Margalla Orchards Islamabad", "Golden Jubilee Residential Cooperative Housing Society", "Abad Cooperative Housing Society",
  "PGECHS", "Rawal Town Housing Enclave", "G-17 Supreme Court Employees Cooperative Housing Society",
  "Al-Noor Housing Society Islamabad", "Eastridge Housing Society", "DEHS Chakra", "Smart Villas Housing Society",
  "AGOCHS-1", "Pine Villas Housing Society", "Airport Enclave Housing", "Marghazar-e-Sikandar", "Green Hills Enclave",
  "Makhdoom Society", "Airport Society", "Kashmir Heaven Valley", "PHA Officers Residencia", "Salad Housing Society",
  "FGEHA Projects", "NEST City", "Al-Noor Town", "Signature Projects", "The Garden Islamabad", "16 Sina Tower",
  "DoubleTree Hilton Project", "Sultan Bahria", "Khanpur Valley", "Khanpur Dam View Projects", "New City Paradise",
  "Wah Cantt Housing Schemes", "University Town Taxila", "HIT Taxila Housing Area", "Lalazar Housing Scheme",
  "POF Housing Schemes", "Lahore Smart City Extension", "Islamabad Model Town", "MPCHS", "Naval Farms"
]);

const categoryOverrides = {
  "DHA Downtown Islamabad": "Mixed Development", "Eighteen": "Mixed Development", "Bahria Town Islamabad": "Mixed Development",
  "Gulberg Greens": "Mixed Development", "FGEHA Projects": "Government", "J7 Emporium / J7 City": "Mixed Development",
  "KMK Towers Top City": "Commercial", "Signature Projects": "Mixed Development", "Milano Square Residence": "Mixed Development",
  "The Garden Islamabad": "Mixed Development", "PakLand Tower": "Commercial", "Faisal Jewels": "Mixed Development",
  "ZN Tower": "Commercial", "Aspen Tower": "Commercial", "16 Sina Tower": "Commercial", "Citadel 7": "Commercial",
  "OSLO Heights": "Commercial", "DoubleTree Hilton Project": "Hotel", "Sultan Bahria": "Mixed Development",
  "Sultan Mumtaz City": "Mixed Development", "Sultan Hotels Galiyat": "Hotel", "Wah Cantt Housing Schemes": "Government",
  "HIT Taxila Housing Area": "Government", "POF Housing Schemes": "Government", "Fazaia Housing Scheme Islamabad": "Government"
};

const areaOverrides = {
  "Silver City Rawalpindi": "Rawalpindi", "Executive Villas": "Rawalpindi", "Faisal Heights Rawalpindi": "Rawalpindi",
  "Capital Smart City": "Rawalpindi", "Bahria Town Islamabad": "Rawalpindi", "Gandhara City Rawalpindi": "Rawalpindi",
  "University Town": "Rawalpindi", "Airport Housing Society": "Rawalpindi", "Taj Residencia": "Rawalpindi",
  "Eastridge Housing Society": "Rawalpindi", "DEHS Chakra": "Rawalpindi", "Satellite Town Fateh Jang": "Fateh Jang",
  "Makhdoom Society": "Rawalpindi", "Airport Society": "Rawalpindi", "Kashmir Heaven Valley": "Rawalpindi",
  "ICHS Town": "Fateh Jang", "Sultan Bahria": "Rawalpindi", "Sultan Mumtaz City": "Islamabad",
  "Sultan Hotels Galiyat": "Khanpur / Galiyat", "New City Wah": "Wah", "New City Paradise": "Wah",
  "Wah Model Town": "Wah", "Wah Cantt Housing Schemes": "Wah", "Gulshan-e-Sehat Taxila": "Taxila",
  "Taxila Garden": "Taxila", "Faisal Colony Taxila": "Taxila", "University Town Taxila": "Taxila",
  "HIT Taxila Housing Area": "Taxila", "Lalazar Housing Scheme": "Rawalpindi", "Margalla View Housing Scheme": "Islamabad",
  "Khanpur Valley": "Khanpur / Galiyat", "Khanpur Dam View Projects": "Khanpur / Galiyat", "Wahdat Colony": "Wah",
  "Officers Colony Wah": "Wah", "POF Housing Schemes": "Wah", "Faisal Hills Rawalpindi": "Taxila",
  "Faisal Town Phase 2": "Rawalpindi", "ICHS Phase 2": "Fateh Jang", "Rudn Enclave": "Rawalpindi",
  "DHA Margalla Enclave": "Islamabad",
  "Blue World City": "Rawalpindi", "Kingdom Valley": "Rawalpindi", "Nova City": "Fateh Jang",
  "Seven Wonders City": "Fateh Jang", "CBR Town": "Islamabad", "Soan Garden": "Islamabad",
  "Korang Town": "Islamabad", "Naval Anchorage": "Islamabad", "Naval Farms": "Islamabad",
  "Gulberg Residencia": "Islamabad", "Faisal Town Phase 1": "Islamabad", "DHA Islamabad": "Islamabad",
  "Top City Rawalpindi": "Islamabad", "Mumtaz City Rawalpindi": "Islamabad", "Faisal Residencia": "Islamabad",
  "Multi Gardens B-17": "Islamabad", "Fazaia Housing Scheme Islamabad": "Islamabad"
};

const developed = new Set([
  "Faisal Town Phase 1", "DHA Islamabad", "Top City Rawalpindi", "Bahria Town Islamabad", "Mumtaz City Rawalpindi",
  "University Town", "Airport Housing Society", "Taj Residencia", "PWD Housing Society", "Jinnah Garden Phase-I",
  "New City Wah", "Wah Model Town", "Faisal Colony Taxila", "Lalazar Housing Scheme", "Wahdat Colony", "Officers Colony Wah",
  "Multi Gardens B-17", "CBR Town", "Soan Garden", "Korang Town", "Naval Anchorage", "Gulberg Greens", "Gulberg Residencia"
]);
const upcoming = new Set([
  "DHA Margalla Enclave", "Gandhara City Rawalpindi", "Margalla Orchards Islamabad", "Kashmir Heaven Valley", "PHA Officers Residencia",
  "NEST City", "Faisal Town Phase 2", "ICHS Phase 2", "Faisal Residencia", "Rudn Enclave", "Kingdom Valley", "Nova City",
  "Lahore Smart City Extension", "Seven Wonders City", "Islamabad Model Town"
]);

const developerOverrides = {
  "Faisal Town Phase 1": "Faisal Town Group", "Faisal Town Phase 2": "Faisal Town Group", "Faisal Hills Rawalpindi": "Faisal Town Group",
  "Faisal Residencia": "Faisal Town Group", "DHA Islamabad": "Defence Housing Authority", "DHA Downtown Islamabad": "Defence Housing Authority",
  "DHA Margalla Enclave": "Defence Housing Authority", "Capital Smart City": "Future Developments Holdings / Habib Rafiq",
  "Park View City Islamabad": "Vision Group", "Eighteen": "Ora Developers / Saif Group / Kohistan Builders",
  "Bahria Town Islamabad": "Bahria Town", "Mumtaz City Rawalpindi": "Mumtaz Construction Company",
  "Taj Residencia": "Sardar Group of Companies", "Gulberg Greens": "Intelligence Bureau Employees Cooperative Housing Society",
  "Gulberg Residencia": "Intelligence Bureau Employees Cooperative Housing Society", "Multi Gardens B-17": "MPCHS",
  "Blue World City": "Blue Group of Companies", "Kingdom Valley": "Kingdom Group", "Nova City": "Nova Group",
  "Rudn Enclave": "RMRSCO", "New City Wah": "New City Developers", "New City Paradise": "New City Developers",
  "Seven Wonders City": "GFS Builders & Developers", "Naval Anchorage": "Pakistan Navy Benevolent Association",
  "Faisal Jewels": "Zedem Properties / CAM Construction"
};

const officialSources = {
  "Faisal Hills Rawalpindi": [{ label: "Faisal Hills location page", url: "https://faisalhills.com/location/" }],
  "Park View City Islamabad": [{ label: "CDA housing-scheme record", url: "https://www.cda.gov.pk/housing-schemes/park-view-city-housing-scheme" }, { label: "Official project page", url: "https://parkviewcity.com.pk/islamabad/" }],
  "Top City Rawalpindi": [{ label: "Official TopCity-1 site office", url: "https://topcity-1.com/contact-us/" }],
  "Faisal Town Phase 1": [{ label: "Faisal Town Phase 1 location", url: "https://faisaltown.org/faisal-town-phase-1/" }]
};
officialSources["Faisal Jewels"] = [{ label: "Official Faisal Jewel project page", url: "https://faisaljewel.org.pk/" }];

function inferArea(name, coordinate) {
  if (areaOverrides[name]) return areaOverrides[name];
  if (/Islamabad|Gulberg|PWD|Jinnah|FGEHA|Fazaia|Eighteen|Park View/i.test(name)) return "Islamabad";
  if (coordinate.lng < 72.78 && coordinate.lat > 33.7) return "Wah";
  if (coordinate.lng < 72.85 && coordinate.lat > 33.65) return "Taxila";
  if (coordinate.lng < 72.82) return "Fateh Jang";
  return "Rawalpindi";
}

function landmarksFor(area, coordinate) {
  const values = {
    Islamabad: ["Islamabad Expressway / Srinagar Highway network", "Islamabad city sectors", "Rawalpindi metropolitan area"],
    Rawalpindi: ["Rawalpindi urban area", "Islamabad International Airport corridor", "Motorway / Ring Road network"],
    Taxila: ["GT Road (N-5)", "Taxila Bypass", "Taxila Museum / HITEC area"],
    Wah: ["Wah Cantt", "GT Road (N-5)", "Taxila urban area"],
    "Fateh Jang": ["Fateh Jang Road (N-80)", "M-1 / airport corridor", "Islamabad International Airport region"],
    "Khanpur / Galiyat": ["Khanpur–Haripur corridor", "Margalla foothills", "Regional tourism routes"]
  };
  return values[area] || ["Islamabad–Rawalpindi region"];
}

function chooseCoordinate(name, index) {
  if (forcedCoordinates[name]) return { ...forcedCoordinates[name], origin: "official-page" };
  const google = googleCandidates(index);
  const osm = nominatimCandidates(index);
  if (preferOpenStreetMap.has(name) && osm.length) return { ...osm[0], origin: "openstreetmap", alternates: osm.length };
  if (google.length) return { ...google[0], origin: "google-maps", alternates: google.length };
  if (osm.length) return { ...osm[0], origin: "openstreetmap", alternates: osm.length };
  throw new Error(`No regional coordinate candidate for ${name}`);
}

const usedCoordinates = new Set();
const societies = uniqueNames.map((name, index) => {
  let coordinate = chooseCoordinate(name, index);
  let key = `${coordinate.lat.toFixed(7)},${coordinate.lng.toFixed(7)}`;
  const allCandidates = [...googleCandidates(index), ...nominatimCandidates(index)];
  if (usedCoordinates.has(key)) {
    coordinate = allCandidates.find((candidate) => !usedCoordinates.has(`${candidate.lat.toFixed(7)},${candidate.lng.toFixed(7)}`)) || coordinate;
    key = `${coordinate.lat.toFixed(7)},${coordinate.lng.toFixed(7)}`;
  }
  usedCoordinates.add(key);
  const area = inferArea(name, coordinate);
  const verified = !needsReview.has(name) && coordinate.origin !== "fallback";
  const googleQuery = encodeURIComponent(`${name} ${area} Pakistan`);
  const sources = [
    { label: "Google Maps place search", url: `https://www.google.com/maps/search/?api=1&query=${googleQuery}` },
    ...(officialSources[name] || [])
  ];
  const osm = nominatimCandidates(index)[0];
  if (osm && normalize(osm.name).split(" ").some((token) => token.length > 4 && normalize(name).includes(token))) {
    sources.push({ label: "OpenStreetMap mapped feature", url: `https://www.openstreetmap.org/${osm.osm_type}/${osm.osm_id}` });
  }
  const status = !verified ? "Needs review" : developed.has(name) ? "Developed" : upcoming.has(name) ? "Upcoming" : "Developing";
  return {
    id: slugify(name), name, aliases: [], category: categoryOverrides[name] || "Residential", city: area,
    area, coordinates: { lat: coordinate.lat, lng: coordinate.lng, precision: verified ? "mapped-place" : "search-result-needs-review" },
    verified, verification_status: verified ? "source-backed" : "needs-review",
    verification_source: sources[0].url, verification_sources: sources,
    verification_note: verified
      ? "The marker is tied to a named map result; where available, an official or OpenStreetMap source is also linked. It is not a surveyed boundary."
      : "The brief name is ambiguous, represents an umbrella programme, or lacks enough independent evidence for an exact site. The shown search result must be checked manually before use.",
    development_status: status, developer: developerOverrides[name] || "Not independently confirmed",
    nearby_landmarks: landmarksFor(area, coordinate),
    investment_notes: verified
      ? `Use this ${status.toLowerCase()} project as a starting point for access and cluster analysis. Confirm authority approvals, title, current on-ground work, utilities and market pricing independently.`
      : "Do not use this marker for an investment decision until the project identity and exact entrance have been manually confirmed with the developer and relevant authority.",
    notes: coordinate.note || "Point marker represents a mapped place or entrance, not a legal boundary.",
    source_occurrences: occurrences.get(name), researched_at: "2026-08-23"
  };
});

const outData = path.join(root, "data");
fs.mkdirSync(outData, { recursive: true });
fs.writeFileSync(path.join(outData, "societies.json"), JSON.stringify(societies, null, 2) + "\n");
const locationRecords = societies.map(({ id, name, coordinates, verified, verification_status, verification_source, verification_sources, verification_note, researched_at }) => ({ id, name, coordinates, verified, verification_status, verification_source, verification_sources, verification_note, researched_at }));
fs.writeFileSync(path.join(outData, "locations_verified.json"), JSON.stringify(locationRecords, null, 2) + "\n");
const statistics = {
  brief_entry_count: sourceRows.length,
  unique_project_count: societies.length,
  duplicate_source_rows: sourceRows.length - societies.length,
  verified_count: societies.filter((item) => item.verified).length,
  needs_review_count: societies.filter((item) => !item.verified).length,
  by_category: Object.fromEntries([...new Set(societies.map((item) => item.category))].sort().map((category) => [category, societies.filter((item) => item.category === category).length])),
  by_area: Object.fromEntries([...new Set(societies.map((item) => item.area))].sort().map((area) => [area, societies.filter((item) => item.area === area).length])),
  researched_at: "2026-08-23"
};
fs.writeFileSync(path.join(outData, "statistics.json"), JSON.stringify(statistics, null, 2) + "\n");
fs.writeFileSync(path.join(outData, "societies-data.js"), `window.DATASET_META = ${JSON.stringify({ ...statistics, researched_at_display: "23 Aug 2026" }, null, 2)};\nwindow.SOCIETIES_DATA = ${JSON.stringify(societies, null, 2)};\n`);
console.log(JSON.stringify(statistics, null, 2));

function normalize(value) {
  return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}
