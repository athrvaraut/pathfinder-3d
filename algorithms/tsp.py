# ─────────────────────────────────────────────────────────────
#  algorithms/tsp.py  —  Travelling Salesman Problem
#  3 approaches: Brute Force, Greedy, Dynamic Programming
# ─────────────────────────────────────────────────────────────

import itertools
import time

def euclidean(a, b):
    return ((a[0]-b[0])**2 + (a[1]-b[1])**2) ** 0.5

# ── Brute Force (exact, only for n<=10) ──────────────────────
def tsp_brute(points):
    t0   = time.perf_counter()
    n    = len(points)
    best = float('inf')
    best_path = []

    for perm in itertools.permutations(range(1, n)):
        path = [0] + list(perm) + [0]
        dist = sum(euclidean(points[path[i]], points[path[i+1]])
                   for i in range(len(path)-1))
        if dist < best:
            best      = dist
            best_path = path

    return {
        "path"     : best_path,
        "distance" : round(best, 2),
        "time_ms"  : round((time.perf_counter()-t0)*1000, 4),
        "method"   : "Brute Force",
        "optimal"  : True
    }

# ── Greedy Nearest Neighbor ───────────────────────────────────
def tsp_greedy(points):
    t0      = time.perf_counter()
    n       = len(points)
    visited = [False] * n
    path    = [0]
    visited[0] = True

    for _ in range(n-1):
        curr = path[-1]
        best_next = -1
        best_dist = float('inf')
        for j in range(n):
            if not visited[j]:
                d = euclidean(points[curr], points[j])
                if d < best_dist:
                    best_dist = d
                    best_next = j
        path.append(best_next)
        visited[best_next] = True

    path.append(0)  # return to start
    dist = sum(euclidean(points[path[i]], points[path[i+1]])
               for i in range(len(path)-1))

    return {
        "path"     : path,
        "distance" : round(dist, 2),
        "time_ms"  : round((time.perf_counter()-t0)*1000, 4),
        "method"   : "Greedy Nearest Neighbor",
        "optimal"  : False
    }

# ── Dynamic Programming (Held-Karp, exact up to n=15) ────────
def tsp_dp(points):
    t0 = time.perf_counter()
    n  = len(points)

    # Distance matrix
    d = [[euclidean(points[i], points[j]) for j in range(n)]
         for i in range(n)]

    # dp[mask][i] = min cost to visit all in mask ending at i
    INF = float('inf')
    dp   = [[INF]*n for _ in range(1<<n)]
    par  = [[-1]*n  for _ in range(1<<n)]
    dp[1][0] = 0

    for mask in range(1, 1<<n):
        for u in range(n):
            if not (mask >> u & 1): continue
            if dp[mask][u] == INF:  continue
            for v in range(n):
                if mask >> v & 1:   continue
                new_mask = mask | (1<<v)
                new_cost = dp[mask][u] + d[u][v]
                if new_cost < dp[new_mask][v]:
                    dp[new_mask][v]  = new_cost
                    par[new_mask][v] = u

    # Find best ending node
    full  = (1<<n) - 1
    last  = min(range(n), key=lambda u: dp[full][u] + d[u][0])
    dist  = dp[full][last] + d[last][0]

    # Reconstruct path
    path  = []
    mask  = full
    curr  = last
    while curr != -1:
        path.append(curr)
        prev = par[mask][curr]
        mask = mask ^ (1<<curr)
        curr = prev
    path.reverse()
    path.append(0)

    return {
        "path"     : path,
        "distance" : round(dist, 2),
        "time_ms"  : round((time.perf_counter()-t0)*1000, 4),
        "method"   : "Dynamic Programming (Held-Karp)",
        "optimal"  : True
    }