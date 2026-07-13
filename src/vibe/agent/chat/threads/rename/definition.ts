/**
 * Thread Rename API Definition
 * Updates the title and preview of a chat thread.
 * threadId is hidden from the AI platform - it is auto-filled from the active stream context.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/core/definition/platform";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { THREAD_RENAME_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ThreadRenameContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ThreadRenameContainer })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "rename"],
  aliases: [THREAD_RENAME_ALIAS] as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "pencil",
  dynamicTitle: ({ request, response }) => {
    const title = response?.updatedTitle ?? request?.title;
    if (!title) {
      return undefined;
    }
    return {
      message: "patch.dynamicTitle" as const,
      messageParams: { title },
    };
  },
  category: "ai",
  subCategory: "threadsManagement",
  tags: ["tags.threads" as const],

  fields: customWidgetObject({
    render: ThreadRenameContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      // threadId is provided by CLI/MCP/web callers.
      // For the AI platform it is hidden and auto-filled from streamContext.
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () => (await import("../definition")).default.GET,
        labelField: "title",
        label: "patch.threadId.label" as const,
        description: "patch.threadId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
        hiddenForPlatforms: [Platform.AI],
        serverDefault: (ctx) => ctx.streamContext.threadId,
      }),

      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.threadTitle.label" as const,
        description: "patch.threadTitle.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255),
      }),

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.preview.label" as const,
        description: "patch.preview.description" as const,
        columns: 12,
        schema: z.string().max(1000).optional(),
      }),

      // === RESPONSE FIELDS ===
      updatedThreadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.threadId.content" as const,
        schema: z.uuid(),
      }),

      updatedTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.title.content" as const,
        schema: z.string(),
      }),

      updatedPreview: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.preview.content" as const,
        schema: z.string().nullable(),
      }),

      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.updatedAt.content" as const,
        schema: dateSchema,
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        variant: "outline",
        usage: { request: "data" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "patch.submitButton.label" as const,
        loadingText: "patch.submitButton.loadingText" as const,
        variant: "primary",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    requests: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        title: "My Renamed Thread",
        description: "A short description of this conversation",
      },
    },
    responses: {
      default: {
        updatedThreadId: "550e8400-e29b-41d4-a716-446655440000",
        updatedTitle: "My Renamed Thread",
        updatedPreview: "A short description of this conversation",
        updatedAt: new Date("2024-01-15T10:00:00.000Z"),
      },
    },
  },
});

export type ThreadRenameRequestInput = typeof PATCH.types.RequestInput;
export type ThreadRenameRequestOutput = typeof PATCH.types.RequestOutput;
export type ThreadRenameResponseInput = typeof PATCH.types.ResponseInput;
export type ThreadRenameResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH };
export default definitions;
