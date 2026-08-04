/**
 * Snyk Service
 * Vulnerability scanning with Snyk
 */

import { execSync } from "node:child_process";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import { releaseEnv } from "../env";
import { scopedTranslation } from "../i18n";
import { MESSAGES } from "./constants";

class SnykService {
  isAvailable(): boolean {
    try {
      execSync("snyk --version", { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }

  runSnykTest(
    cwd: string,
    packageName: string,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "snyk test" });
      return success();
    }

    logger.info(MESSAGES.SNYK_TESTING, { package: packageName });

    if (!this.isAvailable()) {
      logger.warn(MESSAGES.SNYK_CLI_NOT_FOUND);
      return success();
    }

    try {
      execSync("snyk test", { cwd, stdio: "inherit" });
      logger.info(MESSAGES.SNYK_TEST_PASSED);
      return success();
    } catch (error) {
      logger.error(MESSAGES.SNYK_TEST_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("snyk.testFailed", { packageName, error: String(error) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runSnykMonitor(
    cwd: string,
    packageName: string,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "snyk monitor" });
      return success();
    }

    logger.info(MESSAGES.SNYK_MONITORING, { package: packageName });

    if (!this.isAvailable()) {
      logger.warn(MESSAGES.SNYK_CLI_NOT_FOUND);
      return success();
    }

    if (!releaseEnv.SNYK_TOKEN) {
      logger.warn(MESSAGES.SNYK_TOKEN_REQUIRED);
      return success();
    }

    try {
      execSync("snyk monitor", { cwd, stdio: "inherit" });
      logger.info(MESSAGES.SNYK_MONITOR_PASSED);
      return success();
    } catch (error) {
      logger.error(MESSAGES.SNYK_MONITOR_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("snyk.monitorFailed", { packageName, error: String(error) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Singleton instance
export const snykService = new SnykService();
