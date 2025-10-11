import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

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
