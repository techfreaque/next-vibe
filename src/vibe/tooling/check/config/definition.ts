/**
 * Config Create Command Endpoint Definition
 * Creates check.config.ts with optional MCP, VSCode, and rule configurations
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "../../../unified-ui/_shared/utils";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const ConfigCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ConfigCreateWidget,
  })),
);

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["vibe", "tooling", "check", "config"],
  title: "Create Check Configuration",
  titleShort: "Create Check Configuration",
  description:
    "Create check.config.ts with optional MCP config, VSCode settings, and rule configurations. Run without options for interactive setup.",
  category: "devTools",
  subCategory: "Check",
  tags: ["quality"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
  ],
  aliases: ["config", "config-create", "create-config", "cc"],

  fields: customWidgetObject({
    render: ConfigCreateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      createMcpConfig: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Create MCP Config",
        description:
          "Create .mcp.json configuration file for Model Context Protocol integration",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      updateVscodeSettings: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Update VSCode Settings",
        description:
          "Update .vscode/settings.json with recommended ESLint and formatter settings",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      updatePackageJson: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Update package.json Scripts",
        description:
          "Add/update package.json scripts for check, lint, and typecheck commands",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      enableEslint: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable ESLint",
        description:
          "Enable ESLint for rules not yet supported by Oxlint (import sorting, React hooks). Disable for maximum speed if you don't need these rules.",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      enableReactRules: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable React Rules",
        description:
          "Enable React-specific linting rules (react-hooks, jsx-a11y)",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableNextjsRules: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable Next.js Rules",
        description: "Enable Next.js-specific linting rules and configurations",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableI18nRules: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable i18n Rules",
        description:
          "Enable internationalization linting rules (eslint-plugin-i18next)",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      jsxCapitalization: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "JSX Capitalization",
        description:
          "Enforce capitalization of JSX component names (react/jsx-pascal-case)",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enablePedanticRules: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable Pedantic Rules",
        description:
          "Enable stricter/pedantic linting rules for higher code quality",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableRestrictedSyntax: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Enable Restricted Syntax",
        description: "Restrict usage of throw, unknown, and object types",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      interactive: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Interactive Mode",
        description:
          "Run in interactive mode and ask for each configuration option step by step",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      // === RESPONSE FIELDS ===
      message: responseField({
        type: WidgetType.TEXT,
        label: "Configuration created",
        schema: z.string(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Invalid Parameters",
      description: "The configuration parameters are invalid",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Internal Error",
      description: "An internal error occurred during configuration",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Invalid Parameters",
      description: "The configuration parameters are invalid",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Invalid Parameters",
      description: "The configuration parameters are invalid",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Invalid Parameters",
      description: "The configuration parameters are invalid",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Internal Error",
      description: "An internal error occurred during configuration",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Internal Error",
      description: "An internal error occurred during configuration",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Configuration Already Exists",
      description:
        "Configuration file already exists. Use --force to overwrite.",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Configuration Already Exists",
      description:
        "Configuration file already exists. Use --force to overwrite.",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "Configuration Created",
    description: "Configuration files created successfully",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        createMcpConfig: true,
        updateVscodeSettings: true,
        enableReactRules: true,
        enableNextjsRules: true,
        enableI18nRules: true,
        jsxCapitalization: false,
        interactive: false,
      },
      interactive: {
        interactive: true,
      },
    },
    responses: {
      default: {
        message:
          "✓ Created /home/user/project/check.config.ts\n✓ Created /home/user/project/.mcp.json\n✓ Updated /home/user/project/.vscode/settings.json",
      },
      interactive: {
        message: "✓ Created /home/user/project/check.config.ts",
      },
    },
  },
});

export type ConfigCreateRequestInput = typeof POST.types.RequestInput;
export type ConfigCreateRequestOutput = typeof POST.types.RequestOutput;
export type ConfigCreateResponseInput = typeof POST.types.ResponseInput;
export type ConfigCreateResponseOutput = typeof POST.types.ResponseOutput;

const configCreateEndpoints = { POST };
export default configCreateEndpoints;
