import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pricing: {
    plans: {
      orSeparator: "lub",
      perMonth: "/miesiąc",
      PREMIUM: {
        featureBadge: "Najpopularniejszy",
      },
    },
  },
  defaults: {
    previewBusinessName: "Podgląd Firma",
    previewContactName: "Podgląd Kontakt",
    previewEmail: "podglad@przyklad.pl",
    previewPhone: "+48123456789",
    previewLeadId: "podglad-lead-123",
    previewCampaignId: "podglad-kampania-123",
  },
  journeyInfo: {
    resultsFocused: {
      name: "Podróż Skoncentrowana na Wynikach",
      description:
        "Profesjonalne podejście kładące nacisk na mierzalne wyniki i praktyczne rezultaty",
    },
    personalResults: {
      name: "Podróż Osobistych Wyników",
      description:
        "Zrównoważone podejście łączące osobistą więź z treściami nastawionymi na wyniki",
    },
    personalApproach: {
      name: "Podróż Osobistego Podejścia",
      description:
        "Ciepła, skoncentrowana na relacjach komunikacja budująca zaufanie przez osobistą więź",
    },
  },
};
