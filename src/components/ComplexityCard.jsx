import React from "react";
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  Play, 
  SkipForward, 
  Cpu, 
  HardDrive, 
  Layers, 
  BarChart3, 
  Table as TableIcon, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Compass,
  ArrowRight
} from "lucide-react";

export default function ComplexityCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                User Guide & Simulation Walkthrough
              </h2>
              <p className="text-xs text-slate-400">
                A first-time user guide explaining how the simulation works, what each panel shows, and how to interact with features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Section 1: What is this simulation & how it works */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>1. What This Simulation Does & How It Works</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              This application models a <strong className="text-white">Cloud Server Node</strong> operating under finite hardware constraints (<strong className="text-cyan-300">16 vCPU Cores</strong> and <strong className="text-emerald-300">64 GB RAM</strong>). 
              A continuous stream of incoming jobs (tasks) arrives over virtual time slices (clock ticks). Each task demands a slice of CPU, Memory, execution duration, has a strict completion deadline, and yields a priority value score.
            </p>
            <p className="leading-relaxed text-slate-300">
              <strong className="text-amber-300">The Core Goal:</strong> Maximize the cumulative priority value of successfully completed tasks without exceeding server hardware boundaries or letting tasks expire past their SLA deadlines.
            </p>
          </div>

          {/* Section 2: What You Are Seeing on the Screen */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>2. Visual Dashboard Breakdown (What You See)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Card A */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Node Hardware Gauges (Top Row)
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Real-time bars indicating current vCPU cores and RAM utilization. Colors shift from green to amber to red as server load approaches 100% capacity.
                </p>
              </div>

              {/* Card B */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Priority Tracker & Virtual Clock
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Tracks total business priority points harvested from completed jobs, current clock tick (T0, T1, ...), and active SLA compliance rate.
                </p>
              </div>

              {/* Card C */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Execution Timeline (Gantt Chart)
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Displays active jobs running on the node over time. Horizontal progress bars illustrate duration, remaining ticks, resource allocations, and deadline thresholds.
                </p>
              </div>

              {/* Card D */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Task Admission Queues (Bottom)
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Organized into three views: <strong>Ready Queue</strong> (waiting to be scheduled), <strong>Completed</strong> (successfully executed), and <strong>Dropped</strong> (expired deadlines).
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Step-by-Step User Journey */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>3. Step-by-Step Guide: How to Interact & Use Features</span>
            </div>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Choose a Workload Scenario</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Use the first dropdown in the header to select a testbed. Options include <em>Standard Balanced</em>, <em>Knapsack DP vs Greedy Edge Case</em>, <em>Deadline Critical</em>, or <em>Burst Traffic Spike</em>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Select a Scheduling Algorithm</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Pick which algorithm controls the server:
                    <strong> 0/1 Knapsack DP</strong> (exact optimal batching),
                    <strong> Greedy Density Ratio</strong> (fast value-to-cost heuristic),
                    <strong> Earliest Deadline First (EDF)</strong> (minimizes SLA drops),
                    <strong> Dominant Resource Fairness (DRF)</strong> (multi-resource balance),
                    <strong> Preemptive</strong> (evicts low-priority tasks), or
                    <strong> FCFS</strong> (pure arrival order).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Run or Step Through the Simulation</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Click <strong>Play (▶)</strong> to watch automatic continuous execution, or click <strong>Step (⏭)</strong> to advance exactly 1 clock tick at a time. Toggle <strong>1x / 2x / 5x</strong> to adjust speed, and click <strong>Reset (↺)</strong> to start over.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Inject Custom Ad-Hoc Tasks</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Click <strong>"Inject Task"</strong> to open a modal where you can define a custom task's CPU, RAM, duration, deadline, and priority. The task is immediately ingested into the ready queue to test admission logic.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Inspect the 0/1 Knapsack DP Table</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    When using <strong>0/1 Knapsack DP</strong>, click the <strong>"DP Table"</strong> button in the header. An interactive 2D table opens showing the exact state transition memoization matrix computed for CPU and RAM slots.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  6
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Run Side-by-Side Algorithm Benchmark</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Click <strong>"Benchmark"</strong> to simulate the exact same task workload simultaneously across all algorithms. A side-by-side scorecard reveals which algorithm won the most priority points, kept the lowest drop rate, and ran fastest.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
}
