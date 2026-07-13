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
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/cli/setup/install/i18n";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { lazyWidget } from "../../../../unified-ui/_shared/lazy-widget";

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
  path: ["vibe", "platforms", "cli", "setup", "install"],
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
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message: "installSuccessAt",
        output: "installSuccess",
      },
      verbose: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message: "installSuccessAt",
        output: "installSuccess",
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

      installed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.boolean(),
      }),

      version: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.description",
        schema: z.string().optional(),
      }),

      path: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.string().optional(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: translatedValueSchema,
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.string().optional(),
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
