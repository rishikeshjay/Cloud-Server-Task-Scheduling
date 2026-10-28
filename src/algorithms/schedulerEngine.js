/**
 * Cloud Server Task Scheduling Algorithms - DAA Simulation Core
 *
 * Implements:
 * 1. Greedy Density Ratio (Greedy Knapsack Heuristic) - O(N log N)
 * 2. 0/1 Multi-Dimensional Knapsack DP (Dynamic Programming) - O(N * C * M)
 * 3. Earliest Deadline First (EDF) (Priority Queue / Greedy) - O(N log N)
 * 4. Dominant Resource Fairness (DRF) - O(N log N)
 * 5. Priority Preemptive Scheduler - O(N log N)
 * 6. First-Come First-Served (FCFS) (Baseline FIFO) - O(N)
 */

export const ALGORITHMS = {
  GREEDY_RATIO: {
    id: "GREEDY_RATIO",
    name: "Greedy Density Ratio",
    paradigm: "Greedy Heuristic",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(1)",
    description: "Sorts candidate tasks by Priority per Normalized Resource unit. Fast, practical heuristic for high throughput.",
    color: "emerald"
  },
  KNAPSACK_DP: {
    id: "KNAPSACK_DP",
    name: "0/1 Knapsack DP",
    paradigm: "Dynamic Programming",
    timeComplexity: "O(N · C · M)",
    spaceComplexity: "O(C · M)",
    description: "Solves multi-dimensional knapsack via dynamic programming recurrence to find mathematically optimal batch allocation.",
    color: "indigo"
  },
  EDF: {
    id: "EDF",
    name: "Earliest Deadline First",
    paradigm: "Real-Time Greedy",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(1)",
    description: "Prioritizes tasks with earliest deadlines to minimize SLA violations and drop rate.",
    color: "amber"
  },
  DRF: {
    id: "DRF",
    name: "Dominant Resource Fairness",
    paradigm: "Fair Share Heuristic",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(1)",
    description: "Allocates tasks based on dominant resource share max(CPU%, RAM%) to prevent single-resource bottlenecking.",
    color: "cyan"
  },
  PREEMPTIVE: {
    id: "PREEMPTIVE",
    name: "Priority Preemptive",
    paradigm: "Priority Queue with Eviction",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    description: "Allows urgent high-priority tasks to preempt currently running lower-priority tasks.",
    color: "purple"
  },
  FCFS: {
    id: "FCFS",
    name: "First-Come First-Served",
    paradigm: "FIFO Baseline",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    description: "Strict arrival order allocation. Serves as baseline to quantify algorithmic improvement.",
    color: "slate"
  }
};

/**
 * Filter tasks that can still complete before their deadline
 */
export function filterViableTasks(tasks, currentTick) {
  return tasks.filter(t => currentTick + t.duration <= t.deadline);
}

/**
 * 1. Greedy Density Ratio Scheduler
 * Density = Priority / ( (cpu / totalCpu) + (memory / totalMemory) )
 */
export function scheduleGreedyRatio(readyQueue, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);

  const scored = viable.map(task => {
    const normCpu = task.cpu / nodeConfig.totalCpu;
    const normMem = task.memory / nodeConfig.totalMemory;
    const cost = Math.max(0.5 * normCpu + 0.5 * normMem, 0.001);
    const density = task.priority / cost;
    return { task, density };
  });

  scored.sort((a, b) => b.density - a.density);

  let curCpu = availableCpu;
  let curMem = availableMem;
  const admitted = [];
  const admittedIds = new Set();

  for (const { task } of scored) {
    if (task.cpu <= curCpu && task.memory <= curMem) {
      admitted.push(task);
      admittedIds.add(task.id);
      curCpu -= task.cpu;
      curMem -= task.memory;
    }
  }

  const remaining = readyQueue.filter(t => !admittedIds.has(t.id));
  return { admitted, remaining, curCpu, curMem };
}

/**
 * 2. 0/1 Multi-Dimensional Knapsack DP
 * Generates both optimal subset and inspection DP table for academic viva.
 */
