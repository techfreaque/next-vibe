import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaOrgStatus,
  options: CorvinaOrgStatusOptions,
  Value: CorvinaOrgStatusValue,
} = createEnumOptions(scopedTranslation, {
  NEW: "get.enums.orgStatus.new" as const,
  PROVISIONING: "get.enums.orgStatus.provisioning" as const,
  DONE: "get.enums.orgStatus.done" as const,
  DELETING: "get.enums.orgStatus.deleting" as const,
  DELETED: "get.enums.orgStatus.deleted" as const,
});
