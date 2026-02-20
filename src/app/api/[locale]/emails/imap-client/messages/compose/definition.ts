/**
 * Compose / Send Email Endpoint Definition
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
import { ComposeEmailContainer } from "./widget";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "compose"],
  title: "app.api.emails.imapClient.messages.compose.post.title",
  description: "app.api.emails.imapClient.messages.compose.post.description",
  category: "app.api.emails.category",
  icon: "edit",
  tags: ["app.api.emails.imapClient.messages.list.tag"],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ComposeEmailContainer,
    usage: { request: "data", response: true } as const,
    children: {
      to: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.compose.post.to.label",
        description:
          "app.api.emails.imapClient.messages.compose.post.to.description",
        placeholder:
          "app.api.emails.imapClient.messages.compose.post.to.placeholder",
        columns: 12,
        schema: z.email(),
      }),

      toName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.compose.post.toName.label",
        description:
          "app.api.emails.imapClient.messages.compose.post.toName.description",
        placeholder:
          "app.api.emails.imapClient.messages.compose.post.toName.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      subject: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.compose.post.subject.label",
        description:
          "app.api.emails.imapClient.messages.compose.post.subject.description",
        placeholder:
          "app.api.emails.imapClient.messages.compose.post.subject.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      body: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.emails.imapClient.messages.compose.post.body.label",
        description:
          "app.api.emails.imapClient.messages.compose.post.body.description",
        placeholder:
          "app.api.emails.imapClient.messages.compose.post.body.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      // Response
      sent: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.imapClient.messages.compose.post.success.title",
        schema: z.boolean(),
      }),

      messageId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.messages.compose.post.success.title",
        schema: z.string().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.validation.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.notFound.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.server.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.conflict.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.network.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.emails.imapClient.messages.compose.post.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.compose.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.messages.compose.post.success.title",
    description:
      "app.api.emails.imapClient.messages.compose.post.success.description",
  },

  examples: {
    requests: {
      default: {
        to: "recipient@example.com",
        toName: "John Doe",
        subject: "Hello from the compose form",
        body: "This is a test email sent from the compose form.",
      },
    },
    responses: {
      default: {
        sent: true,
        messageId: "<message-id@smtp.example.com>",
      },
    },
  },
});

export type ComposeEmailRequestInput = typeof POST.types.RequestInput;
export type ComposeEmailRequestOutput = typeof POST.types.RequestOutput;
export type ComposeEmailResponseInput = typeof POST.types.ResponseInput;
export type ComposeEmailResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
