/**
 * Verify Email endpoint.
 * - with `token` (from the mailed link): marks the account email verified
 * - without `token` (logged in): re-sends the verification email
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

import { scopedTranslation } from "./i18n";

const VerifyEmailWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VerifyEmailWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "verify-email"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "mail",
  category: "account",
  tags: ["tag"],
  aliases: ["verify-email"] as const,
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: customWidgetObject({
    render: VerifyEmailWidget,
    usage: { request: "data", response: true } as const,
    children: {
      token: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "token.label",
        description: "token.description",
        placeholder: "token.placeholder",
        columns: 12,
        schema: z.string().min(16).max(256).optional(),
      }),

      verified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.verified",
        schema: z.boolean(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.email",
        schema: z.string(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.message",
        schema: z.string(),
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
      default: {},
      withToken: { token: "example-verification-token-123456" },
    },
    responses: {
      default: {
        verified: false,
        email: "customer@example.com",
        message: "Verification email sent. Check your inbox.",
      },
      withToken: {
        verified: true,
        email: "customer@example.com",
        message: "Your email is verified.",
      },
    },
  },
});

export type VerifyEmailPostRequestInput = typeof POST.types.RequestInput;
export type VerifyEmailPostRequestOutput = typeof POST.types.RequestOutput;
export type VerifyEmailPostResponseInput = typeof POST.types.ResponseInput;
export type VerifyEmailPostResponseOutput = typeof POST.types.ResponseOutput;

const verifyEmailEndpoints = { POST };

export default verifyEmailEndpoints;
