/**
 * Geo IP update (POST, admin + cron): keeps the offline DB-IP country table
 * current and resolves the visitor country of leads that have none yet.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { GeoUpdateStatus, GeoUpdateStatusOptions } from "../enum";
import { scopedTranslation } from "../i18n";
import { GEO_UPDATE_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "geo", "update"],
  aliases: [GEO_UPDATE_ALIAS],
  title: "update.post.title",
  titleShort: "update.post.titleShort",
  description: "update.post.description",
  category: "leads",
  subCategory: "Analytics",
  icon: "globe",
  tags: ["update.post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "update.post.container.title",
    description: "update.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "update.post.fields.force.label",
        description: "update.post.fields.force.description",
        columns: 12,
        schema: z.boolean().default(false),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "update.post.response.status",
        enumOptions: GeoUpdateStatusOptions,
        schema: z.enum(GeoUpdateStatus),
      }),
      version: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "update.post.response.version",
        schema: z.string().nullable(),
      }),
      v4Ranges: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "update.post.response.v4Ranges",
        schema: z.number(),
      }),
      v6Ranges: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "update.post.response.v6Ranges",
        schema: z.number(),
      }),
      backfilled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "update.post.response.backfilled",
        schema: z.number(),
      }),
      unresolved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "update.post.response.unresolved",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "update.post.errors.unauthorized.title",
      description: "update.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "update.post.errors.forbidden.title",
      description: "update.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "update.post.errors.server.title",
      description: "update.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "update.post.errors.unknown.title",
      description: "update.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.post.errors.validation.title",
      description: "update.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "update.post.errors.network.title",
      description: "update.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "update.post.errors.unknown.title",
      description: "update.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "update.post.errors.unknown.title",
      description: "update.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "update.post.errors.unknown.title",
      description: "update.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "update.post.success.title",
    description: "update.post.success.description",
  },

  examples: {
    requests: { default: { force: false } },
    responses: {
      default: {
        status: GeoUpdateStatus.CURRENT,
        version: "2026-11",
        v4Ranges: 362998,
        v6Ranges: 369662,
        backfilled: 2000,
        unresolved: 41000,
      },
    },
  },
});

export type GeoUpdatePostRequestOutput = typeof POST.types.RequestOutput;
export type GeoUpdatePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
