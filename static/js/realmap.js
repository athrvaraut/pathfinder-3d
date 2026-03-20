// ─────────────────────────────────────────────────────────────
//  realmap.js  —  Real OpenStreetMap + Dijkstra visualization
// ─────────────────────────────────────────────────────────────

let mapScene, mapCamera, mapRenderer, mapAnimId;
let mapNodes   = [];
let mapEdges   = [];
let mapStart   = null;
let mapEnd     = null;
let mapLoaded  = false;
let nodeMeshMap= {};
let edgeLines  = [];

// Bounds for coordinate conversion
let minLat, maxLat, minLon, maxLon;
const MAP_SCALE = 60;

// ─────────────────────────────────────────────────────────────
//  COORDINATE CONVERSION
// ─────────────────────────────────────────────────────────────
function latLonTo3D(lat, lon) {
  const x = ((lon - minLon) / (maxLon - minLon) - 0.5) * MAP_SCALE;
  const z = ((lat - minLat) / (maxLat - minLat) - 0.5) * MAP_SCALE;
  return { x, y: 0, z };
}

// ─────────────────────────────────────────────────────────────
//  INIT REAL MAP SCENE
// ─────────────────────────────────────────────────────────────
function initRealMap() {
  const container = document.getElementById("canvas-container");

  mapScene = new THREE.Scene();
  mapScene.background = new THREE.Color(0x020208);
  mapScene.fog = new THREE.FogExp2(0x020208, 0.012);

  mapCamera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 0.1, 500);
  mapCamera.position.set(0, 40, 40);
  mapCamera.lookAt(0, 0, 0);

  mapRenderer = new THREE.WebGLRenderer({ antialias: true });
  mapRenderer.setPixelRatio(window.devicePixelRatio);
  mapRenderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = "";
  container.appendChild(mapRenderer.domElement);

  // Lights
  mapScene.add(new THREE.AmbientLight(0x223344, 4));
  const dir = new THREE.DirectionalLight(0x4488ff, 2);
  dir.position.set(20, 40, 20);
  mapScene.add(dir);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color:0x030310, metalness:0.9, roughness:0.3 })
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.1;
  mapScene.add(ground);

  setupMapControls();

  document.getElementById("realmap-controls").style.display = "flex";
  document.getElementById("controls").style.display         = "none";
  document.getElementById("status").textContent             = "REAL MAP — LOAD A CITY FIRST";
  document.getElementById("mode-indicator").textContent     = "REAL MAP MODE";

  animateMap();
}

// ─────────────────────────────────────────────────────────────
//  LOAD CITY
// ─────────────────────────────────────────────────────────────
async function loadCity() {
  const city = document.getElementById("realmap-city-input").value ||
             "Pune, Maharashtra, India";

  document.getElementById("status").textContent = `LOADING ${city.toUpperCase()}...`;
  document.getElementById("map-result").innerHTML =
    `<div style="color:#ffdd00;font-size:0.7rem">⏳ Downloading road network...</div>`;

  const res  = await fetch("/loadcity", {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify({ city })
  });
  const data = await res.json();

  if (!data.success) {
    document.getElementById("status").textContent = "ERROR: " + data.error;
    return;
  }

  // Clear old scene objects
  clearMapScene();

  // Set bounds
  const lats = data.nodes.map(n => n.lat);
  const lons = data.nodes.map(n => n.lon);
  minLat = Math.min(...lats); maxLat = Math.max(...lats);
  minLon = Math.min(...lons); maxLon = Math.max(...lons);

  // Draw edges (roads)
  buildRoadEdges(data.edges);

  // Draw nodes (intersections)
  buildMapNodes(data.nodes);

  mapLoaded = true;

  document.getElementById("status").textContent =
    `${city.toUpperCase()} LOADED — CLICK 2 NODES`;
  document.getElementById("map-result").innerHTML =
    `<div class="stats-title">[ MAP INFO ]</div>
     <div class="stat-row">City   <span>${data.info.city}</span></div>
     <div class="stat-row">Nodes  <span style="color:#00d4ff">${data.info.nodes.toLocaleString()}</span></div>
     <div class="stat-row">Edges  <span style="color:#00ff88">${data.info.edges.toLocaleString()}</span></div>`;
}

