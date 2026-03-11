/**
 * Thread Share Links API Definition
 * Defines endpoints for creating and managing share links for threads
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  responseArrayOptionalField,
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

/**
 * GET endpoint - List all share links for a thread
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "share",
  category: "app.endpointCategories.chat",
  tags: ["tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      shareLinks: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        emptyTitle: "shareLinks.emptyTitle" as const,
        emptyDescription: "shareLinks.emptyDescription" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "empty" as const,
              order: 999,
              schema: z.string().uuid(),
            }),
            token: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "empty" as const,
              order: 999,
              schema: z.string(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "shareLink.label" as const,
              order: 1,
              schema: z.string().nullable(),
            }),
            shareUrl: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "shareLink.shareUrl" as const,
              order: 2,
              schema: z.string(),
            }),
            active: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "shareLink.active" as const,
              variant: "default" as const,
              order: 3,
              schema: z.boolean(),
            }),
            allowPosting: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "shareLink.allowPosting" as const,
              variant: "info" as const,
              order: 4,
              schema: z.boolean(),
            }),
            requireAuth: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "shareLink.requireAuth" as const,
              variant: "info" as const,
              order: 5,
              schema: z.boolean(),
            }),
            accessCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "shareLink.accessCount" as const,
              order: 6,
              schema: z.number(),
            }),
            lastAccessedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "shareLink.lastAccessedAt" as const,
              order: 7,
              schema: dateSchema.nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "shareLink.createdAt" as const,
              order: 8,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

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

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
      } as const,
    },
    responses: {
      default: {
        shareLinks: [],
      } as const,
    },
  },
});

/**
 * POST endpoint - Create a new share link
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "app.endpointCategories.chat",
  tags: ["tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      label: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "label.label" as const,
        description: "label.description" as const,
        placeholder: "label.placeholder" as const,
        schema: z.string().nullable().optional(),
      }),
      allowPosting: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "allowPosting.label" as const,
        description: "allowPosting.description" as const,
        schema: z.boolean().default(false),
      }),
      requireAuth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "requireAuth.label" as const,
        description: "requireAuth.description" as const,
        schema: z.boolean().default(false),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string().uuid(),
      }),
      token: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
      } as const,
    },
    requests: {
      default: {
        label: "My Share Link",
        allowPosting: false,
        requireAuth: false,
      } as const,
    },
    responses: {
      default: {
        label: "My Share Link",
        allowPosting: false,
        requireAuth: false,
        id: "123e4567-e89b-12d3-a456-426614174001",
        token: "abc123xyz",
      } as const,
    },
  },
});

/**
 * PATCH endpoint - Update an existing share link
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "edit",
  category: "app.endpointCategories.chat",
  tags: ["tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      linkId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "linkId.label" as const,
        schema: z.string().uuid(),
      }),
      label: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "label.label" as const,
        description: "label.description" as const,
        placeholder: "label.placeholder" as const,
        schema: z.string().nullable().optional(),
      }),
      allowPosting: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "allowPosting.label" as const,
        description: "allowPosting.description" as const,
        schema: z.boolean().default(false),
      }),
      requireAuth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "requireAuth.label" as const,
        description: "requireAuth.description" as const,
        schema: z.boolean().default(false),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string().uuid(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
      } as const,
    },
    requests: {
      default: {
        linkId: "123e4567-e89b-12d3-a456-426614174001",
        label: "Updated Label",
        allowPosting: true,
        requireAuth: true,
      } as const,
    },
    responses: {
      default: {
        label: "Updated Label",
        allowPosting: true,
        requireAuth: true,
        id: "123e4567-e89b-12d3-a456-426614174001",
      } as const,
    },
  },
});

/**
 * DELETE endpoint - Revoke a share link
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "app.endpointCategories.chat",
  tags: ["tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      linkId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "linkId.label" as const,
        schema: z.string().uuid(),
      }),
      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string().uuid(),
      }),
      token: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.string().nullable(),
      }),
      allowPosting: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.boolean(),
      }),
      requireAuth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: z.boolean(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "empty" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
      } as const,
    },
    requests: {
      default: {
        linkId: "123e4567-e89b-12d3-a456-426614174001",
      } as const,
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174001",
        token: "abc123def456",
        label: "Public share",
        allowPosting: false,
        requireAuth: false,
        createdAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

export type ShareLinksGetRequestInput = typeof GET.types.RequestInput;
export type ShareLinksGetRequestOutput = typeof GET.types.RequestOutput;
export type ShareLinksGetResponseInput = typeof GET.types.ResponseInput;
export type ShareLinksGetResponseOutput = typeof GET.types.ResponseOutput;
export type ShareLinksGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type ShareLinksGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;

export type ShareLinkCreateRequestInput = typeof POST.types.RequestInput;
export type ShareLinkCreateRequestOutput = typeof POST.types.RequestOutput;
export type ShareLinkCreateResponseInput = typeof POST.types.ResponseInput;
export type ShareLinkCreateResponseOutput = typeof POST.types.ResponseOutput;
export type ShareLinkCreateUrlVariablesInput =
  typeof POST.types.UrlVariablesInput;
export type ShareLinkCreateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;

export type ShareLinkUpdateRequestInput = typeof PATCH.types.RequestInput;
export type ShareLinkUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type ShareLinkUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type ShareLinkUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type ShareLinkUpdateUrlVariablesInput =
  typeof PATCH.types.UrlVariablesInput;
export type ShareLinkUpdateUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;

export type ShareLinkRevokeRequestInput = typeof DELETE.types.RequestInput;
export type ShareLinkRevokeRequestOutput = typeof DELETE.types.RequestOutput;
export type ShareLinkRevokeResponseInput = typeof DELETE.types.ResponseInput;
export type ShareLinkRevokeResponseOutput = typeof DELETE.types.ResponseOutput;
export type ShareLinkRevokeUrlVariablesInput =
  typeof DELETE.types.UrlVariablesInput;
export type ShareLinkRevokeUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;

const definitions = { GET, POST, PATCH, DELETE };

export default definitions;
