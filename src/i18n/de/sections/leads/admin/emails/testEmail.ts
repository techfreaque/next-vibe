import type { testEmailTranslations as EnglishTestEmailTranslations } from "../../../../../en/sections/leads/admin/emails/testEmail";

export const testEmailTranslations: typeof EnglishTestEmailTranslations = {
  button: "Test-E-Mail senden",
  title: "Test-E-Mail senden",
  send: "Test-E-Mail senden",
  sending: "Wird gesendet...",
  success: "Test-E-Mail erfolgreich an {{email}} gesendet",
  prefix: "[TEST]",
  recipient: {
    title: "Test-Empfänger",
    name: "Test-Empfänger",
    email: {
      label: "Test-E-Mail-Adresse",
      placeholder: "E-Mail-Adresse für den Test eingeben",
      description: "Die E-Mail-Adresse, an die die Test-E-Mail gesendet wird",
    },
  },
  leadData: {
    title: "Lead-Daten für Vorlage",
    businessName: {
      label: "Firmenname",
      placeholder: "Beispiel Firma GmbH",
    },
    contactName: {
      label: "Kontaktname",
      placeholder: "Max Mustermann",
    },
    phone: {
      label: "Telefonnummer",
      placeholder: "+49123456789",
    },
    website: {
      label: "Website",
      placeholder: "https://example.com",
    },
    country: {
      label: "Land",
    },
    language: {
      label: "Sprache",
    },
    status: {
      label: "Lead-Status",
    },
    source: {
      label: "Lead-Quelle",
    },
    notes: {
      label: "Notizen",
      placeholder: "Test-Lead für E-Mail-Vorschau",
    },
  },
  mockData: {
    businessName: "Acme Digital Lösungen GmbH",
    contactName: "Anna Schmidt",
    phone: "+49-30-12345678",
    website: "https://acme-digital.de",
    notes:
      "Interessiert an Premium Social Media Management Services. Potenzialstarker Kunde mit etabliertem Unternehmen.",
  },
};
