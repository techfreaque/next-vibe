import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/logout/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Abmeldung Validierung fehlgeschlagen",
      description: "Abmeldeanfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Abmeldung nicht berechtigt",
      description: "Sie sind nicht berechtigt, diese Abmeldung durchzuführen",
    },
    server: {
      title: "Abmeldung Serverfehler",
      description: "Abmeldung aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Abmeldung fehlgeschlagen",
      description: "Ein unerwarteter Fehler ist bei der Abmeldung aufgetreten",
    },
  },
  success: {
    title: "Abmeldung erfolgreich",
    description: "Sie wurden erfolgreich abgemeldet",
  },
};
