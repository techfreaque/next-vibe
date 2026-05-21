import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
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

import { MembershipRole, UserGroupOwner, UserGroupType } from "../enums";
import { scopedTranslation } from "./i18n";

const UserGroupListContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({ default: m.UserGroupListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "user-groups", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "users",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: UserGroupListContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.response.totalPages" as const,
        description: "get.response.totalPages" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.response.totalElements" as const,
        description: "get.response.totalElements" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),
      groups: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.groups.id" as const,
              schema: z.number(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.groups.name" as const,
              schema: z.string(),
            }),
            organizationId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.groups.organizationId" as const,
              schema: z.number(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.groups.type" as const,
              schema: z.enum(UserGroupType),
            }),
            owner: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.groups.owner" as const,
              schema: z.enum(UserGroupOwner),
            }),
            membershipRole: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.groups.membershipRole" as const,
              schema: z.enum(MembershipRole),
            }),
          },
        }),
      }),
      totalElements: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalElements" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      last: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.last" as const,
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
    requests: { default: { page: 0, pageSize: 20 } },
    responses: {
      default: {
        groups: [
          {
            id: 1,
            name: "admins",
            organizationId: 45511,
            type: UserGroupType.STANDARD,
            owner: UserGroupOwner.ORGANIZATION,
            membershipRole: MembershipRole.ADMIN,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        last: true,
      },
    },
  },
});

export type UserGroupsListUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type UserGroupsListRequestOutput = typeof GET.types.RequestOutput;
export type UserGroupsListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
