/**
 * Bulk Message Actions Endpoint Definition
 * Apply an action (mark read/unread, flag, delete) to multiple messages at once
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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
import { BulkMessageAction, BulkMessageActionOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "bulk"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.email",
  icon: "edit",
  tags: ["tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: undefined,
    usage: { request: "data", response: true } as const,
    children: {
      ids: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.ids.label",
        description: "post.ids.description",
        schema: z.array(z.uuid()).min(1),
      }),

      action: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.action.label",
        description: "post.action.description",
        options: BulkMessageActionOptions,
        schema: z.enum(BulkMessageAction),
      }),

      updated: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.success.title",
        schema: z.number().int(),
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        ids: ["123e4567-e89b-12d3-a456-426614174000"],
        action: BulkMessageAction.MARK_READ,
      },
    },
    responses: {
      default: {
        updated: 1,
      },
    },
  },
});

export type BulkMessageRequestInput = typeof POST.types.RequestInput;
export type BulkMessageRequestOutput = typeof POST.types.RequestOutput;
export type BulkMessageResponseInput = typeof POST.types.ResponseInput;
export type BulkMessageResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
