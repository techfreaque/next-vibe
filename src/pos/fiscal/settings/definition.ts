/**
 * POS fiscal settings (eKasa) API definition.
 * GET: whether fiscal receipts are required, the provider and the queue state.
 * POST: save the fiscal cash register (owner/admin only).
 */

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

import { accountingDateSchema } from "@/chart-of-accounts/shared/calendar-date";

import {
  FiscalAdapter,
  FiscalAdapterDB,
  FiscalAdapterOptions,
  FiscalDeviceKind,
  FiscalDeviceKindDB,
  FiscalDeviceKindOptions,
} from "../enum";
import { scopedTranslation } from "../i18n";

const SettingsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosFiscalSettingsWidget })),
);
const SaveWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosFiscalSettingsSaveWidget })),
);

const errors = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
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
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
} as const;

const providerSchema = z
  .object({
    adapter: z.enum(FiscalAdapterDB),
    deviceKind: z.enum(FiscalDeviceKindDB),
    cashRegisterCode: z.string(),
    isEnabled: z.boolean(),
    certifiedUntil: z.iso.date().nullable(),
    certified: z.boolean(),
    credentialRef: z.string().nullable(),
    offlineDeadlineHours: z.number(),
  })
  .nullable();

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "fiscal", "settings"],
  aliases: ["pos-fiscal-settings"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "pos",
  subCategory: "POS: Terminals",
  tags: ["tags.pos", "tags.fiscal"],
  allowedRoles: [UserRole.ADMIN],
  icon: "receipt",
  options: {
    formOptions: { autoSubmit: true, debounceMs: 0 },
  },
  fields: customWidgetObject({
    render: SettingsWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        schema: z.uuid().optional(),
      }),
      settingsCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.companyName",
        hidden: true,
        schema: z.uuid().nullable(),
      }),
      companyName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.companyName",
        schema: z.string().nullable(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.country",
        schema: z.string().nullable(),
      }),
      canEdit: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.edit",
        schema: z.boolean(),
      }),
      required: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.required",
        schema: z.boolean(),
      }),
      blocked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.blocked",
        schema: z.boolean(),
      }),
      provider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.provider",
        schema: providerSchema,
      }),
      counts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.counts",
        schema: z.object({
          pending: z.number(),
          offline: z.number(),
          failed: z.number(),
          overdue: z.number(),
        }),
      }),
      adapters: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.adapters",
        schema: z.array(
          z.object({ id: z.enum(FiscalAdapterDB), certified: z.boolean() }),
        ),
      }),
    },
  }),
  errorTypes: errors,
  successTypes: { title: "success.title", description: "success.description" },
  examples: {
    requests: {
      default: { companyId: "00000000-0000-4000-8000-000000000001" },
    },
    responses: {
      default: {
        settingsCompanyId: "00000000-0000-4000-8000-000000000001",
        companyName: "Kaviareň s.r.o.",
        country: "SK",
        canEdit: true,
        required: true,
        blocked: true,
        provider: null,
        counts: { pending: 0, offline: 0, failed: 0, overdue: 0 },
        adapters: [{ id: FiscalAdapter.SANDBOX, certified: false }],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "fiscal", "settings"],
  aliases: ["pos-fiscal-settings-save"],
  title: "saveTitle",
  titleShort: "saveTitle",
  description: "saveDescription",
  category: "pos",
  subCategory: "POS: Terminals",
  tags: ["tags.pos", "tags.fiscal"],
  allowedRoles: [UserRole.ADMIN],
  icon: "receipt",
  options: {
    formOptions: { persistForm: false },
    mutationOptions: {
      onSuccess: async ({ logger }) => {
        const [{ apiClient }, settings] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("./definition"),
        ]);
        await apiClient.refetchEndpoint(settings.default.GET, logger);
      },
    },
  },
  fields: customWidgetObject({
    render: SaveWidget,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "company",
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        schema: z.uuid(),
      }),
      adapter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "adapter",
        description: "adapterDescription",
        placeholder: "adapterPlaceholder",
        options: FiscalAdapterOptions,
        schema: z.enum(FiscalAdapterDB),
      }),
      deviceKind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "deviceKind",
        description: "deviceKindDescription",
        options: FiscalDeviceKindOptions,
        schema: z.enum(FiscalDeviceKindDB).default(FiscalDeviceKind.ORP),
      }),
      cashRegisterCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cashRegisterCode",
        description: "cashRegisterCodeDescription",
        placeholder: "cashRegisterCodePlaceholder",
        schema: z
          .string()
          .trim()
          .min(1)
          .max(64)
          .regex(/^[0-9A-Za-z-]+$/),
      }),
      isEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "isEnabled",
        description: "isEnabledDescription",
        schema: z.boolean().default(false),
      }),
      certifiedUntil: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "certifiedUntil",
        description: "certifiedUntilDescription",
        schema: accountingDateSchema.optional(),
      }),
      credentialRef: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "credentialRef",
        description: "credentialRefDescription",
        schema: z.string().trim().max(120).optional(),
      }),
      offlineDeadlineHours: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "offlineDeadlineHours",
        description: "offlineDeadlineHoursDescription",
        schema: z.number().int().min(1).max(720).default(96),
      }),
      saved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.saved",
        schema: z.boolean(),
      }),
      blocked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.blocked",
        schema: z.boolean(),
      }),
      required: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.required",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: errors,
  successTypes: {
    title: "success.savedTitle",
    description: "success.savedDescription",
  },
  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-4000-8000-000000000001",
        adapter: FiscalAdapter.SANDBOX,
        deviceKind: FiscalDeviceKind.SORP,
        cashRegisterCode: "88812345678900001",
        isEnabled: true,
        offlineDeadlineHours: 96,
      },
    },
    responses: {
      default: { saved: true, blocked: true, required: true },
    },
  },
});

export type PosFiscalSettingsGetResponse = typeof GET.types.ResponseOutput;
export type PosFiscalSettingsPostRequest = typeof POST.types.RequestOutput;
export type PosFiscalSettingsPostResponse = typeof POST.types.ResponseOutput;

export default { GET, POST };
