export const translations = {
  tags: {
    maintenance: "Maintenance",
  },
  post: {
    title: "Stale Run Reaper",
    titleShort: "Stale Runs",
    description:
      "Frees chat threads stuck in 'streaming' after the process writing the answer died. Keeps the partial answer, marks it interrupted, and starts any queued messages. Live runs on any node are never touched.",
    container: {
      title: "Stale Run Reaper",
      description: "Preview or free stuck threads",
    },
    fields: {
      localThresholdMinutes: {
        label: "Local threshold (min)",
        description:
          "Reap a local run once its owner has not sent a heartbeat for this long",
      },
      remoteThresholdMinutes: {
        label: "Remote threshold (min)",
        description:
          "Reap a run looped on another instance once nothing arrived for this long",
      },
      batchSize: {
        label: "Max threads",
        description: "Upper limit of threads freed per run",
      },
      dryRun: {
        label: "Dry run",
        description: "List the stuck threads, change nothing",
      },
    },
    response: {
      candidates: "Stuck threads found",
      reaped: "Threads freed",
      lost: "Skipped: came back to life",
      failed: "Failed",
      queuedStarted: "Queued messages started",
      threadIds: "Thread IDs",
      executionTimeMs: "Execution time (ms)",
    },
    success: {
      title: "Sweep done",
      description: "Stuck threads freed",
    },
  },
  interrupted: {
    content:
      "The server restarted while this answer was being written. The partial answer is saved. Retry to continue.",
  },
  errors: {
    failed: "Stale run sweep failed: {{error}}",
    server: {
      title: "Sweep error",
      description: "The stale run sweep failed",
    },
  },
  task: {
    name: "Stale Run Reaper",
    description:
      "Every 5 minutes: frees chat threads left streaming by a process that died mid-answer",
  },
};
