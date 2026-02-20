/**
 * Bulk Message Actions Endpoint Definition
 * Apply an action (mark read/unread, flag, delete) to multiple messages at once
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import { BulkMessageAction, BulkMessageActionOptions } from "../../enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "bulk"],
  title: "app.api.emails.imapClient.messages.bulk.post.title",
  description: "app.api.emails.imapClient.messages.bulk.post.description",
  category: "app.api.emails.category",
  icon: "edit",
  tags: ["app.api.emails.imapClient.messages.bulk.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: undefined,
    usage: { request: "data", response: true } as const,
    children: {
      ids: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.bulk.post.ids.label",
        description:
          "app.api.emails.imapClient.messages.bulk.post.ids.description",
        schema: z.array(z.uuid()).min(1),
      }),

      action: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.imapClient.messages.bulk.post.action.label",
        description:
          "app.api.emails.imapClient.messages.bulk.post.action.description",
        options: BulkMessageActionOptions,
        schema: z.enum(BulkMessageAction),
      }),

      updated: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.messages.bulk.post.success.title",
        schema: z.number().int(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.validation.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.notFound.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.messages.bulk.post.errors.server.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.conflict.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.network.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.emails.imapClient.messages.bulk.post.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.bulk.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.messages.bulk.post.success.title",
    description:
      "app.api.emails.imapClient.messages.bulk.post.success.description",
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
