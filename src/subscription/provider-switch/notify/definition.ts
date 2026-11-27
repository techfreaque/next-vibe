/**
 * Plan Move Notice API Definition
 * POST: one-time "move your plan" mail to every card subscriber.
 * dryRun (default) lists recipients and renders a preview; a real run sends
 * each user exactly once and is refused until the switch provider is live.
 * testRecipient sends the real mail to that one address only (no gate, no
 * notice row), rendered with a real subscriber's plan and deadline.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CountryLanguageValues } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { PaymentProvider, PaymentProviderDB } from "../../../payment/enum";
import { SubscriptionStatus } from "../../enum";
import { scopedTranslation } from "./i18n";

const PlanMoveNoticeWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PlanMoveNoticeWidget })),
);

/** Platform-wide mail per hour stays under the 500/h mailbox cap. */
export const DEFAULT_HOURLY_CAP = 400;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "provider-switch", "notify"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "payments",
  subCategory: "Management",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  aliases: ["subscription-provider-switch-notify"],

  fields: customWidgetObject({
    render: PlanMoveNoticeWidget,
    usage: { request: "data", response: true } as const,
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.batchSize.label",
        description: "post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(400).default(100),
      }),
      hourlyCap: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.hourlyCap.label",
        description: "post.fields.hourlyCap.description",
        columns: 6,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(450)
          .default(DEFAULT_HOURLY_CAP),
      }),
      previewLocale: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.previewLocale.label",
        description: "post.fields.previewLocale.description",
        columns: 6,
        schema: z.enum(CountryLanguageValues).optional(),
      }),
      testRecipient: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.fields.testRecipient.label",
        description: "post.fields.testRecipient.description",
        columns: 6,
        schema: z.email().optional(),
      }),

      providerLive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.providerLive",
        schema: z.boolean(),
      }),
      targetProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.targetProvider",
        schema: z.enum(PaymentProviderDB).optional(),
      }),
      totalRecipients: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.totalRecipients",
        schema: z.number(),
      }),
      alreadyNotified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.alreadyNotified",
        schema: z.number(),
      }),
      pending: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.pending",
        schema: z.number(),
      }),
      planNotSupported: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.planNotSupported",
        schema: z.number(),
      }),
      hourlyBudget: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.hourlyBudget",
        schema: z.number(),
      }),
      sent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.sent",
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.failed",
        schema: z.number(),
      }),
      byLocale: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            locale: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.locale",
              schema: z.string(),
            }),
            count: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.count",
              schema: z.number(),
            }),
          },
        }),
      }),
      recipients: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.userId",
              schema: z.string(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.email",
              schema: z.string(),
            }),
            locale: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.locale",
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.status",
              schema: z.enum(SubscriptionStatus),
            }),
            deadline: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.deadline",
              schema: z.string().optional(),
            }),
          },
        }),
      }),
      testSentTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.testSentTo",
        schema: z.string().optional(),
      }),
      previewSubject: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.previewSubject",
        schema: z.string().optional(),
      }),
      previewHtml: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.previewHtml",
        schema: z.string().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.notLive.title",
      description: "post.errors.notLive.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: { dryRun: true, batchSize: 100, hourlyCap: DEFAULT_HOURLY_CAP },
      test: {
        dryRun: true,
        batchSize: 100,
        hourlyCap: DEFAULT_HOURLY_CAP,
        testRecipient: "admin@example.com",
        previewLocale: "en-US",
      },
    },
    responses: {
      default: {
        providerLive: true,
        targetProvider: PaymentProvider.NOWPAYMENTS,
        totalRecipients: 14,
        alreadyNotified: 0,
        pending: 14,
        planNotSupported: 0,
        hourlyBudget: 390,
        sent: 0,
        failed: 0,
        byLocale: [
          { locale: "en-US", count: 6 },
          { locale: "de-DE", count: 4 },
        ],
        recipients: [
          {
            userId: "123e4567-e89b-12d3-a456-426614174000",
            email: "user@example.com",
            locale: "en-US",
            status: SubscriptionStatus.ACTIVE,
            deadline: "2026-12-15T00:00:00.000Z",
          },
        ],
      },
    },
  },
});

export type PlanMoveNoticePostRequestOutput = typeof POST.types.RequestOutput;
export type PlanMoveNoticePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
