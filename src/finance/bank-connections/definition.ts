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

import { bankErrorTypes } from "../bank/endpoint-errors";
import { bankFeedAvailability } from "./configuration";
import { scopedTranslation } from "./i18n";

const list = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BankFeedListWidget })),
);
const sync = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BankFeedSyncWidget })),
);
const company = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  label: "company",
  schema: z.uuid(),
  listEndpoint: async () =>
    (await import("@/companies/list/definition")).default.GET,
  labelField: "name",
});
const base = {
  scopedTranslation,
  path: ["finance", "bank-connections"],
  category: "finance",
  subCategory: "Bank reconciliation",
  admin: bankFeedAvailability,
  icon: "wallet",
  tags: ["connection"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF, UserRole.MCP_OFF],
  errorTypes: bankErrorTypes,
} as const;

const { GET } = createEndpoint({
  ...base,
  method: Methods.GET,
  aliases: ["bank-connections"],
  title: "title",
  titleShort: "title",
  description: "description",
  fields: customWidgetObject({
    render: list,
    usage: { request: "data", response: true },
    children: {
      companyId: company,
      checkApplication: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "check",
        schema: z.boolean().default(false),
      }),
      application: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "check",
        schema: z.enum(["active", "inactive", "unavailable"]).optional(),
      }),
      feeds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "connection",
        schema: z.array(
          z.object({
            id: z.uuid(),
            name: z.string(),
            currency: z.string().nullable(),
            consentUntil: z.iso.date(),
            accountId: z.uuid().nullable(),
            startDay: z.iso.date().optional(),
            through: z.iso.date().nullable(),
            daily: z.boolean(),
            privacyConfigured: z.boolean().optional(),
          }),
        ),
      }),
    },
  }),
  successTypes: { title: "title", description: "description" },
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: { default: { feeds: [] } },
  },
});
const { POST } = createEndpoint({
  ...base,
  method: Methods.POST,
  aliases: ["bank-connection-sync"],
  title: "sync",
  options: {
    mutationOptions: {
      onSuccess: async ({ logger }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, logger);
      },
    },
  },
  titleShort: "sync",
  description: "description",
  fields: customWidgetObject({
    render: sync,
    usage: { request: "data", response: true },
    children: {
      companyId: company,
      feedId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "select",
        schema: z.uuid(),
        listEndpoint: async () => GET,
        labelField: "name",
      }),
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "account",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      startDay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "start",
        schema: z.iso.date().optional(),
      }),
      setupOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "setup",
        description: "setupHint",
        schema: z.boolean().optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "preview",
        schema: z.boolean().default(true),
      }),
      matchedOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "matchedOnly",
        description: "discardHint",
        schema: z.boolean().default(true),
      }),
      daily: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "daily",
        schema: z.boolean().optional(),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "sync",
        schema: z.object({
          setupFeedId: z.uuid().optional(),
          preview: z.boolean(),
          providerBookings: z.number().int().optional(),
          eligibleBookings: z.number().int().optional(),
          bankAccountName: z.string().optional(),
          from: z.iso.date(),
          to: z.iso.date(),
          imported: z.number().int(),
          skipped: z.number().int(),
          held: z.number().int(),
          discardedCount: z.number().int(),
          autoMatched: z.number().int(),
          privateCount: z.number().int(),
          suppliers: z.array(
            z.object({
              supplierId: z.uuid().optional(),
              name: z.string(),
              currency: z.string(),
              count: z.number().int(),
              amount: z.string(),
            }),
          ),
        }),
      }),
    },
  }),
  successTypes: { title: "sync", description: "description" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        feedId: "00000000-0000-4000-8000-000000000002",
        accountId: "00000000-0000-4000-8000-000000000003",
        dryRun: true,
      },
    },
    responses: {
      default: {
        result: {
          preview: true,
          from: "2026-11-01",
          to: "2026-11-25",
          imported: 1,
          skipped: 0,
          held: 0,
          discardedCount: 3,
          autoMatched: 0,
          privateCount: 0,
          suppliers: [],
        },
      },
    },
  },
});
export type BankConnectionsOutput = typeof GET.types.ResponseOutput;
export type BankSyncInput = typeof POST.types.RequestOutput;
export type BankSyncOutput = typeof POST.types.ResponseOutput;
export default { GET, POST };
