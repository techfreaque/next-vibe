/**
 * Config Create Command Endpoint Definition
 * Creates check.config.ts with optional MCP, VSCode, and rule configurations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "check", "config", "create"],
  title: "app.api.system.check.config.create.title",
  description: "app.api.system.check.config.create.description",
  category: "app.api.system.check.vibeCheck.category",
  tags: ["app.api.system.check.vibeCheck.tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["config-create"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.check.config.create.title",
      description: "app.api.system.check.config.create.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      createMcpConfig: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.createMcpConfig.label",
          description:
            "app.api.system.check.config.create.fields.createMcpConfig.description",
          columns: 6,
        },
        z.boolean().optional(),
      ),

      updateVscodeSettings: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.updateVscodeSettings.label",
          description:
            "app.api.system.check.config.create.fields.updateVscodeSettings.description",
          columns: 6,
        },
        z.boolean().optional(),
      ),

      updatePackageJson: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.updatePackageJson.label",
          description:
            "app.api.system.check.config.create.fields.updatePackageJson.description",
          columns: 6,
        },
        z.boolean().optional(),
      ),

      enableEslint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.config.create.fields.enableEslint.label",
          description:
            "app.api.system.check.config.create.fields.enableEslint.description",
          columns: 6,
        },
        z.boolean().optional(),
      ),

      enableReactRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.enableReactRules.label",
          description:
            "app.api.system.check.config.create.fields.enableReactRules.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      enableNextjsRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.enableNextjsRules.label",
          description:
            "app.api.system.check.config.create.fields.enableNextjsRules.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      enableI18nRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.enableI18nRules.label",
          description:
            "app.api.system.check.config.create.fields.enableI18nRules.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      jsxCapitalization: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.jsxCapitalization.label",
          description:
            "app.api.system.check.config.create.fields.jsxCapitalization.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      enablePedanticRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.enablePedanticRules.label",
          description:
            "app.api.system.check.config.create.fields.enablePedanticRules.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      enableRestrictedSyntax: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.system.check.config.create.fields.enableRestrictedSyntax.label",
          description:
            "app.api.system.check.config.create.fields.enableRestrictedSyntax.description",
          columns: 4,
        },
        z.boolean().optional(),
      ),

      interactive: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.config.create.fields.interactive.label",
          description:
            "app.api.system.check.config.create.fields.interactive.description",
          columns: 6,
        },
        z.boolean().optional().default(true),
      ),

      // === RESPONSE FIELDS ===
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.config.create.response.message",
        },
        z.string(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.check.config.create.errors.validation.title",
      description:
        "app.api.system.check.config.create.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.check.config.create.errors.internal.title",
      description:
        "app.api.system.check.config.create.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.check.config.create.errors.validation.title",
      description:
        "app.api.system.check.config.create.errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.check.config.create.errors.validation.title",
      description:
        "app.api.system.check.config.create.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.check.config.create.errors.validation.title",
      description:
        "app.api.system.check.config.create.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.check.config.create.errors.internal.title",
      description:
        "app.api.system.check.config.create.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.check.config.create.errors.internal.title",
      description:
        "app.api.system.check.config.create.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.check.config.create.errors.conflict.title",
      description:
        "app.api.system.check.config.create.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.check.config.create.errors.conflict.title",
      description:
        "app.api.system.check.config.create.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.check.config.create.success.title",
    description: "app.api.system.check.config.create.success.description",
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
