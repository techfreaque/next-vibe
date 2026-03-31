/**
 * AI Stream Test Constants
 * Shared constants for integration tests.
 */

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { env } from "@/config/env";

/**
 * Primary test user: the seeded admin (VIBE_ADMIN_USER_EMAIL).
 * Always has credits and full access.
 */
export const AI_TEST_USER_EMAIL = env.VIBE_ADMIN_USER_EMAIL;

/**
 * Secondary user for the insufficient-credits test: demo@example.com.
 * Seeded as a regular customer with a free wallet.
 * Tests drain its credits to 0.5 and restore in afterAll.
 */
export const AI_LOW_CREDITS_USER_EMAIL = "demo@example.com";

/**
 * Model used in all AI stream integration tests.
 * Configured via VIBE_TEST_AI_MODEL env var (defaults to kimi_k2_5).
 * Must be a valid ModelId enum value.
 */
export const TEST_AI_MODEL: ModelId =
  (env.VIBE_TEST_AI_MODEL as ModelId) ?? ModelId.KIMI_K2_5;
