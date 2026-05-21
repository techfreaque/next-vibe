import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
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

const DeviceUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeviceUpdateContainer })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "devices",
    "[deviceId]",
    "update",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: DeviceUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.orgId.label" as const,
        description: "patch.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.deviceId.label" as const,
        description: "patch.deviceId.description" as const,
        schema: z.string().min(1),
      }),
      label: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.label.label" as const,
        description: "patch.label.description" as const,
        placeholder: "patch.label.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.descriptionField.label" as const,
        description: "patch.descriptionField.description" as const,
        placeholder: "patch.descriptionField.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      serialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.serialNumber.label" as const,
        description: "patch.serialNumber.description" as const,
        placeholder: "patch.serialNumber.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.id" as const,
        schema: z.number(),
      }),
      labelResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.label" as const,
        schema: z.string(),
      }),
      hwId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.hwId" as const,
        schema: z.string(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.orgResourceId" as const,
        schema: z.string().nullable(),
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
    urlPathParams: {
      default: { orgId: 45564, deviceId: "sNgo2bZFPt6IgNEGFpOrrw" },
    },
    requests: {
      default: { label: "Updated Device Label" },
    },
    responses: {
      default: {
        id: 1001,
        labelResult: "Updated Device Label",
        hwId: "sNgo2bZFPt6IgNEGFpOrrw",
        orgResourceId: null,
      },
    },
  },
});

export type DeviceUpdateUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type DeviceUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type DeviceUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
