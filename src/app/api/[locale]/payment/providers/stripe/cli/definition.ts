/**
 * CLI Stripe API Definition
 * Defines endpoints for Stripe CLI integration operations
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

import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * CLI Stripe Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["payment", "providers", "stripe", "cli"],
  title: "app.api.stripe.title" as const,
  description: "app.api.stripe.description" as const,
  category: "app.api.stripe.category" as const,
  tags: [
    "app.api.stripe.tags.stripe" as const,
    "app.api.stripe.tags.cli" as const,
    "app.api.stripe.tags.webhook" as const,
  ],
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.stripe.form.title" as const,
      description: "app.api.stripe.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.stripe.form.fields.operation.label" as const,
          description:
            "app.api.stripe.form.fields.operation.description" as const,
          placeholder:
            "app.api.stripe.form.fields.operation.placeholder" as const,
          columns: 6,
          options: [
            {
              value: "check",
              label: "app.api.stripe.operations.check" as const,
            },
            {
              value: "install",
              label: "app.api.stripe.operations.install" as const,
            },
            {
              value: "listen",
              label: "app.api.stripe.operations.listen" as const,
            },
            {
              value: "login",
              label: "app.api.stripe.operations.login" as const,
            },
            {
              value: "status",
              label: "app.api.stripe.operations.status" as const,
            },
          ],
        },
        z.enum(["check", "install", "listen", "login", "status"]),
      ),

      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.stripe.form.fields.port.label" as const,
          description: "app.api.stripe.form.fields.port.description" as const,
          placeholder: "app.api.stripe.form.fields.port.placeholder" as const,
          columns: 6,
        },
        z.number().optional(),
      ),

      events: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.stripe.form.fields.events.label" as const,
          description: "app.api.stripe.form.fields.events.description" as const,
          placeholder: "app.api.stripe.form.fields.events.placeholder" as const,
          columns: 12,
          options: [
            {
              value: "payment_intent.succeeded",
              label:
                "app.api.stripe.form.fields.events.paymentIntentSucceeded" as const,
            },
            {
              value: "payment_intent.payment_failed",
              label:
                "app.api.stripe.form.fields.events.paymentIntentFailed" as const,
            },
            {
              value: "customer.subscription.created",
              label:
                "app.api.stripe.form.fields.events.subscriptionCreated" as const,
            },
            {
              value: "customer.subscription.updated",
              label:
                "app.api.stripe.form.fields.events.subscriptionUpdated" as const,
            },
            {
              value: "invoice.payment_succeeded",
              label:
                "app.api.stripe.form.fields.events.invoicePaymentSucceeded" as const,
            },
            {
              value: "invoice.payment_failed",
              label:
                "app.api.stripe.form.fields.events.invoicePaymentFailed" as const,
            },
          ],
        },
        z.array(z.string()).optional(),
      ),

      forwardTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.stripe.form.fields.forwardTo.label" as const,
          description:
            "app.api.stripe.form.fields.forwardTo.description" as const,
          placeholder:
            "app.api.stripe.form.fields.forwardTo.placeholder" as const,
          columns: 6,
        },
        z.string().optional(),
      ),

      skipSslVerify: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.stripe.form.fields.skipSslVerify.label" as const,
          description:
            "app.api.stripe.form.fields.skipSslVerify.description" as const,
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.success" as const,
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.installed" as const,
        },
        z.boolean().optional(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.version" as const,
        },
        z.string().optional(),
      ),

      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.status" as const,
        },
        z.string().optional(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.output" as const,
        },
        z.string().optional(),
      ),

      instructions: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.instructions" as const,
        },
        z.string().optional(),
      ),

      webhookEndpoint: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.stripe.response.webhookEndpoint" as const,
        },
        z.string().optional(),
      ),
    },
  ),

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
    urlPathParams: undefined,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.stripe.errors.validation.title" as const,
      description: "app.api.stripe.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.stripe.errors.network.title" as const,
      description: "app.api.stripe.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.stripe.errors.unauthorized.title" as const,
      description: "app.api.stripe.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.stripe.errors.forbidden.title" as const,
      description: "app.api.stripe.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.stripe.errors.notFound.title" as const,
      description: "app.api.stripe.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.stripe.errors.serverError.title" as const,
      description: "app.api.stripe.errors.serverError.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.stripe.errors.unknown.title" as const,
      description: "app.api.stripe.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.stripe.errors.unsavedChanges.title" as const,
      description: "app.api.stripe.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.stripe.errors.conflict.title" as const,
      description: "app.api.stripe.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.stripe.success.title" as const,
    description: "app.api.stripe.success.description" as const,
  },
});

// Export types for repository
export type CliStripeRequestInput = typeof POST.types.RequestInput;
export type CliStripeRequestOutput = typeof POST.types.RequestOutput;
export type CliStripeResponseInput = typeof POST.types.ResponseInput;
export type CliStripeResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
