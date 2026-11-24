/**
 * Server-side data the /setup page renders with: the current admin email,
 * which settings are already configured, and the one-time bootstrap login.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation as settingsScopedTranslation } from "next-vibe/env/settings/i18n";
import { SystemSettingsRepository } from "next-vibe/env/settings/repository";
import { DEFAULT_ADMIN_EMAIL } from "next-vibe/identity/default-admin-password";
import { identityEnv } from "next-vibe/identity/env";
import { canUseSetupBootstrap } from "next-vibe/identity/setup-state";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { EnvKeyName } from "@/generated/env/keys";

import { SETUP_ENV_KEYS } from "./setup-fields";

export interface SetupFieldSnapshot {
  configured: boolean;
  /** Current value for non-secret settings, "" for secrets. */
  value: string;
  example: string;
}

export interface SetupSnapshot {
  /** Current admin email, "" while it is still the shipped placeholder. */
  adminEmail: string;
  claudeCodeDetected: boolean;
  /** Dev server: a saved .env restarts it and reloads the page by itself. */
  autoRestart: boolean;
  fields: Partial<Record<EnvKeyName, SetupFieldSnapshot>>;
}

/** The shipped default admin login, handed out only while it is still active. */
export interface SetupBootstrap {
  email: string;
  password: string;
}

export class SetupSnapshotRepository {
  static getBootstrap(): SetupBootstrap | null {
    const { VIBE_ADMIN_USER_EMAIL: email, VIBE_ADMIN_USER_PASSWORD: password } =
      identityEnv;
    if (!canUseSetupBootstrap(identityEnv, email, password)) {
      return null;
    }
    // Public knowledge (README, .env.example): sending it to the browser
    // reveals nothing an attacker does not already have.
    return { email, password };
  }

  static async getSnapshot(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SetupSnapshot> {
    const { t } = settingsScopedTranslation.scopedT(locale);
    const result = await SystemSettingsRepository.getSettings(logger, t);
    const settings = result.success
      ? result.data.modules.flatMap((m) => m.settings)
      : [];
    const byKey = new Map(settings.map((s) => [s.key, s]));

    const fields: Partial<Record<EnvKeyName, SetupFieldSnapshot>> = {};
    for (const key of SETUP_ENV_KEYS) {
      const setting = byKey.get(key);
      fields[key] = {
        configured: setting?.isConfigured ?? false,
        value: setting && !setting.isSensitive ? setting.value : "",
        example: setting?.example ?? "",
      };
    }

    const adminEmail = identityEnv.VIBE_ADMIN_USER_EMAIL;
    return {
      adminEmail: adminEmail === DEFAULT_ADMIN_EMAIL ? "" : adminEmail,
      claudeCodeDetected: byKey.get("CLAUDE_CODE_ENABLED")?.value === "true",
      autoRestart: SystemSettingsRepository.isDevMode(),
      fields,
    };
  }
}
