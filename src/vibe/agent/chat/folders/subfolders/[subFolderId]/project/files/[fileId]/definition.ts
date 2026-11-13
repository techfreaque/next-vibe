import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const FolderProjectRemoveFileContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.FolderProjectRemoveFileContainer,
  })),
);

/**
 * Remove a knowledge file from a folder project (DELETE).
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: [
    "vibe",
    "agent",
    "chat",
    "folders",
    "subfolders",
    "[subFolderId]",
    "project",
    "files",
    "[fileId]",
  ],
  aliases: ["folder-project-remove-file"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  titleShort: "delete.titleShort" as const,
  description: "delete.description" as const,
  tags: ["tags.folders" as const],
  icon: "trash" as const,
  category: "ai",
  subCategory: "chatOrganization",

  options: {
    mutationOptions: {
      onSuccess: async ({ logger, pathParams }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        const projectDefinitions = (await import("../../definition")).default;
        await apiClient.refetchEndpoint(projectDefinitions.GET, logger, {
          urlPathParams: { subFolderId: pathParams.subFolderId },
        });
      },
    },
  },

  fields: customWidgetObject({
    render: FolderProjectRemoveFileContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        schema: z.uuid(),
      }),
      fileId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.fileId.label" as const,
        description: "delete.fileId.description" as const,
        schema: z.uuid(),
      }),

      removedPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "delete.response.removedPath" as const,
        schema: z.string(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "delete.submitButton.label" as const,
        loadingText: "delete.submitButton.loadingText" as const,
        icon: "trash",
        variant: "destructive",
        className: "w-full",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        subFolderId: "123e4567-e89b-12d3-a456-426614174000",
        fileId: "223e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        removedPath:
          "/documents/projects/123e4567-e89b-12d3-a456-426614174000/brief.md",
      },
    },
  },
});

export type FolderProjectRemoveFileResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { DELETE } as const;
export default definitions;
