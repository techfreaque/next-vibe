import type { translations as EnglishUpdateTranslations } from "../../en/subscription/update";

export const translations: typeof EnglishUpdateTranslations = {
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
