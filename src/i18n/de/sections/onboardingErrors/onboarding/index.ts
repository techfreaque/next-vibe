import type { onboardingTranslations as EnglishOnboardingTranslations } from "../../../../en/sections/onboardingErrors/onboarding";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const onboardingTranslations: typeof EnglishOnboardingTranslations = {
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
