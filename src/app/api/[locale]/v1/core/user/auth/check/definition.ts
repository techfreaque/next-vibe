/**
 * Native Auth Definition
 * Defines types for native authentication endpoints
 */

import { z } from "zod";

/**
 * Check Auth Status Request (GET)
 */
export const checkAuthStatusGetRequestSchema = z.object({});
export type CheckAuthStatusGetRequestOutput = z.infer<
  typeof checkAuthStatusGetRequestSchema
>;

/**
 * Check Auth Status Response
 */
export const checkAuthStatusGetResponseSchema = z.object({
  authenticated: z.boolean(),
  expiresAt: z.string().optional(),
  tokenValid: z.boolean(),
});
export type CheckAuthStatusGetResponseOutput = z.infer<
  typeof checkAuthStatusGetResponseSchema
>;
