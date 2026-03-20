// ─────────────────────────────────────────────────────────────
//  city.js  —  World + India City Map
// ─────────────────────────────────────────────────────────────

const WORLD_CITIES = [
  // ── INDIA (30 cities) ────────────────────────────────────
  { id:0,  name:"Mumbai",       region:"India",      lat:19.076, lon:72.877 },
  { id:1,  name:"Delhi",        region:"India",      lat:28.613, lon:77.209 },
  { id:2,  name:"Bangalore",    region:"India",      lat:12.971, lon:77.594 },
  { id:3,  name:"Chennai",      region:"India",      lat:13.082, lon:80.270 },
  { id:4,  name:"Kolkata",      region:"India",      lat:22.572, lon:88.363 },
  { id:5,  name:"Hyderabad",    region:"India",      lat:17.385, lon:78.486 },
  { id:6,  name:"Pune",         region:"India",      lat:18.520, lon:73.856 },
  { id:7,  name:"Ahmedabad",    region:"India",      lat:23.022, lon:72.571 },
  { id:8,  name:"Jaipur",       region:"India",      lat:26.912, lon:75.787 },
  { id:9,  name:"Lucknow",      region:"India",      lat:26.846, lon:80.946 },
  { id:10, name:"Nagpur",       region:"India",      lat:21.145, lon:79.088 },
  { id:11, name:"Surat",        region:"India",      lat:21.170, lon:72.831 },
  { id:12, name:"Patna",        region:"India",      lat:25.594, lon:85.137 },
  { id:13, name:"Bhopal",       region:"India",      lat:23.259, lon:77.412 },
  { id:14, name:"Indore",       region:"India",      lat:22.719, lon:75.857 },
  { id:15, name:"Kochi",        region:"India",      lat:9.931,  lon:76.267 },
  { id:16, name:"Chandigarh",   region:"India",      lat:30.733, lon:76.779 },
  { id:17, name:"Amritsar",     region:"India",      lat:31.634, lon:74.872 },
  { id:18, name:"Varanasi",     region:"India",      lat:25.317, lon:82.973 },
  { id:19, name:"Guwahati",     region:"India",      lat:26.144, lon:91.736 },
  { id:20, name:"Visakhapatnam",region:"India",      lat:17.686, lon:83.218 },
  { id:21, name:"Nashik",       region:"India",      lat:19.997, lon:73.789 },
  { id:22, name:"Coimbatore",   region:"India",      lat:11.016, lon:76.955 },
  { id:23, name:"Ranchi",       region:"India",      lat:23.344, lon:85.309 },
  { id:24, name:"Bhubaneswar",  region:"India",      lat:20.296, lon:85.824 },
  { id:25, name:"Dehradun",     region:"India",      lat:30.316, lon:78.032 },
  { id:26, name:"Srinagar",     region:"India",      lat:34.083, lon:74.797 },
  { id:27, name:"Raipur",       region:"India",      lat:21.251, lon:81.629 },
  { id:28, name:"Madurai",      region:"India",      lat:9.925,  lon:78.119 },
  { id:29, name:"Jodhpur",      region:"India",      lat:26.238, lon:73.024 },

  // ── ASIA ─────────────────────────────────────────────────
  { id:30, name:"Beijing",      region:"China",      lat:39.909, lon:116.391 },
  { id:31, name:"Shanghai",     region:"China",      lat:31.228, lon:121.474 },
  { id:32, name:"Guangzhou",    region:"China",      lat:23.129, lon:113.264 },
  { id:33, name:"Tokyo",        region:"Japan",      lat:35.689, lon:139.692 },
  { id:34, name:"Osaka",        region:"Japan",      lat:34.693, lon:135.502 },
  { id:35, name:"Seoul",        region:"S.Korea",    lat:37.566, lon:126.978 },
  { id:36, name:"Bangkok",      region:"Thailand",   lat:13.756, lon:100.502 },
  { id:37, name:"Singapore",    region:"Singapore",  lat:1.352,  lon:103.820 },
  { id:38, name:"Kuala Lumpur", region:"Malaysia",   lat:3.140,  lon:101.687 },
  { id:39, name:"Jakarta",      region:"Indonesia",  lat:-6.208, lon:106.846 },
  { id:40, name:"Ho Chi Minh",  region:"Vietnam",    lat:10.823, lon:106.630 },
  { id:41, name:"Manila",       region:"Philippines",lat:14.599, lon:120.984 },
  { id:42, name:"Dhaka",        region:"Bangladesh", lat:23.810, lon:90.412 },
  { id:43, name:"Karachi",      region:"Pakistan",   lat:24.861, lon:67.010 },
  { id:44, name:"Lahore",       region:"Pakistan",   lat:31.549, lon:74.344 },
  { id:45, name:"Kathmandu",    region:"Nepal",      lat:27.717, lon:85.324 },
  { id:46, name:"Colombo",      region:"Sri Lanka",  lat:6.927,  lon:79.861 },

  // ── MIDDLE EAST ──────────────────────────────────────────
  { id:47, name:"Dubai",        region:"UAE",        lat:25.204, lon:55.270 },
  { id:48, name:"Riyadh",       region:"S.Arabia",   lat:24.688, lon:46.722 },
  { id:49, name:"Tehran",       region:"Iran",       lat:35.689, lon:51.389 },
  { id:50, name:"Istanbul",     region:"Turkey",     lat:41.015, lon:28.979 },
  { id:51, name:"Tel Aviv",     region:"Israel",     lat:32.085, lon:34.781 },

  // ── EUROPE ───────────────────────────────────────────────
  { id:52, name:"London",       region:"UK",         lat:51.507, lon:-0.128 },
  { id:53, name:"Paris",        region:"France",     lat:48.857, lon:2.352  },
  { id:54, name:"Berlin",       region:"Germany",    lat:52.520, lon:13.405 },
  { id:55, name:"Madrid",       region:"Spain",      lat:40.416, lon:-3.703 },
  { id:56, name:"Rome",         region:"Italy",      lat:41.902, lon:12.496 },
  { id:57, name:"Amsterdam",    region:"Netherlands",lat:52.370, lon:4.895  },
  { id:58, name:"Vienna",       region:"Austria",    lat:48.208, lon:16.373 },
  { id:59, name:"Moscow",       region:"Russia",     lat:55.751, lon:37.618 },
  { id:60, name:"Stockholm",    region:"Sweden",     lat:59.333, lon:18.065 },
  { id:61, name:"Warsaw",       region:"Poland",     lat:52.229, lon:21.012 },
  { id:62, name:"Barcelona",    region:"Spain",      lat:41.385, lon:2.173  },
  { id:63, name:"Zurich",       region:"Switzerland",lat:47.376, lon:8.541  },

  // ── AFRICA ───────────────────────────────────────────────
  { id:64, name:"Cairo",        region:"Egypt",      lat:30.044, lon:31.236 },
  { id:65, name:"Lagos",        region:"Nigeria",    lat:6.455,  lon:3.384  },
  { id:66, name:"Nairobi",      region:"Kenya",      lat:-1.286, lon:36.817 },
  { id:67, name:"Johannesburg", region:"S.Africa",   lat:-26.205,lon:28.050 },
  { id:68, name:"Casablanca",   region:"Morocco",    lat:33.589, lon:-7.604 },
  { id:69, name:"Addis Ababa",  region:"Ethiopia",   lat:9.005,  lon:38.763 },

  // ── AMERICAS ─────────────────────────────────────────────
  { id:70, name:"New York",     region:"USA",        lat:40.713, lon:-74.006 },
  { id:71, name:"Los Angeles",  region:"USA",        lat:34.052, lon:-118.244},
  { id:72, name:"Chicago",      region:"USA",        lat:41.878, lon:-87.630 },
  { id:73, name:"Toronto",      region:"Canada",     lat:43.651, lon:-79.383 },
  { id:74, name:"Mexico City",  region:"Mexico",     lat:19.432, lon:-99.133 },
  { id:75, name:"Sao Paulo",    region:"Brazil",     lat:-23.550,lon:-46.634 },
  { id:76, name:"Buenos Aires", region:"Argentina",  lat:-34.603,lon:-58.382 },
  { id:77, name:"Bogota",       region:"Colombia",   lat:4.711,  lon:-74.073 },

  // ── OCEANIA ──────────────────────────────────────────────
  { id:78, name:"Sydney",       region:"Australia",  lat:-33.868,lon:151.209 },
  { id:79, name:"Melbourne",    region:"Australia",  lat:-37.814,lon:144.963 },
];

