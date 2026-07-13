/**
 * Chart of Accounts — Journal Post Endpoint Definition
 * POST — change a DRAFT journal entry to POSTED status
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const CoaJournalPostWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaJournalPostWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "journal", "[entryId]", "post"],
  aliases: ["coa-journal-post"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "journalPost.title" as const,
  titleShort: "journalPost.titleShort" as const,
  description: "journalPost.description" as const,
  icon: "check",
  category: "accounting",
  subCategory: "Journal",
  tags: ["tags.journal" as const],

  fields: customWidgetObject({
    render: CoaJournalPostWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      entryId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "journalPost.entryId.label" as const,
        description: "journalPost.entryId.description" as const,
        placeholder: "journalPost.entryId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/chart-of-accounts/journal/list/definition")
          ).default.GET,
        labelField: "entryNumber",
      }),
      posted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "journalPost.response.posted" as const,
        schema: z.boolean(),
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
    title: "journalPost.success.title" as const,
    description: "journalPost.success.description" as const,
  },

  examples: {
    requests: {
      default: { entryId: "00000000-0000-0000-0000-000000000030" },
    },
    responses: {
      default: { posted: true },
    },
  },
});

export type CoaJournalPostRequestInput = typeof POST.types.RequestInput;
export type CoaJournalPostRequestOutput = typeof POST.types.RequestOutput;
export type CoaJournalPostResponseInput = typeof POST.types.ResponseInput;
export type CoaJournalPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
