(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const dataset = Array.isArray(window.SOCIETIES_DATA) ? window.SOCIETIES_DATA : [];
  const boundaries = window.SOCIETY_BOUNDARIES || { type: "FeatureCollection", features: [] };
  const config = window.MAP_CONFIG || {};

  const categoryColors = {
    Residential: "#3189ff",
    Commercial: "#ff9f43",
    "Mixed Development": "#b884ff",
    Luxury: "#e7b96a",
    Hotel: "#e7b96a",
    Government: "#43d38b"
  };

  const state = {
    search: "",
    area: "all",
    category: "all",
    statuses: new Set(["Developed", "Developing", "Upcoming", "Needs review"]),
    verifiedOnly: false,
    sort: "name",
    selectedId: null,
    filtered: dataset.slice(),
    markers: new Map(),
    markerGroup: null,
    heatLayer: null,
    boundaryLayer: null,
    measureLayer: null,
    measurePoints: [],
    measuring: false,
    map: null,
    baseLayers: {},
    currentBase: "road"
  };

  const els = {
    search: $("#searchInput"), suggestions: $("#searchSuggestions"), list: $("#societyList"),
    resultCount: $("#resultCount"), resultSummary: $("#resultSummary"), area: $("#areaFilter"),
    verifiedOnly: $("#verifiedOnlyFilter"), sort: $("#sortSelect"), detail: $("#detailDrawer"),
    detailContent: $("#detailContent"), visibleCount: $("#visibleMapCount"),
    measureReadout: $("#measureReadout"), measureValue: $("#measureValue"),
    sidebar: $("#sidebar"), modal: $("#aboutModal"), toast: $("#toastRegion")
  };

  function setMobileSidebar(open) {
    const button = $("#mobilePanelButton");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const shouldOpen = mobile && open;
    if (mobile && !shouldOpen && els.sidebar.contains(document.activeElement)) button.focus({ preventScroll: true });
    els.sidebar.classList.toggle("open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
    if (mobile && !shouldOpen) {
      els.sidebar.setAttribute("inert", "");
      els.sidebar.setAttribute("aria-hidden", "true");
    } else {
      els.sidebar.removeAttribute("inert");
      els.sidebar.removeAttribute("aria-hidden");
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function categoryClass(category) {
    return String(category || "Residential").replace(/\s+/g, "-");
  }

  function formatCoordinate(value) {
    return Number(value).toFixed(5);
  }

  function formatDistance(km) {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
  }

  function haversine(a, b) {
    const toRad = (degrees) => degrees * Math.PI / 180;
    const earthRadius = 6371.0088;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function projectSearchText(project) {
    return normalize([
      project.name, project.city, project.area, project.category, project.developer,
      project.development_status, ...(project.nearby_landmarks || []), ...(project.aliases || [])
    ].join(" "));
  }

  function filterProjects() {
    const query = normalize(state.search.trim());
    state.filtered = dataset.filter((project) => {
      if (query && !projectSearchText(project).includes(query)) return false;
      if (state.area !== "all" && project.area !== state.area) return false;
      if (state.category !== "all" && project.category !== state.category) return false;
      if (!state.statuses.has(project.development_status)) return false;
      if (state.verifiedOnly && !project.verified) return false;
      return true;
    });

    state.filtered.sort((a, b) => {
      if (state.sort === "status") return a.development_status.localeCompare(b.development_status) || a.name.localeCompare(b.name);
      if (state.sort === "area") return a.area.localeCompare(b.area) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
    renderList();
    updateMarkers();
    updateCounts();
  }

  function renderList() {
    els.resultCount.textContent = state.filtered.length;
    els.resultSummary.textContent = state.filtered.length === dataset.length ? "Showing all unique map records" : `${state.filtered.length} of ${dataset.length} map records`;
    if (!state.filtered.length) {
      els.list.innerHTML = '<div class="empty-state"><b>No projects match.</b><span>Try clearing one or more filters.</span></div>';
      return;
    }
    els.list.innerHTML = state.filtered.map((project) => {
      const color = project.verified ? (categoryColors[project.category] || categoryColors.Residential) : "#ff6b6b";
      return `<button class="society-card${project.id === state.selectedId ? " active" : ""}" type="button" data-project-id="${escapeHtml(project.id)}" style="--category-color:${color}">
        <i class="society-card__pin" aria-hidden="true"></i>
        <span class="society-card__copy"><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.city)} · ${escapeHtml(project.category)}</span></span>
        <span class="society-card__meta"><b>${escapeHtml(project.development_status)}</b><i class="${project.verified ? "" : "review"}" title="${project.verified ? "Source-backed position" : "Needs manual location review"}"></i></span>
      </button>`;
    }).join("");
  }

  function markerIcon(project, selected = false) {
    const verifiedClass = project.verified ? "" : " marker-pin--review";
    const selectedClass = selected ? " marker-pin--selected" : "";
    return L.divIcon({
      className: "property-marker",
      html: `<span class="marker-pin marker-pin--${categoryClass(project.category)}${verifiedClass}${selectedClass}"></span>`,
      iconSize: [24, 30], iconAnchor: [12, 29], popupAnchor: [0, -29]
    });
  }

  function popupHtml(project) {
    return `<div class="map-popup">
      <span class="popup-kicker">${escapeHtml(project.category)} · ${escapeHtml(project.development_status)}</span>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.city)} · ${project.verified ? "Source-backed position" : "Position needs review"}</p>
      <button type="button" data-popup-project="${escapeHtml(project.id)}">Open intelligence card</button>
    </div>`;
  }

  function initMap() {
    if (!window.L) {
      $("#map").innerHTML = '<div class="empty-state" style="position:absolute;inset:0;display:grid;place-content:center"><b>Map library unavailable</b><span>Connect to the internet, then reload. The project catalogue remains available in the explorer.</span></div>';
      showToast("Map tiles need an internet connection. The catalogue is still available.", 6000);
      return;
    }

    const initial = config.initialView || { center: [33.66, 72.93], zoom: 10 };
    state.map = L.map("map", { center: initial.center, zoom: initial.zoom, minZoom: initial.minZoom || 7, maxZoom: initial.maxZoom || 19, zoomControl: true });
    Object.entries(config.tileLayers || {}).forEach(([key, layerConfig]) => {
      state.baseLayers[key] = L.tileLayer(layerConfig.url, layerConfig.options || {});
    });
    (state.baseLayers.road || Object.values(state.baseLayers)[0]).addTo(state.map);
    state.markerGroup = L.markerClusterGroup ? L.markerClusterGroup({
      showCoverageOnHover: false, maxClusterRadius: 46, spiderfyOnMaxZoom: true, disableClusteringAtZoom: 16
    }) : L.layerGroup();
    state.markerGroup.addTo(state.map);
    state.boundaryLayer = L.geoJSON(boundaries, {
      style: () => ({ color: "#27d8e7", weight: 2, fillColor: "#27d8e7", fillOpacity: .1, dashArray: "7 5" }),
      onEachFeature: (feature, layer) => layer.bindTooltip(feature.properties?.name || "Reviewed boundary")
    });
    state.measureLayer = L.layerGroup().addTo(state.map);

    dataset.forEach((project) => {
      const marker = L.marker([project.coordinates.lat, project.coordinates.lng], { icon: markerIcon(project), title: project.name, keyboard: true });
      marker.bindPopup(popupHtml(project), { closeButton: false, offset: [0, -2] });
      marker.on("click", () => selectProject(project.id, { pan: false, openPopup: false }));
      state.markers.set(project.id, marker);
    });
    updateMarkers();

    state.map.on("moveend zoomend", updateVisibleCount);
    state.map.on("popupopen", () => {
      const button = $("[data-popup-project]");
      if (button) button.addEventListener("click", () => selectProject(button.dataset.popupProject));
    });
    state.map.on("click", handleMeasureClick);
    setTimeout(() => state.map.invalidateSize(), 50);
  }

  function updateMarkers() {
    if (!state.map || !state.markerGroup) return;
    state.markerGroup.clearLayers();
    state.filtered.forEach((project) => {
      const marker = state.markers.get(project.id);
      if (marker) {
        marker.setIcon(markerIcon(project, project.id === state.selectedId));
        state.markerGroup.addLayer(marker);
      }
    });
    if (state.heatLayer && state.map.hasLayer(state.heatLayer)) refreshHeatmap(true);
    updateVisibleCount();
  }

  function updateVisibleCount() {
    if (!state.map) { els.visibleCount.textContent = state.filtered.length; return; }
    const bounds = state.map.getBounds();
    els.visibleCount.textContent = state.filtered.filter((project) => bounds.contains([project.coordinates.lat, project.coordinates.lng])).length;
  }

  function updateCounts() {
    const verified = dataset.filter((item) => item.verified).length;
    $("#briefCount").textContent = window.DATASET_META?.brief_entry_count || 100;
    $("#uniqueCount").textContent = dataset.length;
    $("#verifiedCount").textContent = verified;
    $("#reviewCount").textContent = dataset.length - verified;
  }

  function selectProject(id, options = {}) {
    const project = dataset.find((item) => item.id === id);
    if (!project) return;
    state.selectedId = id;
    renderList();
    if (state.map) {
      state.markers.forEach((marker, markerId) => {
        const markerProject = dataset.find((item) => item.id === markerId);
        marker.setIcon(markerIcon(markerProject, markerId === id));
      });
      if (options.pan !== false) state.map.flyTo([project.coordinates.lat, project.coordinates.lng], Math.max(state.map.getZoom(), 15), { duration: .8 });
      const marker = state.markers.get(id);
      if (marker && options.openPopup !== false) setTimeout(() => marker.openPopup(), 500);
      revealProjectBoundary(id);
    }
    renderDetail(project);
    els.detail.hidden = false;
    els.detail.classList.add("open");
    els.detail.setAttribute("aria-hidden", "false");
    setMobileSidebar(false);
  }

  function closeDetail() {
    if (els.detail.contains(document.activeElement)) $("#map").focus({ preventScroll: true });
    els.detail.classList.remove("open");
    els.detail.setAttribute("aria-hidden", "true");
    els.detail.hidden = true;
    state.selectedId = null;
    renderList();
    if (state.map) {
      state.markers.forEach((marker, markerId) => marker.setIcon(markerIcon(dataset.find((item) => item.id === markerId))));
    }
  }

  function nearestProjects(project, limit = 4) {
    return dataset.filter((item) => item.id !== project.id).map((item) => ({ project: item, distance: haversine(project.coordinates, item.coordinates) })).sort((a, b) => a.distance - b.distance).slice(0, limit);
  }

  function renderDetail(project) {
    const sources = project.verification_sources || [];
    const nearby = nearestProjects(project);
    const hasBoundary = boundaries.features.some((feature) => feature.properties?.project_id === project.id);
    const sourceItems = sources.length ? sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener"><b>${escapeHtml(source.label)}</b><span>Open ↗</span></a></li>`).join("") : '<li><span>No precise public source was accepted; manual review required.</span></li>';
    const landmarks = (project.nearby_landmarks || []).map((landmark) => `<li><b>${escapeHtml(landmark)}</b><span>Nearby context</span></li>`).join("") || '<li><span>Nearby landmarks require review.</span></li>';
    const nearbyItems = nearby.map(({ project: item, distance }) => `<li><button type="button" data-nearby-id="${escapeHtml(item.id)}"><b>${escapeHtml(item.name)}</b><span>${formatDistance(distance)}</span></button></li>`).join("");
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.coordinates.lat},${project.coordinates.lng}`)}`;
    els.detailContent.innerHTML = `
      <div class="detail-hero"><div class="detail-hero__copy"><span class="type-pill">${escapeHtml(project.category)}</span><h2>${escapeHtml(project.name)}</h2><p>${escapeHtml(project.city)} · ${escapeHtml(project.area)}</p></div></div>
      <div class="detail-body">
        <div class="confidence-card${project.verified ? "" : " review"}"><i>${project.verified ? "✓" : "!"}</i><div><strong>${project.verified ? "Source-backed map position" : "Location needs manual review"}</strong><span>${escapeHtml(project.verification_note || project.notes || "Research confidence is disclosed for this marker.")}</span></div></div>
        <div class="detail-grid">
          <div><span>Developer</span><b>${escapeHtml(project.developer || "Not confirmed")}</b></div>
          <div><span>Status</span><b>${escapeHtml(project.development_status)}</b></div>
          <div><span>Latitude</span><b>${formatCoordinate(project.coordinates.lat)}</b></div>
          <div><span>Longitude</span><b>${formatCoordinate(project.coordinates.lng)}</b></div>
        </div>
        <section class="detail-section"><h3>Location context</h3><ul class="landmark-list">${landmarks}</ul></section>
        <section class="detail-section"><h3>Investment context</h3><p>${escapeHtml(project.investment_notes || "Compare access, approvals, on-ground development and resale liquidity before making any decision. No financial recommendation is implied.")}</p></section>
        <section class="detail-section"><h3>Nearby projects</h3><ul class="nearby-list">${nearbyItems}</ul></section>
        <section class="detail-section"><h3>Verification sources</h3><ul class="source-list">${sourceItems}</ul></section>
        ${project.source_occurrences?.length > 1 ? `<section class="detail-section"><h3>Duplicate handling</h3><p>This name appears ${project.source_occurrences.length} times in the supplied brief (rows ${project.source_occurrences.join(" and ")}). It is represented by one profile and one marker.</p></section>` : ""}
        <div class="detail-actions"><a class="primary-button" style="display:grid;place-content:center;text-decoration:none" href="${googleMapsUrl}" target="_blank" rel="noopener">Open Google Maps ↗</a><button class="secondary-button" id="detailBoundaryButton" type="button" ${hasBoundary ? "" : "disabled"}>${hasBoundary ? "View boundary" : "No reviewed boundary"}</button></div>
      </div>`;
    $$('[data-nearby-id]', els.detailContent).forEach((button) => button.addEventListener("click", () => selectProject(button.dataset.nearbyId)));
    const boundaryButton = $("#detailBoundaryButton");
    if (boundaryButton && hasBoundary) boundaryButton.addEventListener("click", () => revealProjectBoundary(project.id, true));
  }

  function revealProjectBoundary(projectId, zoom = false) {
    if (!state.map || !state.boundaryLayer) return;
    const matches = boundaries.features.filter((feature) => feature.properties?.project_id === projectId);
    if (!matches.length) return;
    if (!state.map.hasLayer(state.boundaryLayer)) {
      state.boundaryLayer.addTo(state.map);
      $("#boundaryButton").setAttribute("aria-pressed", "true");
    }
    if (zoom) {
      const layer = L.geoJSON({ type: "FeatureCollection", features: matches });
      state.map.fitBounds(layer.getBounds(), { padding: [40, 40] });
    }
  }

  function fitVisible() {
    if (!state.map || !state.filtered.length) return;
    const bounds = L.latLngBounds(state.filtered.map((project) => [project.coordinates.lat, project.coordinates.lng]));
    state.map.fitBounds(bounds, { paddingTopLeft: [40, 90], paddingBottomRight: [40, 100], maxZoom: 14 });
  }

  function refreshHeatmap(preserve = false) {
    if (!state.map || !L.heatLayer) {
      if (!preserve) showToast("Heatmap support is unavailable.");
      return;
    }
    const wasVisible = state.heatLayer && state.map.hasLayer(state.heatLayer);
    if (state.heatLayer) state.map.removeLayer(state.heatLayer);
    state.heatLayer = L.heatLayer(state.filtered.map((project) => [project.coordinates.lat, project.coordinates.lng, project.verified ? .7 : .35]), {
      radius: 28, blur: 22, maxZoom: 14, gradient: { .2: "#245de8", .5: "#27d8e7", .75: "#e7b96a", 1: "#ff6b6b" }
    });
    if (preserve || !wasVisible) state.heatLayer.addTo(state.map);
  }

  function toggleHeat(button) {
    if (!state.map) return;
    const pressed = button.getAttribute("aria-pressed") === "true";
    if (pressed && state.heatLayer) state.map.removeLayer(state.heatLayer);
    else refreshHeatmap();
    button.setAttribute("aria-pressed", String(!pressed));
  }

  function toggleBoundaries(button) {
    if (!state.map || !state.boundaryLayer) return;
    const pressed = button.getAttribute("aria-pressed") === "true";
    if (pressed) state.map.removeLayer(state.boundaryLayer); else state.boundaryLayer.addTo(state.map);
    button.setAttribute("aria-pressed", String(!pressed));
    if (!boundaries.features.length && !pressed) showToast("No public boundary geometry passed the review threshold.", 4500);
  }

  function toggleMeasure(button) {
    state.measuring = !state.measuring;
    button.setAttribute("aria-pressed", String(state.measuring));
    els.measureReadout.hidden = !state.measuring;
    if (state.map) state.map.getContainer().style.cursor = state.measuring ? "crosshair" : "";
    if (state.measuring) showToast("Click points on the map to measure a route.");
  }

  function handleMeasureClick(event) {
    if (!state.measuring || !state.map) return;
    state.measurePoints.push({ lat: event.latlng.lat, lng: event.latlng.lng });
    L.circleMarker(event.latlng, { radius: 5, color: "#27d8e7", fillColor: "#07111f", fillOpacity: 1, weight: 2 }).addTo(state.measureLayer);
    if (state.measurePoints.length > 1) L.polyline(state.measurePoints.map((point) => [point.lat, point.lng]), { color: "#27d8e7", weight: 2, dashArray: "7 5" }).addTo(state.measureLayer);
    const distance = state.measurePoints.slice(1).reduce((total, point, index) => total + haversine(state.measurePoints[index], point), 0);
    els.measureValue.textContent = state.measurePoints.length < 2 ? "Select another point" : `${formatDistance(distance)} · ${state.measurePoints.length} points`;
  }

  function clearMeasure() {
    state.measurePoints = [];
    if (state.measureLayer) state.measureLayer.clearLayers();
    els.measureValue.textContent = "Click two or more points";
  }

  function locateUser() {
    if (!state.map || !navigator.geolocation) { showToast("Location is not available in this browser."); return; }
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = [position.coords.latitude, position.coords.longitude];
      L.circle(latlng, { radius: position.coords.accuracy, color: "#27d8e7", fillOpacity: .08 }).addTo(state.map);
      L.circleMarker(latlng, { radius: 6, color: "#fff", fillColor: "#27d8e7", fillOpacity: 1 }).addTo(state.map).bindTooltip("Your location").openTooltip();
      state.map.flyTo(latlng, 14);
    }, () => showToast("Location permission was unavailable."), { enableHighAccuracy: true, timeout: 8000 });
  }

  function switchBaseLayer(key) {
    if (!state.map || !state.baseLayers[key]) return;
    if (state.baseLayers[state.currentBase]) state.map.removeLayer(state.baseLayers[state.currentBase]);
    state.baseLayers[key].addTo(state.map);
    state.baseLayers[key].bringToBack();
    state.currentBase = key;
    $$(".layer-option").forEach((label) => label.classList.toggle("active", $("input", label).value === key));
  }

  function renderSuggestions() {
    const query = normalize(els.search.value.trim());
    if (!query) { els.suggestions.hidden = true; return; }
    const matches = dataset.filter((project) => projectSearchText(project).includes(query)).slice(0, 8);
    if (!matches.length) { els.suggestions.hidden = true; return; }
    els.suggestions.innerHTML = matches.map((project) => `<button class="suggestion" role="option" type="button" data-suggestion-id="${escapeHtml(project.id)}"><i class="dot" style="background:${project.verified ? (categoryColors[project.category] || categoryColors.Residential) : "#ff6b6b"}"></i><span><b>${escapeHtml(project.name)}</b><small>${escapeHtml(project.city)} · ${escapeHtml(project.category)}</small></span><small>${project.verified ? "Verified" : "Review"}</small></button>`).join("");
    els.suggestions.hidden = false;
    $$('[data-suggestion-id]', els.suggestions).forEach((button) => button.addEventListener("click", () => {
      els.search.value = dataset.find((item) => item.id === button.dataset.suggestionId)?.name || "";
      els.suggestions.hidden = true;
      state.search = "";
      filterProjects();
      selectProject(button.dataset.suggestionId);
    }));
  }

  function resetFilters() {
    state.search = ""; state.area = "all"; state.category = "all"; state.verifiedOnly = false; state.sort = "name";
    state.statuses = new Set(["Developed", "Developing", "Upcoming", "Needs review"]);
    els.search.value = ""; els.area.value = "all"; els.verifiedOnly.checked = false; els.sort.value = "name";
    $$("#categoryFilters .segment").forEach((button) => button.classList.toggle("active", button.dataset.category === "all"));
    $$("#statusFilters input").forEach((input) => { input.checked = true; });
    filterProjects();
    fitVisible();
  }

  function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast"; toast.textContent = message;
    els.toast.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $(".theme-icon").textContent = theme === "dark" ? "☼" : "◐";
    try { localStorage.setItem("axis-theme", theme); } catch (_) {}
  }

  function bindEvents() {
    let searchTimer;
    els.search.addEventListener("input", () => {
      renderSuggestions();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.search = els.search.value; filterProjects(); }, 120);
    });
    els.search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") els.suggestions.hidden = true;
      if (event.key === "Enter") {
        const first = $("[data-suggestion-id]", els.suggestions);
        if (first && !els.suggestions.hidden) { event.preventDefault(); first.click(); }
      }
    });
    document.addEventListener("click", (event) => { if (!event.target.closest(".global-search")) els.suggestions.hidden = true; });
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); els.search.focus(); }
      if (event.key === "Escape") { closeDetail(); setMobileSidebar(false); }
    });
    els.area.addEventListener("change", () => { state.area = els.area.value; filterProjects(); });
    els.verifiedOnly.addEventListener("change", () => { state.verifiedOnly = els.verifiedOnly.checked; filterProjects(); });
    els.sort.addEventListener("change", () => { state.sort = els.sort.value; filterProjects(); });
    $("#categoryFilters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]"); if (!button) return;
      state.category = button.dataset.category;
      $$("#categoryFilters .segment").forEach((item) => item.classList.toggle("active", item === button));
      filterProjects();
    });
    $("#statusFilters").addEventListener("change", () => {
      state.statuses = new Set($$("#statusFilters input:checked").map((input) => input.value)); filterProjects();
    });
    els.list.addEventListener("click", (event) => { const card = event.target.closest("[data-project-id]"); if (card) selectProject(card.dataset.projectId); });
    $("#clearFiltersButton").addEventListener("click", resetFilters);
    $("#homeButton").addEventListener("click", () => { closeDetail(); resetFilters(); });
    $("#closeDetailButton").addEventListener("click", closeDetail);
    $("#fitButton").addEventListener("click", fitVisible);
    $("#heatButton").addEventListener("click", (event) => toggleHeat(event.currentTarget));
    $("#boundaryButton").addEventListener("click", (event) => toggleBoundaries(event.currentTarget));
    $("#measureButton").addEventListener("click", (event) => toggleMeasure(event.currentTarget));
    $("#clearMeasureButton").addEventListener("click", clearMeasure);
    $("#locateButton").addEventListener("click", locateUser);
    $$("input[name=basemap]").forEach((input) => input.addEventListener("change", () => switchBaseLayer(input.value)));
    $("#layerCardToggle").addEventListener("click", (event) => {
      const card = event.currentTarget.closest(".layer-card"); const collapsed = card.classList.toggle("collapsed"); event.currentTarget.setAttribute("aria-expanded", String(!collapsed));
    });
    $("#themeButton").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    $("#mobilePanelButton").addEventListener("click", () => setMobileSidebar(true));
    $("#closeSidebarButton").addEventListener("click", () => setMobileSidebar(false));
    window.matchMedia("(max-width: 760px)").addEventListener("change", () => setMobileSidebar(false));
    $("#aboutButton").addEventListener("click", () => { els.modal.hidden = false; });
    [$("#closeAboutButton"), $("#acceptAboutButton")].forEach((button) => button.addEventListener("click", () => { els.modal.hidden = true; }));
    els.modal.addEventListener("click", (event) => { if (event.target === els.modal) els.modal.hidden = true; });
  }

  function validateDataset() {
    const ids = new Set(); const coordinates = new Set(); const errors = [];
    dataset.forEach((project, index) => {
      if (!project.id || !project.name) errors.push(`Record ${index + 1} lacks an id or name.`);
      if (ids.has(project.id)) errors.push(`Duplicate id: ${project.id}`); ids.add(project.id);
      const { lat, lng } = project.coordinates || {};
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 23 || lat > 38 || lng < 60 || lng > 78) errors.push(`Invalid coordinates: ${project.name}`);
      const key = `${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
      if (coordinates.has(key)) errors.push(`Shared coordinates require review: ${project.name}`); coordinates.add(key);
    });
    if (errors.length) console.warn("Dataset validation notices", errors);
    return errors;
  }

  function init() {
    try { setTheme(localStorage.getItem("axis-theme") || "dark"); } catch (_) { setTheme("dark"); }
    bindEvents(); setMobileSidebar(false); validateDataset(); renderList(); updateCounts(); initMap(); filterProjects();
    $("#researchDate").textContent = window.DATASET_META?.researched_at_display || "23 Aug 2026";
    if (!dataset.length) showToast("The project dataset could not be loaded.", 6000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
