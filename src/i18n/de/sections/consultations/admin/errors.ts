import type { errorsTranslations as EnglishErrorsTranslations } from "../../../../en/sections/consultations/admin/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  not_found: {
    title: "Beratung nicht gefunden",
    description: "Die angeforderte Beratung konnte nicht gefunden werden.",
  },
  unauthorized: {
    title: "Unbefugter Zugriff",
    description: "Sie haben keine Berechtigung für diese Beratung.",
  },
  unknown: {
    title: "Fehler",
    description: "Ein unerwarteter Fehler ist aufgetreten.",
  },
  validation: {
    title: "Validierungsfehler",
    description:
      "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
  },
  server: {
    title: "Serverfehler",
    description:
      "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
  },
};