// ── Flight/Road connections [from, to, distKm] ───────────────
const WORLD_ROADS = [
  // India internal
  [0,6,150],[0,11,265],[0,7,530],[0,1,1400],[0,2,980],[0,3,1330],
  [0,5,710],[0,14,590],[0,13,790],[0,21,165],[0,29,870],[0,22,1200],
  [1,8,270],[1,9,530],[1,16,250],[1,17,450],[1,25,310],[1,26,880],
  [1,10,1100],[1,18,820],[1,12,990],[1,13,780],[1,44,430],
  [2,3,345],[2,5,570],[2,22,500],[2,15,540],[2,28,440],[2,46,2500],
  [3,5,625],[3,20,790],[3,28,450],[3,46,300],[3,24,1050],
  [4,12,580],[4,23,400],[4,19,1000],[4,20,1700],[4,24,440],[4,42,1800],
  [5,10,500],[5,20,625],[5,24,1000],[6,14,590],[6,13,680],
  [7,11,265],[7,14,320],[7,13,290],[7,29,660],[8,29,340],[9,18,320],
  [10,27,370],[10,23,480],[13,14,190],[15,22,210],[15,46,300],
  [16,17,230],[17,44,430],[18,12,320],[19,42,2000],[23,24,480],
  [25,26,450],[27,23,520],[28,22,440],

  // India to Asia
  [1,44,430],[1,45,900],[0,43,1050],[0,47,1920],[4,42,1800],
  [2,37,3300],[2,46,300],[19,42,2000],[26,49,2500],[26,44,650],

  // Asia internal
  [43,44,200],[43,47,1500],[44,45,1750],[45,42,1200],[45,1,900],
  [42,36,2700],[46,37,2800],[46,3,300],
  [36,37,1450],[36,38,1300],[36,40,1800],
  [37,38,350],[37,39,1100],[37,40,1100],[37,41,2550],
  [38,39,1100],[39,40,1700],[39,41,2000],
  [30,31,1070],[30,33,2100],[30,35,940],[30,32,1900],[30,49,6000],
  [31,32,1200],[31,33,1790],[31,34,1650],[31,37,4100],
  [33,34,400],[33,35,550],[34,35,650],[35,30,940],
  [32,37,3300],[40,41,1800],

  // Middle East
  [47,48,950],[47,49,2000],[47,51,2130],[47,64,2500],[47,50,3500],
  [48,64,1400],[48,49,1600],[49,50,1800],[50,51,800],
  [50,52,2500],[50,54,2200],[50,59,1800],
  [0,47,1920],[1,47,2200],[43,47,1500],

  // Europe internal
  [52,53,340],[52,57,360],[52,54,930],[52,63,780],[52,55,1260],
  [53,54,1050],[53,56,1420],[53,55,1100],[53,62,830],[53,57,430],
  [54,57,650],[54,58,680],[54,61,520],[54,59,1600],
  [55,62,620],[55,56,1940],[56,58,1130],[56,63,830],
  [57,63,670],[58,61,850],[58,63,310],[59,61,1150],[60,61,1450],
  [50,54,2200],[50,56,2240],[50,59,1800],

  // Europe to Middle East / Africa
  [52,64,3500],[53,68,2000],[55,68,1500],[56,64,2100],[50,64,1200],

  // Africa internal
  [64,69,3600],[64,65,4600],[64,68,2000],[64,51,900],
  [65,66,4000],[65,67,5000],[66,67,3900],[66,69,1700],[69,66,1700],

  // Americas internal
  [70,72,1200],[70,73,550],[70,74,3350],[70,75,7700],[70,77,4000],
  [71,72,2800],[71,74,2500],[72,73,700],[73,70,550],[74,77,2550],
  [75,76,1100],[75,77,2500],[76,77,4200],

  // Trans-oceanic (flight routes)
  [52,70,5570],[53,70,5840],[54,70,6380],[70,76,8500],
  [52,75,9340],[52,47,5550],[52,64,3500],
  [0,47,1920],[0,64,4700],[0,37,5330],
  [2,37,3300],[33,71,8820],[30,70,10900],
  [37,78,6300],[33,78,7800],[30,78,8900],
  [78,79,880],[78,75,12100],[75,76,1100],
  [70,71,3940],[64,66,3800],
];

