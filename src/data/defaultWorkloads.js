// Preset Workload Scenarios demonstrating core DAA algorithmic trade-offs

export const PRESET_WORKLOADS = {
  standard: {
    id: "standard",
    name: "Standard DAA Benchmark (Balanced)",
    description: "Diverse task distribution with varied CPU, RAM, deadlines, and priorities.",
    nodeConfig: { totalCpu: 16, totalMemory: 64 },
    tasks: [
      { id: "T-101", name: "Auth Service API", arrival: 0, cpu: 2, memory: 4, duration: 6, deadline: 15, priority: 40 },
      { id: "T-102", name: "Video Transcoding Job", arrival: 0, cpu: 8, memory: 24, duration: 8, deadline: 18, priority: 90 },
      { id: "T-103", name: "Redis Cache Sync", arrival: 1, cpu: 2, memory: 8, duration: 4, deadline: 8, priority: 55 },
      { id: "T-104", name: "Database Index Rebuild", arrival: 2, cpu: 6, memory: 16, duration: 10, deadline: 25, priority: 75 },
      { id: "T-105", name: "Payment Gateway Webhook", arrival: 3, cpu: 2, memory: 4, duration: 3, deadline: 7, priority: 95 },
      { id: "T-106", name: "ML Model Inference Batch", arrival: 4, cpu: 10, memory: 32, duration: 6, deadline: 22, priority: 110 },
      { id: "T-107", name: "Telemetry Log Parser", arrival: 5, cpu: 4, memory: 8, duration: 5, deadline: 20, priority: 35 },
      { id: "T-108", name: "Image Thumbnailer", arrival: 6, cpu: 2, memory: 4, duration: 4, deadline: 16, priority: 30 },
      { id: "T-109", name: "Fraud Detection Stream", arrival: 7, cpu: 4, memory: 12, duration: 5, deadline: 14, priority: 85 },
      { id: "T-110", name: "Nightly Analytics Dump", arrival: 8, cpu: 8, memory: 20, duration: 12, deadline: 30, priority: 60 }
    ]
  },

  knapsack_showcase: {
    id: "knapsack_showcase",
    name: "Knapsack DP vs Greedy Edge Case",
    description: "Classic knapsack paradox: Greedy density picks 1 large item, whereas 0/1 Knapsack DP packs 2 complementary items for a higher total score.",
    nodeConfig: { totalCpu: 10, totalMemory: 30 },
    tasks: [
      { id: "T-201", name: "Heavy ETL Pipe (Greedy Trap)", arrival: 0, cpu: 6, memory: 18, duration: 6, deadline: 15, priority: 65 }, // Ratio ~6.5/1
      { id: "T-202", name: "Microservice A", arrival: 0, cpu: 5, memory: 15, duration: 6, deadline: 15, priority: 50 }, // Ratio ~5/1
      { id: "T-203", name: "Microservice B", arrival: 0, cpu: 5, memory: 15, duration: 6, deadline: 15, priority: 50 }, // Ratio ~5/1
      // DP can pack T-202 + T-203 = 10 CPU, 30 Mem => Total 100 Priority!
      // Greedy picks T-201 (density 6.5) => Leaves 4 CPU, 12 Mem => Neither T-202 nor T-203 fit => Total 65 Priority!
      { id: "T-204", name: "Lightweight Probe", arrival: 1, cpu: 2, memory: 4, duration: 3, deadline: 10, priority: 20 },
      { id: "T-205", name: "Event Listener", arrival: 2, cpu: 2, memory: 4, duration: 4, deadline: 12, priority: 25 }
    ]
  },

  deadline_critical: {
    id: "deadline_critical",
    name: "Deadline Critical (EDF Challenge)",
    description: "High-urgency tasks arriving with near-expiration deadlines competing against long-running low-urgency tasks.",
    nodeConfig: { totalCpu: 12, totalMemory: 48 },
    tasks: [
      { id: "T-301", name: "Long Background Backup", arrival: 0, cpu: 8, memory: 32, duration: 14, deadline: 35, priority: 80 },
      { id: "T-302", name: "Urgent Security Patch", arrival: 1, cpu: 4, memory: 16, duration: 3, deadline: 5, priority: 95 },
      { id: "T-303", name: "Live Session Heartbeat", arrival: 2, cpu: 2, memory: 8, duration: 2, deadline: 6, priority: 85 },
      { id: "T-304", name: "Order Fulfillment Event", arrival: 3, cpu: 4, memory: 12, duration: 4, deadline: 9, priority: 90 },
      { id: "T-305", name: "Notification Push Batch", arrival: 4, cpu: 4, memory: 16, duration: 5, deadline: 20, priority: 40 },
      { id: "T-306", name: "Real-time Metrics Emit", arrival: 5, cpu: 2, memory: 4, duration: 2, deadline: 10, priority: 70 }
    ]
  },

  burst_traffic: {
    id: "burst_traffic",
    name: "Burst Traffic Spike (15 Tasks)",
    description: "Sudden spike of tasks arriving in rapid succession, testing queue capacity and admission control.",
    nodeConfig: { totalCpu: 16, totalMemory: 64 },
    tasks: [
      { id: "T-401", name: "Flash Sale API 1", arrival: 0, cpu: 4, memory: 12, duration: 4, deadline: 10, priority: 80 },
      { id: "T-402", name: "Flash Sale API 2", arrival: 0, cpu: 4, memory: 12, duration: 4, deadline: 10, priority: 80 },
      { id: "T-403", name: "Inventory Lock Job", arrival: 0, cpu: 4, memory: 16, duration: 5, deadline: 12, priority: 95 },
      { id: "T-404", name: "Payment Processor 1", arrival: 1, cpu: 4, memory: 16, duration: 4, deadline: 8, priority: 99 },
      { id: "T-405", name: "User Session Verifier", arrival: 1, cpu: 2, memory: 4, duration: 3, deadline: 9, priority: 60 },
      { id: "T-406", name: "Fraud Screening", arrival: 1, cpu: 4, memory: 8, duration: 3, deadline: 8, priority: 85 },
      { id: "T-407", name: "SMS Confirmation", arrival: 2, cpu: 1, memory: 2, duration: 2, deadline: 10, priority: 30 },
      { id: "T-408", name: "Warehouse Dispatch", arrival: 2, cpu: 4, memory: 16, duration: 6, deadline: 16, priority: 70 },
      { id: "T-409", name: "Analytics Counter", arrival: 3, cpu: 2, memory: 4, duration: 3, deadline: 15, priority: 25 },
      { id: "T-410", name: "Email Confirmation", arrival: 3, cpu: 1, memory: 2, duration: 3, deadline: 12, priority: 35 },
      { id: "T-411", name: "Receipt PDF Gen", arrival: 4, cpu: 3, memory: 8, duration: 4, deadline: 14, priority: 50 },
      { id: "T-412", name: "Recommendation Engine", arrival: 4, cpu: 6, memory: 24, duration: 7, deadline: 22, priority: 65 }
    ]
  }
};
