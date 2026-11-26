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

import { accountingCompany, accountingErrors } from "../fields";
import { scopedTranslation } from "../i18n";

const render = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.RevenueRecognitionWidget,
  })),
);
const status = z.enum([
  "recognitionPreview",
  "recognitionPosted",
  "recognitionCurrent",
  "recognitionPolicySaved",
  "recognitionPolicyConflict",
  "recognitionPolicyMissing",
  "recognitionEvidenceMissing",
  "recognitionExpiryReview",
  "recognitionSubscriptionReview",
  "recognitionServiceConflict",
  "recognitionInvalidAccounts",
  "recognitionPeriodClosed",
  "recognitionForbidden",
  "recognitionFailed",
]);
const { POST } = createEndpoint({
  scopedTranslation,
  path: ["payment", "accounting", "recognition"],
  method: Methods.POST,
  aliases: ["processor-revenue-recognition"],
  title: "recognitionTitle",
  titleShort: "recognitionTitle",
  description: "recognitionDescription",
  category: "payments",
  subCategory: "Providers",
  icon: "receipt",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  fields: customWidgetObject({
    render,
    usage: { request: "data", response: true },
    children: {
      companyId: accountingCompany,
      evidenceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ids",
        schema: z.uuid(),
      }),
      effectiveFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "recognitionFrom",
        schema: z.iso.date().optional(),
      }),
      revenueAccountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "recognitionAccount",
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/chart-of-accounts/account/list/definition")).default
            .GET,
        labelField: "name",
      }),
      recognizeExpiry: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "recognitionExpiry",
        schema: z.boolean().default(false),
      }),
      recognizeServicePeriods: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "recognitionServicePeriods",
        schema: z.boolean().default(false),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "dryRun",
        schema: z.boolean().default(true),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "recognitionTitle",
        schema: z.object({
          status,
          currency: z.string().optional(),
          entries: z.number().int().optional(),
          netMinor: z.number().int().optional(),
          pendingStatus: status.optional(),
        }),
      }),
    },
  }),
  errorTypes: accountingErrors,
  successTypes: {
    title: "recognitionTitle",
    description: "recognitionDescription",
  },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        evidenceId: "00000000-0000-4000-8000-000000000002",
        dryRun: true,
        recognizeExpiry: false,
      },
    },
    responses: { default: { result: { status: "recognitionPreview" } } },
  },
});

export default { POST };
