/**
 * IMAP Folder Sync API Route Definition
 * Defines endpoint for syncing IMAP folders
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../../user/user-roles/enum";

/**
 * POST endpoint for syncing IMAP folders
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "imap-client", "folders", "sync"],
  title: "app.api.v1.core.emails.imapClient.folders.sync.title",
  description: "app.api.v1.core.emails.imapClient.folders.sync.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.folders.tag"],
  allowedRoles: [UserRole.ADMIN],

  successTypes: {
    title: "app.api.v1.core.emails.imapClient.folders.sync.success.title",
    description:
      "app.api.v1.core.emails.imapClient.folders.sync.success.description",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.folders.sync.container.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      accountId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.folders.sync.accountId.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.sync.accountId.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.sync.accountId.placeholder",
        },
        z.uuid(),
      ),

      folderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.folders.sync.folderId.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.sync.folderId.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.folders.sync.folderId.placeholder",
        },
        z.uuid().optional(),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.folders.sync.force.label",
          description:
            "app.api.v1.core.emails.imapClient.folders.sync.force.description",
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      foldersProcessed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.folders.sync.response.foldersProcessed",
        },
        z.number(),
      ),

      foldersAdded: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.folders.sync.response.foldersAdded",
        },
        z.number(),
      ),

      foldersUpdated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.folders.sync.response.foldersUpdated",
        },
        z.number(),
      ),

      foldersDeleted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.folders.sync.response.foldersDeleted",
        },
        z.number(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.folders.sync.response.duration",
        },
        z.number(),
      ),

      success: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.emails.imapClient.folders.sync.response.success",
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.conflict.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.network.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.notFound.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.imapClient.folders.sync.errors.unsavedChanges.description",
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
    urlPathVariables: undefined,
  },
});

// Export types following modern naming convention
export type FoldersSyncRequestInput = typeof POST.types.RequestInput;
export type FoldersSyncRequestOutput = typeof POST.types.RequestOutput;
export type FoldersSyncResponseInput = typeof POST.types.ResponseInput;
export type FoldersSyncResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };

// Export individual endpoints
export { POST };
export default endpoints;
