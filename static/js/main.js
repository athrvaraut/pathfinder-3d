// ─────────────────────────────────────────────────────────────
//  main.js  —  Three.js 3D Scene + Algorithm Visualization
// ─────────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────
const TERRAIN_COLORS = {
  2: 0x8B6914,
  3: 0x4a2800,
  4: 0x0a2a6e,
};
const ROWS   = 28;
const COLS   = 28;
const CELL   = 1.2;
const GAP    = 0.08;
const WALL_H = 1.8;
const FLOOR_H= 0.1;

// ── Colors ────────────────────────────────────────────────────
const C = {
  bg        : 0x050510,
  floor     : 0x0a0a1a,
  floorLine : 0x0d0d2a,
  wall      : 0x1a1a3a,
  wallTop   : 0x2a2a5a,
  start     : 0x00ff88,
  end       : 0xff3355,
  visitedD  : 0x0055cc,
  visitedA  : 0x880088,
  visitedB  : 0x006644,
  pathD     : 0x00d4ff,
  pathA     : 0xffdd00,
  pathB     : 0x00ff88,
};

// ── State ─────────────────────────────────────────────────────
let grid      = [];
let startCell = null;
let endCell   = null;
let mode      = "wall";
let cellMeshes= {};
let animQueue = [];
let animating = false;
let results   = null;

// ── Particle state (declared here to avoid hoisting issues) ───
let particles    = [];
let particleMesh = null;

// ── Three.js core ─────────────────────────────────────────────
let scene, camera, renderer, raycaster, mouse;
let floorPlane;
let isDragging   = false;
let prevMouse    = { x: 0, y: 0 };
let cameraTheta  = 0.6;
let cameraPhi    = 1.1;
let cameraRadius = 28;
let cameraTarget = new THREE.Vector3(
  (COLS * (CELL + GAP)) / 2,
  0,
  (ROWS * (CELL + GAP)) / 2
);

// ─────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.FogExp2(C.bg, 0.018);

  camera = new THREE.PerspectiveCamera(55, getAspect(), 0.1, 200);
  updateCamera();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(getW(), getH());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse     = new THREE.Vector2();

  setupLights();
  initGrid();
  buildFloor();
  buildGridCells();
  setupEvents();

  animate();
  setStatus("READY — PRESS RUN");
  setTimeout(initParticles, 500);
}

// ─────────────────────────────────────────────────────────────
//  LIGHTS
// ─────────────────────────────────────────────────────────────
function setupLights() {
  scene.add(new THREE.AmbientLight(0x111133, 2));
  const dir = new THREE.DirectionalLight(0x4488ff, 1.5);
  dir.position.set(20, 30, 20);
  dir.castShadow = true;
  scene.add(dir);
  const l1 = new THREE.PointLight(0x00d4ff, 2, 40);
  l1.position.set(0, 10, 0);
  scene.add(l1);
  const l2 = new THREE.PointLight(0x00ff88, 2, 40);
  l2.position.set(COLS*(CELL+GAP), 10, ROWS*(CELL+GAP));
  scene.add(l2);
}

// ─────────────────────────────────────────────────────────────
//  GRID
// ─────────────────────────────────────────────────────────────
function initGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill(0));
}

function buildFloor() {
  const w = COLS * (CELL + GAP);
  const h = ROWS * (CELL + GAP);
  const geo = new THREE.PlaneGeometry(w+2, h+2);
  const mat = new THREE.MeshStandardMaterial({ color:0x050510, metalness:0.8, roughness:0.4 });
  floorPlane = new THREE.Mesh(geo, mat);
  floorPlane.rotation.x = -Math.PI/2;
  floorPlane.position.set(w/2, -0.05, h/2);
  floorPlane.receiveShadow = true;
  scene.add(floorPlane);

  const lm = new THREE.LineBasicMaterial({ color:0x0a0a2a, transparent:true, opacity:0.8 });
  for (let r = 0; r <= ROWS; r++) {
    const z = r*(CELL+GAP);
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.01,z), new THREE.Vector3(w,0.01,z)]), lm));
  }
  for (let c = 0; c <= COLS; c++) {
    const x = c*(CELL+GAP);
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,0.01,0), new THREE.Vector3(x,0.01,h)]), lm));
  }
}

function buildGridCells() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      buildCell(r, c);
}

function cellPos(r, c) {
  return new THREE.Vector3(c*(CELL+GAP)+CELL/2, FLOOR_H/2, r*(CELL+GAP)+CELL/2);
}

