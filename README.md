# Pathfinder 3D: Graph Traversal & Routing Engine

An interactive, high-performance visualization tool designed to demonstrate the mechanics of standard and advanced graph traversal algorithms. Built with a Python processing backend and a responsive WebGL/JavaScript frontend, this project visualizes how AI agents navigate complex 3D topological mazes and real-world geographical coordinates.

Live Application: [View Pathfinder 3D Live](https://pathfinder-3d.onrender.com/)

---

## 🚀 Key Features

* **3D Isometric Grid Engine:** Watch algorithms expand node-by-node in a 3D spatial environment, allowing drag-to-rotate canvas controls.
* **Algorithm Racing & Benchmarking:** Run multiple algorithms concurrently (e.g., A* vs. BFS) to compare real-time execution speeds (in milliseconds), nodes visited, and final path efficiency.
* **Global Macro-Routing:** Switches from micro-grid mazes to real-world coordinate mapping (e.g., routing from Mumbai to New York) utilizing Traveling Salesperson (TSP) logic.
* **Intelligent Caching:** Implements a hashed caching layer (`/cache`) to memoize previously calculated complex routes, drastically reducing compute load on repeated queries.

---

## 🧠 Implemented Algorithms

The backend engine (`/algorithms`) supports several classic and modern pathfinding paradigms:

| Algorithm | Paradigm | General Time Complexity | Use Case |
| :--- | :--- | :--- | :--- |
| **Dijkstra** | Greedy / Uniform Cost | $O(E + V \log V)$ | Guaranteed shortest path on weighted graphs. |
| **A* Search** | Heuristic Search | $O(E)$ (best case) | Highly efficient directional pathing using Manhattan/Euclidean distance. |
| **BFS** | Breadth-First | $O(V + E)$ | Optimal for unweighted, symmetrical grid expansion. |
| **Bidirectional** | Two-way Search | $O(b^{d/2})$ | Cuts search space in half by searching from Start and End simultaneously. |
| **D* Lite** | Incremental Search | Dynamic | Adapts dynamically to changing edge weights or new obstacles. |
| **TSP** | Combinatorial | $O(n^2 2^n)$ (Dynamic) | Calculates the most efficient route connecting multiple global nodes. |

---

## 📂 Project Structure

```text
PATHFINDER_3D/
├── algorithms/           # Core mathematical graph traversal scripts
│   ├── astar.py
│   ├── bfs.py
│   ├── bidirectional.py
│   ├── dijkstra.py
│   ├── dstar_lite.py
│   └── tsp.py
├── cache/                # Memoization hashes for optimized performance
├── data/                 # Static datasets
│   ├── maps/             # CSV representations of city and grid layouts
│   └── results/          # Performance benchmark logs
├── static/               # Frontend rendering assets
│   ├── css/style.css     # Cyberpunk/Neon UI styling
│   └── js/               # Client-side canvas logic (city.js, realmap.js, main.js)
├── templates/            # HTML entry points (index.html)
├── ui/                   # Python-side rendering and panel state managers
├── utils/                # Helper modules (loggers, map handlers, file I/O)
├── app.py                # Main web server runtime
├── config.py             # System variables and tuning parameters
├── grid.py               # 3D spatial coordinate generator
└── Procfile              # Render deployment configuration

🛠️ Local Installation & Setup
1. Clone the Repository
Bash
git clone [https://github.com/athrvaraut/pathfinder-3d.git](https://github.com/athrvaraut/pathfinder-3d.git)
cd pathfinder-3d
2. Environment Setup
Ensure you have Python 3.10+ installed. Install the backend dependencies:

Bash
pip install -r requirements.txt
3. Launch the Server
Execute the main application server:

Bash
python app.py
(The application will initialize the cache and open a local server port, typically accessible at http://127.0.0.1:5000)


### Why this structure works:
* **Procfile Recognition:** Adding the `Procfile` to the folder structure explicitly shows recruiters that you know how to configure apps for cloud deployment (Render/Heroku), rather than just running scripts locally.
* **Time Complexities:** Listing the mathematical Big-O notations for algorithms like D* Lite and Bidirectional search proves you understand the underlying mathematics, not just the code syntax. 

Commit this directly to your main branch and your portfolio will be looking exceptionally strong!
