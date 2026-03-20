# ─────────────────────────────────────────────────────────────
#  config.py  —  All constants, colors, settings
# ─────────────────────────────────────────────────────────────

# Window
WIDTH        = 1400
HEIGHT       = 750
FPS          = 60
TITLE        = "PATHFINDER  //  Dijkstra vs A* vs BFS"

# Grid
GRID_ROWS    = 28
GRID_COLS    = 28
CELL_SIZE    = 22
GRID_OFFSET_X = 20
GRID_OFFSET_Y = 70

# Animation speed (lower = faster)
ANIM_DELAY   = 10   # ms between each visited node drawn

# Colors
BLACK        = (0,   0,   0  )
WHITE        = (255, 255, 255)
DARK_BG      = (8,   8,   18 )
DARK_PANEL   = (12,  12,  24 )
GRID_LINE    = (25,  25,  45 )
WALL_COLOR   = (35,  35,  55 )

NEON_BLUE    = (0,   210, 255)
NEON_GREEN   = (0,   255, 140)
NEON_RED     = (255, 50,  70 )
NEON_YELLOW  = (255, 220, 0  )
NEON_ORANGE  = (255, 140, 0  )
PURPLE       = (140, 0,   255)
PINK         = (255, 0,   180)

# Cell state colors
COLOR_EMPTY      = GRID_LINE
COLOR_WALL       = WALL_COLOR
COLOR_START      = NEON_GREEN
COLOR_END        = NEON_RED
COLOR_VISITED_D  = (0,   80,  160)   # Dijkstra visited
COLOR_VISITED_A  = (120, 0,   100)   # A* visited
COLOR_VISITED_B  = (0,   100, 60 )   # BFS visited
COLOR_PATH_D     = NEON_BLUE         # Dijkstra path
COLOR_PATH_A     = NEON_YELLOW       # A* path
COLOR_PATH_B     = NEON_GREEN        # BFS path

# Fonts
FONT_TITLE   = 24
FONT_LABEL   = 15
FONT_SMALL   = 12

# Files
MAP1_PATH    = "data/maps/map1.csv"
MAP2_PATH    = "data/maps/map2.csv"
CITY_PATH    = "data/maps/city_map.csv"
LOG_PATH     = "data/results/results_log.txt"

# ── Terrain Types ─────────────────────────────────────────────
TERRAIN_ROAD  = 0   # cost 1
TERRAIN_SAND  = 2   # cost 3
TERRAIN_MUD   = 3   # cost 4
TERRAIN_WATER = 4   # cost 5
TERRAIN_WALL  = 1   # blocked

TERRAIN_COST = {
    0: 1,   # road
    2: 3,   # sand
    3: 4,   # mud
    4: 5,   # water
}

TERRAIN_COLOR_MAP = {
    0: (15,  15,  25 ),   # road  — dark
    2: (180, 140, 20 ),   # sand  — yellow
    3: (80,  50,  20 ),   # mud   — brown
    4: (20,  60,  180),   # water — blue
}