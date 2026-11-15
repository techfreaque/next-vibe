/**
 * Referral Code Reassign - Definition
 * POST (admin): move a referral code to another account. Users the code
 * already referred stay attributed to it, so their future commission goes to
 * the new owner. Past earnings never move. Dry run by default.
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

import { REFERRAL_CODE_REASSIGN_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ReferralCodeReassignWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ReferralCodeReassignWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "admin", "code-reassign"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "user-check",
  category: "referral",
  subCategory: "Program",
  tags: ["tags.referral", "tags.admin"],
  aliases: [REFERRAL_CODE_REASSIGN_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ReferralCodeReassignWidget,
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
      targetUser: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.targetUser.label",
        description: "post.fields.targetUser.description",
        placeholder: "post.fields.targetUser.placeholder",
        columns: 6,
        schema: z.string().trim().min(1).max(320),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 12,
        schema: z.boolean().optional().default(true),
      }),
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),

      dryRunApplied: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.dryRun",
        schema: z.boolean(),
      }),
      reassignedCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.code",
        schema: z.string(),
      }),
      fromUserId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.fromUserId",
        schema: z.uuid(),
      }),
      fromEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.fromEmail",
        schema: z.string(),
      }),
      toUserId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.toUserId",
        schema: z.uuid(),
      }),
      toEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.toEmail",
        schema: z.string(),
      }),
      referralsMoved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.referralsMoved",
        schema: z.coerce.number(),
      }),
      selfReferralsKept: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.selfReferralsKept",
        schema: z.coerce.number(),
      }),
      linksMoved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.linksMoved",
        schema: z.coerce.number(),
      }),
      linksTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.linksTotal",
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
        code: "quelllm",
        targetUser: "creator@example.com",
        dryRun: true,
      },
    },
    responses: {
      default: {
        dryRunApplied: true,
        reassignedCode: "quelllm",
        fromUserId: "3f1c2b4a-5d6e-4f70-8a9b-0c1d2e3f4a5b",
        fromEmail: "team@unbottled.ai",
        toUserId: "8e7d6c5b-4a39-4281-9f0e-1d2c3b4a5968",
        toEmail: "creator@example.com",
        referralsMoved: 3,
        selfReferralsKept: 0,
        linksMoved: 2,
        linksTotal: 2,
      },
    },
  },
});

export type ReferralCodeReassignRequestOutput = typeof POST.types.RequestOutput;
export type ReferralCodeReassignResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
