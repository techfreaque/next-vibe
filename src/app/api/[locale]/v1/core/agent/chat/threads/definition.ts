/**
 * Chat Threads API Definition
 * Defines endpoints for listing and creating chat threads
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { DEFAULT_FOLDER_IDS } from "../config";
import { ThreadStatus, ThreadStatusOptions } from "../enum";
import { ModelId } from "../model-access/models";

/**
 * Get Threads List Endpoint (GET)
 * Retrieves a paginated list of threads with filtering
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito threads
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "threads"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.threads.get.title" as const,
  description: "app.api.v1.core.agent.chat.threads.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.threads.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === PAGINATION ===
      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.threads.get.page.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.page.description" as const,
          layout: { columns: 6 },
        },
        z.number().min(1).optional().default(1),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.threads.get.limit.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.limit.description" as const,
          layout: { columns: 6 },
        },
        z.number().min(1).max(100).optional().default(20),
      ),

      // === FILTERS ===
      rootFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.threads.get.rootFolderId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.rootFolderId.description" as const,
          layout: { columns: 6 },
          options: [
            {
              value: DEFAULT_FOLDER_IDS.PRIVATE,
              label:
                "app.api.v1.core.agent.chat.config.folders.private" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.SHARED,
              label:
                "app.api.v1.core.agent.chat.config.folders.shared" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.PUBLIC,
              label:
                "app.api.v1.core.agent.chat.config.folders.public" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.INCOGNITO,
              label:
                "app.api.v1.core.agent.chat.config.folders.incognito" as const,
            },
          ],
        },
        z
          .enum([
            DEFAULT_FOLDER_IDS.PRIVATE,
            DEFAULT_FOLDER_IDS.SHARED,
            DEFAULT_FOLDER_IDS.PUBLIC,
            DEFAULT_FOLDER_IDS.INCOGNITO,
          ])
          .optional(),
      ),
      subFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.get.subFolderId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.subFolderId.description" as const,
          layout: { columns: 6 },
        },
        z.uuid().optional().nullable(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.chat.threads.get.status.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.status.description" as const,
          layout: { columns: 6 },
          options: ThreadStatusOptions,
        },
        z.enum(ThreadStatus).optional(),
      ),
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.threads.get.search.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.search.description" as const,
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),
      isPinned: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.chat.threads.get.isPinned.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.isPinned.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().optional(),
      ),
      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.get.dateFrom.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.dateFrom.description" as const,
          layout: { columns: 6 },
        },
        z.string().datetime().optional(),
      ),
      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.threads.get.dateTo.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.dateTo.description" as const,
          layout: { columns: 6 },
        },
        z.string().datetime().optional(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.get.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.get.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          threads: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.agent.chat.threads.get.response.threads.thread.title" as const,
                layout: { type: LayoutType.GRID, columns: 2 },
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.id.content" as const,
                  },
                  z.uuid(),
                ),
                title: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.threadTitle.content" as const,
                  },
                  z.string(),
                ),
                rootFolderId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.rootFolderId.content" as const,
                  },
                  z.enum([
                    DEFAULT_FOLDER_IDS.PRIVATE,
                    DEFAULT_FOLDER_IDS.SHARED,
                    DEFAULT_FOLDER_IDS.PUBLIC,
                    DEFAULT_FOLDER_IDS.INCOGNITO,
                  ]),
                ),
                folderId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.folderId.content" as const,
                  },
                  z.uuid().nullable(),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.agent.chat.threads.get.response.threads.thread.status.content" as const,
                  },
                  z.enum(ThreadStatus),
                ),
                preview: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.preview.content" as const,
                  },
                  z.string().nullable(),
                ),
                pinned: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.pinned.content" as const,
                  },
                  z.boolean(),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.createdAt.content" as const,
                  },
                  z.date(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.chat.threads.get.response.threads.thread.updatedAt.content" as const,
                  },
                  z.date(),
                ),
              },
            ),
          ),
          totalCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.get.response.totalCount.content" as const,
            },
            z.number(),
          ),
          pageCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.get.response.pageCount.content" as const,
            },
            z.number(),
          ),
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.get.response.page.content" as const,
            },
            z.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.get.response.limit.content" as const,
            },
            z.number(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.threads.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.threads.get.success.title",
    description: "app.api.v1.core.agent.chat.threads.get.success.description",
  },

  examples: {
    requests: {
      default: {
        page: 1,
        limit: 20,
        rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
      },
    },
    responses: {
      default: {
        response: {
          threads: [],
          totalCount: 0,
          pageCount: 0,
          page: 1,
          limit: 20,
        },
      },
    },
  },
});

/**
 * Create Thread Endpoint (POST)
 * Creates a new chat thread
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "chat", "threads"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.threads.post.title" as const,
  description: "app.api.v1.core.agent.chat.threads.post.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.threads.post.form.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.post.form.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      thread: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.post.sections.thread.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.post.sections.thread.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          title: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.threads.post.threadTitle.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.threadTitle.description" as const,
              layout: { columns: 12 },
            },
            z.string().min(1).max(255).optional().default("New Chat"),
          ),
          rootFolderId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.agent.chat.threads.post.rootFolderId.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.rootFolderId.description" as const,
              layout: { columns: 6 },
              options: [
                {
                  value: DEFAULT_FOLDER_IDS.PRIVATE,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.private" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.SHARED,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.shared" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.PUBLIC,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.public" as const,
                },
                {
                  value: DEFAULT_FOLDER_IDS.INCOGNITO,
                  label:
                    "app.api.v1.core.agent.chat.config.folders.incognito" as const,
                },
              ],
            },
            z.enum([
              DEFAULT_FOLDER_IDS.PRIVATE,
              DEFAULT_FOLDER_IDS.SHARED,
              DEFAULT_FOLDER_IDS.PUBLIC,
              DEFAULT_FOLDER_IDS.INCOGNITO,
            ]),
          ),
          subFolderId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.v1.core.agent.chat.threads.post.subFolderId.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.subFolderId.description" as const,
              layout: { columns: 6 },
            },
            z.uuid().optional().nullable(),
          ),
          model: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.threads.post.defaultModel.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.defaultModel.description" as const,
              layout: { columns: 6 },
            },
            z.nativeEnum(ModelId),
          ),
          persona: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.threads.post.defaultTone.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.defaultTone.description" as const,
              layout: { columns: 6 },
            },
            z.string().nullable(),
          ),
          systemPrompt: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.v1.core.agent.chat.threads.post.systemPrompt.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.post.systemPrompt.description" as const,
              layout: { columns: 12 },
            },
            z.string().optional(),
          ),
        },
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.post.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.post.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          thread: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.agent.chat.threads.post.response.thread.title" as const,
              layout: { type: LayoutType.GRID, columns: 2 },
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.id.content" as const,
                },
                z.uuid(),
              ),
              title: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.threadTitle.content" as const,
                },
                z.string(),
              ),
              rootFolderId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.rootFolderId.content" as const,
                },
                z.enum([
                  DEFAULT_FOLDER_IDS.PRIVATE,
                  DEFAULT_FOLDER_IDS.SHARED,
                  DEFAULT_FOLDER_IDS.PUBLIC,
                  DEFAULT_FOLDER_IDS.INCOGNITO,
                ]),
              ),
              subFolderId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.subFolderId.content" as const,
                },
                z.uuid().nullable(),
              ),
              status: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.agent.chat.threads.post.response.thread.status.content" as const,
                },
                z.enum(ThreadStatus),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.createdAt.content" as const,
                },
                z.date(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.chat.threads.post.response.thread.updatedAt.content" as const,
                },
                z.date(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.threads.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.threads.post.success.title",
    description: "app.api.v1.core.agent.chat.threads.post.success.description",
  },

  examples: {
    requests: {
      default: {
        thread: {
          title: "New Chat",
          rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
          subFolderId: null,
          model: ModelId.GPT_5_NANO,
          persona: "default",
        },
      },
    },
    responses: {
      default: {
        response: {
          thread: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "New Chat",
            rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
            subFolderId: null,
            status: ThreadStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    },
  },
});

// Extract types
export type ThreadListRequestInput = typeof GET.types.RequestInput;
export type ThreadListRequestOutput = typeof GET.types.RequestOutput;
export type ThreadListResponseInput = typeof GET.types.ResponseInput;
export type ThreadListResponseOutput = typeof GET.types.ResponseOutput;

export type ThreadCreateRequestInput = typeof POST.types.RequestInput;
export type ThreadCreateRequestOutput = typeof POST.types.RequestOutput;
export type ThreadCreateResponseInput = typeof POST.types.ResponseInput;
export type ThreadCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export { GET, POST };
export default definitions;
