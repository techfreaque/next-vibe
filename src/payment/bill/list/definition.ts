/**
 * AP Bill List Endpoint Definition
 * GET — list bills for a company with optional status filter and pagination
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
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

import { BillStatus, BillStatusDB, BillStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const BillListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "bill", "list"],
  aliases: ["payment-bill-list"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "list" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.ap" as const],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: BillListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "status.label" as const,
        description: "status.description" as const,
        placeholder: "status.placeholder" as const,
        options: BillStatusOptions,
        schema: z.enum(BillStatusDB).optional(),
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "page.label" as const,
        description: "page.description" as const,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "pageSize.label" as const,
        description: "pageSize.description" as const,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // RESPONSE FIELDS
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalCount" as const,
        schema: z.number(),
      }),

      bills: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.id" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            supplierName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.supplierName" as const,
              schema: z.string(),
            }),
            billNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.billNumber" as const,
              schema: z.string().nullable(),
            }),
            billDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.billDate" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
            dueDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.dueDate" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency" as const,
              schema: z.string(),
            }),
            billTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.billTotal" as const,
              schema: z.number(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              enumOptions: BillStatusOptions,
              schema: z.enum(BillStatusDB),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.createdAt" as const,
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
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        totalCount: 1,
        bills: [
          {
            id: "456e7890-e89b-12d3-a456-426614174000",
            supplierName: "Acme GmbH",
            billNumber: "INV-2024-001",
            billDate: new Date("2024-01-15T00:00:00.000Z"),
            dueDate: new Date("2024-02-15T00:00:00.000Z"),
            currency: "EUR",
            billTotal: 1190,
            status: BillStatus.DRAFT,
            createdAt: new Date("2024-01-15T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type BillListRequestOutput = typeof GET.types.RequestOutput;
export type BillListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
