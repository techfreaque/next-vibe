import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
  requestUrlPathParamsResponseField,
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

const DeviceLicenseUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseUpdateContainer,
  })),
);
const DeviceLicenseDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseDeleteContainer,
  })),
);

// Response-only fields shared by both PUT and DELETE (excludes request+response fields)
const deviceLicenseResponseOnlyChildren = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.id" as const,
    schema: z.number(),
  }),
  realm: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.realm" as const,
    schema: z.string().nullable(),
  }),
  logicalId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.logicalId" as const,
    schema: z.string().nullable(),
  }),
  gatewayLogicalId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.gatewayLogicalId" as const,
    schema: z.string().nullable(),
  }),
  label: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.label" as const,
    schema: z.string().nullable(),
  }),
  apiKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.apiKey" as const,
    schema: z.string().nullable(),
  }),
  platformPairingApiUrl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.platformPairingApiUrl" as const,
    schema: z.string().nullable(),
  }),
  vpnPairingApiUrl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.vpnPairingApiUrl" as const,
    schema: z.string().nullable(),
  }),
  brokerUrls: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.brokerUrls" as const,
    schema: z.string().nullable(),
  }),
  orgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.orgResourceId" as const,
    schema: z.string().nullable(),
  }),
  vpnKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.vpnKey" as const,
    schema: z.string().nullable(),
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
  numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.numOfSecondsAutoRenewVpn" as const,
    schema: z.number().nullable(),
  }),
  activationDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.activationDate" as const,
    schema: dateSchema.nullable(),
  }),
  activationKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.activationKey" as const,
    schema: z.string(),
  }),
  used: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.used" as const,
    schema: z.boolean(),
  }),
  usedInTrial: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.usedInTrial" as const,
    schema: z.boolean().nullable(),
  }),
  deleted: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.deleted" as const,
    schema: z.boolean(),
  }),
  vpnOtpRequired: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.vpnOtpRequired" as const,
    schema: z.boolean().nullable(),
  }),
  vpnPairingMode: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.vpnPairingMode" as const,
    schema: z.string().nullable(),
  }),
  vpnLastAttempt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "put.response.vpnLastAttempt" as const,
    schema: dateSchema.nullable(),
  }),
};

const exampleDeviceLicense = {
  id: 1,
  realm: "corvina.root",
  logicalId: "device-logical-001",
  gatewayLogicalId: null,
  label: "Gateway A",
  apiKey: null,
  platformPairingApiUrl: null,
  vpnPairingApiUrl: null,
  brokerUrls: null,
  orgResourceId: "exorde.connex.connectika",
  vpnKey: null,
  fromDateVpn: null,
  toDateVpn: null,
  numOfSecondsAutoRenewVpn: null,
  activationDate: null,
  vpnValidityMonths: 12,
  vpnAccountingDisabled: false,
  activationKey: "ACT-KEY-001",
  used: true,
  usedInTrial: null,
  deleted: false,
  clientName: "Acme Corp",
  notes: null,
  vpnOtpRequired: null,
  vpnPairingMode: null,
  vpnLastAttempt: null,
  deviceLicenseId: 1,
};

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "device-licenses", "[deviceLicenseId]"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_update"],
  fields: customWidgetObject({
    render: DeviceLicenseUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      deviceLicenseId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.deviceLicenseId.label" as const,
        description: "put.deviceLicenseId.description" as const,
        schema: z.coerce.number(),
      }),
      serialNumber: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.serialNumber.label" as const,
        description: "put.serialNumber.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      clientName: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.clientName.label" as const,
        description: "put.clientName.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      notes: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.notes.label" as const,
        description: "put.notes.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      vpnStartDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "put.vpnStartDate.label" as const,
        description: "put.vpnStartDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      vpnEndDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "put.vpnEndDate.label" as const,
        description: "put.vpnEndDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      vpnValidityMonths: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.vpnValidityMonths.label" as const,
        description: "put.vpnValidityMonths.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      vpnAccountingDisabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.vpnAccountingDisabled.label" as const,
        description: "put.vpnAccountingDisabled.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      ...deviceLicenseResponseOnlyChildren,
      submitButton: submitButton(scopedTranslation, {
        label: "put.submitButton.label" as const,
        loadingText: "put.submitButton.loadingText" as const,
        icon: "save",
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
    urlPathParams: { default: { deviceLicenseId: 1 } },
    requests: {
      default: {
        serialNumber: "SN-ABC-001",
        clientName: "Acme Corp",
        vpnValidityMonths: 12,
      },
    },
    responses: {
      default: {
        ...exampleDeviceLicense,
        serialNumber: undefined,
        notes: undefined,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "device-licenses", "[deviceLicenseId]"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_delete"],
  fields: customWidgetObject({
    render: DeviceLicenseDeleteContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      deviceLicenseId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.deviceLicenseId.label" as const,
        description: "delete.deviceLicenseId.description" as const,
        schema: z.coerce.number(),
      }),
      deleteOrgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.deleteOrgResourceId.label" as const,
        description: "delete.deleteOrgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.serialNumber" as const,
        schema: z.string().nullable(),
      }),
      clientName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.clientName" as const,
        schema: z.string().nullable(),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.notes" as const,
        schema: z.string().nullable(),
      }),
      vpnValidityMonths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.vpnValidityMonths" as const,
        schema: z.number().nullable(),
      }),
      vpnAccountingDisabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.vpnAccountingDisabled" as const,
        schema: z.boolean().nullable(),
      }),
      ...deviceLicenseResponseOnlyChildren,
      submitButton: submitButton(scopedTranslation, {
        label: "delete.submitButton.label" as const,
        loadingText: "delete.submitButton.loadingText" as const,
        icon: "trash",
        variant: "destructive",
        className: "w-full",
        usage: { request: "data" },
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
    urlPathParams: { default: { deviceLicenseId: 1 } },
    requests: { default: { deleteOrgResourceId: "exorde.connex.connectika" } },
    responses: {
      default: { ...exampleDeviceLicense, deleted: true, serialNumber: null },
    },
  },
});

export type DeviceLicenseUpdateUrlParamsOutput =
  typeof PUT.types.UrlVariablesOutput;
export type DeviceLicenseUpdateRequestOutput = typeof PUT.types.RequestOutput;
export type DeviceLicenseUpdateResponseOutput = typeof PUT.types.ResponseOutput;
export type DeviceLicenseDeleteUrlParamsOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type DeviceLicenseDeleteRequestOutput =
  typeof DELETE.types.RequestOutput;
export type DeviceLicenseDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { PUT, DELETE } as const;
export default definitions;
