/**
 * Thread Share Links API Definition
 * Defines endpoints for creating and managing share links for threads
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayOptionalField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * GET endpoint - List all share links for a thread
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "app.api.agent.chat.threads.threadId.shareLinks.get.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.shareLinks.get.description" as const,
  icon: "share",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      shareLinks: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          emptyTitle:
            "app.api.agent.chat.threads.threadId.shareLinks.shareLinks.emptyTitle" as const,
          emptyDescription:
            "app.api.agent.chat.threads.threadId.shareLinks.shareLinks.emptyDescription" as const,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.STACKED,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
              order: 999,
              schema: z.string().uuid(),
            }),
            token: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
              order: 999,
              schema: z.string(),
            }),
            label: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
              order: 1,
              schema: z.string().nullable(),
            }),
            shareUrl: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.shareLink.shareUrl" as const,
              order: 2,
              schema: z.string(),
            }),
            active: responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.active" as const,
              variant: "default" as const,
              order: 3,
              schema: z.boolean(),
            }),
            allowPosting: responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.allowPosting" as const,
              variant: "info" as const,
              order: 4,
              schema: z.boolean(),
            }),
            requireAuth: responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.requireAuth" as const,
              variant: "info" as const,
              order: 5,
              schema: z.boolean(),
            }),
            accessCount: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.shareLink.accessCount" as const,
              order: 6,
              schema: z.number(),
            }),
            lastAccessedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.shareLink.lastAccessedAt" as const,
              order: 7,
              schema: dateSchema.nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.threads.threadId.shareLinks.shareLink.createdAt" as const,
              order: 8,
              schema: dateSchema,
            }),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.shareLinks.get.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.shareLinks.get.success.description" as const,
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
  method: Methods.POST,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "app.api.agent.chat.threads.threadId.shareLinks.post.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.shareLinks.post.description" as const,
  icon: "plus",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      label: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.label.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.label.description" as const,
        placeholder:
          "app.api.agent.chat.threads.threadId.shareLinks.label.placeholder" as const,
        schema: z.string().nullable().optional(),
      }),
      allowPosting: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.description" as const,
        schema: z.boolean().default(false),
      }),
      requireAuth: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.description" as const,
        schema: z.boolean().default(false),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
        schema: z.string().uuid(),
      }),
      token: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
        schema: z.string(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.shareLinks.post.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.shareLinks.post.success.description" as const,
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
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "app.api.agent.chat.threads.threadId.shareLinks.patch.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.shareLinks.patch.description" as const,
  icon: "edit",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      linkId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.linkId.label" as const,
        schema: z.string().uuid(),
      }),
      label: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.label.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.label.description" as const,
        placeholder:
          "app.api.agent.chat.threads.threadId.shareLinks.label.placeholder" as const,
        schema: z.string().nullable().optional(),
      }),
      allowPosting: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.description" as const,
        schema: z.boolean().default(false),
      }),
      requireAuth: requestResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.description" as const,
        schema: z.boolean().default(false),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
        schema: z.string().uuid(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.shareLinks.patch.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.shareLinks.patch.success.description" as const,
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
  method: Methods.DELETE,
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  title: "app.api.agent.chat.threads.threadId.shareLinks.delete.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.shareLinks.delete.description" as const,
  icon: "trash",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.sharing" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  debug: true,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
        schema: z.string().uuid(),
      }),
      linkId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.shareLinks.linkId.label" as const,
        schema: z.string().uuid(),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.shareLinks.empty" as const,
        schema: z.string().uuid(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.shareLinks.delete.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.shareLinks.delete.success.description" as const,
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
      } as const,
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
