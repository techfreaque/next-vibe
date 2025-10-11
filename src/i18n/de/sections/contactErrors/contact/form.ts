import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/contactErrors/contact/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Kontaktformular Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Kontaktinformationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Kontaktformular nicht berechtigt",
      description:
        "Sie haben keine Berechtigung, das Kontaktformular zu senden",
    },
    server: {
      title: "Kontaktformular Serverfehler",
      description:
        "Kontaktformular konnte aufgrund eines Serverfehlers nicht gesendet werden",
    },
    unknown: {
      title: "Kontaktformular fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Senden des Kontaktformulars aufgetreten",
    },
  },
  success: {
    title: "Nachricht erfolgreich gesendet",
    description: "Ihre Kontaktnachricht wurde gesendet",
  },
};
