# ─────────────────────────────────────────────────────────────
#  app.py  —  Flask server, bridges Python algorithms + browser
# ─────────────────────────────────────────────────────────────

from algorithms.tsp import tsp_brute, tsp_greedy, tsp_dp
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from grid import Grid
from algorithms.dijkstra import Dijkstra
from algorithms.astar    import AStar
from algorithms.bfs      import BFS
from utils.logger        import Logger

app    = Flask(__name__)
CORS(app)
logger = Logger()

# ─────────────────────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────────────────────

# Serve main page
@app.route("/")
def index():
    return render_template("index.html")

# ── Run algorithms ────────────────────────────────────────────
@app.route("/solve", methods=["POST"])
def solve():
    data = request.json

    rows   = data.get("rows",  28)
    cols   = data.get("cols",  28)
    walls  = data.get("walls", [])
    start  = tuple(data.get("start"))
    end    = tuple(data.get("end"))

    # Build grid
    grid = Grid()
    grid.start = start
    grid.end   = end
    for w in walls:
        grid.set_wall(w[0], w[1])

    # Run all 3 algorithms
    dijkstra = Dijkstra(grid)
    astar    = AStar(grid)
    bfs      = BFS(grid)

    dijkstra.run()
    astar.run()
    bfs.run()

    # Log results
    logger.log(
        grid,
        dijkstra.get_stats(),
        astar.get_stats(),
        bfs.get_stats()
    )

    return jsonify({
        "dijkstra": {
            "visited"  : dijkstra.visited,
            "path"     : dijkstra.path,
            "stats"    : dijkstra.get_stats()
        },
        "astar": {
            "visited"  : astar.visited,
            "path"     : astar.path,
            "stats"    : astar.get_stats()
        },
        "bfs": {
            "visited"  : bfs.visited,
            "path"     : bfs.path,
            "stats"    : bfs.get_stats()
        }
    })

# ── Generate random maze ──────────────────────────────────────
@app.route("/maze", methods=["GET"])
def maze():
    import random
    from utils.file_handler import FileHandler
    from config import TERRAIN_COST
    grid = Grid()
    fh   = FileHandler()
    fh.generate_random_maze(grid, wall_density=0.2)

    # Add random terrain
    terrain = []
    for r in range(grid.rows):
        for c in range(grid.cols):
            if grid.cells[r][c] != 1:
                t = random.choices(
                    [0, 0, 0, 2, 3, 4],
                    weights=[50, 10, 10, 15, 10, 5]
                )[0]
                grid.terrain[r][c] = t
                if t != 0:
                    terrain.append([r, c, t])

    walls = []
    for r in range(grid.rows):
        for c in range(grid.cols):
            if grid.cells[r][c] == 1:
                walls.append([r, c])

    return jsonify({
        "walls"  : walls,
        "terrain": terrain,
        "start"  : list(grid.start),
        "end"    : list(grid.end),
        "rows"   : grid.rows,
        "cols"   : grid.cols
    })
# ── Step by Step data ─────────────────────────────────────────
@app.route("/stepdata", methods=["POST"])
def stepdata():
    data  = request.json
    rows  = data.get("rows",  28)
    cols  = data.get("cols",  28)
    walls = data.get("walls", [])
    start = tuple(data.get("start"))
    end   = tuple(data.get("end"))
    algo  = data.get("algo", "dijkstra")

    grid  = Grid()
    grid.start = start
    grid.end   = end
    for w in walls:
        grid.set_wall(w[0], w[1])

    steps = []

    if algo == "dijkstra":
        import heapq
        dist  = { start: 0 }
        prev  = { start: None }
        pq    = [(0, start)]
        visited = set()

        while pq:
            cost, curr = heapq.heappop(pq)
            if curr in visited:
                continue
            visited.add(curr)

            neighbors = grid.get_neighbors(curr[0], curr[1])
            steps.append({
                "current"   : list(curr),
                "cost"      : cost,
                "visited"   : [list(v) for v in visited],
                "neighbors" : [list(n) for n in neighbors],
                "action"    : f"Visiting ({curr[0]},{curr[1]}) | Cost: {cost} | Neighbors: {len(neighbors)}",
                "found"     : curr == end
            })

            if curr == end:
                break

            for nb in neighbors:
                new_cost = cost + 1
                if nb not in dist or new_cost < dist[nb]:
                    dist[nb] = new_cost
                    prev[nb] = curr
                    heapq.heappush(pq, (new_cost, nb))

        # Build path
        path = []
        node = end
        while node:
            path.append(list(node))
            node = prev.get(node)
        path.reverse()

    elif algo == "astar":
        import heapq
        def h(n): return abs(n[0]-end[0]) + abs(n[1]-end[1])
        g     = { start: 0 }
        prev  = { start: None }
        pq    = [(h(start), start)]
        visited = set()

        while pq:
            f, curr = heapq.heappop(pq)
            if curr in visited:
                continue
            visited.add(curr)

            neighbors = grid.get_neighbors(curr[0], curr[1])
            steps.append({
                "current"   : list(curr),
                "cost"      : g.get(curr, 0),
                "heuristic" : h(curr),
                "f_score"   : f,
                "visited"   : [list(v) for v in visited],
                "neighbors" : [list(n) for n in neighbors],
                "action"    : f"Visiting ({curr[0]},{curr[1]}) | g={g.get(curr,0)} h={h(curr)} f={f}",
                "found"     : curr == end
            })

            if curr == end:
                break

            for nb in neighbors:
                new_g = g[curr] + 1
                if nb not in g or new_g < g[nb]:
                    g[nb]    = new_g
                    prev[nb] = curr
                    heapq.heappush(pq, (new_g + h(nb), nb))

        path = []
        node = end
        while node:
            path.append(list(node))
            node = prev.get(node)
        path.reverse()

    return jsonify({ "steps": steps, "path": path })

# ── TSP Solver ────────────────────────────────────────────────
@app.route("/tsp", methods=["POST"])
def solve_tsp():
    data   = request.json
    points = data.get("points", [])  # list of [row, col]

    if len(points) < 3:
        return jsonify({ "error": "Need at least 3 points" })
    if len(points) > 10:
        return jsonify({ "error": "Max 10 points for browser" })

    # Run all 3 methods
    greedy = tsp_greedy(points)
    dp     = tsp_dp(points)

    # Brute force only if n <= 8
    if len(points) <= 8:
        brute = tsp_brute(points)
    else:
        brute = { "method":"Brute Force",
                  "distance":"Too slow",
                  "time_ms":"N/A",
                  "path":[], "optimal":False }

    return jsonify({
        "greedy" : greedy,
        "dp"     : dp,
        "brute"  : brute,
        "points" : points
    })

# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
