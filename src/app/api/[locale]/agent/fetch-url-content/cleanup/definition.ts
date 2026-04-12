/**
 * URL Cache Cleanup Endpoint Definition
 * Deletes stale URL fetch cache files older than 7 days.
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

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "fetch-url-content", "cleanup"],
  aliases: ["fetch-url-cache-cleanup"],
  title: "cleanup.post.title" as const,
  description: "cleanup.post.description" as const,
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksCron",
  icon: "trash",
  tags: ["tags.content" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "cleanup.post.container.title" as const,
    description: "cleanup.post.container.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      deletedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "cleanup.post.response.deletedCount" as const,
        schema: z.number(),
      }),
      totalScanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "cleanup.post.response.totalScanned" as const,
        schema: z.number(),
      }),
      retentionDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "cleanup.post.response.retentionDays" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "cleanup.errors.server.title" as const,
      description: "cleanup.errors.server.description" as const,
    },
  },

  successTypes: {
    title: "cleanup.post.success.title" as const,
    description: "cleanup.post.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        deletedCount: 12,
        totalScanned: 47,
        retentionDays: 7,
      },
    },
  },
});

export type UrlCacheCleanupPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
