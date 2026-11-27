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

import { scopedTranslation } from "./i18n";
import {
  disposition,
  privacyMode,
  privacyRuleSchema,
  privacyRulesSchema,
  retentionDays,
} from "./rules";

const Inbox = lazyWidget(() =>
  import("./widget").then(({ PrivacyInbox }) => ({ default: PrivacyInbox })),
);
const Policy = lazyWidget(() =>
  import("./widget").then(({ PrivacyPolicy }) => ({ default: PrivacyPolicy })),
);
const Decision = lazyWidget(() =>
  import("./widget").then(({ PrivacyDecision }) => ({
    default: PrivacyDecision,
  })),
);

const operation = z.enum(["policy", "set", "remove"]);
const scopeField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "connection",
  schema: z.uuid(),
});

const errors = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.invalid",
    description: "errors.invalid",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.forbidden",
    description: "errors.forbidden",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden",
    description: "errors.forbidden",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.conflict",
    description: "errors.conflict",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.unavailable",
    description: "errors.unavailable",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.unavailable",
    description: "errors.unavailable",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict",
    description: "errors.conflict",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unavailable",
    description: "errors.unavailable",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.invalid",
    description: "errors.invalid",
  },
} as const;

const base = {
  scopedTranslation,
  path: ["finance", "bank-connections", "privacy"],
  category: "finance",
  subCategory: "Bank reconciliation",
  icon: "shield",
  tags: ["title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
  ],
  admin: { role: "destination" },
  errorTypes: errors,
  successTypes: { title: "saved", description: "saved" },
} as const;

const { GET } = createEndpoint({
  ...base,
  method: Methods.GET,
  aliases: ["bank-privacy"],
  title: "title",
  titleShort: "title",
  description: "description",
  options: { formOptions: { autoSubmit: true, persistForm: false } },
  fields: customWidgetObject({
    render: Inbox,
    usage: { request: "data", response: true },
    children: {
      connectionId: requestField(scopedTranslation, {
        includeInCacheKey: true,
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connection",
        schema: z.uuid().optional(),
      }),
      connections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "connection",
        schema: z.array(z.object({ id: z.uuid(), bank: z.string() })),
      }),
      connectionIdSelected: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "connection",
        schema: z.uuid().optional(),
      }),
      companyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.uuid().optional(),
        hidden: true,
      }),
      ledgerAccountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().optional(),
      }),
      suggestedSuppliers: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ruleSupplier",
        schema: z
          .array(z.object({ id: z.uuid(), name: z.string() }))
          .optional(),
      }),
      ruleSuppliers: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ruleSupplier",
        schema: z
          .array(z.object({ id: z.uuid(), name: z.string() }))
          .optional(),
      }),
      mode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "mode",
        schema: privacyMode.optional(),
      }),
      retentionDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "retention",
        schema: retentionDays.optional(),
      }),
      rules: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rules",
        schema: privacyRulesSchema,
      }),
      suggestions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "suggestions",
        schema: z.array(z.string()),
      }),
      reviews: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "inbox",
        schema: z.array(
          z.object({
            identity: z.string().length(64),
            state: z.enum(["review", "approving"]),
            date: z.iso.date(),
            amount: z.string(),
            currency: z.string(),
            counterparty: z.string().optional(),
            description: z.string().optional(),
            expires: z.iso.datetime(),
          }),
        ),
      }),
    },
  }),
  examples: {
    requests: { default: {} },
    responses: {
      default: { connections: [], reviews: [], rules: [], suggestions: [] },
    },
  },
});

const { PATCH } = createEndpoint({
  ...base,
  admin: { role: "record" },
  method: Methods.PATCH,
  aliases: ["bank-privacy-policy"],
  title: "policy",
  titleShort: "policy",
  description: "policyDescription",
  options: {
    formOptions: { persistForm: false },
    mutationOptions: {
      onSuccess: async ({ logger, requestData, responseData }) => {
        const [{ apiClient }, { default: feeds }] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../definition"),
        ]);
        await apiClient.refetchEndpoint(GET, logger, {
          requestData: { connectionId: requestData.connectionId },
        });
        if (responseData.savedCompanyId) {
          await apiClient.refetchEndpoint(feeds.GET, logger, {
            requestData: {
              companyId: responseData.savedCompanyId,
              directoryCountry: undefined,
              directoryPersonal: undefined,
            },
          });
        }
      },
    },
  },
  fields: customWidgetObject({
    render: Policy,
    usage: { request: "data", response: true },
    children: {
      connectionId: scopeField,
      firstSetup: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        hidden: true,
        schema: z.boolean().optional(),
      }),
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ruleSupplier",
        schema: z.uuid().optional(),
        hidden: true,
      }),
      supplierId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ruleSupplier",
        schema: privacyRuleSchema.shape.supplierId,
      }),
      operation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "operation",
        schema: operation.default("policy"),
        options: operation.options.map((value) => ({
          value,
          label: `operations.${value}` as const,
        })),
      }),
      mode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "mode",
        schema: privacyMode.optional(),
        options: privacyMode.options.map((value) => ({
          value,
          label: `modes.${value}` as const,
        })),
      }),
      retentionDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "retention",
        schema: retentionDays.optional(),
      }),
      field: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "ruleField",
        schema: privacyRuleSchema.shape.field.optional(),
        options: privacyRuleSchema.shape.field.options.map((value) => ({
          value,
          label: `ruleFields.${value}` as const,
        })),
      }),
      match: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "ruleMatch",
        schema: privacyRuleSchema.shape.match.optional(),
        options: privacyRuleSchema.shape.match.options.map((value) => ({
          value,
          label: `matches.${value}` as const,
        })),
      }),
      literal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "literal",
        schema: privacyRuleSchema.shape.literal.optional(),
      }),
      result: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "outcome",
        schema: disposition.optional(),
        options: disposition.options.map((value) => ({
          value,
          label: `outcomes.${value}` as const,
        })),
      }),
      savedCompanyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid().optional(),
      }),
      saved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "saved",
        schema: z.boolean(),
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        connectionId: "00000000-0000-4000-8000-000000000001",
        operation: "policy",
        mode: "mixed",
        retentionDays: 30,
      },
    },
    responses: { default: { saved: true } },
  },
});

const { POST } = createEndpoint({
  ...base,
  admin: { role: "record" },
  method: Methods.POST,
  aliases: ["bank-privacy-decide"],
  title: "decision",
  titleShort: "decision",
  description: "decisionDescription",
  options: { formOptions: { persistForm: false } },
  fields: customWidgetObject({
    render: Decision,
    usage: { request: "data", response: true },
    children: {
      connectionId: scopeField,
      identity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "identity",
        schema: z.string().regex(/^[0-9a-f]{64}$/),
      }),
      disposition: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "outcome",
        schema: disposition,
        options: disposition.options.map((value) => ({
          value,
          label: `outcomes.${value}` as const,
        })),
      }),
      always: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "always",
        schema: z.boolean().default(false),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "outcome",
        schema: disposition,
      }),
      ruleSaved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "ruleSaved",
        schema: z.boolean().optional(),
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        connectionId: "00000000-0000-4000-8000-000000000001",
        identity: "0".repeat(64),
        disposition: "private",
        always: false,
      },
    },
    responses: { default: { result: "private" } },
  },
});

export default { GET, PATCH, POST };
