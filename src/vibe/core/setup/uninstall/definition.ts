/**
 * Setup Uninstall Definition
 * API endpoint definition for CLI global uninstallation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { UserRole } from "../../../identity/roles/enum";
import { CLI_BINARY_NAME } from "../../../platforms/cli/types/cli-target";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "../../../unified-ui/_shared/utils";
import { createEndpoint } from "../../definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../definition/enums";

const SetupUninstallWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SetupUninstallWidget })),
);

/**
 * Setup Uninstall Endpoint Definition
 */
const { POST } = createEndpoint({
  title: `Uninstall the ${CLI_BINARY_NAME} command`,
  titleShort: "Uninstall CLI",
  description: `Remove the global ${CLI_BINARY_NAME} command from every location the installer may have written it to. Leaves this project untouched.`,
  icon: "package",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["Uninstall"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["uninstall", "setup:uninstall"],
  method: Methods.POST,
  path: ["vibe", "core", "setup", "uninstall"],
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
            summary: "removed 1 binary shim(s)",
            ok: true,
          },
        ],
        message: "Operation completed successfully",
      },
      verbose: {
        success: true,
        results: [
          {
            key: "src/vibe/platforms/cli",
            description: `the global ${CLI_BINARY_NAME} command`,
            summary: "removed 1 binary shim(s)",
            ok: true,
          },
          {
            key: "src/vibe/platforms/mcp",
            description:
              "MCP server config for Claude Code, Cursor and VS Code",
            summary: "removed 3 MCP config file(s)",
            ok: true,
          },
        ],
        message: "Operation completed successfully",
      },
    },
  },

  fields: customWidgetObject({
    render: SetupUninstallWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "Verbose",
        description: "List every file that was removed.",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        label: "Success",
        schema: z.boolean(),
      }),

      // One entry per discovered setup.ts — the mirror of install.
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

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type UninstallRequestInput = typeof POST.types.RequestInput;
export type UninstallRequestOutput = typeof POST.types.RequestOutput;
export type UninstallResponseInput = typeof POST.types.ResponseInput;
export type UninstallResponseOutput = typeof POST.types.ResponseOutput;