function buildCell(r, c) {
  const key = `${r},${c}`;
  if (cellMeshes[key]) {
    scene.remove(cellMeshes[key]);
    cellMeshes[key].geometry.dispose();
    delete cellMeshes[key];
  }
  const isWall  = grid[r][c] === 1;
  const isStart = startCell && startCell[0]===r && startCell[1]===c;
  const isEnd   = endCell   && endCell[0]===r   && endCell[1]===c;
  // Terrain height mapping
  const terrainHeights = { 0: FLOOR_H, 2: 0.4, 3: 0.6, 4: 0.25 };
  const tv2 = grid[r][c];
  const h   = isWall ? WALL_H
            : isStart||isEnd ? FLOOR_H
            : (terrainHeights[tv2] || FLOOR_H);
  const geo     = new THREE.BoxGeometry(CELL, h, CELL);

  let color = C.floor;
  if (isWall)  color = C.wall;
  if (isStart) color = C.start;
  if (isEnd)   color = C.end;
  const tv = grid[r][c];
  if (!isWall && !isStart && !isEnd && TERRAIN_COLORS[tv]) color = TERRAIN_COLORS[tv];

  // Terrain material properties
  const isSand  = tv2 === 2;
  const isMud   = tv2 === 3;
  const isWater = tv2 === 4;
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness : isWall ? 0.8 : isWater ? 0.9 : isSand ? 0.1 : 0.3,
    roughness : isWall ? 0.2 : isWater ? 0.05 : isSand ? 0.9 : 0.7,
    wireframe : false,
    emissive : isStart ? C.start : isEnd ? C.end : 0x000000,
    emissiveIntensity: (isStart||isEnd) ? 0.4 : 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(cellPos(r,c));
  mesh.position.y = h/2;
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.userData = { r, c };
  scene.add(mesh);
  cellMeshes[key] = mesh;
}

// ─────────────────────────────────────────────────────────────
//  CELL HELPERS
// ─────────────────────────────────────────────────────────────
function setCellColor(r, c, color, emissive=0x000000, emissiveIntensity=0) {
  const mesh = cellMeshes[`${r},${c}`];
  if (!mesh) return;
  mesh.material.color.setHex(color);
  mesh.material.emissive.setHex(emissive);
  mesh.material.emissiveIntensity = emissiveIntensity;
}

function setCellHeight(r, c, h) {
  const mesh = cellMeshes[`${r},${c}`];
  if (!mesh) return;
  mesh.scale.y = h;
  mesh.position.y = (FLOOR_H*h)/2;
}

// ─────────────────────────────────────────────────────────────
//  CAMERA
// ─────────────────────────────────────────────────────────────
function updateCamera() {
  camera.position.x = cameraTarget.x + cameraRadius*Math.sin(cameraPhi)*Math.sin(cameraTheta);
  camera.position.y = cameraTarget.y + cameraRadius*Math.cos(cameraPhi);
  camera.position.z = cameraTarget.z + cameraRadius*Math.sin(cameraPhi)*Math.cos(cameraTheta);
  camera.lookAt(cameraTarget);
}

// ─────────────────────────────────────────────────────────────
//  EVENTS
// ─────────────────────────────────────────────────────────────
function setupEvents() {
  const canvas = renderer.domElement;

  canvas.addEventListener("mousedown", e => { isDragging=true; prevMouse={x:e.clientX,y:e.clientY}; });
  canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;
    cameraTheta -= (e.clientX-prevMouse.x)*0.005;
    cameraPhi = Math.max(0.2, Math.min(1.5, cameraPhi+(e.clientY-prevMouse.y)*0.005));
    prevMouse = {x:e.clientX, y:e.clientY};
    updateCamera();
  });
  canvas.addEventListener("mouseup",    () => isDragging=false);
  canvas.addEventListener("mouseleave", () => isDragging=false);
  canvas.addEventListener("wheel", e => {
    cameraRadius = Math.max(8, Math.min(60, cameraRadius+e.deltaY*0.05));
    updateCamera();
  });
  canvas.addEventListener("click", e => {
    if (animating) return;
    const cell = getClickedCell(e);
    if (!cell) return;
    const [r,c] = cell;
    if (mode==="start") { startCell=[r,c]; grid[r][c]=0; buildCell(r,c); setMode("wall"); }
    else if (mode==="end") { endCell=[r,c]; grid[r][c]=0; buildCell(r,c); setMode("wall"); }
    // TSP point placement
    if (tspMode) { addTSPPoint(r, c); return; }
    else if (mode==="wall") {
      if (startCell&&startCell[0]===r&&startCell[1]===c) return;
      if (endCell&&endCell[0]===r&&endCell[1]===c) return;
      grid[r][c] = grid[r][c]===1 ? 0 : 1;
      buildCell(r,c);
    }
  });

  document.addEventListener("click", () => window.focus());
  renderer.domElement.addEventListener("click", () => window.focus());

  window.addEventListener("resize", () => {
    camera.aspect = getAspect();
    camera.updateProjectionMatrix();
    renderer.setSize(getW(), getH());
  });

  window.addEventListener("keydown", e => {
    if (e.key==="s"||e.key==="S") setMode("start");
    if (e.key==="e"||e.key==="E") setMode("end");
    if (e.key==="w"||e.key==="W") setMode("wall");
    if (e.key==="m"||e.key==="M") generateMaze();
    if (e.key==="r"||e.key==="R") resetGrid();
    if (e.key===" ")              runAlgorithms();
    if (e.key==="ArrowRight")     stepForward();
    if (e.key==="ArrowLeft")      stepBack();
  });
}

