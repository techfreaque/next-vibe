import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
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

import { scopedTranslation } from "./i18n";

const DeviceLicensesListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.DeviceLicensesListContainer })),
);
const DeviceLicenseCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.DeviceLicenseCreateContainer,
  })),
);

const deviceLicenseItemChildren = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.id" as const,
    schema: z.number(),
  }),
  serialNumber: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.serialNumber" as const,
    schema: z.string().nullable(),
  }),
  realm: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.realm" as const,
    schema: z.string().nullable(),
  }),
  logicalId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.logicalId" as const,
    schema: z.string().nullable(),
  }),
  label: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.label" as const,
    schema: z.string().nullable(),
  }),
  apiKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.apiKey" as const,
    schema: z.string().nullable(),
  }),
  orgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.orgResourceId" as const,
    schema: z.string().nullable(),
  }),
  vpnKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.vpnKey" as const,
    schema: z.string().nullable(),
  }),
  fromDateVpn: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.fromDateVpn" as const,
    schema: dateSchema.nullable(),
  }),
  toDateVpn: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.toDateVpn" as const,
    schema: dateSchema.nullable(),
  }),
  numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.numOfSecondsAutoRenewVpn" as const,
    schema: z.number().nullable(),
  }),
  activationDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.activationDate" as const,
    schema: dateSchema.nullable(),
  }),
  used: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.used" as const,
    schema: z.boolean(),
  }),
  deleted: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.deleted" as const,
    schema: z.boolean(),
  }),
  activationKey: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.activationKey" as const,
    schema: z.string(),
  }),
  clientName: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.clientName" as const,
    schema: z.string().nullable(),
  }),
  notes: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.notes" as const,
    schema: z.string().nullable(),
  }),
  vpnEnabled: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.vpnEnabled" as const,
    schema: z.boolean().nullish(),
  }),
  subscriptionStatus: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.subscriptionStatus" as const,
    schema: z
      .enum(["trial", "active", "expiring_soon", "expired", "no_subscription"])
      .optional(),
  }),
  subscriptionEndDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.subscriptionEndDate" as const,
    schema: dateSchema.nullable().optional(),
  }),
  daysUntilExpiry: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.daysUntilExpiry" as const,
    schema: z.number().nullable().optional(),
  }),
  vpnValidityMonths: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.deviceLicenses.vpnValidityMonths" as const,
    schema: z.number().nullable(),
  }),
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "device-licenses", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_list"],

  fields: customWidgetObject({
    render: DeviceLicensesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
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
        schema: z.coerce.number().min(1).optional().default(10),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      deviceLicenses: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: deviceLicenseItemChildren,
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.coerce.number(),
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
    requests: { default: { page: 0, pageSize: 10 } },
    responses: {
      default: {
        deviceLicenses: [
          {
            id: 1,
            serialNumber: "SN-ABC-001",
            realm: "corvina.root",
            logicalId: "device-logical-001",
            label: "Gateway A",
            apiKey: null,
            orgResourceId: "exorde.connex.connectika",
            vpnKey: null,
            fromDateVpn: new Date("2024-01-01"),
            toDateVpn: new Date("2025-01-01"),
            numOfSecondsAutoRenewVpn: null,
            activationDate: new Date("2024-01-01"),
            used: true,
            deleted: false,
            activationKey: "ACT-KEY-001",
            clientName: "Acme Corp",
            notes: null,
            vpnEnabled: true,
            vpnValidityMonths: 12,
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_device_licenses_create"],

  fields: customWidgetObject({
    render: DeviceLicenseCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      serialNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.serialNumber.label" as const,
        description: "post.serialNumber.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      activationKey: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.activationKey.label" as const,
        description: "post.activationKey.description" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      clientName: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.clientName.label" as const,
        description: "post.clientName.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      notes: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.notes.label" as const,
        description: "post.notes.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      vpnEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.vpnEnabled.label" as const,
        description: "post.vpnEnabled.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      dataEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.dataEnabled.label" as const,
        description: "post.dataEnabled.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      vpnStartDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.vpnStartDate.label" as const,
        description: "post.vpnStartDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      vpnEndDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.vpnEndDate.label" as const,
        description: "post.vpnEndDate.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      vpnValidityMonths: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.vpnValidityMonths.label" as const,
        description: "post.vpnValidityMonths.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      vpnAccountingDisabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.vpnAccountingDisabled.label" as const,
        description: "post.vpnAccountingDisabled.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.id" as const,
        schema: z.number(),
      }),
      serialNumberOut: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.serialNumber" as const,
        schema: z.string().nullable(),
      }),
      realm: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.realm" as const,
        schema: z.string().nullable(),
      }),
      logicalId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.logicalId" as const,
        schema: z.string().nullable(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.label" as const,
        schema: z.string().nullable(),
      }),
      apiKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.apiKey" as const,
        schema: z.string().nullable(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      vpnKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.vpnKey" as const,
        schema: z.string().nullable(),
      }),
      fromDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.fromDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      toDateVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.toDateVpn" as const,
        schema: dateSchema.nullable(),
      }),
      numOfSecondsAutoRenewVpn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content:
          "get.response.deviceLicenses.numOfSecondsAutoRenewVpn" as const,
        schema: z.number().nullable(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.activationDate" as const,
        schema: dateSchema.nullable(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.used" as const,
        schema: z.boolean(),
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLicenses.deleted" as const,
        schema: z.boolean(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
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
        clientName: "Acme Corp",
        vpnEnabled: true,
        vpnValidityMonths: 12,
      },
    },
    responses: {
      default: {
        id: 1,
        serialNumberOut: null,
        activationKey: "ACT-KEY-001",
        realm: "corvina.root",
        logicalId: null,
        label: null,
        apiKey: null,
        orgResourceId: null,
        vpnKey: null,
        fromDateVpn: null,
        toDateVpn: null,
        numOfSecondsAutoRenewVpn: null,
        activationDate: null,
        used: false,
        deleted: false,
        clientName: "Acme Corp",
        vpnEnabled: true,
        vpnValidityMonths: 12,
      },
    },
  },
});

export type DeviceLicensesListRequestOutput = typeof GET.types.RequestOutput;
export type DeviceLicensesListResponseOutput = typeof GET.types.ResponseOutput;
export type DeviceLicenseCreateRequestOutput = typeof POST.types.RequestOutput;
export type DeviceLicenseCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
