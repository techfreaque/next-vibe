/**
 * User View API Endpoint Definition
 * Comprehensive user details with statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { UserViewContainer } from "./widget";

/**
 * GET endpoint for viewing detailed user information
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", "view"],
  title: "app.api.users.view.get.title",
  description: "app.api.users.view.get.description",
  category: "app.api.users.category",
  icon: "user" as const,
  tags: [
    "app.api.users.tags.user",
    "app.api.users.tags.view",
    "app.api.users.tags.stats",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UserViewContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // Request fields
      userId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.uuid(),
        label: "app.api.users.view.get.userId.label" as const,
        hidden: true,
      }),

      // Top action buttons
      backButton: backButton({ usage: { response: true } }),

      title: widgetField({
        type: WidgetType.TEXT,
        content: "app.api.users.view.get.title" as const,
        usage: { response: true },
      }),

      // Basic User Information
      basicInfo: responseField({
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
      chatStats: responseField({
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
      creditInfo: responseField({
        type: WidgetType.TEXT,
        schema: z.object({
          currentBalance: z.coerce.number(),
          freeCreditsRemaining: z.coerce.number(),
          totalCreditsEarned: z.coerce.number(),
          totalCreditsSpent: z.coerce.number(),
          totalCreditsPurchased: z.coerce.number(),
          freePeriodStart: z.coerce.date().nullable(),
          freePeriodId: z.string().nullable(),
        }),
      }),

      // Payment & Revenue Statistics
      paymentStats: responseField({
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
      newsletterInfo: responseField({
        type: WidgetType.TEXT,
        schema: z.object({
          isSubscribed: z.boolean(),
          subscribedAt: z.coerce.date().nullable(),
          confirmedAt: z.coerce.date().nullable(),
          lastEmailSentAt: z.coerce.date().nullable(),
        }),
      }),

      // Referral Statistics
      referralStats: responseField({
        type: WidgetType.TEXT,
        schema: z.object({
          totalReferrals: z.coerce.number(),
          totalReferralRevenueCents: z.coerce.number(),
          totalReferralEarningsCents: z.coerce.number(),
          activeReferralCodes: z.coerce.number(),
        }),
      }),

      // User Roles
      roles: responseField({
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            role: z.string(),
            assignedAt: z.coerce.date(),
          }),
        ),
      }),

      // Recent Activity Summary
      recentActivity: responseField({
        type: WidgetType.TEXT,
        schema: z.object({
          lastLogin: z.coerce.date().nullable(),
          lastThreadCreated: z.coerce.date().nullable(),
          lastMessageSent: z.coerce.date().nullable(),
          lastPayment: z.coerce.date().nullable(),
        }),
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
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.view.errors.validation.title",
      description: "app.api.users.view.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.view.errors.notFound.title",
      description: "app.api.users.view.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.view.errors.serverError.title",
      description: "app.api.users.view.errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.view.errors.network.title",
      description: "app.api.users.view.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.view.errors.unauthorized.title",
      description: "app.api.users.view.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.view.errors.forbidden.title",
      description: "app.api.users.view.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.view.errors.conflict.title",
      description: "app.api.users.view.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.view.errors.unknown.title",
      description: "app.api.users.view.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.users.view.errors.unsavedChanges.title",
      description: "app.api.users.view.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "app.api.users.view.success.title",
    description: "app.api.users.view.success.description",
  },
});

export type UserViewRequestOutput = typeof GET.types.RequestOutput;
export type UserViewResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
