/**
 * Lifecycle engine - enrollment, advancing due steps, backfill, exits.
 *
 * Safety properties (all enforced here, all covered by engine.test.ts):
 *  - Paused (default) => nothing is enrolled or sent. Backfill may enroll while paused
 *    (explicit admin action) but never sends.
 *  - A contact is enrolled at most once per journey (unique email+journey) and has at
 *    most one ACTIVE enrollment (partial unique index).
 *  - A step is sent at most once (lifecycle_sends is claimed BEFORE the mail leaves).
 *  - Consent + suppression are re-checked at SEND time, not just at enrollment.
 *  - Frequency cap spans lifecycle sends AND campaign sends.
 */

import "server-only";

import { and, asc, count, eq, inArray, lte, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { coreEnv } from "next-vibe/core/env";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { growthJourneys } from "@/leads/growth/db";

import type { LifecycleEnrollment, LifecycleSettings } from "./db";
import { lifecycleEnrollments, lifecycleSends, lifecycleSettings } from "./db";
import type { ContactSnapshot, HeldReasonValue } from "./eligibility";
import {
  capReleaseAt,
  classifyContact,
  hasUnsubscribed,
  isGoalMet,
  isSuppressed,
  staggerDueAt,
} from "./eligibility";
import { renderLifecycleEmail } from "./emails";
import type { LifecycleExitReasonValue, LifecycleJourneyValue } from "./enum";
import {
  LifecycleEnrollmentStatus,
  LifecycleExitReason,
  LifecycleJourneyDB,
  LifecycleSendStatus,
} from "./enum";
import { LIFECYCLE_JOURNEYS } from "./journeys";
import {
  listCandidateEmails,
  loadSnapshots,
  normalizeEmail,
} from "./snapshots";
import type { LifecycleTransport } from "./transport";
import { smtpLifecycleTransport } from "./transport";

const HOUR_MS = 3_600_000;
const SETTINGS_KEY = "global";
const MAX_FAILS = 3;

export type SettingsValues = Pick<
  LifecycleSettings,
  | "paused"
  | "minHoursBetweenEmails"
  | "maxSendsPerRun"
  | "requireUserMarketingConsent"
  | "autoEnrollWindowDays"
>;

export interface SettingsPatch {
  paused?: boolean;
  minHoursBetweenEmails?: number;
  maxSendsPerRun?: number;
  requireUserMarketingConsent?: boolean;
  autoEnrollWindowDays?: number;
}

export async function getSettings(): Promise<SettingsValues> {
  const [row] = await db
    .select()
    .from(lifecycleSettings)
    .where(eq(lifecycleSettings.key, SETTINGS_KEY))
    .limit(1);
  if (row) {
    return row;
  }
  // First touch: create the row PAUSED (column default).
  const [created] = await db
    .insert(lifecycleSettings)
    .values({ key: SETTINGS_KEY })
    .onConflictDoNothing()
    .returning();
  if (created) {
    return created;
  }
  const [again] = await db
    .select()
    .from(lifecycleSettings)
    .where(eq(lifecycleSettings.key, SETTINGS_KEY))
    .limit(1);
  return (
    again ?? {
      paused: true,
      minHoursBetweenEmails: 48,
      maxSendsPerRun: 25,
      requireUserMarketingConsent: true,
      autoEnrollWindowDays: 14,
    }
  );
}

export async function updateSettings(
  patch: SettingsPatch,
): Promise<SettingsValues> {
  await getSettings();
  await db
    .update(lifecycleSettings)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(lifecycleSettings.key, SETTINGS_KEY));
  return getSettings();
}

// ── Planning ────────────────────────────────────────────────────────────────

export interface PlannedEnrollment {
  snapshot: ContactSnapshot;
  journey: typeof LifecycleJourneyValue;
  triggerAt: Date;
}

export interface JourneyPlanCount {
  journey: typeof LifecycleJourneyValue;
  eligible: number;
  alreadyEnrolled: number;
}

