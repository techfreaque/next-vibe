export const translations = {
  category: "Agent",
  codingAgent: {
    tags: {
      tasks: "Tasks",
    },
    run: {
      post: {
        title: "Run Coding Agent",
        dynamicTitle: "Coding Agent: {{prompt}}",
        description:
          "Run a coding agent task. Batch mode (DEFAULT): runs headlessly and returns output. Interactive mode: opens a live terminal session - result is delivered back automatically when the session ends.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "The task or question to send to the coding agent. Be specific - include file paths, context, and expected output format.",
          },
          provider: {
            label: "Provider",
            description:
              "Which coding agent CLI to use. claude-code uses the Claude CLI; open-code uses the OpenCode CLI.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Model",
            description:
              "Model to use. For Claude Code: model ID (e.g. claude-sonnet-4-6). For OpenCode: provider/model (e.g. anthropic/claude-sonnet-4-6). Leave empty for default.",
          },
          taskTitle: {
            label: "Task Title",
            description:
              "Short title for archiving this task (e.g. 'Fix login bug'). Auto-generated from the prompt if omitted.",
          },
          interactiveMode: {
            label: "Interactive Mode",
            description:
              "false (DEFAULT): runs headlessly and returns all output when done. true: opens a terminal window for a live session - result is delivered back automatically when the session ends.",
          },
          output: {
            label: "Output",
            description:
              "Combined stdout from the coding agent process. Empty when task was escalated to background execution (result injected via wakeUp).",
          },
          durationMs: {
            label: "Duration (ms)",
            description: "Total wall-clock time the process ran.",
          },
          taskId: {
            label: "Task ID",
            description:
              "For interactive mode: the tracking task ID. The result is delivered back automatically. For batch mode: not present (result returned inline).",
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
            description: "Invalid request parameters - check prompt and fields",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required - admin role needed",
          },
          internal: {
            title: "Execution Failed",
            description:
              "Coding agent process failed to start or crashed unexpectedly",
          },
          internalExitCode: {
            title: "Execution Failed (exit {{exitCode}})",
            description:
              "Coding agent process exited with a non-zero exit code",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied - insufficient permissions",
          },
          notFound: {
            title: "Not Found",
            description: "Resource or working directory not found",
          },
          network: {
            title: "Network Error",
            description: "Network error communicating with coding agent",
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
            description: "Execution conflict - another session may be running",
          },
        },
        backButton: {
          label: "Back",
        },
        submitButton: {
          label: "Submit",
          loadingText: "Submitting...",
        },
        success: {
          title: "Coding Agent Completed",
          description:
            "Coding agent process finished successfully. If output is empty, result will arrive via thread injection.",
        },
        widget: {
          runningBatch: "Running...",
          runningInteractive: "Launching interactive terminal session...",
          escalated:
            "Running in background - result will be injected when complete.",
          taskIdLabel: "Task ID",
          outputLabel: "Output",
          interactiveSessionLaunched:
            "Interactive session launched in terminal.",
          copyOutput: "Copy",
          copied: "Copied!",
          interactive: "Interactive",
          emptyPromptHint: "Enter a prompt below to run the coding agent",
        },
      },
    },
  },
};
