import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

export const {
  enum: SocialProviders,
  options: SocialProvidersOptions,
  Value: SocialProvidersValue,
} = createEnumOptions(scopedTranslation, {
  GOOGLE: "enums.socialProviders.google" as const,
  GITHUB: "enums.socialProviders.github" as const,
  FACEBOOK: "enums.socialProviders.facebook" as const,
});
