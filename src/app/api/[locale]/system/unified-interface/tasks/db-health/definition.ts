/**
 * DB Health Check API Definition
 * POST endpoint to verify database connectivity (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";
import { DB_HEALTH_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "db-health"],
  aliases: [DB_HEALTH_ALIAS, "db-ping"],
  title: "dbHealth.post.title",
  description: "dbHealth.post.description",
  category: "endpointCategories.systemDatabase",
  icon: "database",
  tags: ["dbHealth.tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "dbHealth.post.container.title",
    description: "dbHealth.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      healthy: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.healthy",
        schema: z.boolean(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.status",
        schema: z.enum(["ok", "warning", "critical"]),
      }),
      dbResponseMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.dbResponseMs",
        schema: z.number(),
      }),
      memoryUsedPct: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.memoryUsedPct",
        schema: z.number(),
      }),
      heapUsedMb: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.heapUsedMb",
        schema: z.number(),
      }),
      rssMb: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.rssMb",
        schema: z.number(),
      }),
      diskUsedPct: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.diskUsedPct",
        schema: z.number().nullable(),
      }),
      uptimeHours: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.uptimeHours",
        schema: z.number(),
      }),
      warnings: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "dbHealth.post.response.warnings",
        schema: z.array(z.string()),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "dbHealth.post.errors.unauthorized.title",
      description: "dbHealth.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "dbHealth.post.errors.forbidden.title",
      description: "dbHealth.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "dbHealth.post.errors.server.title",
      description: "dbHealth.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "dbHealth.post.errors.unknown.title",
      description: "dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "dbHealth.post.errors.validation.title",
      description: "dbHealth.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "dbHealth.post.errors.unknown.title",
      description: "dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "dbHealth.post.errors.unknown.title",
      description: "dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "dbHealth.post.errors.unknown.title",
      description: "dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "dbHealth.post.errors.unknown.title",
      description: "dbHealth.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "dbHealth.post.success.title",
    description: "dbHealth.post.success.description",
  },

  examples: {
    responses: {
      default: {
        healthy: true,
        status: "ok",
        dbResponseMs: 4,
        memoryUsedPct: 42,
        heapUsedMb: 512,
        rssMb: 780,
        diskUsedPct: 38,
        uptimeHours: 72,
        warnings: [],
      },
    },
  },
});

export type DbHealthPostRequestOutput = typeof POST.types.RequestOutput;
export type DbHealthPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
