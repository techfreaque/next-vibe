/**
 * Setup Install Definition
 * API endpoint definition for CLI global installation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import React from "react";

import { UserRole } from "../../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const SetupInstallWidget = React.lazy(() =>
  import("./widget").then((m) => ({ default: m.SetupInstallWidget })),
);

/**
 * Setup Install Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "post.title",
  description: "post.description",
  icon: "download",
  category: "endpointCategories.interfaces",
  subCategory: "endpointCategories.interfacesCli",
  tags: ["post.title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["install", "setup"],
  method: Methods.POST,
  path: ["system", "unified-interface", "cli", "setup", "install"],
  examples: {
    requests: {
      default: {
        force: false,
        verbose: false,
      },
      force: {
        force: true,
        verbose: false,
      },
      verbose: {
        force: false,
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
      force: {
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
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

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
        content: "post.success.title",
        schema: z.boolean(),
      }),

      installed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.boolean(),
      }),

      version: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.description",
        schema: z.string().optional(),
      }),

      path: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.string().optional(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.string(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
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
