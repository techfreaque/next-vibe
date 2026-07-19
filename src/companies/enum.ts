/**
 * Companies enums
 * Defines the enums used in the companies module using createEnumOptions pattern
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Company type enum
 * Classifies the business model of the company
 */
export const {
  enum: CompanyType,
  options: CompanyTypeOptions,
  Value: CompanyTypeValue,
} = createEnumOptions(scopedTranslation, {
  B2B: "enums.companyType.b2b",
  B2C: "enums.companyType.b2c",
  INDIVIDUAL: "enums.companyType.individual",
});

/**
 * Company member role enum
 * Defines the access level of a member within a company
 */
export const {
  enum: CompanyMemberRole,
  options: CompanyMemberRoleOptions,
  Value: CompanyMemberRoleValue,
} = createEnumOptions(scopedTranslation, {
  OWNER: "enums.companyMemberRole.owner",
  ADMIN: "enums.companyMemberRole.admin",
  MEMBER: "enums.companyMemberRole.member",
  ACCOUNTANT: "enums.companyMemberRole.accountant",
  VIEWER: "enums.companyMemberRole.viewer",
});

// Create DB enum arrays for Drizzle
export const CompanyTypeDB = [
  CompanyType.B2B,
  CompanyType.B2C,
  CompanyType.INDIVIDUAL,
] as const;

export const CompanyMemberRoleDB = [
  CompanyMemberRole.OWNER,
  CompanyMemberRole.ADMIN,
  CompanyMemberRole.MEMBER,
  CompanyMemberRole.ACCOUNTANT,
  CompanyMemberRole.VIEWER,
] as const;