function getClickedCell(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x =  ((e.clientX-rect.left)/rect.width)*2-1;
  mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(Object.values(cellMeshes));
  if (!hits.length) return null;
  const {r,c} = hits[0].object.userData;
  return [r,c];
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function getW() { return document.getElementById("canvas-container").clientWidth; }
function getH() { return document.getElementById("canvas-container").clientHeight; }
function getAspect() { return getW()/getH(); }
function setStatus(msg) { document.getElementById("status").textContent = msg; }
function setMode(m) { mode=m; document.getElementById("mode-indicator").textContent=`MODE: ${m.toUpperCase()}`; }

// ─────────────────────────────────────────────────────────────
//  MAZE
// ─────────────────────────────────────────────────────────────
async function generateMaze() {
  setStatus("GENERATING MAZE...");
  const res  = await fetch("/maze");
  const data = await res.json();
  initGrid();
  startCell = data.start;
  endCell   = data.end;
  for (const [r,c] of data.walls) grid[r][c]=1;
  if (data.terrain) for (const [r,c,t] of data.terrain) grid[r][c]=t===0?0:t;
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) buildCell(r,c);
  clearStats();
  setStatus("MAZE READY — PRESS RUN");
}

// ─────────────────────────────────────────────────────────────
//  RESET
// ─────────────────────────────────────────────────────────────
function resetGrid() {
  initGrid();
  startCell=null; endCell=null; animating=false; animQueue=[];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) buildCell(r,c);
  clearStats();
  setStatus("RESET — READY");
}

function clearStats() {
  ["d","a","b"].forEach(p => {
    ["visited","path","time","found"].forEach(s => {
      const el = document.getElementById(`${p}-${s}`);
      if (el) el.textContent="--";
    });
  });
  document.getElementById("winner-text").textContent="Run algorithms first";
}

// ─────────────────────────────────────────────────────────────
//  RUN ALGORITHMS
// ─────────────────────────────────────────────────────────────
async function runAlgorithms() {
  if (!startCell||!endCell) { setStatus("SET START AND END FIRST!"); return; }
  if (animating) return;
  setStatus("COMPUTING...");
  const walls=[];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (grid[r][c]===1) walls.push([r,c]);
  const res = await fetch("/solve",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({rows:ROWS,cols:COLS,walls,start:startCell,end:endCell})
  });
  results = await res.json();
  updateStats(results);
  animateResults(results);
}

// ─────────────────────────────────────────────────────────────
//  STATS
// ─────────────────────────────────────────────────────────────
function updateStats(data) {
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  const d=data.dijkstra.stats, a=data.astar.stats, b=data.bfs.stats;
  set("d-visited",d.nodes_visited); set("d-path",d.path_length);
  set("d-time",d.time_ms+" ms");    set("d-found",d.found?"YES ✓":"NO ✗");
  set("a-visited",a.nodes_visited); set("a-path",a.path_length);
  set("a-time",a.time_ms+" ms");    set("a-found",a.found?"YES ✓":"NO ✗");
  set("b-visited",b.nodes_visited); set("b-path",b.path_length);
  set("b-time",b.time_ms+" ms");    set("b-found",b.found?"YES ✓":"NO ✗");

  const ran=[
    {name:"Dijkstra",s:d,color:"#00d4ff"},
    {name:"A*",s:a,color:"#ffdd00"},
    {name:"BFS",s:b,color:"#00ff88"},
  ].filter(x=>x.s.found);
  if (ran.length) {
    const fastest=ran.reduce((a,b)=>a.s.time_ms<b.s.time_ms?a:b);
    const fewest =ran.reduce((a,b)=>a.s.nodes_visited<b.s.nodes_visited?a:b);
    document.getElementById("winner-text").innerHTML=
      `⚡ Fastest: <span style="color:${fastest.color}">${fastest.name}</span><br/>
       🎯 Efficient: <span style="color:${fewest.color}">${fewest.name}</span>`;
  } else {
    document.getElementById("winner-text").textContent="No path found!";
  }
  updateBarChart(d,a,b);
}

function updateSpeed(val) {
  animSpeed=parseInt(val);
  document.getElementById("speedVal").textContent=val;
}

function updateBarChart(d,a,b) {
  const mv=Math.max(d.nodes_visited,a.nodes_visited,b.nodes_visited)||1;
  const mt=Math.max(d.time_ms,a.time_ms,b.time_ms)||1;
  setTimeout(()=>{
    document.getElementById("bar-d-visited").style.width=(d.nodes_visited/mv*100)+"%";
    document.getElementById("bar-a-visited").style.width=(a.nodes_visited/mv*100)+"%";
    document.getElementById("bar-b-visited").style.width=(b.nodes_visited/mv*100)+"%";
    document.getElementById("bnum-d-visited").textContent=d.nodes_visited;
    document.getElementById("bnum-a-visited").textContent=a.nodes_visited;
    document.getElementById("bnum-b-visited").textContent=b.nodes_visited;
    document.getElementById("bar-d-time").style.width=(d.time_ms/mt*100)+"%";
    document.getElementById("bar-a-time").style.width=(a.time_ms/mt*100)+"%";
    document.getElementById("bar-b-time").style.width=(b.time_ms/mt*100)+"%";
    document.getElementById("bnum-d-time").textContent=d.time_ms;
    document.getElementById("bnum-a-time").textContent=a.time_ms;
    document.getElementById("bnum-b-time").textContent=b.time_ms;
  },100);
}

