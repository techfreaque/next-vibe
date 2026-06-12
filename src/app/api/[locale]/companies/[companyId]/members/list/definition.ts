/**
 * Company Members List API Route Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  customWidgetObject,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import companyListDefinitions from "@/app/api/[locale]/companies/list/definition";

import { CompanyMemberRole, CompanyMemberRoleOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";
import { COMPANY_MEMBERS_LIST_ALIAS } from "./constants";

const MembersListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MembersListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["companies", "[companyId]", "members", "list"],
  aliases: [COMPANY_MEMBERS_LIST_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "companies",
  subCategory: "Company Members",
  tags: ["tags.companies", "tags.members", "tags.list"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "users",

  fields: customWidgetObject({
    usage: { request: "urlPathParams", response: true },
    render: MembersListWidgetLazy,
    children: {
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "get.companyId.label",
        description: "get.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: companyListDefinitions.GET,
        labelField: "name",
      }),

      members: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.userId",
              hidden: true,
              schema: z.uuid(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.email",
              schema: z.string().nullable(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.name",
              schema: z.string().nullable(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.role",
              enumOptions: CompanyMemberRoleOptions,
              schema: z.enum(CompanyMemberRole),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.isActive",
              schema: z.boolean(),
            }),
            joinedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.joinedAt",
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        members: [
          {
            id: "456e7890-e89b-12d3-a456-426614174001",
            userId: "789e0123-e89b-12d3-a456-426614174002",
            email: "owner@example.com",
            name: "Jane Owner",
            role: CompanyMemberRole.OWNER,
            isActive: true,
            joinedAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type MembersListGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
