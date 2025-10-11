/**
 * User Definition
 * Defines API types for user functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { leadId } from "@/app/api/[locale]/v1/core/leads/definition";

import type { JwtPayloadType } from "./auth/definition";
import {
  Language,
  Theme,
  Timezone,
  type UserDetailLevel,
  type UserDetailLevelValue,
} from "./enum";
import { userRoleResponseSchema } from "./user-roles/definition";
import type { UserRoleValue } from "./user-roles/enum";

/**
 * Image URL Schema
 * Defines the schema for user image URLs
 */
export const imageUrlSchema = z.string().nullable().optional();

/**
 * User Preferences Schema
 * Defines user preferences
 */
export const userPreferencesSchema = z
  .object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    darkMode: z.boolean().default(false),
    language: z.string().default(Language.EN),
    theme: z.string().default(Theme.SYSTEM),
    timezone: z.string().default(Timezone.UTC),
  })
  .partial();
export type UserPreferencesType = z.infer<typeof userPreferencesSchema>;

/**
 * Social Links Schema
 * Defines social media links structure with validation
 */
export const socialLinksSchema = z
  .object({
    twitter: z
      .string()
      .url({
        message: "validationErrors.user.profile.twitter_url_invalid",
      })
      .optional(),
    facebook: z
      .string()
      .url({
        message: "validationErrors.user.profile.facebook_url_invalid",
      })
      .optional(),
    instagram: z
      .string()
      .url({
        message: "validationErrors.user.profile.instagram_url_invalid",
      })
      .optional(),
    linkedin: z
      .string()
      .url({
        message: "validationErrors.user.profile.linkedin_url_invalid",
      })
      .optional(),
    github: z
      .string()
      .url({
        message: "validationErrors.user.profile.github_url_invalid",
      })
      .optional(),
    website: z
      .string()
      .url({
        message: "validationErrors.user.profile.website_url_invalid",
      })
      .optional(),
  })
  .partial();
export type SocialLinksType = z.infer<typeof socialLinksSchema>;

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
  firstName: z
    .string()
    .min(1, { message: "validationErrors.user.profile.first_name_required" }),
  lastName: z
    .string()
    .min(1, { message: "validationErrors.user.profile.last_name_required" }),
  company: z
    .string()
    .min(1, { message: "validationErrors.user.profile.company_required" }),
  email: z
    .string()
    .email({ message: "validationErrors.user.profile.email_invalid" }),
  imageUrl: imageUrlSchema,
  isActive: z.boolean().nullable(),
  emailVerified: z.boolean().nullable(),
  requireTwoFactor: z.boolean().nullable(),
  marketingConsent: z.boolean().nullable(),
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
  phone: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
  preferences: userPreferencesSchema.optional(),
  visibility: z.string(),
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
  roles?: (typeof UserRoleValue)[keyof typeof UserRoleValue][];
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
  roles?: (typeof UserRoleValue)[keyof typeof UserRoleValue][];
}
