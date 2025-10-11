import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/onboarding/form";

export const formTranslations: typeof EnglishFormTranslations = {
  businessName: "Firmenname",
  businessType: {
    label: "Unternehmenstyp",
    placeholder: "Wählen Sie Ihren Unternehmenstyp",
    options: {
      retail: "Einzelhandel",
      service: "Dienstleistung",
      hospitality: "Gastgewerbe",
      technology: "Technologie",
      healthcare: "Gesundheitswesen",
      education: "Bildung",
      nonprofit: "Gemeinnützig",
      other: "Sonstiges",
    },
  },
  contactName: "Kontaktname",
  email: "E-Mail-Adresse",
  phone: "Telefonnummer",
  message: "Zusätzliche Informationen",
  preferredDate: "Bevorzugtes Datum (Optional)",
  preferredTime: "Bevorzugte Uhrzeit (Optional)",
  submit: "Anfrage senden",
  required: "Pflichtfeld",
  targetAudience: {
    label: "Zielgruppe",
    placeholder: "Beschreiben Sie Ihre Zielgruppe",
  },
  socialPlatforms: {
    label: "Social Media-Plattformen",
    description:
      "Wählen Sie die Plattformen aus, die Sie derzeit nutzen oder die Sie interessieren",
    platforms: {
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
    },
  },
  goals: {
    label: "Ihre Ziele",
    description: "Was möchten Sie mit Social Media erreichen?",
    options: {
      awareness: "Markenbekanntheit",
      engagement: "Engagement steigern",
      traffic: "Website-Traffic generieren",
      leads: "Leads generieren",
      sales: "Verkäufe steigern",
      loyalty: "Kundenloyalität",
      community: "Community aufbauen",
    },
  },
  competitors: {
    label: "Konkurrenten",
    placeholder: "Listen Sie Ihre Hauptkonkurrenten auf (optional)",
  },
  brandGuidelines: {
    label: "Markenrichtlinien",
    placeholder: "Teilen Sie Markenrichtlinien oder Präferenzen mit",
  },
  additionalInfo: {
    label: "Zusätzliche Informationen",
    placeholder: "Möchten Sie uns noch etwas mitteilen?",
  },
  submitButton: "Senden & Fortfahren",
  skip: "Vorerst überspringen",
};
