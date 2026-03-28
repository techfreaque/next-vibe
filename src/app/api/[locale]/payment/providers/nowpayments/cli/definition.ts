import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "providers", "nowpayments", "cli"],
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bitcoin" as const,
  category: "endpointCategories.payments",
  tags: [
    "post.tags.nowpayments" as const,
    "post.tags.cli" as const,
    "post.tags.webhook" as const,
  ],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["nowpayments", "nowpayments-cli", "nowpayments-tunnel"],

  cli: {
    firstCliArgKey: "operation",
  },
  examples: {
    requests: {
      default: {
        operation: "status",
        port: 3000,
      },
      check: {
        operation: "check",
      },
      tunnel: {
        operation: "tunnel",
        port: 3000,
      },
    },
    responses: {
      default: {
        success: true,
        status: "Tunnel is running",
        tunnelUrl: "https://abc123.ngrok.io",
      },
      check: {
        success: true,
        installed: true,
        version: "3.5.0",
        status: "ngrok is installed and ready",
      },
      tunnel: {
        success: true,
        tunnelUrl: "https://abc123.ngrok.io",
        webhookUrl:
          "https://abc123.ngrok.io/api/en/payment/providers/nowpayments/webhook",
        instructions:
          "Set this webhook URL in NOWPayments dashboard: https://abc123.ngrok.io/api/en/payment/providers/nowpayments/webhook",
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      operation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.form.fields.operation.label" as const,
        description: "post.form.fields.operation.description" as const,
        placeholder: "post.form.fields.operation.placeholder" as const,
        columns: 6,
        options: [
          {
            value: "check",
            label: "post.operations.check" as const,
          },
          {
            value: "install",
            label: "post.operations.install" as const,
          },
          {
            value: "tunnel",
            label: "post.operations.tunnel" as const,
          },
          {
            value: "status",
            label: "post.operations.status" as const,
          },
        ],
        schema: z.enum(["check", "install", "tunnel", "status"]),
      }),
      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.form.fields.port.label" as const,
        description: "post.form.fields.port.description" as const,
        placeholder: "post.form.fields.port.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int().positive().default(3000),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.success" as const,
        schema: z.boolean().optional(),
      }),

      installed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.installed" as const,
        schema: z.boolean().optional(),
      }),

      version: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.version" as const,
        schema: z.string().optional(),
      }),

      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.status" as const,
        schema: z.string().optional(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.output" as const,
        schema: z.string().optional(),
      }),

      instructions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.instructions" as const,
        schema: z.string().optional(),
      }),

      tunnelUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.tunnelUrl" as const,
        schema: z.string().optional(),
      }),

      webhookUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.webhookUrl" as const,
        schema: z.string().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validationFailed.title" as const,
      description: "post.errors.validationFailed.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.networkError.title" as const,
      description: "post.errors.networkError.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.serverError.title" as const,
      description: "post.errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknownError.title" as const,
      description: "post.errors.unknownError.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type RequestSchema = typeof POST.types.RequestOutput;
export type ResponseSchema = typeof POST.types.ResponseOutput;

const endpoints = { POST } as const;
export default endpoints;
