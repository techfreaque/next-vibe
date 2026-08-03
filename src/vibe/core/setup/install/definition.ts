/**
 * Setup Install Definition
 * API endpoint definition for CLI global installation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { UserRole } from "../../../identity/roles/enum";
import { createEndpoint } from "../../definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../definition/enums";
import { CLI_BINARY_NAME } from "../../../platforms/cli/types/cli-target";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "../../../unified-ui/_shared/utils";
import { z } from "zod";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const SetupInstallWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SetupInstallWidget,
  })),
);

/**
 * Setup Install Endpoint Definition
 */
const { POST } = createEndpoint({
  title: `Install the ${CLI_BINARY_NAME} command`,
  titleShort: "Install CLI",
  description: `Install ${CLI_BINARY_NAME} as a global command so it runs from any directory, in this project or any other. Re-running reinstalls from scratch.`,
  icon: "download",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["Install"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["install", "setup", "update", "setup:update"],
  method: Methods.POST,
  path: ["vibe", "core", "setup", "install"],
  examples: {
    requests: {
      default: {
        verbose: false,
      },
      verbose: {
        verbose: true,
      },
    },
    responses: {
      default: {
        success: true,
        results: [
          {
            key: "src/vibe/platforms/cli",
            description: `the global ${CLI_BINARY_NAME} command`,
            summary: `binary installed at /usr/local/bin/${CLI_BINARY_NAME}`,
            ok: true,
          },
        ],
        message: "Operation completed successfully",
      },
      verbose: {
        success: true,
        results: [
          {
            key: "src/vibe/core/generators",
            description: "generated code",
            summary: "3 generator(s) ran, 12 unchanged",
            ok: true,
          },
          {
            key: "src/vibe/platforms/cli",
            description: `the global ${CLI_BINARY_NAME} command`,
            summary: `binary installed at /usr/local/bin/${CLI_BINARY_NAME}`,
            ok: true,
          },
          {
            key: "src/vibe/platforms/mcp",
            description:
              "MCP server config for Claude Code, Cursor and VS Code",
            summary: "wrote 3 MCP config file(s)",
            ok: true,
          },
        ],
        message: "Operation completed successfully",
      },
    },
  },

  fields: customWidgetObject({
    render: SetupInstallWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Verbose",
        description:
          "Report where the command was installed and whether PATH had to change.",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        label: "Success",
        schema: z.boolean(),
      }),

      // One entry per discovered setup.ts. Deliberately not CLI-specific:
      // installing the shim is just one setup among however many the project
      // declares, so this endpoint reports them all the same way.
      results: responseField({
        type: WidgetType.TEXT,
        label: "Setups",
        schema: z.array(
          z.object({
            key: z.string(),
            description: z.string(),
            summary: z.string(),
            ok: z.boolean(),
          }),
        ),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        label: "Result",
        schema: z.string().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Network Error",
      description: "Network error occurred",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Not Found",
      description: "Resource not found",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "Success",
    description: "Operation completed successfully",
  },
});

// Export types for repository usage - following migration guide pattern
export type InstallRequestInput = typeof POST.types.RequestInput;
export type InstallRequestOutput = typeof POST.types.RequestOutput;
export type InstallResponseInput = typeof POST.types.ResponseInput;
export type InstallResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