export interface ContactPlan {
  toEnroll: PlannedEnrollment[];
  perJourney: JourneyPlanCount[];
  held: Record<HeldReasonValue, number>;
  /** auto mode: contacts whose trigger is older than the auto-enroll window. */
  outsideWindow: number;
}

function emptyHeld(): Record<HeldReasonValue, number> {
  return {
    suppressed: 0,
    paid: 0,
    noConsent: 0,
    unverified: 0,
    pendingNewsletter: 0,
    inactiveAccount: 0,
  };
}

export async function planContacts(opts: {
  mode: "auto" | "backfill";
  now: Date;
  settings: SettingsValues;
  onlyEmails?: readonly string[];
}): Promise<ContactPlan> {
  const emails = opts.onlyEmails
    ? [...new Set(opts.onlyEmails.map(normalizeEmail))]
    : await listCandidateEmails();
  const snapshots = await loadSnapshots(emails);

  const existingRows =
    emails.length === 0 ? [] : await selectEnrollmentsByEmails(emails);
  const journeysByEmail = new Map<string, Set<string>>();
  const activeEmails = new Set<string>();
  for (const row of existingRows) {
    const set = journeysByEmail.get(row.email) ?? new Set<string>();
    set.add(row.journey);
    journeysByEmail.set(row.email, set);
    if (row.status === LifecycleEnrollmentStatus.ACTIVE) {
      activeEmails.add(row.email);
    }
  }

  const perJourney = new Map<typeof LifecycleJourneyValue, JourneyPlanCount>(
    LifecycleJourneyDB.map((journey) => [
      journey,
      { journey, eligible: 0, alreadyEnrolled: 0 },
    ]),
  );
  const held = emptyHeld();
  const toEnroll: PlannedEnrollment[] = [];
  let outsideWindow = 0;
  const windowStart = new Date(
    opts.now.getTime() - opts.settings.autoEnrollWindowDays * 24 * HOUR_MS,
  );

  for (const snapshot of snapshots.values()) {
    const cls = classifyContact(snapshot, opts.settings);
    if (cls.journey === null) {
      held[cls.held] += 1;
      continue;
    }
    const counts = perJourney.get(cls.journey);
    if (!counts) {
      continue;
    }
    const seen = journeysByEmail.get(snapshot.email);
    if (seen?.has(cls.journey) || activeEmails.has(snapshot.email)) {
      counts.alreadyEnrolled += 1;
      continue;
    }
    if (opts.mode === "auto" && cls.triggerAt < windowStart) {
      outsideWindow += 1;
      continue;
    }
    counts.eligible += 1;
    toEnroll.push({
      snapshot,
      journey: cls.journey,
      triggerAt: cls.triggerAt,
    });
  }

  return {
    toEnroll,
    perJourney: [...perJourney.values()],
    held,
    outsideWindow,
  };
}

async function selectEnrollmentsByEmails(
  emails: readonly string[],
): Promise<Array<{ email: string; journey: string; status: string }>> {
  const out: Array<{ email: string; journey: string; status: string }> = [];
  for (let i = 0; i < emails.length; i += 400) {
    const rows = await db
      .select({
        email: lifecycleEnrollments.email,
        journey: lifecycleEnrollments.journey,
        status: lifecycleEnrollments.status,
      })
      .from(lifecycleEnrollments)
      .where(inArray(lifecycleEnrollments.email, emails.slice(i, i + 400)));
    out.push(...rows);
  }
  return out;
}

// ── Enrollment ──────────────────────────────────────────────────────────────

