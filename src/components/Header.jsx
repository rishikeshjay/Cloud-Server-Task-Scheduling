import React from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Cpu, 
  Layers, 
  BarChart3, 
  BookOpen, 
  Table as TableIcon,
  PlusCircle,
  Zap
} from "lucide-react";
import { ALGORITHMS } from "../algorithms/schedulerEngine";
import { PRESET_WORKLOADS } from "../data/defaultWorkloads";

export default function Header({
  state,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onStep,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onWorkloadChange,
  onOpenBenchmark,
  onOpenVivaModal,
  onOpenDpModal,
  onOpenTaskModal
}) {
  const currentAlgo = ALGORITHMS[state.algorithm];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & DAA Badge */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 text-cyan-400 shadow-inner">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Cloud Task Scheduler
              </h1>
              <p className="text-xs text-slate-400">
                Multi-Dimensional Knapsack & Priority Optimization Simulation
              </p>
            </div>
          </div>

          {/* Quick Action Pills for Mobile */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              onClick={onOpenBenchmark}
              className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
              title="Algorithm Benchmark"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Algorithm & Workload Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-center">
          {/* Workload Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={state.workloadId}
              onChange={(e) => onWorkloadChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.values(PRESET_WORKLOADS).map((w) => (
                <option key={w.id} value={w.id} className="bg-slate-900 text-slate-200">
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Algorithm Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <select
              value={state.algorithm}
              onChange={(e) => onAlgorithmChange(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {Object.values(ALGORITHMS).map((a) => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-slate-200">
                  {a.name} ({a.timeComplexity})
                </option>
              ))}
            </select>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentAlgo.paradigm}
            </span>
          </div>
        </div>

        {/* Simulation Controls & Extra Modals */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </>
            )}
          </button>

          {/* Step 1 Tick */}
          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium border border-slate-700/60"
            title="Advance 1 Clock Tick"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Step</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackSpeed === speed
                    ? "bg-cyan-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Action Modals */}
          <button
            onClick={onOpenTaskModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium"
            title="Add Custom Task"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Inject Task</span>
          </button>

          {state.algorithm === "KNAPSACK_DP" && (
            <button
              onClick={onOpenDpModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-medium animate-pulse"
              title="Inspect 0/1 Knapsack DP Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DP Table</span>
            </button>
          )}

          <button
            onClick={onOpenBenchmark}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-xs font-medium"
            title="Run Comparative Benchmark across all algorithms"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Benchmark</span>
          </button>

          <button
            onClick={onOpenVivaModal}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700/60"
            title="User Guide & System Walkthrough"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
