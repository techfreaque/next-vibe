import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const DeviceSubscriptionContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeviceSubscriptionContainer })),
);
const DeviceSubscriptionEditContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceSubscriptionEditContainer,
  })),
);

export const SubscriptionStatusValues = [
  "trial",
  "active",
  "expiring_soon",
  "expired",
  "no_subscription",
] as const;
export type SubscriptionStatusType = (typeof SubscriptionStatusValues)[number];

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "device-licenses", "subscription"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "calendar",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaDeviceSubscriptions",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_subscription"],

  fields: customWidgetObject({
    render: DeviceSubscriptionContainer,
    usage: { request: "data", response: true } as const,
    children: {
      logicalId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.logicalId.label" as const,
        description: "get.logicalId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      logicalIdOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.logicalId" as const,
        schema: z.string(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      clientEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.clientEmail" as const,
        schema: z.string().nullable(),
      }),
      trialStartDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.trialStartDate" as const,
        schema: dateSchema.nullable(),
      }),
      subscriptionEndDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.subscriptionEndDate" as const,
        schema: dateSchema.nullable(),
      }),
      effectiveStartDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.effectiveStartDate" as const,
        schema: dateSchema.nullable(),
      }),
      effectiveEndDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.effectiveEndDate" as const,
        schema: dateSchema.nullable(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.status" as const,
        schema: z.enum(SubscriptionStatusValues),
      }),
      daysUntilExpiry: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.daysUntilExpiry" as const,
        schema: z.number().nullable(),
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
    requests: { default: { logicalId: "fAv985KLf2zrwogUD0DM4Q" } },
    responses: {
      default: {
        logicalIdOut: "fAv985KLf2zrwogUD0DM4Q",
        orgResourceId: "exorde.connex.connectika",
        clientEmail: "client@example.com",
        trialStartDate: new Date("2025-10-15"),
        subscriptionEndDate: null,
        effectiveStartDate: new Date("2025-10-15"),
        effectiveEndDate: new Date("2025-11-14"),
        status: "trial" as const,
        daysUntilExpiry: 12,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "subscription"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaDeviceSubscriptions",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_subscription_update"],

  fields: customWidgetObject({
    render: DeviceSubscriptionEditContainer,
    usage: { request: "data", response: true } as const,
    children: {
      logicalId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.logicalId.label" as const,
        description: "post.logicalId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      orgResourceId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgResourceId.label" as const,
        description: "post.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      clientEmail: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.clientEmail.label" as const,
        description: "post.clientEmail.description" as const,
        columns: 12,
        schema: z.string().email().optional(),
      }),
      trialStartDate: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.trialStartDate.label" as const,
        description: "post.trialStartDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      subscriptionEndDate: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.subscriptionEndDate.label" as const,
        description: "post.subscriptionEndDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
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
    requests: {
      default: {
        logicalId: "fAv985KLf2zrwogUD0DM4Q",
        orgResourceId: "exorde.connex.connectika",
        clientEmail: "client@example.com",
      },
    },
    responses: {
      default: {
        logicalId: "fAv985KLf2zrwogUD0DM4Q",
        orgResourceId: "exorde.connex.connectika",
        clientEmail: "client@example.com",
        trialStartDate: undefined,
        subscriptionEndDate: undefined,
      },
    },
  },
});

export type DeviceSubscriptionGetRequestOutput = typeof GET.types.RequestOutput;
export type DeviceSubscriptionGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type DeviceSubscriptionPostRequestOutput =
  typeof POST.types.RequestOutput;
export type DeviceSubscriptionPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