/** Insert enrollments. Conflicts (already enrolled / already active) are skipped. */
export async function enrollPlanned(
  items: readonly PlannedEnrollment[],
  dueAtFor: (ctx: { item: PlannedEnrollment; index: number }) => Date,
  fromBackfill: boolean,
): Promise<Map<typeof LifecycleJourneyValue, number>> {
  const enrolled = new Map<typeof LifecycleJourneyValue, number>();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const inserted = await db
      .insert(lifecycleEnrollments)
      .values({
        email: item.snapshot.email,
        journey: item.journey,
        userId: item.snapshot.userId,
        leadId: item.snapshot.leadId,
        locale: item.snapshot.locale ?? defaultLocale,
        nextDueAt: dueAtFor({ item, index: i }),
        fromBackfill,
      })
      .onConflictDoNothing()
      .returning({ id: lifecycleEnrollments.id });
    enrolled.set(
      item.journey,
      (enrolled.get(item.journey) ?? 0) + inserted.length,
    );
  }
  return enrolled;
}

function sumCounts(counts: Map<typeof LifecycleJourneyValue, number>): number {
  let total = 0;
  for (const n of counts.values()) {
    total += n;
  }
  return total;
}

export async function enrollNew(opts: {
  now: Date;
  settings: SettingsValues;
  onlyEmails?: readonly string[];
}): Promise<number> {
  const plan = await planContacts({ ...opts, mode: "auto" });
  const enrolled = await enrollPlanned(
    plan.toEnroll,
    ({ item }) => {
      const firstDelay = LIFECYCLE_JOURNEYS[item.journey].steps[0].delayHours;
      const due = new Date(item.triggerAt.getTime() + firstDelay * HOUR_MS);
      return due < opts.now ? opts.now : due;
    },
    false,
  );
  return sumCounts(enrolled);
}

export interface BackfillResult {
  dryRun: boolean;
  perJourney: Array<JourneyPlanCount & { enrolled: number }>;
  held: Record<HeldReasonValue, number>;
}

export async function runBackfill(opts: {
  dryRun: boolean;
  spreadHours: number;
  now: Date;
  settings: SettingsValues;
  onlyEmails?: readonly string[];
}): Promise<BackfillResult> {
  const plan = await planContacts({ ...opts, mode: "backfill" });
  let enrolledPer = new Map<typeof LifecycleJourneyValue, number>();
  if (!opts.dryRun) {
    // Most recently active first, spread across the send window.
    const ordered = plan.toEnroll.toSorted(
      (a, b) => b.triggerAt.getTime() - a.triggerAt.getTime(),
    );
    enrolledPer = await enrollPlanned(
      ordered,
      ({ index }) =>
        staggerDueAt(index, ordered.length, opts.now, opts.spreadHours),
      true,
    );
  }
  return {
    dryRun: opts.dryRun,
    perJourney: plan.perJourney.map((p) => ({
      ...p,
      enrolled: enrolledPer.get(p.journey) ?? 0,
    })),
    held: plan.held,
  };
}

// ── Exits ───────────────────────────────────────────────────────────────────

export async function exitEnrollment(
  id: string,
  reason: typeof LifecycleExitReasonValue,
): Promise<void> {
  const now = new Date();
  await db
    .update(lifecycleEnrollments)
    .set({
      status: LifecycleEnrollmentStatus.EXITED,
      exitReason: reason,
      exitedAt: now,
      convertedAt: reason === LifecycleExitReason.GOAL_MET ? now : undefined,
      updatedAt: now,
    })
    .where(
      and(
        eq(lifecycleEnrollments.id, id),
        eq(lifecycleEnrollments.status, LifecycleEnrollmentStatus.ACTIVE),
      ),
    );
}

/** Immediately exit every active journey of a contact (unsubscribe hook). */
export async function exitAllForEmail(
  email: string,
  reason: typeof LifecycleExitReasonValue,
): Promise<number> {
  const now = new Date();
  const rows = await db
    .update(lifecycleEnrollments)
    .set({
      status: LifecycleEnrollmentStatus.EXITED,
      exitReason: reason,
      exitedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(lifecycleEnrollments.email, normalizeEmail(email)),
        eq(lifecycleEnrollments.status, LifecycleEnrollmentStatus.ACTIVE),
      ),
    )
    .returning({ id: lifecycleEnrollments.id });
  return rows.length;
}

// ── Advancing ───────────────────────────────────────────────────────────────

