import React from "react";
import { Cpu, HardDrive, Award, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default function GanttTimeline({ state }) {
  const { runningTasks, completedTasks, currentTick } = state;

  // Combine running and completed tasks for timeline rendering
  const activeTimelineTasks = [...runningTasks, ...completedTasks].slice(-10);

  const maxTicksToShow = Math.max(25, (currentTick || 0) + 10);
  const tickMarkers = Array.from({ length: Math.ceil(maxTicksToShow / 5) + 1 }, (_, i) => i * 5);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">Execution Timeline & Gantt View</h2>
          <span className="text-[11px] text-slate-400">
            (Visualizing CPU & RAM allocation over clock ticks)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 animate-pulse" />
            <span>Executing</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Tick Scale Bar */}
      <div className="relative border-b border-slate-800 pb-2 mb-3">
        <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2">
          {tickMarkers.map((tick) => (
            <div key={tick} className="flex flex-col items-center">
              <span>T{tick}</span>
              <div className="w-px h-1.5 bg-slate-700 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Current Tick Needle */}
        {currentTick >= 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 transition-all duration-200 pointer-events-none"
            style={{
              left: `${Math.min(100, Math.max(0, (currentTick / maxTicksToShow) * 100))}%`
            }}
          >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]" />
          </div>
        )}
      </div>

      {/* Task Rows */}
      {activeTimelineTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs italic">
          No tasks currently executing. Click "Play" or "Step" in the header to start scheduling.
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeTimelineTasks.map((task) => {
            const isRunning = task.status === "RUNNING";
            const start = task.startTick !== undefined ? task.startTick : (task.arrival || 0);
            const duration = task.duration;
            const progress = isRunning
              ? Math.max(0, duration - (task.remainingTime !== undefined ? task.remainingTime : duration))
              : duration;

            const leftPct = Math.min(100, Math.max(0, (start / maxTicksToShow) * 100));
            const widthPct = Math.min(100 - leftPct, Math.max(4, (duration / maxTicksToShow) * 100));

            return (
              <div key={task.id} className="relative group bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-white">{task.id}</span>
                    <span className="text-slate-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                      {task.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      +{task.priority} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-0.5 text-cyan-400">
                      <Cpu className="w-3 h-3" /> {task.cpu}c
                    </span>
                    <span className="flex items-center gap-0.5 text-emerald-400">
                      <HardDrive className="w-3 h-3" /> {task.memory}GB
                    </span>
                    <span className="text-slate-500">
                      Deadline: T{task.deadline}
                    </span>
                    {task.status === "COMPLETED" ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="text-cyan-400 font-bold">
                        {task.remainingTime} ticks left
                      </span>
                    )}
                  </div>
                </div>

                {/* Task Duration Bar relative to timeline */}
                <div className="relative w-full h-4 bg-slate-900 rounded overflow-hidden">
                  <div
                    className={`absolute h-full rounded transition-all duration-300 flex items-center px-1.5 text-[9px] font-mono font-bold text-slate-950 ${
                      isRunning
                        ? "bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                        : "bg-emerald-500 opacity-80"
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`
                    }}
                  >
                    <span className="truncate">
                      {progress}/{duration}t
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
