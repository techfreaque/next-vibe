/**
 * Public Feed API Definition
 * Enriched public thread feed with server-side aggregated stats
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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

import { scopedTranslation } from "./i18n";
import { PublicFeedContainer } from "./widget/widget";

export const {
  enum: FeedSortMode,
  options: FeedSortModeOptions,
  Value: FeedSortModeValue,
} = createEnumOptions(scopedTranslation, {
  HOT: "sortMode.hot",
  NEW: "sortMode.new",
  RISING: "sortMode.rising",
});

export const FeedSortModeDB = [
  FeedSortMode.HOT,
  FeedSortMode.NEW,
  FeedSortMode.RISING,
] as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "public-feed"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "globe",
  category: "app.endpointCategories.chat",
  tags: ["tags.publicFeed" as const],

  fields: customWidgetObject({
    render: PublicFeedContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      sortMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.sortMode.label" as const,
        description: "get.sortMode.description" as const,
        columns: 6,
        options: FeedSortModeOptions,
        schema: z.enum(FeedSortModeDB).optional().default(FeedSortMode.HOT),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(1),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.limit.label" as const,
        description: "get.limit.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label" as const,
        description: "get.search.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.items.item.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.id.content" as const,
              schema: z.uuid(),
            }),
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.threadTitle.content" as const,
              schema: z.string(),
            }),
            preview: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.preview.content" as const,
              schema: z.string().nullable(),
            }),
            folderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.folderId.content" as const,
              schema: z.uuid().nullable(),
            }),
            folderName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.folderName.content" as const,
              schema: z.string().nullable(),
            }),
            authorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.authorId.content" as const,
              schema: z.uuid().nullable(),
            }),
            authorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.authorName.content" as const,
              schema: z.string().nullable(),
            }),
            messageCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.messageCount.content" as const,
              schema: z.number().int().min(0),
            }),
            authorCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.authorCount.content" as const,
              schema: z.number().int().min(0),
            }),
            upvotes: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.upvotes.content" as const,
              schema: z.number().int().min(0),
            }),
            downvotes: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.downvotes.content" as const,
              schema: z.number().int().min(0),
            }),
            score: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.score.content" as const,
              schema: z.number().int(),
            }),
            modelNames: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.modelNames.content" as const,
              schema: z.array(z.string()),
            }),
            isStreaming: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.isStreaming.content" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.createdAt.content" as const,
              schema: z.date(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.updatedAt.content" as const,
              schema: z.date(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount.content" as const,
        schema: z.number().int().min(0),
      }),
      pageCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pageCount.content" as const,
        schema: z.number().int().min(0),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage.content" as const,
        schema: z.number().int().min(1),
      }),
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pageSize.content" as const,
        schema: z.number().int().min(1),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: { sortMode: FeedSortMode.HOT, page: 1, limit: 20 },
    },
    responses: {
      default: {
        items: [],
        totalCount: 0,
        pageCount: 0,
        currentPage: 1,
        pageSize: 20,
      },
    },
  },
});

export default { GET };

// Extract types
export type PublicFeedGetRequestInput = typeof GET.types.RequestInput;
export type PublicFeedGetRequestOutput = typeof GET.types.RequestOutput;
export type PublicFeedGetResponseInput = typeof GET.types.ResponseInput;
export type PublicFeedGetResponseOutput = typeof GET.types.ResponseOutput;
export type PublicFeedItem =
  PublicFeedGetResponseOutput["items"] extends (infer T)[] ? T : never;
