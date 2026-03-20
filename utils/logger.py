# ─────────────────────────────────────────────────────────────
#  utils/logger.py  —  Saves every run's stats to .txt file
# ─────────────────────────────────────────────────────────────

import os
from datetime import datetime
from config import LOG_PATH

class Logger:
    def __init__(self):
        self.filepath = LOG_PATH
        self._ensure_file()

    # ── Create file if not exists ─────────────────────────────
    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            with open(self.filepath, 'w') as f:
                f.write("=" * 60 + "\n")
                f.write("  PATHFINDER — Algorithm Results Log\n")
                f.write("=" * 60 + "\n\n")

    # ── Log one run ───────────────────────────────────────────
    def log(self, grid, dijkstra_stats, astar_stats, bfs_stats):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        lines = []
        lines.append("\n" + "-" * 60)
        lines.append(f"  RUN TIME     : {timestamp}")
        lines.append(f"  GRID SIZE    : {grid.rows} x {grid.cols}")
        lines.append(f"  WALLS        : {grid.wall_count()}")
        lines.append(f"  START        : {grid.start}")
        lines.append(f"  END          : {grid.end}")
        lines.append("-" * 60)

        for stats in [dijkstra_stats, astar_stats, bfs_stats]:
            lines.append(f"\n  [{stats['algorithm']}]")
            lines.append(f"    Nodes Visited : {stats['nodes_visited']}")
            lines.append(f"    Path Length   : {stats['path_length']}")
            lines.append(f"    Time Taken    : {stats['time_ms']} ms")
            lines.append(f"    Path Found    : {stats['found']}")

        lines.append("\n" + "-" * 60)

        with open(self.filepath, 'a') as f:
            f.write("\n".join(lines) + "\n")

        print(f"[LOGGER] Results saved to {self.filepath}")

    # ── Read all logs ─────────────────────────────────────────
    def read_all(self):
        with open(self.filepath, 'r') as f:
            return f.read()

    # ── Clear log file ────────────────────────────────────────
    def clear(self):
        with open(self.filepath, 'w') as f:
            f.write("=" * 60 + "\n")
            f.write("  PATHFINDER — Algorithm Results Log\n")
            f.write("=" * 60 + "\n\n")
        print("[LOGGER] Log cleared")