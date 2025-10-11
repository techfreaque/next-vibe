import type { componentsTranslations as EnglishComponentsTranslations } from "../../../en/sections/emailJourneys/components";

export const componentsTranslations: typeof EnglishComponentsTranslations = {
  footer: {
    copyright: "© {{currentYear}} {{companyName}}. Alle Rechte vorbehalten.",
    visitUsText: "Besuchen Sie uns unter",
    helpText: "Fragen? Wir helfen gerne:",
    unsubscribeText: "Möchten Sie diese E-Mails nicht mehr erhalten?",
    unsubscribeLink: "Hier abmelden",
  },
  socialProof: {
    quotePrefix: '"',
    quoteSuffix: '"',
    attribution: "— {{author}}, {{company}}",
  },
  stats: {
    avgEngagementIncrease: "Engagement-Steigerung",
    followerGrowth: "Follower-Wachstum",
    leadGeneration: "Lead-Generierung",
    qualifiedLeads: "Qualifizierte Leads",
    engagementRate: "Engagement-Rate",
    roiRatio: "ROI-Verhältnis",
    businessesUsingSocialMedia:
      "Unternehmen, die Social Media für Leads nutzen",
    increaseInBrandAwareness: "Steigerung der Markenbekanntheit",
  },
  defaults: {
    businessNameFallback: "Ihr Unternehmen",
    supportEmail: "support@example.com",
    previewEmail: "max@example.com",
    previewBusinessName: "Beispiel Unternehmen",
    previewContactName: "Max Mustermann",
    previewPhone: "+49 123 456789",
    previewSource: "Website",
    previewLeadId: "lead-123",
    previewCampaignId: "campaign-456",
    signatureName: "Sarah",
  },
  journeyInfo: {
    personalApproach: {
      name: "Persönlicher Ansatz",
      description:
        "Betont persönliche Verbindung, menschliche Expertise und Beziehungsaufbau",
    },
    resultsFocused: {
      name: "Ergebnisorientiert",
      description:
        "Datengetriebener Ansatz mit Fallstudien, Metriken und bewährten Ergebnissen",
    },
    personalResults: {
      name: "Persönlicher Ansatz & Ergebnisorientiert",
      description:
        "Kombiniert persönliche Verbindung mit datengestützten Ergebnissen und bewährten Strategien",
    },
  },
};
