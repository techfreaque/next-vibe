/**
 * User View API Endpoint Definition
 * Comprehensive user details with statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { UserViewContainer } from "./widget";

/**
 * GET endpoint for viewing detailed user information
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "view"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.userManagement",
  icon: "user" as const,
  tags: ["tags.user" as const, "tags.view" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UserViewContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // Request fields
      userId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.uuid(),
        label: "get.userId.label" as const,
        hidden: true,
      }),

      // Top action buttons
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),

      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.title" as const,
        usage: { response: true },
      }),

      // Basic User Information
      basicInfo: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          id: z.string(),
          email: z.string(),
          privateName: z.string(),
          publicName: z.string(),
          avatarUrl: z.string().nullable(),
          locale: z.string(),
          isActive: z.boolean(),
          emailVerified: z.boolean(),
          marketingConsent: z.boolean(),
          isBanned: z.boolean(),
          bannedReason: z.string().nullable(),
          twoFactorEnabled: z.boolean(),
          createdAt: z.coerce.date(),
          updatedAt: z.coerce.date(),
        }),
      }),

      // Chat Activity Statistics
      chatStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          totalThreads: z.coerce.number(),
          activeThreads: z.coerce.number(),
          archivedThreads: z.coerce.number(),
          totalMessages: z.coerce.number(),
          userMessages: z.coerce.number(),
          aiMessages: z.coerce.number(),
          lastActivityAt: z.coerce.date().nullable(),
        }),
      }),

      // Credit Information
      creditInfo: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          currentBalance: z.coerce.number(),
          freeCreditsRemaining: z.coerce.number(),
          totalCreditsEarned: z.coerce.number(),
          totalCreditsSpent: z.coerce.number(),
          totalCreditsPurchased: z.coerce.number(),
          freePeriodStart: z.coerce.date().nullable(),
          freePeriodId: z.string().nullable(),
          subscriptionCredits: z.coerce.number(),
          permanentCredits: z.coerce.number(),
          bonusCredits: z.coerce.number(),
          earnedCredits: z.coerce.number(),
          nextExpiry: z.coerce.date().nullable(),
        }),
      }),

      // Payment & Revenue Statistics
      paymentStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          totalRevenueCents: z.coerce.number(),
          totalPayments: z.coerce.number(),
          successfulPayments: z.coerce.number(),
          failedPayments: z.coerce.number(),
          totalRefundsCents: z.coerce.number(),
          lastPaymentAt: z.coerce.date().nullable(),
          stripeCustomerId: z.string().nullable(),
          hasActiveSubscription: z.boolean(),
        }),
      }),

      // Newsletter Status
      newsletterInfo: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          isSubscribed: z.boolean(),
          subscribedAt: z.coerce.date().nullable(),
          confirmedAt: z.coerce.date().nullable(),
          lastEmailSentAt: z.coerce.date().nullable(),
        }),
      }),

      // Referral Statistics
      referralStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          totalReferrals: z.coerce.number(),
          totalReferralRevenueCents: z.coerce.number(),
          totalReferralEarningsCents: z.coerce.number(),
          activeReferralCodes: z.coerce.number(),
        }),
      }),

      // User Roles
      roles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            role: z.string(),
            assignedAt: z.coerce.date(),
          }),
        ),
      }),

      // Recent Activity Summary
      recentActivity: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          lastLogin: z.coerce.date().nullable(),
          lastThreadCreated: z.coerce.date().nullable(),
          lastMessageSent: z.coerce.date().nullable(),
          lastPayment: z.coerce.date().nullable(),
        }),
      }),

      // Model Usage Statistics
      modelUsageStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            modelId: z.string(),
            totalCreditsSpent: z.coerce.number(),
            messageCount: z.coerce.number(),
          }),
        ),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        userId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        basicInfo: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "user@example.com",
          privateName: "John Doe",
          publicName: "JohnD",
          avatarUrl: null,
          locale: "en-US",
          isActive: true,
          emailVerified: true,
          marketingConsent: true,
          isBanned: false,
          bannedReason: null,
          twoFactorEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        chatStats: {
          totalThreads: 25,
          activeThreads: 10,
          archivedThreads: 15,
          totalMessages: 500,
          userMessages: 250,
          aiMessages: 250,
          lastActivityAt: new Date(),
        },
        creditInfo: {
          currentBalance: 1000,
          freeCreditsRemaining: 5,
          totalCreditsEarned: 200,
          totalCreditsSpent: 1500,
          totalCreditsPurchased: 2300,
          freePeriodStart: new Date(),
          freePeriodId: "2026-02",
          subscriptionCredits: 800,
          permanentCredits: 500,
          bonusCredits: 200,
          earnedCredits: 100,
          nextExpiry: new Date("2026-03-15"),
        },
        paymentStats: {
          totalRevenueCents: 5000,
          totalPayments: 5,
          successfulPayments: 5,
          failedPayments: 0,
          totalRefundsCents: 0,
          lastPaymentAt: new Date(),
          stripeCustomerId: "cus_123",
          hasActiveSubscription: true,
        },
        newsletterInfo: {
          isSubscribed: true,
          subscribedAt: new Date(),
          confirmedAt: new Date(),
          lastEmailSentAt: new Date(),
        },
        referralStats: {
          totalReferrals: 3,
          totalReferralRevenueCents: 15000,
          totalReferralEarningsCents: 3000,
          activeReferralCodes: 2,
        },
        roles: [
          {
            role: "CUSTOMER",
            assignedAt: new Date(),
          },
        ],
        recentActivity: {
          lastLogin: new Date(),
          lastThreadCreated: new Date(),
          lastMessageSent: new Date(),
          lastPayment: new Date(),
        },
        modelUsageStats: [
          {
            modelId: "gpt-5-mini",
            totalCreditsSpent: 150.5,
            messageCount: 42,
          },
          {
            modelId: "claude-sonnet-4-5",
            totalCreditsSpent: 85.2,
            messageCount: 18,
          },
        ],
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title",
      description: "errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
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
});

export type UserViewRequestOutput = typeof GET.types.RequestOutput;
export type UserViewResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
