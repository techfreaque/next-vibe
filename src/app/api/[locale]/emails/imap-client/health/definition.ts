/**
 * IMAP Health Monitoring API Route Definition
 * Defines endpoints for IMAP server health monitoring
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { ImapHealthStatus } from "../enum";
import { ImapHealthContainer } from "./widget";

/**
 * Get IMAP Health Status Endpoint (GET)
 * Retrieves current IMAP server health status and metrics
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "health"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.emails.imapClient.health.health.get.title",
  description: "app.api.emails.imapClient.health.health.get.description",
  category: "app.api.emails.category",
  icon: "activity",
  tags: [
    "app.api.emails.imapClient.tags.health",
    "app.api.emails.imapClient.tags.monitoring",
  ],

  fields: customWidgetObject({
    render: ImapHealthContainer,
    usage: { response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === RESPONSE FIELDS ===
      accountsHealthy: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.accountsHealthy",
        schema: z.coerce.number().int(),
      }),
      accountsTotal: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.accountsTotal",
        schema: z.coerce.number().int(),
      }),
      connectionsActive: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.connectionsActive",
        schema: z.coerce.number().int(),
      }),
      connectionErrors: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.connectionErrors",
        schema: z.coerce.number().int(),
      }),
      lastSyncAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.lastSyncAt",
        schema: z.string().nullable(),
      }),
      status: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.imapClient.health.health.get.response.data.status",
        schema: z.enum(ImapHealthStatus),
      }),
      syncStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.imapClient.health.health.get.response.data.syncStats.title",
          description:
            "app.api.emails.imapClient.health.health.get.response.data.syncStats.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          totalSyncs: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.health.health.get.response.data.syncStats.totalSyncs",
            schema: z.coerce.number().int(),
          }),
          lastSyncTime: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.health.health.get.response.data.syncStats.lastSyncTime",
            schema: z.string().nullable(),
          }),
        },
      ),
      serverStatus: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.imapClient.health.health.get.response.data.serverStatus",
        schema: z.string(),
      }),
      uptime: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.uptime",
        schema: z.string(),
      }),
      syncedAccounts: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.syncedAccounts",
        schema: z.coerce.number().int(),
      }),
      totalAccounts: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.totalAccounts",
        schema: z.coerce.number().int(),
      }),
      activeConnections: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.activeConnections",
        schema: z.coerce.number().int(),
      }),
      avgResponseTime: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.health.health.get.response.data.performanceMetrics.avgResponseTime",
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.validation.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.health.health.get.errors.server.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.health.health.get.errors.unknown.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.health.health.get.errors.network.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.notFound.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.imapClient.health.health.get.errors.conflict.title",
      description:
        "app.api.emails.imapClient.health.health.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.health.health.get.success.title",
    description:
      "app.api.emails.imapClient.health.health.get.success.description",
  },

  examples: {
    responses: {
      default: {
        accountsHealthy: 5,
        accountsTotal: 8,
        connectionsActive: 12,
        connectionErrors: 1,
        lastSyncAt: "2023-12-01T10:32:15Z",
        status: ImapHealthStatus.HEALTHY,
        syncStats: {
          totalSyncs: 1250,
          lastSyncTime: "2023-12-01T10:32:15Z",
        },
        serverStatus: "healthy",
        uptime: "5d 12h 30m",
        syncedAccounts: 5,
        totalAccounts: 8,
        activeConnections: 12,
        avgResponseTime: 150.5,
      },
    },
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
} as const;
export default imapHealthEndpoints;
