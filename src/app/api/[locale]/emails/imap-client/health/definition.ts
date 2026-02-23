/**
 * IMAP Health Monitoring API Route Definition
 * Defines endpoints for IMAP server health monitoring
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { ImapHealthStatus } from "../enum";
import { scopedTranslation } from "./i18n";
import { ImapHealthContainer } from "./widget";

/**
 * Get IMAP Health Status Endpoint (GET)
 * Retrieves current IMAP server health status and metrics
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "health"],
  allowedRoles: [UserRole.ADMIN],

  title: "health.get.title",
  description: "health.get.description",
  category: "category",
  icon: "activity",
  tags: ["tags.health", "tags.monitoring"],

  fields: customWidgetObject({
    render: ImapHealthContainer,
    usage: { response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === RESPONSE FIELDS ===
      accountsHealthy: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.accountsHealthy",
        schema: z.coerce.number().int(),
      }),
      accountsTotal: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.accountsTotal",
        schema: z.coerce.number().int(),
      }),
      connectionsActive: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.connectionsActive",
        schema: z.coerce.number().int(),
      }),
      connectionErrors: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.connectionErrors",
        schema: z.coerce.number().int(),
      }),
      lastSyncAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.lastSyncAt",
        schema: z.string().nullable(),
      }),
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "health.get.response.data.status",
        schema: z.enum(ImapHealthStatus),
      }),
      syncStats: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "health.get.response.data.syncStats.title",
        description: "health.get.response.data.syncStats.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          totalSyncs: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "health.get.response.data.syncStats.totalSyncs",
            schema: z.coerce.number().int(),
          }),
          lastSyncTime: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "health.get.response.data.syncStats.lastSyncTime",
            schema: z.string().nullable(),
          }),
        },
      }),
      serverStatus: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "health.get.response.data.serverStatus",
        schema: z.string(),
      }),
      uptime: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.uptime",
        schema: z.string(),
      }),
      syncedAccounts: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.syncedAccounts",
        schema: z.coerce.number().int(),
      }),
      totalAccounts: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.totalAccounts",
        schema: z.coerce.number().int(),
      }),
      activeConnections: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.activeConnections",
        schema: z.coerce.number().int(),
      }),
      avgResponseTime: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "health.get.response.data.performanceMetrics.avgResponseTime",
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "health.get.errors.unauthorized.title",
      description: "health.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "health.get.errors.validation.title",
      description: "health.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "health.get.errors.server.title",
      description: "health.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "health.get.errors.unknown.title",
      description: "health.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "health.get.errors.network.title",
      description: "health.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "health.get.errors.forbidden.title",
      description: "health.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "health.get.errors.notFound.title",
      description: "health.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "health.get.errors.unsavedChanges.title",
      description: "health.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "health.get.errors.conflict.title",
      description: "health.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "health.get.success.title",
    description: "health.get.success.description",
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
