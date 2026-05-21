import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: SecurityPolicyType,
  options: SecurityPolicyTypeOptions,
  Value: SecurityPolicyTypeValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD: "get.enums.policyType.standard" as const,
  SELF_DEVICE: "get.enums.policyType.selfDevice" as const,
  ALL_DEVICES: "get.enums.policyType.allDevices" as const,
});
