import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["infra", "deploy", "push"],
  title: "deploy.push.post.title",
  description: "deploy.push.post.description",
  icon: "upload",
  category: "devTools",
  subCategory: "Generators",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["deploy", "infra-deploy", "push"],
  tags: ["category" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "deploy.push.post.container.title",
    usage: { request: "data", response: true },
    children: {
      stack: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deploy.push.post.fields.stack.label",
        description: "deploy.push.post.fields.stack.description",
        placeholder: "deploy.push.post.fields.stack.placeholder",
        schema: z.string().optional().default("prod"),
      }),
      skipPreview: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "deploy.push.post.fields.skipPreview.label",
        description: "deploy.push.post.fields.skipPreview.description",
        schema: z.boolean().optional().default(false),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "deploy.push.post.response.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "deploy.push.post.response.message.title",
        schema: z.string(),
      }),
      changes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "deploy.push.post.response.changes.title",
        schema: z.array(z.string()),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "deploy.push.post.response.duration.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "deploy.push.post.success.title",
    description: "deploy.push.post.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "deploy.push.post.errors.validation.title",
      description: "deploy.push.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "deploy.push.post.errors.unauthorized.title",
      description: "deploy.push.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "deploy.push.post.errors.forbidden.title",
      description: "deploy.push.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "deploy.push.post.errors.server.title",
      description: "deploy.push.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "deploy.push.post.errors.notFound.title",
      description: "deploy.push.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "deploy.push.post.errors.unknown.title",
      description: "deploy.push.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "deploy.push.post.errors.unsavedChanges.title",
      description: "deploy.push.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "deploy.push.post.errors.conflict.title",
      description: "deploy.push.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "deploy.push.post.errors.network.title",
      description: "deploy.push.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      default: { stack: "prod", skipPreview: false },
      force: { stack: "prod", skipPreview: true },
    },
    responses: {
      default: {
        success: true,
        message: "Deploy complete. 3 resources updated.",
        changes: [
          "+ next-vibe-web (updated image)",
          "~ next-vibe-tasks (resource limits updated)",
        ],
        duration: 45000,
      },
    },
  },
});

export type DeployPushRequestOutput = typeof POST.types.RequestOutput;
export type DeployPushResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
