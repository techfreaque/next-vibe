/**
 * Chart of Accounts — Account List Endpoint Definition
 * GET — returns full account tree for a company
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

import { AccountSubtypeOptions, AccountTypeOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const CoaAccountListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaAccountListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "account", "list"],
  aliases: ["coa-account-list"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "list",
  category: "accounting",
  subCategory: "Accounts",
  tags: ["tag" as const],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CoaAccountListWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.companyId.label" as const,
        description: "get.companyId.description" as const,
        placeholder: "get.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.number().int().min(1).max(200).optional(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total" as const,
        schema: z.number(),
      }),
      accounts: responseArrayField(scopedTranslation, {
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
              label: "get.response.id" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.code" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.name" as const,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.type" as const,
              options: AccountTypeOptions,
              schema: z.string(),
            }),
            subtype: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.subtype" as const,
              options: AccountSubtypeOptions,
              schema: z.string(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.parentId" as const,
              schema: z.string().nullable(),
            }),
            isPostable: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.isPostable" as const,
              schema: z.boolean(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.isActive" as const,
              schema: z.boolean(),
            }),
            isSystem: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.isSystem" as const,
              schema: z.boolean(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.description" as const,
              schema: z.string().nullable(),
            }),
            sortOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.sortOrder" as const,
              schema: z.number(),
            }),
            companyId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.companyId" as const,
              schema: z.string(),
            }),
          },
        }),
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        page: 1,
        pageSize: 100,
      },
    },
    responses: {
      default: {
        total: 0,
        accounts: [],
      },
    },
  },
});

export type CoaAccountListRequestInput = typeof GET.types.RequestInput;
export type CoaAccountListRequestOutput = typeof GET.types.RequestOutput;
export type CoaAccountListResponseInput = typeof GET.types.ResponseInput;
export type CoaAccountListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