// ─────────────────────────────────────────────────────────────
//  ANIMATE
// ─────────────────────────────────────────────────────────────
function animateResults(data) {
  animating=true; animQueue=[];
  const dv=data.dijkstra.visited, av=data.astar.visited, bv=data.bfs.visited;
  const maxLen=Math.max(dv.length,av.length,bv.length);
  for (let i=0;i<maxLen;i++) {
    if (i<dv.length) animQueue.push({type:"visited",algo:"d",r:dv[i][0],c:dv[i][1]});
    if (i<av.length) animQueue.push({type:"visited",algo:"a",r:av[i][0],c:av[i][1]});
    if (i<bv.length) animQueue.push({type:"visited",algo:"b",r:bv[i][0],c:bv[i][1]});
  }
  for (const n of data.dijkstra.path) animQueue.push({type:"path",algo:"d",r:n[0],c:n[1]});
  for (const n of data.astar.path)    animQueue.push({type:"path",algo:"a",r:n[0],c:n[1]});
  for (const n of data.bfs.path)      animQueue.push({type:"path",algo:"b",r:n[0],c:n[1]});
  setStatus("ANIMATING...");
  processAnimQueue();
}

let animTimer = null;
let animSpeed = 18;

function processAnimQueue() {
  if (!animQueue.length) {
    animating=false;
    setStatus("DONE — DRAG TO ROTATE");
    if (results) {
      setTimeout(()=>{
        shootParticlesAlongPath(results.dijkstra.path, C.pathD);
        shootParticlesAlongPath(results.astar.path,    C.pathA);
        shootParticlesAlongPath(results.bfs.path,      C.pathB);
      },300);
    }
    return;
  }
  const batch=Math.ceil(animSpeed/3);
  for (let i=0;i<batch&&animQueue.length;i++) {
    const {r,c,algo,type}=animQueue.shift();
    if (startCell&&startCell[0]===r&&startCell[1]===c) continue;
    if (endCell&&endCell[0]===r&&endCell[1]===c) continue;
    if (type === "visited") {
      const colors = { d: C.visitedD, a: C.visitedA, b: C.visitedB };
      setCellColor(r, c, colors[algo], colors[algo], 0.3);
      // Wave height pulse based on distance from start
      const dr = startCell ? Math.abs(r - startCell[0]) : 0;
      const dc = startCell ? Math.abs(c - startCell[1]) : 0;
      const waveDist = Math.sqrt(dr*dr + dc*dc);
      const waveH = 0.3 + Math.sin(waveDist * 0.5 - Date.now()*0.003) * 0.15;
      setCellHeight(r, c, Math.max(0.15, waveH));
    } else {
      const colors = { d: C.pathD, a: C.pathA, b: C.pathB };
      setCellColor(r, c, colors[algo], colors[algo], 0.9);
      setCellHeight(r, c, 1.1);
    }
  }
  animTimer=setTimeout(processAnimQueue,20-animSpeed);
}

// ─────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  if (!isDragging&&!animating) { cameraTheta+=0.001; updateCamera(); }
  if (particleMesh) updateParticles();
  renderer.render(scene, camera);
}

// ─────────────────────────────────────────────────────────────
//  PARTICLES
// ─────────────────────────────────────────────────────────────
function initParticles() {
  const count=300;
  const geometry=new THREE.BufferGeometry();
  const positions=new Float32Array(count*3);
  const colors=new Float32Array(count*3);
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const mat=new THREE.PointsMaterial({
    size:0.18, vertexColors:true, transparent:true,
    opacity:0.9, depthWrite:false, blending:THREE.AdditiveBlending,
  });
  particleMesh=new THREE.Points(geometry,mat);
  scene.add(particleMesh);
  for (let i=0;i<count;i++) {
    particles.push({x:0,y:0,z:0,vx:0,vy:0,vz:0,life:0,maxLife:0,r:0,g:0,b:0,active:false});
  }
}

function spawnParticles(r,c,colorHex) {
  const pos=cellPos(r,c);
  const cr=((colorHex>>16)&0xff)/255;
  const cg=((colorHex>>8)&0xff)/255;
  const cb=(colorHex&0xff)/255;
  let spawned=0;
  for (const p of particles) {
    if (!p.active&&spawned<12) {
      p.x=pos.x; p.y=pos.y+0.5; p.z=pos.z;
      p.vx=(Math.random()-0.5)*0.15;
      p.vy=Math.random()*0.2+0.05;
      p.vz=(Math.random()-0.5)*0.15;
      p.life=1.0; p.maxLife=0.8+Math.random()*0.4;
      p.r=cr; p.g=cg; p.b=cb; p.active=true;
      spawned++;
    }
  }
}

