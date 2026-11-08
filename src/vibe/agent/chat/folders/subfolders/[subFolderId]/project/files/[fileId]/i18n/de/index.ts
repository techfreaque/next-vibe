import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },
  delete: {
    title: "Wissensdatei entfernen",
    titleShort: "Datei entfernen",
    description: "Entferne eine Wissensdatei aus diesem Ordner-Projekt",
    container: {
      title: "Wissensdatei entfernen",
      description: "Die KI sieht diese Datei in diesem Ordner nicht mehr.",
    },
    id: {
      label: "Ordner-ID",
      description: "Der Ordner, zu dem die Datei gehört",
    },
    fileId: { label: "Datei-ID", description: "Die zu entfernende Datei" },
    response: { removedPath: "Entfernt" },
    backButton: { label: "Zurück" },
    submitButton: { label: "Datei entfernen", loadingText: "Entfernt..." },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Du darfst dieses Projekt nicht bearbeiten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ordner oder Datei nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen. Versuch es nochmal.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Das Projekt wurde anderswo geändert",
      },
      notSupported: {
        title: "Nicht unterstützt",
        description: "Projekte gibt es nur in privaten und geteilten Ordnern",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Erledigt",
    },
  },
};
