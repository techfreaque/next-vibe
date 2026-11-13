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
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const FolderProjectAddFileContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.FolderProjectAddFileContainer,
  })),
);

/** Max size of a single knowledge file (chars). */
export const KNOWLEDGE_FILE_MAX = 200_000;

/**
 * Add a knowledge file to a folder project (POST).
 * Stored as a Cortex document under /documents/projects/<folderId>/.
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: [
    "vibe",
    "agent",
    "chat",
    "folders",
    "subfolders",
    "[subFolderId]",
    "project",
    "files",
  ],
  aliases: ["folder-project-add-file"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  tags: ["tags.folders" as const],
  icon: "file-plus" as const,
  category: "ai",
  subCategory: "chatOrganization",

  options: {
    mutationOptions: {
      onSuccess: async ({ logger, pathParams }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        const projectDefinitions = (await import("../definition")).default;
        await apiClient.refetchEndpoint(projectDefinitions.GET, logger, {
          urlPathParams: { subFolderId: pathParams.subFolderId },
        });
      },
    },
  },

  fields: customWidgetObject({
    render: FolderProjectAddFileContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.id.label" as const,
        description: "post.id.description" as const,
        schema: z.uuid(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(120),
      }),
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        columns: 12,
        schema: z.string().min(1).max(KNOWLEDGE_FILE_MAX),
      }),

      fileId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.fileId" as const,
        schema: z.uuid(),
      }),
      path: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.path" as const,
        schema: z.string(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "file-plus",
        variant: "primary",
        className: "w-full",
        usage: { request: "data&urlPathParams" },
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
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: { name: "brief", content: "# Brief\n\nLaunch is on March 3." },
    },
    responses: {
      default: {
        fileId: "223e4567-e89b-12d3-a456-426614174000",
        path: "/documents/projects/123e4567-e89b-12d3-a456-426614174000/brief.md",
      },
    },
  },
});

export type FolderProjectAddFileRequestOutput = typeof POST.types.RequestOutput;
export type FolderProjectAddFileResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
