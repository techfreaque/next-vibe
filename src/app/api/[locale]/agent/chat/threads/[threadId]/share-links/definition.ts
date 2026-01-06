/**
 * Thread Share Links API Definition
 * Defines endpoints for creating and managing share links for threads using createFormEndpoint
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createFormEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create-form";
import { field, objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Share Links Form Endpoint with GET, POST, PATCH, DELETE
 * Uses method-specific field usage for DRY definitions
 */
const { GET, POST, PATCH, DELETE } = createFormEndpoint({
  path: ["agent", "chat", "threads", "[threadId]", "share-links"],
  category: "app.api.agent.chat.category",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  debug: true,

  methods: {
    GET: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.title",
      description: "app.api.agent.chat.threads.threadId.shareLinks.get.description",
      icon: "share",
      tags: ["app.api.agent.chat.tags.sharing"],
    },
    POST: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.post.title",
      description: "app.api.agent.chat.threads.threadId.shareLinks.post.description",
      icon: "plus",
      tags: ["app.api.agent.chat.tags.sharing"],
    },
    PATCH: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.patch.title",
      description: "app.api.agent.chat.threads.threadId.shareLinks.patch.description",
      icon: "edit",
      tags: ["app.api.agent.chat.tags.sharing"],
    },
    DELETE: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.delete.title",
      description: "app.api.agent.chat.threads.threadId.shareLinks.delete.description",
      icon: "trash",
      tags: ["app.api.agent.chat.tags.sharing"],
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
      PATCH: { request: "data", response: true },
      DELETE: { request: "data" },
    },
    {
      // === THREAD ID (URL path parameter for all methods) ===
      threadId: field(
        z.string().uuid(),
        { request: "urlPathParams" }, // Used by ALL methods
        { type: WidgetType.TEXT, content: "" }, // No form widget - schema only
      ),

      // === LINK ID (request data for PATCH/DELETE) ===
      linkId: field(
        z.string().uuid(),
        {
          PATCH: { request: "data" },
          DELETE: { request: "data" },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.threads.threadId.shareLinks.linkId.label" as const,
        },
      ),

      // === LABEL (request data for POST/PATCH only) ===
      label: field(
        z.string().nullable().optional(),
        {
          POST: { request: "data", response: true },
          PATCH: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.threads.threadId.shareLinks.label.label" as const,
          description: "app.api.agent.chat.threads.threadId.shareLinks.label.description" as const,
          placeholder: "app.api.agent.chat.threads.threadId.shareLinks.label.placeholder" as const,
        },
      ),

      // === ALLOW POSTING (request data for POST/PATCH only) ===
      allowPosting: field(
        z.boolean().default(false),
        {
          POST: { request: "data", response: true },
          PATCH: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.shareLinks.allowPosting.description" as const,
        },
      ),

      // === REQUIRE AUTH (request data for POST/PATCH only) ===
      requireAuth: field(
        z.boolean().default(false),
        {
          POST: { request: "data", response: true },
          PATCH: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.shareLinks.requireAuth.description" as const,
        },
      ),

      // === SHARE LINKS LIST (response only for GET) ===
      shareLinks: {
        type: "array" as const,
        usage: { GET: { response: true } },
        ui: {
          type: WidgetType.DATA_CARDS,
          emptyTitle:
            "app.api.agent.chat.threads.threadId.shareLinks.shareLinks.emptyTitle" as const,
          emptyDescription:
            "app.api.agent.chat.threads.threadId.shareLinks.shareLinks.emptyDescription" as const,
        },
        child: objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.STACKED,
          },
          { GET: { response: true } },
          {
            id: field(
              z.string().uuid(),
              { GET: { response: true } },
              { type: WidgetType.TEXT, content: "", order: 999 },
            ),
            token: field(
              z.string(),
              { GET: { response: true } },
              { type: WidgetType.TEXT, content: "", order: 999 },
            ),
            label: field(
              z.string().nullable(),
              { GET: { response: true } },
              {
                type: WidgetType.TEXT,
                content: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.label" as const,
                order: 1,
              },
            ),
            shareUrl: field(
              z.string(),
              { GET: { response: true } },
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.shareUrl" as const,
                order: 2,
              },
            ),
            active: field(
              z.boolean(),
              { GET: { response: true } },
              {
                type: WidgetType.BADGE,
                content: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.active" as const,
                variant: "default" as const,
                order: 3,
              },
            ),
            allowPosting: field(
              z.boolean(),
              { GET: { response: true } },
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.allowPosting" as const,
                variant: "info" as const,
                order: 4,
              },
            ),
            requireAuth: field(
              z.boolean(),
              { GET: { response: true } },
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.requireAuth" as const,
                variant: "info" as const,
                order: 5,
              },
            ),
            accessCount: field(
              z.number(),
              { GET: { response: true } },
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.accessCount" as const,
                order: 6,
              },
            ),
            lastAccessedAt: field(
              dateSchema.nullable(),
              { GET: { response: true } },
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.lastAccessedAt" as const,
                order: 7,
              },
            ),
            createdAt: field(
              dateSchema,
              { GET: { response: true } },
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.threads.threadId.shareLinks.shareLink.createdAt" as const,
                order: 8,
              },
            ),
            editAction: field(
              z.string().uuid(),
              { GET: { response: true } },
              {
                type: WidgetType.BUTTON,
                text: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.editAction" as const,
                variant: "secondary" as const,
                size: "sm" as const,
                onClick: "edit",
                order: 9,
              },
            ),
            deleteAction: field(
              z.string().uuid(),
              { GET: { response: true } },
              {
                type: WidgetType.BUTTON,
                text: "app.api.agent.chat.threads.threadId.shareLinks.shareLink.deleteAction" as const,
                variant: "destructive" as const,
                size: "sm" as const,
                onClick: "delete",
                order: 10,
              },
            ),
          },
        ),
      },

      // === RESPONSE ID (for POST/PATCH/DELETE success responses) ===
      id: field(
        z.string().uuid(),
        {
          POST: { response: true },
          PATCH: { response: true },
          DELETE: { response: true },
        },
        { type: WidgetType.TEXT, content: "" },
      ),

      // === TOKEN (POST response only) ===
      token: field(
        z.string(),
        {
          POST: { response: true },
        },
        { type: WidgetType.TEXT, content: "" },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.validation.title" as const,
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
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unknown.title" as const,
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
      title: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.shareLinks.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.shareLinks.get.success.title" as const,
    description: "app.api.agent.chat.threads.threadId.shareLinks.get.success.description" as const,
  },

  examples: {},
});

