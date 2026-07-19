/**
 * Setup Install Definition
 * API endpoint definition for CLI global installation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/core/setup/install/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";

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
  scopedTranslation,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "download",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["post.title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
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
            description: "vibe command",
            summary: "binary installed at /usr/local/bin/vibe",
            ok: true,
          },
        ],
        message: "installSuccessAt",
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
            description: "vibe command",
            summary: "binary installed at /usr/local/bin/vibe",
            ok: true,
          },
          {
            key: "src/vibe/platforms/mcp",
            description: "MCP config",
            summary: "wrote 3 MCP config file(s)",
            ok: true,
          },
        ],
        message: "installSuccessAt",
      },
    },
  },

  fields: customWidgetObject({
    render: SetupInstallWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.success.title",
        schema: z.boolean(),
      }),

      // One entry per discovered setup.ts. Deliberately not CLI-specific:
      // installing the shim is just one setup among however many the project
      // declares, so this endpoint reports them all the same way.
      results: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.array(
          z.object({
            key: z.string(),
            description: z.string(),
            summary: z.string(),
            ok: z.boolean(),
          }),
        ),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: translatedValueSchema,
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

// Export types for repository usage - following migration guide pattern
export type InstallRequestInput = typeof POST.types.RequestInput;
export type InstallRequestOutput = typeof POST.types.RequestOutput;
export type InstallResponseInput = typeof POST.types.ResponseInput;
export type InstallResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