export interface AdvanceResult {
  sent: number;
  exited: number;
  deferred: number;
  failed: number;
}

export async function advanceDue(opts: {
  now: Date;
  settings: SettingsValues;
  transport: LifecycleTransport;
  logger: EndpointLogger;
  onlyEmails?: readonly string[];
}): Promise<AdvanceResult> {
  const result: AdvanceResult = { sent: 0, exited: 0, deferred: 0, failed: 0 };
  if (opts.settings.paused) {
    return result;
  }

  const onlyEmails = opts.onlyEmails?.map(normalizeEmail);
  const due = await db
    .select()
    .from(lifecycleEnrollments)
    .where(
      and(
        eq(lifecycleEnrollments.status, LifecycleEnrollmentStatus.ACTIVE),
        lte(lifecycleEnrollments.nextDueAt, opts.now),
        onlyEmails
          ? inArray(lifecycleEnrollments.email, onlyEmails)
          : undefined,
      ),
    )
    .orderBy(asc(lifecycleEnrollments.nextDueAt))
    .limit(opts.settings.maxSendsPerRun * 4);
  if (due.length === 0) {
    return result;
  }
  const snapshots = await loadSnapshots(due.map((e) => e.email));
  // One email per contact per run, even if the cap were 0.
  const handledEmails = new Set<string>();

  for (const enrollment of due) {
    if (result.sent >= opts.settings.maxSendsPerRun) {
      break;
    }
    if (handledEmails.has(enrollment.email)) {
      continue;
    }
    handledEmails.add(enrollment.email);
    const snapshot = snapshots.get(enrollment.email);
    if (!snapshot) {
      await exitEnrollment(enrollment.id, LifecycleExitReason.INELIGIBLE);
      result.exited += 1;
      continue;
    }
    const outcome = await processEnrollment(enrollment, snapshot, opts);
    result[outcome] += 1;
  }
  return result;
}

