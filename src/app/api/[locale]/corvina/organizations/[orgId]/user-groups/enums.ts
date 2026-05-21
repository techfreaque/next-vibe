import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: UserGroupType,
  options: UserGroupTypeOptions,
  Value: UserGroupTypeValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD: "get.enums.groupType.standard" as const,
  SELF_USER_ANY: "get.enums.groupType.selfUserAny" as const,
  SELF_USER: "get.enums.groupType.selfUser" as const,
  ALL_USER: "get.enums.groupType.allUser" as const,
  SELF_USER_SERVICE: "get.enums.groupType.selfUserService" as const,
  ALL: "get.enums.groupType.all" as const,
});

export const {
  enum: UserGroupOwner,
  options: UserGroupOwnerOptions,
  Value: UserGroupOwnerValue,
} = createEnumOptions(scopedTranslation, {
  ORGANIZATION: "get.enums.groupOwner.organization" as const,
  APP: "get.enums.groupOwner.app" as const,
});

export const {
  enum: MembershipRole,
  options: MembershipRoleOptions,
  Value: MembershipRoleValue,
} = createEnumOptions(scopedTranslation, {
  USER: "get.enums.membershipRole.user" as const,
  ADMIN: "get.enums.membershipRole.admin" as const,
});
