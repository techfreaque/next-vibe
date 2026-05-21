import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: CorvinaAppStoreStatus,
  options: CorvinaAppStoreStatusOptions,
  Value: CorvinaAppStoreStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "get.enums.appStoreStatus.active" as const,
  UNDER_EVALUATION: "get.enums.appStoreStatus.underEvaluation" as const,
});

export const {
  enum: CorvinaAppInstallStatus,
  options: CorvinaAppInstallStatusOptions,
  Value: CorvinaAppInstallStatusValue,
} = createEnumOptions(scopedTranslation, {
  INSTALLATION: "get.enums.installStatus.installation" as const,
  INSTALLED: "get.enums.installStatus.installed" as const,
  INSTALLATION_FAILED: "get.enums.installStatus.installationFailed" as const,
  UNINSTALLATION: "get.enums.installStatus.uninstallation" as const,
  UNINSTALLED: "get.enums.installStatus.uninstalled" as const,
  UNINSTALLATION_FAILED:
    "get.enums.installStatus.uninstallationFailed" as const,
  MANUAL_UPGRADABLE: "get.enums.installStatus.manualUpgradable" as const,
  FREE_TRIAL: "get.enums.installStatus.freeTrial" as const,
  PAYMENT_REQUIRED: "get.enums.installStatus.paymentRequired" as const,
});