function updateParticles() {
  if (!particleMesh) return;
  const positions=particleMesh.geometry.attributes.position.array;
  const colors=particleMesh.geometry.attributes.color.array;
  for (let i=0;i<particles.length;i++) {
    const p=particles[i]; const i3=i*3;
    if (p.active) {
      p.x+=p.vx; p.y+=p.vy; p.z+=p.vz;
      p.vy-=0.008; p.life-=0.02;
      if (p.life<=0) p.active=false;
      positions[i3]=p.x; positions[i3+1]=p.y; positions[i3+2]=p.z;
      const alpha=p.life/p.maxLife;
      colors[i3]=p.r*alpha; colors[i3+1]=p.g*alpha; colors[i3+2]=p.b*alpha;
    } else {
      positions[i3]=positions[i3+1]=positions[i3+2]=0;
      colors[i3]=colors[i3+1]=colors[i3+2]=0;
    }
  }
  particleMesh.geometry.attributes.position.needsUpdate=true;
  particleMesh.geometry.attributes.color.needsUpdate=true;
}

function shootParticlesAlongPath(path,colorHex) {
  if (!path||!path.length) return;
  let i=0;
  const interval=setInterval(()=>{
    if (i>=path.length) { clearInterval(interval); return; }
    spawnParticles(path[i][0],path[i][1],colorHex);
    i+=2;
  },40);
}

// ─────────────────────────────────────────────────────────────
//  STEP BY STEP MODE
// ─────────────────────────────────────────────────────────────
let stepMode=false, stepData=[], stepIndex=0, stepAlgo="dijkstra", stepPath=[];

async function toggleStepMode() {
  if (!startCell||!endCell) { setStatus("SET START AND END FIRST!"); return; }
  stepMode=!stepMode;
  const panel=document.getElementById("step-panel");
  const btn=document.getElementById("step-toggle-btn");
  if (stepMode) {
    panel.style.display="block";
    btn.style.background="rgba(255,0,170,0.15)";
    btn.style.boxShadow="0 0 12px rgba(255,0,170,0.4)";
    await loadStepData();
  } else {
    panel.style.display="none";
    btn.style.background="";
    btn.style.boxShadow="";
    resetStepVisuals();
  }
}

async function loadStepData() {
  setStatus("LOADING STEP DATA...");
  const walls=[];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (grid[r][c]===1) walls.push([r,c]);
  const res=await fetch("/stepdata",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({rows:ROWS,cols:COLS,walls,start:startCell,end:endCell,algo:stepAlgo})
  });
  const data=await res.json();
  stepData=data.steps; stepPath=data.path; stepIndex=0;
  resetStepVisuals();
  updateStepCounter();
  setStatus("STEP MODE — USE → ← KEYS OR BUTTONS");
  if (stepData.length>0) drawStep(0);
}

function stepForward() {
  if (!stepMode||!stepData.length) return;
  if (stepIndex<stepData.length-1) { stepIndex++; drawStep(stepIndex); }
  else { drawFinalPath(); setStatus("PATH FOUND! ← to go back"); }
}

function stepBack() {
  if (!stepMode||!stepData.length) return;
  if (stepIndex>0) { stepIndex--; drawStep(stepIndex); }
}

function drawStep(idx) {
  const step=stepData[idx];
  resetStepVisuals();
  for (const v of step.visited) {
    const [r,c]=v; if (isSpecialCell(r,c)) continue;
    const color=stepAlgo==="dijkstra"?C.visitedD:stepAlgo==="astar"?C.visitedA:C.visitedB;
    setCellColor(r,c,color,color,0.2); setCellHeight(r,c,0.3);
  }
  for (const n of step.neighbors) {
    const [r,c]=n; if (isSpecialCell(r,c)) continue;
    setCellColor(r,c,0xffaa00,0xffaa00,0.5); setCellHeight(r,c,0.5);
  }
  const [cr,cc]=step.current;
  if (!isSpecialCell(cr,cc)) { setCellColor(cr,cc,0xffffff,0xffffff,1.0); setCellHeight(cr,cc,0.8); }
  updateStepCounter();
  updateStepPanel(step);
  if (step.found) drawFinalPath();
}

function drawFinalPath() {
  const color=stepAlgo==="dijkstra"?C.pathD:stepAlgo==="astar"?C.pathA:C.pathB;
  for (const [r,c] of stepPath) {
    if (isSpecialCell(r,c)) continue;
    setCellColor(r,c,color,color,0.9); setCellHeight(r,c,1.0);
  }
}

function updateStepCounter() {
  document.getElementById("step-counter").textContent=`Step ${stepIndex+1} / ${stepData.length}`;
}

function updateStepPanel(step) {
  document.getElementById("step-action").textContent=step.action||"--";
  document.getElementById("step-curr").textContent=`(${step.current[0]}, ${step.current[1]})`;
  document.getElementById("step-cost").textContent=step.cost!==undefined?step.cost:"--";
  document.getElementById("step-h").textContent=step.heuristic!==undefined?step.heuristic:"--";
  document.getElementById("step-f").textContent=step.f_score!==undefined?step.f_score:"--";
  document.getElementById("step-nb").textContent=step.neighbors?step.neighbors.length:"--";
  document.getElementById("step-vis").textContent=step.visited?step.visited.length:"--";
}

