/**
 * Outreach Import - Definition
 * POST: parse sent-log lines / markdown tables into contacts and touches.
 * Idempotent: a touch already stored for the same email, direction, UTC day
 * and subject is skipped.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { outreachErrorTypes } from "../errors";
import { scopedTranslation } from "../i18n";
import { OUTREACH_IMPORT_ALIAS } from "./constants";

const OutreachImportWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OutreachImportWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "outreach", "import"],
  title: "import.post.title",
  titleShort: "import.post.titleShort",
  description: "import.post.description",
  icon: "upload",
  category: "leads",
  subCategory: "outreach",
  tags: ["tags.outreach", "tags.import"],
  aliases: [OUTREACH_IMPORT_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const [{ apiClient }, crm] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../crm/definition"),
        ]);
        await apiClient.refetchEndpoint(crm.default.GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: OutreachImportWidget,
    usage: { request: "data", response: true } as const,
    children: {
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "import.post.fields.content.label",
        description: "import.post.fields.content.description",
        placeholder: "import.post.fields.content.placeholder",
        columns: 12,
        schema: z.string().max(2_000_000).optional(),
      }),
      filePaths: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "import.post.fields.filePaths.label",
        description: "import.post.fields.filePaths.description",
        placeholder: "import.post.fields.filePaths.placeholder",
        columns: 12,
        schema: z.string().trim().max(2000).optional(),
      }),
      ignoreEmails: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "import.post.fields.ignoreEmails.label",
        description: "import.post.fields.ignoreEmails.description",
        placeholder: "import.post.fields.ignoreEmails.placeholder",
        columns: 8,
        schema: z.string().trim().max(2000).optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "import.post.fields.dryRun.label",
        description: "import.post.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      rowsParsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.rowsParsed",
        schema: z.coerce.number(),
      }),
      contactsCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.contactsCreated",
        schema: z.coerce.number(),
      }),
      contactsUpdated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.contactsUpdated",
        schema: z.coerce.number(),
      }),
      touchesAdded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.touchesAdded",
        schema: z.coerce.number(),
      }),
      touchesDuplicate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.touchesDuplicate",
        schema: z.coerce.number(),
      }),
      statusChanges: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.statusChanges",
        schema: z.coerce.number(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.skipped",
        schema: z.coerce.number(),
      }),
      skippedLines: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "import.post.response.skippedLines",
        schema: z.array(z.string()),
      }),
    },
  }),

  errorTypes: outreachErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        content:
          "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut for ModelFit\tSENT",
      },
    },
    responses: {
      default: {
        rowsParsed: 1,
        contactsCreated: 1,
        contactsUpdated: 0,
        touchesAdded: 1,
        touchesDuplicate: 0,
        statusChanges: 0,
        skipped: 0,
        skippedLines: [],
      },
    },
  },
});

export type OutreachImportRequestOutput = typeof POST.types.RequestOutput;
export type OutreachImportResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
