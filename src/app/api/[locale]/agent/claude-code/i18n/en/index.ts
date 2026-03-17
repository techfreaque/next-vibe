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
          "Launch a Claude Code session on Hermes (the local dev machine). DEFAULT: interactiveMode:false — runs `claude -p` (non-interactive print mode), collects all output, and returns it programmatically when done. Use this default for ALL automated tasks, cron jobs, pipelines, and AI tool calls. Only set interactiveMode:true for live back-and-forth sessions where Max is actively watching the terminal — output will NOT be returned in this mode. Always runs with --dangerously-skip-permissions so no confirmation prompts interrupt the flow.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "The task or question to send to Claude Code. Be specific — include file paths, context, and expected output format.",
          },
          model: {
            label: "Model",
            description:
              "Claude model to use for this session. Defaults to Sonnet.",
            options: {
              sonnet: "Sonnet 4.6",
              opus: "Opus 4.6",
              haiku: "Haiku 4.5",
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
              "Use interactiveMode:true only when you want a live back-and-forth session with the user watching. Use interactiveMode:false (default) for automated batch tasks where output must be returned programmatically (cron jobs, pipelines, tool calls).",
          },
          timeoutSeconds: {
            label: "Timeout (seconds)",
            description:
              "Maximum execution time in seconds. Defaults to 1800 (30 minutes). Increase for very long-running tasks.",
          },
          output: {
            label: "Output",
            description: "Combined stdout from the Claude Code process.",
          },
          exitCode: {
            label: "Exit Code",
            description:
              "Process exit code. 0 = success, non-zero = error or partial failure.",
          },
          durationMs: {
            label: "Duration (ms)",
            description: "Total wall-clock time the process ran.",
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
            "Claude Code process finished — check exitCode for success/failure and output for results",
        },
      },
    },
  },
};
