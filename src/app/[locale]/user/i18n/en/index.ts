import { translations as componentsTranslations } from "../../_components/i18n/en";
import { translations as otherTranslations } from "../../(other)/i18n/en";
import { translations as signupTranslations } from "../../signup/i18n/en";
import { translations as referralTranslations } from "../../referral/i18n/en";

export const translations = {
  referral: referralTranslations,
  components: componentsTranslations,
  other: otherTranslations,
  signup: signupTranslations,
  common: {
    appName: "{{appName}}",
    backToHome: "Back to Home",
    loading: "Loading...",
    error: {
      title: "Error",
    },
    footer: {
      copyright: "© 2024 {{appName}}. All rights reserved.",
      terms: "Terms of Service",
    },
  },
  meta: {
    profile: {
      title: "User Profile - {{appName}}",
      description: "Manage your {{appName}} account and preferences",
      category: "User Account",
      imageAlt: "User Profile",
      keywords: "profile, account, settings, {{appName}}",
      ogTitle: "Your {{appName}} Profile",
      ogDescription: "Manage your account and preferences",
      twitterTitle: "Your {{appName}} Profile",
      twitterDescription: "Manage your account and preferences",
    },
  },
};
