/**
 * Chart of Accounts — Journal Reverse Endpoint Definition
 * POST — create a reversal entry mirroring debits/credits
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import journalListDefinitions from "@/app/api/[locale]/chart-of-accounts/journal/list/definition";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../../i18n";

const CoaJournalReverseWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaJournalReverseWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "journal", "[entryId]", "reverse"],
  aliases: ["coa-journal-reverse"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "journalReverse.title" as const,
  titleShort: "journalReverse.titleShort" as const,
  description: "journalReverse.description" as const,
  icon: "refresh-cw",
  category: "accounting",
  subCategory: "Journal",
  tags: ["tags.journal" as const],

  fields: customWidgetObject({
    render: CoaJournalReverseWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      entryId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "journalReverse.entryId.label" as const,
        description: "journalReverse.entryId.description" as const,
        placeholder: "journalReverse.entryId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: journalListDefinitions.GET,
        labelField: "entryNumber",
      }),
      reversalDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "journalReverse.reversalDate.label" as const,
        description: "journalReverse.reversalDate.description" as const,
        placeholder: "journalReverse.reversalDate.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      reversalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "journalReverse.response.reversalEntryId" as const,
        schema: z.string(),
      }),
      reversalEntryNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "journalReverse.response.reversalEntryNumber" as const,
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
    title: "journalReverse.success.title" as const,
    description: "journalReverse.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        entryId: "00000000-0000-0000-0000-000000000030",
        reversalDate: new Date("2026-02-01"),
      },
    },
    responses: {
      default: {
        reversalEntryId: "00000000-0000-0000-0000-000000000031",
        reversalEntryNumber: "JE-2026-0002",
      },
    },
  },
});

export type CoaJournalReverseRequestInput = typeof POST.types.RequestInput;
export type CoaJournalReverseRequestOutput = typeof POST.types.RequestOutput;
export type CoaJournalReverseResponseInput = typeof POST.types.ResponseInput;
export type CoaJournalReverseResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
