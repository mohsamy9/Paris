/* =========================================================
   app.js — Carte interactive Paris (statique, sans framework)
   - Leaflet via CDN
   - (Optionnel) MarkerCluster via CDN si présent
   - GeoJSON arrondissements : /data/arrondissements.geojson
   - Data lieux : window.places (chargé via data/places.js)
   ========================================================= */

/* -----------------------------
   CONFIG CATÉGORIES (icône + couleur)
----------------------------- */
const categoryConfig = {
  restaurant:   { color: "#ef4444", icon: "🍽️", label: "Restaurant" },
  glacier:      { color: "#38bdf8", icon: "🍦", label: "Glacier" },
  dessert:      { color: "#fb7185", icon: "🍪", label: "Dessert" },
  bar:          { color: "#a78bfa", icon: "🍸", label: "Bar" },
  comedy_club:  { color: "#f59e0b", icon: "🎤", label: "Comedy club" },
  exposition:   { color: "#22c55e", icon: "🖼️", label: "Exposition" },
  arcade:       { color: "#60a5fa", icon: "🎮", label: "Arcade" }
};

/* -----------------------------
   ÉTAT GLOBAL
----------------------------- */
const places = Array.isArray(window.places) ? window.places : [];
let map;
let arrondissementLayer = null;

// Filtre “arrondissement par clic sur polygone”
let activeArrondissement = null;

// Groupe de marqueurs (cluster si dispo)
let markersGroup = null;

// Index markers par id pour zoom depuis la liste
const markerById = new Map();

// Filtres UI (catégories/cuisines multi)
const filterState = {
  categories: new Set(),
  cuisines: new Set()
};

// Résultat courant
let filteredPlaces = [];

/* -----------------------------
   INIT
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  map.on("click", () => closeSidebar());

  initUI();
  renderAll();
});

/* =========================================================
   MAP
========================================================= */
function initMap() {
  map = L.map("map", { zoomControl: true }).setView([48.8566, 2.3522], 12);

  // Tiles OSM
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // MarkerCluster si le plugin est chargé, sinon simple LayerGroup
  if (window.L && L.markerClusterGroup) {
    markersGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 16
    });
  } else {
    markersGroup = L.layerGroup();
  }
  markersGroup.addTo(map);

  loadArrondissements();
  //addCategoryLegend();
}

function loadArrondissements() {
  fetch("data/arrondissements.geojson")
    .then(res => {
      if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.features || data.features.length === 0) {
        console.warn("arrondissements.geojson est présent mais vide (features=[]).");
        return;
      }

      if (arrondissementLayer) map.removeLayer(arrondissementLayer);

      arrondissementLayer = L.geoJSON(data, {
        style: feature => styleArr(feature),
        onEachFeature: (feature, layer) => onEachArrFeature(feature, layer)
      }).addTo(map);
    })
    .catch(err => {
      console.warn("Impossible de charger data/arrondissements.geojson :", err.message);
      console.warn("➡️ Place ton vrai GeoJSON dans /data/arrondissements.geojson");
    });
}

function styleArr(feature) {
  const num = getArrNumber(feature);
  const isActive = activeArrondissement && num === activeArrondissement;

  return {
    color: "#334155",
    weight: isActive ? 2 : 1,
    fillColor: isActive ? "#93c5fd" : "#cbd5e1",
    fillOpacity: isActive ? 0.25 : 0.12
  };
}

function onEachArrFeature(feature, layer) {
  const num = getArrNumber(feature);

  // Tooltip au hover
  if (num) layer.bindTooltip(`${num}ᵉ`, { sticky: true, direction: "top" });

  layer.on({
    mouseover: (e) => e.target.setStyle({ fillOpacity: 0.22 }),
    mouseout:  (e) => e.target.setStyle({ fillOpacity: (activeArrondissement && num === activeArrondissement) ? 0.25 : 0.12 }),
    click: (e) => {
      if (!num) return;
      // Toggle filtre arrondissement
      activeArrondissement = (activeArrondissement === num) ? null : num;

      // Zoom sur l’arrondissement cliqué
      map.fitBounds(e.target.getBounds(), { padding: [20, 20] });

      // Refresh styles
      arrondissementLayer.setStyle(f => styleArr(f));

      // Sync UI (select arrondissement) : on vide le multi-select pour éviter incohérence
      clearArrondissementSelect();

      renderAll();
    }
  });
}

/**
 * Récupère le numéro d'arrondissement depuis properties
 * (robuste à plusieurs formats de GeoJSON)
 */
