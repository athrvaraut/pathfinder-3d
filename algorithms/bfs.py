# ─────────────────────────────────────────────────────────────
#  algorithms/bfs.py  —  Breadth First Search
# ─────────────────────────────────────────────────────────────

from collections import deque
import time

class BFS:
    def __init__(self, grid):
        self.grid          = grid
        self.visited       = []   # ordered list for animation
        self.visited_set   = set()
        self.prev          = {}
        self.path          = []
        self.nodes_visited = 0
        self.path_length   = 0
        self.time_taken    = 0.0
        self.found         = False

    # ── Reset ─────────────────────────────────────────────────
    def reset(self):
        self.visited       = []
        self.visited_set   = set()
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
            print("[BFS] No start or end set!")
            return False

        t_start = time.perf_counter()

        # Queue → deque for O(1) popleft
        queue = deque([start])
        self.visited_set.add(start)
        self.prev[start] = None

        while queue:
            curr = queue.popleft()

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
                if neighbor not in self.visited_set:
                    self.visited_set.add(neighbor)
                    self.prev[neighbor] = curr
                    queue.append(neighbor)

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
            "algorithm"     : "BFS",
            "nodes_visited" : self.nodes_visited,
            "path_length"   : self.path_length,
            "time_ms"       : self.time_taken,
            "found"         : self.found
        }

    def __repr__(self):
        return (f"BFS | visited={self.nodes_visited} "
                f"path={self.path_length} time={self.time_taken}ms")