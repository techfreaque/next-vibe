import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export const {
  enum: SocialProviders,
  options: SocialProvidersOptions,
  Value: SocialProvidersValue,
} = createEnumOptions({
  GOOGLE: "app.api.user.public.login.enums.socialProviders.google" as const,
  GITHUB: "app.api.user.public.login.enums.socialProviders.github" as const,
  FACEBOOK: "app.api.user.public.login.enums.socialProviders.facebook" as const,
});
