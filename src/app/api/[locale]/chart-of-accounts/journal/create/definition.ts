/**
 * Chart of Accounts — Journal Create Endpoint Definition
 * POST — create a manual double-entry journal entry
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestDataArrayField,
  requestField,
  responseField,
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

import { LineTypeOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";

const CoaJournalCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaJournalCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "journal", "create"],
  aliases: ["coa-journal-create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "journalCreate.title" as const,
  titleShort: "journalCreate.titleShort" as const,
  description: "journalCreate.description" as const,
  icon: "plus",
  category: "accounting",
  subCategory: "Journal",
  tags: ["tags.journal" as const],

  fields: customWidgetObject({
    render: CoaJournalCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journalCreate.companyId.label" as const,
        description: "journalCreate.companyId.description" as const,
        placeholder: "journalCreate.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
      }),
      periodId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journalCreate.periodId.label" as const,
        description: "journalCreate.periodId.description" as const,
        placeholder: "journalCreate.periodId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
      }),
      date: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "journalCreate.date.label" as const,
        description: "journalCreate.date.description" as const,
        placeholder: "journalCreate.date.placeholder" as const,
        columns: 6,
        schema: z.string(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journalCreate.entryDescription.label" as const,
        description: "journalCreate.entryDescription.description" as const,
        placeholder: "journalCreate.entryDescription.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      memo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "journalCreate.memo.label" as const,
        description: "journalCreate.memo.description" as const,
        placeholder: "journalCreate.memo.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      lines: requestDataArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "journalCreate.lines.label" as const,
        description: "journalCreate.lines.description" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          title: "journalCreate.lines.label" as const,
          description: "journalCreate.lines.description" as const,
          usage: { request: "data" } as const,
          children: {
            accountId: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "journalCreate.companyId.label" as const,
              description: "journalCreate.companyId.description" as const,
              placeholder: "journalCreate.companyId.placeholder" as const,
              columns: 4,
              schema: z.string().uuid(),
            }),
            type: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "journalCreate.lines.label" as const,
              columns: 4,
              options: LineTypeOptions,
              schema: z.string(),
            }),
            amount: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "journalCreate.lines.label" as const,
              columns: 2,
              schema: z.number().positive(),
            }),
            currency: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "journalCreate.lines.label" as const,
              columns: 2,
              schema: z.string().length(3),
            }),
            description: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "journalCreate.entryDescription.label" as const,
              description:
                "journalCreate.entryDescription.description" as const,
              placeholder:
                "journalCreate.entryDescription.placeholder" as const,
              columns: 12,
              schema: z.string().optional(),
            }),
          },
        }),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "journalCreate.response.id" as const,
        schema: z.string(),
      }),
      entryNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "journalCreate.response.entryNumber" as const,
        schema: z.string(),
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
    title: "journalCreate.success.title" as const,
    description: "journalCreate.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        periodId: "00000000-0000-0000-0000-000000000010",
        date: "2026-01-31",
        description: "Monthly rent payment",
        lines: [
          {
            accountId: "00000000-0000-0000-0000-000000000020",
            type: "DEBIT",
            amount: 1000,
            currency: "EUR",
          },
          {
            accountId: "00000000-0000-0000-0000-000000000021",
            type: "CREDIT",
            amount: 1000,
            currency: "EUR",
          },
        ],
      },
    },
    responses: {
      default: {
        id: "00000000-0000-0000-0000-000000000030",
        entryNumber: "JE-2026-0001",
      },
    },
  },
});

export type CoaJournalCreateRequestInput = typeof POST.types.RequestInput;
export type CoaJournalCreateRequestOutput = typeof POST.types.RequestOutput;
export type CoaJournalCreateResponseInput = typeof POST.types.ResponseInput;
export type CoaJournalCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
