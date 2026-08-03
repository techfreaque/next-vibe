/**
 * Chart of Accounts — Journal List Endpoint Definition
 * GET — list journal entries with filters
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
  JournalEntryStatusOptions,
  JournalSourceTypeOptions,
} from "../../enum";
import { scopedTranslation } from "../../i18n";

const CoaJournalListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaJournalListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "journal", "list"],
  aliases: ["coa-journal-list"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "journalList.title" as const,
  titleShort: "journalList.titleShort" as const,
  description: "journalList.description" as const,
  icon: "list",
  category: "accounting",
  subCategory: "Journal",
  tags: ["tags.journal" as const],

  fields: customWidgetObject({
    render: CoaJournalListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journalList.companyId.label" as const,
        description: "journalList.companyId.description" as const,
        placeholder: "journalList.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      periodId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journalList.periodId.label" as const,
        description: "journalList.periodId.description" as const,
        placeholder: "journalList.periodId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "journalList.status.label" as const,
        description: "journalList.status.description" as const,
        placeholder: "journalList.status.placeholder" as const,
        columns: 6,
        options: JournalEntryStatusOptions,
        schema: z.string().optional(),
      }),
      sourceType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "journalList.sourceType.label" as const,
        description: "journalList.sourceType.description" as const,
        placeholder: "journalList.sourceType.placeholder" as const,
        columns: 6,
        options: JournalSourceTypeOptions,
        schema: z.string().optional(),
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "journalList.dateFrom.label" as const,
        description: "journalList.dateFrom.description" as const,
        placeholder: "journalList.dateFrom.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "journalList.dateTo.label" as const,
        description: "journalList.dateTo.description" as const,
        placeholder: "journalList.dateTo.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "journalList.page.label" as const,
        columns: 6,
        schema: z.number().int().min(1).default(1),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "journalList.pageSize.label" as const,
        columns: 6,
        schema: z.number().int().min(1).max(100).default(20),
      }),
      entries: responseArrayField(scopedTranslation, {
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
              label: "journalList.response.id" as const,
              schema: z.string(),
            }),
            entryNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "journalList.response.entryNumber" as const,
              schema: z.string(),
            }),
            date: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "journalList.response.date" as const,
              schema: dateSchema,
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "journalList.response.description" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "journalList.response.status" as const,
              options: JournalEntryStatusOptions,
              schema: z.string(),
            }),
            sourceType: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "journalList.response.sourceType" as const,
              options: JournalSourceTypeOptions,
              schema: z.string(),
            }),
            postedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "journalList.response.postedAt" as const,
              schema: dateSchema.nullable(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "journalList.response.totalCount" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "journalList.success.title" as const,
    description: "journalList.success.description" as const,
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
        entries: [],
        totalCount: 0,
      },
    },
  },
});

export type CoaJournalListRequestInput = typeof GET.types.RequestInput;
export type CoaJournalListRequestOutput = typeof GET.types.RequestOutput;
export type CoaJournalListResponseInput = typeof GET.types.ResponseInput;
export type CoaJournalListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
