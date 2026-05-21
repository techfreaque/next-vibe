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

const DeviceLicenseActivateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseActivateContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "activate"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "shield",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_activate"],

  fields: customWidgetObject({
    render: DeviceLicenseActivateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      activationKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.activationKey.label" as const,
        description: "post.activationKey.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      alias: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.alias.label" as const,
        description: "post.alias.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      deviceSerialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceSerialNumber.label" as const,
        description: "post.deviceSerialNumber.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      activateDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.activateDescription.label" as const,
        description: "post.activateDescription.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgResourceId.label" as const,
        description: "post.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      logicalId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.logicalId.label" as const,
        description: "post.logicalId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      numOfSecondsVpn: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.numOfSecondsVpn.label" as const,
        description: "post.numOfSecondsVpn.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      autorenewVpn: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.autorenewVpn.label" as const,
        description: "post.autorenewVpn.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      realm: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.realm" as const,
        schema: z.string().nullable(),
      }),
      logicalIdOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.logicalId" as const,
        schema: z.string().nullable(),
      }),
      gatewayLogicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.gatewayLogicalId" as const,
        schema: z.string().nullable(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.label" as const,
        schema: z.string().nullable(),
      }),
      apiKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.apiKey" as const,
        schema: z.string().nullable(),
      }),
      platformPairingApiUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.platformPairingApiUrl" as const,
        schema: z.string().nullable(),
      }),
      vpnPairingApiUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnPairingApiUrl" as const,
        schema: z.string().nullable(),
      }),
      brokerUrls: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.brokerUrls" as const,
        schema: z.string().nullable(),
      }),
      orgResourceIdOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      vpnKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnKey" as const,
        schema: z.string().nullable(),
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
      numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.numOfSecondsAutoRenewVpn" as const,
        schema: z.number().nullable(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.activationDate" as const,
        schema: dateSchema.nullable(),
      }),
      vpnValidityMonths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnValidityMonths" as const,
        schema: z.number().nullable(),
      }),
      vpnAccountingDisabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnAccountingDisabled" as const,
        schema: z.boolean().nullable(),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.serialNumber" as const,
        schema: z.string().nullable(),
      }),
      activationKeyOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.activationKey" as const,
        schema: z.string(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.used" as const,
        schema: z.boolean(),
      }),
      usedInTrial: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.usedInTrial" as const,
        schema: z.boolean().nullable(),
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.deleted" as const,
        schema: z.boolean(),
      }),
      clientName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.clientName" as const,
        schema: z.string().nullable(),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.notes" as const,
        schema: z.string().nullable(),
      }),
      vpnOtpRequired: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnOtpRequired" as const,
        schema: z.boolean().nullable(),
      }),
      vpnPairingMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnPairingMode" as const,
        schema: z.string().nullable(),
      }),
      vpnLastAttempt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.vpnLastAttempt" as const,
        schema: dateSchema.nullable(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "shield",
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
        activationKey: "ACT-KEY-001",
      },
    },
    responses: {
      default: {
        id: 42,
        realm: "corvina.root",
        logicalIdOut: null,
        gatewayLogicalId: null,
        label: null,
        apiKey: null,
        platformPairingApiUrl: null,
        vpnPairingApiUrl: null,
        brokerUrls: null,
        orgResourceIdOut: null,
        vpnKey: null,
        fromDateVpn: null,
        toDateVpn: null,
        numOfSecondsAutoRenewVpn: null,
        activationDate: null,
        vpnValidityMonths: null,
        vpnAccountingDisabled: null,
        serialNumber: null,
        activationKeyOut: "ACT-KEY-001",
        used: true,
        usedInTrial: null,
        deleted: false,
        clientName: null,
        notes: null,
        vpnOtpRequired: null,
        vpnPairingMode: null,
        vpnLastAttempt: null,
      },
    },
  },
});

export type DeviceLicenseActivateRequestOutput =
  typeof POST.types.RequestOutput;
export type DeviceLicenseActivateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
