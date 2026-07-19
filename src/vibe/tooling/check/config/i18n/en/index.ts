export const translations = {
  title: "Create Check Configuration",
  description:
    "Create check.config.ts with optional MCP config, VSCode settings, and rule configurations. Run without options for interactive setup.",
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
    enableEslint: {
      label: "Enable ESLint",
      description:
        "Enable ESLint for rules not yet supported by Oxlint (import sorting, React hooks). Disable for maximum speed if you don't need these rules.",
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
    enablePedanticRules: {
      label: "Enable Pedantic Rules",
      description:
        "Enable stricter/pedantic linting rules for higher code quality",
    },
    enableRestrictedSyntax: {
      label: "Enable Restricted Syntax",
      description: "Restrict usage of throw, unknown, and object types",
    },
    interactive: {
      label: "Interactive Mode",
      description:
        "Run in interactive mode and ask for each configuration option step by step",
    },
  },

  steps: {
    creatingConfig: "Creating check.config.ts...",
  },

  warnings: {
    mcpConfigFailed: "Failed to create MCP config",
    vscodeFailed: "Failed to update VSCode settings",
    packageJsonFailed: "Failed to update package.json",
    packageJsonNotFound: "package.json not found in current directory",
  },

  response: {
    message: "Configuration created",
  },

  success: {
    title: "Configuration Created",
    description: "Configuration files created successfully",
  },

  errors: {
    generateConfigsFailed: "Failed to generate configs",
    generateVSCodeSettingsFailed: "Failed to generate VSCode settings",
    packageRootNotFound: "Package root not found",
    templateNotFound: "Template not found at {{path}}",
    createConfigFailed: "Failed to create check.config.ts",
    createMcpConfigFailed: "Failed to create .mcp.json",
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
