import type { validationTranslations as EnglishValidationTranslations } from "../../../../en/sections/leadsErrors/testEmail/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  journeyVariant: {
    invalid: "Ungültige E-Mail-Journey-Variante",
  },
  stage: {
    invalid: "Ungültige E-Mail-Kampagnen-Phase",
  },
  testEmail: {
    invalid: "Ungültige Test-E-Mail-Adresse",
  },
  leadData: {
    email: {
      invalid: "Ungültige Lead-E-Mail-Adresse",
    },
    businessName: {
      required: "Lead-Firmenname ist erforderlich",
      tooLong: "Lead-Firmenname ist zu lang",
    },
    contactName: {
      tooLong: "Lead-Kontaktname ist zu lang",
    },
    phone: {
      invalid: "Ungültige Lead-Telefonnummer",
    },
    website: {
      invalid: "Ungültige Lead-Website-URL",
    },
    country: {
      invalid: "Ungültiges Lead-Land",
    },
    language: {
      invalid: "Ungültige Lead-Sprache",
    },
    status: {
      invalid: "Ungültiger Lead-Status",
    },
    source: {
      invalid: "Ungültige Lead-Quelle",
    },
    notes: {
      tooLong: "Lead-Notizen sind zu lang",
    },
  },
};
