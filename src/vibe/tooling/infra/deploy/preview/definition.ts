import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tooling/infra/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "infra", "deploy", "preview"],
  title: "deploy.preview.post.title",
  titleShort: "deploy.preview.post.titleShort",
  description: "deploy.preview.post.description",
  icon: "eye",
  category: "devTools",
  subCategory: "Generators",
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  aliases: ["deploy-preview", "infra-preview"],
  tags: ["category" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "deploy.preview.post.container.title",
    usage: { request: "data", response: true },
    children: {
      stack: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deploy.preview.post.fields.stack.label",
        description: "deploy.preview.post.fields.stack.description",
        placeholder: "deploy.preview.post.fields.stack.placeholder",
        schema: z.string().optional().default("prod"),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deploy.preview.post.response.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deploy.preview.post.response.message.title",
        schema: z.string(),
      }),
      preview: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deploy.preview.post.response.preview.title",
        schema: z.string(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deploy.preview.post.response.duration.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "deploy.preview.post.success.title",
    description: "deploy.preview.post.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "deploy.preview.post.errors.validation.title",
      description: "deploy.preview.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "deploy.preview.post.errors.unauthorized.title",
      description: "deploy.preview.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "deploy.preview.post.errors.forbidden.title",
      description: "deploy.preview.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "deploy.preview.post.errors.server.title",
      description: "deploy.preview.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "deploy.preview.post.errors.notFound.title",
      description: "deploy.preview.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "deploy.preview.post.errors.unknown.title",
      description: "deploy.preview.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "deploy.preview.post.errors.unsavedChanges.title",
      description: "deploy.preview.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "deploy.preview.post.errors.conflict.title",
      description: "deploy.preview.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "deploy.preview.post.errors.network.title",
      description: "deploy.preview.post.errors.network.description",
    },
  },

  examples: {
    requests: { default: { stack: "prod" } },
    responses: {
      default: {
        success: true,
        message: "Preview generated",
        preview:
          "Previewing update (prod):\n~ next-vibe-web updated\n+ new-configmap created",
        duration: 8000,
      },
    },
  },
});

export type DeployPreviewRequestOutput = typeof POST.types.RequestOutput;
export type DeployPreviewResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
