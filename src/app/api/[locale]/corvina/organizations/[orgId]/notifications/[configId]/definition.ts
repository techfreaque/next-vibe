import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
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

import { NotificationEventOptions } from "../enums";
import { scopedTranslation } from "./i18n";

const NotificationUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.NotificationUpdateContainer,
  })),
);

const NotificationDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.NotificationDeleteContainer,
  })),
);

const notificationConfigResponseFields = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.id" as const,
    schema: z.number(),
  }),
  organizationId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.organizationId" as const,
    schema: z.number(),
  }),
  lastCheck: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.lastCheck" as const,
    schema: dateSchema.nullable(),
  }),
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "notifications", "[configId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.notifications" as const],
  aliases: ["corvina_notification_config_update"],

  fields: customWidgetObject({
    render: NotificationUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      configId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.configId.label" as const,
        description: "post.configId.description" as const,
        schema: z.coerce.number(),
      }),
      event: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.event.label" as const,
        description: "post.event.description" as const,
        columns: 12,
        schema: z.string().optional(),
        options: NotificationEventOptions,
      }),
      beforeDays: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.beforeDays.label" as const,
        description: "post.beforeDays.description" as const,
        columns: 6,
        schema: z.coerce.number().nullable().optional(),
      }),
      afterDays: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.afterDays.label" as const,
        description: "post.afterDays.description" as const,
        columns: 6,
        schema: z.coerce.number().nullable().optional(),
      }),
      emailBcc: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.emailBcc.label" as const,
        description: "post.emailBcc.description" as const,
        placeholder: "post.emailBcc.placeholder" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
      }),
      ...notificationConfigResponseFields,
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "save",
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
    urlPathParams: { default: { orgId: 45511, configId: 1 } },
    requests: {
      default: {
        beforeDays: 14,
      },
    },
    responses: {
      default: {
        id: 1,
        organizationId: 45511,
        event: "STANDARD_LICENSE_EXPIRATION",
        beforeDays: 14,
        afterDays: null,
        emailBcc: null,
        lastCheck: null,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[orgId]", "notifications", "[configId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "bell-off",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.notifications" as const],
  aliases: ["corvina_notification_config_delete"],

  fields: customWidgetObject({
    render: NotificationDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      configId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.configId.label" as const,
        description: "delete.configId.description" as const,
        schema: z.coerce.number(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.id" as const,
        schema: z.number(),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.organizationId" as const,
        schema: z.number(),
      }),
      event: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.event" as const,
        schema: z.string(),
      }),
      beforeDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.beforeDays" as const,
        schema: z.number().nullable(),
      }),
      afterDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.afterDays" as const,
        schema: z.number().nullable(),
      }),
      emailBcc: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.emailBcc" as const,
        schema: z.string().nullable(),
      }),
      lastCheck: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.lastCheck" as const,
        schema: dateSchema.nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511, configId: 1 } },
    responses: {
      default: {
        id: 1,
        organizationId: 45511,
        event: "STANDARD_LICENSE_EXPIRATION",
        beforeDays: 30,
        afterDays: null,
        emailBcc: null,
        lastCheck: null,
      },
    },
  },
});

export type NotificationUpdateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;
export type NotificationUpdateRequestOutput = typeof POST.types.RequestOutput;
export type NotificationUpdateResponseOutput = typeof POST.types.ResponseOutput;
export type NotificationDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type NotificationDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { POST, DELETE } as const;
export default definitions;
