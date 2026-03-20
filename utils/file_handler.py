# ─────────────────────────────────────────────────────────────
#  utils/file_handler.py  —  Save and Load maps from CSV
# ─────────────────────────────────────────────────────────────

import os
import csv
import numpy as np
import random
import sys
from config import MAP1_PATH, MAP2_PATH, CITY_PATH, GRID_ROWS, GRID_COLS

class FileHandler:
    def __init__(self):
        self.slots = {
            "1" : MAP1_PATH,
            "2" : MAP2_PATH,
            "3" : CITY_PATH
        }
        self._ensure_dirs()

    # ── Create folders if missing ─────────────────────────────
    def _ensure_dirs(self):
        os.makedirs("data/maps",    exist_ok=True)
        os.makedirs("data/results", exist_ok=True)

    # ── Save grid to slot ─────────────────────────────────────
    def save(self, grid, slot="1"):
        filepath = self.slots.get(slot)
        if not filepath:
            print(f"[FILE] Invalid slot: {slot}")
            return False
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            sr = grid.start[0] if grid.start else -1
            sc = grid.start[1] if grid.start else -1
            er = grid.end[0]   if grid.end   else -1
            ec = grid.end[1]   if grid.end   else -1
            writer.writerow(['START', sr, sc, 'END', er, ec])
            for row in grid.cells:
                writer.writerow(row.tolist())
        print(f"[FILE] Map saved to slot {slot} → {filepath}")
        return True

    # ── Load grid from slot ───────────────────────────────────
    def load(self, grid, slot="1"):
        filepath = self.slots.get(slot)
        if not filepath:
            print(f"[FILE] Invalid slot: {slot}")
            return False
        if not os.path.exists(filepath):
            print(f"[FILE] No saved map in slot {slot}")
            return False
        try:
            with open(filepath, 'r') as f:
                reader = csv.reader(f)
                rows   = list(reader)
                meta   = rows[0]
                sr, sc = int(meta[1]), int(meta[2])
                er, ec = int(meta[4]), int(meta[5])
                grid.start = (sr, sc) if sr != -1 else None
                grid.end   = (er, ec) if er != -1 else None
                grid.cells = np.array(
                    [list(map(int, row)) for row in rows[1:]], dtype=int
                )
            print(f"[FILE] Map loaded from slot {slot} → {filepath}")
            return True
        except Exception as e:
            print(f"[FILE] Error loading: {e}")
            return False

    # ── Recursive Backtracking Maze Generator ─────────────────
    def generate_random_maze(self, grid, wall_density=0.2):
        rows = grid.rows
        cols = grid.cols

        # Start with all walls
        grid.cells[:]   = 1
        grid.terrain[:] = 0

        visited = set()

        def carve(r, c):
            visited.add((r, c))
            grid.cells[r][c] = 0
            directions = [(-2,0),(2,0),(0,-2),(0,2)]
            random.shuffle(directions)
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if (0 <= nr < rows and 0 <= nc < cols
                        and (nr, nc) not in visited):
                    grid.cells[r + dr//2][c + dc//2] = 0
                    carve(nr, nc)

        sys.setrecursionlimit(10000)
        carve(0, 0)

        # Set start and end
        grid.start = (0, 0)
        grid.end   = (rows-1, cols-1)
        grid.cells[rows-1][cols-1] = 0

        # Add terrain to open cells
        terrain_types = [0,0,0,0,2,2,3,4]
        for r in range(rows):
            for c in range(cols):
                if grid.cells[r][c] == 0:
                    grid.terrain[r][c] = random.choice(terrain_types)

        print(f"[MAZE] Recursive backtracking maze generated!")
        return grid

    # ── List saved slots ──────────────────────────────────────
    def list_slots(self):
        print("\n[FILE] Saved Map Slots:")
        for slot, path in self.slots.items():
            exists = "✓ saved" if os.path.exists(path) else "✗ empty"
            print(f"  Slot {slot} → {path}  [{exists}]")
        print()