import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaDeviceStatus,
  options: CorvinaDeviceStatusOptions,
  Value: CorvinaDeviceStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "get.enums.deviceStatus.active" as const,
  INACTIVE: "get.enums.deviceStatus.inactive" as const,
  ERROR: "get.enums.deviceStatus.error" as const,
  UNKNOWN: "get.enums.deviceStatus.unknown" as const,
});