// ── Region Colors ─────────────────────────────────────────────
const REGION_COLORS = {
  "India":       0x0066ff,
  "China":       0xff3300,
  "Japan":       0xff0066,
  "S.Korea":     0xff6699,
  "Thailand":    0xffaa00,
  "Singapore":   0x00ffcc,
  "Malaysia":    0x00ccff,
  "Indonesia":   0xff9933,
  "Vietnam":     0x66ff00,
  "Philippines": 0xff66cc,
  "Bangladesh":  0x00ff88,
  "Pakistan":    0x88ff00,
  "Nepal":       0xffcc00,
  "Sri Lanka":   0x00ffaa,
  "UAE":         0xffdd00,
  "S.Arabia":    0xffbb00,
  "Iran":        0xff6600,
  "Turkey":      0xff3366,
  "Israel":      0x6699ff,
  "UK":          0x0099ff,
  "France":      0x0055ff,
  "Germany":     0x0033cc,
  "Spain":       0xff2200,
  "Italy":       0x00cc44,
  "Netherlands": 0xff6600,
  "Austria":     0x990000,
  "Russia":      0x884400,
  "Sweden":      0x0088ff,
  "Poland":      0xdd0000,
  "Switzerland": 0xff0000,
  "Egypt":       0xffcc00,
  "Nigeria":     0x00cc00,
  "Kenya":       0x009900,
  "S.Africa":    0x006600,
  "Morocco":     0xcc6600,
  "Ethiopia":    0x663300,
  "USA":         0x3355ff,
  "Canada":      0xff4400,
  "Mexico":      0x00aa44,
  "Brazil":      0x00dd00,
  "Argentina":   0x66aaff,
  "Colombia":    0xffdd00,
  "Australia":   0xffaa33,
};

// ── Map bounds ────────────────────────────────────────────────
const W_LAT_MIN=-45, W_LAT_MAX=72;
const W_LON_MIN=-130,W_LON_MAX=160;
const W_MAP_W=160, W_MAP_H=100;

function worldLatLonTo3D(lat, lon) {
  const x = ((lon - W_LON_MIN)/(W_LON_MAX - W_LON_MIN) - 0.5) * W_MAP_W;
  const z = (1-(lat - W_LAT_MIN)/(W_LAT_MAX - W_LAT_MIN) - 0.5) * W_MAP_H;
  return { x, y:0, z };
}

// ── City scene state ──────────────────────────────────────────
let cityScene, cityCamera, cityRenderer, cityAnimId;
let cityStart      = null;
let cityEnd        = null;
let cityNodeMeshes = [];
let cityRoadLines  = [];

// ─────────────────────────────────────────────────────────────
//  INIT CITY SCENE
// ─────────────────────────────────────────────────────────────
function initCity() {
  const container = document.getElementById("canvas-container");

  cityScene = new THREE.Scene();
  cityScene.background = new THREE.Color(0x020208);
  cityScene.fog = new THREE.FogExp2(0x020208, 0.004);

  cityCamera = new THREE.PerspectiveCamera(
    55, container.clientWidth/container.clientHeight, 0.1, 1000
  );
  cityCamera.position.set(0, 90, 80);
  cityCamera.lookAt(0, 0, 0);

  cityRenderer = new THREE.WebGLRenderer({ antialias:true });
  cityRenderer.setPixelRatio(window.devicePixelRatio);
  cityRenderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = "";
  container.appendChild(cityRenderer.domElement);

  cityScene.add(new THREE.AmbientLight(0x111133, 3));
  const dir = new THREE.DirectionalLight(0x4488ff, 2);
  dir.position.set(30, 60, 30);
  cityScene.add(dir);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 300),
    new THREE.MeshStandardMaterial({ color:0x020210, metalness:0.9, roughness:0.3 })
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.3;
  cityScene.add(ground);

  buildWorldGrid();
  buildCityRoads();
  buildCityNodes();
  setupCityControls();
  buildCitySearch();

  document.getElementById("status").textContent = "WORLD MAP — SEARCH A CITY TO START";
  document.getElementById("mode-indicator").textContent = "WORLD MAP MODE";
  document.getElementById("city-controls").style.display = "flex";
  document.getElementById("controls").style.display      = "none";

  animateCity();
}

// ─────────────────────────────────────────────────────────────
//  WORLD GRID
// ─────────────────────────────────────────────────────────────
function buildWorldGrid() {
  const lm = new THREE.LineBasicMaterial({ color:0x0a0a22, transparent:true, opacity:0.4 });
  // Latitude lines
  for (let lat=-40; lat<=70; lat+=15) {
    const z=(1-(lat-W_LAT_MIN)/(W_LAT_MAX-W_LAT_MIN)-0.5)*W_MAP_H;
    cityScene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-W_MAP_W/2,0.01,z),
        new THREE.Vector3( W_MAP_W/2,0.01,z)
      ]), lm));
  }
  // Longitude lines
  for (let lon=-120; lon<=150; lon+=30) {
    const x=((lon-W_LON_MIN)/(W_LON_MAX-W_LON_MIN)-0.5)*W_MAP_W;
    cityScene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x,0.01,-W_MAP_H/2),
        new THREE.Vector3(x,0.01, W_MAP_H/2)
      ]), lm));
  }
}

// ─────────────────────────────────────────────────────────────
//  BUILD ROADS
// ─────────────────────────────────────────────────────────────
function buildCityRoads() {
  cityRoadLines = [];
  WORLD_ROADS.forEach(([from, to, dist]) => {
    const a = worldLatLonTo3D(WORLD_CITIES[from].lat, WORLD_CITIES[from].lon);
    const b = worldLatLonTo3D(WORLD_CITIES[to].lat,   WORLD_CITIES[to].lon);

    // Skip roads that wrap around the map (anti-meridian)
    if (Math.abs(a.x - b.x) > W_MAP_W * 0.6) return;

    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a.x, 0.05, a.z),
      new THREE.Vector3(b.x, 0.05, b.z),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color:0x111133, transparent:true, opacity:0.5
    });
    const line = new THREE.Line(geo, mat);
    line.userData = { from, to, dist, mat };
    cityScene.add(line);
    cityRoadLines.push(line);
  });
}

