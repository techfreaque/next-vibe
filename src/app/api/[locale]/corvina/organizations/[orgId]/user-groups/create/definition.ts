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

import { MembershipRole, UserGroupOwner, UserGroupType } from "../enums";
import { scopedTranslation } from "./i18n";

const UserGroupCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.UserGroupCreateContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "user-groups", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.endpointDescription" as const,
  icon: "user-plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: UserGroupCreateContainer,
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
        label: "post.description.label" as const,
        description: "post.description.description" as const,
        placeholder: "post.description.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      groupPoliciesEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.groupPoliciesEnabled.label" as const,
        description: "post.groupPoliciesEnabled.description" as const,
        columns: 12,
        schema: z.boolean().default(false),
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
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organizationId" as const,
        schema: z.number(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.type" as const,
        schema: z.enum(UserGroupType),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.owner" as const,
        schema: z.enum(UserGroupOwner),
      }),
      membershipRole: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.membershipRole" as const,
        schema: z.enum(MembershipRole),
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
        name: "my-group",
        description: "My user group",
        groupPoliciesEnabled: false,
      },
    },
    responses: {
      default: {
        id: 42,
        nameResult: "my-group",
        organizationId: 45511,
        type: UserGroupType.STANDARD,
        owner: UserGroupOwner.ORGANIZATION,
        membershipRole: MembershipRole.USER,
      },
    },
  },
});

export type UserGroupsCreateRequestOutput = typeof POST.types.RequestOutput;
export type UserGroupsCreateResponseOutput = typeof POST.types.ResponseOutput;
export type UserGroupsCreateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;

const definitions = { POST } as const;
export default definitions;
