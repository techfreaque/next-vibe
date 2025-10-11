"use client";

import {
  AlertCircle,
  BarChart,
  Calendar,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  cronDefinition: `// Define cron jobs with full type safety
// src/app/api/[locale]/v1/emails/send-newsletter.cron.ts
import { registerCronTask } from "next-vibe/cron";

registerCronTask({
  id: "send-newsletter",
  name: "Send Weekly Newsletter",
  description: "Sends newsletter to all subscribed users",
  
  // Cron expression or preset
  schedule: "0 9 * * MON", // Every Monday at 9 AM
  // OR use presets
  schedule: "@weekly",
  schedule: "@daily",
  schedule: "@hourly",
  
  // Task configuration
  config: {
    priority: CronTaskPriority.MEDIUM,
    timeout: 300000, // 5 minutes
    retries: 3,
    retryDelay: 60000, // 1 minute
    concurrent: false, // Don't run if previous is still running
  },
  
  // The task handler
  handler: async ({ db, logger }) => {
    logger.info("Starting newsletter send...");
    
    const subscribers = await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.active, true));
    
    const results = await sendNewsletterBatch(subscribers);
    
    return {
      success: true,
      processed: results.sent,
      failed: results.failed,
      duration: results.duration,
    };
  },
  
  // Validation schema for manual runs
  inputSchema: z.object({
    testMode: z.boolean().optional(),
    limit: z.number().optional(),
  }),
});`,

  taskManagement: `# Manage cron tasks via CLI
# List all registered tasks
$ vibe cron:list
┌─────────────────────┬───────────────┬────────────┬──────────┬─────────┐
│ Task ID             │ Name          │ Schedule   │ Status   │ Last Run│
├─────────────────────┼───────────────┼────────────┼──────────┼─────────┤
│ send-newsletter     │ Newsletter    │ @weekly    │ Active   │ 2d ago  │
│ cleanup-temp        │ Cleanup       │ @daily     │ Active   │ 3h ago  │
│ sync-analytics      │ Analytics     │ */5 * * * *│ Active   │ 5m ago  │
│ backup-database     │ DB Backup     │ 0 3 * * *  │ Paused   │ 1w ago  │
└─────────────────────┴───────────────┴────────────┴──────────┴─────────┘

# Run a task manually
$ vibe cron:run send-newsletter
🚀 Running task: send-newsletter
⏳ Executing...
✅ Task completed successfully
  Duration: 45.2s
  Processed: 1,247 subscribers
  Failed: 3

# Run with custom parameters
$ vibe cron:run send-newsletter --data '{"testMode": true, "limit": 10}'

# View task history
$ vibe cron:history send-newsletter --last 10
┌────────────────────┬──────────┬──────────┬─────────┬────────┐
│ Execution Time     │ Status   │ Duration │ Result  │ Error  │
├────────────────────┼──────────┼──────────┼─────────┼────────┤
│ 2024-01-15 09:00   │ Success  │ 45.2s    │ 1247/3  │ -      │
│ 2024-01-08 09:00   │ Success  │ 43.1s    │ 1198/1  │ -      │
│ 2024-01-01 09:00   │ Failed   │ 5.0s     │ 0/0     │ Timeout│
└────────────────────┴──────────┴──────────┴─────────┴────────┘`,

  monitoring: `// Real-time monitoring and statistics
// API endpoint for task statistics
$ vibe cron:stats
📊 Cron Task Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Health: 🟢 Healthy

Task Performance (Last 24h):
┌─────────────────────┬──────┬────────┬─────────┬──────────┐
│ Task                │ Runs │ Success│ Avg Time│ 95% Time │
├─────────────────────┼──────┼────────┼─────────┼──────────┤
│ sync-analytics      │ 288  │ 99.3%  │ 1.2s    │ 2.1s     │
│ cleanup-temp        │ 1    │ 100%   │ 12.4s   │ 12.4s    │
│ process-webhooks    │ 576  │ 98.1%  │ 0.8s    │ 1.5s     │
└─────────────────────┴──────┴────────┴─────────┴──────────┘

Failed Tasks (Action Required):
⚠️ email-campaign: 3 failures in last hour
   Last error: SMTP connection timeout

// Monitor specific task
$ vibe cron:monitor sync-analytics --follow
[09:15:00] ⏳ Task started
[09:15:01] 📊 Processing 1,247 records
[09:15:02] ✅ Batch 1/5 complete (250 records)
[09:15:03] ✅ Batch 2/5 complete (250 records)
[09:15:05] ✅ Task completed (1.2s)`,

  advancedFeatures: `// Advanced cron features
// Chained tasks
registerCronTask({
  id: "data-pipeline",
  schedule: "@daily",
  
  handler: async ({ runTask }) => {
    // Run tasks in sequence
    await runTask("extract-data");
    await runTask("transform-data");
    await runTask("load-data");
  },
});

// Conditional execution
registerCronTask({
  id: "conditional-task",
  schedule: "*/10 * * * *", // Every 10 minutes
  
  shouldRun: async ({ db, lastRun }) => {
    // Skip if recently run
    if (lastRun && Date.now() - lastRun < 3600000) {
      return false;
    }
    
    // Check if there's work to do
    const pending = await db.select()
      .from(queue)
      .where(eq(queue.status, "pending"))
      .limit(1);
      
    return pending.length > 0;
  },
  
  handler: async ({ db }) => {
    // Process queue items
  },
});

// Distributed locking
registerCronTask({
  id: "distributed-task",
  schedule: "@hourly",
  
  // Ensures only one instance runs across multiple servers
  config: {
    distributed: true,
    lockTimeout: 60000, // Release lock after 1 minute
  },
  
  handler: async ({ lock }) => {
    if (!await lock.acquire()) {
      return { skipped: true, reason: "Already running" };
    }
    
    try {
      // Do work
    } finally {
      await lock.release();
    }
  },
});`,

  errorHandling: `// Robust error handling and recovery
registerCronTask({
  id: "resilient-task",
  schedule: "@hourly",
  
  config: {
    retries: 3,
    retryDelay: 60000, // Exponential backoff
    errorHandler: "continue", // continue | stop | alert
  },
  
  handler: async ({ db, logger, metrics }) => {
    try {
      // Track metrics
      metrics.increment("task.started");
      const startTime = Date.now();
      
      // Do work with error handling
      const results = await processDataWithRetry();
      
      // Record success metrics
      metrics.histogram("task.duration", Date.now() - startTime);
      metrics.increment("task.success");
      
      return { success: true, processed: results.count };
      
    } catch (error) {
      logger.error("Task failed", { error });
      metrics.increment("task.failed");
      
      // Categorize error for better handling
      if (error instanceof NetworkError) {
        return { 
          retry: true, 
          retryAfter: 300000, // 5 minutes 
        };
      }
      
      // Alert for critical errors
      if (error instanceof CriticalError) {
        await sendAlert({
          task: "resilient-task",
          error: error.message,
          severity: "high",
        });
      }
      
      throw error; // Re-throw for framework handling
    }
  },
  
  // Cleanup on failure
  onError: async ({ error, attempts }) => {
    if (attempts >= 3) {
      // Final failure - cleanup
      await cleanupFailedTask();
    }
  },
});`,

  ui: `// Web UI for cron management
// Built-in admin interface
$ vibe admin:cron

🖥️ Opening Cron Management UI...
  Local: http://localhost:3000/admin/cron
  
Features:
  ✅ Visual task scheduler
  ✅ Execution history graphs
  ✅ Real-time logs
  ✅ Manual task triggers
  ✅ Performance metrics
  ✅ Error alerts

// React hooks for cron integration
import { useCronTask, useCronStats } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

function CronDashboard() {
  const { stats, loading } = useCronStats();
  const { trigger, running } = useCronTask("send-newsletter");
  
  return (
    <div>
      <h2>Task Performance</h2>
      <TaskChart data={stats.performance} />
      
      <button 
        onClick={() => trigger({ testMode: true })}
        disabled={running}
      >
        {running ? "Running..." : "Test Newsletter"}
      </button>
    </div>
  );
}`,
};