// ─────────────────────────────────────────────────────────────
//  BUILD NODES
// ─────────────────────────────────────────────────────────────
function buildCityNodes() {
  cityNodeMeshes = [];
  WORLD_CITIES.forEach((city, i) => {
    const pos   = worldLatLonTo3D(city.lat, city.lon);
    const color = REGION_COLORS[city.region] || 0x0044aa;

    // Bigger sphere for India cities
    const size  = city.region === "India" ? 0.55 : 0.4;
    const geo   = new THREE.SphereGeometry(size, 10, 10);
    const mat   = new THREE.MeshStandardMaterial({
      color, emissive:color, emissiveIntensity:0.35,
      metalness:0.8, roughness:0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, size, pos.z);
    mesh.userData = { id:i, name:city.name, region:city.region };
    cityScene.add(mesh);
    cityNodeMeshes.push(mesh);

    // Glow ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(size*1.4, 0.04, 6, 20),
      new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.25 })
    );
    ring.rotation.x = Math.PI/2;
    ring.position.set(pos.x, 0.05, pos.z);
    cityScene.add(ring);

    // Label — only show for bigger/important cities
    const label = makeCitySprite(city.name, color, city.region === "India");
    label.position.set(pos.x, size*2.2 + 0.5, pos.z);
    label.scale.set(city.region==="India" ? 4.5 : 3.5, 0.9, 1);
    cityScene.add(label);
  });
}

// ─────────────────────────────────────────────────────────────
//  TEXT SPRITE
// ─────────────────────────────────────────────────────────────
function makeCitySprite(text, color, bold=false) {
  const canvas  = document.createElement("canvas");
  canvas.width  = 256; canvas.height = 64;
  const ctx     = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0,0,256,64);
  const hex = "#" + color.toString(16).padStart(6,"0");
  ctx.fillStyle   = hex;
  ctx.font        = `${bold?"bold ":""}${bold?22:18}px 'Courier New'`;
  ctx.textAlign   = "center";
  ctx.textBaseline= "middle";
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map:tex, transparent:true, depthWrite:false
  }));
}

// ─────────────────────────────────────────────────────────────
//  DIJKSTRA
// ─────────────────────────────────────────────────────────────
function runCityDijkstra() {
  if (cityStart===null || cityEnd===null) {
    document.getElementById("status").textContent = "SEARCH START + END CITY!";
    return;
  }

  const adj = Array.from({ length:WORLD_CITIES.length }, ()=>[]);
  WORLD_ROADS.forEach(([from, to, dist]) => {
    adj[from].push({ node:to,   cost:dist });
    adj[to].push({   node:from, cost:dist });
  });

  const dist  = new Array(WORLD_CITIES.length).fill(Infinity);
  const prev  = new Array(WORLD_CITIES.length).fill(null);
  const vis   = new Set();
  dist[cityStart] = 0;
  const pq = [{ node:cityStart, cost:0 }];

  while (pq.length) {
    pq.sort((a,b)=>a.cost-b.cost);
    const { node, cost } = pq.shift();
    if (vis.has(node)) continue;
    vis.add(node);
    if (node===cityEnd) break;
    for (const { node:nb, cost:w } of adj[node]) {
      const nc = cost+w;
      if (nc < dist[nb]) {
        dist[nb]=nc; prev[nb]=node;
        pq.push({ node:nb, cost:nc });
      }
    }
  }

  const path=[];
  let cur=cityEnd;
  while (cur!==null) { path.unshift(cur); cur=prev[cur]; }

  animateCityResult(vis, path, dist[cityEnd]);
}

// ─────────────────────────────────────────────────────────────
//  ANIMATE RESULT
// ─────────────────────────────────────────────────────────────
function animateCityResult(visited, path, totalDist) {
  visited.forEach(id => {
    if (id!==cityStart && id!==cityEnd) {
      cityNodeMeshes[id].material.color.setHex(0x003366);
      cityNodeMeshes[id].material.emissiveIntensity = 0.15;
    }
  });

  path.forEach((id, i) => {
    setTimeout(()=>{
      if (id!==cityStart && id!==cityEnd) {
        cityNodeMeshes[id].material.color.setHex(0x00d4ff);
        cityNodeMeshes[id].material.emissive.setHex(0x003344);
        cityNodeMeshes[id].material.emissiveIntensity = 1.0;
        cityNodeMeshes[id].scale.setScalar(2.0);
      }
      if (i < path.length-1) {
        const next=path[i+1];
        cityRoadLines.forEach(line=>{
          const {from,to,mat}=line.userData;
          if ((from===id&&to===next)||(from===next&&to===id)) {
            mat.color.setHex(0x00d4ff);
            mat.opacity=1;
          }
        });
      }
    }, i*120);
  });

  setTimeout(()=>{
    const distStr = totalDist===Infinity ? "No route" : totalDist.toLocaleString()+" km";
    const routeNames = path.map(i=>WORLD_CITIES[i].name).join(" → ");
    document.getElementById("status").textContent = `ROUTE: ${distStr}`;
    document.getElementById("city-result").innerHTML =
      `<div class="stats-title">[ WORLD ROUTE ]</div>
       <div class="stat-row">From <span style="color:#00ff88">${WORLD_CITIES[cityStart]?.name}</span></div>
       <div class="stat-row">To <span style="color:#ff3355">${WORLD_CITIES[cityEnd]?.name}</span></div>
       <div class="stat-row">Distance <span style="color:#00d4ff">${distStr}</span></div>
       <div class="stat-row">Stops <span>${path.length}</span></div>
       <div class="stat-row">Visited <span>${visited.size} cities</span></div>
       <div style="margin-top:8px;font-size:0.58rem;color:#304060;line-height:1.7">${routeNames}</div>`;

    const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
    set("d-visited",visited.size); set("d-path",path.length);
    set("d-time","world map"); set("d-found",path.length>1?"YES ✓":"NO ✗");
    set("a-visited","--"); set("a-path","--"); set("a-time","N/A"); set("a-found","N/A");
    set("b-visited","--"); set("b-path","--"); set("b-time","N/A"); set("b-found","N/A");
    const wt=document.getElementById("winner-text");
    if (wt) wt.innerHTML=`🏆 <span style="color:#00d4ff">DIJKSTRA</span><br/>📍 ${distStr}`;
    const bt=document.getElementById("bar-d-visited");
    if (bt) bt.style.width="80%";
    const bn=document.getElementById("bnum-d-visited");
    if (bn) bn.textContent=visited.size;
  }, path.length*120+400);
}

