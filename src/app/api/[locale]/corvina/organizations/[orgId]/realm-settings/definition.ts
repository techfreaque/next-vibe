import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
  requestUrlPathParamsField,
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

const RealmSettingsGetContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RealmSettingsGetContainer,
  })),
);

const RealmSettingsPutContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RealmSettingsPutContainer,
  })),
);

const depthSchema = z.coerce.number().min(0).max(100);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "realm-settings"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "settings",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: RealmSettingsGetContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      configDealerMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configDealerMaxDepth" as const,
        schema: z.number(),
      }),
      configHostnameMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configHostnameMaxDepth" as const,
        schema: z.number(),
      }),
      configOwnResourcesMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configOwnResourcesMaxDepth" as const,
        schema: z.number(),
      }),
      configIotMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configIotMaxDepth" as const,
        schema: z.number(),
      }),
      configVpnMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configVpnMaxDepth" as const,
        schema: z.number(),
      }),
      configStoreMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configStoreMaxDepth" as const,
        schema: z.number(),
      }),
      configIpFilteringMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configIpFilteringMaxDepth" as const,
        schema: z.number(),
      }),
      configPrivateAccessMaxDepth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.configPrivateAccessMaxDepth" as const,
        schema: z.number(),
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
        configDealerMaxDepth: 5,
        configHostnameMaxDepth: 3,
        configOwnResourcesMaxDepth: 5,
        configIotMaxDepth: 5,
        configVpnMaxDepth: 5,
        configStoreMaxDepth: 5,
        configIpFilteringMaxDepth: 5,
        configPrivateAccessMaxDepth: 5,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]", "realm-settings"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "settings",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: RealmSettingsPutContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      configDealerMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configDealerMaxDepth.label" as const,
        description: "put.configDealerMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configHostnameMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configHostnameMaxDepth.label" as const,
        description: "put.configHostnameMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configOwnResourcesMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configOwnResourcesMaxDepth.label" as const,
        description: "put.configOwnResourcesMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configIotMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configIotMaxDepth.label" as const,
        description: "put.configIotMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configVpnMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configVpnMaxDepth.label" as const,
        description: "put.configVpnMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configStoreMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configStoreMaxDepth.label" as const,
        description: "put.configStoreMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configIpFilteringMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configIpFilteringMaxDepth.label" as const,
        description: "put.configIpFilteringMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
      }),
      configPrivateAccessMaxDepth: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.configPrivateAccessMaxDepth.label" as const,
        description: "put.configPrivateAccessMaxDepth.description" as const,
        columns: 6,
        schema: depthSchema,
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
        configDealerMaxDepth: 5,
        configHostnameMaxDepth: 3,
        configOwnResourcesMaxDepth: 5,
        configIotMaxDepth: 5,
        configVpnMaxDepth: 5,
        configStoreMaxDepth: 5,
        configIpFilteringMaxDepth: 5,
        configPrivateAccessMaxDepth: 5,
      },
    },
    responses: {
      default: {
        configDealerMaxDepth: 5,
        configHostnameMaxDepth: 3,
        configOwnResourcesMaxDepth: 5,
        configIotMaxDepth: 5,
        configVpnMaxDepth: 5,
        configStoreMaxDepth: 5,
        configIpFilteringMaxDepth: 5,
        configPrivateAccessMaxDepth: 5,
      },
    },
  },
});

export type RealmSettingsGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type RealmSettingsGetResponseOutput = typeof GET.types.ResponseOutput;
export type RealmSettingsPutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type RealmSettingsPutRequestOutput = typeof PUT.types.RequestOutput;
export type RealmSettingsPutResponseOutput = typeof PUT.types.ResponseOutput;

const definitions = { GET, PUT } as const;
export default definitions;
