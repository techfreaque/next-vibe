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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["payment", "providers", "nowpayments", "cli"],
  title: "app.api.payment.providers.nowpayments.cli.post.title" as const,
  description:
    "app.api.payment.providers.nowpayments.cli.post.description" as const,
  category: "app.api.payment.providers.nowpayments.cli.post.category" as const,
  tags: [
    "app.api.payment.providers.nowpayments.cli.post.tags.nowpayments" as const,
    "app.api.payment.providers.nowpayments.cli.post.tags.cli" as const,
    "app.api.payment.providers.nowpayments.cli.post.tags.webhook" as const,
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
    urlPathParams: undefined,
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.payment.providers.nowpayments.cli.post.form.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.operation.label" as const,
          description:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.operation.description" as const,
          placeholder:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.operation.placeholder" as const,
          columns: 6,
          options: [
            {
              value: "check",
              label:
                "app.api.payment.providers.nowpayments.cli.post.operations.check" as const,
            },
            {
              value: "install",
              label:
                "app.api.payment.providers.nowpayments.cli.post.operations.install" as const,
            },
            {
              value: "tunnel",
              label:
                "app.api.payment.providers.nowpayments.cli.post.operations.tunnel" as const,
            },
            {
              value: "status",
              label:
                "app.api.payment.providers.nowpayments.cli.post.operations.status" as const,
            },
          ],
        },
        z.enum(["check", "install", "tunnel", "status"]),
      ),
      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.port.label" as const,
          description:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.port.description" as const,
          placeholder:
            "app.api.payment.providers.nowpayments.cli.post.form.fields.port.placeholder" as const,
          columns: 6,
        },
        z.coerce.number().int().positive().default(3000),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.success" as const,
        },
        z.boolean().optional(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.installed" as const,
        },
        z.boolean().optional(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.version" as const,
        },
        z.string().optional(),
      ),

      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.status" as const,
        },
        z.string().optional(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.output" as const,
        },
        z.string().optional(),
      ),

      instructions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.instructions" as const,
        },
        z.string().optional(),
      ),

      tunnelUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.tunnelUrl" as const,
        },
        z.string().optional(),
      ),

      webhookUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.payment.providers.nowpayments.cli.post.response.fields.webhookUrl" as const,
        },
        z.string().optional(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.validationFailed.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.validationFailed.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.networkError.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.networkError.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.unauthorized.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.forbidden.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.notFound.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.serverError.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.unknownError.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.unknownError.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.payment.providers.nowpayments.cli.post.errors.conflict.title" as const,
      description:
        "app.api.payment.providers.nowpayments.cli.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.payment.providers.nowpayments.cli.post.success.title" as const,
    description:
      "app.api.payment.providers.nowpayments.cli.post.success.description" as const,
  },
});

export type RequestSchema = typeof POST.types.RequestOutput;
export type ResponseSchema = typeof POST.types.ResponseOutput;

const endpoints = { POST } as const;
export default endpoints;
