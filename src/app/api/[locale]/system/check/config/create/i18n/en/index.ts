export const translations = {
  title: "Create Check Configuration",
  description:
    "Create check.config.ts with optional MCP config, VSCode settings, and rule configurations. Run without options for interactive setup.",
  category: "Development Tools",
  tag: "quality",

  fields: {
    createMcpConfig: {
      label: "Create MCP Config",
      description:
        "Create .mcp.json configuration file for Model Context Protocol integration",
    },
    updateVscodeSettings: {
      label: "Update VSCode Settings",
      description:
        "Update .vscode/settings.json with recommended ESLint and formatter settings",
    },
    updatePackageJson: {
      label: "Update package.json Scripts",
      description:
        "Add/update package.json scripts for check, lint, and typecheck commands",
    },
    enableReactRules: {
      label: "Enable React Rules",
      description:
        "Enable React-specific linting rules (react-hooks, jsx-a11y)",
    },
    enableNextjsRules: {
      label: "Enable Next.js Rules",
      description: "Enable Next.js-specific linting rules and configurations",
    },
    enableI18nRules: {
      label: "Enable i18n Rules",
      description:
        "Enable internationalization linting rules (eslint-plugin-i18next)",
    },
    jsxCapitalization: {
      label: "JSX Capitalization",
      description:
        "Enforce capitalization of JSX component names (react/jsx-pascal-case)",
    },
    enablePromiseRules: {
      label: "Enable Promise Rules",
      description:
        "Enable Promise best practices and async/await linting rules",
    },
    enableNodeRules: {
      label: "Enable Node.js Rules",
      description: "Enable Node.js-specific linting rules",
    },
    enableUnicornRules: {
      label: "Enable Unicorn Rules",
      description:
        "Enable modern JavaScript best practices (eslint-plugin-unicorn)",
    },
    enablePedanticRules: {
      label: "Enable Pedantic Rules",
      description:
        "Enable stricter/pedantic linting rules for higher code quality",
    },
    enableRestrictedSyntax: {
      label: "Enable Restricted Syntax",
      description: "Restrict usage of throw, unknown, and object types",
    },
    enableTsgo: {
      label: "Enable tsgo",
      description: "Use tsgo instead of tsc for faster type checking",
    },
    enableStrictTypes: {
      label: "Enable Strict Types",
      description: "Enable strict TypeScript type checking rules",
    },
    interactive: {
      label: "Interactive Mode",
      description:
        "Run in interactive mode and ask for each configuration option step by step",
    },
  },

  interactive: {
    welcome: "🔧 Interactive Configuration Setup",
    description:
      "Let's configure your code quality tools! Answer a few questions to customize your setup.",
    createMcpConfig: "Create MCP config (.mcp.json) for AI tool integration?",
    updateVscodeSettings:
      "Update VSCode settings (.vscode/settings.json) with recommended formatter settings?",
    updatePackageJson: "Update package.json scripts (check, lint, typecheck)?",
    enableReactRules: "Enable React-specific linting rules?",
    enableNextjsRules: "Enable Next.js-specific linting rules?",
    enableI18nRules: "Enable internationalization (i18n) linting rules?",
    jsxCapitalization: "Enforce JSX component name capitalization?",
    enablePromiseRules: "Enable Promise best practices rules?",
    enableNodeRules: "Enable Node.js-specific rules?",
    enableUnicornRules: "Enable modern JavaScript best practices (Unicorn)?",
    enablePedanticRules: "Enable stricter/pedantic rules?",
    enableRestrictedSyntax: "Restrict throw, unknown, and object types?",
    enableTsgo: "Use tsgo instead of tsc for type checking?",
    enableStrictTypes: "Enable strict TypeScript type checking?",
    creating: "Creating configuration files...",
  },

  steps: {
    creatingConfig: "Creating check.config.ts...",
    configCreated: "check.config.ts created successfully",
    creatingMcpConfig: "Creating .mcp.json...",
    mcpConfigCreated: ".mcp.json created successfully",
    updatingVscode: "Updating VSCode settings...",
    vscodeUpdated: "VSCode settings updated successfully",
    updatingPackageJson: "Updating package.json scripts...",
    packageJsonUpdated: "package.json scripts updated successfully",
  },

  warnings: {
    mcpConfigFailed: "Failed to create MCP config",
    vscodeFailed: "Failed to update VSCode settings",
    packageJsonFailed: "Failed to update package.json",
  },

  response: {
    message: "Configuration created",
  },

  success: {
    title: "Configuration Created",
    description: "Configuration files created successfully",
    complete: "✨ Configuration Complete!",
    configCreated: "✓ Created {{path}}",
    mcpConfigCreated: "✓ Created {{path}}",
    vscodeUpdated: "✓ Updated {{path}}",
    packageJsonUpdated: "✓ Updated {{path}}",
  },

  errors: {
    validation: {
      title: "Invalid Parameters",
      description: "The configuration parameters are invalid",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred during configuration",
    },
    conflict: {
      title: "Configuration Already Exists",
      description:
        "Configuration file already exists. Use --force to overwrite.",
    },
    configCreation: "Failed to create check.config.ts: {{error}}",
    unexpected: "An unexpected error occurred: {{error}}",
  },
};
