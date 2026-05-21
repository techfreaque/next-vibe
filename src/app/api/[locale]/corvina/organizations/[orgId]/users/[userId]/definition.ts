import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
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

import { CorvinaUserOwner } from "../enums";
import { scopedTranslation } from "./i18n";

const UserDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserDetailContainer })),
);

const UserUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserUpdateContainer })),
);

const UserDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserDeleteContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "users", "[userId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "user",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.users" as const],

  fields: customWidgetObject({
    render: UserDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      userId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.userId.label" as const,
        description: "get.userId.description" as const,
        schema: z.coerce.number(),
      }),

      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.number(),
      }),
      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.username" as const,
        schema: z.string(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.email" as const,
        schema: z.string(),
      }),
      firstName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.firstName" as const,
        schema: z.string().nullable(),
      }),
      lastName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastName" as const,
        schema: z.string().nullable(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.country" as const,
        schema: z.string().nullable(),
      }),
      serviceAccount: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.serviceAccount" as const,
        schema: z.boolean(),
      }),
      mfaEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.mfaEnabled" as const,
        schema: z.boolean(),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.owner" as const,
        schema: z.enum(CorvinaUserOwner),
      }),
      groupPoliciesEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.groupPoliciesEnabled" as const,
        schema: z.boolean(),
      }),
      userImpersonation: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.userImpersonation" as const,
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
    urlPathParams: { default: { orgId: 45511, userId: 42 } },
    responses: {
      default: {
        id: 42,
        username: "jdoe",
        email: "jdoe@example.com",
        firstName: "John",
        lastName: "Doe",
        country: "US",
        serviceAccount: false,
        mfaEnabled: true,
        owner: "ORGANIZATION" as const,
        groupPoliciesEnabled: false,
        userImpersonation: false,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]", "users", "[userId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.users" as const],

  fields: customWidgetObject({
    render: UserUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      userId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.userId.label" as const,
        description: "put.userId.description" as const,
        schema: z.coerce.number(),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "put.email.label" as const,
        description: "put.email.description" as const,
        placeholder: "put.email.placeholder" as const,
        columns: 12,
        schema: z.string().email(),
      }),
      firstName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.firstName.label" as const,
        description: "put.firstName.description" as const,
        placeholder: "put.firstName.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      lastName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.lastName.label" as const,
        description: "put.lastName.description" as const,
        placeholder: "put.lastName.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.country.label" as const,
        description: "put.country.description" as const,
        placeholder: "put.country.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      defaultHomePage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.defaultHomePage.label" as const,
        description: "put.defaultHomePage.description" as const,
        placeholder: "put.defaultHomePage.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      groupPoliciesEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.groupPoliciesEnabled.label" as const,
        description: "put.groupPoliciesEnabled.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      userImpersonation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.userImpersonation.label" as const,
        description: "put.userImpersonation.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.number(),
      }),
      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.username" as const,
        schema: z.string(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.email" as const,
        schema: z.string(),
      }),
      firstName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.firstName" as const,
        schema: z.string().nullable(),
      }),
      lastName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastName" as const,
        schema: z.string().nullable(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.country" as const,
        schema: z.string().nullable(),
      }),
      serviceAccount: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.serviceAccount" as const,
        schema: z.boolean(),
      }),
      mfaEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.mfaEnabled" as const,
        schema: z.boolean(),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.owner" as const,
        schema: z.enum(CorvinaUserOwner),
      }),
      groupPoliciesEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.groupPoliciesEnabled" as const,
        schema: z.boolean(),
      }),
      userImpersonation: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.userImpersonation" as const,
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
    urlPathParams: { default: { orgId: 45511, userId: 42 } },
    requests: {
      default: {
        email: "jdoe@example.com",
        firstName: "John",
        lastName: "Doe",
        country: "US",
        groupPoliciesEnabled: false,
        userImpersonation: false,
      },
    },
    responses: {
      default: {
        id: 42,
        username: "jdoe",
        email: "jdoe@example.com",
        firstName: "John",
        lastName: "Doe",
        country: "US",
        serviceAccount: false,
        mfaEnabled: true,
        owner: "ORGANIZATION" as const,
        groupPoliciesEnabled: false,
        userImpersonation: false,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[orgId]", "users", "[userId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.users" as const],

  fields: customWidgetObject({
    render: UserDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      userId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.userId.label" as const,
        description: "delete.userId.description" as const,
        schema: z.coerce.number(),
      }),

      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.number(),
      }),
      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.username" as const,
        schema: z.string(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.email" as const,
        schema: z.string(),
      }),
      firstName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.firstName" as const,
        schema: z.string().nullable(),
      }),
      lastName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastName" as const,
        schema: z.string().nullable(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.country" as const,
        schema: z.string().nullable(),
      }),
      serviceAccount: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.serviceAccount" as const,
        schema: z.boolean(),
      }),
      mfaEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.mfaEnabled" as const,
        schema: z.boolean(),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.owner" as const,
        schema: z.enum(CorvinaUserOwner),
      }),
      groupPoliciesEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.groupPoliciesEnabled" as const,
        schema: z.boolean(),
      }),
      userImpersonation: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.userImpersonation" as const,
        schema: z.boolean(),
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
    urlPathParams: { default: { orgId: 45511, userId: 42 } },
    responses: {
      default: {
        id: 42,
        username: "jdoe",
        email: "jdoe@example.com",
        firstName: "John",
        lastName: "Doe",
        country: "US",
        serviceAccount: false,
        mfaEnabled: false,
        owner: "ORGANIZATION" as const,
        groupPoliciesEnabled: false,
        userImpersonation: false,
      },
    },
  },
});

export type CorvinaUserGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaUserGetResponseOutput = typeof GET.types.ResponseOutput;
export type CorvinaUserPutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type CorvinaUserPutRequestOutput = typeof PUT.types.RequestOutput;
export type CorvinaUserPutResponseOutput = typeof PUT.types.ResponseOutput;
export type CorvinaUserDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type CorvinaUserDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PUT, DELETE } as const;
export default definitions;
