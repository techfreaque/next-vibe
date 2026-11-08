/**
 * Lifecycle endpoint repository - thin ResponseType wrappers over engine.ts.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  LifecycleBackfillPostRequestOutput,
  LifecycleBackfillPostResponseOutput,
} from "./backfill/definition";
import {
  getOverview,
  getSettings,
  runBackfill,
  runLifecycle,
  updateSettings,
} from "./engine";
import { LifecycleExitReason } from "./enum";
import { exitAllForEmail } from "./engine";
import type { LifecycleOverviewGetResponseOutput } from "./overview/definition";
import type {
  LifecycleRunPostRequestOutput,
  LifecycleRunPostResponseOutput,
} from "./run/definition";
import type {
  LifecycleSettingsPostRequestOutput,
  LifecycleSettingsPostResponseOutput,
} from "./settings/definition";
import { normalizeEmail } from "./snapshots";
import type { LifecycleT } from "./i18n";

export class LifecycleRepository {
  static async run(
    data: LifecycleRunPostRequestOutput,
    logger: EndpointLogger,
    t: LifecycleT,
  ): Promise<ResponseType<LifecycleRunPostResponseOutput>> {
    try {
      const result = await runLifecycle({ dryRun: data.dryRun, logger });
      return success(result);
    } catch (error) {
      logger.error("lifecycle.run.failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async overview(
    logger: EndpointLogger,
    t: LifecycleT,
  ): Promise<ResponseType<LifecycleOverviewGetResponseOutput>> {
    try {
      const { settings, journeys } = await getOverview(new Date());
      return success({ ...settings, journeys });
    } catch (error) {
      logger.error("lifecycle.overview.failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async settings(
    data: LifecycleSettingsPostRequestOutput,
    logger: EndpointLogger,
    t: LifecycleT,
  ): Promise<ResponseType<LifecycleSettingsPostResponseOutput>> {
    try {
      const hasPatch = Object.values(data).some((v) => v !== undefined);
      const s = hasPatch ? await updateSettings(data) : await getSettings();
      if (hasPatch) {
        logger.info("lifecycle.settings.updated", { ...s });
      }
      return success({
        currentPaused: s.paused,
        currentMinHoursBetweenEmails: s.minHoursBetweenEmails,
        currentMaxSendsPerRun: s.maxSendsPerRun,
        currentAutoEnrollWindowDays: s.autoEnrollWindowDays,
        currentRequireUserMarketingConsent: s.requireUserMarketingConsent,
      });
    } catch (error) {
      logger.error("lifecycle.settings.failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async backfill(
    data: LifecycleBackfillPostRequestOutput,
    logger: EndpointLogger,
    t: LifecycleT,
  ): Promise<ResponseType<LifecycleBackfillPostResponseOutput>> {
    try {
      const settings = await getSettings();
      const result = await runBackfill({
        dryRun: data.dryRun,
        spreadHours: data.spreadHours,
        now: new Date(),
        settings,
      });
      return success({
        dryRunResult: result.dryRun,
        segments: result.perJourney,
        heldSuppressed: result.held.suppressed,
        heldPaid: result.held.paid,
        heldNoConsent: result.held.noConsent,
        heldUnverified: result.held.unverified,
        heldPendingNewsletter: result.held.pendingNewsletter,
        heldInactiveAccount: result.held.inactiveAccount,
      });
    } catch (error) {
      logger.error("lifecycle.backfill.failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Called when a contact unsubscribes: exits every active journey immediately. */
  static async exitOnUnsubscribe(
    email: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const exited = await exitAllForEmail(
        normalizeEmail(email),
        LifecycleExitReason.UNSUBSCRIBED,
      );
      if (exited > 0) {
        logger.info("lifecycle.unsubscribe.exited", { exited });
      }
    } catch (error) {
      logger.error("lifecycle.unsubscribe.exit.failed", parseError(error));
    }
  }
}
