/**
 * List Estimates Endpoint
 * GET — paginated list of estimates for a company
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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

import {
  EstimateStatus,
  EstimateStatusDB,
  EstimateStatusOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";

const EstimateListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EstimateListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "estimate", "list"],
  aliases: ["payment-estimate-list"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "list" as const,
  tags: [
    "tags.payment" as const,
    "tags.estimate" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EstimateListWidgetLazy,
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

      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.label",
        placeholder: "search.placeholder",
        description: "search.description",
        schema: z.string().trim().max(160).optional(),
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "status.label" as const,
        description: "status.description" as const,
        placeholder: "status.placeholder" as const,
        columns: 6,
        options: EstimateStatusOptions,
        schema: z.enum(EstimateStatusDB).optional(),
      }),

      customerId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "customerId.label" as const,
        description: "customerId.description" as const,
        columns: 6,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (await import("@/users/list/definition")).default.GET,
        labelField: "privateName",
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "page.label" as const,
        description: "page.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "pageSize.label" as const,
        description: "pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // RESPONSE FIELDS
      hasFilters: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "page.label",
        schema: z.number(),
      }),
      pageSizeApplied: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "pageSize.label",
        schema: z.number(),
      }),
      pageCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.pageCount",
        schema: z.number(),
      }),
      selectedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "companyId.label",
        schema: z.string().nullable(),
      }),
      selectedCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "companyId.label",
        schema: z.string().nullable(),
      }),

      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total" as const,
        schema: z.number(),
      }),

      estimates: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            companyId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "companyId.label",
              schema: z.string().nullable(),
            }),
            companyName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "companyId.label",
              schema: z.string().nullable(),
            }),
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.id" as const,
              schema: z.string(),
            }),
            estimateNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.estimateNumber" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.status" as const,
              options: EstimateStatusOptions,
              schema: z.enum(EstimateStatusDB),
            }),
            customerId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.customerId" as const,
              schema: z.string().nullable(),
            }),
            customerName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.customerName" as const,
              schema: z.string().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency" as const,
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.total" as const,
              schema: z.number(),
            }),
            validUntil: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.validUntil" as const,
              schema: dateSchema.nullable(),
            }),
            lineCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.lineCount" as const,
              schema: z.number(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.createdAt" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.updatedAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  options: {
    formOptions: { autoSubmit: true, debounceMs: 300, persistForm: false },
  },

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

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        page: 1,
        pageSize: 20,
      },
      secondPage: {
        companyId: "00000000-0000-0000-0000-000000000001",
        page: 2,
        pageSize: 1,
      },
      emptyFilter: {
        companyId: "00000000-0000-0000-0000-000000000001",
        search: "ZZ-NO-MATCH",
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 1,
        hasFilters: true,
        currentPage: 1,
        pageSizeApplied: 20,
        pageCount: 1,
        selectedCompanyId: "00000000-0000-0000-0000-000000000001",
        selectedCompanyName: "Harbour Ledger & Supply",
        estimates: [
          {
            id: "456e7890-e89b-12d3-a456-426614174000",
            companyId: "00000000-0000-0000-0000-000000000001",
            companyName: "Harbour Ledger & Supply",
            estimateNumber: "EST-3042",
            customerId: "00000000-0000-0000-0000-000000000003",
            customerName: "South Quay Design and Construction",
            currency: "CHF",
            status: EstimateStatus.ACCEPTED,
            total: 690,
            validUntil: new Date("2026-12-05T00:00:00.000Z"),
            lineCount: 3,
            createdAt: new Date("2026-11-04T00:00:00.000Z"),
            updatedAt: new Date("2026-11-09T00:00:00.000Z"),
          },
        ],
      },
      secondPage: {
        total: 2,
        hasFilters: true,
        currentPage: 2,
        pageSizeApplied: 1,
        pageCount: 2,
        selectedCompanyId: "00000000-0000-0000-0000-000000000001",
        selectedCompanyName: "Harbour Ledger & Supply",
        estimates: [
          {
            id: "456e7890-e89b-12d3-a456-426614174000",
            companyId: "00000000-0000-0000-0000-000000000001",
            companyName: "Harbour Ledger & Supply",
            estimateNumber: "EST-3042",
            customerId: "00000000-0000-0000-0000-000000000003",
            customerName: "South Quay Design and Construction",
            currency: "CHF",
            status: EstimateStatus.ACCEPTED,
            total: 690,
            validUntil: new Date("2026-12-05T00:00:00.000Z"),
            lineCount: 3,
            createdAt: new Date("2026-11-04T00:00:00.000Z"),
            updatedAt: new Date("2026-11-09T00:00:00.000Z"),
          },
        ],
      },
      emptyFilter: {
        total: 0,
        hasFilters: true,
        currentPage: 1,
        pageSizeApplied: 20,
        pageCount: 1,
        selectedCompanyId: "00000000-0000-0000-0000-000000000001",
        selectedCompanyName: "Harbour Ledger & Supply",
        estimates: [],
      },
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
});

export type EstimateListRequestInput = typeof GET.types.RequestInput;
export type EstimateListRequestOutput = typeof GET.types.RequestOutput;
export type EstimateListResponseInput = typeof GET.types.ResponseInput;
export type EstimateListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
