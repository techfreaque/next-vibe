export const translations = {
  tools: {
    category: "MCP Tools",
    tags: {
      mcp: "MCP",
        },
    get: {
      title: "List MCP Tools",
      description: "Get all available MCP tools for current user",
      fields: {
        name: "Tool Name",
        description: "Description",
        inputSchema: "Input Schema",
          },
      response: {
        title: "MCP Tools List",
        description: "List of available MCP tools",
          },
      errors: {
        validation: {
          title: "Validation Failed",
          description: "Invalid request parameters",
            },
        network: {
          title: "Network Error",
          description: "Failed to connect to server",
            },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
            },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to access this resource",
            },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
            },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
            },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
            },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
            },
        conflict: {
          title: "Conflict",
          description: "Resource conflict detected",
            },
          },
      success: {
        title: "Success",
        description: "Tools retrieved successfully",
          },
        },
      },
  execute: {
    category: "MCP Execute",
    tags: {
      mcp: "MCP",
        },
    post: {
      title: "Execute MCP Tool",
      description: "Execute an MCP tool by name with arguments",
      fields: {
        title: "Tool Execution Parameters",
        description: "Parameters for tool execution",
        name: {
          title: "Tool Name",
          description:
            "Name of the tool to execute (e.g., core:system:db:ping)",
            },
        arguments: {
          title: "Arguments",
          description: "Tool arguments as key-value pairs",
            },
          },
      response: {
        title: "Tool Execution Result",
        description: "Result of tool execution",
        content: {
          type: "Content Type",
          text: "Content",
            },
          },
      errors: {
        validation: {
          title: "Validation Failed",
          description: "Invalid tool name or arguments",
            },
        network: {
          title: "Network Error",
          description: "Failed to connect to server",
            },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
            },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to execute this tool",
            },
        notFound: {
          title: "Tool Not Found",
          description: "The specified tool does not exist",
            },
        server: {
          title: "Server Error",
          description: "Tool execution failed",
            },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
            },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
            },
        conflict: {
          title: "Conflict",
          description: "Resource conflict detected",
            },
          },
      success: {
        title: "Success",
        description: "Tool executed successfully",
          },
        },
      },
  registry: {
    toolNotFound: "Tool not found",
    endpointNotFound: "Endpoint not found",
    permissionDenied: "Permission denied",
    toolExecutionFailed: "Tool execution failed",
      },
};
