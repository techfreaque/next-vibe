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
  requestResponseField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { billMailboxErrors, billMailboxSuccess } from "../error-types";
import { scopedTranslation } from "../i18n";

const Sync = lazyWidget(() =>
  import("./widget").then(({ Sync: Widget }) => ({ default: Widget })),
);
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "system-mailbox", "bills", "sync"],
  aliases: ["mail-bill-scan"],
  title: "syncTitle",
  titleShort: "syncTitle",
  description: "syncDescription",
  category: "finance",
  subCategory: "Finance: Suppliers",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CRON_ALLOWED,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
  ],
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: Sync,
    children: {
      dryRun: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "dryRun",
        schema: z.boolean().default(true),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "limit",
        schema: z.coerce.number().int().min(1).max(120).default(25),
      }),
      scanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scanned",
        schema: z.number(),
      }),
      persisted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "persisted",
        schema: z.number(),
      }),
      ready: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "readyCount",
        schema: z.number(),
      }),
      existing: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "existingCount",
        schema: z.number(),
      }),
      review: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "reviewCount",
        schema: z.number(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "skipped",
        schema: z.number(),
      }),
      flagged: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "flagged",
        schema: z.number(),
      }),
    },
  }),
  errorTypes: billMailboxErrors,
  successTypes: billMailboxSuccess,
  examples: {
    requests: { default: { dryRun: true, limit: 5 } },
    responses: {
      default: {
        dryRun: true,
        scanned: 2,
        persisted: 0,
        ready: 1,
        existing: 0,
        review: 1,
        skipped: 0,
        flagged: 0,
      },
    },
  },
});
export default { POST };