function resetStepVisuals() {
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
    if (isSpecialCell(r,c)||grid[r][c]===1) continue;
    setCellColor(r,c,C.floor,0x000000,0); setCellHeight(r,c,1.0);
  }
}

function isSpecialCell(r,c) {
  if (startCell&&startCell[0]===r&&startCell[1]===c) return true;
  if (endCell&&endCell[0]===r&&endCell[1]===c) return true;
  return false;
}

async function setStepAlgo(algo,btn) {
  stepAlgo=algo;
  document.querySelectorAll(".step-algo-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("step-algo-name").textContent=algo==="dijkstra"?"DIJKSTRA":"A* SEARCH";
  if (stepMode) await loadStepData();
}

// ─────────────────────────────────────────────────────────────
//  RACE MODE
// ─────────────────────────────────────────────────────────────
let raceMode=false, raceRunning=false;

function toggleRace() {
  raceMode=!raceMode;
  const panel=document.getElementById("race-panel");
  const btn=document.getElementById("race-toggle-btn");
  if (raceMode) {
    panel.style.display="block";
    btn.style.background="rgba(255,136,0,0.15)";
    btn.style.boxShadow="0 0 12px rgba(255,136,0,0.4)";
  } else {
    panel.style.display="none";
    btn.style.background=""; btn.style.boxShadow=""; raceRunning=false;
  }
}

async function startRace() {
  if (!startCell||!endCell) { document.getElementById("race-status").textContent="SET START AND END FIRST!"; return; }
  if (raceRunning) return;
  raceRunning=true;
  ["d","a","b"].forEach(x=>{
    document.getElementById(`race-bar-${x}`).style.width="0%";
    document.getElementById(`race-info-${x}`).textContent="0 nodes";
  });
  document.getElementById("race-winner").textContent="";
  document.getElementById("race-status").textContent="RACING...";
  const walls=[];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (grid[r][c]===1) walls.push([r,c]);
  const res=await fetch("/solve",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({rows:ROWS,cols:COLS,walls,start:startCell,end:endCell})
  });
  const data=await res.json();
  updateStats(data);
  const dv=data.dijkstra.visited, av=data.astar.visited, bv=data.bfs.visited;
  const maxLen=Math.max(dv.length,av.length,bv.length);
  let frame=0, dDone=false, aDone=false, bDone=false, winnerShown=false;
  const raceInterval=setInterval(()=>{
    if (frame>=maxLen) { clearInterval(raceInterval); raceRunning=false; document.getElementById("race-status").textContent="RACE COMPLETE!"; return; }
    const dPct=Math.min(100,(frame/dv.length)*100);
    const aPct=Math.min(100,(frame/av.length)*100);
    const bPct=Math.min(100,(frame/bv.length)*100);
    document.getElementById("race-bar-d").style.width=dPct+"%";
    document.getElementById("race-bar-a").style.width=aPct+"%";
    document.getElementById("race-bar-b").style.width=bPct+"%";
    document.getElementById("race-info-d").textContent=Math.min(frame,dv.length)+" nodes";
    document.getElementById("race-info-a").textContent=Math.min(frame,av.length)+" nodes";
    document.getElementById("race-info-b").textContent=Math.min(frame,bv.length)+" nodes";
    if (!winnerShown) {
      if (frame>=dv.length&&data.dijkstra.stats.found&&!dDone) dDone=true;
      if (frame>=av.length&&data.astar.stats.found&&!aDone)    aDone=true;
      if (frame>=bv.length&&data.bfs.stats.found&&!bDone)      bDone=true;
      // Winner = fewest nodes visited (most efficient)
const winner = [
  { name:"DIJKSTRA", len:dv.length, found:data.dijkstra.stats.found },
  { name:"A*",       len:av.length, found:data.astar.stats.found },
  { name:"BFS",      len:bv.length, found:data.bfs.stats.found },
].filter(x => x.found)
 .reduce((a,b) => a.len < b.len ? a : b, {name:null, len:Infinity});

const first = (dDone||aDone||bDone) ? winner.name : null;
      if (first) {
        winnerShown=true;
        const colors={"DIJKSTRA":"#00d4ff","A*":"#ffdd00","BFS":"#00ff88"};
        document.getElementById("race-winner").innerHTML=`🏆 <span style="color:${colors[first]}">${first} WINS!</span>`;
        document.getElementById("race-status").textContent="FIRST TO FINISH!";
      }
    }
    frame+=8;
  },50);
}

// ─────────────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────────────
init();
// ─────────────────────────────────────────────────────────────
//  TSP MODE
// ─────────────────────────────────────────────────────────────
let tspMode   = false;
let tspPoints = [];   // array of [r, c]
let tspMeshes = [];   // waypoint markers

