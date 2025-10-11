import type { updateTranslations as EnglishUpdateTranslations } from "../../../en/sections/subscription/update";

export const updateTranslations: typeof EnglishUpdateTranslations = {
  success: {
    title: "Abonnement aktualisiert",
    description: "Ihr Abonnementplan wurde auf {{plan}} aktualisiert.",
  },
  error: {
    title: "Update fehlgeschlagen",
    description:
      "Aktualisierung Ihres Abonnements fehlgeschlagen. Bitte versuchen Sie es erneut.",
  },
};
