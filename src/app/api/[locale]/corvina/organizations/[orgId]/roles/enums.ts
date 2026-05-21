import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaRoleType,
  options: CorvinaRoleTypeOptions,
  Value: CorvinaRoleTypeValue,
} = createEnumOptions(scopedTranslation, {
  APPLICATION: "get.enums.roleType.application" as const,
  DEVICE: "get.enums.roleType.device" as const,
  UNDEFINED: "get.enums.roleType.undefined" as const,
});

export const {
  enum: CorvinaRoleOwner,
  options: CorvinaRoleOwnerOptions,
  Value: CorvinaRoleOwnerValue,
} = createEnumOptions(scopedTranslation, {
  SYSTEM: "get.enums.roleOwner.system" as const,
  ORGANIZATION: "get.enums.roleOwner.organization" as const,
  APPLICATION: "get.enums.roleOwner.application" as const,
});

export const {
  enum: CorvinaPermissionLevel,
  options: CorvinaPermissionLevelOptions,
  Value: CorvinaPermissionLevelValue,
} = createEnumOptions(scopedTranslation, {
  NONE: "get.enums.permissionLevel.none" as const,
  REGULAR_USER: "get.enums.permissionLevel.regularUser" as const,
  ADMINISTRATOR: "get.enums.permissionLevel.administrator" as const,
});