function toggleTSP() {
  tspMode = !tspMode;
  const panel = document.getElementById("tsp-panel");
  const btn   = document.getElementById("tsp-toggle-btn");

  if (tspMode) {
    panel.style.display = "block";
    btn.style.background = "rgba(255,221,0,0.12)";
    btn.style.boxShadow  = "0 0 14px rgba(255,221,0,0.35)";
    setStatus("TSP MODE — CLICK CELLS TO ADD WAYPOINTS (MAX 10)");
  } else {
    panel.style.display  = "none";
    btn.style.background = "";
    btn.style.boxShadow  = "";
    clearTSP();
  }
}

function addTSPPoint(r, c) {
  if (!tspMode) return;
  if (tspPoints.length >= 10) {
    document.getElementById("tsp-status").textContent =
      "Max 10 points reached!";
    return;
  }
  // Check not duplicate
  if (tspPoints.some(p => p[0]===r && p[1]===c)) return;

  tspPoints.push([r, c]);

  // Mark cell yellow
  setCellColor(r, c, 0xffdd00, 0xffdd00, 0.9);
  setCellHeight(r, c, 1.2);

  // Add number label
  const pos  = cellPos(r, c);
  const num  = tspPoints.length;
  const geo  = new THREE.SphereGeometry(0.3, 8, 8);
  const mat  = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos.x, 1.8, pos.z);
  scene.add(mesh);
  tspMeshes.push(mesh);

  document.getElementById("tsp-points-count").textContent =
    `Points: ${tspPoints.length} / 10`;
  document.getElementById("tsp-status").textContent =
    `Point ${num} added at (${r},${c})`;
}

async function runTSP() {
  if (tspPoints.length < 3) {
    document.getElementById("tsp-status").textContent =
      "Need at least 3 points!";
    return;
  }

  document.getElementById("tsp-status").textContent = "SOLVING...";
  setStatus("RUNNING TSP — BRUTE FORCE + GREEDY + DP...");

  const res  = await fetch("/tsp", {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify({ points: tspPoints })
  });
  const data = await res.json();

  if (data.error) {
    document.getElementById("tsp-status").textContent = data.error;
    return;
  }

  // Show results
  const methods = [
    { key:"brute",  color:"#ff3355", label:"BRUTE FORCE" },
    { key:"greedy", color:"#ffaa00", label:"GREEDY" },
    { key:"dp",     color:"#00ff88", label:"DP HELD-KARP" },
  ];

  document.getElementById("tsp-results").innerHTML = methods.map(m => {
    const r = data[m.key];
    return `<div class="tsp-method">
      <div class="tsp-method-name" style="color:${m.color}">${m.label}</div>
      <div class="tsp-method-dist" style="color:${m.color}">
        ${r.distance} units
      </div>
      <div class="tsp-method-time">${r.time_ms} ms · ${r.optimal?"✓ Optimal":"~ Approx"}</div>
    </div>`;
  }).join("");

  // Animate best path (DP)
  animateTSPPath(data.dp.path, 0x00ff88);

  document.getElementById("tsp-status").textContent = "DONE — SEE COMPARISON";
  setStatus(`TSP SOLVED — DP: ${data.dp.distance} | Greedy: ${data.greedy.distance}`);
}

function animateTSPPath(path, color) {
  path.forEach((idx, i) => {
    if (i === path.length-1) return;
    const from = tspPoints[idx];
    const to   = tspPoints[path[i+1]];
    if (!from || !to) return;

    setTimeout(() => {
      const posA = cellPos(from[0], from[1]);
      const posB = cellPos(to[0],   to[1]);
      const geo  = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(posA.x, 2.0, posA.z),
        new THREE.Vector3(posB.x, 2.0, posB.z),
      ]);
      const mat  = new THREE.LineBasicMaterial({ color, linewidth:3 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      tspMeshes.push(line);
    }, i * 200);
  });
}

function clearTSP() {
  // Remove 3D objects
  tspMeshes.forEach(m => scene.remove(m));
  tspMeshes  = [];
  tspPoints  = [];

  document.getElementById("tsp-points-count").textContent = "Points: 0 / 10";
  document.getElementById("tsp-status").textContent = "Click grid cells to add waypoints";
  document.getElementById("tsp-results").innerHTML  = "";
  setStatus("TSP CLEARED — CLICK CELLS TO ADD WAYPOINTS");
}

// ─────────────────────────────────────────────────────────────
//  AI EXPLAIN MODE
// ─────────────────────────────────────────────────────────────
let aiMode      = false;
let aiStepIndex = 0;
let aiStepData  = [];
let aiAlgo      = "dijkstra";

function toggleAI() {
  aiMode = !aiMode;
  const panel = document.getElementById("ai-panel");
  const btn   = document.getElementById("ai-toggle-btn");

  if (aiMode) {
    panel.style.display = "block";
    btn.style.background = "rgba(170,0,255,0.12)";
    btn.style.boxShadow  = "0 0 14px rgba(170,0,255,0.4)";
    setStatus("AI EXPLAIN ON — RUN ALGORITHMS TO SEE EXPLANATION");
  } else {
    panel.style.display  = "none";
    btn.style.background = "";
    btn.style.boxShadow  = "";
  }
}

