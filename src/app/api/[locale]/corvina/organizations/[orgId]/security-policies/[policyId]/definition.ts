import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
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

import { SecurityPolicyType } from "../enums";
import { scopedTranslation } from "./i18n";

const SecurityPolicyDetailContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.SecurityPolicyDetailContainer,
  })),
);

const SecurityPolicyUpdateContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.SecurityPolicyUpdateContainer,
  })),
);

const SecurityPolicyDeleteContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({
    default: m.SecurityPolicyDeleteContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "security-policies",
    "[policyId]",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: SecurityPolicyDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      policyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.policyId.label" as const,
        description: "get.policyId.description" as const,
        schema: z.coerce.number(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.type" as const,
        schema: z.enum(SecurityPolicyType),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organizationId" as const,
        schema: z.number(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string(),
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
    urlPathParams: { default: { orgId: 45511, policyId: 10 } },
    responses: {
      default: {
        id: 10,
        name: "default-policy",
        type: SecurityPolicyType.STANDARD,
        organizationId: 45511,
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "security-policies",
    "[policyId]",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: SecurityPolicyUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      policyId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.policyId.label" as const,
        description: "put.policyId.description" as const,
        schema: z.coerce.number(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.name.label" as const,
        description: "put.name.description" as const,
        placeholder: "put.name.placeholder" as const,
        columns: 12,
        schema: z.string().min(2).max(200),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.descriptionField.label" as const,
        description: "put.descriptionField.description" as const,
        placeholder: "put.descriptionField.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.id" as const,
        schema: z.number(),
      }),
      nameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.name" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.type" as const,
        schema: z.enum(SecurityPolicyType),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.organizationId" as const,
        schema: z.number(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.orgResourceId" as const,
        schema: z.string(),
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
    urlPathParams: { default: { orgId: 45511, policyId: 10 } },
    requests: { default: { name: "updated-policy", description: "Updated" } },
    responses: {
      default: {
        orgId: 45511,
        policyId: 10,
        id: 10,
        nameResult: "updated-policy",
        type: SecurityPolicyType.STANDARD,
        organizationId: 45511,
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "security-policies",
    "[policyId]",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: SecurityPolicyDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      policyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.policyId.label" as const,
        description: "delete.policyId.description" as const,
        schema: z.coerce.number(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.type" as const,
        schema: z.enum(SecurityPolicyType),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organizationId" as const,
        schema: z.number(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string(),
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
    urlPathParams: { default: { orgId: 45511, policyId: 10 } },
    responses: {
      default: {
        id: 10,
        name: "default-policy",
        type: SecurityPolicyType.STANDARD,
        organizationId: 45511,
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

export type SecurityPolicyDetailGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type SecurityPolicyDetailGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type SecurityPolicyDetailPutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type SecurityPolicyDetailPutRequestOutput =
  typeof PUT.types.RequestOutput;
export type SecurityPolicyDetailPutResponseOutput =
  typeof PUT.types.ResponseOutput;
export type SecurityPolicyDetailDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type SecurityPolicyDetailDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PUT, DELETE } as const;
export default definitions;
