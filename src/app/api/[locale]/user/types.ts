/**
 * User Definition
 * Defines API types for user functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { leadId } from "@/app/api/[locale]/leads/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "./auth/types";
import {
  Language,
  Theme,
  type UserDetailLevel,
  type UserDetailLevelValue,
} from "./enum";
import type { UserRoleValue } from "./user-roles/enum";
import { userRoleResponseSchema } from "./user-roles/types";

/**
 * User Preferences Schema
 * Defines user preferences
 */
export const userPreferencesSchema = z
  .object({
    darkMode: z.boolean().default(false),
    language: z.string().default(Language.EN),
    theme: z.string().default(Theme.SYSTEM),
  })
  .partial();
export type UserPreferencesType = z.infer<typeof userPreferencesSchema>;

/**
 * Minimal User Schema
 * Essential user data
 */
export type MinimalUserType = JwtPayloadType;

/**
 * Standard User Schema
 * Common user data
 */
export const standardUserSchema = z.object({
  id: z.uuid(),
  leadId: leadId.nullable(),
  isPublic: z.literal(false),
  email: z.email({ message: "validationErrors.user.profile.email_invalid" }),
  privateName: z.string(),
  publicName: z.string(),
  locale: z.string() as z.ZodType<CountryLanguage>, // User's locale (e.g., "en-GLOBAL", "de-DE")
  isActive: z.boolean().nullable(),
  emailVerified: z.boolean().nullable(),
  requireTwoFactor: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
  userRoles: z.array(userRoleResponseSchema),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});
export type StandardUserType = z.infer<typeof standardUserSchema>;

/**
 * Complete User Schema
 * Full user profile data
 */
export const completeUserSchema = standardUserSchema.extend({
  stripeCustomerId: z.string().nullable(),
});
export type CompleteUserType = z.infer<typeof completeUserSchema>;

/**
 * User detail level types
 */
export type UserDetailLevelType = typeof UserDetailLevelValue;
export type ExtendedUserDetailLevel =
  | typeof UserDetailLevel.STANDARD
  | typeof UserDetailLevel.COMPLETE;

/**
 * User fetch options
 */
export interface UserFetchOptions {
  includeInactive?: boolean;
  roles?: readonly UserRoleValue[];
  detailLevel?: UserDetailLevelType;
}

/**
 * User type mapping
 */
export type UserType<
  T extends UserDetailLevelType = typeof UserDetailLevel.STANDARD,
> = T extends typeof UserDetailLevel.MINIMAL
  ? JwtPayloadType
  : T extends ExtendedUserDetailLevel
    ? ExtendedUserType<T>
    : never;

/**
 * Extended user type mapping
 */
export type ExtendedUserType<
  T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
> = T extends typeof UserDetailLevel.STANDARD
  ? StandardUserType
  : T extends typeof UserDetailLevel.COMPLETE
    ? CompleteUserType
    : StandardUserType;

/**
 * User search options
 */
export interface UserSearchOptions {
  limit?: number;
  offset?: number;
  roles?: UserRoleValue[keyof UserRoleValue][];
}
