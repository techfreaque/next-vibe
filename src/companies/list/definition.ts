/**
 * Companies List API Route Definition
 * Lists all companies the calling user is a member of
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  CompanyMemberRole,
  CompanyMemberRoleOptions,
  CompanyType,
  CompanyTypeOptions,
} from "../enum";
import { COMPANIES_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CompanyListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["companies", "list"],
  aliases: [COMPANIES_LIST_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "companies",
  subCategory: "Company Management",
  tags: ["tags.companies", "tags.list"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "building",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CompanyListWidget,
    children: {
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label",
        description: "get.page.description",
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label",
        description: "get.pageSize.description",
        schema: z.number().int().min(1).max(100).optional(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total",
        schema: z.number(),
      }),
      companies: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.name",
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.type",
              enumOptions: CompanyTypeOptions,
              schema: z.enum(CompanyType),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.role",
              enumOptions: CompanyMemberRoleOptions,
              schema: z.enum(CompanyMemberRole),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.isActive",
              schema: z.boolean(),
            }),
            country: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.country",
              schema: z.string().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency",
              schema: z.string().nullable(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.email",
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.createdAt",
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
    requests: {
      default: {
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 1,
        companies: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Acme GmbH",
            type: CompanyType.B2B,
            role: CompanyMemberRole.OWNER,
            isActive: true,
            country: "DE",
            currency: "EUR",
            email: "contact@acme.example.com",
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type CompanyListGetResponseOutput = typeof GET.types.ResponseOutput;
export type CompanyListGetRequestOutput = typeof GET.types.RequestOutput;

const definitions = {
  GET,
} as const;
export default definitions;
