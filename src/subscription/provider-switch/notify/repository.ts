/**
 * Plan Move Notice Repository
 *
 * One-time mail to every user whose plan still bills on the paused card
 * processor (active, trialing, past due, cancel at period end). Guarantees:
 * - Refused (CONFLICT) unless the switch provider is configured, enabled and
 *   ready, so it cannot go out before the switch page works. Dry run always
 *   works and sends nothing.
 * - Exactly once per user: a subscription_switch_notices row (unique user_id)
 *   is claimed BEFORE the send. A crash mid-send leaves SENDING, which is
 *   never retried (at most once beats twice). Only FAILED rows retry.
 * - Paced: each run sends at most min(batchSize, hourlyCap minus all
 *   platform mail of the last hour), under the 500/h mailbox cap.
 * Sent from the platform SYSTEM mailer (hi@unbottled.ai), never locally.
 * testRecipient: the same mail to one address, no gate, no notice row.
 */

import "server-only";

import { render } from "@react-email/render";
import { and, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configScopedTranslation } from "@/env/i18n";
import { emails } from "@/messenger/messages/db";

import { createTrackingContext } from "../../../messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailSendingRepository } from "../../../messenger/providers/email/smtp-client/email-sending/repository";
import type { SmtpAccountOverride } from "../../../messenger/providers/email/smtp-client/repository";
import { PaymentProvider } from "../../../payment/enum";
import { getTierProductForPlan } from "../../../products/repository-client";
import { subscriptions } from "../../db";
import {
  BillingInterval,
  type BillingIntervalValue,
  SubscriptionPlan,
  type SubscriptionPlanValue,
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "../../enum";
import { scopedTranslation as subscriptionScopedTranslation } from "../../i18n";
import { PROVIDER_SWITCH_ANCHOR } from "../anchor";
import { subscriptionSwitchNotices } from "../db";
import { SwitchNoticeStatus } from "../enum";
import { resolveSwitchDeadline, SWITCHABLE_STATUSES } from "../rules";
import { getActiveSwitchTarget } from "../targets";
import type {
  PlanMoveNoticePostRequestOutput,
  PlanMoveNoticePostResponseOutput,
} from "./definition";
import {
  planMoveNoticeEmailTemplate,
  type PlanMoveNoticeProps,
  planMoveNoticeSubjectKey,
} from "./email";
import type { SubscriptionProviderSwitchNotifyT } from "./i18n";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface NoticeRecipient {
  userId: string;
  email: string;
  privateName: string;
  locale: CountryLanguage;
  status: typeof SubscriptionStatusValue;
  planId: typeof SubscriptionPlanValue;
  billingInterval: typeof BillingIntervalValue;
  subscriptionId: string;
  deadline: Date | null;
}

/** Links and labels of one recipient's mail, in their own locale. */
export function buildNoticeProps(
  recipient: Pick<
    NoticeRecipient,
    "privateName" | "locale" | "status" | "planId" | "deadline"
  >,
  appUrl: string,
): PlanMoveNoticeProps {
  const { t } = subscriptionScopedTranslation.scopedT(recipient.locale);
  return {
    privateName: recipient.privateName,
    planName: t(recipient.planId),
    deadline: recipient.deadline
      ? formatSimpleDate(recipient.deadline, recipient.locale)
      : "",
    pastDue: recipient.status === SubscriptionStatus.PAST_DUE,
    switchUrl: `${appUrl}/${recipient.locale}/subscription/overview#${PROVIDER_SWITCH_ANCHOR}`,
    cryptoUrl: `${appUrl}/${recipient.locale}/subscription/buy`,
  };
}

export class PlanMoveNoticeRepository {
  /** Card subscribers still billing on the paused processor. */
  static async listRecipients(): Promise<NoticeRecipient[]> {
    const rows = await db
      .select({
        userId: subscriptions.userId,
        email: users.email,
        privateName: users.privateName,
        locale: users.locale,
        status: subscriptions.status,
        planId: subscriptions.planId,
        billingInterval: subscriptions.billingInterval,
        subscriptionId: subscriptions.providerSubscriptionId,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        trialEnd: subscriptions.trialEnd,
        gracePeriodEndsAt: subscriptions.gracePeriodEndsAt,
      })
      .from(subscriptions)
      .innerJoin(users, eq(users.id, subscriptions.userId))
      .where(
        and(
          eq(subscriptions.provider, PaymentProvider.STRIPE),
          inArray(subscriptions.status, [...SWITCHABLE_STATUSES]),
          isNotNull(subscriptions.providerSubscriptionId),
          eq(users.isActive, true),
          eq(users.isBanned, false),
        ),
      )
      .orderBy(subscriptions.currentPeriodEnd);

    const recipients: NoticeRecipient[] = [];
    for (const row of rows) {
      if (!row.subscriptionId || !row.email) {
        continue;
      }
      recipients.push({
        userId: row.userId,
        email: row.email,
        privateName: row.privateName,
        locale: row.locale,
        status: row.status,
        planId: row.planId,
        billingInterval: row.billingInterval,
        subscriptionId: row.subscriptionId,
        deadline: resolveSwitchDeadline(row),
      });
    }
    return recipients;
  }

  static async run(
    data: PlanMoveNoticePostRequestOutput,
    logger: EndpointLogger,
    t: SubscriptionProviderSwitchNotifyT,
  ): Promise<ResponseType<PlanMoveNoticePostResponseOutput>> {
    try {
      const target = getActiveSwitchTarget();
      if (data.testRecipient) {
        return await PlanMoveNoticeRepository.sendTest(
          {
            testRecipient: data.testRecipient,
            locale: data.previewLocale ?? "en-US",
          },
          logger,
          t,
        );
      }
      if (!data.dryRun && !target) {
        logger.warn("Plan move notice refused: switch provider not live");
        return fail({
          message: t("post.errors.notLive.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const recipients = await PlanMoveNoticeRepository.listRecipients();
      const notices =
        recipients.length === 0
          ? []
          : await db
              .select({
                userId: subscriptionSwitchNotices.userId,
                status: subscriptionSwitchNotices.status,
              })
              .from(subscriptionSwitchNotices)
              .where(
                inArray(
                  subscriptionSwitchNotices.userId,
                  recipients.map((r) => r.userId),
                ),
              );
      const done = new Set(
        notices
          .filter((n) => n.status !== SwitchNoticeStatus.FAILED)
          .map((n) => n.userId),
      );
      // Never promise a one-click move the switch page cannot deliver: plans
      // the target does not sell (e.g. Starter monthly on NOWPayments) wait
      // for a provider that does.
      const unsupported = target
        ? recipients.filter((r) => {
            const tier = getTierProductForPlan(r.planId);
            return (
              !tier ||
              !target.supportsPlan(
                tier,
                r.billingInterval === BillingInterval.YEARLY ? "year" : "month",
              )
            );
          })
        : [];
      const unsupportedIds = new Set(unsupported.map((r) => r.userId));
      const pending = recipients.filter(
        (r) => !done.has(r.userId) && !unsupportedIds.has(r.userId),
      );

      const [lastHour] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(emails)
        .where(gte(emails.createdAt, new Date(Date.now() - HOUR_MS)));
      const hourlyBudget = Math.max(0, data.hourlyCap - (lastHour?.count ?? 0));
      const thisRun = pending.slice(
        0,
        data.dryRun ? data.batchSize : Math.min(data.batchSize, hourlyBudget),
      );

      const localeCounts = new Map<string, number>();
      for (const recipient of pending) {
        localeCounts.set(
          recipient.locale,
          (localeCounts.get(recipient.locale) ?? 0) + 1,
        );
      }

      const appUrl = envClient.NEXT_PUBLIC_APP_URL;
      let previewSubject: string | undefined;
      let previewHtml: string | undefined;
      if (data.previewLocale) {
        const previewLocale = data.previewLocale;
        const sample = pending.find((r) => r.locale === previewLocale);
        const rendered = await PlanMoveNoticeRepository.renderNotice(
          sample
            ? buildNoticeProps(sample, appUrl)
            : {
                ...planMoveNoticeEmailTemplate.exampleProps,
                switchUrl: `${appUrl}/${previewLocale}/subscription/overview#${PROVIDER_SWITCH_ANCHOR}`,
                cryptoUrl: `${appUrl}/${previewLocale}/subscription/buy`,
              },
          previewLocale,
          sample?.email ?? "preview@example.com",
        );
        previewSubject = rendered.subject;
        previewHtml = await render(rendered.jsx);
      }

      let sent = 0;
      let failed = 0;
      if (!data.dryRun) {
        for (const recipient of thisRun) {
          const ok = await PlanMoveNoticeRepository.sendOnce(
            recipient,
            appUrl,
            logger,
          );
          if (ok === "sent") {
            sent++;
          } else if (ok === "failed") {
            failed++;
          }
        }
        logger.info("Plan move notices processed", {
          recipients: recipients.length,
          pending: pending.length,
          sent,
          failed,
          hourlyBudget,
        });
      }

      return success({
        providerLive: Boolean(target),
        targetProvider: target?.provider,
        totalRecipients: recipients.length,
        alreadyNotified: done.size,
        planNotSupported: unsupported.length,
        pending: pending.length - sent,
        hourlyBudget: Math.max(0, hourlyBudget - sent - failed),
        sent,
        failed,
        byLocale: [...localeCounts.entries()]
          .map(([locale, count]) => ({ locale, count }))
          .toSorted((a, b) => b.count - a.count),
        recipients: thisRun.map((r) => ({
          userId: r.userId,
          email: r.email,
          locale: r.locale,
          status: r.status,
          deadline: r.deadline?.toISOString(),
        })),
        previewSubject,
        previewHtml,
      });
    } catch (error) {
      logger.error("Plan move notice run failed", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Subject + JSX of one notice in the recipient's locale. */
  static async renderNotice(
    props: PlanMoveNoticeProps,
    locale: CountryLanguage,
    recipientEmail: string,
    leadId?: string,
    userId?: string,
  ): Promise<{
    subject: string;
    jsx: ReturnType<typeof planMoveNoticeEmailTemplate.component>;
  }> {
    const { t } = planMoveNoticeEmailTemplate.scopedTranslation.scopedT(locale);
    const appName = configScopedTranslation.scopedT(locale).t("appName");
    return {
      subject: t(planMoveNoticeSubjectKey(props), {
        appName,
        deadline: props.deadline,
      }),
      jsx: planMoveNoticeEmailTemplate.component({
        props,
        t,
        locale,
        recipientEmail,
        tracking: createTrackingContext(locale, leadId, userId),
      }),
    };
  }

  /**
   * Renders and sends one notice through the platform mailer. The single send
   * path for the real run and the admin test send.
   */
  static async deliverNotice(
    params: {
      props: PlanMoveNoticeProps;
      locale: CountryLanguage;
      toEmail: string;
      toName: string;
      leadId?: string;
      userId?: string;
    },
    logger: EndpointLogger,
    accountOverride?: SmtpAccountOverride,
  ): Promise<ResponseType<{ subject: string; messageId: string }>> {
    const { subject, jsx } = await PlanMoveNoticeRepository.renderNotice(
      params.props,
      params.locale,
      params.toEmail,
      params.leadId,
      params.userId,
    );
    const result = await EmailSendingRepository.sendEmail(
      {
        jsx,
        subject,
        toEmail: params.toEmail,
        toName: params.toName,
        locale: params.locale,
        leadId: params.leadId,
        accountOverride,
      },
      logger,
      params.locale,
    );
    if (!result.success) {
      return result;
    }
    return success({ subject, messageId: result.data.result.messageId });
  }

  /**
   * Sample props for a test send: a real card subscriber's plan and future
   * deadline (never their name), else a Plus plan ending in 30 days.
   */
  static async buildTestProps(
    locale: CountryLanguage,
    appUrl: string,
  ): Promise<PlanMoveNoticeProps> {
    const recipients = await PlanMoveNoticeRepository.listRecipients();
    const now = Date.now();
    const sample = recipients.find(
      (r) =>
        r.deadline &&
        r.deadline.getTime() > now &&
        r.status !== SubscriptionStatus.PAST_DUE,
    );
    return buildNoticeProps(
      {
        privateName: planMoveNoticeEmailTemplate.exampleProps.privateName,
        locale,
        status: sample?.status ?? SubscriptionStatus.ACTIVE,
        planId: sample?.planId ?? SubscriptionPlan.PLUS,
        deadline: sample?.deadline ?? new Date(Date.now() + 30 * DAY_MS),
      },
      appUrl,
    );
  }

  /**
   * Admin test send: the real notice to one address only. Ignores the
   * provider-live gate and never writes a subscription_switch_notices row.
   */
  static async sendTest(
    params: { testRecipient: string; locale: CountryLanguage },
    logger: EndpointLogger,
    t: SubscriptionProviderSwitchNotifyT,
    accountOverride?: SmtpAccountOverride,
  ): Promise<ResponseType<PlanMoveNoticePostResponseOutput>> {
    const target = getActiveSwitchTarget();
    const props = await PlanMoveNoticeRepository.buildTestProps(
      params.locale,
      envClient.NEXT_PUBLIC_APP_URL,
    );
    const result = await PlanMoveNoticeRepository.deliverNotice(
      {
        props,
        locale: params.locale,
        toEmail: params.testRecipient,
        toName: props.privateName,
      },
      logger,
      accountOverride,
    );
    if (!result.success) {
      logger.error("Plan move notice test send failed", {
        to: params.testRecipient,
        error: result.message,
      });
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
    logger.info("Plan move notice test sent", {
      to: params.testRecipient,
      subject: result.data.subject,
      messageId: result.data.messageId,
    });
    return success({
      providerLive: Boolean(target),
      targetProvider: target?.provider,
      totalRecipients: 0,
      alreadyNotified: 0,
      pending: 0,
      planNotSupported: 0,
      hourlyBudget: 0,
      sent: 1,
      failed: 0,
      byLocale: [],
      recipients: [],
      testSentTo: params.testRecipient,
      previewSubject: result.data.subject,
    });
  }

  /** Claims the user's notice row, then sends. Never sends twice. */
  private static async sendOnce(
    recipient: NoticeRecipient,
    appUrl: string,
    logger: EndpointLogger,
  ): Promise<"sent" | "failed" | "skipped"> {
    const now = new Date();
    const [claimed] = await db
      .insert(subscriptionSwitchNotices)
      .values({
        userId: recipient.userId,
        subscriptionId: recipient.subscriptionId,
        status: SwitchNoticeStatus.SENDING,
      })
      .onConflictDoUpdate({
        target: subscriptionSwitchNotices.userId,
        set: {
          status: SwitchNoticeStatus.SENDING,
          error: null,
          updatedAt: now,
        },
        setWhere: eq(
          subscriptionSwitchNotices.status,
          SwitchNoticeStatus.FAILED,
        ),
      })
      .returning({ id: subscriptionSwitchNotices.id });
    if (!claimed) {
      return "skipped";
    }

    const [lead] = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, recipient.userId))
      .limit(1);

    let error: string | null = null;
    try {
      const result = await PlanMoveNoticeRepository.deliverNotice(
        {
          props: buildNoticeProps(recipient, appUrl),
          locale: recipient.locale,
          toEmail: recipient.email,
          toName: recipient.privateName,
          leadId: lead?.leadId,
          userId: recipient.userId,
        },
        logger,
      );
      if (!result.success) {
        error = result.message;
      }
    } catch (sendError) {
      error = parseError(sendError).message;
    }

    await db
      .update(subscriptionSwitchNotices)
      .set(
        error
          ? { status: SwitchNoticeStatus.FAILED, error, updatedAt: new Date() }
          : {
              status: SwitchNoticeStatus.SENT,
              sentAt: new Date(),
              updatedAt: new Date(),
            },
      )
      .where(eq(subscriptionSwitchNotices.id, claimed.id));

    if (error) {
      logger.error("Plan move notice send failed", {
        userId: recipient.userId,
        error,
      });
      return "failed";
    }
    return "sent";
  }
}