export function scheduleKnapsackDP(readyQueue, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);
  if (viable.length === 0 || availableCpu <= 0 || availableMem <= 0) {
    return { admitted: [], remaining: readyQueue, dpTable: null, curCpu: availableCpu, curMem: availableMem };
  }

  // Quantize capacities to integer grid to keep DP table fast and renderable
  // Scale memory: 1 unit = 2 GB (e.g. 64 GB => 32 units)
  const maxC = Math.floor(availableCpu);
  const memScale = Math.max(1, Math.floor(nodeConfig.totalMemory / 32)); // 2GB per unit
  const maxM = Math.floor(availableMem / memScale);

  const n = viable.length;

  // dp[i][c][m] = max priority using subset of first i tasks with capacity c, m
  // We optimize space to 2D array: dp[c][m] with backtrack pointers
  const dp = Array.from({ length: maxC + 1 }, () => Array(maxM + 1).fill(0));
  // Keep track of decisions: selected[i][c][m] = boolean
  const selected = Array.from({ length: n }, () =>
    Array.from({ length: maxC + 1 }, () => Array(maxM + 1).fill(false))
  );

  for (let i = 0; i < n; i++) {
    const t = viable[i];
    const reqC = Math.ceil(t.cpu);
    const reqM = Math.ceil(t.memory / memScale);
    const val = t.priority;

    for (let c = maxC; c >= reqC; c--) {
      for (let m = maxM; m >= reqM; m--) {
        const withTask = dp[c - reqC][m - reqM] + val;
        if (withTask > dp[c][m]) {
          dp[c][m] = withTask;
          selected[i][c][m] = true;
        }
      }
    }
  }

  // Backtrack to find selected tasks
  let traceC = maxC;
  let traceM = maxM;
  const admitted = [];
  const admittedIds = new Set();

  for (let i = n - 1; i >= 0; i--) {
    if (selected[i][traceC][traceM]) {
      const t = viable[i];
      admitted.push(t);
      admittedIds.add(t.id);
      traceC -= Math.ceil(t.cpu);
      traceM -= Math.ceil(t.memory / memScale);
    }
  }

  let finalCpu = availableCpu;
  let finalMem = availableMem;
  admitted.forEach(t => {
    finalCpu -= t.cpu;
    finalMem -= t.memory;
  });

  const remaining = readyQueue.filter(t => !admittedIds.has(t.id));

  // Build simplified 1D combined DP table snapshot for UI visualization
  const dpSnapshot = [];
  for (let c = 0; c <= Math.min(maxC, 8); c++) {
    const row = { cpuSlot: c };
    for (let m = 0; m <= Math.min(maxM, 8); m++) {
      row[`mem_${m * memScale}GB`] = dp[c][m];
    }
    dpSnapshot.push(row);
  }

  return {
    admitted,
    remaining,
    curCpu: finalCpu,
    curMem: finalMem,
    optimalScore: dp[maxC][maxM],
    dpTable: dpSnapshot
  };
}

/**
 * 3. Earliest Deadline First (EDF) Scheduler
 */
export function scheduleEDF(readyQueue, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);

  // Sort by deadline ascending
  const sorted = [...viable].sort((a, b) => a.deadline - b.deadline);

  let curCpu = availableCpu;
  let curMem = availableMem;
  const admitted = [];
  const admittedIds = new Set();

  for (const task of sorted) {
    if (task.cpu <= curCpu && task.memory <= curMem) {
      admitted.push(task);
      admittedIds.add(task.id);
      curCpu -= task.cpu;
      curMem -= task.memory;
    }
  }

  const remaining = readyQueue.filter(t => !admittedIds.has(t.id));
  return { admitted, remaining, curCpu, curMem };
}

/**
 * 4. Dominant Resource Fairness (DRF) Scheduler
 */
export function scheduleDRF(readyQueue, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);

  // Compute dominant share: max(cpu / totalCpu, mem / totalMem)
  // Low dominant share gets prioritized (they demand less of the bottleneck resource)
  const sorted = [...viable].sort((a, b) => {
    const domA = Math.max(a.cpu / nodeConfig.totalCpu, a.memory / nodeConfig.totalMemory);
    const domB = Math.max(b.cpu / nodeConfig.totalCpu, b.memory / nodeConfig.totalMemory);
    // Weighted by priority
    return (domA / a.priority) - (domB / b.priority);
  });

  let curCpu = availableCpu;
  let curMem = availableMem;
  const admitted = [];
  const admittedIds = new Set();

  for (const task of sorted) {
    if (task.cpu <= curCpu && task.memory <= curMem) {
      admitted.push(task);
      admittedIds.add(task.id);
      curCpu -= task.cpu;
      curMem -= task.memory;
    }
  }

  const remaining = readyQueue.filter(t => !admittedIds.has(t.id));
  return { admitted, remaining, curCpu, curMem };
}

/**
 * 5. Priority Preemptive Scheduler
 */
