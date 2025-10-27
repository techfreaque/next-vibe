import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Im Web suchen",
    description:
      "Durchsuchen Sie das Internet nach aktuellen Informationen, Nachrichten, Fakten oder aktuellen Ereignissen. Verwenden Sie dies, wenn Sie aktuelle Informationen benötigen oder Fakten überprüfen möchten.",
    form: {
      title: "Suchparameter",
      description: "Konfigurieren Sie Ihre Web-Suchanfrage",
    },
    fields: {
      query: {
        title: "Suchanfrage",
        description:
          "Klare und spezifische Suchanfrage. Verwenden Sie Schlüsselwörter statt Fragen.",
        placeholder: "Geben Sie Ihre Suchanfrage ein...",
      },
      maxResults: {
        title: "Max. Ergebnisse",
        description: "Anzahl der zurückzugebenden Ergebnisse (1-10)",
      },
      includeNews: {
        title: "Nachrichten einbeziehen",
        description:
          "Nachrichtenergebnisse für aktuelle Ereignisse einbeziehen",
      },
      freshness: {
        title: "Aktualität",
        description: "Ergebnisse nach Aktualität filtern",
        options: {
          day: "Letzter Tag",
          week: "Letzte Woche",
          month: "Letzter Monat",
          year: "Letztes Jahr",
        },
      },
    },
    response: {
      success: {
        title: "Erfolg",
        description: "Ob die Suche erfolgreich war",
      },
      message: {
        title: "Nachricht",
        description: "Statusnachricht zur Suche",
      },
      query: {
        title: "Anfrage",
        description: "Die ausgeführte Suchanfrage",
      },
      results: {
        title: "Ergebnisse",
        description: "Array von Suchergebnissen",
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
      cached: {
        title: "Gecacht",
        description: "Ob Ergebnisse aus dem Cache bereitgestellt wurden",
      },
      timestamp: {
        title: "Zeitstempel",
        description: "Wann die Suche durchgeführt wurde",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Suchanfrage ist ungültig oder fehlt",
      },
      internal: {
        title: "Suchfehler",
        description: "Bei der Suche ist ein Fehler aufgetreten",
      },
    },
    success: {
      title: "Suche erfolgreich",
      description: "Die Web-Suche wurde erfolgreich abgeschlossen",
    },
  },
  tags: {
    search: "Suche",
    web: "Web",
    internet: "Internet",
  },
};
