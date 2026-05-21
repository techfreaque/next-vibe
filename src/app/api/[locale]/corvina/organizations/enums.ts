import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaOrgStatus,
  options: CorvinaOrgStatusOptions,
  Value: CorvinaOrgStatusValue,
} = createEnumOptions(scopedTranslation, {
  DONE: "get.enums.orgStatus.done" as const,
  PENDING: "get.enums.orgStatus.pending" as const,
  FAILED: "get.enums.orgStatus.failed" as const,
  DISABLED: "get.enums.orgStatus.disabled" as const,
});
