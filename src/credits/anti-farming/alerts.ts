/**
 * Burst alert: mail the ops inboxes when enforced subnet/ASN limit events
 * pile up (thresholds in ./config.ts). Rate limited by a `burst_alert` marker
 * row in anti_farming_events. Never fails the caller.
 */

import "server-only";

import { and, count, desc, gte, inArray, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  BURST_ALERT_COOLDOWN_HOURS,
  BURST_ALERT_THRESHOLD,
  BURST_ALERT_WINDOW_MINUTES,
} from "./config";
import { type AntiFarmingEventKind, antiFarmingEvents } from "./db";

/** Ops inboxes only (platform system mail). Never a personal address. */
export const BURST_ALERT_RECIPIENTS = [
  "hi@unbottled.ai",
  "thea@unbottled.ai",
] as const;

/** Enforced limits that count towards a burst */
export const BURST_EVENT_KINDS = [
  "subnet_account_limit",
  "subnet_signup_limit",
  "asn_account_limit",
  "ip_link_limit",
] as const satisfies readonly AntiFarmingEventKind[];

export function isBurstEventKind(kind: AntiFarmingEventKind): boolean {
  return BURST_EVENT_KINDS.some((k) => k === kind);
}

/** Pure decision: enough events, and no alert inside the cooldown */
export function shouldSendBurstAlert({
  eventsInWindow,
  lastAlertAt,
  now,
}: {
  eventsInWindow: number;
  lastAlertAt: Date | null;
  now: Date;
}): boolean {
  if (eventsInWindow < BURST_ALERT_THRESHOLD) {
    return false;
  }
  return (
    !lastAlertAt ||
    now.getTime() - lastAlertAt.getTime() >=
      BURST_ALERT_COOLDOWN_HOURS * 3_600_000
  );
}

/**
 * Check the window and send one alert when due.
 * @returns true when an alert went out
 */
export async function maybeSendBurstAlert(
  logger: EndpointLogger,
  now: Date = new Date(),
): Promise<boolean> {
  try {
    const windowStart = new Date(
      now.getTime() - BURST_ALERT_WINDOW_MINUTES * 60_000,
    );
    const rows = await db
      .select({
        kind: antiFarmingEvents.kind,
        subnet: antiFarmingEvents.subnet,
        events: count(),
      })
      .from(antiFarmingEvents)
      .where(
        and(
          inArray(antiFarmingEvents.kind, [...BURST_EVENT_KINDS]),
          gte(antiFarmingEvents.createdAt, windowStart),
        ),
      )
      .groupBy(antiFarmingEvents.kind, antiFarmingEvents.subnet)
      .orderBy(desc(count()));
    const eventsInWindow = rows.reduce((sum, r) => sum + Number(r.events), 0);
    if (eventsInWindow < BURST_ALERT_THRESHOLD) {
      return false;
    }
    const [last] = await db
      .select({ at: sql<Date>`max(${antiFarmingEvents.createdAt})` })
      .from(antiFarmingEvents)
      .where(sql`${antiFarmingEvents.kind} = 'burst_alert'`);
    const lastAlertAt = last?.at ? new Date(last.at) : null;
    if (!shouldSendBurstAlert({ eventsInWindow, lastAlertAt, now })) {
      return false;
    }
    // Marker first: concurrent requests see it and skip
    await db.insert(antiFarmingEvents).values({ kind: "burst_alert" });

    const subject = `[unbottled anti-farming] ${String(eventsInWindow)} limit events in ${String(BURST_ALERT_WINDOW_MINUTES)} min`;
    const lines = rows.map(
      (r) =>
        `${String(r.events).padStart(4)}  ${r.kind.padEnd(22)} ${r.subnet ?? "-"}`,
    );
    const body = [
      `${String(eventsInWindow)} enforced subnet/ASN limit events since ${windowStart.toISOString()} (threshold ${String(BURST_ALERT_THRESHOLD)}).`,
      "Free pools and signups were refused as designed. A burst usually means one actor rotating proxies.",
      "",
      "count  kind                   network",
      ...lines,
      "",
      "Admin report: vibe --hermes --thea anti-farming-report",
      `Next alert at the earliest in ${String(BURST_ALERT_COOLDOWN_HOURS)} h.`,
    ].join("\n");

    const { EmailSendingRepository } =
      await import("@/messenger/providers/email/smtp-client/email-sending/repository");
    const { CampaignType } = await import("@/messenger/accounts/enum");
    const { BurstAlertMail } = await import("./burst-alert-mail");
    let sent = false;
    for (const to of BURST_ALERT_RECIPIENTS) {
      const result = await EmailSendingRepository.sendEmail(
        {
          jsx: BurstAlertMail({ subject, body }),
          subject,
          text: body,
          toEmail: to,
          toName: to,
          locale: defaultLocale,
          campaignType: CampaignType.SYSTEM,
          skipRateLimitCheck: true,
        },
        logger,
        defaultLocale,
      );
      if (result.success) {
        sent = true;
      } else {
        logger.error("Anti-farming burst alert mail failed", {
          to,
          error: result.message,
        });
      }
    }
    logger.warn("Anti-farming burst alert", { eventsInWindow, sent });
    return sent;
  } catch (error) {
    logger.error("Anti-farming burst alert check failed", parseError(error));
    return false;
  }
}
