/**
 * Chart of Accounts — Journal Entry Get Endpoint Definition
 * GET — retrieve a single journal entry with all its lines
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
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const CoaJournalEntryGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaJournalEntryGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "journal", "[entryId]", "get"],
  aliases: ["coa-journal-entry-get"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "journalEntryGet.title",
  titleShort: "journalEntryGet.titleShort",
  description: "journalEntryGet.description",
  icon: "file-text",
  category: "accounting",
  subCategory: "Journal",
  tags: ["tags.journal" as const],

  fields: customWidgetObject({
    render: CoaJournalEntryGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      entryId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "journalEntryGet.entryId.label",
        description: "journalEntryGet.entryId.description",
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "entryNumber",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.id",
            hidden: true,
            schema: z.string().uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.companyId",
            schema: z.string().uuid(),
          }),
          periodId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.periodId",
            schema: z.string().uuid(),
          }),
          entryNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.entryNumber",
            schema: z.string(),
          }),
          date: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.date",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.description",
            schema: z.string(),
          }),
          memo: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.memo",
            schema: z.string().nullable(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.status",
            schema: z.string(),
          }),
          sourceType: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.sourceType",
            schema: z.string(),
          }),
          sourceId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.sourceId",
            schema: z.string().uuid().nullable(),
          }),
          postedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.postedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          reversalOfId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "journalEntryGet.response.reversalOfId",
            schema: z.string().uuid().nullable(),
          }),
          lines: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                lineId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.lineId",
                  schema: z.string().uuid(),
                }),
                accountId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.accountId",
                  schema: z.string().uuid(),
                }),
                lineType: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.lineType",
                  schema: z.string(),
                }),
                amount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.amount",
                  schema: z.number(),
                }),
                currency: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.currency",
                  schema: z.string(),
                }),
                lineDescription: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "journalEntryGet.response.lineDescription",
                  schema: z.string().nullable(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "journalEntryGet.success.title",
    description: "journalEntryGet.success.description",
  },

  examples: {
    urlPathParams: {
      default: { entryId: "00000000-0000-0000-0000-000000000003" },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "00000000-0000-0000-0000-000000000003",
          companyId: "00000000-0000-0000-0000-000000000001",
          periodId: "00000000-0000-0000-0000-000000000002",
          entryNumber: "JE-2024-0001",
          date: new Date("2024-01-15"),
          description: "Monthly rent payment",
          memo: null,
          status: "POSTED",
          sourceType: "MANUAL",
          sourceId: null,
          postedAt: new Date("2024-01-15"),
          reversalOfId: null,
          lines: [],
        },
      },
    },
  },
});

export type CoaJournalEntryGetRequestOutput = typeof GET.types.RequestOutput;
export type CoaJournalEntryGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
