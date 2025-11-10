/**
 * Browser API translations (English)
 */

export const translations = {
  title: "Chrome DevTools MCP Tools",
  description:
    "Execute Chrome DevTools MCP tools for browser automation and debugging",
  category: "Core API",
  summary:
    "Access Chrome DevTools Protocol tools through MCP for web automation",
  tags: {
    browserAutomation: "Browser Automation",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "MCP Tools",
    webDebugging: "Web Debugging",
    performanceAnalysis: "Performance Analysis",
  },

  form: {
    label: "Browser Tool Execution",
    description:
      "Execute Chrome DevTools MCP tools for browser control and analysis",
    fields: {
      tool: {
        label: "Tool",
        description: "Select the Chrome DevTools MCP tool to execute",
        placeholder: "Choose a tool...",
      },
      arguments: {
        label: "Arguments",
        description: "JSON arguments for the selected tool (optional)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Click Element",
    drag: "Drag Element",
    fill: "Fill Input Field",
    fillForm: "Fill Form",
    handleDialog: "Handle Dialog",
    hover: "Hover Element",
    pressKey: "Press Key",
    uploadFile: "Upload File",

    // Navigation automation tools (6)
    closePage: "Close Page",
    listPages: "List Pages",
    navigatePage: "Navigate Page",
    newPage: "New Page",
    selectPage: "Select Page",
    waitFor: "Wait For",

    // Emulation tools (2)
    emulate: "Emulate Device",
    resizePage: "Resize Page",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analyze Performance Insight",
    performanceStartTrace: "Start Performance Trace",
    performanceStopTrace: "Stop Performance Trace",

    // Network tools (2)
    getNetworkRequest: "Get Network Request",
    listNetworkRequests: "List Network Requests",

    // Debugging tools (5)
    evaluateScript: "Evaluate Script",
    getConsoleMessage: "Get Console Message",
    listConsoleMessages: "List Console Messages",
    takeScreenshot: "Take Screenshot",
    takeSnapshot: "Take Snapshot",
  },

  status: {
    pending: "Pending",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
  },

  response: {
    success: "Tool executed successfully",
    result: "Execution result",
    status: "Current execution status",
    executionId: "Execution ID for tracking",
  },

  examples: {
    requests: {
      navigate: {
        title: "Navigate to URL",
        description: "Navigate browser to a specific URL",
      },
      screenshot: {
        title: "Take Screenshot",
        description: "Capture a screenshot of the current page",
      },
      click: {
        title: "Click Element",
        description: "Click on a specific element",
      },
      performance: {
        title: "Start Performance Trace",
        description: "Begin recording performance metrics",
      },
      script: {
        title: "Evaluate Script",
        description: "Execute JavaScript in the browser",
      },
    },
    responses: {
      navigate: {
        title: "Navigation Result",
        description: "Result of page navigation",
      },
      screenshot: {
        title: "Screenshot Result",
        description: "Screenshot capture result",
      },
      click: {
        title: "Click Result",
        description: "Element click result",
      },
      performance: {
        title: "Performance Trace Started",
        description: "Performance tracing initiated",
      },
      script: {
        title: "Script Evaluation Result",
        description: "JavaScript execution result",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Tool execution failed",
      description: "The selected tool could not be executed successfully",
    },
    invalidArguments: {
      title: "Invalid Arguments",
      description: "The provided arguments are not valid for this tool",
    },
    browserNotAvailable: {
      title: "Browser Not Available",
      description: "Chrome browser instance is not available",
    },
    toolNotFound: {
      title: "Tool Not Found",
      description: "The requested tool is not available",
    },
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      toolRequired: "Tool selection is required",
      argumentsInvalid: "Arguments must be valid JSON",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while executing the tool",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to execute browser tools",
    },
    forbidden: {
      title: "Forbidden",
      description: "Browser tool execution is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested browser tool was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during tool execution",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during tool execution",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while executing the tool",
    },
  },

  success: {
    title: "Tool Executed Successfully",
    description: "The browser tool was executed successfully",
  },

  repository: {
    execute: {
      start: "Starting browser tool execution",
      success: "Browser tool executed successfully",
      error: "Error executing browser tool",
    },
    mcp: {
      connect: {
        start: "Connecting to Chrome DevTools MCP server",
        success: "Connected to MCP server successfully",
        error: "Failed to connect to MCP server",
        failedToInitialize: "Failed to initialize Chrome DevTools MCP server",
      },
      tool: {
        call: {
          start: "Calling MCP tool",
          success: "MCP tool called successfully",
          error: "Error calling MCP tool",
          invalidJsonArguments: "Invalid JSON arguments",
          executionFailed: "Tool execution failed: {{error}}",
        },
      },
    },
  },
};
