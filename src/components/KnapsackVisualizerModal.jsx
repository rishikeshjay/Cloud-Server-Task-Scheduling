import React from "react";
import { X, Table as TableIcon, Layers, Brain, CheckCircle2 } from "lucide-react";

export default function KnapsackVisualizerModal({ isOpen, onClose, dpTable, node }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                0/1 Knapsack Dynamic Programming Table
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing bottom-up state transitions: dp[c][m] = max(dp[c][m], dp[c - c_i][m - m_i] + p_i)
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
          {/* Theory Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>DAA Recurrence Relation</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Unlike the standard 1D knapsack problem, our cloud server task scheduler models a 
              <span className="text-cyan-400 font-semibold"> Multi-Dimensional Knapsack Problem (MDKP)</span> where tasks demand both CPU cores (c_i) and RAM (m_i). 
              State transition is computed across discretized capacity steps:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-indigo-300 border border-slate-800 text-center">
              DP[c][m] = max( DP[c][m], DP[c - c_i][m - m_i] + Priority_i )
            </div>
          </div>

          {/* Render Table */}
          {!dpTable || dpTable.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs italic">
              Run the simulation with "0/1 Knapsack DP" selected to compute and populate the dynamic programming matrix.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>Row: CPU Capacity Slot (vCPUs)</span>
                <span>Column: RAM Capacity Slot (GB)</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/80">
                <table className="w-full text-center text-xs font-mono">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 bg-slate-900 text-indigo-400 font-bold border-r border-slate-800">
                        CPU \ RAM
                      </th>
                      {Object.keys(dpTable[0])
                        .filter((k) => k !== "cpuSlot")
                        .map((memKey) => (
                          <th key={memKey} className="py-2.5 px-3 font-semibold text-slate-300">
                            {memKey.replace("mem_", "")}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dpTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-bold text-indigo-400 bg-slate-900/40 border-r border-slate-800">
                          {row.cpuSlot} Core
                        </td>
                        {Object.keys(row)
                          .filter((k) => k !== "cpuSlot")
                          .map((memKey) => {
                            const val = row[memKey];
                            return (
                              <td
                                key={memKey}
                                className={`py-2 px-3 ${
                                  val > 0
                                    ? "text-emerald-400 font-semibold bg-emerald-950/20"
                                    : "text-slate-600"
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Close Table
          </button>
        </div>
      </div>
    </div>
  );
}
