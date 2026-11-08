/**
 * Task Budget Caps - Endpoint Definitions
 * GET: every cap row plus today's task spend.
 * POST: create or update a cap (one per scope + key).
 * Client+server safe. No server imports.
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

import {
  TASK_BUDGET_CAPS_LIST_ALIAS,
  TASK_BUDGET_CAPS_SET_ALIAS,
} from "../constants";
import { BudgetScopeDB, BudgetScopeOptions } from "../enum";
import { scopedTranslation } from "../i18n";

const BudgetCapsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BudgetCapsWidget })),
);
const BudgetCapSetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BudgetCapSetWidget })),
);

const capRowSchema = z.object({
  id: z.uuid(),
  scope: z.enum(BudgetScopeDB),
  key: z.string(),
  maxCredits: z.number(),
  enabled: z.boolean(),
  note: z.string().nullable(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "tasks", "watchdog", "budget-caps"],
  aliases: [TASK_BUDGET_CAPS_LIST_ALIAS],
  title: "budgetCaps.get.title",
  titleShort: "budgetCaps.get.titleShort",
  description: "budgetCaps.get.description",
  icon: "wallet",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.taskWatchdog", "tags.budget"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: BudgetCapsWidget,
    usage: { response: true } as const,
    children: {
      rows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "budgetCaps.get.response.rows",
        schema: z.array(capRowSchema),
      }),
      daySpent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "budgetCaps.get.response.daySpent",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        rows: [
          {
            id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012",
            scope: "enums.budgetScope.day",
            key: "global",
            maxCredits: 1000,
            enabled: true,
            note: "Hard ceiling for unattended runs",
          },
        ],
        daySpent: 212.5,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tasks", "watchdog", "budget-caps"],
  aliases: [TASK_BUDGET_CAPS_SET_ALIAS],
  title: "budgetCaps.post.title",
  titleShort: "budgetCaps.post.titleShort",
  description: "budgetCaps.post.description",
  icon: "wallet",
  category: "devTools",
  subCategory: "tasksCron",
  tags: ["tags.taskWatchdog", "tags.budget"],
  allowedRoles: [UserRole.ADMIN],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, data.logger);
      },
    },
  },

  fields: customWidgetObject({
    render: BudgetCapSetWidget,
    usage: { request: "data", response: true } as const,
    children: {
      scope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "budgetCaps.post.fields.scope.label",
        description: "budgetCaps.post.fields.scope.description",
        options: BudgetScopeOptions,
        columns: 6,
        schema: z.enum(BudgetScopeDB),
      }),
      key: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "budgetCaps.post.fields.key.label",
        description: "budgetCaps.post.fields.key.description",
        placeholder: "budgetCaps.post.fields.key.placeholder",
        columns: 6,
        schema: z.string().trim().min(1).max(200),
      }),
      maxCredits: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "budgetCaps.post.fields.maxCredits.label",
        description: "budgetCaps.post.fields.maxCredits.description",
        columns: 6,
        schema: z.number().min(0).max(10_000_000),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "budgetCaps.post.fields.enabled.label",
        description: "budgetCaps.post.fields.enabled.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      note: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "budgetCaps.post.fields.note.label",
        description: "budgetCaps.post.fields.note.description",
        placeholder: "budgetCaps.post.fields.note.placeholder",
        schema: z.string().trim().max(200).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "budgetCaps.post.response.id",
        schema: z.uuid(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        scope: "enums.budgetScope.task",
        key: "*",
        maxCredits: 100,
        enabled: true,
        note: "Default per task run",
      },
    },
    responses: {
      default: { id: "8b3e4d6a-0b2c-4e3f-9d4a-5c6b7f8a9012" },
    },
  },
});

export type BudgetCapsGetResponseOutput = typeof GET.types.ResponseOutput;
export type BudgetCapSetRequestOutput = typeof POST.types.RequestOutput;
export type BudgetCapSetResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST };
export default definitions;
