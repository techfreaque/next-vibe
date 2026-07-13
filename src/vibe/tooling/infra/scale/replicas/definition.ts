import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  ScaleComponent,
  ScaleComponentDB,
  ScaleComponentOptions,
} from "next-vibe/tooling/infra/enum";
import { scopedTranslation } from "next-vibe/tooling/infra/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "infra", "scale", "replicas"],
  title: "scale.replicas.post.title",
  titleShort: "scale.replicas.post.titleShort",
  description: "scale.replicas.post.description",
  icon: "layers",
  category: "devTools",
  subCategory: "Generators",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["scale", "scale-replicas", "infra-scale"],
  tags: ["category" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "scale.replicas.post.container.title",
    usage: { request: "data", response: true },
    children: {
      component: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "scale.replicas.post.fields.component.label",
        description: "scale.replicas.post.fields.component.description",
        options: ScaleComponentOptions,
        schema: z.enum(ScaleComponentDB),
      }),
      replicas: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "scale.replicas.post.fields.replicas.label",
        description: "scale.replicas.post.fields.replicas.description",
        placeholder: "scale.replicas.post.fields.replicas.placeholder",
        schema: z.coerce.number().min(0).max(20),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scale.replicas.post.response.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scale.replicas.post.response.message.title",
        schema: z.string(),
      }),
      previousReplicas: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scale.replicas.post.response.previousReplicas.title",
        schema: z.number(),
      }),
      newReplicas: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scale.replicas.post.response.newReplicas.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "scale.replicas.post.success.title",
    description: "scale.replicas.post.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "scale.replicas.post.errors.validation.title",
      description: "scale.replicas.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "scale.replicas.post.errors.unauthorized.title",
      description: "scale.replicas.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "scale.replicas.post.errors.forbidden.title",
      description: "scale.replicas.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "scale.replicas.post.errors.server.title",
      description: "scale.replicas.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "scale.replicas.post.errors.notFound.title",
      description: "scale.replicas.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "scale.replicas.post.errors.unknown.title",
      description: "scale.replicas.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "scale.replicas.post.errors.unsavedChanges.title",
      description: "scale.replicas.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "scale.replicas.post.errors.conflict.title",
      description: "scale.replicas.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "scale.replicas.post.errors.network.title",
      description: "scale.replicas.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      scaleUp: { component: ScaleComponent.WEB, replicas: 3 },
      pause: { component: ScaleComponent.TASKS, replicas: 0 },
    },
    responses: {
      default: {
        success: true,
        message: "next-vibe-web scaled from 1 → 3 replicas",
        previousReplicas: 1,
        newReplicas: 3,
      },
    },
  },
});

export type ScaleReplicasRequestOutput = typeof POST.types.RequestOutput;
export type ScaleReplicasResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