// ─────────────────────────────────────────────────────────────
//  SEARCH BAR
// ─────────────────────────────────────────────────────────────
function buildCitySearch() {
  const old=document.getElementById("city-search-wrap");
  if (old) old.remove();

  const wrap=document.createElement("div");
  wrap.id="city-search-wrap";
  wrap.innerHTML=`
    <div class="csearch-box">
      <span style="color:#ff00aa;font-size:0.85rem">⌕</span>
      <input id="start-search" type="text" placeholder="Search START city or country..."
        oninput="filterCities('start')" autocomplete="off"/>
      <div id="start-dropdown" class="city-dropdown"></div>
    </div>
    <div class="csearch-box">
      <span style="color:#ff2255;font-size:0.85rem">⌖</span>
      <input id="end-search" type="text" placeholder="Search END city or country..."
        oninput="filterCities('end')" autocomplete="off"/>
      <div id="end-dropdown" class="city-dropdown"></div>
    </div>
  `;

  const style=document.createElement("style");
  style.textContent=`
    #city-search-wrap {
      position:fixed; top:68px; right:300px;
      display:flex; gap:10px; z-index:1010;
      padding:8px 14px;
      background:rgba(3,3,15,0.96);
      border-bottom:1px solid rgba(255,0,170,0.2);
      border-left:1px solid rgba(255,0,170,0.2);
      border-radius:0 0 0 8px;
    }
    .csearch-box {
      position:relative; display:flex; align-items:center; gap:8px;
      background:rgba(0,0,20,0.8);
      border:1px solid rgba(255,0,170,0.35); border-radius:4px; padding:0 12px;
    }
    .csearch-box input {
      background:none; border:none; outline:none; color:#c8d8f0;
      font-family:'Share Tech Mono',monospace; font-size:0.72rem;
      padding:9px 0; width:200px; letter-spacing:1px;
    }
    .csearch-box input::placeholder { color:#304060; }
    .city-dropdown {
      position:absolute; top:100%; left:0; right:0;
      background:rgba(3,3,15,0.99);
      border:1px solid rgba(255,0,170,0.3); border-top:none;
      border-radius:0 0 6px 6px;
      max-height:250px; overflow-y:auto; z-index:1020; display:none;
    }
    .city-dropdown::-webkit-scrollbar { width:2px; }
    .city-dropdown::-webkit-scrollbar-thumb { background:#ff00aa; }
    .city-opt {
      padding:8px 14px; font-family:'Share Tech Mono',monospace;
      font-size:0.7rem; cursor:pointer; display:flex;
      justify-content:space-between; align-items:center;
      border-bottom:1px solid rgba(255,255,255,0.03);
      transition:background 0.1s;
    }
    .city-opt:hover { background:rgba(255,0,170,0.1); }
    .city-opt .cname { color:#c8d8f0; }
    .city-opt .cregion {
      font-size:0.58rem; padding:2px 6px;
      border-radius:3px; border:1px solid; white-space:nowrap;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(wrap);

  document.addEventListener("click", e=>{
    if (!e.target.closest("#city-search-wrap")) {
      const sd=document.getElementById("start-dropdown");
      const ed=document.getElementById("end-dropdown");
      if(sd) sd.style.display="none";
      if(ed) ed.style.display="none";
    }
  });
}

function filterCities(type) {
  const inputEl   =document.getElementById(`${type}-search`);
  const dropdownEl=document.getElementById(`${type}-dropdown`);
  const query     =inputEl.value.trim().toLowerCase();
  if (!query) { dropdownEl.style.display="none"; return; }

  const matches=WORLD_CITIES.filter(c=>
    c.name.toLowerCase().includes(query)||
    c.region.toLowerCase().includes(query)
  ).slice(0,12);

  if (!matches.length) { dropdownEl.style.display="none"; return; }

  const regionColor=r=>{
    const hex=(REGION_COLORS[r]||0x0044aa).toString(16).padStart(6,"0");
    return `#${hex}`;
  };

  dropdownEl.innerHTML=matches.map(c=>`
    <div class="city-opt" onclick="selectCityFromSearch(${c.id},'${type}')">
      <span class="cname">${c.name}</span>
      <span class="cregion" style="color:${regionColor(c.region)};border-color:${regionColor(c.region)}">${c.region}</span>
    </div>
  `).join("");
  dropdownEl.style.display="block";
}

function selectCityFromSearch(id, type) {
  const city =WORLD_CITIES[id];
  // If TSP mode — add as waypoint instead
  if (cityTspMode) { addCityTSPPoint(id); return; }
  const color=REGION_COLORS[city.region]||0x0044aa;

  document.getElementById(`${type}-dropdown`).style.display="none";
  document.getElementById(`${type}-search`).value=`${city.name} (${city.region})`;

  if (type==="start") {
    if (cityStart!==null) {
      const oc=REGION_COLORS[WORLD_CITIES[cityStart].region]||0x0044aa;
      cityNodeMeshes[cityStart].material.color.setHex(oc);
      cityNodeMeshes[cityStart].material.emissive.setHex(oc);
      cityNodeMeshes[cityStart].material.emissiveIntensity=0.35;
      cityNodeMeshes[cityStart].scale.setScalar(1);
    }
    cityStart=id;
    cityNodeMeshes[id].material.color.setHex(0x00ff88);
    cityNodeMeshes[id].material.emissive.setHex(0x004422);
    cityNodeMeshes[id].material.emissiveIntensity=1.0;
    cityNodeMeshes[id].scale.setScalar(2.8);
    document.getElementById("mode-indicator").textContent=`START: ${city.name}`;
    document.getElementById("status").textContent=`START: ${city.name} — SEARCH END CITY`;
  } else {
    if (cityEnd!==null) {
      const oc=REGION_COLORS[WORLD_CITIES[cityEnd].region]||0x0044aa;
      cityNodeMeshes[cityEnd].material.color.setHex(oc);
      cityNodeMeshes[cityEnd].material.emissive.setHex(oc);
      cityNodeMeshes[cityEnd].material.emissiveIntensity=0.35;
      cityNodeMeshes[cityEnd].scale.setScalar(1);
    }
    cityEnd=id;
    cityNodeMeshes[id].material.color.setHex(0xff3355);
    cityNodeMeshes[id].material.emissive.setHex(0x440011);
    cityNodeMeshes[id].material.emissiveIntensity=1.0;
    cityNodeMeshes[id].scale.setScalar(2.8);
    document.getElementById("mode-indicator").textContent=`END: ${city.name} — PRESS RUN`;
    document.getElementById("status").textContent=`END: ${city.name} — PRESS RUN DIJKSTRA`;
  }
}

