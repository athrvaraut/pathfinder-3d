# ─────────────────────────────────────────────────────────────
#  algorithms/astar.py  —  A* Shortest Path
# ─────────────────────────────────────────────────────────────

import heapq
import time

class AStar:
    def __init__(self, grid):
        self.grid          = grid
        self.visited       = []   # ordered list for animation
        self.visited_set   = set()
        self.g_score       = {}   # cost from start to node
        self.f_score       = {}   # g + heuristic
        self.prev          = {}
        self.path          = []
        self.nodes_visited = 0
        self.path_length   = 0
        self.time_taken    = 0.0
        self.found         = False

    # ── Heuristic — Manhattan Distance ───────────────────────
    def heuristic(self, node):
        end = self.grid.end
        return abs(node[0] - end[0]) + abs(node[1] - end[1])

    # ── Reset ─────────────────────────────────────────────────
    def reset(self):
        self.visited       = []
        self.visited_set   = set()
        self.g_score       = {}
        self.f_score       = {}
        self.prev          = {}
        self.path          = []
        self.nodes_visited = 0
        self.path_length   = 0
        self.time_taken    = 0.0
        self.found         = False

    # ── Main Run ──────────────────────────────────────────────
    def run(self):
        start = self.grid.start
        end   = self.grid.end

        if not start or not end:
            print("[A*] No start or end set!")
            return False

        t_start = time.perf_counter()

        # g=0 at start, f = g + h
        self.g_score[start] = 0
        self.f_score[start] = self.heuristic(start)
        self.prev[start]    = None

        # Priority queue → (f_score, (row, col))
        pq = [(self.f_score[start], start)]

        while pq:
            _, curr = heapq.heappop(pq)

            # Skip if already visited
            if curr in self.visited_set:
                continue

            self.visited_set.add(curr)
            self.visited.append(curr)   # for animation
            self.nodes_visited += 1

            # ── Goal reached ──────────────────────────────────
            if curr == end:
                self.found      = True
                self.time_taken = round((time.perf_counter() - t_start) * 1000, 4)
                self._build_path()
                self.path_length = len(self.path)
                return True

            # ── Explore neighbors ─────────────────────────────
            for neighbor in self.grid.get_neighbors(curr[0], curr[1]):
                tentative_g = self.g_score[curr] + self.grid.get_cost(neighbor[0], neighbor[1])

                if neighbor not in self.g_score or tentative_g < self.g_score[neighbor]:
                    self.g_score[neighbor] = tentative_g
                    self.f_score[neighbor] = tentative_g + self.heuristic(neighbor)
                    self.prev[neighbor]    = curr
                    heapq.heappush(pq, (self.f_score[neighbor], neighbor))

        # No path found
        self.time_taken = round((time.perf_counter() - t_start) * 1000, 4)
        self.found      = False
        return False

    # ── Build path by backtracking from end ───────────────────
    def _build_path(self):
        node = self.grid.end
        while node is not None:
            self.path.append(node)
            node = self.prev.get(node)
        self.path.reverse()

    # ── Stats dict (for logger) ───────────────────────────────
    def get_stats(self):
        return {
            "algorithm"     : "A*",
            "nodes_visited" : self.nodes_visited,
            "path_length"   : self.path_length,
            "time_ms"       : self.time_taken,
            "found"         : self.found
        }

    def __repr__(self):
        return (f"A* | visited={self.nodes_visited} "
                f"path={self.path_length} time={self.time_taken}ms")