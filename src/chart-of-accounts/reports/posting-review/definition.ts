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
  ReviewIssue,
  ReviewIssueDB,
  ReviewIssueOptions,
  ReviewReason,
  ReviewReasonDB,
} from "./enum";
import { scopedTranslation } from "./i18n";

const PostingReviewWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.PostingReviewWidget,
  })),
);

const count = {
  type: WidgetType.TEXT,
  schema: z.number().int().nonnegative(),
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "reports", "posting-review"],
  aliases: ["coa-posting-review"],
  allowedRoles: [UserRole.ADMIN],
  title: "title",
  titleShort: "title",
  description: "description",
  icon: "shield",
  category: "accounting",
  subCategory: "Ledger",
  tags: ["tag"],
  options: {
    formOptions: { autoSubmit: true, debounceMs: 150 },
  },
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PostingReviewWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company.label",
        description: "company.description",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "filters.issue",
        options: ReviewIssueOptions,
        schema: z.enum(ReviewIssueDB).optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "pagination.pageLabel",
        schema: z.coerce.number().int().min(1).max(100_000).default(1),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "pagination.pageSize",
        schema: z.coerce.number().int().min(1).max(100).default(25),
      }),
      reportCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().nullable(),
      }),
      reportCompanyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company.label",
        schema: z.string().nullable(),
      }),
      filterKind: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(ReviewIssueDB).nullable(),
      }),
      currentPage: responseField(scopedTranslation, {
        ...count,
        label: "pagination.pageLabel",
      }),
      totalPages: responseField(scopedTranslation, {
        ...count,
        label: "pagination.totalPages",
      }),
      matchedCount: responseField(scopedTranslation, {
        ...count,
        label: "filters.matches",
      }),
      counts: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        usage: { response: true },
        children: {
          missingLines: responseField(scopedTranslation, {
            ...count,
            label: "issues.missingLines",
          }),
          invalidLegs: responseField(scopedTranslation, {
            ...count,
            label: "issues.invalidLegs",
          }),
          invoiceLinks: responseField(scopedTranslation, {
            ...count,
            label: "issues.invoiceLink",
          }),
          billLinks: responseField(scopedTranslation, {
            ...count,
            label: "issues.billLink",
          }),
        },
      }),
      rows: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          usage: { response: true },
          children: {
            kind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "filters.issue",
              schema: z.enum(ReviewIssueDB),
            }),
            reason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.reason",
              schema: z.enum(ReviewReasonDB),
            }),
            entityId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid(),
            }),
            reference: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.record",
              schema: z.string().nullable(),
            }),
            counterparty: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.counterparty",
              schema: z.string().nullable(),
            }),
            recordDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "columns.date",
              schema: z.iso.date(),
            }),
          },
        }),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    requests: {
      default: {
        companyId: "36578b2b-c5cb-46ba-ad7e-0c2b73828739",
        kind: ReviewIssue.BILL_LINK,
        page: 1,
        pageSize: 25,
      },
    },
    responses: {
      default: {
        reportCompanyId: "36578b2b-c5cb-46ba-ad7e-0c2b73828739",
        reportCompanyName: "Example Company",
        filterKind: ReviewIssue.BILL_LINK,
        currentPage: 1,
        totalPages: 1,
        matchedCount: 1,
        counts: {
          missingLines: 0,
          invalidLegs: 0,
          invoiceLinks: 0,
          billLinks: 1,
        },
        rows: [
          {
            kind: ReviewIssue.BILL_LINK,
            reason: ReviewReason.NO_BACKLINK,
            entityId: "616726d9-dacb-4cd9-ae41-b622e97d37cd",
            reference: "SUP-204",
            counterparty: "Example Supplier",
            recordDate: "2026-11-03",
          },
        ],
      },
    },
  },
});

export type PostingReviewRequest = typeof GET.types.RequestOutput;
export type PostingReviewResponse = typeof GET.types.ResponseOutput;

export default { GET };