function getArrNumber(feature) {
  const p = feature.properties || {};

  // Champs directs fréquents
  const direct = p.numero ?? p.c_ar ?? p.arrondissement ?? p.code ?? p.num ?? null;
  const n1 = Number(direct);
  if (Number.isFinite(n1) && n1 >= 1 && n1 <= 20) return n1;

  // INSEE fréquent : 75101..75120
  const insee = p.c_arinsee ?? p.insee ?? p.code_insee ?? null;
  if (insee) {
    const s = String(insee);
    const m = s.match(/751(\d{2})/);
    if (m) {
      const n2 = Number(m[1]);
      if (Number.isFinite(n2) && n2 >= 1 && n2 <= 20) return n2;
    }
  }

  // Nom du type "Paris 11e Arrondissement"
  const name = p.nom ?? p.name ?? "";
  const m2 = String(name).match(/\b(\d{1,2})(?:er|e|ème)?\b/i);
  if (m2) {
    const n3 = Number(m2[1]);
    if (Number.isFinite(n3) && n3 >= 1 && n3 <= 20) return n3;
  }

  return null;
}

/* =========================================================
   UI : filtres, liste, sidebar
========================================================= */
function initUI() {
  // Bouton fermeture sidebar
  const closeBtn = document.getElementById("closeSidebar");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeSidebar());
  }

  // Search
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.addEventListener("input", () => renderAll());

  // Arrondissements (multi-select)
  initArrondissementSelect();


  document.getElementById("sheetOverlay")?.addEventListener("click", closeSidebar);


  // Reset
  const resetBtn = document.getElementById("resetFilters");
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  // Construire filtres dynamiques (catégories/cuisines)
  //buildDynamicFilters();
  renderCategoryLegendLeft();
  initBottomSheet();


}

