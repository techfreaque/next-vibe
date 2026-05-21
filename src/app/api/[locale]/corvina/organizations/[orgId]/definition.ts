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

import { CorvinaOrgStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const OrgDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrgDetailContainer })),
);

const OrgUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrgUpdateContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "building",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: OrgDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
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
        schema: z.enum(CorvinaOrgStatus),
      }),
      resourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.resourceId" as const,
        schema: z.string(),
      }),
      privateAccess: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.privateAccess" as const,
        schema: z.boolean(),
      }),
      allowDisablePrivateAccess: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.allowDisablePrivateAccess" as const,
        schema: z.boolean(),
      }),
      hostname: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hostname" as const,
        schema: z.string().nullable(),
      }),
      hostnameAllowed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.hostnameAllowed" as const,
        schema: z.boolean(),
      }),
      dataEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dataEnabled" as const,
        schema: z.boolean(),
      }),
      vpnEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.vpnEnabled" as const,
        schema: z.boolean(),
      }),
      vpnPairingMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.vpnPairingMode" as const,
        schema: z.string().nullable(),
      }),
      vpnOtpRequired: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.vpnOtpRequired" as const,
        schema: z.boolean(),
      }),
      ipAddressesWhitelist: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.ipAddressesWhitelist" as const,
        schema: z.array(z.string()),
      }),
      userCanAccess: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.userCanAccess" as const,
        schema: z.boolean(),
      }),
      storeEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.storeEnabled" as const,
        schema: z.boolean(),
      }),
      dataTemporarilyDisabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dataTemporarilyDisabled" as const,
        schema: z.boolean(),
      }),
      mfaRequired: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.mfaRequired" as const,
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
    urlPathParams: { default: { orgId: 45511 } },
    responses: {
      default: {
        orgId: 45511,
        name: "connectika",
        label: "Connectika",
        status: "DONE",
        resourceId: "exorde.connex.connectika",
        privateAccess: false,
        allowDisablePrivateAccess: false,
        hostname: null,
        hostnameAllowed: false,
        dataEnabled: true,
        vpnEnabled: true,
        vpnPairingMode: "CC2",
        vpnOtpRequired: false,
        ipAddressesWhitelist: null,
        userCanAccess: true,
        storeEnabled: false,
        dataTemporarilyDisabled: false,
        mfaRequired: false,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: OrgUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.id.label" as const,
        description: "put.id.description" as const,
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
      hostname: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.hostname.label" as const,
        description: "put.hostname.description" as const,
        placeholder: "put.hostname.placeholder" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
      }),
      ipAddressesWhitelist: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.ipAddressesWhitelist.label" as const,
        description: "put.ipAddressesWhitelist.description" as const,
        placeholder: "put.ipAddressesWhitelist.placeholder" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
      }),
      privateAccess: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.privateAccess.label" as const,
        description: "put.privateAccess.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      allowDisablePrivateAccess: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.allowDisablePrivateAccess.label" as const,
        description: "put.allowDisablePrivateAccess.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      allowHostname: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.allowHostname.label" as const,
        description: "put.allowHostname.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      dataEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.dataEnabled.label" as const,
        description: "put.dataEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      vpnEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.vpnEnabled.label" as const,
        description: "put.vpnEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      storeEnabled: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.storeEnabled.label" as const,
        description: "put.storeEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      mfaRequired: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.mfaRequired.label" as const,
        description: "put.mfaRequired.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.status" as const,
        schema: z.enum(CorvinaOrgStatus),
      }),
      resourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.resourceId" as const,
        schema: z.string(),
      }),
      hostnameAllowed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.hostnameAllowed" as const,
        schema: z.boolean(),
      }),
      vpnPairingMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.vpnPairingMode" as const,
        schema: z.string().nullable(),
      }),
      vpnOtpRequired: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.vpnOtpRequired" as const,
        schema: z.boolean(),
      }),
      userCanAccess: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.userCanAccess" as const,
        schema: z.boolean(),
      }),
      dataTemporarilyDisabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dataTemporarilyDisabled" as const,
        schema: z.boolean(),
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
    urlPathParams: { default: { orgId: 45511 } },
    requests: {
      default: {
        label: "Connectika",
        hostname: "",
        ipAddressesWhitelist: "",
        privateAccess: false,
        allowDisablePrivateAccess: false,
        allowHostname: false,
        dataEnabled: true,
        vpnEnabled: true,
        storeEnabled: false,
        mfaRequired: false,
      },
    },
    responses: {
      default: {
        orgId: 45511,
        name: "connectika",
        label: "Connectika",
        status: "DONE",
        resourceId: "exorde.connex.connectika",
        privateAccess: false,
        allowDisablePrivateAccess: false,
        hostname: null,
        hostnameAllowed: false,
        dataEnabled: true,
        vpnEnabled: true,
        vpnPairingMode: "CC2",
        vpnOtpRequired: false,
        ipAddressesWhitelist: null,
        userCanAccess: true,
        storeEnabled: false,
        dataTemporarilyDisabled: false,
        mfaRequired: false,
      },
    },
  },
});

export type CorvinaOrganizationGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaOrganizationGetResponseOutput =
  typeof GET.types.ResponseOutput;

export type CorvinaOrganizationPutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type CorvinaOrganizationPutRequestOutput =
  typeof PUT.types.RequestOutput;
export type CorvinaOrganizationPutResponseOutput =
  typeof PUT.types.ResponseOutput;

const definitions = { GET, PUT } as const;
export default definitions;
