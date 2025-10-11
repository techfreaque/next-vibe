import type { componentsTranslations as EnglishComponentsTranslations } from "../../../en/sections/emailJourneys/components";

export const componentsTranslations: typeof EnglishComponentsTranslations = {
  footer: {
    copyright:
      "© {{currentYear}} {{companyName}}. Wszelkie prawa zastrzeżone.",
    visitUsText: "Odwiedź nas pod adresem",
    helpText: "Pytania? Chętnie pomożemy:",
    unsubscribeText: "Nie chcesz otrzymywać tych e-maili?",
    unsubscribeLink: "Wypisz się tutaj",
  },
  socialProof: {
    quotePrefix: '"',
    quoteSuffix: '"',
    attribution: "— {{author}}, {{company}}",
  },
  stats: {
    avgEngagementIncrease: "Średni wzrost zaangażowania",
    followerGrowth: "Wzrost obserwujących",
    leadGeneration: "Generowanie leadów",
    qualifiedLeads: "Wykwalifikowani leadowie",
    engagementRate: "Wskaźnik zaangażowania",
    roiRatio: "Wskaźnik ROI",
    businessesUsingSocialMedia:
      "Firmy używające mediów społecznościowych do leadów",
    increaseInBrandAwareness: "Wzrost świadomości marki",
  },
  defaults: {
    businessNameFallback: "Twoja firma",
    supportEmail: "support@example.com",
    previewEmail: "max@example.com",
    previewBusinessName: "Przykładowa Firma",
    previewContactName: "Jan Kowalski",
    previewPhone: "+48 123 456 789",
    previewSource: "Strona internetowa",
    previewLeadId: "lead-123",
    previewCampaignId: "campaign-456",
    signatureName: "Kasia",
  },
  journeyInfo: {
    personalApproach: {
      name: "Podejście Osobiste",
      description:
        "Podkreśla osobiste połączenie, ludzką wiedzę i budowanie relacji",
    },
    resultsFocused: {
      name: "Skoncentrowane na Wynikach",
      description:
        "Podejście oparte na danych ze studiami przypadków, metrykami i sprawdzonymi wynikami",
    },
    personalResults: {
      name: "Podejście Osobiste i Zorientowane na Wyniki",
      description:
        "Łączy osobiste połączenie z wynikami opartymi na danych i sprawdzonymi strategiami",
    },
  },
};
