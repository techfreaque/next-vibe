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

const RecurringListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RecurringListWidget })),
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

const scheduleSummarySchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  title: z.string(),
  customerName: z.string(),
  customerEmail: z.string().nullable(),
  frequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  nextRunDate: z.string(),
  endDate: z.string().nullable(),
  dueDays: z.number().int(),
  currency: z.string(),
  totalEstimate: z.number(),
  isEnabled: z.boolean(),
  autoIssue: z.boolean(),
  autoSendEmail: z.boolean(),
  lastRunAt: z.string().nullable(),
  lastInvoiceId: z.uuid().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "recurring", "list"],
  aliases: ["recurring-invoices"],
  title: "recurring.listTitle" as const,
  titleShort: "recurring.listTitle" as const,
  description: "recurring.listDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "repeat" as const,
  tags: ["tags.payment" as const, "tags.recurring" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: RecurringListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.companyId" as const,
        includeInCacheKey: true,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      selectedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.companyId" as const,
        schema: z.uuid().nullable(),
      }),
      companyEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.companyEnabled" as const,
        schema: z.boolean(),
      }),
      schedules: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.schedules" as const,
        schema: z.array(scheduleSummarySchema),
      }),
    },
  }),
  errorTypes,
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        selectedCompanyId: "00000000-0000-4000-8000-000000000001",
        companyEnabled: false,
        schedules: [],
      },
    },
  },
  successTypes: {
    title: "recurring.listSuccess" as const,
    description: "recurring.listDescription" as const,
  },
});

export type RecurringListRequest = typeof GET.types.RequestOutput;
export type RecurringListResponse = typeof GET.types.ResponseOutput;

export default { GET };
