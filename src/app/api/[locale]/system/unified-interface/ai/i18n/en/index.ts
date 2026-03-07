export const translations = {
  executeTool: {
    post: {
      title: "Execute Tool",
      dynamicTitle: "Execute: {{toolName}}",
      description:
        "Execute any registered endpoint by name. Pass the tool's name and its input parameters. The target route enforces its own authentication — this endpoint is a universal dispatcher for MCP, AI agents, and automation.",
      container: {
        title: "Tool Execution",
        description: "Route name and input parameters",
      },
      fields: {
        toolName: {
          label: "Tool Name",
          description:
            "The registered tool name or alias to execute (e.g. 'agent_chat_characters_GET'). Use tool-help to discover available tools.",
          placeholder: "agent_chat_characters_GET",
        },
        input: {
          label: "Input",
          description:
            "Input parameters for the tool as a JSON object. URL path params (e.g. id) are automatically extracted from this object.",
        },
        instanceId: {
          label: "Instance ID",
          description:
            'Optional remote instance ID. When set, creates an async task on the remote instance instead of executing locally. Result will be {taskId, status:"pending"}.',
        },
        callbackMode: {
          label: "Callback Mode",
          description:
            'How to handle the async result. "wait": poll until done (default for fast tools), "task-done": return taskId immediately, "inject": stream result into the current thread.',
        },
      },
      response: {
        result:
          "The result data returned by the target route. On failure this field is absent — the response itself will be an error.",
        resultLabel: "Result",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "toolName or input parameters are invalid",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to call this endpoint",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Tool Not Found",
          description: "No registered tool matches the given toolName",
        },
        server: {
          title: "Execution Error",
          description: "The target route encountered a server error",
        },
        network: {
          title: "Network Error",
          description: "Network error during tool execution",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred during execution",
        },
      },
      success: {
        title: "Tool Executed",
        description: "The tool was executed successfully",
      },
      widget: {
        enterToolName: "Enter a tool name to load its form.",
        resolving: "Resolving endpoint…",
        unknownTool: "Unknown tool: {{toolName}}",
      },
    },
  },
  tools: {
    // Translations moved to system/help/get — see system/help/i18n/en/index.ts
    get: {
      title: "Tool Help — Discover Available Tools",
      description:
        "Search and discover all AI tools available to you. Use query to search by name, description, or alias. Use category to filter by tool category. Returns tool names, descriptions, aliases, and metadata.",
      category: "AI Tools",
      tags: {
        tools: "tools",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Tool not found: {{toolName}}",
      parameterValidationFailed: "Parameter validation failed: {{errors}}",
      executionFailed: "Tool execution failed",
    },
  },
  factory: {
    errors: {
      executionFailed: "Tool execution failed",
    },
    descriptions: {
      noParametersRequired: "No parameters required for this endpoint",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nExample: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpoint for ",
      hiddenPlaceholder: "[hidden]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Tool registry initialization failed",
    },
  },
};
