import { z } from "zod";

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
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label" as const,
        schema: z.string(),
      }),
      hwId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hwId" as const,
        schema: z.string(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      groups: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.groups" as const,
        schema: z.array(z.string()),
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
        label: "Device 001",
        hwId: "DEADBEEF",
        orgResourceId: "exorde.connex.connectika",
        groups: [],
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["corvina", "organizations", "[orgId]", "devices", "[deviceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.info" as const,
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
        label: "patch.orgId.label" as const,
        description: "patch.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.deviceId.label" as const,
        description: "patch.deviceId.description" as const,
        schema: z.coerce.number(),
      }),
      label: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.label.label" as const,
        description: "patch.label.description" as const,
        placeholder: "patch.label.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(200).optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.description.label" as const,
        description: "patch.description.description" as const,
        placeholder: "patch.description.placeholder" as const,
        columns: 12,
        schema: z.string().max(500).optional(),
      }),
      serialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.serialNumber.label" as const,
        description: "patch.serialNumber.description" as const,
        placeholder: "patch.serialNumber.placeholder" as const,
        columns: 12,
        schema: z.string().max(200).optional(),
      }),
      hwId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hwId" as const,
        schema: z.string(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      groups: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.groups" as const,
        schema: z.array(z.string()),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "patch.submitButton.label" as const,
        loadingText: "patch.submitButton.loadingText" as const,
        icon: "save",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511, deviceId: 1001 } },
    requests: {
      default: {
        label: "Device 001",
        description: "My device",
        serialNumber: "SN-001",
      },
    },
    responses: {
      default: {
        orgId: 45511,
        deviceId: 1001,
        label: "Device 001",
        hwId: "DEADBEEF",
        orgResourceId: "exorde.connex.connectika",
        groups: [],
      },
    },
  },
});

export type CorvinaDeviceGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaDeviceGetResponseOutput = typeof GET.types.ResponseOutput;
export type CorvinaDevicePatchUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type CorvinaDevicePatchRequestOutput = typeof PATCH.types.RequestOutput;
export type CorvinaDevicePatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = { GET, PATCH } as const;
export default definitions;