// ─────────────────────────────────────────────────────────────
//  CAMERA CONTROLS
// ─────────────────────────────────────────────────────────────
function setupCityControls() {
  const canvas=cityRenderer.domElement;
  const ray=new THREE.Raycaster();
  const mouse=new THREE.Vector2();
  let drag=false, px=0, py=0;
  let theta=0.3, phi=0.75, radius=110;
  const target=new THREE.Vector3(10,0,5);

  function updateCam() {
    cityCamera.position.set(
      target.x+radius*Math.sin(phi)*Math.sin(theta),
      target.y+radius*Math.cos(phi),
      target.z+radius*Math.sin(phi)*Math.cos(theta)
    );
    cityCamera.lookAt(target);
  }

  canvas.addEventListener("mousedown",e=>{drag=true;px=e.clientX;py=e.clientY;});
  canvas.addEventListener("mousemove",e=>{
    if(!drag) return;
    theta-=(e.clientX-px)*0.004;
    phi=Math.max(0.1,Math.min(1.4,phi+(e.clientY-py)*0.004));
    px=e.clientX; py=e.clientY; updateCam();
  });
  canvas.addEventListener("mouseup",()=>drag=false);
  canvas.addEventListener("mouseleave",()=>drag=false);
  canvas.addEventListener("wheel",e=>{
    radius=Math.max(15,Math.min(200,radius+e.deltaY*0.1)); updateCam();
  });

  // Spacebar runs Dijkstra in city mode
  window.addEventListener("keydown", e => {
    if (document.getElementById("city-controls").style.display === "none") return;
    if (e.key === " ") { e.preventDefault(); runCityDijkstra(); }
    if (e.key === "ArrowRight") cityStepForward();
    if (e.key === "ArrowLeft")  cityStepBack();
  });

  // Click to select city
  canvas.addEventListener("click",e=>{
    const rect=canvas.getBoundingClientRect();
    mouse.x= ((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    ray.setFromCamera(mouse,cityCamera);
    const hits=ray.intersectObjects(cityNodeMeshes);
    if(!hits.length) return;
    const {id,name,region}=hits[0].object.userData;
    selectCityFromSearch(id, cityStart===null?"start":"end");
    document.getElementById(`${cityStart===id?"start":"end"}-search`).value=`${name} (${region})`;
  });

  updateCam();
}

// ─────────────────────────────────────────────────────────────
//  RESET
// ─────────────────────────────────────────────────────────────
function resetCity() {
  cityStart=null; cityEnd=null;
  WORLD_CITIES.forEach((city,i)=>{
    const color=REGION_COLORS[city.region]||0x0044aa;
    cityNodeMeshes[i].material.color.setHex(color);
    cityNodeMeshes[i].material.emissive.setHex(color);
    cityNodeMeshes[i].material.emissiveIntensity=0.35;
    cityNodeMeshes[i].scale.setScalar(1);
  });
  cityRoadLines.forEach(l=>{
    l.userData.mat.color.setHex(0x111133);
    l.userData.mat.opacity=0.5;
  });
  const ss=document.getElementById("start-search");
  const es=document.getElementById("end-search");
  if(ss) ss.value=""; if(es) es.value="";
  document.getElementById("city-result").innerHTML="";
  document.getElementById("status").textContent="WORLD MAP — SEARCH A CITY";
  document.getElementById("mode-indicator").textContent="WORLD MAP MODE";
}

// ─────────────────────────────────────────────────────────────
//  EXIT
// ─────────────────────────────────────────────────────────────
function exitCity() {
  cancelAnimationFrame(cityAnimId);
  const sw=document.getElementById("city-search-wrap");
  if(sw) sw.remove();
  document.getElementById("city-controls").style.display="none";
  document.getElementById("controls").style.display="flex";
  document.getElementById("city-result").innerHTML="";
  const container=document.getElementById("canvas-container");
  container.innerHTML="";
  init();
}

// ─────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────
function animateCity() {
  cityAnimId=requestAnimationFrame(animateCity);
  const t=Date.now()*0.001;
  cityNodeMeshes.forEach((m,i)=>{
    const base=WORLD_CITIES[i].region==="India"?0.55:0.4;
    m.position.y=base+Math.sin(t*1.2+i*0.4)*0.06;
  });
  cityRenderer.render(cityScene,cityCamera);
}
// ─────────────────────────────────────────────────────────────
//  TSP ON CITY MAP
// ─────────────────────────────────────────────────────────────
let cityTspPoints  = [];   // array of city ids
let cityTspLines   = [];   // 3D line objects
let cityTspMode    = false;

function toggleCityTSP() {
  cityTspMode = !cityTspMode;
  const btn = document.getElementById("city-tsp-btn");
  if (cityTspMode) {
    btn.style.background = "rgba(255,221,0,0.15)";
    btn.style.boxShadow  = "0 0 12px rgba(255,221,0,0.4)";
    document.getElementById("status").textContent =
      "TSP MODE — SEARCH CITIES TO ADD WAYPOINTS (3-8)";
    document.getElementById("city-tsp-panel").style.display = "block";
  } else {
    btn.style.background = "";
    btn.style.boxShadow  = "";
    clearCityTSP();
    document.getElementById("city-tsp-panel").style.display = "none";
  }
}

function addCityTSPPoint(id) {
  if (!cityTspMode) return;
  if (cityTspPoints.length >= 8) {
    document.getElementById("city-tsp-status").textContent = "Max 8 cities!";
    return;
  }
  if (cityTspPoints.includes(id)) {
    document.getElementById("city-tsp-status").textContent = "City already added!";
    return;
  }
  cityTspPoints.push(id);

  // Mark city yellow
  cityNodeMeshes[id].material.color.setHex(0xffdd00);
  cityNodeMeshes[id].material.emissive.setHex(0x443300);
  cityNodeMeshes[id].material.emissiveIntensity = 1.0;
  cityNodeMeshes[id].scale.setScalar(2.5);

  const count = cityTspPoints.length;
  document.getElementById("city-tsp-count").textContent =
    `Cities: ${count} / 8`;
  document.getElementById("city-tsp-status").textContent =
    `#${count} ${WORLD_CITIES[id].name} added`;
  document.getElementById("city-tsp-list").innerHTML =
    cityTspPoints.map((cid,i) =>
      `<div style="color:#ffdd00;font-size:0.62rem">${i+1}. ${WORLD_CITIES[cid].name}</div>`
    ).join("");
}

async function runCityTSP() {
  if (cityTspPoints.length < 3) {
    document.getElementById("city-tsp-status").textContent = "Need 3+ cities!";
    return;
  }
  document.getElementById("city-tsp-status").textContent = "SOLVING TSP...";

  // Build coordinate points using real lat/lon
  const points = cityTspPoints.map(id => [
    WORLD_CITIES[id].lat,
    WORLD_CITIES[id].lon
  ]);

  const res  = await fetch("/tsp", {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify({ points })
  });
  const data = await res.json();

  if (data.error) {
    document.getElementById("city-tsp-status").textContent = data.error;
    return;
  }

  // Show results
  const fmt = d => typeof d === "number" ? d.toFixed(0)+" units" : d;
  document.getElementById("city-tsp-results").innerHTML = `
    <div class="tsp-method">
      <div class="tsp-method-name" style="color:#ff3355">BRUTE FORCE</div>
      <div class="tsp-method-dist" style="color:#ff3355">${fmt(data.brute.distance)}</div>
      <div class="tsp-method-time">${data.brute.time_ms} ms</div>
    </div>
    <div class="tsp-method">
      <div class="tsp-method-name" style="color:#ffaa00">GREEDY</div>
      <div class="tsp-method-dist" style="color:#ffaa00">${fmt(data.greedy.distance)}</div>
      <div class="tsp-method-time">${data.greedy.time_ms} ms</div>
    </div>
    <div class="tsp-method">
      <div class="tsp-method-name" style="color:#00ff88">DP HELD-KARP</div>
      <div class="tsp-method-dist" style="color:#00ff88">${fmt(data.dp.distance)}</div>
      <div class="tsp-method-time">${data.dp.time_ms} ms · ✓ Optimal</div>
    </div>`;

  // Draw DP path on map
  animateCityTSPPath(data.dp.path);

  document.getElementById("city-tsp-status").textContent =
    `DONE — DP optimal: ${fmt(data.dp.distance)}`;
}

function animateCityTSPPath(path) {
  // Remove old lines
  cityTspLines.forEach(l => cityScene.remove(l));
  cityTspLines = [];

  const colors = [0x00ff88, 0x00d4ff, 0xffdd00, 0xff00aa,
                  0xff6600, 0xaa00ff, 0x00ffcc, 0xff3355];

  path.forEach((idx, i) => {
    if (i === path.length-1) return;
    const fromId = cityTspPoints[idx];
    const toId   = cityTspPoints[path[i+1]];
    if (fromId===undefined || toId===undefined) return;

    setTimeout(() => {
      const a = worldLatLonTo3D(WORLD_CITIES[fromId].lat, WORLD_CITIES[fromId].lon);
      const b = worldLatLonTo3D(WORLD_CITIES[toId].lat,   WORLD_CITIES[toId].lon);
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(a.x, 1.5, a.z),
        new THREE.Vector3(b.x, 1.5, b.z),
      ]);
      const mat  = new THREE.LineBasicMaterial({ color: colors[i % colors.length] });
      const line = new THREE.Line(geo, mat);
      cityScene.add(line);
      cityTspLines.push(line);

      // Pulse start city of this segment
      cityNodeMeshes[fromId].scale.setScalar(3.0);
      setTimeout(() => cityNodeMeshes[fromId].scale.setScalar(2.5), 300);
    }, i * 300);
  });
}

