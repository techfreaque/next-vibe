export const translations = {
  category: "Agent",
  claudeCode: {
    tags: {
      tasks: "Tasks",
    },
    run: {
      post: {
        title: "Run Claude Code",
        dynamicTitle: "Claude Code: {{prompt}}",
        description:
          "Run a Claude Code task. Batch mode (DEFAULT): runs headlessly and returns output. Interactive mode: opens a live terminal session — result is delivered back automatically when the session ends.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "The task or question to send to Claude Code. Be specific — include file paths, context, and expected output format.",
          },
          model: {
            label: "Model",
            description:
              "Claude model to use for this session. Defaults to Sonnet (recommended for most tasks). Use Opus for complex reasoning, Haiku for fast/cheap tasks.",
            options: {
              sonnet: "Sonnet 4.6 (recommended)",
              opus: "Opus 4.6 (best reasoning)",
              haiku: "Haiku 4.5 (fastest)",
            },
          },
          maxBudgetUsd: {
            label: "Max Budget (USD)",
            description:
              "Maximum spend limit in USD for this run. Prevents runaway tool-use costs. Omit for no limit.",
          },
          availableTools: {
            label: "Allowed Tools",
            description:
              "Comma-separated list of tools Claude Code may use (e.g. Read,Edit,Bash). Omit to allow all default tools.",
          },
          taskTitle: {
            label: "Task Title",
            description:
              "Short title for archiving this task (e.g. 'Fix login bug', 'Add memory sync'). Auto-generated from the prompt if omitted.",
          },
          interactiveMode: {
            label: "Interactive Mode",
            description:
              "false (DEFAULT): runs headlessly and returns all output when done. true: opens a terminal window for a live session — result is delivered back automatically when the session ends.",
          },
          output: {
            label: "Output",
            description:
              "Combined stdout from the Claude Code process. Empty when task was escalated to background execution (result injected via wakeUp).",
          },
          durationMs: {
            label: "Duration (ms)",
            description: "Total wall-clock time the process ran.",
          },
          taskId: {
            label: "Task ID",
            description:
              "For interactive mode: the tracking task ID that Claude Code will call complete-task with when the session ends. The result is delivered back automatically. For batch mode: not present (result returned inline).",
          },
          hint: {
            label: "Hint",
            description:
              "Guidance for the AI on how the result will be delivered.",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters — check prompt and fields",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required — admin role needed",
          },
          internal: {
            title: "Execution Failed",
            description:
              "Claude Code process failed to start or crashed unexpectedly",
          },
          internalExitCode: {
            title: "Execution Failed (exit {{exitCode}})",
            description: "Claude Code process exited with a non-zero exit code",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied — insufficient permissions",
          },
          notFound: {
            title: "Not Found",
            description: "Resource or working directory not found",
          },
          network: {
            title: "Network Error",
            description: "Network error communicating with Claude Code",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred during execution",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes conflict detected",
          },
          conflict: {
            title: "Conflict",
            description: "Execution conflict — another session may be running",
          },
        },
        success: {
          title: "Claude Code Completed",
          description:
            "Claude Code process finished successfully. If output is empty, result will arrive via thread injection.",
        },
        widget: {
          runningBatch: "Claude is running...",
          runningInteractive: "Launching interactive terminal session...",
          escalated:
            "Running in background — result will be injected when complete.",
          taskIdLabel: "Task ID",
          outputLabel: "Output",
          interactiveSessionLaunched:
            "Interactive session launched in terminal.",
          copyOutput: "Copy",
          copied: "Copied!",
        },
      },
    },
  },
};
