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

import { SecurityPolicyType } from "../enums";
import { scopedTranslation } from "./i18n";

const SecurityPolicyCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SecurityPolicyCreateContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "security-policies", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "shield-plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: SecurityPolicyCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 12,
        schema: z.string().min(2).max(200),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.descriptionField.label" as const,
        description: "post.descriptionField.description" as const,
        placeholder: "post.descriptionField.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      deviceHwIds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.deviceHwIds.label" as const,
        description: "post.deviceHwIds.description" as const,
        placeholder: "post.deviceHwIds.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      nameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.name" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.type" as const,
        schema: z.enum(SecurityPolicyType),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organizationId" as const,
        schema: z.number(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.orgResourceId" as const,
        schema: z.string(),
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
    urlPathParams: { default: { orgId: 45511 } },
    requests: {
      default: {
        name: "my-policy",
        description: "My security policy",
        deviceHwIds: "AABBCCDD",
      },
    },
    responses: {
      default: {
        id: 10,
        nameResult: "my-policy",
        type: SecurityPolicyType.STANDARD,
        organizationId: 45511,
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

export type SecurityPoliciesCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type SecurityPoliciesCreateResponseOutput =
  typeof POST.types.ResponseOutput;
export type SecurityPoliciesCreateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;

const definitions = { POST } as const;
export default definitions;
