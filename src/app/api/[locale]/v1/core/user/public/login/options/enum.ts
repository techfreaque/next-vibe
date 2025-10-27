import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

export const {
  enum: SocialProviders,
  options: SocialProvidersOptions,
  Value: SocialProvidersValue,
} = createEnumOptions({
  GOOGLE:
    "app.api.v1.core.user.public.login.enums.socialProviders.google" as const,
  GITHUB:
    "app.api.v1.core.user.public.login.enums.socialProviders.github" as const,
  FACEBOOK:
    "app.api.v1.core.user.public.login.enums.socialProviders.facebook" as const,
});
