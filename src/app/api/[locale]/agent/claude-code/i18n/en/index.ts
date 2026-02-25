export const translations = {
  category: "Agent",
  claudeCode: {
    tags: {
      tasks: "Tasks",
    },
    run: {
      post: {
        title: "Run Claude Code",
        description:
          "Launch a Claude Code session on Hermes (the local dev machine). PREFER headless:false (default) — this opens a full back-and-forth Claude Code session where Max can actively participate. Use headless:true only for fully automated batch tasks that need no human input and must return output programmatically (e.g. cron jobs, automated review). In interactive mode the session streams live to the terminal and waits for the user; in batch mode it runs `claude -p`, collects all output, and returns when done. Always runs with --dangerously-skip-permissions so no confirmation prompts interrupt the flow.",
        fields: {
          prompt: {
            title: "Prompt",
            description:
              "The task or question to send to Claude Code. Be specific — include file paths, context, and expected output format.",
          },
          model: {
            title: "Model",
            description:
              "Claude model ID to use (e.g. claude-sonnet-4-6, claude-opus-4-6). Defaults to the Claude Code default if omitted.",
          },
          maxBudgetUsd: {
            title: "Max Budget (USD)",
            description:
              "Maximum spend limit in USD for this run. Prevents runaway tool-use costs. Omit for no limit.",
          },
          systemPrompt: {
            title: "System Prompt",
            description:
              "Optional system prompt to prepend. Use to set persona, constraints, or context that applies to the entire session.",
          },
          allowedTools: {
            title: "Allowed Tools",
            description:
              "Comma-separated list of tools Claude Code may use (e.g. Read,Edit,Bash). Omit to allow all default tools.",
          },
          headless: {
            title: "Headless (batch mode)",
            description:
              "PREFER false (default). Headless:false opens a full interactive Claude Code session — Max can see output live and participate. Set to true only for fully automated batch tasks (cron jobs, pipelines) where no human interaction is needed and output must be returned as a value.",
          },
          timeoutMs: {
            title: "Timeout (ms)",
            description:
              "Maximum execution time in milliseconds. Defaults to 600000 (10 minutes). Increase for long-running tasks.",
          },
          output: {
            title: "Output",
            description: "Combined stdout from the Claude Code process.",
          },
          exitCode: {
            title: "Exit Code",
            description:
              "Process exit code. 0 = success, non-zero = error or partial failure.",
          },
          durationMs: {
            title: "Duration (ms)",
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
