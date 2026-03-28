/**
 * Config Create Command Endpoint Definition
 * Creates check.config.ts with optional MCP, VSCode, and rule configurations
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

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const ConfigCreateWidget = React.lazy(() =>
  import("./widget").then((m) => ({ default: m.ConfigCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "check", "config", "create"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["config-create", "create-config", "cc"],

  fields: customWidgetObject({
    render: ConfigCreateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      createMcpConfig: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.createMcpConfig.label",
        description: "fields.createMcpConfig.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      updateVscodeSettings: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.updateVscodeSettings.label",
        description: "fields.updateVscodeSettings.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      updatePackageJson: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.updatePackageJson.label",
        description: "fields.updatePackageJson.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      enableEslint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enableEslint.label",
        description: "fields.enableEslint.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      enableReactRules: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enableReactRules.label",
        description: "fields.enableReactRules.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableNextjsRules: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enableNextjsRules.label",
        description: "fields.enableNextjsRules.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableI18nRules: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enableI18nRules.label",
        description: "fields.enableI18nRules.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      jsxCapitalization: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.jsxCapitalization.label",
        description: "fields.jsxCapitalization.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enablePedanticRules: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enablePedanticRules.label",
        description: "fields.enablePedanticRules.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      enableRestrictedSyntax: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.enableRestrictedSyntax.label",
        description: "fields.enableRestrictedSyntax.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      interactive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.interactive.label",
        description: "fields.interactive.description",
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      // === RESPONSE FIELDS ===
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message",
        schema: z.string(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