function initArrondissementSelect() {
  const select = document.getElementById("arrondissementFilter");
  if (!select) return;

  // Remplissage 1..20
  select.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${i}ᵉ`;
    select.appendChild(opt);
  }

  select.addEventListener("change", () => {
    // si l’utilisateur utilise le select, on désactive le filtre “clic polygon”
    activeArrondissement = null;
    if (arrondissementLayer) arrondissementLayer.setStyle(f => styleArr(f));
    renderAll();
  });
}

function clearArrondissementSelect() {
  const select = document.getElementById("arrondissementFilter");
  if (!select) return;
  [...select.options].forEach(o => (o.selected = false));
}

function buildDynamicFilters() {
  // Catégories présentes dans les données
  const categories = uniqSorted(places.map(p => p.category).filter(Boolean));

  // Cuisines présentes
  const cuisines = uniqSorted(
    places.flatMap(p => Array.isArray(p.cuisines) ? p.cuisines : []).filter(Boolean)
  );

  const catContainer = document.getElementById("categoryFilters");
  const cuiContainer = document.getElementById("cuisineFilters");

  if (catContainer) {
    catContainer.innerHTML = "";
    categories.forEach(cat => {
      const cfg = categoryConfig[cat] || { icon: "📍", label: cat, color: "#64748b" };

      const label = document.createElement("label");
      label.className = "checkItem";
      label.innerHTML = `
        <input type="checkbox" data-cat="${escapeHtml(cat)}" />
        <span class="checkText">
          <span class="checkIcon">${cfg.icon}</span>
          <span class="checkLabel">${escapeHtml(cfg.label || cat)}</span>
        </span>
      `;

      const input = label.querySelector("input");
      input.addEventListener("change", (e) => {
        if (e.target.checked) filterState.categories.add(cat);
        else filterState.categories.delete(cat);
        renderAll();
      });

      catContainer.appendChild(label);
    });
  }

  if (cuiContainer) {
    cuiContainer.innerHTML = "";
    cuisines.forEach(cui => {
      const label = document.createElement("label");
      label.className = "checkItem";
      label.innerHTML = `
        <input type="checkbox" data-cui="${escapeHtml(cui)}" />
        <span class="checkText">
          <span class="checkIcon">🍜</span>
          <span class="checkLabel">${escapeHtml(cui)}</span>
        </span>
      `;

      const input = label.querySelector("input");
      input.addEventListener("change", (e) => {
        if (e.target.checked) filterState.cuisines.add(cui);
        else filterState.cuisines.delete(cui);
        renderAll();
      });

      cuiContainer.appendChild(label);
    });
  }
}

function resetFilters() {
  // UI
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  clearArrondissementSelect();

  // checkboxes catégories/cuisines
  document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('#cuisineFilters input[type="checkbox"]').forEach(cb => cb.checked = false);

  // state
  filterState.categories.clear();
  document.querySelectorAll("#categoryLegendLeft .legend-item.active").forEach(el => {
  el.classList.remove("active");
});

  filterState.cuisines.clear();
  activeArrondissement = null;

  // Refresh arr styles
  if (arrondissementLayer) arrondissementLayer.setStyle(f => styleArr(f));

  closeSidebar();
  renderAll();
}

/* =========================================================
   RENDER : filtres -> markers -> list
========================================================= */
function renderAll() {
  filteredPlaces = applyFilters();
  renderMarkers(filteredPlaces);
  renderPlacesList(filteredPlaces);
}

function applyFilters() {
  const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  const selectedCats = filterState.categories.size ? filterState.categories : null;
  //const selectedCuisines = filterState.cuisines.size ? filterState.cuisines : null;

  // Arrondissements multi-select (si pas de clic sur polygone)
  const arrSel = document.getElementById("arrondissementFilter");
  const selectedArrs = arrSel
    ? new Set([...arrSel.selectedOptions].map(o => Number(o.value)))
    : new Set();

  return places.filter(p => {
    // Arrondissement via clic polygone
    if (activeArrondissement && p.arrondissement !== activeArrondissement) return false;

    // Arrondissement via select multi (si pas de clic actif)
    if (!activeArrondissement && selectedArrs.size && !selectedArrs.has(p.arrondissement)) return false;

    // Catégories
    if (selectedCats && !selectedCats.has(p.category)) return false;

    if (selectedArrs.size && !selectedArrs.has(p.arrondissement)) return false;

    // Cuisines (match ANY sélectionnée)
    /*if (selectedCuisines) {
      const pc = new Set(Array.isArray(p.cuisines) ? p.cuisines : []);
      let ok = false;
      selectedCuisines.forEach(c => { if (pc.has(c)) ok = true; });
      if (!ok) return false;
    }*/

    // Recherche texte (nom + tags + cuisines + description)
    if (search) {
      const hay = [
        p.name,
        ...(p.tags || []),
        ...(p.cuisines || []),
        p.description || "",
        p.address || ""
      ].join(" ").toLowerCase();

      if (!hay.includes(search)) return false;
    }

    return true;
  });
}

function renderMarkers(list) {
  markersGroup.clearLayers();
  markerById.clear();

  list.forEach(place => {
    const marker = L.marker([place.lat, place.lng], {
      icon: makeCategoryIcon(place.category),
      title: place.name
    });

    marker.on("click", () => openSidebar(place));
    marker.bindTooltip(place.name, { direction: "top", offset: [0, -18], opacity: 0.95 });

    markersGroup.addLayer(marker);
    markerById.set(place.id, marker);
  });
}

function renderPlacesList(list) {
  const container = document.getElementById("placesList");
  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "emptyState";
    empty.textContent = "Aucun lieu trouvé avec ces filtres.";
    container.appendChild(empty);
    return;
  }

  list.forEach(place => {
    const cfg = categoryConfig[place.category] || { icon: "📍", label: place.category };

    const card = document.createElement("div");
    card.className = "place-card";
    card.innerHTML = `
      <div class="place-title">
        <span class="place-emoji">${cfg.icon}</span>
        <strong>${escapeHtml(place.name)}</strong>
      </div>
      <div class="place-meta">
        <span class="chip">${place.arrondissement}ᵉ</span>
        ${place.priceNote ? `<span class="chip">${escapeHtml(place.priceNote)}</span>` : ""}
        ${(place.cuisines && place.cuisines.length) ? `<span class="chip">${escapeHtml(place.cuisines.join(", "))}</span>` : ""}
      </div>
    `;

    card.addEventListener("click", () => {
      const m = markerById.get(place.id);
      if (m) {
        // cluster-safe: si markercluster, zoom/expand
        if (markersGroup.zoomToShowLayer) {
          markersGroup.zoomToShowLayer(m, () => {
            map.setView(m.getLatLng(), 16);
            openSidebar(place);
          });
        } else {
          map.setView(m.getLatLng(), 16);
          openSidebar(place);
        }
      } else {
        map.setView([place.lat, place.lng], 16);
        openSidebar(place);
      }
    });

    container.appendChild(card);
  });
}

/* =========================================================
   SIDEBAR (fiche)
========================================================= */
function openSidebar(place) {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("sidebarContent");
  const app = document.getElementById("app");
  const overlay = document.getElementById("sheetOverlay");
  if (!sidebar || !content) return;

  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  // --- Layout state ---
  if (isMobile) {
    // Mobile: fullscreen sheet + dark overlay
    document.body.classList.add("sidebar-open");
    if (overlay) overlay.classList.add("open");
  } else {
    // Desktop: 3rd column only when a place is opened
    if (app) app.classList.add("with-sidebar");
  }

  // Show panel (we use display none/block in CSS)
  sidebar.classList.add("open");

  // --- Render content ---
  const cfg = categoryConfig[place.category] || { icon: "📍", label: place.category };

  const tags = Array.isArray(place.tags) ? place.tags : [];
  const cuisines = Array.isArray(place.cuisines) ? place.cuisines : [];

  const links = [];
  if (place.links?.website) links.push({ label: "Site", url: place.links.website, icon: "🌐" });
  if (place.links?.maps) links.push({ label: "Maps", url: place.links.maps, icon: "📍" });
  if (place.links?.instagram) links.push({ label: "Instagram", url: place.links.instagram, icon: "📸" });

  content.innerHTML = `
    <div class="sidebarHeader">
      <div class="sidebarTitle">
        <span class="sidebarEmoji">${escapeHtml(cfg.icon)}</span>
        <h2>${escapeHtml(place.name)}</h2>
      </div>
      <div class="sidebarSub">
        <span class="chip">${escapeHtml(cfg.label || place.category)}</span>
        <span class="chip">${place.arrondissement}ᵉ</span>
        ${place.priceNote ? `<span class="chip">${escapeHtml(place.priceNote)}</span>` : ""}
      </div>
    </div>

    <div class="sidebarBlock">
      <div class="sidebarLine">
        <span class="k">Adresse</span>
        <span class="v">${escapeHtml(place.address || "")}</span>
      </div>
      ${place.openingHoursNote ? `
        <div class="sidebarLine">
          <span class="k">Horaires</span>
          <span class="v">${escapeHtml(place.openingHoursNote)}</span>
        </div>
      ` : ""}
    </div>

    ${place.description ? `
      <div class="sidebarBlock">
        <p class="sidebarDesc">${escapeHtml(place.description)}</p>
      </div>
    ` : ""}

    ${(cuisines.length || tags.length) ? `
      <div class="sidebarBlock">
        <div class="tags">
          ${cuisines.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join("")}
          ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    ${links.length ? `
      <div class="sidebarBlock">
        <div class="sidebarLinks">
          ${links.map(l => `
            <a class="sidebarLink" href="${escapeAttr(l.url)}" target="_blank" rel="noreferrer">
              ${escapeHtml(l.icon)} ${escapeHtml(l.label)}
            </a>
          `).join("")}
        </div>
      </div>
    ` : ""}

    ${(place.images && place.images.length) ? `
      <div class="sidebarBlock">
        <div class="sidebarPhotos">
          ${place.images.map(src => `<img src="${escapeAttr(src)}" alt="">`).join("")}
        </div>
      </div>
    ` : `
      <div class="sidebarBlock">
        <div class="emptyState">Aucune photo pour le moment.</div>
      </div>
    `}
  `;

  // Optional: ensure close button works even if DOM changes elsewhere
  document.getElementById("closeSidebar")?.addEventListener("click", closeSidebar);
}


function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const app = document.getElementById("app");
  const overlay = document.getElementById("sheetOverlay");
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  if (sidebar) sidebar.classList.remove("open");

  if (isMobile) {
    document.body.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("open");
  } else {
    if (app) app.classList.remove("with-sidebar");
  }
}



