import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import NodeOverview from "./components/NodeOverview";
import GanttTimeline from "./components/GanttTimeline";
import TaskQueue from "./components/TaskQueue";
import AlgorithmComparison from "./components/AlgorithmComparison";
import KnapsackVisualizerModal from "./components/KnapsackVisualizerModal";
import TaskInjectModal from "./components/TaskInjectModal";
import ComplexityCard from "./components/ComplexityCard";
import { PRESET_WORKLOADS } from "./data/defaultWorkloads";
import { simulateTick } from "./algorithms/schedulerEngine";

export default function App() {
  const [workloadId, setWorkloadId] = useState("standard");
  const [algorithm, setAlgorithm] = useState("GREEDY_RATIO");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Modals state
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [isDpModalOpen, setIsDpModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Initialize simulation state from selected preset
  const initSimulationState = (wId, algo) => {
    const preset = PRESET_WORKLOADS[wId] || PRESET_WORKLOADS.standard;
    return {
      workloadId: wId,
      algorithm: algo,
      currentTick: -1,
      node: {
        totalCpu: preset.nodeConfig.totalCpu,
        totalMemory: preset.nodeConfig.totalMemory,
        usedCpu: 0,
        usedMemory: 0
      },
      allTasks: JSON.parse(JSON.stringify(preset.tasks)),
      readyQueue: [],
      runningTasks: [],
      completedTasks: [],
      droppedTasks: [],
      totalPriority: 0,
      history: [],
      lastDpTable: null
    };
  };

  const [simState, setSimState] = useState(() => initSimulationState("standard", "GREEDY_RATIO"));

  // Ref to hold current state for interval loop
  const simStateRef = useRef(simState);
  simStateRef.current = simState;

  // Step function
  const stepSimulation = () => {
    setSimState((prevState) => {
      // Check if all tasks finished
      const totalProcessed = prevState.completedTasks.length + prevState.droppedTasks.length;
      if (totalProcessed === prevState.allTasks.length && prevState.runningTasks.length === 0) {
        setIsPlaying(false);
        return prevState;
      }
      return simulateTick(prevState);
    });
  };

  // Timer loop for auto-play
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const intervalMs = Math.max(200, 1000 / playbackSpeed);
      timer = setInterval(() => {
        const s = simStateRef.current;
        const totalProcessed = s.completedTasks.length + s.droppedTasks.length;
        if (totalProcessed === s.allTasks.length && s.runningTasks.length === 0) {
          setIsPlaying(false);
        } else {
          setSimState((prev) => simulateTick(prev));
        }
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed]);

  // Handlers
  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleStep = () => stepSimulation();
  const handleReset = () => {
    setIsPlaying(false);
    setSimState(initSimulationState(workloadId, algorithm));
  };

  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo);
    setSimState((prev) => ({
      ...prev,
      algorithm: newAlgo
    }));
  };

  const handleWorkloadChange = (newWId) => {
    setIsPlaying(false);
    setWorkloadId(newWId);
    setSimState(initSimulationState(newWId, algorithm));
  };

  const handleInjectTask = (newTask) => {
    setSimState((prev) => ({
      ...prev,
      allTasks: [...prev.allTasks, newTask],
      readyQueue: [...prev.readyQueue, { ...newTask, remainingTime: newTask.duration, status: "QUEUED" }]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        state={simState}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onTogglePlay={handleTogglePlay}
        onStep={handleStep}
        onReset={handleReset}
        onSpeedChange={setPlaybackSpeed}
        onAlgorithmChange={handleAlgorithmChange}
        onWorkloadChange={handleWorkloadChange}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
        onOpenDpModal={() => setIsDpModalOpen(true)}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
      />

      {/* Main Simulation Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Row 1: Node Hardware & Metrics Overview */}
        <NodeOverview state={simState} />

        {/* Row 2: Live Gantt Execution Timeline */}
        <GanttTimeline state={simState} />

        {/* Row 3: Task Queue & Admission Control */}
        <div className="grid grid-cols-1 gap-4">
          <TaskQueue
            state={simState}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <AlgorithmComparison
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        tasks={simState.allTasks}
        nodeConfig={simState.node}
      />

      <KnapsackVisualizerModal
        isOpen={isDpModalOpen}
        onClose={() => setIsDpModalOpen(false)}
        dpTable={simState.lastDpTable}
        node={simState.node}
      />

      <TaskInjectModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onInject={handleInjectTask}
        currentTick={simState.currentTick >= 0 ? simState.currentTick : 0}
        node={simState.node}
      />

      <ComplexityCard
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        Cloud Server Task Scheduling Simulation
      </footer>
    </div>
  );
}
