/**
 * Media Studio history (GET)
 * The visitor's generations across the Studio, chat and the /v1 API, newest
 * first, paginated. Guests see what their lead made; incognito chats stay in
 * the browser and are never listed.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { paginationField } from "next-vibe/unified-ui/widgets/containers/pagination/types";
import { z } from "zod";

import { CREATE_KINDS } from "@/_pages/create/_shared/create-kinds";

import { studioSettingsSchema } from "../settings";
import { MEDIA_HISTORY_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const MediaHistoryWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MediaHistoryWidget })),
);

const EXAMPLE_ITEM = {
  id: "5d0f6a3e-1c2b-4f5a-9e8d-7c6b5a4f3e2d",
  kind: "image" as const,
  title: "A lighthouse in a storm, oil painting",
  createdAt: "2026-11-20T18:30:00.000Z",
  status: "completed" as const,
  url: "storage://studio/lighthouse.png",
  transcript: null,
  credits: 0.7,
  model: "z-image-base",
  settings: {
    prompt: "A lighthouse in a storm, oil painting",
    model: "z-image-base",
  },
  source: "studio" as const,
  threadId: null,
  rootFolderId: null,
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "media-studio", "history"],
  aliases: [MEDIA_HISTORY_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "layers",
  category: "ai",
  subCategory: "Generation",
  tags: ["tags.studio", "tags.history"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
  options: {
    formOptions: { autoSubmit: true, debounceMs: 0 },
  },

  fields: customWidgetObject({
    render: MediaHistoryWidget,
    usage: { request: "data", response: true } as const,
    children: {
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.kind.label",
        description: "get.fields.kind.description",
        options: [],
        includeInCacheKey: true,
        schema: z.enum(CREATE_KINDS).optional(),
      }),
      cursor: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.cursor.label",
        description: "get.fields.cursor.description",
        hidden: true,
        schema: z.string().max(200).optional(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.id",
              schema: z.string(),
            }),
            kind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.kind",
              schema: z.enum(CREATE_KINDS),
            }),
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.title",
              schema: z.string(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.createdAt",
              schema: dateSchema,
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.status",
              schema: z.enum([
                "queued",
                "running",
                "saving",
                "completed",
                "failed",
              ]),
            }),
            url: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.url",
              schema: z.string().nullable(),
            }),
            transcript: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.transcript",
              schema: z.string().nullable(),
            }),
            credits: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.credits",
              schema: z.number().nullable(),
            }),
            model: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model",
              schema: z.string().nullable(),
            }),
            settings: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.settings",
              schema: studioSettingsSchema.nullable(),
            }),
            source: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.source",
              schema: z.enum(["studio", "chat", "api"]),
            }),
            threadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threadId",
              schema: z.string().nullable(),
            }),
            rootFolderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.rootFolderId",
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      nextCursor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.nextCursor",
        schema: z.string().nullable(),
      }),
      paginationInfo: paginationField({ order: 2 }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },
  examples: {
    requests: {
      default: { paginationInfo: { page: 1, limit: 12 } },
      images: { kind: "image", paginationInfo: { page: 1, limit: 12 } },
    },
    responses: {
      default: {
        items: [EXAMPLE_ITEM],
        nextCursor: null,
        paginationInfo: { totalCount: 1, pageCount: 1 },
      },
      images: {
        items: [EXAMPLE_ITEM],
        nextCursor: null,
        paginationInfo: { totalCount: 1, pageCount: 1 },
      },
    },
  },
});

export type MediaHistoryRequestOutput = typeof GET.types.RequestOutput;
export type MediaHistoryResponseOutput = typeof GET.types.ResponseOutput;
export type MediaHistoryItem = MediaHistoryResponseOutput["items"][number];

const mediaHistoryDefinitions = { GET } as const;
export default mediaHistoryDefinitions;
