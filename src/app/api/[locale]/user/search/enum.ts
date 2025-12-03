import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * User search status enum using createEnumOptions pattern
 */
export const {
  enum: UserSearchStatus,
  options: UserSearchStatusOptions,
  Value: UserSearchStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.user.search.status.active",
  INACTIVE: "app.api.user.search.status.inactive",
  ALL: "app.api.user.search.status.all",
});
