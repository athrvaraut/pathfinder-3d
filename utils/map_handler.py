# ─────────────────────────────────────────────────────────────
#  utils/map_handler.py  —  Real road network via OSMnx
# ─────────────────────────────────────────────────────────────

import osmnx as ox
import heapq
import time

ox.settings.log_console = False
ox.settings.use_cache   = True

class MapHandler:
    def __init__(self):
        self.G         = None
        self.city_name = None

    def load_city(self, city_name="Pune, Maharashtra, India"):
        shortcuts = {
            "pune"     : "Pune, Maharashtra, India",
            "mumbai"   : "Mumbai, Maharashtra, India",
            "delhi"    : "New Delhi, India",
            "bangalore": "Bangalore, Karnataka, India",
            "nagpur"   : "Nagpur, Maharashtra, India",
            "nashik"   : "Nashik, Maharashtra, India",
        }
        city_name = shortcuts.get(city_name.lower().strip(), city_name)
        print(f"[MAP] Loading {city_name}...")
        self.city_name = city_name
        self.G = ox.graph_from_place(city_name, network_type="drive", simplify=True)
        print(f"[MAP] Loaded — nodes:{len(self.G.nodes)} edges:{len(self.G.edges)}")
        return {
            "nodes": len(self.G.nodes),
            "edges": len(self.G.edges),
            "city" : city_name
        }

    def nearest_node(self, lat, lon):
        return ox.distance.nearest_nodes(self.G, lon, lat)

    def dijkstra(self, start_node, end_node):
        t_start = time.perf_counter()
        dist    = { start_node: 0 }
        prev    = { start_node: None }
        pq      = [(0, start_node)]
        visited = set()
        nodes_visited = 0

        while pq:
            cost, curr = heapq.heappop(pq)
            if curr in visited:
                continue
            visited.add(curr)
            nodes_visited += 1
            if curr == end_node:
                break
            for nb in self.G.neighbors(curr):
                edge_data = self.G.get_edge_data(curr, nb)
                length = min(
                    d.get("length", 100) for d in edge_data.values()
                ) if isinstance(edge_data, dict) else edge_data.get("length", 100)
                new_cost = cost + length
                if nb not in dist or new_cost < dist[nb]:
                    dist[nb] = new_cost
                    prev[nb] = curr
                    heapq.heappush(pq, (new_cost, nb))

        time_taken = round((time.perf_counter() - t_start) * 1000, 4)

        path = []
        node = end_node
        while node is not None:
            path.append(node)
            node = prev.get(node)
        path.reverse()

        path_coords = []
        for n in path:
            data = self.G.nodes[n]
            path_coords.append({"lat": data["y"], "lon": data["x"], "id": n})

        return {
            "path"          : path_coords,
            "total_dist_km" : round(dist.get(end_node, 0) / 1000, 3),
            "nodes_visited" : nodes_visited,
            "time_ms"       : time_taken,
            "found"         : end_node in dist
        }

    def get_nodes_coords(self, limit=500):
        nodes = []
        for nid, data in list(self.G.nodes(data=True))[:limit]:
            nodes.append({"id": nid, "lat": data["y"], "lon": data["x"]})
        return nodes

    def get_edges_coords(self, limit=1000):
        edges = []
        for u, v, data in list(self.G.edges(data=True))[:limit]:
            nu = self.G.nodes[u]
            nv = self.G.nodes[v]
            edges.append({
                "from": {"lat": nu["y"], "lon": nu["x"]},
                "to"  : {"lat": nv["y"], "lon": nv["x"]},
                "len" : round(data.get("length", 0))
            })
        return edges