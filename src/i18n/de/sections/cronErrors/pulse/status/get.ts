import type { getTranslations as EnglishGetTranslations } from "../../../../../en/sections/cronErrors/pulse/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Pulse-Status Validierung fehlgeschlagen",
      description: "Ungültige Anfrageparameter für den Pulse-Status-Abruf",
    },
    unauthorized: {
      title: "Pulse-Status Zugriff verweigert",
      description:
        "Sie haben keine Berechtigung, auf den Pulse-Status zuzugreifen",
    },
    server: {
      title: "Pulse-Status Serverfehler",
      description:
        "Pulse-Status konnte aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Pulse-Status-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Pulse-Status aufgetreten",
    },
  },
  success: {
    title: "Pulse-Status abgerufen",
    description: "System-Pulse-Status wurde erfolgreich abgerufen",
  },
};
