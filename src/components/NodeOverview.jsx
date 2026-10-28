import React from "react";
import { Cpu, HardDrive, Award, AlertOctagon, CheckCircle2, Clock, Activity, Zap } from "lucide-react";
import { ALGORITHMS } from "../algorithms/schedulerEngine";

export default function NodeOverview({ state }) {
  const { node, currentTick, runningTasks, completedTasks, droppedTasks, totalPriority, algorithm, allTasks } = state;
  const currentAlgo = ALGORITHMS[algorithm];

  const cpuPct = Math.round((node.usedCpu / node.totalCpu) * 100);
  const memPct = Math.round((node.usedMemory / node.totalMemory) * 100);

  const totalEvaluated = completedTasks.length + droppedTasks.length;
  const slaPct = totalEvaluated > 0 ? Math.round((completedTasks.length / totalEvaluated) * 100) : 100;

  const totalPossiblePriority = allTasks.reduce((sum, t) => sum + t.priority, 0);
  const harvestRatio = totalPossiblePriority > 0 ? Math.round((totalPriority / totalPossiblePriority) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. CPU Capacity Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Node vCPU Saturation</span>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-semibold">{cpuPct}%</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold font-mono text-white">{node.usedCpu.toFixed(1)}</span>
          <span className="text-xs text-slate-400">/ {node.totalCpu} Cores</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              cpuPct > 90 ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]" : 
              cpuPct > 70 ? "bg-amber-400" : "bg-cyan-400"
            }`}
            style={{ width: `${Math.min(cpuPct, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400 font-mono">
          <span>Free: {(node.totalCpu - node.usedCpu).toFixed(1)} Cores</span>
          <span>{runningTasks.length} Active Tasks</span>
        </div>
      </div>

      {/* 2. Memory Capacity Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Node RAM Allocation</span>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold">{memPct}%</span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold font-mono text-white">{node.usedMemory.toFixed(1)}</span>
          <span className="text-xs text-slate-400">/ {node.totalMemory} GB</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              memPct > 90 ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]" : 
              memPct > 70 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${Math.min(memPct, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400 font-mono">
          <span>Free: {(node.totalMemory - node.usedMemory).toFixed(1)} GB</span>
          <span>Pressure: {memPct > 85 ? "HIGH" : "NORMAL"}</span>
        </div>
      </div>

      {/* 3. Harvested Priority Value Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Objective: Max Priority</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-medium border border-amber-400/20">
            {harvestRatio}% Harvested
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold font-mono text-amber-300">{totalPriority}</span>
          <span className="text-xs text-slate-400">/ {totalPossiblePriority} Max Pts</span>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(harvestRatio, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400">
          <span className="font-mono">Completed: {completedTasks.length}</span>
          <span className="font-mono text-rose-400">Dropped: {droppedTasks.length}</span>
        </div>
      </div>

      {/* 4. Active Engine & Clock Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Simulation Clock</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Tick {currentTick >= 0 ? currentTick : 0}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">{currentAlgo.name}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-purple-400 font-mono font-medium">{currentAlgo.timeComplexity}</span>
                <span>•</span>
                <span>{currentAlgo.paradigm}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-400">{slaPct}%</div>
              <div className="text-[10px] text-slate-400">SLA Compliance</div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Node Status: ACTIVE</span>
          </span>
          <span className="font-mono">Queue Depth: {state.readyQueue.length}</span>
        </div>
      </div>
    </div>
  );
}
