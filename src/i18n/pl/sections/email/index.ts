import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/email";
import { consultationTranslations } from "./consultation";
import { contactTranslations } from "./contact";
import { dashboardTranslations } from "./dashboard";
import { errorTranslations } from "./error";
import { errorsTranslations } from "./errors";
import { footerTranslations } from "./footer";
import { leadsTranslations } from "./leads";
import { onboardingTranslations } from "./onboarding";
import { templateTranslations } from "./template";

export const emailTranslations: typeof EnglishEmailTranslations = {
  consultation: consultationTranslations,
  contact: contactTranslations,
  dashboard: dashboardTranslations,
  error: errorTranslations,
  errors: errorsTranslations,
  footer: footerTranslations,
  leads: leadsTranslations,
  onboarding: onboardingTranslations,
  template: templateTranslations,
};
