/**
 * CLI Stripe API Definition
 * Defines endpoints for Stripe CLI integration operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

/**
 * CLI Stripe Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "providers", "stripe", "cli"],
  title: "title" as const,
  description: "description" as const,
  category: "app.endpointCategories.payment",
  icon: "credit-card" as const,
  tags: ["tags.stripe" as const, "tags.cli" as const, "tags.webhook" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["stripe", "stripe-cli"],

  cli: {
    firstCliArgKey: "operation",
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "title" as const,
    description: "description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      operation: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.operation.label" as const,
        description: "fields.operation.description" as const,
        placeholder: "fields.operation.placeholder" as const,
        columns: 6,
        options: [
          {
            value: "check",
            label: "operations.check" as const,
          },
          {
            value: "install",
            label: "operations.install" as const,
          },
          {
            value: "listen",
            label: "operations.listen" as const,
          },
          {
            value: "login",
            label: "operations.login" as const,
          },
          {
            value: "status",
            label: "operations.status" as const,
          },
        ],
        schema: z.enum(["check", "install", "listen", "login", "status"]),
      }),

      port: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.port.label" as const,
        description: "fields.port.description" as const,
        placeholder: "fields.port.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      events: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.events.label" as const,
        description: "fields.events.description" as const,
        placeholder: "fields.events.placeholder" as const,
        columns: 12,
        options: [
          {
            value: "payment_intent.succeeded",
            label: "fields.events.paymentIntentSucceeded" as const,
          },
          {
            value: "payment_intent.payment_failed",
            label: "fields.events.paymentIntentFailed" as const,
          },
          {
            value: "customer.subscription.created",
            label: "fields.events.subscriptionCreated" as const,
          },
          {
            value: "customer.subscription.updated",
            label: "fields.events.subscriptionUpdated" as const,
          },
          {
            value: "invoice.payment_succeeded",
            label: "fields.events.invoicePaymentSucceeded" as const,
          },
          {
            value: "invoice.payment_failed",
            label: "fields.events.invoicePaymentFailed" as const,
          },
        ],
        schema: z.array(z.string()).optional(),
      }),

      forwardTo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.forwardTo.label" as const,
        description: "fields.forwardTo.description" as const,
        placeholder: "fields.forwardTo.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      skipSslVerify: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSslVerify.label" as const,
        description: "fields.skipSslVerify.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // RESPONSE FIELDS
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success" as const,
        schema: z.boolean(),
      }),

      installed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.installed" as const,
        schema: z.boolean().optional(),
      }),

      version: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.version" as const,
        schema: z.string().optional(),
      }),

      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status" as const,
        schema: z.string().optional(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.output" as const,
        schema: z.string().optional(),
      }),

      instructions: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.instructions" as const,
        schema: z.string().optional(),
      }),

      webhookEndpoint: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.webhookEndpoint" as const,
        schema: z.string().optional(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        operation: "status",
        port: 4242,
        events: ["payment_intent.succeeded", "customer.subscription.created"],
        forwardTo: "localhost:3000/api/webhooks/stripe",
        skipSslVerify: false,
      },
      check: {
        operation: "check",
      },
      listen: {
        operation: "listen",
        port: 4242,
        events: ["payment_intent.succeeded"],
        forwardTo: "localhost:3000/api/webhooks/stripe",
      },
    },
    responses: {
      default: {
        success: true,
        installed: true,
        version: "1.19.1",
        status: "ready",
        output: "Stripe CLI is installed and ready to use",
      },
      check: {
        success: true,
        installed: true,
        version: "1.19.1",
      },
      listen: {
        success: true,
        status: "listening",
        output: "Ready! Your webhook signing secret is whsec_...",
        webhookEndpoint: "https://webhook.stripe.com/listen",
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },
});

// Export types for repository
export type CliStripeRequestInput = typeof POST.types.RequestInput;
export type CliStripeRequestOutput = typeof POST.types.RequestOutput;
export type CliStripeResponseInput = typeof POST.types.ResponseInput;
export type CliStripeResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
