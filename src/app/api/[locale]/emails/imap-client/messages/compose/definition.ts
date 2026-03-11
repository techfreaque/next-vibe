/**
 * Compose / Send Email Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { ComposeEmailContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "compose"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.email",
  icon: "edit",
  tags: ["category" as const],

  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ComposeEmailContainer,
    usage: { request: "data", response: true } as const,
    children: {
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.to.label",
        description: "post.to.description",
        placeholder: "post.to.placeholder",
        columns: 12,
        schema: z.email(),
      }),

      toName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.toName.label",
        description: "post.toName.description",
        placeholder: "post.toName.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      subject: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.subject.label",
        description: "post.subject.description",
        placeholder: "post.subject.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      body: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.body.label",
        description: "post.body.description",
        placeholder: "post.body.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      // Response
      sent: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.success.title",
        schema: z.boolean(),
      }),

      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.success.title",
        schema: z.string().optional(),
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
