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

const DeviceLicenseDeviceGetContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseDeviceGetContainer,
  })),
);
const DeviceLicenseDevicePostContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseDevicePostContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "device-licenses", "device"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "cpu",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaDeviceLicenses",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_device_get"],

  fields: customWidgetObject({
    render: DeviceLicenseDeviceGetContainer,
    usage: { request: "data", response: true } as const,
    children: {
      serialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.serialNumber.label" as const,
        description: "get.serialNumber.description" as const,
        placeholder: "get.serialNumber.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      activationKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.activationKey.label" as const,
        description: "get.activationKey.description" as const,
        placeholder: "get.activationKey.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      logicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.logicalId" as const,
        schema: z.string().nullable(),
      }),
      realm: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.realm" as const,
        schema: z.string().nullable(),
      }),
      gatewayLogicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.gatewayLogicalId" as const,
        schema: z.string().nullable(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label" as const,
        schema: z.string().nullable(),
      }),
      apiKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.apiKey" as const,
        schema: z.string().nullable(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      vpnKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.vpnKey" as const,
        schema: z.string().nullable(),
      }),
      fromDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.fromDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      toDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.toDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.numOfSecondsAutoRenewVpn" as const,
        schema: z.number().nullable(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.activationDate" as const,
        schema: dateSchema.nullable(),
      }),
      vpnValidityMonths: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.vpnValidityMonths" as const,
        schema: z.number().nullable(),
      }),
      vpnAccountingDisabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.vpnAccountingDisabled" as const,
        schema: z.boolean().nullable(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "get.submitButton.label" as const,
        loadingText: "get.submitButton.loadingText" as const,
        icon: "cpu",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
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
    requests: {
      default: {
        serialNumber: "SN-ABC-001",
        activationKey: "ACT-KEY-XXXX",
      },
    },
    responses: {
      default: {
        logicalId: "device-logical-001",
        realm: "corvina.root",
        gatewayLogicalId: null,
        label: null,
        apiKey: null,
        orgResourceId: "exorde.connex.connectika",
        vpnKey: null,
        fromDateVpn: null,
        toDateVpn: null,
        numOfSecondsAutoRenewVpn: null,
        activationDate: null,
        vpnValidityMonths: 12,
        vpnAccountingDisabled: null,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "device"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "cpu",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaDeviceLicenses",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_device"],

  fields: customWidgetObject({
    render: DeviceLicenseDevicePostContainer,
    usage: { request: "data", response: true } as const,
    children: {
      serialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.serialNumber.label" as const,
        description: "post.serialNumber.description" as const,
        placeholder: "post.serialNumber.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      activationKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.activationKey.label" as const,
        description: "post.activationKey.description" as const,
        placeholder: "post.activationKey.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      logicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.logicalId" as const,
        schema: z.string().nullable(),
      }),
      realm: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.realm" as const,
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
      orgResourceId: responseField(scopedTranslation, {
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
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "cpu",
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
        serialNumber: "SN-ABC-001",
        activationKey: "ACT-KEY-XXXX",
      },
    },
    responses: {
      default: {
        logicalId: "device-logical-001",
        realm: "corvina.root",
        gatewayLogicalId: null,
        label: null,
        apiKey: null,
        orgResourceId: "exorde.connex.connectika",
        vpnKey: null,
        fromDateVpn: null,
        toDateVpn: null,
        numOfSecondsAutoRenewVpn: null,
        activationDate: null,
        vpnValidityMonths: 12,
        vpnAccountingDisabled: null,
      },
    },
  },
});

export type DeviceLicenseDeviceGetRequestOutput =
  typeof GET.types.RequestOutput;
export type DeviceLicenseDeviceGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type DeviceLicenseDevicePostRequestOutput =
  typeof POST.types.RequestOutput;
export type DeviceLicenseDevicePostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
