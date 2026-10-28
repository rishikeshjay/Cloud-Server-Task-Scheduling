import React, { useState, useEffect } from "react";
import { X, Trophy, BarChart3, Clock, Zap, Cpu, Award, CheckCircle, AlertTriangle } from "lucide-react";
import { runComparativeBenchmark, ALGORITHMS } from "../algorithms/schedulerEngine";

export default function AlgorithmComparison({ tasks, nodeConfig, isOpen, onClose }) {
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isOpen && tasks.length > 0) {
      setIsRunning(true);
      // Run benchmark asynchronously to avoid freezing animation
      setTimeout(() => {
        const results = runComparativeBenchmark(tasks, nodeConfig);
        setBenchmarkResults(results);
        setIsRunning(false);
      }, 50);
    }
  }, [isOpen, tasks, nodeConfig]);

  if (!isOpen) return null;

  // Identify winners
  let topPriorityAlgo = null;
  let topSlaAlgo = null;
  let fastestAlgo = null;

  if (benchmarkResults) {
    const list = Object.values(benchmarkResults);
    topPriorityAlgo = [...list].sort((a, b) => b.totalPriority - a.totalPriority)[0];
    topSlaAlgo = [...list].sort((a, b) => b.slaSuccessPct - a.slaSuccessPct)[0];
    fastestAlgo = [...list].sort((a, b) => parseFloat(a.executionTimeMs) - parseFloat(b.executionTimeMs))[0];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                DAA Algorithmic Benchmark Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating Knapsack DP, Greedy Ratio, EDF, DRF, and FCFS on identical trace ({tasks.length} tasks)
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
        <div className="p-6 overflow-y-auto space-y-6">
          {isRunning || !benchmarkResults ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-sm text-slate-300 font-medium">
                Executing multi-algorithm comparative simulation...
              </div>
            </div>
          ) : (
            <>
              {/* Winner Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Max Priority Winner
                    </div>
                    <div className="text-sm font-bold text-white">
                      {topPriorityAlgo?.name}
                    </div>
                    <div className="text-xs font-mono text-amber-300">
                      {topPriorityAlgo?.totalPriority} pts ({topPriorityAlgo?.priorityHarvestPct}% harvested)
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Best SLA Retention
                    </div>
                    <div className="text-sm font-bold text-white">
                      {topSlaAlgo?.name}
                    </div>
                    <div className="text-xs font-mono text-emerald-300">
                      {topSlaAlgo?.slaSuccessPct}% completed ({topSlaAlgo?.droppedCount} drops)
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-cyan-500/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Lowest Decision Overhead
                    </div>
                    <div className="text-sm font-bold text-white">
                      {fastestAlgo?.name}
                    </div>
                    <div className="text-xs font-mono text-cyan-300">
                      {fastestAlgo?.executionTimeMs} ms total runtime
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Visual Bars */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Priority Accrual Comparison (Higher is Better)
                </h3>
                <div className="space-y-3">
                  {Object.values(benchmarkResults).map((res) => {
                    const maxVal = topPriorityAlgo?.totalPriority || 1;
                    const pct = Math.round((res.totalPriority / maxVal) * 100);

                    return (
                      <div key={res.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-200 flex items-center gap-2">
                            <span>{res.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                              {res.timeComplexity}
                            </span>
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {res.totalPriority} pts ({res.priorityHarvestPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Comparative Table */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Algorithm</th>
                        <th className="py-3 px-3">DAA Paradigm</th>
                        <th className="py-3 px-3">Time Comp</th>
                        <th className="py-3 px-3 text-right">Harvested</th>
                        <th className="py-3 px-3 text-right">SLA %</th>
                        <th className="py-3 px-3 text-right">Avg CPU%</th>
                        <th className="py-3 px-3 text-right">Avg Mem%</th>
                        <th className="py-3 px-4 text-right">Runtime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {Object.values(benchmarkResults).map((res) => (
                        <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-1.5">
                            {res.id === topPriorityAlgo?.id && (
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            {res.name}
                          </td>
                          <td className="py-3 px-3 font-sans text-slate-400">{res.paradigm}</td>
                          <td className="py-3 px-3 text-cyan-400 font-bold">{res.timeComplexity}</td>
                          <td className="py-3 px-3 text-right font-bold text-amber-300">
                            {res.totalPriority}
                          </td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-semibold">
                            {res.slaSuccessPct}%
                          </td>
                          <td className="py-3 px-3 text-right">{res.avgCpuPct}%</td>
                          <td className="py-3 px-3 text-right">{res.avgMemPct}%</td>
                          <td className="py-3 px-4 text-right text-slate-400">
                            {res.executionTimeMs} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
}
