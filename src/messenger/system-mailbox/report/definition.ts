/**
 * Platform Mailbox - Daily status report
 * Composes the last-24h internal report and mails it from the platform mailbox.
 * Also the target of the (default-disabled) daily cron task.
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
  backButton,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { systemMailboxErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const SystemMailReportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemMailReportContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "system-mailbox", "report"],
  aliases: ["system-mail-report"] as const,
  title: "report.title",
  titleShort: "report.titleShort",
  description: "report.description",
  category: "messenger",
  subCategory: "Providers",
  icon: "file-text",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SystemMailReportContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "report.fields.to.label",
        description: "report.fields.to.description",
        placeholder: "report.fields.to.placeholder",
        columns: 8,
        schema: z.string().max(320).optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "report.fields.dryRun.label",
        description: "report.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      subject: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.subject",
        schema: z.string(),
      }),
      body: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.body",
        schema: z.string(),
      }),
      recipient: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.recipient",
        schema: z.string().nullable(),
      }),
      sent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.sent",
        schema: z.boolean(),
      }),
      sections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.sections",
        schema: z.string(),
      }),
      skippedSections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "report.response.skippedSections",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: systemMailboxErrorTypes,

  successTypes: {
    title: "report.success.title",
    description: "report.success.description",
  },

  examples: {
    requests: { default: { dryRun: true } },
    responses: {
      default: {
        subject: "[unbottled] Daily status 2026-11-07",
        body: "Platform status - last 24h\n\nSIGNUPS\n  New users: 3\n",
        recipient: null,
        sent: false,
        sections: "signups",
        skippedSections: "",
      },
    },
  },
});

export type SystemMailReportRequestOutput = typeof POST.types.RequestOutput;
export type SystemMailReportResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
