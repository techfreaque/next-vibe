export const translations = {
  category: "Task Watchdog",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "budget",
  },
  enums: {
    incidentType: {
      all: "All incidents",
      timeout: "Timeout",
      loop: "Loop",
      budget: "Budget",
      transientRetryExhausted: "Retries exhausted",
      watchdogCancel: "Watchdog cancel",
    },
    budgetScope: {
      task: "Per task run",
      day: "Per day (all tasks)",
      goal: "Per goal, per day",
    },
    spendKind: {
      model: "Model turn",
      tool: "Tool call",
    },
    healthMetric: {
      started: "Tasks started",
      completed: "Tasks completed",
      failed: "Tasks failed",
      watchdogCancelled: "Tasks cancelled by watchdog",
      avgDuration: "Average duration (seconds)",
      p95Duration: "95th percentile duration (seconds)",
      creditSpend: "Credits spent by tasks",
      incidents: "Incidents",
    },
  },
  sweep: {
    post: {
      title: "Task Watchdog Sweep",
      titleShort: "Watchdog Sweep",
      description:
        "Finds stuck, looping and orphaned background tasks, stops them with a recorded reason and opens an incident. Runs every minute.",
      container: {
        title: "Sweep result",
        description: "What the watchdog found and did on this pass",
      },
      response: {
        checked: "Running tasks checked",
        cancelled: "Cancelled (over limit)",
        orphaned: "Orphaned runs recovered",
        loops: "Looping tasks disabled",
        incidents: "Incidents opened",
      },
    },
    task: {
      description:
        "Stops tasks that run too long, loop or lost their process. Every stop opens an incident.",
    },
  },
  health: {
    get: {
      title: "Task Health",
      titleShort: "Task Health",
      description:
        "Running tasks with age, turns and spend, recent failures and open incidents. Cancel a task from here.",
      response: {
        running: "Running tasks",
        failures: "Recent failures",
        incidents: "Open incidents",
        daySpent: "Credits spent today",
        dayCap: "Daily cap",
      },
      widget: {
        title: "Task health",
        subtitle: "Every run is watched. Stuck ones get stopped.",
        refresh: "Refresh",
        loading: "Loading task health…",
        spendToday: "{{spent}} of {{cap}} credits spent by tasks today",
        running: {
          title: "Running now",
          empty: "Nothing running.",
        },
        failures: {
          title: "Recent failures",
          empty: "No failures in the last 24 hours.",
        },
        incidents: {
          title: "Open incidents",
          empty: "No open incidents.",
        },
        age: "Age",
        turns: "Turns",
        toolCalls: "Tool calls",
        spend: "Spent",
        goal: "Goal {{goal}}",
        limit: "limit {{limit}}",
        lastError: "Last error",
        noError: "No error recorded",
        cancel: "Cancel",
        cancelling: "Cancelling…",
        resolve: "Resolve",
        credits: "{{amount}} cr",
      },
    },
  },
  cancel: {
    post: {
      title: "Cancel Task",
      titleShort: "Cancel Task",
      description:
        "Stops a running task (and its AI loop) and records the cancel, or marks an incident resolved.",
      fields: {
        taskId: {
          label: "Task ID",
          description: "The running task to stop",
          placeholder: "task id",
        },
        incidentId: {
          label: "Incident ID",
          description: "The incident to mark resolved",
        },
      },
      response: {
        cancelled: "Task cancelled",
        resolved: "Incident resolved",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Task Budget Caps",
      titleShort: "Budget Caps",
      description:
        "Credit caps that stop background tasks: per task run, per day and per goal.",
      response: {
        rows: "Caps",
        daySpent: "Credits spent today",
      },
      widget: {
        title: "Task budget caps",
        subtitle:
          "A task that hits a cap stops cleanly. The daily cap is the hard ceiling for all unattended runs.",
        refresh: "Refresh",
        add: "Set cap",
        loading: "Loading caps…",
        empty: {
          title: "No caps set",
          hint: "Defaults apply: 100 credits per task run, 1000 per day, 500 per goal.",
          cta: "Set first cap",
        },
        spentToday: "{{spent}} credits spent today",
        enabled: "Active",
        disabled: "Off",
        credits: "{{amount}} credits",
        none: "none",
      },
    },
    post: {
      title: "Set Task Budget Cap",
      titleShort: "Set Cap",
      description:
        "Create or update a credit cap. One cap per scope and key. A task key of * is the default for every task.",
      fields: {
        scope: {
          label: "Scope",
          description: "What the cap limits",
        },
        key: {
          label: "Key",
          description:
            "Task: task id or *. Day: global. Goal: goal name or * (goal:<name> tag on the task)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Max credits",
          description: "Spend at or above this stops the task. 0 blocks it.",
        },
        enabled: {
          label: "Active",
          description: "Off keeps the row but ignores it",
        },
        note: {
          label: "Note",
          description: "Why this cap exists",
          placeholder: "Overnight research agents",
        },
      },
      response: {
        id: "Cap ID",
      },
      widget: {
        back: "Back",
        hint: "A cap stops the task when spend reaches it. The daily cap always applies.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Resolution", description: "Bucket size" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
      metric: {
        label: "Metric",
        description:
          "Tasks started, completed, failed, watchdog-cancelled, duration, credit spend or incidents",
      },
      incidentType: {
        label: "Incident type",
        description: "Only for the incidents metric. All types by default",
      },
    },
    taskHealth: {
      post: {
        title: "Task Health",
        titleShort: "Task Health",
        description:
          "Background task runs, durations, credit spend and watchdog incidents per bucket",
        fields: {
          result: { label: "Value", description: "Metric value per bucket" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the highlighted fields",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as admin",
    },
    forbidden: {
      title: "Admins only",
      description: "Task watchdog tools need the admin role",
    },
    notFound: {
      title: "Not found",
      description: "That task or incident does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "The entry changed meanwhile, reload and retry",
    },
    server: {
      title: "Server error",
      description: "Could not complete the request",
    },
    network: {
      title: "Network error",
      description: "Request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
    nothingToDo: "Pass a task id to cancel or an incident id to resolve",
    taskNotRunning: "Task {{taskId}} is not running",
    incidentNotFound: "Incident {{incidentId}} does not exist",
    invalidCap: "A cap needs a non-negative amount and a key",
  },
  success: {
    title: "Done",
    description: "Saved",
  },
};