export function schedulePreemptive(readyQueue, runningTasks, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);
  const sortedQueue = [...viable].sort((a, b) => b.priority - a.priority);

  let curCpu = availableCpu;
  let curMem = availableMem;
  const admitted = [];
  const admittedIds = new Set();
  const preempted = [];
  let currentRunning = [...runningTasks];

  // Try normal admission first
  for (const task of sortedQueue) {
    if (task.cpu <= curCpu && task.memory <= curMem) {
      admitted.push(task);
      admittedIds.add(task.id);
      curCpu -= task.cpu;
      curMem -= task.memory;
    } else {
      // Evaluate preemption: find lowest priority running tasks that could be evicted
      currentRunning.sort((a, b) => a.priority - b.priority);
      let freedCpu = 0;
      let freedMem = 0;
      let evictCandidates = [];

      for (const runTask of currentRunning) {
        if (runTask.priority < task.priority) {
          freedCpu += runTask.cpu;
          freedMem += runTask.memory;
          evictCandidates.push(runTask);

          if (curCpu + freedCpu >= task.cpu && curMem + freedMem >= task.memory) {
            // Net priority gain check
            const evictValue = evictCandidates.reduce((s, x) => s + x.priority, 0);
            if (task.priority > evictValue * 1.1) { // 10% hysteresis
              // Execute preemption
              evictCandidates.forEach(ev => {
                preempted.push(ev);
                currentRunning = currentRunning.filter(r => r.id !== ev.id);
                curCpu += ev.cpu;
                curMem += ev.memory;
              });

              admitted.push(task);
              admittedIds.add(task.id);
              curCpu -= task.cpu;
              curMem -= task.memory;
              break;
            }
          }
        }
      }
    }
  }

  // Preempted tasks go back to ready queue
  const remaining = [
    ...readyQueue.filter(t => !admittedIds.has(t.id)),
    ...preempted.map(t => ({ ...t, preemptedCount: (t.preemptedCount || 0) + 1 }))
  ];

  return { admitted, remaining, currentRunning, curCpu, curMem };
}

/**
 * 6. First-Come First-Served (FCFS) Scheduler
 */
export function scheduleFCFS(readyQueue, availableCpu, availableMem, nodeConfig, currentTick) {
  const viable = filterViableTasks(readyQueue, currentTick);
  // Sort strictly by arrival time
  const sorted = [...viable].sort((a, b) => a.arrival - b.arrival);

  let curCpu = availableCpu;
  let curMem = availableMem;
  const admitted = [];
  const admittedIds = new Set();

  for (const task of sorted) {
    if (task.cpu <= curCpu && task.memory <= curMem) {
      admitted.push(task);
      admittedIds.add(task.id);
      curCpu -= task.cpu;
      curMem -= task.memory;
    }
  }

  const remaining = readyQueue.filter(t => !admittedIds.has(t.id));
  return { admitted, remaining, curCpu, curMem };
}

/**
 * Dispatcher to select and run the active algorithm
 */
export function runAlgorithm(algoId, readyQueue, runningTasks, node, currentTick) {
  const availableCpu = node.totalCpu - node.usedCpu;
  const availableMem = node.totalMemory - node.usedMemory;

  switch (algoId) {
    case "KNAPSACK_DP":
      return scheduleKnapsackDP(readyQueue, availableCpu, availableMem, node, currentTick);
    case "EDF":
      return scheduleEDF(readyQueue, availableCpu, availableMem, node, currentTick);
    case "DRF":
      return scheduleDRF(readyQueue, availableCpu, availableMem, node, currentTick);
    case "PREEMPTIVE":
      return schedulePreemptive(readyQueue, runningTasks, availableCpu, availableMem, node, currentTick);
    case "FCFS":
      return scheduleFCFS(readyQueue, availableCpu, availableMem, node, currentTick);
    case "GREEDY_RATIO":
    default:
      return scheduleGreedyRatio(readyQueue, availableCpu, availableMem, node, currentTick);
  }
}

/**
 * Core Step Simulator
 * Advances the simulation clock by 1 tick
 */
