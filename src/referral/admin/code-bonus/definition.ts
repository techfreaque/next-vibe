/**
 * Referral Code Bonus - Definition
 * POST (admin): set the one-time bonus credits a referral code gives the
 * users it refers, paid out when they start their first paid plan (never on
 * free signup). 0 removes the bonus.
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
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  REFERRAL_CODE_BONUS_ALIAS,
  REFERRAL_CODE_BONUS_MAX,
} from "./constants";
import { scopedTranslation } from "./i18n";

const ReferralCodeBonusWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralCodeBonusWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "admin", "code-bonus"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "gift",
  category: "referral",
  subCategory: "Program",
  tags: ["tags.referral", "tags.admin"],
  aliases: [REFERRAL_CODE_BONUS_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ReferralCodeBonusWidget,
    usage: { request: "data", response: true } as const,
    children: {
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.code.label",
        description: "post.fields.code.description",
        placeholder: "post.fields.code.placeholder",
        columns: 6,
        schema: z.string().trim().min(1).max(50),
      }),
      bonusCredits: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.INT,
        label: "post.fields.bonusCredits.label",
        description: "post.fields.bonusCredits.description",
        placeholder: "post.fields.bonusCredits.placeholder",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(REFERRAL_CODE_BONUS_MAX),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      updatedCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.code",
        schema: z.string(),
      }),
      ownerEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.ownerEmail",
        schema: z.string(),
      }),
      previousBonusCredits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.previousBonusCredits",
        schema: z.coerce.number(),
      }),
      subscriptionBonusCredits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.subscriptionBonusCredits",
        schema: z.coerce.number(),
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
        code: "krysalid",
        bonusCredits: 100,
      },
    },
    responses: {
      default: {
        updatedCode: "krysalid",
        ownerEmail: "creator@example.com",
        previousBonusCredits: 0,
        subscriptionBonusCredits: 100,
      },
    },
  },
});

export type ReferralCodeBonusRequestOutput = typeof POST.types.RequestOutput;
export type ReferralCodeBonusResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