function clearCityTSP() {
  // Reset city colors
  cityTspPoints.forEach(id => {
    const color = REGION_COLORS[WORLD_CITIES[id].region] || 0x0044aa;
    cityNodeMeshes[id].material.color.setHex(color);
    cityNodeMeshes[id].material.emissive.setHex(color);
    cityNodeMeshes[id].material.emissiveIntensity = 0.35;
    cityNodeMeshes[id].scale.setScalar(1);
  });
  cityTspLines.forEach(l => cityScene.remove(l));
  cityTspLines  = [];
  cityTspPoints = [];
  document.getElementById("city-tsp-count").textContent   = "Cities: 0 / 8";
  document.getElementById("city-tsp-status").textContent  = "Search cities to add";
  document.getElementById("city-tsp-results").innerHTML   = "";
  document.getElementById("city-tsp-list").innerHTML      = "";
}

// ─────────────────────────────────────────────────────────────
//  CITY STEP MODE + AI EXPLAIN
// ─────────────────────────────────────────────────────────────
let cityStepData  = [];
let cityStepIndex = 0;
let cityStepMode  = false;
let cityAIMode    = false;

// ── Toggle Step Mode ──────────────────────────────────────────
async function toggleCityStepMode() {
  if (cityStart === null) {
    document.getElementById("status").textContent = "SEARCH START CITY FIRST!";
    return;
  }
  if (cityEnd === null) {
    document.getElementById("status").textContent = "SEARCH END CITY FIRST!";
    return;
  }
  cityStepMode = !cityStepMode;
  const btn = document.getElementById("city-step-btn");

  if (cityStepMode) {
    btn.style.background = "rgba(255,0,170,0.15)";
    btn.style.boxShadow  = "0 0 12px rgba(255,0,170,0.4)";
    await loadCityStepData();
  } else {
    btn.style.background = "";
    btn.style.boxShadow  = "";
    cityStepData  = [];
    cityStepIndex = 0;
  }
}

