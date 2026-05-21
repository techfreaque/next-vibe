import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./[walletId]/i18n";

export const {
  enum: WalletType,
  options: WalletTypeOptions,
  Value: WalletTypeValue,
} = createEnumOptions(scopedTranslation, {
  GENERIC: "get.enums.walletType.generic" as const,
  APP: "get.enums.walletType.app" as const,
});
