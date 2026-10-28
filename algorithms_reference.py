#!/usr/bin/env python3
"""
Cloud Server Task Scheduling: DAA Algorithmic Logic & Reference Implementations
================================================================================
Design and Analysis of Algorithms (DAA) Mini Project

Implements and benchmarks:
1. Greedy Density Ratio Scheduler (O(N log N))
2. 0/1 Multi-Dimensional Knapsack DP (O(N * C * M))
3. Earliest Deadline First (EDF) (O(N log N))
4. Dominant Resource Fairness (DRF) (O(N log N))
5. First-Come First-Served (FCFS) Baseline (O(N))

Run via: python3 algorithms_reference.py
"""

import time
from dataclasses import dataclass, field
from typing import List, Tuple, Dict, Optional

@dataclass
class Task:
    id: str
    name: str
    arrival: int
    cpu: float       # vCPU cores needed
    memory: float    # GB RAM needed
    duration: int    # ticks
    deadline: int    # hard deadline tick
    priority: float  # business value score
    remaining_time: int = 0
    status: str = "QUEUED"

    def __post_init__(self):
        if self.remaining_time == 0:
            self.remaining_time = self.duration

@dataclass
class ServerNode:
    total_cpu: float = 16.0
    total_memory: float = 64.0
    used_cpu: float = 0.0
    used_memory: float = 0.0

# ---------------------------------------------------------------------------
# 1. Greedy Density Ratio Scheduler - O(N log N)
# ---------------------------------------------------------------------------
def schedule_greedy_ratio(ready_queue: List[Task], node: ServerNode, current_tick: int) -> Tuple[List[Task], List[Task]]:
    """
    Greedy Knapsack Heuristic:
    Ranks tasks by Value-to-Cost density: Priority / ( (cpu/Total_CPU) + (mem/Total_MEM) )
    Time Complexity: O(N log N) for sorting.
    """
    free_cpu = node.total_cpu - node.used_cpu
    free_mem = node.total_memory - node.used_memory

    # Filter out tasks that cannot complete before deadline
    viable = [t for t in ready_queue if current_tick + t.duration <= t.deadline]

    def density(t: Task) -> float:
        norm_cost = 0.5 * (t.cpu / node.total_cpu) + 0.5 * (t.memory / node.total_memory)
        return t.priority / max(norm_cost, 0.001)

    sorted_tasks = sorted(viable, key=density, reverse=True)

    admitted: List[Task] = []
    admitted_ids = set()

    for t in sorted_tasks:
        if t.cpu <= free_cpu and t.memory <= free_mem:
            admitted.append(t)
            admitted_ids.add(t.id)
            free_cpu -= t.cpu
            free_mem -= t.memory

    remaining = [t for t in ready_queue if t.id not in admitted_ids]
    return admitted, remaining

# ---------------------------------------------------------------------------
# 2. 0/1 Multi-Dimensional Knapsack Dynamic Programming - O(N * C * M)
# ---------------------------------------------------------------------------
def schedule_knapsack_dp(ready_queue: List[Task], node: ServerNode, current_tick: int) -> Tuple[List[Task], List[Task], float]:
    """
    Dynamic Programming optimal batch allocation across 2 resource dimensions.
    Recurrence: DP[c][m] = max( DP[c][m], DP[c - c_i][m - m_i] + Priority_i )
    Time Complexity: O(N * C_avail * M_avail)
    Space Complexity: O(C_avail * M_avail)
    """
    free_cpu = int(node.total_cpu - node.used_cpu)
    free_mem = int(node.total_memory - node.used_memory)

    viable = [t for t in ready_queue if current_tick + t.duration <= t.deadline]
    n = len(viable)

    if n == 0 or free_cpu <= 0 or free_mem <= 0:
        return [], ready_queue, 0.0

    # 2D DP table: dp[c][m]
    dp = [[0.0 for _ in range(free_mem + 1)] for _ in range(free_cpu + 1)]
    # Backtrack tracking table
    selected = [[[False for _ in range(free_mem + 1)] for _ in range(free_cpu + 1)] for _ in range(n)]

    for i in range(n):
        t = viable[i]
        req_c = int(round(t.cpu))
        req_m = int(round(t.memory))
        val = t.priority

        for c in range(free_cpu, req_c - 1, -1):
            for m in range(free_mem, req_m - 1, -1):
                with_task = dp[c - req_c][m - req_m] + val
                if with_task > dp[c][m]:
                    dp[c][m] = with_task
                    selected[i][c][m] = True

    # Backtracking to reconstruct optimal subset
    c_curr, m_curr = free_cpu, free_mem
    admitted: List[Task] = []
    admitted_ids = set()

    for i in range(n - 1, -1, -1):
        if selected[i][c_curr][m_curr]:
            t = viable[i]
            admitted.append(t)
            admitted_ids.add(t.id)
            c_curr -= int(round(t.cpu))
            m_curr -= int(round(t.memory))

    remaining = [t for t in ready_queue if t.id not in admitted_ids]
    optimal_score = dp[free_cpu][free_mem]
    return admitted, remaining, optimal_score