export function simulateTick(state) {
  const {
    currentTick,
    algorithm,
    node,
    allTasks,
    readyQueue,
    runningTasks,
    completedTasks,
    droppedTasks,
    history
  } = state;

  const nextTick = currentTick + 1;

  // 1. Progress running tasks and identify completed
  const newlyCompleted = [];
  const stillRunning = [];

  let freeCpu = node.totalCpu;
  let freeMem = node.totalMemory;

  for (const task of runningTasks) {
    const remainingTime = (task.remainingTime !== undefined ? task.remainingTime : task.duration) - 1;
    if (remainingTime <= 0) {
      newlyCompleted.push({
        ...task,
        remainingTime: 0,
        completionTick: nextTick,
        status: "COMPLETED"
      });
    } else {
      stillRunning.push({
        ...task,
        remainingTime
      });
      freeCpu -= task.cpu;
      freeMem -= task.memory;
    }
  }

  // 2. Ingest newly arrived tasks into ready queue
  const newArrivals = allTasks
    .filter(t => t.arrival === nextTick && !runningTasks.some(r => r.id === t.id) && !completedTasks.some(c => c.id === t.id))
    .map(t => ({ ...t, remainingTime: t.duration, status: "QUEUED" }));

  let updatedQueue = [...readyQueue, ...newArrivals];

  // 3. Drop tasks in queue that can no longer complete before deadline
  const newlyDropped = [];
  const viableQueue = [];

  for (const t of updatedQueue) {
    if (nextTick + t.duration > t.deadline) {
      newlyDropped.push({
        ...t,
        dropTick: nextTick,
        status: "DROPPED"
      });
    } else {
      viableQueue.push(t);
    }
  }

  // 4. Run Scheduler algorithm on viableQueue with available node compute
  const tempNode = { ...node, usedCpu: node.totalCpu - freeCpu, usedMemory: node.totalMemory - freeMem };
  const scheduleResult = runAlgorithm(algorithm, viableQueue, stillRunning, tempNode, nextTick);

  const newlyAdmitted = (scheduleResult.admitted || []).map(t => ({
    ...t,
    startTick: nextTick,
    remainingTime: t.duration,
    status: "RUNNING"
  }));

  const finalRunning = [...stillRunning, ...newlyAdmitted];
  const finalQueue = scheduleResult.remaining || [];

  const finalUsedCpu = finalRunning.reduce((sum, t) => sum + t.cpu, 0);
  const finalUsedMem = finalRunning.reduce((sum, t) => sum + t.memory, 0);

  const allCompleted = [...completedTasks, ...newlyCompleted];
  const allDropped = [...droppedTasks, ...newlyDropped];

  const totalPriorityHarvested = allCompleted.reduce((sum, t) => sum + t.priority, 0);

  const snapshot = {
    tick: nextTick,
    cpuUsed: finalUsedCpu,
    memUsed: finalUsedMem,
    cpuPct: Math.round((finalUsedCpu / node.totalCpu) * 100),
    memPct: Math.round((finalUsedMem / node.totalMemory) * 100),
    runningCount: finalRunning.length,
    queuedCount: finalQueue.length,
    completedCount: allCompleted.length,
    droppedCount: allDropped.length,
    priority: totalPriorityHarvested
  };

  return {
    ...state,
    currentTick: nextTick,
    node: {
      ...node,
      usedCpu: finalUsedCpu,
      usedMemory: finalUsedMem
    },
    readyQueue: finalQueue,
    runningTasks: finalRunning,
    completedTasks: allCompleted,
    droppedTasks: allDropped,
    totalPriority: totalPriorityHarvested,
    history: [...history, snapshot],
    lastDpTable: scheduleResult.dpTable || state.lastDpTable
  };
}

/**
 * Run Side-by-Side Comparative Benchmark
 * Runs the exact same workload across all algorithms and returns comparative metrics
 */
export function runComparativeBenchmark(tasks, nodeConfig, maxTicks = 40) {
  const algoKeys = Object.keys(ALGORITHMS);
  const results = {};

  for (const algoKey of algoKeys) {
    const startTime = performance.now();

    let simState = {
      currentTick: -1,
      algorithm: algoKey,
      node: { totalCpu: nodeConfig.totalCpu, totalMemory: nodeConfig.totalMemory, usedCpu: 0, usedMemory: 0 },
      allTasks: JSON.parse(JSON.stringify(tasks)),
      readyQueue: [],
      runningTasks: [],
      completedTasks: [],
      droppedTasks: [],
      totalPriority: 0,
      history: []
    };

    // Step through ticks until completion or maxTicks
    for (let t = 0; t <= maxTicks; t++) {
      simState = simulateTick(simState);
      const totalProcessed = simState.completedTasks.length + simState.droppedTasks.length;
      if (totalProcessed === tasks.length && simState.runningTasks.length === 0) {
        break;
      }
    }

    const endTime = performance.now();
    const runtimeMs = (endTime - startTime).toFixed(3);

    const avgCpuPct = simState.history.length > 0
      ? Math.round(simState.history.reduce((s, h) => s + h.cpuPct, 0) / simState.history.length)
      : 0;
    const avgMemPct = simState.history.length > 0
      ? Math.round(simState.history.reduce((s, h) => s + h.memPct, 0) / simState.history.length)
      : 0;

    const totalPotentialPriority = tasks.reduce((s, t) => s + t.priority, 0);
    const slaSuccessPct = tasks.length > 0
      ? Math.round((simState.completedTasks.length / tasks.length) * 100)
      : 0;
    const priorityHarvestPct = totalPotentialPriority > 0
      ? Math.round((simState.totalPriority / totalPotentialPriority) * 100)
      : 0;

    results[algoKey] = {
      ...ALGORITHMS[algoKey],
      completedCount: simState.completedTasks.length,
      droppedCount: simState.droppedTasks.length,
      totalPriority: simState.totalPriority,
      priorityHarvestPct,
      slaSuccessPct,
      avgCpuPct,
      avgMemPct,
      executionTimeMs: runtimeMs,
      history: simState.history
    };
  }

  return results;
}
