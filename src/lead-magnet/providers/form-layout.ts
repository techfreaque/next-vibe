import { LayoutType } from "next-vibe/core/definition/enums";

import type { LeadMagnetTranslationKey } from "../i18n";

export function providerFormLayout<
  const TTitle extends LeadMagnetTranslationKey,
>(
  title: TTitle,
): {
  title: TTitle;
  layoutType: LayoutType.STACKED;
  adminForm: {
    sectionTitle: "providers.shared.connectionSettings";
    submitText: TTitle;
  };
} {
  return {
    title,
    layoutType: LayoutType.STACKED,
    adminForm: {
      sectionTitle: "providers.shared.connectionSettings",
      submitText: title,
    },
  };
}