# ---------------------------------------------------------------------------
# 3. Earliest Deadline First (EDF) - O(N log N)
# ---------------------------------------------------------------------------
def schedule_edf(ready_queue: List[Task], node: ServerNode, current_tick: int) -> Tuple[List[Task], List[Task]]:
    """
    Real-Time Greedy scheduling by closest deadline.
    Minimizes SLA violations.
    """
    free_cpu = node.total_cpu - node.used_cpu
    free_mem = node.total_memory - node.used_memory

    viable = [t for t in ready_queue if current_tick + t.duration <= t.deadline]
    sorted_tasks = sorted(viable, key=lambda t: t.deadline)

    admitted: List[Task] = []
    admitted_ids = set()

    for t in sorted_tasks:
        if t.cpu <= free_cpu and t.memory <= free_mem:
            admitted.append(t)
            admitted_ids.add(t.id)
            free_cpu -= t.cpu
            free_mem -= t.memory

    remaining = [t for t in ready_queue if t.id not in admitted_ids]
    return admitted, remaining

# ---------------------------------------------------------------------------
# 4. First-Come First-Served (FCFS) Baseline - O(N)
# ---------------------------------------------------------------------------
def schedule_fcfs(ready_queue: List[Task], node: ServerNode, current_tick: int) -> Tuple[List[Task], List[Task]]:
    """
    Baseline FIFO allocation based purely on arrival time.
    """
    free_cpu = node.total_cpu - node.used_cpu
    free_mem = node.total_memory - node.used_memory

    viable = [t for t in ready_queue if current_tick + t.duration <= t.deadline]
    sorted_tasks = sorted(viable, key=lambda t: t.arrival)

    admitted: List[Task] = []
    admitted_ids = set()

    for t in sorted_tasks:
        if t.cpu <= free_cpu and t.memory <= free_mem:
            admitted.append(t)
            admitted_ids.add(t.id)
            free_cpu -= t.cpu
            free_mem -= t.memory

    remaining = [t for t in ready_queue if t.id not in admitted_ids]
    return admitted, remaining

# ---------------------------------------------------------------------------
# Standalone Benchmark Test
# ---------------------------------------------------------------------------
def run_benchmark():
    print("=" * 72)
    print("   CLOUD TASK SCHEDULER: DAA ALGORITHM BENCHMARK EXECUTION")
    print("=" * 72)

    node = ServerNode(total_cpu=16.0, total_memory=64.0)

    test_tasks = [
        Task("T-101", "Auth API", arrival=0, cpu=2, memory=4, duration=6, deadline=15, priority=40),
        Task("T-102", "Transcode Job", arrival=0, cpu=8, memory=24, duration=8, deadline=18, priority=90),
        Task("T-103", "Cache Sync", arrival=0, cpu=2, memory=8, duration=4, deadline=8, priority=55),
        Task("T-104", "DB Indexing", arrival=0, cpu=6, memory=16, duration=10, deadline=25, priority=75),
        Task("T-105", "Payment Hook", arrival=0, cpu=2, memory=4, duration=3, deadline=7, priority=95),
        Task("T-106", "ML Inference", arrival=0, cpu=10, memory=32, duration=6, deadline=22, priority=110),
    ]

    total_demand_cpu = sum(t.cpu for t in test_tasks)
    total_demand_mem = sum(t.memory for t in test_tasks)
    total_potential_priority = sum(t.priority for t in test_tasks)

    print(f"Node Capacity  : {node.total_cpu} vCPUs, {node.total_memory} GB RAM")
    print(f"Total Demand   : {total_demand_cpu} vCPUs, {total_demand_mem} GB RAM (Oversubscribed)")
    print(f"Candidate Tasks: {len(test_tasks)} tasks | Potential Priority: {total_potential_priority}\n")

    algorithms = [
        ("0/1 Knapsack DP", lambda q: schedule_knapsack_dp(q, node, 0)[:2]),
        ("Greedy Ratio", lambda q: schedule_greedy_ratio(q, node, 0)),
        ("Earliest Deadline First", lambda q: schedule_edf(q, node, 0)),
        ("First-Come First-Served", lambda q: schedule_fcfs(q, node, 0)),
    ]

    print(f"{'Algorithm':<26} | {'Admitted':<10} | {'Harvested Pts':<14} | {'CPU Used':<10} | {'RAM Used':<10}")
    print("-" * 78)

    for name, sched_func in algorithms:
        start_t = time.perf_counter()
        admitted, remaining = sched_func(test_tasks)
        elapsed_us = (time.perf_counter() - start_t) * 1_000_000

        harvested = sum(t.priority for t in admitted)
        used_c = sum(t.cpu for t in admitted)
        used_m = sum(t.memory for t in admitted)

        task_ids = ",".join(t.id for t in admitted)
        print(f"{name:<26} | {len(admitted):<10} | {harvested:<14} | {used_c:<10} | {used_m:<10}")

    print("=" * 78)
    print("Benchmark complete. Optimal combination found by Dynamic Programming.")

if __name__ == "__main__":
    run_benchmark()
