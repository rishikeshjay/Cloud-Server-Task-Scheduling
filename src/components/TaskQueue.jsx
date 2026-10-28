import React, { useState } from "react";
import { ListOrdered, CheckCircle, XCircle, AlertTriangle, Cpu, HardDrive, Plus, Clock } from "lucide-react";

export default function TaskQueue({ state, onOpenTaskModal }) {
  const [activeTab, setActiveTab] = useState("ready"); // 'ready' | 'completed' | 'dropped'
  const { readyQueue, completedTasks, droppedTasks, currentTick, node } = state;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-full">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("ready")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ready"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Ready Queue ({readyQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "completed"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed ({completedTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("dropped")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dropped"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Dropped ({droppedTasks.length})</span>
          </button>
        </div>

        <button
          onClick={onOpenTaskModal}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tab Content List */}
      <div className="overflow-y-auto max-h-[360px] space-y-2 pr-1">
        {/* 1. READY QUEUE */}
        {activeTab === "ready" && (
          readyQueue.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs italic">
              Queue is empty. Incoming tasks will appear here as simulation ticks forward.
            </div>
          ) : (
            readyQueue.map((task) => {
              const ticksUntilDeadline = task.deadline - currentTick;
              const isUrgent = ticksUntilDeadline <= task.duration + 2;

              // Normalized density
              const normCost = (task.cpu / node.totalCpu) + (task.memory / node.totalMemory);
              const density = (task.priority / Math.max(normCost, 0.01)).toFixed(1);

              return (
                <div
                  key={task.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{task.id}</span>
                      <span className="text-xs font-medium text-slate-200">{task.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        P: {task.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Cpu className="w-3 h-3" /> {task.cpu} vCPU
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <HardDrive className="w-3 h-3" /> {task.memory} GB
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3 text-slate-500" /> {task.duration} ticks
                      </span>
                      <span className="text-indigo-400">
                        Density: {density}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isUrgent
                          ? "bg-rose-950 text-rose-300 border-rose-800 animate-pulse"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      Deadline: T{task.deadline} ({ticksUntilDeadline}t left)
                    </span>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* 2. COMPLETED TASKS */}
        {activeTab === "completed" && (
          completedTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs italic">
              No tasks completed yet.
            </div>
          ) : (
            completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-950/70 border border-emerald-900/30 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{task.id}</span>
                    <span className="text-xs font-medium text-slate-300">{task.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Finished at T{task.completionTick} • Allocated {task.cpu}c / {task.memory}GB
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    +{task.priority} pts
                  </span>
                  <div className="text-[10px] text-emerald-500">SLA Met</div>
                </div>
              </div>
            ))
          )
        )}

        {/* 3. DROPPED TASKS */}
        {activeTab === "dropped" && (
          droppedTasks.length === 0 ? (
            <div className="py-12 text-center text-emerald-500/80 text-xs">
              Zero SLA drops! Perfect scheduling performance.
            </div>
          ) : (
            droppedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-950/70 border border-rose-900/30 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{task.id}</span>
                    <span className="text-xs font-medium text-slate-300">{task.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-rose-400/80 mt-0.5">
                    Expired at T{task.dropTick} (Deadline was T{task.deadline})
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-rose-400 line-through">
                    {task.priority} pts
                  </span>
                  <div className="text-[10px] text-rose-500">SLA Violated</div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
