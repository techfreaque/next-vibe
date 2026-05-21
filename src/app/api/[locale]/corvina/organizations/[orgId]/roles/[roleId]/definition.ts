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

import {
  CorvinaPermissionLevel,
  CorvinaPermissionLevelOptions,
  CorvinaRoleOwner,
  CorvinaRoleType,
  CorvinaRoleTypeOptions,
} from "../enums";
import { scopedTranslation } from "./i18n";

const RoleDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RoleDetailContainer })),
);

const RoleUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RoleUpdateContainer })),
);

const RoleDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RoleDeleteContainer })),
);

const roleResponseFields = {
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
  label: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.label" as const,
    schema: z.string().nullable(),
  }),
  resourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.resourceId" as const,
    schema: z.string(),
  }),
  description: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.description" as const,
    schema: z.string().nullable(),
  }),
  type: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.type" as const,
    schema: z.enum(CorvinaRoleType),
  }),
  owner: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.owner" as const,
    schema: z.enum(CorvinaRoleOwner),
  }),
  enabled: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.enabled" as const,
    schema: z.boolean(),
  }),
  defaultStar: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.defaultStar" as const,
    schema: z.boolean(),
  }),
  deviceGeneralPermission: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.deviceGeneralPermission" as const,
    schema: z.enum(CorvinaPermissionLevel),
  }),
  vpnGeneralPermission: responseField(scopedTranslation, {
    type: WidgetType.BADGE,
    content: "get.response.vpnGeneralPermission" as const,
    schema: z.enum(CorvinaPermissionLevel),
  }),
} as const;

const roleResponseOnlyFields = {
  id: roleResponseFields.id,
  name: roleResponseFields.name,
  resourceId: roleResponseFields.resourceId,
  owner: roleResponseFields.owner,
  enabled: roleResponseFields.enabled,
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "roles", "[roleId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.roles" as const],

  fields: customWidgetObject({
    render: RoleDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      roleId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.roleId.label" as const,
        description: "get.roleId.description" as const,
        schema: z.coerce.number(),
      }),
      ...roleResponseFields,
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
    urlPathParams: { default: { orgId: 45511, roleId: 1 } },
    responses: {
      default: {
        id: 1,
        name: "admin",
        label: "Administrator",
        resourceId: "exorde.connex.connectika.admin",
        description: "Full admin access",
        type: CorvinaRoleType.APPLICATION,
        owner: CorvinaRoleOwner.ORGANIZATION,
        enabled: true,
        defaultStar: false,
        deviceGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
        vpnGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "organizations", "[orgId]", "roles", "[roleId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.roles" as const],

  fields: customWidgetObject({
    render: RoleUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgId.label" as const,
        description: "put.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      roleId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.roleId.label" as const,
        description: "put.roleId.description" as const,
        schema: z.coerce.number(),
      }),
      label: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.label.label" as const,
        description: "put.label.description" as const,
        placeholder: "put.label.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).nullable().optional(),
      }),
      description: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.descriptionField.label" as const,
        description: "put.descriptionField.description" as const,
        placeholder: "put.descriptionField.placeholder" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      type: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.type.label" as const,
        description: "put.type.description" as const,
        columns: 6,
        schema: z.enum(CorvinaRoleType),
        options: CorvinaRoleTypeOptions,
      }),
      defaultStar: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.defaultStar.label" as const,
        description: "put.defaultStar.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      deviceGeneralPermission: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.deviceGeneralPermission.label" as const,
        description: "put.deviceGeneralPermission.description" as const,
        columns: 6,
        schema: z
          .enum(CorvinaPermissionLevel)
          .default(CorvinaPermissionLevel.NONE),
        options: CorvinaPermissionLevelOptions,
      }),
      vpnGeneralPermission: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.vpnGeneralPermission.label" as const,
        description: "put.vpnGeneralPermission.description" as const,
        columns: 6,
        schema: z
          .enum(CorvinaPermissionLevel)
          .default(CorvinaPermissionLevel.NONE),
        options: CorvinaPermissionLevelOptions,
      }),
      ...roleResponseOnlyFields,
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
    urlPathParams: { default: { orgId: 45511, roleId: 1 } },
    requests: {
      default: {
        label: "Administrator",
        type: CorvinaRoleType.APPLICATION,
        defaultStar: false,
        deviceGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
        vpnGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
      },
    },
    responses: {
      default: {
        id: 1,
        name: "admin",
        label: "Administrator",
        resourceId: "exorde.connex.connectika.admin",
        description: "Full admin access",
        type: CorvinaRoleType.APPLICATION,
        owner: CorvinaRoleOwner.ORGANIZATION,
        enabled: true,
        defaultStar: false,
        deviceGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
        vpnGeneralPermission: CorvinaPermissionLevel.ADMINISTRATOR,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[orgId]", "roles", "[roleId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.roles" as const],

  fields: customWidgetObject({
    render: RoleDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      roleId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.roleId.label" as const,
        description: "delete.roleId.description" as const,
        schema: z.coerce.number(),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
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
    urlPathParams: { default: { orgId: 45511, roleId: 1 } },
    responses: {
      default: { success: true, message: "Role deleted." },
    },
  },
});

export type CorvinaRoleGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaRoleGetResponseOutput = typeof GET.types.ResponseOutput;
export type CorvinaRolePutUrlVariablesOutput =
  typeof PUT.types.UrlVariablesOutput;
export type CorvinaRolePutRequestOutput = typeof PUT.types.RequestOutput;
export type CorvinaRolePutResponseOutput = typeof PUT.types.ResponseOutput;
export type CorvinaRoleDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type CorvinaRoleDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PUT, DELETE } as const;
export default definitions;