async function processEnrollment(
  enrollment: LifecycleEnrollment,
  snapshot: ContactSnapshot,
  opts: {
    now: Date;
    settings: SettingsValues;
    transport: LifecycleTransport;
    logger: EndpointLogger;
  },
): Promise<keyof AdvanceResult> {
  const journey = LIFECYCLE_JOURNEYS[enrollment.journey];

  // 1. Suppression always wins.
  if (isSuppressed(snapshot)) {
    await exitEnrollment(
      enrollment.id,
      hasUnsubscribed(snapshot)
        ? LifecycleExitReason.UNSUBSCRIBED
        : LifecycleExitReason.SUPPRESSED,
    );
    return "exited";
  }
  // 2. Goal reached => quiet exit.
  if (isGoalMet(enrollment.journey, snapshot)) {
    await exitEnrollment(enrollment.id, LifecycleExitReason.GOAL_MET);
    return "exited";
  }
  // 3. Still lawful + still the right journey?
  const cls = classifyContact(snapshot, opts.settings);
  if (cls.journey !== enrollment.journey) {
    await exitEnrollment(enrollment.id, LifecycleExitReason.INELIGIBLE);
    return "exited";
  }
  const step = journey.steps[enrollment.nextStep];
  if (!step) {
    await db
      .update(lifecycleEnrollments)
      .set({
        status: LifecycleEnrollmentStatus.COMPLETED,
        updatedAt: opts.now,
      })
      .where(eq(lifecycleEnrollments.id, enrollment.id));
    return "exited";
  }
  // 4. Frequency cap.
  const release = capReleaseAt(
    snapshot.lastEmailAt,
    opts.settings.minHoursBetweenEmails,
  );
  if (release && release.getTime() > opts.now.getTime()) {
    await db
      .update(lifecycleEnrollments)
      .set({ nextDueAt: release, updatedAt: opts.now })
      .where(eq(lifecycleEnrollments.id, enrollment.id));
    return "deferred";
  }
  // 5. Claim the (enrollment, step) slot BEFORE sending - never send a step twice.
  const claimed = await db
    .insert(lifecycleSends)
    .values({
      enrollmentId: enrollment.id,
      email: enrollment.email,
      step: enrollment.nextStep,
      status: LifecycleSendStatus.PENDING,
    })
    .onConflictDoNothing()
    .returning({ id: lifecycleSends.id });
  if (claimed.length === 0) {
    opts.logger.warn("lifecycle.send.claim.conflict", {
      enrollmentId: enrollment.id,
      step: enrollment.nextStep,
    });
    return "deferred";
  }
  const sendId = claimed[0].id;

  try {
    const locale = enrollment.locale;
    const rendered = await renderLifecycleEmail({
      template: step.template,
      locale,
      email: enrollment.email,
      leadId: snapshot.leadId,
      userId: snapshot.userId,
      baseUrl: coreEnv.NEXT_PUBLIC_APP_URL,
    });
    const sent = await opts.transport.send(
      {
        to: enrollment.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        locale,
        newsletterOnly: snapshot.user === null,
        leadId: snapshot.leadId,
        unsubscribeUrl: rendered.unsubscribeUrl,
      },
      opts.logger,
    );
    if (!sent.success) {
      return await failSend(enrollment, sendId, sent.message, opts);
    }
    const nextStep = enrollment.nextStep + 1;
    const finished = nextStep >= journey.steps.length;
    await db
      .update(lifecycleSends)
      .set({
        status: LifecycleSendStatus.SENT,
        messageId: sent.data.messageId,
        sentAt: opts.now,
      })
      .where(eq(lifecycleSends.id, sendId));
    await db
      .update(lifecycleEnrollments)
      .set({
        nextStep,
        lastSentAt: opts.now,
        failCount: 0,
        status: finished
          ? LifecycleEnrollmentStatus.COMPLETED
          : LifecycleEnrollmentStatus.ACTIVE,
        nextDueAt: finished
          ? opts.now
          : new Date(
              opts.now.getTime() + journey.steps[nextStep].delayHours * HOUR_MS,
            ),
        updatedAt: opts.now,
      })
      .where(eq(lifecycleEnrollments.id, enrollment.id));
    if (snapshot.leadId) {
      await db
        .update(leads)
        .set({ lastEmailSentAt: opts.now })
        .where(eq(leads.id, snapshot.leadId));
    }
    return "sent";
  } catch (error) {
    return await failSend(enrollment, sendId, parseError(error).message, opts);
  }
}

/** Release the claim so the step can be retried later; give up after MAX_FAILS. */
async function failSend(
  enrollment: LifecycleEnrollment,
  sendId: string,
  message: string,
  opts: { now: Date; logger: EndpointLogger },
): Promise<"failed"> {
  opts.logger.error("lifecycle.send.failed", {
    enrollmentId: enrollment.id,
    message,
  });
  await db.delete(lifecycleSends).where(eq(lifecycleSends.id, sendId));
  const failCount = enrollment.failCount + 1;
  if (failCount >= MAX_FAILS) {
    await exitEnrollment(enrollment.id, LifecycleExitReason.SEND_FAILED);
  } else {
    await db
      .update(lifecycleEnrollments)
      .set({
        failCount,
        nextDueAt: new Date(opts.now.getTime() + HOUR_MS),
        updatedAt: opts.now,
      })
      .where(eq(lifecycleEnrollments.id, enrollment.id));
  }
  return "failed";
}

// ── Run (scheduled task body) ───────────────────────────────────────────────

export interface RunResult {
  paused: boolean;
  enrolled: number;
  sent: number;
  exited: number;
  deferred: number;
  failed: number;
}

