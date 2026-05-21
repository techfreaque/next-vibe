import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  NotificationMailEventType,
  NotificationMailEventTypeOptions,
} from "../enums";
import { scopedTranslation } from "./i18n";

const NotificationTestContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.NotificationTestContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "notifications", "test"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.notifications" as const],
  aliases: ["corvina_notification_test"],

  fields: customWidgetObject({
    render: NotificationTestContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.type.label" as const,
        description: "post.type.description" as const,
        columns: 12,
        schema: z.enum(NotificationMailEventType),
        options: NotificationMailEventTypeOptions,
      }),
      emailTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.emailTo.label" as const,
        description: "post.emailTo.description" as const,
        placeholder: "post.emailTo.placeholder" as const,
        columns: 6,
        schema: z.string().email().optional(),
      }),
      emailBcc: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.emailBcc.label" as const,
        description: "post.emailBcc.description" as const,
        placeholder: "post.emailBcc.placeholder" as const,
        columns: 6,
        schema: z.string().email().optional(),
      }),
      subject: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.subject.label" as const,
        description: "post.subject.description" as const,
        placeholder: "post.subject.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "post.response.message" as const,
        schema: z.string(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511 } },
    requests: {
      default: {
        type: NotificationMailEventType.ALARM_NOTIFICATION,
        emailTo: "admin@example.com",
      },
    },
    responses: {
      default: {
        message: "Test notification sent successfully.",
      },
    },
  },
});

export type NotificationTestRequestOutput = typeof POST.types.RequestOutput;
export type NotificationTestResponseOutput = typeof POST.types.ResponseOutput;
export type NotificationTestUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;

const definitions = { POST } as const;
export default definitions;
