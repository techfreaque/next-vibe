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
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { billMailboxErrors, billMailboxSuccess } from "../error-types";
import { scopedTranslation } from "../i18n";

const Evidence = lazyWidget(() =>
  import("./widget").then(({ Evidence: Widget }) => ({ default: Widget })),
);
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "system-mailbox", "bills", "attachment"],
  aliases: ["mail-bill-evidence"],
  title: "attachmentTitle",
  titleShort: "attachmentTitle",
  description: "attachmentDescription",
  category: "finance",
  subCategory: "Finance: Suppliers",
  icon: "download",
  tags: ["tag"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_OFF,
    UserRole.SKILL_OFF,
  ],
  options: { formOptions: { autoSubmit: true, persistForm: false } },
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: Evidence,
    children: {
      reviewId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "evidence",
        schema: z.uuid(),
      }),
      index: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fileIndex",
        schema: z.coerce.number().int().min(0).max(3).default(0),
      }),
      filename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "file",
        schema: z.string(),
      }),
      contents: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
    },
  }),
  errorTypes: billMailboxErrors,
  successTypes: billMailboxSuccess,
  examples: {
    requests: {
      default: { reviewId: "00000000-0000-4000-8000-000000000001", index: 0 },
    },
    responses: {
      default: { filename: "invoice-evidence-1.txt", contents: "aW52b2ljZQ==" },
    },
  },
});
export default { GET };
