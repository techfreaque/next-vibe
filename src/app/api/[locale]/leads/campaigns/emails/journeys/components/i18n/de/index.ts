import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pricing: {
    plans: {
      orSeparator: "oder",
      perMonth: "/Monat",
      PREMIUM: {
        featureBadge: "Beliebteste",
      },
    },
  },
  defaults: {
    previewBusinessName: "Vorschau Unternehmen",
    previewContactName: "Vorschau Kontakt",
    previewEmail: "vorschau@beispiel.de",
    previewPhone: "+491234567890",
    previewLeadId: "vorschau-lead-123",
    previewCampaignId: "vorschau-kampagne-123",
  },
  journeyInfo: {
    resultsFocused: {
      name: "Ergebnisorientierte Reise",
      description:
        "Professioneller Ansatz mit Schwerpunkt auf messbaren Ergebnissen und praktischen Resultaten",
    },
    personalResults: {
      name: "Persönliche Ergebnisse Reise",
      description:
        "Ausgewogener Ansatz, der persönliche Verbindung mit ergebnisorientierten Inhalten kombiniert",
    },
    personalApproach: {
      name: "Persönlicher Ansatz Reise",
      description:
        "Warme, beziehungsorientierte Kommunikation, die Vertrauen durch persönliche Verbindung aufbaut",
    },
  },
};
