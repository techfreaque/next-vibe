import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "building-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.string().min(1),
      }),
      orgId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organization.id" as const,
        schema: z.string(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organization.name" as const,
        schema: z.string(),
      }),
      displayName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.organization.displayName" as const,
        schema: z.string().nullable(),
      }),
      enabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.organization.enabled" as const,
        schema: z.boolean().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        fieldType: FieldDataType.DATETIME,
        content: "get.response.organization.createdAt" as const,
        schema: z.string().nullable(),
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
    urlPathParams: {
      default: { id: "org_abc123" },
    },
    responses: {
      default: {
        orgId: "org_abc123",
        name: "acme",
        displayName: "Acme Corp",
        enabled: true,
        createdAt: "2025-01-15T09:30:00.000Z",
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["corvina", "organizations", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "edit-3",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        schema: z.string().min(1),
      }),
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.displayName.label" as const,
        description: "patch.displayName.description" as const,
        placeholder: "patch.displayName.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(200),
      }),
      orgId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.organization.id" as const,
        schema: z.string(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.organization.name" as const,
        schema: z.string(),
      }),
      displayNameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.organization.displayName" as const,
        schema: z.string().nullable(),
      }),
      enabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "patch.response.organization.enabled" as const,
        schema: z.boolean().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        fieldType: FieldDataType.DATETIME,
        content: "patch.response.organization.createdAt" as const,
        schema: z.string().nullable(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
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
    urlPathParams: {
      default: { id: "org_abc123" },
    },
    requests: {
      default: { displayName: "Acme Corp" },
    },
    responses: {
      default: {
        orgId: "org_abc123",
        name: "acme",
        displayNameResult: "Acme Corp",
        enabled: true,
        createdAt: "2025-01-15T09:30:00.000Z",
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[id]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title" as const,
    description: "delete.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        schema: z.string().min(1),
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.deleted" as const,
        schema: z.boolean(),
      }),
      deletedId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.id" as const,
        schema: z.string(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "delete.submitButton.label" as const,
        loadingText: "delete.submitButton.loadingText" as const,
        icon: "trash-2",
        variant: "destructive",
        className: "w-full",
        usage: { request: "data" },
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
    urlPathParams: {
      default: { id: "org_abc123" },
    },
    responses: {
      default: { deleted: true, deletedId: "org_abc123" },
    },
  },
});

export type CorvinaOrganizationGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaOrganizationGetResponseOutput =
  typeof GET.types.ResponseOutput;

export type CorvinaOrganizationPatchUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type CorvinaOrganizationPatchRequestOutput =
  typeof PATCH.types.RequestOutput;
export type CorvinaOrganizationPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

export type CorvinaOrganizationDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type CorvinaOrganizationDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
