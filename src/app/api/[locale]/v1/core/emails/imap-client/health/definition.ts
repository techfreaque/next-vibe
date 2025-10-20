/**
 * IMAP Health Monitoring API Route Definition
 * Defines endpoints for IMAP server health monitoring
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import type { TranslationKey } from "@/i18n/core/static-types";

import { UserRole } from "../../../user/user-roles/enum";
import { ImapHealthStatus } from "../enum";

/**
 * Get IMAP Health Status Endpoint (GET)
 * Retrieves current IMAP server health status and metrics
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "imap-client", "health"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.emails.imapClient.health.health.get.title",
  description:
    "app.api.v1.core.emails.imapClient.health.health.get.description",
  category: "app.api.v1.core.emails.imapClient.category",
  tags: [
    "app.api.v1.core.emails.imapClient.tags.health",
    "app.api.v1.core.emails.imapClient.tags.monitoring",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.health.health.get.form.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: undefined, response: true },
    {
      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.emails.imapClient.health.health.get.response.success",
        },
        z.boolean(),
      ),

      data: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.health.health.get.response.data.title",
          description:
            "app.api.v1.core.emails.imapClient.health.health.get.response.data.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          accountsHealthy: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.health.health.get.response.data.accountsHealthy",
            },
            z.number().int(),
          ),
          accountsTotal: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.health.health.get.response.data.accountsTotal",
            },
            z.number().int(),
          ),
          connectionsActive: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.health.health.get.response.data.connectionsActive",
            },
            z.number().int(),
          ),
          connectionErrors: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.health.health.get.response.data.connectionErrors",
            },
            z.number().int(),
          ),
          lastSyncAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.health.health.get.response.data.lastSyncAt",
            },
            z.string().nullable(),
          ),
          status: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.imapClient.health.health.get.response.data.status",
            },
            z.enum(ImapHealthStatus),
          ),
        },
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.health.health.get.response.message",
        },
        z.string() as z.ZodType<TranslationKey>,
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.network.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.notFound.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.conflict.title",
      description:
        "app.api.v1.core.emails.imapClient.health.health.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.emails.imapClient.health.health.get.success.title",
    description:
      "app.api.v1.core.emails.imapClient.health.health.get.success.description",
  },

  examples: {
    requests: undefined,
    responses: {
      default: {
        success: true,
        data: {
          accountsHealthy: 5,
          accountsTotal: 8,
          connectionsActive: 12,
          connectionErrors: 1,
          lastSyncAt: "2023-12-01T10:32:15Z",
          status: ImapHealthStatus.HEALTHY,
        },
        message:
          "app.api.v1.core.emails.imapClient.health.health.get.success.description",
      },
    },
    urlPathVariables: undefined,
  },
});

// Export types following migration guide pattern
export type ImapHealthRequestInput = typeof GET.types.RequestInput;
export type ImapHealthRequestOutput = typeof GET.types.RequestOutput;
export type ImapHealthResponseInput = typeof GET.types.ResponseInput;
export type ImapHealthResponseOutput = typeof GET.types.ResponseOutput;

// Additional type exports for repository compatibility
export type ImapHealthGetRequestOutput = typeof GET.types.RequestOutput;
export type ImapHealthGetResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions and types
 */
const imapHealthEndpoints = {
  GET,
};

export { GET };
export default imapHealthEndpoints;
