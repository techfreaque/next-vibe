import type { translations as EnglishDeleteTranslations } from "../../../en/authErrors/userMe/delete";

export const translations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Konto-Löschung Validierung fehlgeschlagen",
      description: "Ungültige Anfrageparameter für die Konto-Löschung",
    },
    unauthorized: {
      title: "Konto-Löschung Zugriff verweigert",
      description: "Sie haben keine Berechtigung, dieses Konto zu löschen",
    },
    server: {
      title: "Konto-Löschung Serverfehler",
      description:
        "Konto konnte aufgrund eines Serverfehlers nicht gelöscht werden",
    },
    unknown: {
      title: "Konto-Löschung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Löschen des Kontos aufgetreten",
    },
  },
  success: {
    title: "Konto erfolgreich gelöscht",
    description: "Ihr Konto wurde dauerhaft gelöscht",
  },
};
