import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { dateSchema } from "next-vibe/core/definition/common.schema";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const FolderProjectEditContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FolderProjectEditContainer })),
);

const FolderProjectContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FolderProjectContainer })),
);

/** Max length of project instructions (chars). */
export const PROJECT_INSTRUCTIONS_MAX = 8000;

const PATH = [
  "vibe",
  "agent",
  "chat",
  "folders",
  "subfolders",
  "[subFolderId]",
  "project",
] as const;

/**
 * Folder Project (GET) - instructions + knowledge files of a folder.
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: PATH,
  aliases: ["folder-project"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  tags: ["tags.folders" as const],
  icon: "folder-open" as const,
  category: "ai",
  subCategory: "chatOrganization",

  fields: customWidgetObject({
    render: FolderProjectContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.uuid(),
      }),
      folderName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.folderName" as const,
        schema: z.string(),
      }),
      instructions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.instructions" as const,
        schema: z.string().nullable(),
      }),
      knowledgePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.knowledgePath" as const,
        schema: z.string(),
      }),
      canManage: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.canManage" as const,
        schema: z.boolean(),
      }),
      files: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            fileId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.files.id" as const,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.files.name" as const,
              schema: z.string(),
            }),
            path: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.files.path" as const,
              schema: z.string(),
            }),
            size: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.files.size" as const,
              schema: z.number(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.files.updatedAt" as const,
              schema: dateSchema,
            }),
          },
        }),
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
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        folderName: "Launch plan",
        instructions: "Answer as a senior product marketer. Be terse.",
        knowledgePath:
          "/documents/projects/123e4567-e89b-12d3-a456-426614174000",
        canManage: true,
        files: [
          {
            fileId: "223e4567-e89b-12d3-a456-426614174000",
            name: "brief.md",
            path: "/documents/projects/123e4567-e89b-12d3-a456-426614174000/brief.md",
            size: 1240,
            updatedAt: "2026-01-15T10:00:00.000Z",
          },
        ],
      },
    },
  },
});

/**
 * Folder Project (PATCH) - set or clear the folder instructions.
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: PATH,
  aliases: ["folder-project-update"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  tags: ["tags.folders" as const],
  icon: "folder-open" as const,
  category: "ai",
  subCategory: "chatOrganization",

  options: {
    mutationOptions: {
      onSuccess: async ({ logger, pathParams }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, logger, {
          urlPathParams: { subFolderId: pathParams.subFolderId },
        });
      },
    },
  },

  fields: customWidgetObject({
    render: FolderProjectEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      subFolderId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        schema: z.uuid(),
      }),
      instructions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.instructions.label" as const,
        description: "patch.instructions.description" as const,
        placeholder: "patch.instructions.placeholder" as const,
        columns: 12,
        schema: z.string().max(PROJECT_INSTRUCTIONS_MAX).nullable(),
      }),

      folderId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.folderId" as const,
        schema: z.uuid(),
      }),
      hasInstructions: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "patch.response.hasInstructions" as const,
        schema: z.boolean(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "patch.submitButton.label" as const,
        loadingText: "patch.submitButton.loadingText" as const,
        icon: "folder-open",
        variant: "primary",
        className: "w-full",
        usage: { request: "data&urlPathParams" },
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
    urlPathParams: {
      default: { subFolderId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        instructions: "Answer as a senior product marketer. Be terse.",
      },
    },
    responses: {
      default: {
        folderId: "123e4567-e89b-12d3-a456-426614174000",
        hasInstructions: true,
      },
    },
  },
});

export type FolderProjectGetResponseOutput = typeof GET.types.ResponseOutput;
export type FolderProjectUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type FolderProjectUpdateResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = { GET, PATCH } as const;
export default definitions;