// ── Generate explanation for each step ───────────────────────
function generateAIExplanation(step, index, total, algo) {
  const node = step.current;
  const cost = step.cost;
  const nb   = step.neighbors || [];
  const vis  = step.visited   || [];

  // Why this node explanation
  const whyText = algo === "dijkstra"
    ? `Priority queue selected node (${node[0]},${node[1]}) because it has the LOWEST cumulative cost = ${cost}. All other unvisited nodes have higher cost.`
    : algo === "astar"
    ? `A* selected this node because f(n) = g(n)+h(n) is minimum. g=${cost} (cost from start), h=${step.heuristic||"?"} (Manhattan distance to goal), f=${step.f_score||"?"}.`
    : `BFS dequeued (${node[0]},${node[1]}) from the front of the queue. BFS explores all nodes at distance ${Math.floor(index/4)} before going deeper.`;

  // Neighbor explanation
  const nbText = nb.length === 0
    ? "No unvisited neighbors found. Backtracking."
    : nb.map(n => {
        const newCost = cost + 1;
        return `(${n[0]},${n[1]}) → cost ${newCost}`;
      }).join("\n");

  // Insight
  let insight = "";
  const progress = Math.round((index/total)*100);
  if (progress < 20)
    insight = `Early exploration phase. ${vis.length} nodes visited. Algorithm spreading outward from start.`;
  else if (progress < 50)
    insight = `Mid search. ${vis.length} nodes visited. ${algo==="astar"?"A* heuristic guiding toward goal.":"Dijkstra exploring in cost order."}`;
  else if (progress < 80)
    insight = `Late phase. Getting close to goal. ${vis.length} nodes visited so far.`;
  else
    insight = `Near completion! Only ${total-index} steps remaining. Path found soon.`;

  if (step.found)
    insight = `🎉 GOAL REACHED! Shortest path found in ${index} steps. Total cost: ${cost}.`;

  return { whyText, nbText, insight };
}

// ── Update AI panel ───────────────────────────────────────────
function updateAIPanel(step, index, total, algo) {
  if (!aiMode) return;

  const { whyText, nbText, insight } = generateAIExplanation(step, index, total, algo);

  document.getElementById("ai-algo-tag").textContent =
    algo === "dijkstra" ? "DIJKSTRA'S ALGORITHM"
    : algo === "astar"  ? "A* SEARCH ALGORITHM"
    : "BFS ALGORITHM";

  document.getElementById("ai-step-num").textContent =
    `Step ${index+1} / ${total}`;

  document.getElementById("ai-node-val").textContent =
    `(${step.current[0]}, ${step.current[1]})`;

  document.getElementById("ai-cost-val").textContent =
    step.cost !== undefined ? step.cost : "--";

  document.getElementById("ai-why-val").textContent  = whyText;
  document.getElementById("ai-nb-val").textContent   = nbText;
  document.getElementById("ai-vis-val").textContent  = step.visited ? step.visited.length : "--";
  document.getElementById("ai-insight-val").textContent = insight;
}

// ── Hook into step mode ───────────────────────────────────────
const _origDrawStep = typeof drawStep !== "undefined" ? drawStep : null;

function drawStepWithAI(idx) {
  if (typeof drawStep === "function" && drawStep !== drawStepWithAI) {
    drawStep(idx);
  }
  if (aiMode && stepData.length > 0) {
    updateAIPanel(stepData[idx], idx, stepData.length, stepAlgo);
  }
}

// Override stepForward to also update AI
const _origStepForward = stepForward;
window.stepForward = function() {
  _origStepForward();
  if (aiMode && stepData.length > 0 && stepIndex < stepData.length) {
    updateAIPanel(stepData[stepIndex], stepIndex, stepData.length, stepAlgo);
  }
};

// Override stepBack to also update AI
const _origStepBack = stepBack;
window.stepBack = function() {
  _origStepBack();
  if (aiMode && stepData.length > 0 && stepIndex >= 0) {
    updateAIPanel(stepData[stepIndex], stepIndex, stepData.length, stepAlgo);
  }
};
// ─────────────────────────────────────────────────────────────
//  WELCOME GUIDE
// ─────────────────────────────────────────────────────────────
function closeGuide() {
  const overlay = document.getElementById("guide-overlay");
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s ease";
  setTimeout(() => overlay.style.display = "none", 300);
}

function toggleDontShow(checkbox) {
  if (checkbox.checked) {
    localStorage.setItem("pathfinder-guide-seen", "true");
  } else {
    localStorage.removeItem("pathfinder-guide-seen");
  }
}

// Auto hide if seen before
window.addEventListener("load", () => {
  if (localStorage.getItem("pathfinder-guide-seen") === "true") {
    document.getElementById("guide-overlay").style.display = "none";
  }
});

// Press ESC to close guide
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const guide = document.getElementById("guide-overlay");
    if (guide && guide.style.display !== "none") closeGuide();
  }
});