/* =========================================================
   LÉGENDE (cliquable => filtre catégories)
========================================================= */
function renderCategoryLegendLeft() {
  const container = document.getElementById("categoryLegendLeft");
  if (!container) return;

  // UI identique à la légende carte
  container.innerHTML = `
    <div class="map-legend legend-left">
      <div class="legend-title">Catégories</div>
      <div class="legend-list"></div>
    </div>
  `;

  const list = container.querySelector(".legend-list");

  Object.entries(categoryConfig).forEach(([key, cfg]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "legend-item";
    item.dataset.category = key;

    item.innerHTML = `
      <span class="legend-dot" style="background:${cfg.color}"></span>
      <span class="legend-emoji">${cfg.icon}</span>
      <span class="legend-label">${cfg.label}</span>
    `;

    item.addEventListener("click", () => {
      if (filterState.categories.has(key)) {
        filterState.categories.delete(key);
        item.classList.remove("active");
      } else {
        filterState.categories.add(key);
        item.classList.add("active");
      }
      renderAll();
    });

    list.appendChild(item);
  });
}


/* =========================================================
   ICONS (Leaflet DivIcon)
========================================================= */
function makeCategoryIcon(category) {
  const cfg = categoryConfig[category] || { color: "#64748b", icon: "📍" };

  return L.divIcon({
    className: "place-pin",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
    html: `
      <div class="pin" style="--pin:${cfg.color}">
        <span class="pin-emoji" aria-hidden="true">${escapeHtml(cfg.icon)}</span>
      </div>
    `
  });
}

