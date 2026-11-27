export const translations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Idle",
  running: "Running",
  completed: "Completed",
  interrupted: "Interrupted",
  failed: "Failed",
  "read-only": "Read only",
  "workspace-write": "Workspace write",
  "danger-full-access": "Full access",
  codingAgent: {
    tags: {
      tasks: "Tasks",
    },
    run: {
      post: {
        title: "Run Coding Agent",
        titleShort: "Coding Agent",
        dynamicTitle: "Coding Agent: {{prompt}}",
        description:
          "Run a coding agent task across Claude Code, OpenCode, Codex or Antigravity. Pass a name to persist and resume conversations with mid-turn steering, or set interactiveMode=true to open a live terminal session.",
        fields: {
          name: {
            label: "Agent Name",
            description:
              "Optional persistent agent name (1 to 40 letters, digits, dashes or underscores). Reusing the name resumes the conversation.",
          },
          prompt: {
            label: "Prompt",
            description:
              "The task or question to send to the coding agent. Include file paths, context and expected verification.",
          },
          promptFile: {
            label: "Prompt File",
            description:
              "Path to a brief file relative to the current working directory. Alternative to inline prompt.",
          },
          provider: {
            label: "Provider",
            description:
              "Which coding agent CLI to use: claude-code, open-code, codex or antigravity. Defaults to codex for new named agents and claude-code for unnamed runs.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Model",
            description:
              "Provider model ID. Leave empty for the provider default (Antigravity defaults to Gemini 4 Neon High; Codex defaults to gpt-6.2-sol).",
          },
          effort: {
            label: "Reasoning Effort",
            description:
              "Reasoning effort for Codex or Antigravity (e.g. low, medium, high).",
          },
          sandbox: {
            label: "Codex Sandbox",
            description:
              "Filesystem sandbox for Codex runs (read-only, workspace-write or danger-full-access).",
          },
          cwd: {
            label: "Working Directory",
            description:
              "Directory where the coding agent runs. Defaults to the current working directory.",
          },
          fresh: {
            label: "Start Fresh",
            description:
              "Start a new conversation instead of resuming the saved thread for this agent name.",
          },
          taskTitle: {
            label: "Task Title",
            description:
              "Short title for archiving this task (e.g. 'Fix login bug'). Auto-generated from the prompt if omitted.",
          },
          interactiveMode: {
            label: "Interactive Mode",
            description:
              "false (DEFAULT): runs headlessly and returns output when done. true: opens a terminal window for a live session and reports back when it ends.",
          },
          output: {
            label: "Output",
            description:
              "Final reply or combined stdout from the coding agent process. Empty when escalated to background execution.",
          },
          durationMs: {
            label: "Duration (ms)",
            description: "Total wall-clock time the process ran.",
          },
          threadId: {
            label: "Conversation ID",
            description:
              "Saved provider thread or session ID for resuming a named agent.",
          },
          status: {
            label: "Status",
            description: "Outcome of the persistent agent turn.",
          },
          taskId: {
            label: "Task ID",
            description:
              "For interactive mode: the tracking task ID. Result is delivered automatically when complete.",
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
            description:
              "Invalid request parameters. Check the agent name, prompt and options.",
          },
          unauthorized: {
            title: "Unauthorized",
            description:
              "Authentication required. Sign in with an admin account or provider CLI.",
          },
          internal: {
            title: "Execution Failed",
            description:
              "Coding agent process failed to start or crashed unexpectedly.",
          },
          binaryMissing: {
            title:
              "{{bin}} is not installed on this instance. Install it or pick another provider.",
            description:
              "The coding agent CLI binary was not found on this server's PATH.",
          },
          internalExitCode: {
            title: "Execution Failed (exit {{exitCode}})",
            description:
              "Coding agent process exited with a non-zero exit code.",
          },
          forbidden: {
            title: "Forbidden",
            description:
              "Access denied. Check permissions for the selected provider.",
          },
          notFound: {
            title: "Not Found",
            description:
              "Agent, brief file or working directory was not found.",
          },
          vibeCoderRedirect: {
            title: "Use ai-run with vibe-coder instead",
            description:
              "Coding agent is set to vibe-coder. Use the ai-run tool with the vibe-coder skill.",
          },
          network: {
            title: "Network Error",
            description: "Provider or coding agent is unavailable right now.",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred during execution.",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes conflict detected.",
          },
          conflict: {
            title: "Conflict",
            description:
              "Another session is already running under this name, or the saved thread uses a different provider.",
          },
          detail: "Coding agent operation failed: {{detail}}",
        },
        backButton: {
          label: "Back",
        },
        submitButton: {
          label: "Submit",
          loadingText: "Running...",
        },
        success: {
          title: "Coding Agent Completed",
          description:
            "Coding agent finished successfully. If output is empty, the result will arrive via thread injection.",
        },
        widget: {
          runningBatch: "Running...",
          runningInteractive: "Launching interactive terminal session...",
          escalated:
            "Running in background. The result will be injected when complete.",
          taskIdLabel: "Task ID",
          outputLabel: "Output",
          interactiveSessionLaunched:
            "Interactive session launched in terminal.",
          copyOutput: "Copy",
          copied: "Copied!",
          interactive: "Interactive",
          emptyPromptHint: "Enter a prompt below to run the coding agent",
          agentNamePlaceholder: "Agent name (optional)",
        },
      },
    },
    say: {
      post: {
        title: "Steer Coding Agent",
        titleShort: "Steer Agent",
        description:
          "Send a mid-turn steering message to a running Codex or Antigravity coding agent. Once a turn finishes, reuse the name with coding-agent to continue.",
        success: {
          title: "Message Delivered",
          description: "Steering message delivered to the running agent.",
        },
        fields: {
          message: {
            label: "Message",
            description: "Guidance to inject into the active turn.",
          },
          messageFile: {
            label: "Message File",
            description:
              "Path to a file containing the steering message, relative to the current working directory.",
          },
          delivered: {
            label: "Delivered",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Interrupt Coding Agent",
        titleShort: "Interrupt Agent",
        description:
          "Stop the active turn of a running Codex or Antigravity coding agent. Reuse the agent name later to resume.",
        success: {
          title: "Interrupt Requested",
          description: "Interrupt signal processed for the coding agent.",
        },
        fields: {
          interrupted: {
            label: "Interrupt Sent",
          },
          noInterrupt: {
            label: "No active turn",
          },
        },
      },
    },
    list: {
      post: {
        title: "List Coding Agents",
        titleShort: "List Agents",
        description:
          "List running and saved persistent coding agents. Pass a name to inspect one agent with its recent transcript tail and latest reply.",
        success: {
          title: "Agents Listed",
          description: "Loaded active and saved coding agents.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agents",
          },
          noAgents: {
            label: "No persistent coding agents yet.",
          },
          lines: {
            label: "Transcript Lines",
            description:
              "Number of trailing transcript lines to include when inspecting a single agent.",
          },
          tail: {
            label: "Recent Transcript",
          },
          emptyTail: {
            label: "The transcript is empty.",
          },
          lastMessage: {
            label: "Latest Reply",
          },
          lastError: {
            label: "Last Error",
          },
          startedAt: {
            label: "Started",
          },
          finishedAt: {
            label: "Finished",
          },
        },
      },
    },
  },
};
