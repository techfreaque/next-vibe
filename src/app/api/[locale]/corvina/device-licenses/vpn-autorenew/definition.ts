import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
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

const DeviceLicenseVpnAutorenewContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseVpnAutorenewContainer,
  })),
);

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "device-licenses", "vpn-autorenew"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "shield",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_vpn_autorenew"],

  fields: customWidgetObject({
    render: DeviceLicenseVpnAutorenewContainer,
    usage: { request: "data", response: true } as const,
    children: {
      logicalId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.logicalId.label" as const,
        description: "put.logicalId.description" as const,
        placeholder: "put.logicalId.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      numOfSeconds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.numOfSeconds.label" as const,
        description: "put.numOfSeconds.description" as const,
        placeholder: "put.numOfSeconds.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgResourceId.label" as const,
        description: "put.orgResourceId.description" as const,
        placeholder: "put.orgResourceId.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      autorenew: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.autorenew.label" as const,
        description: "put.autorenew.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.id" as const,
        schema: z.number().nullable().optional(),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.serialNumber" as const,
        schema: z.string().nullable().optional(),
      }),
      clientName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.clientName" as const,
        schema: z.string().nullable().optional(),
      }),
      activationKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.activationKey" as const,
        schema: z.string().nullable().optional(),
      }),
      fromDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.fromDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      toDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.toDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.activationDate" as const,
        schema: dateSchema.nullable(),
      }),
      vpnValidityMonths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.vpnValidityMonths" as const,
        schema: z.number().nullable().optional(),
      }),
      numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.numOfSecondsAutoRenewVpn" as const,
        schema: z.number().nullable().optional(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.used" as const,
        schema: z.boolean().nullable().optional(),
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.deleted" as const,
        schema: z.boolean().nullable().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "put.submitButton.label" as const,
        loadingText: "put.submitButton.loadingText" as const,
        icon: "shield",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "put.errors.unauthorized.title" as const,
      description: "put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "put.errors.validation.title" as const,
      description: "put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "put.errors.forbidden.title" as const,
      description: "put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "put.errors.notFound.title" as const,
      description: "put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "put.errors.conflict.title" as const,
      description: "put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "put.errors.server.title" as const,
      description: "put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "put.errors.network.title" as const,
      description: "put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "put.errors.unsavedChanges.title" as const,
      description: "put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "put.errors.unknown.title" as const,
      description: "put.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "put.success.title" as const,
    description: "put.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        logicalId: "device-abc123",
        numOfSeconds: 2592000,
        autorenew: true,
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
        numOfSecondsAutoRenewVpn: 2592000,
        used: true,
        deleted: false,
      },
    },
  },
});

export type DeviceLicenseVpnAutorenewRequestOutput =
  typeof PUT.types.RequestOutput;
export type DeviceLicenseVpnAutorenewResponseOutput =
  typeof PUT.types.ResponseOutput;

const definitions = { PUT } as const;
export default definitions;
