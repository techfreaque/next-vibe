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

import { MembershipRole, UserGroupOwner, UserGroupType } from "../enums";
import { scopedTranslation } from "./i18n";

const UserGroupDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserGroupDetailContainer })),
);

const UserGroupUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserGroupUpdateContainer })),
);

const UserGroupDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserGroupDeleteContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "user-groups", "[groupId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "users",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: UserGroupDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      groupId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.groupId.label" as const,
        description: "get.groupId.description" as const,
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
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organizationId" as const,
        schema: z.number(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.type" as const,
        schema: z.enum(UserGroupType),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.owner" as const,
        schema: z.enum(UserGroupOwner),
      }),
      membershipRole: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.membershipRole" as const,
        schema: z.enum(MembershipRole),
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
    urlPathParams: { default: { orgId: 45511, groupId: 1 } },
    responses: {
      default: {
        id: 1,
        name: "admins",
        organizationId: 45511,
        type: UserGroupType.STANDARD,
        owner: UserGroupOwner.ORGANIZATION,
        membershipRole: MembershipRole.ADMIN,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]", "user-groups", "[groupId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: UserGroupUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      groupId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.groupId.label" as const,
        description: "put.groupId.description" as const,
        schema: z.coerce.number(),
      }),
      membersId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "put.membersId.label" as const,
        description: "put.membersId.description" as const,
        placeholder: "put.membersId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      rolesId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "put.rolesId.label" as const,
        description: "put.rolesId.description" as const,
        placeholder: "put.rolesId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.id" as const,
        schema: z.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.name" as const,
        schema: z.string(),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.organizationId" as const,
        schema: z.number(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.type" as const,
        schema: z.enum(UserGroupType),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.owner" as const,
        schema: z.enum(UserGroupOwner),
      }),
      membershipRole: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "put.response.membershipRole" as const,
        schema: z.enum(MembershipRole),
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
    urlPathParams: { default: { orgId: 45511, groupId: 1 } },
    requests: { default: { membersId: "1, 2", rolesId: "10" } },
    responses: {
      default: {
        orgId: 45511,
        groupId: 1,
        id: 1,
        name: "admins",
        organizationId: 45511,
        type: UserGroupType.STANDARD,
        owner: UserGroupOwner.ORGANIZATION,
        membershipRole: MembershipRole.ADMIN,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[orgId]", "user-groups", "[groupId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: UserGroupDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      groupId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.groupId.label" as const,
        description: "delete.groupId.description" as const,
        schema: z.coerce.number(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.id" as const,
        schema: z.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.name" as const,
        schema: z.string(),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.organizationId" as const,
        schema: z.number(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.type" as const,
        schema: z.enum(UserGroupType),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.owner" as const,
        schema: z.enum(UserGroupOwner),
      }),
      membershipRole: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.membershipRole" as const,
        schema: z.enum(MembershipRole),
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
    urlPathParams: { default: { orgId: 45511, groupId: 1 } },
    responses: {
      default: {
        id: 1,
        name: "admins",
        organizationId: 45511,
        type: UserGroupType.STANDARD,
        owner: UserGroupOwner.ORGANIZATION,
        membershipRole: MembershipRole.ADMIN,
      },
    },
  },
});

export type UserGroupDetailGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type UserGroupDetailGetResponseOutput = typeof GET.types.ResponseOutput;

export type UserGroupDetailPutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type UserGroupDetailPutRequestOutput = typeof PUT.types.RequestOutput;
export type UserGroupDetailPutResponseOutput = typeof PUT.types.ResponseOutput;

export type UserGroupDetailDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type UserGroupDetailDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PUT, DELETE } as const;
export default definitions;