export type ShareLinksGetRequestInput = typeof GET.types.RequestInput;
export type ShareLinksGetRequestOutput = typeof GET.types.RequestOutput;
export type ShareLinksGetResponseInput = typeof GET.types.ResponseInput;
export type ShareLinksGetResponseOutput = typeof GET.types.ResponseOutput;
export type ShareLinksGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type ShareLinksGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

export type ShareLinkCreateRequestInput = typeof POST.types.RequestInput;
export type ShareLinkCreateRequestOutput = typeof POST.types.RequestOutput;
export type ShareLinkCreateResponseInput = typeof POST.types.ResponseInput;
export type ShareLinkCreateResponseOutput = typeof POST.types.ResponseOutput;
export type ShareLinkCreateUrlVariablesInput = typeof POST.types.UrlVariablesInput;
export type ShareLinkCreateUrlVariablesOutput = typeof POST.types.UrlVariablesOutput;

export type ShareLinkUpdateRequestInput = typeof PATCH.types.RequestInput;
export type ShareLinkUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type ShareLinkUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type ShareLinkUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type ShareLinkUpdateUrlVariablesInput = typeof PATCH.types.UrlVariablesInput;
export type ShareLinkUpdateUrlVariablesOutput = typeof PATCH.types.UrlVariablesOutput;

export type ShareLinkRevokeRequestInput = typeof DELETE.types.RequestInput;
export type ShareLinkRevokeRequestOutput = typeof DELETE.types.RequestOutput;
export type ShareLinkRevokeResponseInput = typeof DELETE.types.ResponseInput;
export type ShareLinkRevokeResponseOutput = typeof DELETE.types.ResponseOutput;
export type ShareLinkRevokeUrlVariablesInput = typeof DELETE.types.UrlVariablesInput;
export type ShareLinkRevokeUrlVariablesOutput = typeof DELETE.types.UrlVariablesOutput;

const definitions = { GET, POST, PATCH, DELETE };

export default definitions;
