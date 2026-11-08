/**
 * Referral Earnings Confirm API Definition
 * POST endpoint (called by cron) that confirms earnings past the refund window
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral", "earnings", "confirm"],
  title: "earnings.confirm.post.title" as const,
  titleShort: "earnings.confirm.post.titleShort" as const,
  description: "earnings.confirm.post.description" as const,
  category: "referral" as const,
  subCategory: "Payouts" as const,
  icon: "clock" as const,
  tags: ["tags.referral", "tags.earnings"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "earnings.confirm.post.container.title" as const,
    description: "earnings.confirm.post.container.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      confirmedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "earnings.confirm.post.response.confirmedCount" as const,
        schema: z.number(),
      }),
      failedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "earnings.confirm.post.response.failedCount" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "earnings.confirm.post.success.title" as const,
    description: "earnings.confirm.post.success.description" as const,
  },

  examples: {
    responses: { default: { confirmedCount: 3, failedCount: 0 } },
  },
});

export type ReferralEarningsConfirmPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