/* =========================================================
   UTILS
========================================================= */
function uniqSorted(arr) {
  return [...new Set(arr)].sort((a, b) => String(a).localeCompare(String(b), "fr"));
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str = "") {
  // suffisant pour URLs/attributes
  return escapeHtml(str).replaceAll("`", "");
}


function initBottomSheet() {
  const sheet = document.getElementById("filters");
  const header = document.getElementById("sheetHeader");
  const handle = document.getElementById("sheetHandle");
  const body = document.getElementById("sheetBody");
  if (!sheet || !header || !handle || !body) return;

  // Desktop: rien à faire
  const mq = window.matchMedia("(max-width: 900px)");
  if (!mq.matches) return;

  let state = "collapsed"; // collapsed | half | full
  let dragStartY = 0;
  let startY = 0;
  let currentY = 0;
  let snapping = false;

  function calcSnapPoints() {
    const h = sheet.getBoundingClientRect().height;

    // “peek” visibles
    const collapsedPeek = 132; // handle + search + reset
 // handle + search uniquement (compact)

    const halfPeek = 420; // assez pour afficher reset + filtres


    const yCollapsed = Math.max(0, h - collapsedPeek);
    const yHalf = Math.max(0, h - halfPeek);
    const yFull = 0;

    return { yCollapsed, yHalf, yFull };
  }

  function applyState(next) {
    state = next;
    const { yCollapsed, yHalf, yFull } = calcSnapPoints();
    const target = (state === "collapsed") ? yCollapsed : (state === "half") ? yHalf : yFull;

    sheet.style.setProperty("--sheetY", `${target}px`);
    sheet.dataset.sheet = state;

    // body visible en half/full
    body.style.display = (state === "collapsed") ? "none" : "block";
  }

  function nearestSnap(y) {
    const { yCollapsed, yHalf, yFull } = calcSnapPoints();
    const options = [
      { s: "collapsed", y: yCollapsed },
      { s: "half", y: yHalf },
      { s: "full", y: yFull }
    ];
    options.sort((a,b) => Math.abs(a.y - y) - Math.abs(b.y - y));
    return options[0].s;
  }

  function clampY(y) {
    const { yCollapsed, yFull } = calcSnapPoints();
    return Math.min(yCollapsed, Math.max(yFull, y));
  }

  function setY(y) {
    currentY = clampY(y);
    sheet.style.setProperty("--sheetY", `${currentY}px`);
  }

  function onDown(e) {
    if (snapping) return;

    // On ne drag que depuis le header/handle
    const target = e.target;
    if (!(target === handle || header.contains(target))) return;

    sheet.style.transition = "none";
    dragStartY = (e.touches ? e.touches[0].clientY : e.clientY);
    startY = currentY;

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  }

  function onMove(e) {
    e.preventDefault();
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const dy = y - dragStartY;
    setY(startY + dy);
  }

  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onUp);

    // Snap
    const snapState = nearestSnap(currentY);
    sheet.style.transition = "transform 220ms ease";
    snapping = true;
    applyState(snapState);

    // reset transition after
    window.setTimeout(() => {
      sheet.style.transition = "";
      snapping = false;
    }, 240);
  }

  // Init
  // On initialise currentY à l’état collapsed calculé
  const { yCollapsed } = calcSnapPoints();
  currentY = yCollapsed;
  applyState("collapsed");

  // Listeners
  header.addEventListener("mousedown", onDown);
  header.addEventListener("touchstart", onDown, { passive: true });
  handle.addEventListener("mousedown", onDown);
  handle.addEventListener("touchstart", onDown, { passive: true });

  // Tap sur handle = toggle collapsed <-> half (comme Plans)
  handle.addEventListener("click", () => {
    if (state === "collapsed") applyState("half");
    else applyState("collapsed");
  });

  // Resize -> recalcul snap points
  window.addEventListener("resize", () => applyState(state));
}
