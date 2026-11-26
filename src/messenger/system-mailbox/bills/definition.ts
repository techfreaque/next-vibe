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

import { evidenceCurrencies } from "@/finance/supplier-evidence/rules";

import { billMailboxErrors, billMailboxSuccess } from "./error-types";
import { scopedTranslation } from "./i18n";

const ReviewList = lazyWidget(() =>
  import("./widget").then(({ ReviewList: Widget }) => ({ default: Widget })),
);
const ReviewApproval = lazyWidget(() =>
  import("./widget").then(({ ReviewApproval: Widget }) => ({
    default: Widget,
  })),
);

const adminRoles = [
  UserRole.ADMIN,
  UserRole.AI_TOOL_OFF,
  UserRole.MCP_OFF,
  UserRole.SKILL_OFF,
] as const;
const amount = z
  .string()
  .trim()
  .regex(/^\d{1,8}(?:\.\d{1,4})?$/);
const reference = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9][A-Za-z0-9_/-]{1,79}$/);
const exampleId = "00000000-0000-4000-8000-000000000001";
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "system-mailbox", "bills"],
  aliases: ["mail-bill-reviews"],
  title: "title",
  titleShort: "tag",
  description: "description",
  category: "finance",
  subCategory: "Finance: Suppliers",
  icon: "file-text",
  tags: ["tag"],
  allowedRoles: adminRoles,
  options: { formOptions: { autoSubmit: true } },
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: ReviewList,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        schema: z.uuid().optional(),
        labelField: "name",
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
      }),
      reviews: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: z.array(
          z.object({
            id: z.uuid(),
            vendor: z.string(),
            billId: z.uuid().nullable(),
            status: z.enum(["ready", "review", "posted"]),
            reference: z.string().nullable(),
            documentDate: z.string().nullable(),
            currency: z.string().nullable(),
            grossAmount: z.string().nullable(),
            taxAmount: z.string().nullable(),
            taxPending: z.boolean().optional(),
            issue: z
              .enum([
                "missingFields",
                "conflictingDocuments",
                "unsupportedContent",
              ])
              .nullable(),
            aiReviewRequested: z.boolean(),
            fileCount: z.number().int().min(1).max(4),
          }),
        ),
      }),
    },
  }),
  errorTypes: billMailboxErrors,
  successTypes: billMailboxSuccess,
  examples: {
    requests: { default: { companyId: exampleId } },
    responses: { default: { reviews: [] } },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "system-mailbox", "bills"],
  aliases: ["mail-bill-approve"],
  title: "approveTitle",
  titleShort: "approveTitle",
  description: "description",
  category: "finance",
  subCategory: "Finance: Suppliers",
  icon: "file-text",
  tags: ["tag"],
  allowedRoles: adminRoles,
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: ReviewApproval,
    children: {
      reviewId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "evidence",
        schema: z.uuid(),
      }),
      manual: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "manual",
        schema: z.boolean().optional(),
      }),
      confirmTax: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "confirmTax",
        schema: z.boolean().optional(),
      }),
      reference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "reference",
        schema: reference.optional(),
      }),
      date: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "date",
        schema: z.iso.date().optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "currency",
        schema: evidenceCurrencies.optional(),
      }),
      grossAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "gross",
        schema: amount.optional(),
      }),
      taxAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "tax",
        schema: amount.optional(),
      }),
      billId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "posted",
        schema: z.uuid(),
      }),
    },
  }),
  errorTypes: billMailboxErrors,
  successTypes: billMailboxSuccess,
  examples: {
    requests: { default: { reviewId: exampleId } },
    responses: { default: { billId: exampleId } },
  },
});

export default { GET, POST };
