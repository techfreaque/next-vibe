import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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

import { CorvinaDeviceStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const DeviceDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeviceDetailContainer })),
);

const DeviceUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeviceUpdateContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "devices", "[deviceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "server",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: DeviceDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.deviceId.label" as const,
        description: "get.deviceId.description" as const,
        schema: z.coerce.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.status" as const,
        schema: z.enum(CorvinaDeviceStatus),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.serialNumber" as const,
        schema: z.string().nullable(),
      }),
      firmwareVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.firmwareVersion" as const,
        schema: z.string().nullable(),
      }),
      connected: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.connected" as const,
        schema: z.boolean(),
      }),
      lastSeen: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastSeen" as const,
        schema: z.string().nullable(),
      }),
      vpnEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.vpnEnabled" as const,
        schema: z.boolean(),
      }),
      dataEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dataEnabled" as const,
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
    urlPathParams: { default: { orgId: 45511, deviceId: 1001 } },
    responses: {
      default: {
        orgId: 45511,
        deviceId: 1001,
        name: "device-001",
        label: "Device 001",
        status: "ACTIVE",
        serialNumber: "SN-001",
        firmwareVersion: "1.2.3",
        connected: true,
        lastSeen: "2025-01-15T09:30:00.000Z",
        vpnEnabled: true,
        dataEnabled: true,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]", "devices", "[deviceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: DeviceUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.deviceId.label" as const,
        description: "put.deviceId.description" as const,
        schema: z.coerce.number(),
      }),
      label: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.label.label" as const,
        description: "put.label.description" as const,
        placeholder: "put.label.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(200),
      }),
      vpnEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.vpnEnabled.label" as const,
        description: "put.vpnEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      dataEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.dataEnabled.label" as const,
        description: "put.dataEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.status" as const,
        schema: z.enum(CorvinaDeviceStatus),
      }),
      serialNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.serialNumber" as const,
        schema: z.string().nullable(),
      }),
      firmwareVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.firmwareVersion" as const,
        schema: z.string().nullable(),
      }),
      connected: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.connected" as const,
        schema: z.boolean(),
      }),
      lastSeen: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastSeen" as const,
        schema: z.string().nullable(),
      }),
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
    urlPathParams: { default: { orgId: 45511, deviceId: 1001 } },
    requests: {
      default: { label: "Device 001", vpnEnabled: true, dataEnabled: true },
    },
    responses: {
      default: {
        orgId: 45511,
        deviceId: 1001,
        name: "device-001",
        label: "Device 001",
        status: "ACTIVE",
        serialNumber: "SN-001",
        firmwareVersion: "1.2.3",
        connected: true,
        lastSeen: "2025-01-15T09:30:00.000Z",
        vpnEnabled: true,
        dataEnabled: true,
      },
    },
  },
});

export type CorvinaDeviceGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaDeviceGetResponseOutput = typeof GET.types.ResponseOutput;
export type CorvinaDevicePutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type CorvinaDevicePutRequestOutput = typeof PUT.types.RequestOutput;
export type CorvinaDevicePutResponseOutput = typeof PUT.types.ResponseOutput;

const definitions = { GET, PUT } as const;
export default definitions;
