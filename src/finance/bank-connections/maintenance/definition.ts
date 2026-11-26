import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import { Methods, WidgetType } from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { bankErrorTypes } from "../../bank/endpoint-errors";
import { scopedTranslation } from "../i18n";

const render = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BankMaintenanceWidget })),
);
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["finance", "bank-connections", "maintenance"],
  aliases: ["bank-feed-maintenance"],
  title: "maintenance",
  titleShort: "maintenance",
  description: "maintenanceHint",
  tags: ["connection"],
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "wallet",
  admin: { role: "automation", hidden: true },
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
    UserRole.CRON_ALLOWED,
  ],
  fields: customWidgetObject({
    render,
    usage: { response: true },
    children: {
      completed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "completed",
        schema: z.number().int(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "failedFeeds",
        schema: z.number().int(),
      }),
      reminded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "notified",
        schema: z.number().int(),
      }),
    },
  }),
  errorTypes: bankErrorTypes,
  successTypes: { title: "maintenance", description: "maintenanceHint" },
  examples: {
    responses: { default: { completed: 1, failed: 0, reminded: 0 } },
  },
});
export type MaintenanceOutput = typeof POST.types.ResponseOutput;
export default { POST };