// ─────────────────────────────────────────────────────────────
//  BUILD ROADS
// ─────────────────────────────────────────────────────────────
function buildRoadEdges(edges) {
  edges.forEach(edge => {
    const a = latLonTo3D(edge.from.lat, edge.from.lon);
    const b = latLonTo3D(edge.to.lat,   edge.to.lon);
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a.x, 0.05, a.z),
      new THREE.Vector3(b.x, 0.05, b.z),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color:0x0a0a3a, transparent:true, opacity:0.7
    });
    const line = new THREE.Line(geo, mat);
    line.userData = { type:"road", mat };
    mapScene.add(line);
    edgeLines.push(line);
  });
}

// ─────────────────────────────────────────────────────────────
//  BUILD NODES
// ─────────────────────────────────────────────────────────────
function buildMapNodes(nodes) {
  mapNodes = nodes;
  nodeMeshMap = {};

  nodes.forEach(node => {
    const pos = latLonTo3D(node.lat, node.lon);
    const geo = new THREE.SphereGeometry(0.12, 8, 8);
    const mat = new THREE.MeshStandardMaterial({
      color:0x0033aa, emissive:0x001133, emissiveIntensity:0.5
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, 0.12, pos.z);
    mesh.userData = { id:node.id, lat:node.lat, lon:node.lon };
    mapScene.add(mesh);
    nodeMeshMap[node.id] = mesh;
  });
}

// ─────────────────────────────────────────────────────────────
//  SOLVE ON REAL MAP
// ─────────────────────────────────────────────────────────────
async function solveRealMap() {
  if (!mapStart||!mapEnd) {
    document.getElementById("status").textContent = "CLICK START + END NODE FIRST!";
    return;
  }
  document.getElementById("status").textContent = "COMPUTING REAL DIJKSTRA...";

  const res  = await fetch("/solvemap", {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify({
      start_lat : mapStart.lat, start_lon : mapStart.lon,
      end_lat   : mapEnd.lat,   end_lon   : mapEnd.lon
    })
  });
  const data = await res.json();

  if (!data.success) {
    document.getElementById("status").textContent = "ERROR: " + data.error;
    return;
  }

  const r = data.result;

  // Animate path
  animateRealPath(r.path);

  document.getElementById("map-result").innerHTML =
    `<div class="stats-title">[ DIJKSTRA RESULT ]</div>
     <div class="stat-row">Distance <span style="color:#00ff88">${r.total_dist_km} km</span></div>
     <div class="stat-row">Nodes visited <span style="color:#00d4ff">${r.nodes_visited.toLocaleString()}</span></div>
     <div class="stat-row">Time <span style="color:#ffdd00">${r.time_ms} ms</span></div>
     <div class="stat-row">Path nodes <span>${r.path.length}</span></div>
     <div class="stat-row">Found <span style="color:${r.found?'#00ff88':'#ff3355'}">${r.found?'YES ✓':'NO ✗'}</span></div>`;

  document.getElementById("status").textContent =
    `PATH FOUND — ${r.total_dist_km} km`;
}

// ─────────────────────────────────────────────────────────────
//  ANIMATE PATH
// ─────────────────────────────────────────────────────────────
function animateRealPath(path) {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= path.length) { clearInterval(interval); return; }
    const node = path[i];
    const mesh = nodeMeshMap[node.id];
    if (mesh) {
      mesh.material.color.setHex(0x00d4ff);
      mesh.material.emissive.setHex(0x002244);
      mesh.material.emissiveIntensity = 0.8;
      mesh.scale.setScalar(2.5);
    }

    // Draw path line segment
    if (i > 0) {
      const prev = path[i-1];
      const pa   = latLonTo3D(prev.lat, prev.lon);
      const pb   = latLonTo3D(node.lat, node.lon);
      const geo  = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pa.x, 0.2, pa.z),
        new THREE.Vector3(pb.x, 0.2, pb.z),
      ]);
      const mat = new THREE.LineBasicMaterial({ color:0x00d4ff, linewidth:3 });
      mapScene.add(new THREE.Line(geo, mat));
    }
    i++;
  }, 30);
}

