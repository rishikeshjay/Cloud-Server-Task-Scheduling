[Uploading README.md…]()
# Cloud Server Task Scheduling: DAA Mini Project

An interactive Single Page Application (SPA) and simulation engine modeling real-time **Cloud Server Task Scheduling** using core concepts from **Design and Analysis of Algorithms (DAA)**.

---

## 📌 Project Overview
In modern cloud infrastructures (e.g., Kubernetes, AWS EC2, Google Cloud Run), physical server nodes have finite computing boundaries (vCPUs and RAM). Multiple incoming workloads compete for compute time slices with varying deadlines and business priority values.

This project models task allocation as a **Multi-Dimensional Knapsack Problem (MDKP)** with real-time deadline constraints, comparing theoretical optimization strategies against practical cloud heuristics.

---

## ⚡ Quick Start

### 1. Launch the React + Tailwind SPA
```bash
cd /Users/rishikeshjay/.gemini/antigravity/scratch/mini_project_DAA

# Start the interactive Vite development server
npm run dev
```
Open your browser at `http://localhost:5173` to explore the live simulation dashboard.

To preview the production build:
```bash
npm run preview
```

### 2. Run the Python Algorithmic Reference
If your evaluator or professor requests a Python terminal demonstration:
```bash
python3 algorithms_reference.py
```

---

## 🔬 Algorithmic Comparison Matrix (DAA)

| Algorithm | Paradigm | Time Complexity | Space Complexity | Optimality |
| :--- | :--- | :--- | :--- | :--- |
| **0/1 Knapsack DP** | Dynamic Programming | $\mathcal{O}(N \cdot C \cdot M)$ | $\mathcal{O}(C \cdot M)$ | **Exact Optimal** |
| **Greedy Density Ratio** | Greedy Heuristic | $\mathcal{O}(N \log N)$ | $\mathcal{O}(1)$ | Approximation |
| **Earliest Deadline First (EDF)** | Real-Time Greedy | $\mathcal{O}(N \log N)$ | $\mathcal{O}(1)$ | Minimizes SLA Drops |
| **Dominant Resource Fairness (DRF)** | Fair-Share Heuristic | $\mathcal{O}(N \log N)$ | $\mathcal{O}(1)$ | Prevents Bottlenecks |
| **Priority Preemptive** | Priority Queue with Eviction | $\mathcal{O}(N \log N)$ | $\mathcal{O}(N)$ | Critical Task Guarantee |
| **FCFS (Baseline)** | FIFO Queue | $\mathcal{O}(N)$ | $\mathcal{O}(1)$ | Baseline Benchmark |

---

## 🎯 Key Dashboard Features

1. **Hardware Node Saturation Gauges**: Real-time dials and animated progress bars tracking instantaneous vCPU and RAM allocation.
2. **Interactive Execution Gantt Chart**: Timeline visualizing task progress, remaining ticks, resource allocations, and deadline thresholds.
3. **Dynamic 0/1 Knapsack DP Table Visualizer**: Live inspection of bottom-up recurrence matrix $dp[c][m]$ with memoized state transitions.
4. **Side-by-Side Benchmark Engine**: One-click execution comparing all algorithms across identical workload traces.
5. **Interactive Task Injector**: Add custom tasks with tailored compute footprints, deadlines, and priorities during live evaluation.
6. **DAA Viva Cheatsheet**: In-app modal with theoretical proofs, recurrence relations, and answers to common examiner questions.

---

## 📂 Project Directory Structure

```
mini_project_DAA/
├── index.html                   # HTML5 shell with dark-mode cloud console styling
├── package.json                 # Dependencies (React 18, Tailwind CSS, Lucide Icons, Vite)
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── algorithms_reference.py      # Standalone Python CLI benchmark implementation
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main simulation coordinator & state management
│   ├── index.css                # Custom scrollbars, glow effects & Tailwind directives
│   ├── algorithms/
│   │   └── schedulerEngine.js   # Pure JS implementation of all 6 DAA schedulers & step simulator
│   ├── data/
│   │   └── defaultWorkloads.js  # Preset testbeds (Standard, Knapsack Edge Case, EDF Challenge, Burst)
│   └── components/
│       ├── Header.jsx           # Controls (Play/Pause, Step, Speed, Reset, Algorithm/Workload select)
│       ├── NodeOverview.jsx     # CPU cores, RAM GB, and harvested priority metrics
│       ├── GanttTimeline.jsx    # Real-time task execution timeline
│       ├── TaskQueue.jsx        # Ready waiting queue, completed tasks, and SLA drops
│       ├── AlgorithmComparison.jsx # Benchmark comparison matrix modal
│       ├── KnapsackVisualizerModal.jsx # Interactive 2D DP matrix table modal
│       ├── TaskInjectModal.jsx  # Custom task creation modal
│       └── ComplexityCard.jsx   # Viva theoretical defense cheatsheet
└── dist/                        # Production build output
```
