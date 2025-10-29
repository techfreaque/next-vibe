import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * User search status enum using createEnumOptions pattern
 */
export const {
  enum: UserSearchStatus,
  options: UserSearchStatusOptions,
  Value: UserSearchStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.v1.core.user.search.status.active",
  INACTIVE: "app.api.v1.core.user.search.status.inactive",
  ALL: "app.api.v1.core.user.search.status.all",
});
