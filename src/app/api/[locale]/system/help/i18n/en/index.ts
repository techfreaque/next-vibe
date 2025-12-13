export const translations = {
  category: "Help & Documentation",
  tag: "Help",
  interactive: {
    post: {
      title: "Interactive Mode",
      description: "Start interactive file explorer mode for navigating and executing routes",
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
