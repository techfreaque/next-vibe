import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
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

import { scopedTranslation } from "../consent/i18n";

const render = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.ConnectBankWidget })),
);
const error = { title: "unavailable", description: "unavailable" } as const;
const { POST } = createEndpoint({
  scopedTranslation,
  path: ["finance", "bank-connections", "enable-banking", "connect"],
  aliases: ["connect-bank"],
  method: Methods.POST,
  title: "title",
  titleShort: "title",
  description: "description",
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "link",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      ledgerAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "ledgerAccount",
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      bankCountry: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "bankCountry",
        schema: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{2}$/u),
      }),
      bankName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "bankName",
        schema: z.string().trim().min(1).max(200),
      }),
      personal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "personal",
        schema: z.boolean().default(true),
      }),
      authorizedBank: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "bankName",
        schema: z.string(),
      }),
      authorizedLedgerAccount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ledgerAccount",
        schema: z.string(),
      }),
      url: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "authorize",
        schema: z.url({
          protocol: /^https$/u,
          hostname: /^auth\.enablebanking\.com$/u,
        }),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: error,
    [EndpointErrorTypes.NETWORK_ERROR]: error,
    [EndpointErrorTypes.UNAUTHORIZED]: error,
    [EndpointErrorTypes.FORBIDDEN]: error,
    [EndpointErrorTypes.NOT_FOUND]: error,
    [EndpointErrorTypes.SERVER_ERROR]: error,
    [EndpointErrorTypes.UNKNOWN_ERROR]: error,
    [EndpointErrorTypes.CONFLICT]: error,
    [EndpointErrorTypes.UNSAVED_CHANGES]: error,
  },
  successTypes: { title: "authorize", description: "description" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        ledgerAccountId: "00000000-0000-4000-8000-000000000002",
        bankCountry: "DE",
        bankName: "C24",
        personal: true,
      },
    },
    responses: {
      default: {
        url: "https://auth.enablebanking.com/ais/start",
        authorizedBank: "C24",
        authorizedLedgerAccount: "Operating bank account",
      },
    },
  },
});

export type ConnectInput = (typeof POST)["types"]["RequestOutput"];
export default { POST };
