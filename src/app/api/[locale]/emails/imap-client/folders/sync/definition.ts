/**
 * IMAP Folder Sync API Route Definition
 * Defines endpoint for syncing IMAP folders
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { ImapFoldersSyncContainer } from "./widget";

/**
 * POST endpoint for syncing IMAP folders
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "folders", "sync"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  icon: "folder",
  tags: ["category" as const],
  allowedRoles: [UserRole.ADMIN],

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  fields: customWidgetObject({
    render: ImapFoldersSyncContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS ===
      accountId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        schema: z.uuid(),
      }),

      folderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "folderId.label",
        description: "folderId.description",
        placeholder: "folderId.placeholder",
        schema: z.uuid().optional(),
      }),

      force: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "force.label",
        description: "force.description",
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      foldersProcessed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.foldersProcessed",
        schema: z.coerce.number(),
      }),

      foldersAdded: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.foldersAdded",
        schema: z.coerce.number(),
      }),

      foldersUpdated: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.foldersUpdated",
        schema: z.coerce.number(),
      }),

      foldersDeleted: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.foldersDeleted",
        schema: z.coerce.number(),
      }),

      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.duration",
        schema: z.coerce.number(),
      }),

      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.success",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  examples: {
    requests: {
      default: {
        accountId: "123e4567-e89b-12d3-a456-426614174000",
        folderId: "456e7890-e89b-12d3-a456-426614174001",
        force: false,
      },
    },
    responses: {
      default: {
        foldersProcessed: 5,
        foldersAdded: 1,
        foldersUpdated: 3,
        foldersDeleted: 0,
        duration: 2500,
        success: true,
      },
    },
  },
});

// Export types following modern naming convention
export type FoldersSyncRequestInput = typeof POST.types.RequestInput;
export type FoldersSyncRequestOutput = typeof POST.types.RequestOutput;
export type FoldersSyncResponseInput = typeof POST.types.ResponseInput;
export type FoldersSyncResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST } as const;
export default endpoints;
