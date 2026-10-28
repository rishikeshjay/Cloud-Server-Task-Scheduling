import React, { useState } from "react";
import { X, PlusCircle, Cpu, HardDrive, Clock, Award, AlertCircle } from "lucide-react";

export default function TaskInjectModal({ isOpen, onClose, onInject, currentTick, node }) {
  const [name, setName] = useState("");
  const [cpu, setCpu] = useState(4);
  const [memory, setMemory] = useState(16);
  const [duration, setDuration] = useState(5);
  const [deadline, setDeadline] = useState(Math.max(10, currentTick + 12));
  const [priority, setPriority] = useState(80);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `T-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim() || "Custom Injected Task",
      arrival: Math.max(0, currentTick),
      cpu: Number(cpu),
      memory: Number(memory),
      duration: Number(duration),
      deadline: Number(deadline),
      priority: Number(priority)
    };

    onInject(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Inject Custom Workload Task</h2>
              <p className="text-[11px] text-slate-400">Add an ad-hoc task into the live simulation queue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Critical Payment Webhook"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> vCPU Cores
              </label>
              <input
                type="number"
                min="1"
                max={node.totalCpu}
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Memory (GB)
              </label>
              <input
                type="number"
                min="1"
                max={node.totalMemory}
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration (Ticks)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Deadline Tick
              </label>
              <input
                type="number"
                min={currentTick + 1}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" /> Priority Value (Score)
            </label>
            <input
              type="number"
              min="5"
              max="200"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg"
            >
              Inject Into Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
