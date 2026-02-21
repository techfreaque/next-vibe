export const translations = {
  category: "Help & Documentation",
  tag: "Help",
  get: {
    title: "Tool Help — Discover Available Tools",
    description:
      "Search and discover all tools available to you. Use query to search by name, description, or alias. Use category to filter by category. Returns tool names, descriptions, aliases, and metadata.",
    tags: {
      tools: "tools",
    },
    fields: {
      query: {
        label: "Search Query",
        description:
          "Search tools by name, description, alias, or tag (case-insensitive). Searches across all locales.",
        placeholder: "e.g. search, memory, fetch...",
      },
      category: {
        label: "Category Filter",
        description: "Filter tools by category name (case-insensitive)",
      },
      toolName: {
        label: "Tool Name (Detail)",
        description:
          "Get full details for a specific tool by name or alias. Returns parameter schema.",
      },
      page: {
        label: "Page",
        description: "Page number for paginated results (default: 1)",
        title: "Current page number",
      },
      pageSize: {
        label: "Page Size",
        description:
          "Number of results per page. AI/MCP default: 25. Web/CLI default: 200. Max: 500.",
        title: "Effective page size",
      },
      tools: {
        title: "Available Tools",
      },
      totalCount: {
        title: "Total tool count",
      },
      matchedCount: {
        title: "Matched tool count",
      },
      categories: {
        title: "Tool categories",
      },
      hint: {
        title: "Usage hint",
      },
      currentPage: {
        title: "Current page",
      },
      effectivePageSize: {
        title: "Effective page size",
      },
      totalPages: {
        title: "Total pages",
      },
      parameters: {
        title: "Parameters",
      },
      aliases: {
        title: "Aliases",
      },
      openTool: {
        label: "Open Tool",
      },
    },
    success: {
      title: "Tools fetched successfully",
      description: "Available tools retrieved",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access tools",
      },
      notFound: {
        title: "Not Found",
        description: "Tools endpoint not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to fetch tools",
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
        description: "A conflict occurred while fetching tools",
      },
    },
  },
  interactive: {
    post: {
      title: "Interactive Mode",
      description:
        "Start interactive file explorer mode for navigating and executing routes",
      category: "System Help",
      tags: {
        system: "system",
        help: "help",
      },
      summary: "Start interactive mode",
    },
    ui: {
      title: "Interactive API Explorer",
      description: "Browse and execute all",
      availableEndpoints: "available endpoints",
      endpointsLabel: "Endpoints",
      aliasesLabel: "Aliases:",
      selectEndpoint: "Select an endpoint from the list to get started",
    },
    response: {
      started: "Interactive mode started successfully",
    },
    errors: {
      cliOnly: {
        title: "CLI Only",
        description: "Interactive mode is only available from CLI",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for interactive mode",
      },
      server: {
        title: "Server Error",
        description: "Failed to start interactive mode",
      },
    },
    success: {
      title: "Success",
      description: "Interactive mode started successfully",
    },
    grouping: {
      category: "Category",
      tags: "Tags",
      path: "Path",
    },
  },
  post: {
    title: "Show Help Information",
    description: "Display help information about CLI commands",
    form: {
      title: "Help Options",
      description: "Get help for specific commands or general usage",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid help command parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to fetch help information",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to view help",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view help",
      },
      notFound: {
        title: "Command Not Found",
        description: "The specified command was not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to generate help information",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while generating help",
      },
      conflict: {
        title: "Conflict",
        description: "Help generation conflict detected",
      },
    },
    success: {
      title: "Help Generated",
      description: "Successfully generated help information",
    },
  },
  fields: {
    command: {
      label: "Command",
      description:
        "Specific command to get help for (leave empty for general help)",
      placeholder: "e.g., check, list, db:ping",
    },
    header: {
      title: "Header",
      description: "Header Description",
    },
    title: {
      label: "Title",
    },
    description: {
      label: "Description",
    },
    usage: {
      title: "Usage",
      patterns: {
        item: "Pattern",
      },
    },
    commonCommands: {
      title: "Common Commands",
      items: "Commands",
      command: "Command",
      description: "Description",
    },
    options: {
      title: "Options",
      items: "Options",
      flag: "Flag",
      description: "Description",
    },
    examples: {
      title: "Examples",
      items: "Examples",
      command: "Command",
      description: "Description",
    },
    details: {
      title: "Details",
      category: {
        content: "Category",
      },
      path: {
        content: "Path",
      },
      method: {
        content: "Method",
      },
      aliases: {
        content: "Aliases",
      },
    },
  },
  list: {
    post: {
      title: "List Available Commands",
      description:
        "Show all available CLI commands with their descriptions and aliases",
      form: {
        title: "Command List Options",
        description: "Configure how commands are displayed",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid list command parameters",
        },
        network: {
          title: "Network Error",
          description: "Failed to fetch command list",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to list commands",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to list commands",
        },
        notFound: {
          title: "Not Found",
          description: "Command list not found",
        },
        server: {
          title: "Server Error",
          description: "Failed to generate command list",
          errorLoading: "Error loading commands: {{error}}",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while listing commands",
        },
        conflict: {
          title: "Conflict",
          description: "Command list conflict detected",
        },
      },
      success: {
        title: "Commands Listed",
        description: "Successfully retrieved command list",
      },
    },
    tag: "Help",
    fields: {
      category: {
        label: "Filter by Category",
        description: "Show only commands in this category",
        placeholder: "e.g., system, database, user",
      },
      format: {
        label: "Output Format",
        description: "How to display the command list",
        options: {
          tree: "Tree View (nested hierarchy)",
          flat: "Flat List (simple listing)",
          json: "JSON Format (for parsing)",
        },
      },
      showAliases: {
        label: "Show Aliases",
        description: "Display all available command aliases",
      },
      showDescriptions: {
        label: "Show Descriptions",
        description: "Include command descriptions in the output",
      },
      success: {
        label: "Success",
      },
      totalCommands: {
        label: "Total Commands",
        description: "Number of available commands",
      },
      commandsText: {
        label: "Available Commands",
        description: "Formatted list of all available commands",
      },
      commands: {
        alias: "Command Alias",
        message: "Command Message",
        description: "Command Description",
        category: "Command Category",
        aliases: "Command Aliases",
        rule: "Command Rule",
      },
    },
    response: {
      commands: {
        title: "Available Commands",
        emptyState: {
          description: "No commands found",
        },
        alias: "Command",
        path: "API Path",
        method: "HTTP Method",
        category: "Category",
        description: "Description",
        aliases: "Aliases",
      },
    },
  },
};
