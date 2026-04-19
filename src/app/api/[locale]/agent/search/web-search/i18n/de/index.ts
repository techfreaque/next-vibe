import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Im Web suchen",
    dynamicTitle: "Suche: {{query}}",
    description:
      "Durchsucht das Internet nach aktuellen Informationen, Nachrichten, Fakten oder Ereignissen. Leitet automatisch an deinen bevorzugten Suchanbieter weiter.",
    form: {
      title: "Websuche",
      description: "Durchsuche das Web mit deinem bevorzugten Anbieter",
    },
    submitButton: {
      label: "Suchen",
      loadingText: "Suche läuft...",
    },
    backButton: {
      label: "Zurück",
    },
    fields: {
      query: {
        title: "Suchanfrage",
        description:
          "Klare und spezifische Suchanfrage. Verwende Schlüsselwörter statt Fragen.",
        placeholder: "Suchanfrage eingeben...",
      },
      provider: {
        title: "Suchanbieter",
        description:
          "Welche Suchmaschine genutzt wird. Auto wählt deinen Standard oder den günstigsten verfügbaren.",
        options: {
          auto: "Automatisch (empfohlen)",
          brave: "Brave-Suche",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Max. Ergebnisse",
        description: "Anzahl der Ergebnisse (1-10). Nur Brave.",
      },
      includeNews: {
        title: "Nachrichten einbeziehen",
        description:
          "Nachrichtenergebnisse für aktuelle Ereignisse einbeziehen. Nur Brave.",
      },
      freshness: {
        title: "Aktualität",
        description: "Ergebnisse nach Aktualität filtern. Nur Brave.",
        options: {
          day: "Letzter Tag",
          week: "Letzte Woche",
          month: "Letzter Monat",
          year: "Letztes Jahr",
        },
      },
    },
    response: {
      provider: {
        title: "Anbieter",
        description: "Welcher Suchanbieter verwendet wurde",
      },
      output: {
        title: "KI-Antwort",
        description: "KI-generierte Zusammenfassung (nur Kagi)",
      },
      results: {
        title: "Ergebnisse",
        description: "Websuchergebnisse",
        result: "Ergebnis",
        item: {
          title: "Suchergebnis",
          description: "Einzelnes Suchergebnis",
          url: "URL",
          snippet: "Snippet",
          age: "Alter",
          source: "Quelle",
        },
      },
    },
    errors: {
      queryEmpty: {
        title: "Suchanfrage ist erforderlich",
        description: "Bitte gib eine Suchanfrage ein",
      },
      queryTooLong: {
        title: "Suchanfrage ist zu lang",
        description: "Die Anfrage darf maximal 400 Zeichen lang sein",
      },
      noProvider: {
        title: "Kein Suchanbieter verfügbar",
        description:
          "Keine Such-API-Schlüssel konfiguriert. Richte Brave Search oder Kagi in deiner .env-Datei ein.",
      },
      providerUnavailable: {
        title: "Suchanbieter nicht verfügbar",
        description:
          "Der gewählte Suchanbieter ist nicht konfiguriert. Wähle einen anderen oder nutze Auto.",
      },
      timeout: {
        title: "Suchanfrage hat Zeitüberschreitung",
        description: "Die Suche hat zu lange gedauert",
      },
      searchFailed: {
        title: "Suche fehlgeschlagen",
        description: "Bei der Suche ist ein Fehler aufgetreten",
      },
      validation: {
        title: "Ungültige Suche",
        description: "Überprüfe deine Suchparameter und versuche es erneut",
      },
      internal: {
        title: "Etwas ist schiefgelaufen",
        description:
          "Die Suche konnte nicht abgeschlossen werden. Bitte versuche es erneut",
      },
    },
    success: {
      title: "Suche erfolgreich",
      description: "Die Websuche wurde erfolgreich abgeschlossen",
    },
  },
  tags: {
    search: "Suche",
    web: "Web",
    internet: "Internet",
  },
};
