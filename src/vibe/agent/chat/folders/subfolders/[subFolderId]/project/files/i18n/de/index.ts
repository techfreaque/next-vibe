import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },
  post: {
    title: "Wissensdatei hinzufügen",
    titleShort: "Datei hinzufügen",
    description:
      "Füge ein Dokument hinzu, auf das die KI in jedem Chat dieses Ordners zugreifen kann",
    container: {
      title: "Wissensdatei hinzufügen",
      description:
        "Wird als Cortex-Dokument gespeichert. Die KI liest es mit cortex-read und cortex-search.",
    },
    id: {
      label: "Ordner-ID",
      description: "Der Ordner, dem die Datei hinzugefügt wird",
    },
    name: {
      label: "Dateiname",
      description: "Ein kurzer Name. .md wird ergänzt, falls es fehlt.",
      placeholder: "launch-briefing",
    },
    content: {
      label: "Inhalt",
      description:
        "Füge den Text des Dokuments ein (Markdown funktioniert am besten)",
    },
    response: { fileId: "Datei-ID", path: "Cortex-Pfad" },
    backButton: { label: "Zurück" },
    submitButton: { label: "Datei hinzufügen", loadingText: "Fügt hinzu..." },
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