// ─────────────────────────────────────────────────────────────
//  CONTROLS
// ─────────────────────────────────────────────────────────────
function setupMapControls() {
  const canvas = mapRenderer.domElement;
  const ray    = new THREE.Raycaster();
  const mouse  = new THREE.Vector2();
  let drag=false, px=0, py=0, theta=0.5, phi=0.9, radius=45;
  const target = new THREE.Vector3(0,0,0);

  function updateCam() {
    mapCamera.position.set(
      target.x+radius*Math.sin(phi)*Math.sin(theta),
      target.y+radius*Math.cos(phi),
      target.z+radius*Math.sin(phi)*Math.cos(theta)
    );
    mapCamera.lookAt(target);
  }

  canvas.addEventListener("mousedown", e=>{drag=true;px=e.clientX;py=e.clientY;});
  canvas.addEventListener("mousemove", e=>{
    if (!drag) return;
    theta-=(e.clientX-px)*0.005;
    phi=Math.max(0.2,Math.min(1.4,phi+(e.clientY-py)*0.005));
    px=e.clientX; py=e.clientY; updateCam();
  });
  canvas.addEventListener("mouseup",    ()=>drag=false);
  canvas.addEventListener("mouseleave", ()=>drag=false);
  canvas.addEventListener("wheel", e=>{
    radius=Math.max(5,Math.min(100,radius+e.deltaY*0.05)); updateCam();
  });

  // Click node
  canvas.addEventListener("click", e=>{
    if (!mapLoaded) return;
    const rect=canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
    ray.setFromCamera(mouse, mapCamera);
    const hits=ray.intersectObjects(Object.values(nodeMeshMap));
    if (!hits.length) return;
    const {id,lat,lon}=hits[0].object.userData;
    if (!mapStart) {
      mapStart={id,lat,lon};
      hits[0].object.material.color.setHex(0x00ff88);
      hits[0].object.material.emissive.setHex(0x004422);
      hits[0].object.scale.setScalar(3);
      document.getElementById("mode-indicator").textContent="START SET — CLICK END";
    } else if (!mapEnd) {
      mapEnd={id,lat,lon};
      hits[0].object.material.color.setHex(0xff3355);
      hits[0].object.material.emissive.setHex(0x440011);
      hits[0].object.scale.setScalar(3);
      document.getElementById("mode-indicator").textContent="END SET — PRESS SOLVE";
    }
  });

  updateCam();
}

// ─────────────────────────────────────────────────────────────
//  RESET + EXIT
// ─────────────────────────────────────────────────────────────
function clearMapScene() {
  edgeLines.forEach(l=>mapScene.remove(l));
  Object.values(nodeMeshMap).forEach(m=>mapScene.remove(m));
  edgeLines=[]; nodeMeshMap={};
  mapStart=null; mapEnd=null;
}

function resetRealMap() {
  Object.values(nodeMeshMap).forEach(m=>{
    m.material.color.setHex(0x0033aa);
    m.material.emissive.setHex(0x001133);
    m.material.emissiveIntensity=0.5;
    m.scale.setScalar(1);
  });
  mapStart=null; mapEnd=null;
  document.getElementById("status").textContent="RESET — CLICK 2 NODES";
  document.getElementById("mode-indicator").textContent="REAL MAP MODE";
}

function exitRealMap() {
  cancelAnimationFrame(mapAnimId);
  document.getElementById("realmap-controls").style.display="none";
  document.getElementById("controls").style.display="flex";
  document.getElementById("map-result").innerHTML="";
  const container=document.getElementById("canvas-container");
  container.innerHTML="";
  init();
}

// ─────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────
function animateMap() {
  mapAnimId=requestAnimationFrame(animateMap);
  mapRenderer.render(mapScene, mapCamera);
}