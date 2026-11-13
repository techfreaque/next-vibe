/**
 * Uncensored-model consent
 * GET    status: did this account / guest confirm 18+ and unfiltered output?
 * POST   agree (one time, a human confirms; never an AI tool)
 * DELETE withdraw
 *
 * Stored on the user (accounts) or the lead (guests); a guest's consent moves
 * to the account on signup/login. Every surface that runs an uncensored model
 * (chat stream, ai-run, image generation, /v1 API) refuses until it exists.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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
  UNCENSORED_CONSENT_AGREE_ALIAS,
  UNCENSORED_CONSENT_ALIAS,
  UNCENSORED_CONSENT_VERSION,
  UNCENSORED_CONSENT_WITHDRAW_ALIAS,
} from "./constants";
import { scopedTranslation } from "./i18n";

const UncensoredConsentStatusWidget = lazyWidget(() =>
  import("./widget/widget").then((m) => ({
    default: m.UncensoredConsentStatusWidget,
  })),
);
const UncensoredConsentAgreeWidget = lazyWidget(() =>
  import("./widget/widget").then((m) => ({
    default: m.UncensoredConsentAgreeWidget,
  })),
);
const UncensoredConsentWithdrawWidget = lazyWidget(() =>
  import("./widget/widget").then((m) => ({
    default: m.UncensoredConsentWithdrawWidget,
  })),
);

const ERROR_TYPES = {
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
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;

/** The status every method answers with: the same shape keeps the cache simple. */
const STATUS_FIELDS = {
  consented: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.consented",
    schema: z.boolean(),
  }),
  consentedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.consentedAt",
    schema: dateSchema.nullable(),
  }),
  version: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.version",
    schema: z.number().int().nullable(),
  }),
};

const EXAMPLE_GRANTED = {
  consented: true,
  consentedAt: "2026-11-13T12:00:00.000Z",
  version: UNCENSORED_CONSENT_VERSION,
};
const EXAMPLE_MISSING = {
  consented: false,
  consentedAt: null,
  version: null,
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "models", "uncensored-consent"],
  aliases: [UNCENSORED_CONSENT_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "shield-off",
  category: "ai",
  subCategory: "chatSettings",
  tags: ["tags.consent"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: UncensoredConsentStatusWidget,
    usage: { response: true } as const,
    children: STATUS_FIELDS,
  }),
  errorTypes: ERROR_TYPES,
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    responses: { default: EXAMPLE_GRANTED, missing: EXAMPLE_MISSING },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "models", "uncensored-consent"],
  aliases: [UNCENSORED_CONSENT_AGREE_ALIAS] as const,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "shield-off",
  category: "ai",
  subCategory: "chatSettings",
  tags: ["tags.consent"],
  // A human confirms their own age. Never an AI tool or an MCP agent.
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
  ] as const,
  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        apiClient.updateEndpointData(GET, data.logger, () => ({
          success: true,
          data: data.responseData,
        }));
      },
    },
  },
  fields: customWidgetObject({
    render: UncensoredConsentAgreeWidget,
    usage: { request: "data", response: true } as const,
    children: {
      confirm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.confirm.label",
        description: "post.fields.confirm.description",
        schema: z.literal(true),
      }),
      ...STATUS_FIELDS,
    },
  }),
  errorTypes: ERROR_TYPES,
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: { default: { confirm: true } },
    responses: { default: EXAMPLE_GRANTED },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["vibe", "agent", "models", "uncensored-consent"],
  aliases: [UNCENSORED_CONSENT_WITHDRAW_ALIAS] as const,
  title: "delete.title",
  titleShort: "delete.titleShort",
  description: "delete.description",
  icon: "shield",
  category: "ai",
  subCategory: "chatSettings",
  tags: ["tags.consent"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        apiClient.updateEndpointData(GET, data.logger, () => ({
          success: true,
          data: data.responseData,
        }));
      },
    },
  },
  fields: customWidgetObject({
    render: UncensoredConsentWithdrawWidget,
    usage: { response: true } as const,
    children: STATUS_FIELDS,
  }),
  errorTypes: ERROR_TYPES,
  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },
  examples: {
    responses: { default: EXAMPLE_MISSING },
  },
});

export type UncensoredConsentStatus = typeof GET.types.ResponseOutput;
export type UncensoredConsentAgreeRequestOutput =
  typeof POST.types.RequestOutput;

const uncensoredConsentEndpoints = { GET, POST, DELETE } as const;
export default uncensoredConsentEndpoints;
