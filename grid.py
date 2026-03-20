# ─────────────────────────────────────────────────────────────
#  grid.py  —  Grid class, cell states, mouse interaction
# ─────────────────────────────────────────────────────────────

import numpy as np
import csv
from config import *

class Grid:
    def __init__(self):
        self.rows    = GRID_ROWS
        self.cols    = GRID_COLS
        self.cells   = np.zeros((self.rows, self.cols), dtype=int)
        self.terrain = np.zeros((self.rows, self.cols), dtype=int)
        self.start   = None
        self.end     = None

    # ── Basic Operations ─────────────────────────────────────
    def reset(self):
        self.cells   = np.zeros((self.rows, self.cols), dtype=int)
        self.terrain = np.zeros((self.rows, self.cols), dtype=int)
        self.start   = None
        self.end     = None

    def set_wall(self, row, col):
        if (row, col) != self.start and (row, col) != self.end:
            self.cells[row][col] = 1

    def remove_wall(self, row, col):
        self.cells[row][col] = 0

    def is_wall(self, row, col):
        return self.cells[row][col] == 1

    def in_bounds(self, row, col):
        return 0 <= row < self.rows and 0 <= col < self.cols

    # ── Terrain ───────────────────────────────────────────────
    def get_cost(self, row, col):
        t = int(self.terrain[row][col])
        return TERRAIN_COST.get(t, 1)

    def set_terrain(self, row, col, terrain_type):
        if self.cells[row][col] != 1:
            self.terrain[row][col] = terrain_type

    # ── Mouse → Cell ─────────────────────────────────────────
    def get_cell_from_mouse(self, mx, my):
        col = (mx - GRID_OFFSET_X) // CELL_SIZE
        row = (my - GRID_OFFSET_Y) // CELL_SIZE
        if self.in_bounds(row, col):
            return (row, col)
        return None

    # ── Neighbors ────────────────────────────────────────────
    def get_neighbors(self, row, col):
        directions = [(-1,0),(1,0),(0,-1),(0,1)]
        result = []
        for dr, dc in directions:
            r, c = row + dr, col + dc
            if self.in_bounds(r, c) and not self.is_wall(r, c):
                result.append((r, c))
        return result

    # ── Save to CSV ──────────────────────────────────────────
    def save_to_csv(self, filepath):
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            sr = self.start[0] if self.start else -1
            sc = self.start[1] if self.start else -1
            er = self.end[0]   if self.end   else -1
            ec = self.end[1]   if self.end   else -1
            writer.writerow(['START', sr, sc, 'END', er, ec])
            for row in self.cells:
                writer.writerow(row)
        print(f"[GRID] Saved to {filepath}")

    # ── Load from CSV ─────────────────────────────────────────
    def load_from_csv(self, filepath):
        try:
            with open(filepath, 'r') as f:
                reader = csv.reader(f)
                rows   = list(reader)
                meta   = rows[0]
                sr, sc = int(meta[1]), int(meta[2])
                er, ec = int(meta[4]), int(meta[5])
                self.start = (sr, sc) if sr != -1 else None
                self.end   = (er, ec) if er != -1 else None
                self.cells = np.array(
                    [list(map(int, row)) for row in rows[1:]], dtype=int
                )
            print(f"[GRID] Loaded from {filepath}")
        except FileNotFoundError:
            print(f"[GRID] File not found: {filepath}")

    # ── Info ──────────────────────────────────────────────────
    def wall_count(self):
        return int(np.sum(self.cells == 1))

    def __repr__(self):
        return f"Grid({self.rows}x{self.cols}) start={self.start} end={self.end} walls={self.wall_count()}"