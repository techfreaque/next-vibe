import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: TwoFactorAction,
  options: TwoFactorActionOptions,
  Value: TwoFactorActionValue,
} = createEnumOptions(scopedTranslation, {
  STATUS: "enums.action.status",
  SETUP: "enums.action.setup",
  ENABLE: "enums.action.enable",
  DISABLE: "enums.action.disable",
  REGENERATE: "enums.action.regenerate",
});

export const TwoFactorActionDB = [
  TwoFactorAction.STATUS,
  TwoFactorAction.SETUP,
  TwoFactorAction.ENABLE,
  TwoFactorAction.DISABLE,
  TwoFactorAction.REGENERATE,
] as const;
