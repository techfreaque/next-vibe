/**
 * Thread Rename API Definition
 * Updates the title and preview of a chat thread.
 * threadId is hidden from the AI platform - it is auto-filled from the active stream context.
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "rename"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "pencil",
  category: "ai",
  subCategory: "threadsManagement",
  tags: ["tags.threads" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      // threadId is provided by CLI/MCP/web callers.
      // For the AI platform it is hidden and auto-filled from streamContext.threadId.
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
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
        schema: z.string().min(1).max(255).optional(),
      }),

      preview: requestField(scopedTranslation, {
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
        content: "patch.response.threadId.content" as const,
        schema: z.uuid(),
      }),

      updatedTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.title.content" as const,
        schema: z.string(),
      }),

      updatedPreview: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.preview.content" as const,
        schema: z.string().nullable(),
      }),

      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.updatedAt.content" as const,
        schema: dateSchema,
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
        preview: "A short description of this conversation",
      },
    },
    responses: {
      default: {
        updatedThreadId: "550e8400-e29b-41d4-a716-446655440000",
        updatedTitle: "My Renamed Thread",
        updatedPreview: "A short description of this conversation",
        updatedAt: "2024-01-15T10:00:00.000Z",
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