// ── Load step data from Flask ─────────────────────────────────
async function loadCityStepData() {
  document.getElementById("status").textContent = "LOADING STEP DATA...";

  // Build city graph as grid-like structure for step API
  const adj = Array.from({ length: WORLD_CITIES.length }, () => []);
  WORLD_ROADS.forEach(([from, to, dist]) => {
    adj[from].push({ node: to,   cost: dist });
    adj[to].push({   node: from, cost: dist });
  });

  // Run Dijkstra manually collecting steps
  const steps   = [];
  const dist    = new Array(WORLD_CITIES.length).fill(Infinity);
  const prev    = new Array(WORLD_CITIES.length).fill(null);
  const visited = new Set();
  dist[cityStart] = 0;
  const pq = [{ node: cityStart, cost: 0 }];

  while (pq.length) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node, cost } = pq.shift();
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = adj[node].filter(n => !visited.has(n.node));

    steps.push({
      current   : node,
      cost      : cost,
      visited   : [...visited],
      neighbors : neighbors.map(n => n.node),
      cityName  : WORLD_CITIES[node].name,
      region    : WORLD_CITIES[node].region,
      found     : node === cityEnd
    });

    if (node === cityEnd) break;

    for (const { node: nb, cost: w } of adj[node]) {
      const nc = cost + w;
      if (nc < dist[nb]) {
        dist[nb] = nc;
        prev[nb] = node;
        pq.push({ node: nb, cost: nc });
      }
    }
  }

  cityStepData  = steps;
  cityStepIndex = 0;

  document.getElementById("status").textContent =
    `STEP MODE — ${steps.length} STEPS — USE → ← KEYS`;

  if (cityStepData.length > 0) drawCityStep(0);
}

// ── Draw one step ─────────────────────────────────────────────
function drawCityStep(idx) {
  if (!cityStepData.length) return;
  const step = cityStepData[idx];

  // Reset all visited nodes
  WORLD_CITIES.forEach((city, i) => {
    if (i === cityStart || i === cityEnd) return;
    const color = REGION_COLORS[city.region] || 0x0044aa;
    cityNodeMeshes[i].material.color.setHex(color);
    cityNodeMeshes[i].material.emissiveIntensity = 0.35;
    cityNodeMeshes[i].scale.setScalar(1);
  });

  // Draw visited
  step.visited.forEach(id => {
    if (id === cityStart || id === cityEnd) return;
    cityNodeMeshes[id].material.color.setHex(0x0044aa);
    cityNodeMeshes[id].material.emissiveIntensity = 0.2;
  });

  // Draw neighbors
  step.neighbors.forEach(id => {
    if (id === cityStart || id === cityEnd) return;
    cityNodeMeshes[id].material.color.setHex(0xffaa00);
    cityNodeMeshes[id].material.emissiveIntensity = 0.6;
    cityNodeMeshes[id].scale.setScalar(1.5);
  });

  // Highlight current
  if (step.current !== cityStart && step.current !== cityEnd) {
    cityNodeMeshes[step.current].material.color.setHex(0xffffff);
    cityNodeMeshes[step.current].material.emissiveIntensity = 1.0;
    cityNodeMeshes[step.current].scale.setScalar(2.5);
  }

  // Update step counter
  document.getElementById("status").textContent =
    `STEP ${idx+1}/${cityStepData.length} — ${step.cityName} (${step.region}) — Cost: ${step.cost} km`;

  // Update AI panel if active
  if (cityAIMode) updateCityAIPanel(step, idx);
}

// ── Step forward/back ─────────────────────────────────────────
function cityStepForward() {
  if (!cityStepMode || !cityStepData.length) return;
  if (cityStepIndex < cityStepData.length - 1) {
    cityStepIndex++;
    drawCityStep(cityStepIndex);
  } else {
    document.getElementById("status").textContent = "END OF STEPS — PATH FOUND!";
  }
}

function cityStepBack() {
  if (!cityStepMode || !cityStepData.length) return;
  if (cityStepIndex > 0) {
    cityStepIndex--;
    drawCityStep(cityStepIndex);
  }
}

// ── Toggle AI Mode ────────────────────────────────────────────
function toggleCityAI() {
  cityAIMode = !cityAIMode;
  const btn   = document.getElementById("city-ai-btn");
  const panel = document.getElementById("ai-panel");

  if (cityAIMode) {
    btn.style.background = "rgba(170,0,255,0.15)";
    btn.style.boxShadow  = "0 0 12px rgba(170,0,255,0.4)";
    panel.style.display  = "block";
    document.getElementById("status").textContent =
      "AI EXPLAIN ON — USE STEP MODE + → KEY";
  } else {
    btn.style.background = "";
    btn.style.boxShadow  = "";
    panel.style.display  = "none";
  }
}

// ── Update AI panel for city ──────────────────────────────────
function updateCityAIPanel(step, idx) {
  const total = cityStepData.length;

  document.getElementById("ai-algo-tag").textContent =
    "DIJKSTRA — CITY GRAPH";

  document.getElementById("ai-step-num").textContent =
    `Step ${idx+1} / ${total}`;

  document.getElementById("ai-node-val").textContent =
    `${step.cityName} (${step.region})`;

  document.getElementById("ai-cost-val").textContent =
    step.cost + " km";

  document.getElementById("ai-why-val").textContent =
    `Dijkstra selected ${step.cityName} because it has the LOWEST total road distance from start = ${step.cost} km. All other unvisited cities have higher cumulative distance.`;

  const nbNames = step.neighbors
    .map(id => WORLD_CITIES[id]?.name || id)
    .join(", ");

  document.getElementById("ai-nb-val").textContent =
    step.neighbors.length > 0
      ? `${step.neighbors.length} cities: ${nbNames}`
      : "No unvisited neighbors";

  document.getElementById("ai-vis-val").textContent =
    step.visited.length + " cities";

  const progress = Math.round((idx/total)*100);
  let insight = "";
  if (progress < 25)
    insight = `Early phase. Exploring cities near ${WORLD_CITIES[cityStart]?.name}. Dijkstra expands in order of road distance.`;
  else if (progress < 60)
    insight = `Mid search. ${step.visited.length} cities visited. Algorithm moving toward ${WORLD_CITIES[cityEnd]?.name}.`;
  else if (step.found)
    insight = `🎉 GOAL REACHED! ${WORLD_CITIES[cityEnd]?.name} found! Shortest road route = ${step.cost} km.`;
  else
    insight = `Near completion. Getting close to ${WORLD_CITIES[cityEnd]?.name}. Almost done!`;

  document.getElementById("ai-insight-val").textContent = insight;
}