import {
  EndpointErrorTypes,
  FieldDataType,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { isValidAgentName } from "./constants";
import { scopedTranslation } from "./i18n";

export const codingAgentRoles = [UserRole.ADMIN] as const;

const nameSchema = z.string().refine(isValidAgentName);

const nameFieldConfig = {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "codingAgent.run.post.fields.name.label",
  description: "codingAgent.run.post.fields.name.description",
} as const;

export const requiredNameField = requestField(scopedTranslation, {
  ...nameFieldConfig,
  schema: nameSchema,
});

export const optionalNameField = requestField(scopedTranslation, {
  ...nameFieldConfig,
  schema: nameSchema.optional(),
});

export const linesField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.NUMBER,
  label: "codingAgent.list.post.fields.lines.label",
  description: "codingAgent.list.post.fields.lines.description",
  schema: z.number().int().nonnegative().optional(),
});

export const threadIdResponseField = responseField(scopedTranslation, {
  type: WidgetType.TEXT,
  label: "codingAgent.run.post.fields.threadId.label",
  schema: z.string(),
});

export const codingAgentErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "codingAgent.run.post.errors.validation.title",
    description: "codingAgent.run.post.errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "codingAgent.run.post.errors.unauthorized.title",
    description: "codingAgent.run.post.errors.unauthorized.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "codingAgent.run.post.errors.internal.title",
    description: "codingAgent.run.post.errors.internal.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "codingAgent.run.post.errors.forbidden.title",
    description: "codingAgent.run.post.errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "codingAgent.run.post.errors.notFound.title",
    description: "codingAgent.run.post.errors.notFound.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "codingAgent.run.post.errors.network.title",
    description: "codingAgent.run.post.errors.network.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "codingAgent.run.post.errors.unknown.title",
    description: "codingAgent.run.post.errors.unknown.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "codingAgent.run.post.errors.unsaved.title",
    description: "codingAgent.run.post.errors.unsaved.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "codingAgent.run.post.errors.conflict.title",
    description: "codingAgent.run.post.errors.conflict.description",
  },
} as const;
