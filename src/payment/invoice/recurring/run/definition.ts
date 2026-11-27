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

import { scopedTranslation } from "../i18n";

const RecurringRunWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RecurringRunWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
} as const;

const runItemSchema = z.object({
  scheduleId: z.uuid(),
  companyId: z.uuid(),
  title: z.string(),
  runDate: z.string(),
  nextRunDate: z.string(),
  invoiceId: z.uuid().nullable(),
  invoiceNumber: z.string().nullable(),
  status: z.enum(["preview", "created", "issued", "skipped_ended", "failed"]),
  error: z.string().optional(),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "recurring", "run"],
  aliases: ["recurring-invoices-run"],
  title: "recurring.runTitle" as const,
  titleShort: "recurring.runTitle" as const,
  description: "recurring.runDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "play" as const,
  tags: ["tags.payment" as const, "tags.recurring" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: RecurringRunWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.companyId" as const,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      asOfDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.asOfDate" as const,
        schema: z.iso.date().optional(),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun" as const,
        schema: z.boolean().default(true),
      }),
      preview: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.dryRun" as const,
        schema: z.boolean(),
      }),
      processedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.processedCount" as const,
        schema: z.number().int(),
      }),
      issuedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.issuedCount" as const,
        schema: z.number().int(),
      }),
      failedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.failedCount" as const,
        schema: z.number().int(),
      }),
      items: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.items" as const,
        schema: z.array(runItemSchema),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: { default: { dryRun: true } },
    responses: {
      default: {
        preview: true,
        processedCount: 0,
        issuedCount: 0,
        failedCount: 0,
        items: [],
      },
    },
  },
  successTypes: {
    title: "recurring.runSuccess" as const,
    description: "recurring.runDescription" as const,
  },
});

export type RecurringRunRequest = typeof POST.types.RequestOutput;
export type RecurringRunResponse = typeof POST.types.ResponseOutput;

export default { POST };
