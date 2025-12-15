/**
 * Profile Service
 * Manages build profiles and applies profile-specific settings
 */

import type { BuildConfig, BuildProfile } from "../definition";
import { PROFILE_DEFAULTS } from "./constants";

/** Profile settings type inferred from PROFILE_DEFAULTS */
type ProfileSettings = (typeof PROFILE_DEFAULTS)[BuildProfile];

// ============================================================================
// Interface
// ============================================================================

export interface IProfileService {
  /**
   * Get default settings for a profile
   */
  getDefaults(profile: BuildProfile): ProfileSettings;

  /**
   * Apply profile-specific settings to build configuration
   */
  applySettings(
    config: BuildConfig,
    profile: BuildProfile,
    overrides?: ProfileOverrides,
  ): BuildConfig;

  /**
   * Get available profile names
   */
  getAvailableProfiles(): BuildProfile[];
}

/** Overrides that can be passed from request */
export interface ProfileOverrides {
  minify?: boolean;
  foldersToClean?: string[];
  env?: Record<string, string>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ProfileService implements IProfileService {
  getDefaults(profile: BuildProfile): ProfileSettings {
    return PROFILE_DEFAULTS[profile];
  }

  applySettings(
    config: BuildConfig,
    profile: BuildProfile,
    overrides?: ProfileOverrides,
  ): BuildConfig {
    const profileOverrides = config.profiles?.[profile] || {};

    // Merge profile overrides with base config
    const mergedConfig: BuildConfig = {
      ...config,
      ...profileOverrides,
      ...(overrides && {
        foldersToClean: overrides.foldersToClean ?? config.foldersToClean,
        env: { ...config.env, ...overrides.env },
      }),
    };

    return mergedConfig;
  }

  getAvailableProfiles(): BuildProfile[] {
    return ["development", "production"];
  }
}

// Singleton instance
export const profileService = new ProfileService();
