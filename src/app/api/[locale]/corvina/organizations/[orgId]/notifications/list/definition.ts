import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { NotificationEventOptions } from "../enums";
import { scopedTranslation } from "./i18n";

const NotificationListContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.NotificationListContainer,
  })),
);

const NotificationCreateContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.NotificationCreateContainer,
  })),
);

const notificationConfigResponseFields = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.id" as const,
    schema: z.number(),
  }),
  organizationId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.organizationId" as const,
    schema: z.number(),
  }),
  event: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.configs.event" as const,
    schema: z.string(),
  }),
  beforeDays: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.beforeDays" as const,
    schema: z.number().nullable(),
  }),
  afterDays: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.afterDays" as const,
    schema: z.number().nullable(),
  }),
  emailBcc: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.emailBcc" as const,
    schema: z.string().nullable(),
  }),
  lastCheck: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.configs.lastCheck" as const,
    schema: dateSchema.nullable(),
  }),
} as const;

const notificationConfigCoreResponseFields = {
  id: notificationConfigResponseFields.id,
  organizationId: notificationConfigResponseFields.organizationId,
  lastCheck: notificationConfigResponseFields.lastCheck,
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "notifications", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.notifications" as const],
  aliases: ["corvina_notification_configs_list"],
  cli: { firstCliArgKey: "orgId" },

  fields: customWidgetObject({
    render: NotificationListContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(10),
      }),
      configs: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: notificationConfigResponseFields,
        }),
      }),
      totalElements: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalElements" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      last: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.last" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511 } },
    responses: {
      default: {
        configs: [
          {
            id: 1,
            organizationId: 45511,
            event: "STANDARD_LICENSE_EXPIRATION",
            beforeDays: 30,
            afterDays: null,
            emailBcc: null,
            lastCheck: null,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        last: true,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "notifications", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell-ring",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.notifications" as const],
  aliases: ["corvina_notification_config_create"],

  fields: customWidgetObject({
    render: NotificationCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      event: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.event.label" as const,
        description: "post.event.description" as const,
        columns: 12,
        schema: z.string(),
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
      ...notificationConfigCoreResponseFields,
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "bell-ring",
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
        event: "STANDARD_LICENSE_EXPIRATION" as const,
        beforeDays: 30,
      },
    },
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

export type NotificationListUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type NotificationListResponseOutput = typeof GET.types.ResponseOutput;
export type NotificationCreateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;
export type NotificationCreateRequestOutput = typeof POST.types.RequestOutput;
export type NotificationCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
