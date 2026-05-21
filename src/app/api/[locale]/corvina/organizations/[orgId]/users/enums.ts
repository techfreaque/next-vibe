import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaUserOwner,
  options: CorvinaUserOwnerOptions,
  Value: CorvinaUserOwnerValue,
} = createEnumOptions(scopedTranslation, {
  ORGANIZATION: "get.enums.userOwner.organization" as const,
  APP: "get.enums.userOwner.app" as const,
});
