import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
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

import { scopedTranslation } from "./i18n";

const DeviceLicenseMigrateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseMigrateContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "migrate"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "arrow-right",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_migrate"],

  fields: customWidgetObject({
    render: DeviceLicenseMigrateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      oldActivationKeyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.oldActivationKeyId.label" as const,
        description: "post.oldActivationKeyId.description" as const,
        placeholder: "post.oldActivationKeyId.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int(),
      }),
      newRealm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.newRealm.label" as const,
        description: "post.newRealm.description" as const,
        placeholder: "post.newRealm.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number().nullable().optional(),
      }),
      logicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.logicalId" as const,
        schema: z.string(),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.serialNumber" as const,
        schema: z.string().nullable().optional(),
      }),
      clientName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.clientName" as const,
        schema: z.string().nullable().optional(),
      }),
      activationKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.activationKey" as const,
        schema: z.string().nullable().optional(),
      }),
      fromDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fromDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      toDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.toDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.activationDate" as const,
        schema: dateSchema.nullable(),
      }),
      vpnValidityMonths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnValidityMonths" as const,
        schema: z.number().nullable().optional(),
      }),
      numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.numOfSecondsAutoRenewVpn" as const,
        schema: z.number().nullable().optional(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.used" as const,
        schema: z.boolean().nullable().optional(),
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.deleted" as const,
        schema: z.boolean().nullable().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "arrow-right",
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
    requests: {
      default: {
        oldActivationKeyId: 42,
        newRealm: "master",
      },
    },
    responses: {
      default: {
        logicalId: "device-abc123",
        id: 42,
        serialNumber: "SN123456",
        clientName: "Device Client",
        activationKey: "KEY-XXXX-YYYY",
        fromDateVpn: null,
        toDateVpn: null,
        activationDate: null,
        vpnValidityMonths: 1,
        numOfSecondsAutoRenewVpn: null,
        used: true,
        deleted: false,
      },
    },
  },
});

export type DeviceLicenseMigrateRequestOutput = typeof POST.types.RequestOutput;
export type DeviceLicenseMigrateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