export default function BackgroundJobsPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("cronDefinition");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Clock className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Background Jobs & Cron
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Enterprise-grade task scheduling with database-backed persistence,
          distributed locking, monitoring, and a beautiful management interface.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Production-Ready Task System
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-gray-400 text-sm">
                Cron expressions, presets, or custom schedules
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                High Performance
              </h3>
              <p className="text-gray-400 text-sm">
                Concurrent execution with distributed locking
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Built-in Monitoring
              </h3>
              <p className="text-gray-400 text-sm">
                Track performance, errors, and execution history
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Error Recovery
              </h3>
              <p className="text-gray-400 text-sm">
                Automatic retries with exponential backoff
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Live Examples</h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("cronDefinition")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "cronDefinition"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Task Definition
              </button>
              <button
                onClick={() => setActiveExample("taskManagement")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "taskManagement"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Management CLI
              </button>
              <button
                onClick={() => setActiveExample("monitoring")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "monitoring"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Monitoring
              </button>
              <button
                onClick={() => setActiveExample("advancedFeatures")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "advancedFeatures"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setActiveExample("errorHandling")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "errorHandling"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Error Handling
              </button>
              <button
                onClick={() => setActiveExample("ui")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "ui"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Web UI
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                {codeExamples[activeExample]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Queue Visualization
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Live Queue Monitor
          </h3>

          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Queue Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm">Healthy</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Processing Rate</span>
                  <span>847 tasks/min</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">8</div>
                  <div className="text-xs text-gray-500">Running</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">1,247</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">3</div>
                  <div className="text-xs text-gray-500">Failed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Task Queue Flow
              </h4>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-600 rounded px-3 py-1 text-sm text-white">
                      New Task
                    </div>
                    <div className="text-gray-500">→</div>
                    <div className="bg-purple-600 rounded px-3 py-1 text-sm text-white">
                      Queue
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-20">
                    <div className="text-gray-500">↓</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded px-3 py-1 text-sm text-white">
                      Worker Pool
                    </div>
                    <div className="text-gray-500">→</div>
                    <div className="bg-green-600 rounded px-3 py-1 text-sm text-white">
                      Complete
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-20">
                    <div className="text-gray-500">↓ (on error)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-600 rounded px-3 py-1 text-sm text-white">
                      Retry Queue
                    </div>
                    <div className="text-gray-500">→</div>
                    <div className="bg-red-600 rounded px-3 py-1 text-sm text-white">
                      Dead Letter
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Active Workers
              </h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Worker #1</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-400">
                      Processing email-batch
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Worker #2</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-400">
                      Processing data-sync
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Worker #3</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-400">Idle</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Worker #4</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-400">Idle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">
            Task States & Lifecycle
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Task States
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-gray-300">
                    PENDING - Waiting to run
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-gray-300">
                    RUNNING - Currently executing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-300">
                    COMPLETED - Finished successfully
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-300">FAILED - Error occurred</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-gray-300">
                    TIMEOUT - Exceeded time limit
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Priority Levels
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-mono">CRITICAL</span>
                  <span className="text-gray-400">- Immediate execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-mono">HIGH</span>
                  <span className="text-gray-400">- Next in queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">MEDIUM</span>
                  <span className="text-gray-400">- Standard priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-mono">LOW</span>
                  <span className="text-gray-400">
                    - When resources available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono">BACKGROUND</span>
                  <span className="text-gray-400">- Best effort</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Execution Tracking
              </h4>
              <p className="text-gray-300 text-sm mb-3">
                Every execution is tracked with:
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Start and end timestamps</li>
                <li>• Duration and performance metrics</li>
                <li>• Success/failure status</li>
                <li>• Error messages and stack traces</li>
                <li>• Input parameters used</li>
                <li>• Output/result data</li>
                <li>• Resource usage stats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Queue Performance Metrics
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                12.3ms
              </div>
              <div className="text-sm text-gray-400">Avg Queue Time</div>
              <div className="mt-2 text-xs text-green-400">
                ↓ 15% from last hour
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                847/min
              </div>
              <div className="text-sm text-gray-400">Throughput</div>
              <div className="mt-2 text-xs text-green-400">
                ↑ 23% from baseline
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                99.7%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="mt-2 text-xs text-gray-400">— No change</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">4/8</div>
              <div className="text-sm text-gray-400">Active Workers</div>
              <div className="mt-2 text-xs text-blue-400">Auto-scaled</div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-6">
            <h4 className="text-lg font-medium text-white mb-4">
              Queue Depth Over Time
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">2 min ago</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: "15%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  45
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">1 min ago</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: "12%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  38
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">Now</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"
                    style={{ width: "8%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  23
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Play className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Manual Execution
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Run any task on-demand with custom parameters. Perfect for
              testing, debugging, or handling edge cases.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              {"$ vibe cron:run task-id --data '{...}'"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Pause className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                Pause & Resume
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Temporarily disable tasks without removing them. Useful for
              maintenance windows or debugging production issues.
            </p>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
              $ vibe cron:pause task-id
              <br />$ vibe cron:resume task-id
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Battle-Tested in Production
          </h2>
          <p className="text-gray-300 mb-6">
            Our cron system handles millions of task executions daily with
            99.99% reliability. Built for scale with features enterprises need.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">10M+</div>
              <div className="text-gray-400">Daily executions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">99.99%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                &lt;100ms
              </div>
              <div className="text-gray-400">Scheduling latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">∞</div>
              <div className="text-gray-400">Scale potential</div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Background Jobs Made Simple
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From simple periodic tasks to complex workflows, Vibe's background job
          system handles it all with grace, reliability, and outstanding
          developer experience.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">$ vibe cron:create my-task</div>
          <div className="text-gray-500 mt-1">
            # Your background job, ready to scale
          </div>
        </div>
      </section>
    </main>
  );
}
