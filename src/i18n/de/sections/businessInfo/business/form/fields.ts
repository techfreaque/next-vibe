import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../en/sections/businessInfo/business/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  businessType: {
    label: "Unternehmensart",
    placeholder: "z.B. SaaS, E-Commerce, Beratung",
    description: "Welche Art von Unternehmen führen Sie?",
  },
  businessName: {
    label: "Unternehmensname",
    placeholder: "Ihr Unternehmensname",
    description: "Der offizielle Name Ihres Unternehmens",
    notSet: "Nicht gesetzt - bitte im Profil aktualisieren",
    editInProfile: "Firmenname in Ihrem Profil bearbeiten",
  },
  industry: {
    label: "Branche",
    placeholder: "z.B. Technologie, Gesundheitswesen, Finanzen",
    description: "In welcher Branche ist Ihr Unternehmen tätig?",
  },
  businessSize: {
    label: "Unternehmensgröße",
    placeholder: "Unternehmensgröße auswählen",
    description: "Wie viele Mitarbeiter hat Ihr Unternehmen?",
    options: {
      startup: "Startup (1-10 Mitarbeiter)",
      small: "Klein (11-50 Mitarbeiter)",
      medium: "Mittel (51-200 Mitarbeiter)",
      large: "Groß (201-1000 Mitarbeiter)",
      enterprise: "Konzern (1000+ Mitarbeiter)",
    },
  },
  businessEmail: {
    label: "Unternehmens-E-Mail",
    placeholder: "kontakt@ihrunternehmen.de",
    description: "Haupt-Kontakt-E-Mail für Ihr Unternehmen",
  },
  businessPhone: {
    label: "Unternehmenstelefon",
    placeholder: "+49 (0) 123 456789",
    description: "Haupt-Kontakttelefonnummer",
  },
  website: {
    label: "Website",
    placeholder: "https://ihrunternehmen.de",
    description: "Die URL Ihrer Unternehmenswebsite",
  },
  country: {
    label: "Land",
    placeholder: "Deutschland",
    description: "Land, in dem sich Ihr Unternehmen befindet",
  },
  city: {
    label: "Stadt",
    placeholder: "Berlin",
    description: "Stadt, in der sich Ihr Unternehmen befindet",
  },
  foundedYear: {
    label: "Gründungsjahr",
    placeholder: "2020",
    description: "Jahr, in dem Ihr Unternehmen gegründet wurde",
  },
  description: {
    label: "Unternehmensbeschreibung",
    placeholder: "Beschreiben Sie, was Ihr Unternehmen macht...",
    description:
      "Kurze Beschreibung Ihres Unternehmens und Ihrer Dienstleistungen",
  },
};
