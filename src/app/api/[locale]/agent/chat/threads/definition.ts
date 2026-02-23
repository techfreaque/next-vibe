/**
 * Chat Threads API Definition
 * Defines endpoints for listing and creating chat threads
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayOptionalField,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import { DefaultFolderId } from "../config";
import { ThreadStatus, ThreadStatusDB, ThreadStatusOptions } from "../enum";
import { scopedTranslation } from "./i18n";
import { ThreadsListContainer } from "./widget";

/**
 * Get Threads List Endpoint (GET)
 * Retrieves a paginated list of threads with filtering
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito threads
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "message-square",
  category: "category" as const,
  tags: ["tags.threads" as const],

  fields: customWidgetObject({
    render: ThreadsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === PAGINATION ===
      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(1),
      }),
      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.limit.label" as const,
        description: "get.limit.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),

      // === FILTERS ===
      rootFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "config.folders.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "config.folders.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "config.folders.public" as const,
          },
          {
            value: DefaultFolderId.CRON,
            label: "config.folders.cron" as const,
          },
        ],
        schema: z
          .enum([
            DefaultFolderId.PRIVATE,
            DefaultFolderId.SHARED,
            DefaultFolderId.PUBLIC,
            DefaultFolderId.CRON,
          ])
          .describe(
            "Root folder to filter threads (incognito not allowed - local-only)",
          ),
      }),
      subFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.subFolderId.label" as const,
        description: "get.subFolderId.description" as const,
        columns: 6,
        schema: z.string().uuid().or(z.literal("")).nullish(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label" as const,
        description: "get.status.description" as const,
        columns: 6,
        options: ThreadStatusOptions,
        schema: z.enum(ThreadStatusDB).optional(),
      }),
      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label" as const,
        description: "get.search.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      isPinned: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.isPinned.label" as const,
        description: "get.isPinned.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      dateFrom: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.dateFrom.label" as const,
        description: "get.dateFrom.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      dateTo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.dateTo.label" as const,
        description: "get.dateTo.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title" as const,
        description: "get.response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          threads: scopedResponseArrayFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "get.response.threads.thread.title" as const,
              layoutType: LayoutType.GRID,
              columns: 2,
              usage: { response: true },
              children: {
                id: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "get.response.threads.thread.id.content" as const,
                  schema: z.uuid(),
                }),
                title: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.threadTitle.content" as const,
                  schema: z.string(),
                }),
                rootFolderId: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.rootFolderId.content" as const,
                  schema: z.enum(DefaultFolderId),
                }),
                folderId: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.folderId.content" as const,
                  schema: z.uuid().nullable(),
                }),
                status: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.threads.thread.status.content" as const,
                  schema: z.enum(ThreadStatusDB),
                }),
                preview: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.preview.content" as const,
                  schema: z.string().nullable(),
                }),
                pinned: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.pinned.content" as const,
                  schema: z.boolean(),
                }),
                // Permission roles - nullable arrays (null = inherit, [] = deny, [roles...] = allow)
                rolesView: responseArrayOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                  },
                  scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    schema: z.enum(UserRoleDB),
                  }),
                ),
                rolesEdit: responseArrayOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                  },
                  scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    schema: z.enum(UserRoleDB),
                  }),
                ),
                rolesPost: responseArrayOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                  },
                  scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    schema: z.enum(UserRoleDB),
                  }),
                ),
                rolesModerate: responseArrayOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                  },
                  scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    schema: z.enum(UserRoleDB),
                  }),
                ),
                rolesAdmin: responseArrayOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                  },
                  scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    schema: z.enum(UserRoleDB),
                  }),
                ),
                // Permission flags - computed server-side based on user's roles
                canEdit: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.canEdit.content" as const,
                  schema: z
                    .boolean()
                    .describe(
                      "Whether the current user can edit this thread (title, settings)",
                    ),
                }),
                canPost: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.canPost.content" as const,
                  schema: z
                    .boolean()
                    .describe(
                      "Whether the current user can post messages in this thread",
                    ),
                }),
                canModerate: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.canModerate.content" as const,
                  schema: z
                    .boolean()
                    .describe(
                      "Whether the current user can moderate/hide messages in this thread",
                    ),
                }),
                canDelete: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.canDelete.content" as const,
                  schema: z
                    .boolean()
                    .describe(
                      "Whether the current user can delete this thread",
                    ),
                }),
                canManagePermissions: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.canManagePermissions.content" as const,
                  schema: z
                    .boolean()
                    .describe(
                      "Whether the current user can manage permissions for this thread",
                    ),
                }),
                createdAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.createdAt.content" as const,
                  schema: dateSchema,
                }),
                updatedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "get.response.threads.thread.updatedAt.content" as const,
                  schema: dateSchema,
                }),
              },
            }),
          }),
          totalCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.totalCount.content" as const,
            schema: z.coerce.number(),
          }),
          pageCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.pageCount.content" as const,
            schema: z.coerce.number(),
          }),
          page: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.page.content" as const,
            schema: z.coerce.number(),
          }),
          limit: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.limit.content" as const,
            schema: z.coerce.number(),
          }),
        },
      }),
    },
  }),

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
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        page: 1,
        limit: 20,
        rootFolderId: DefaultFolderId.PRIVATE,
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
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "threads"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "message-square-plus" as const,
  category: "category" as const,
  tags: ["tags.threads" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      thread: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.sections.thread.title" as const,
        description: "post.sections.thread.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          id: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label: "post.id.label" as const,
            description: "post.id.description" as const,
            columns: 12,
            schema: z.uuid(),
          }),
          title: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.threadTitle.label" as const,
            description: "post.threadTitle.description" as const,
            columns: 12,
            schema: z.string().min(1).max(255).optional().default("New Chat"),
          }),
          rootFolderId: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.rootFolderId.label" as const,
            description: "post.rootFolderId.description" as const,
            columns: 6,
            options: [
              {
                value: DefaultFolderId.PRIVATE,
                label: "config.folders.private" as const,
              },
              {
                value: DefaultFolderId.SHARED,
                label: "config.folders.shared" as const,
              },
              {
                value: DefaultFolderId.PUBLIC,
                label: "config.folders.public" as const,
              },
              {
                value: DefaultFolderId.INCOGNITO,
                label: "config.folders.incognito" as const,
              },
            ],
            schema: z
              .enum(DefaultFolderId)
              .refine((val) => val !== DefaultFolderId.INCOGNITO, {
                message: "post.errors.forbidden.incognitoNotAllowed",
              }),
          }),
          subFolderId: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label: "post.subFolderId.label" as const,
            description: "post.subFolderId.description" as const,
            columns: 6,
            schema: z.uuid().optional().nullable(),
          }),
          model: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.defaultModel.label" as const,
            description: "post.defaultModel.description" as const,
            columns: 6,
            schema: z.enum(ModelId),
          }),
          character: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.defaultTone.label" as const,
            description: "post.defaultTone.description" as const,
            columns: 6,
            schema: z.string().nullable(),
          }),
          systemPrompt: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "post.systemPrompt.label" as const,
            description: "post.systemPrompt.description" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
        },
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title" as const,
        description: "post.response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          thread: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.response.thread.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.id.content" as const,
                schema: z.uuid(),
              }),
              title: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.threadTitle.content" as const,
                schema: z.string(),
              }),
              rootFolderId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.rootFolderId.content" as const,
                schema: z.enum(DefaultFolderId),
              }),
              subFolderId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.subFolderId.content" as const,
                schema: z.uuid().nullable(),
              }),
              status: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "post.response.thread.status.content" as const,
                schema: z.enum(ThreadStatusDB),
              }),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.createdAt.content" as const,
                schema: dateSchema,
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.thread.updatedAt.content" as const,
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        thread: {
          id: "880e8400-e29b-41d4-a716-446655440000",
          title: "New Chat",
          rootFolderId: DefaultFolderId.PRIVATE,
          subFolderId: null,
          model: ModelId.GPT_5_NANO,
          character: "default",
        },
      },
    },
    responses: {
      default: {
        response: {
          thread: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "New Chat",
            rootFolderId: DefaultFolderId.PRIVATE,
            subFolderId: null,
            status: ThreadStatus.ACTIVE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

const definitions = { GET, POST } as const;
export default definitions;