export async function runLifecycle(opts: {
  dryRun: boolean;
  logger: EndpointLogger;
  transport?: LifecycleTransport;
  now?: Date;
  settings?: SettingsValues;
  onlyEmails?: readonly string[];
}): Promise<RunResult> {
  const settings = opts.settings ?? (await getSettings());
  const now = opts.now ?? new Date();
  const empty: RunResult = {
    paused: settings.paused,
    enrolled: 0,
    sent: 0,
    exited: 0,
    deferred: 0,
    failed: 0,
  };
  if (settings.paused || opts.dryRun) {
    return empty;
  }
  const enrolled = await enrollNew({
    now,
    settings,
    onlyEmails: opts.onlyEmails,
  });
  const advanced = await advanceDue({
    now,
    settings,
    transport: opts.transport ?? smtpLifecycleTransport,
    logger: opts.logger,
    onlyEmails: opts.onlyEmails,
  });
  return { ...empty, enrolled, ...advanced };
}

// ── Overview ────────────────────────────────────────────────────────────────

export interface JourneyOverview {
  journey: typeof LifecycleJourneyValue;
  steps: number;
  enrolled: number;
  active: number;
  completed: number;
  exited: number;
  converted: number;
  unsubscribed: number;
  sent: number;
  sent24h: number;
  /** Enrolled users whose first paid step (growth_journeys) came after enrollment. */
  attributedPaid: number;
}

export async function getOverview(now: Date): Promise<{
  settings: SettingsValues;
  journeys: JourneyOverview[];
}> {
  const settings = await getSettings();
  const since24h = new Date(now.getTime() - 24 * HOUR_MS);

  const statusRows = await db
    .select({
      journey: lifecycleEnrollments.journey,
      status: lifecycleEnrollments.status,
      exitReason: lifecycleEnrollments.exitReason,
      n: count(),
    })
    .from(lifecycleEnrollments)
    .groupBy(
      lifecycleEnrollments.journey,
      lifecycleEnrollments.status,
      lifecycleEnrollments.exitReason,
    );

  const sendRows = await db
    .select({
      journey: lifecycleEnrollments.journey,
      sent: count(),
      sent24h: sql<number>`count(*) filter (where ${lifecycleSends.sentAt} >= ${since24h})`,
    })
    .from(lifecycleSends)
    .innerJoin(
      lifecycleEnrollments,
      eq(lifecycleSends.enrollmentId, lifecycleEnrollments.id),
    )
    .where(eq(lifecycleSends.status, LifecycleSendStatus.SENT))
    .groupBy(lifecycleEnrollments.journey);

  const paidRows = await db
    .select({ journey: lifecycleEnrollments.journey, n: count() })
    .from(lifecycleEnrollments)
    .innerJoin(
      growthJourneys,
      eq(growthJourneys.userId, lifecycleEnrollments.userId),
    )
    .where(
      sql`${growthJourneys.firstPaidAt} >= ${lifecycleEnrollments.enrolledAt}`,
    )
    .groupBy(lifecycleEnrollments.journey);

  const journeys: JourneyOverview[] = LifecycleJourneyDB.map((journey) => {
    const o: JourneyOverview = {
      journey,
      steps: LIFECYCLE_JOURNEYS[journey].steps.length,
      enrolled: 0,
      active: 0,
      completed: 0,
      exited: 0,
      converted: 0,
      unsubscribed: 0,
      sent: 0,
      sent24h: 0,
      attributedPaid: 0,
    };
    for (const r of statusRows) {
      if (r.journey !== journey) {
        continue;
      }
      const n = Number(r.n);
      o.enrolled += n;
      if (r.status === LifecycleEnrollmentStatus.ACTIVE) {
        o.active += n;
      } else if (r.status === LifecycleEnrollmentStatus.COMPLETED) {
        o.completed += n;
      } else {
        o.exited += n;
      }
      if (r.exitReason === LifecycleExitReason.GOAL_MET) {
        o.converted += n;
      }
      if (r.exitReason === LifecycleExitReason.UNSUBSCRIBED) {
        o.unsubscribed += n;
      }
    }
    const s = sendRows.find((x) => x.journey === journey);
    o.sent = Number(s?.sent ?? 0);
    o.sent24h = Number(s?.sent24h ?? 0);
    o.attributedPaid = Number(
      paidRows.find((x) => x.journey === journey)?.n ?? 0,
    );
    return o;
  });
  return { settings, journeys };
}
