import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * User search status enum using createEnumOptions pattern
 */
export const {
  enum: UserSearchStatus,
  options: UserSearchStatusOptions,
  Value: UserSearchStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "status.active",
  INACTIVE: "status.inactive",
  ALL: "status.all",
});
