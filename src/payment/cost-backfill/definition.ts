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

import { historyHeader, historyLimit, historyRow } from "./history";
import { scopedTranslation } from "./i18n";

const render = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.CostHistoryWidget })),
);
const error = { title: "failure", description: "failure" } as const;
const { POST } = createEndpoint({
  scopedTranslation,
  path: ["payment", "cost-backfill"],
  method: Methods.POST,
  aliases: ["creator-referral-cost-history"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "payments",
  subCategory: "Providers",
  icon: "receipt",
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
      history: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "history",
        schema: z.string().min(1).max(historyLimit),
      }),
      company: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "company",
        schema: z.uuid(),
      }),
      rows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rows",
        schema: z.array(
          historyRow.extend({
            status: z.enum(["commitment", "missing", "verifyPaid", "ready"]),
          }),
        ),
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
  successTypes: { title: "rows", description: "description" },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        history: `${historyHeader}\ncreator-1\tcreator\tcommitment\t\t30.00\tEUR\t\t\t`,
      },
    },
    responses: {
      default: {
        company: "00000000-0000-4000-8000-000000000001",
        rows: [
          {
            reference: "creator-1",
            kind: "creator",
            evidence: "commitment",
            status: "commitment",
            gross: "30.00",
            currency: "EUR",
          },
        ],
      },
    },
  },
});

export default { POST };
