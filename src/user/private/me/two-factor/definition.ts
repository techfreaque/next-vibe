/**
 * Two-factor authentication (TOTP) endpoint.
 * One POST drives the whole lifecycle via `action`:
 * status -> setup (secret + QR) -> enable (confirm code, recovery codes)
 * -> disable | regenerate (recovery codes).
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

import { TwoFactorAction, TwoFactorActionOptions } from "./enum";
import { scopedTranslation } from "./i18n";

const TwoFactorWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TwoFactorWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "me", "two-factor"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "shield",
  category: "account",
  tags: ["tag"],
  aliases: ["two-factor", "2fa"] as const,
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: customWidgetObject({
    render: TwoFactorWidget,
    usage: { request: "data", response: true } as const,
    children: {
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.action.label",
        description: "fields.action.description",
        options: TwoFactorActionOptions,
        columns: 12,
        schema: z.enum(TwoFactorAction).default(TwoFactorAction.STATUS),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.code.label",
        description: "fields.code.description",
        placeholder: "fields.code.placeholder",
        columns: 12,
        schema: z.string().max(32).optional(),
      }),
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.password.label",
        description: "fields.password.description",
        placeholder: "fields.password.placeholder",
        columns: 12,
        schema: z.string().max(256).optional(),
      }),

      enabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.enabled",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.message",
        schema: z.string(),
      }),
      recoveryCodesRemaining: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.recoveryCodesRemaining",
        schema: z.number(),
      }),
      otpauthUri: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.otpauthUri",
        schema: z.string().optional(),
      }),
      secret: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.secret",
        schema: z.string().optional(),
      }),
      qrDataUri: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.qrDataUri",
        schema: z.string().optional(),
      }),
      recoveryCodes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.recoveryCodes",
        schema: z.array(z.string()).optional(),
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: { action: TwoFactorAction.STATUS },
      enable: { action: TwoFactorAction.ENABLE, code: "123456" },
    },
    responses: {
      default: {
        enabled: false,
        message: "Two-factor status loaded.",
        recoveryCodesRemaining: 0,
      },
      enable: {
        enabled: true,
        message: "Two-factor is on.",
        recoveryCodesRemaining: 10,
        recoveryCodes: ["ABCDE-FGHJK"],
      },
    },
  },
});

export type TwoFactorPostRequestInput = typeof POST.types.RequestInput;
export type TwoFactorPostRequestOutput = typeof POST.types.RequestOutput;
export type TwoFactorPostResponseInput = typeof POST.types.ResponseInput;
export type TwoFactorPostResponseOutput = typeof POST.types.ResponseOutput;

const twoFactorEndpoints = { POST };

export default twoFactorEndpoints;
