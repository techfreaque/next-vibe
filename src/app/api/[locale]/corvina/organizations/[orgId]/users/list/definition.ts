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

import { CorvinaUserOwner } from "../enums";
import { scopedTranslation } from "./i18n";

const UsersListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UsersListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "users", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "users",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.users" as const],
  aliases: ["corvina_users_list"],
  cli: { firstCliArgKey: "orgId" },

  fields: customWidgetObject({
    render: UsersListContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
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
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),
      users: responseArrayField(scopedTranslation, {
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
              content: "get.response.users.id" as const,
              schema: z.number(),
            }),
            username: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.users.username" as const,
              schema: z.string(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.users.email" as const,
              schema: z.string(),
            }),
            firstName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.users.firstName" as const,
              schema: z.string().nullable(),
            }),
            lastName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.users.lastName" as const,
              schema: z.string().nullable(),
            }),
            country: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.users.country" as const,
              schema: z.string().nullable(),
            }),
            serviceAccount: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.users.serviceAccount" as const,
              schema: z.boolean(),
            }),
            mfaEnabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.users.mfaEnabled" as const,
              schema: z.boolean(),
            }),
            owner: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.users.owner" as const,
              schema: z.enum(CorvinaUserOwner),
            }),
            groupPoliciesEnabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.users.groupPoliciesEnabled" as const,
              schema: z.boolean(),
            }),
            userImpersonation: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.users.userImpersonation" as const,
              schema: z.boolean(),
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
        users: [
          {
            id: 1,
            username: "jdoe",
            email: "jdoe@example.com",
            firstName: "John",
            lastName: "Doe",
            country: "US",
            serviceAccount: false,
            mfaEnabled: true,
            owner: CorvinaUserOwner.ORGANIZATION,
            groupPoliciesEnabled: false,
            userImpersonation: false,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        last: true,
      },
    },
  },
});

export type CorvinaUsersListUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type CorvinaUsersListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
