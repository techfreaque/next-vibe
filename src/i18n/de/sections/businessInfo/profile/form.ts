import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/profile/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Persönliche Informationen",
  description:
    "Aktualisieren Sie Ihre persönlichen Details und Kontaktinformationen.",
  personalInfo: {
    title: "Persönliche Informationen",
    description: "Ihre grundlegenden persönlichen Details",
  },
  additionalInfo: {
    title: "Zusätzliche Informationen",
    description: "Optionale Details über Sie",
  },
  success: {
    title: "Profil aktualisiert",
    description: "Ihre Profil-Informationen wurden erfolgreich gespeichert.",
  },
  error: {
    title: "Fehler",
    description: "Profil konnte nicht aktualisiert werden",
  },
  fields: {
    firstName: {
      label: "Vorname",
      placeholder: "Geben Sie Ihren Vornamen ein",
    },
    lastName: {
      label: "Nachname",
      placeholder: "Geben Sie Ihren Nachnamen ein",
    },
    bio: {
      label: "Biografie",
      placeholder: "Erzählen Sie uns etwas über sich...",
      description: "Eine kurze Beschreibung über Sie und Ihren Hintergrund.",
    },
    phone: {
      label: "Telefonnummer",
      placeholder: "+49 (0) 123 456789",
    },
    website: {
      label: "Website",
      placeholder: "https://ihrewebsite.de",
    },
    jobTitle: {
      label: "Berufsbezeichnung",
      placeholder: "z.B. Marketing Manager",
    },
    company: {
      label: "Unternehmen",
      placeholder: "z.B. Acme GmbH",
    },
  },
  submit: {
    save: "Profil speichern",
    saving: "Speichern...",
  },
};
