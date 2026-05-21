import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./list/i18n";

export const {
  enum: NotificationEvent,
  options: NotificationEventOptions,
  Value: NotificationEventValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD_LICENSE_EXPIRATION:
    "get.enums.notificationEvent.standardLicenseExpiration" as const,
  PLUS_LICENSE_EXPIRATION:
    "get.enums.notificationEvent.plusLicenseExpiration" as const,
  TRIAL_LICENSE_EXPIRATION:
    "get.enums.notificationEvent.trialLicenseExpiration" as const,
  VPN_CONSUMPTIONS_LEVEL_0:
    "get.enums.notificationEvent.vpnConsumptionsLevel0" as const,
  VPN_CONSUMPTIONS_LEVEL_1:
    "get.enums.notificationEvent.vpnConsumptionsLevel1" as const,
  VPN_CONSUMPTIONS_LEVEL_2:
    "get.enums.notificationEvent.vpnConsumptionsLevel2" as const,
  VPN_CONSUMPTIONS_LEVEL_3:
    "get.enums.notificationEvent.vpnConsumptionsLevel3" as const,
  IOT_CONSUMPTIONS_LEVEL_0:
    "get.enums.notificationEvent.iotConsumptionsLevel0" as const,
  IOT_CONSUMPTIONS_LEVEL_1:
    "get.enums.notificationEvent.iotConsumptionsLevel1" as const,
  IOT_CONSUMPTIONS_LEVEL_2:
    "get.enums.notificationEvent.iotConsumptionsLevel2" as const,
  IOT_CONSUMPTIONS_LEVEL_3:
    "get.enums.notificationEvent.iotConsumptionsLevel3" as const,
});

export const {
  enum: NotificationMailEventType,
  options: NotificationMailEventTypeOptions,
  Value: NotificationMailEventTypeValue,
} = createEnumOptions(scopedTranslation, {
  ALARM_NOTIFICATION:
    "get.enums.notificationMailEventType.alarmNotification" as const,
  USER_CREATION: "get.enums.notificationMailEventType.userCreation" as const,
  STANDARD_LICENSE_EXPIRATION:
    "get.enums.notificationMailEventType.standardLicenseExpiration" as const,
  PLUS_LICENSE_EXPIRATION:
    "get.enums.notificationMailEventType.plusLicenseExpiration" as const,
  TRIAL_LICENSE_EXPIRATION:
    "get.enums.notificationMailEventType.trialLicenseExpiration" as const,
  STANDARD_LICENSE_EXPIRED:
    "get.enums.notificationMailEventType.standardLicenseExpired" as const,
  PLUS_LICENSE_EXPIRED:
    "get.enums.notificationMailEventType.plusLicenseExpired" as const,
  TRIAL_LICENSE_EXPIRED:
    "get.enums.notificationMailEventType.trialLicenseExpired" as const,
  VPN_CREDITS_CONSUMPTIONS:
    "get.enums.notificationMailEventType.vpnCreditsConsumptions" as const,
  VPN_CREDITS_CONSUMPTIONS_OVER:
    "get.enums.notificationMailEventType.vpnCreditsConsumptionsOver" as const,
  IOT_CREDITS_CONSUMPTIONS:
    "get.enums.notificationMailEventType.iotCreditsConsumptions" as const,
  IOT_CREDITS_CONSUMPTIONS_OVER:
    "get.enums.notificationMailEventType.iotCreditsConsumptionsOver" as const,
});
