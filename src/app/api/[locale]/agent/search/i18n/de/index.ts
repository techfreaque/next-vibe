import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  brave: {
    category: "Information",
    get: {
      title: "Im Web suchen",
      dynamicTitle: "Search: {{query}}",
      description:
        "Durchsuchen Sie das Internet nach aktuellen Informationen, Nachrichten, Fakten oder aktuellen Ereignissen. Verwenden Sie dies, wenn Sie aktuelle Informationen benötigen oder Fakten überprüfen möchten.",
      form: {
        title: "Suchparameter",
        description: "Konfigurieren Sie Ihre Web-Suchanfrage",
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
        queryEmpty: {
          title: "Suchanfrage ist erforderlich",
          description: "Bitte geben Sie eine Suchanfrage ein",
        },
        queryTooLong: {
          title: "Suchanfrage ist zu lang",
          description: "Die Anfrage darf maximal 400 Zeichen lang sein",
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
          description:
            "Bitte überprüfen Sie Ihre Suchparameter und versuchen Sie es erneut",
        },
        internal: {
          title: "Etwas ist schief gelaufen",
          description:
            "Wir konnten Ihre Suche nicht abschließen. Bitte versuchen Sie es erneut",
        },
        notConfigured: {
          title:
            "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
          description:
            "Richten Sie {{label}} ein, um die Websuche zu aktivieren",
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
  },
  kagi: {
    category: "Information",
    get: {
      title: "Mit Kagi suchen",
      dynamicTitle: "Kagi: {{query}}",
      description:
        "Durchsuchen Sie das Internet oder erhalten Sie KI-gestützte Antworten mit Kagi. Der FastGPT-Modus liefert umfassende Antworten mit Quellen, während der Suchmodus direkte Ergebnisse zurückgibt.",
      form: {
        title: "Suchparameter",
        description: "Konfigurieren Sie Ihre Kagi-Suchanfrage",
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
          description: "Klare und spezifische Suchanfrage oder Frage.",
          placeholder: "Geben Sie Ihre Suchanfrage ein...",
        },
        mode: {
          title: "Suchmodus",
          description:
            "Wählen Sie zwischen KI-gestützten Antworten (FastGPT) oder direkten Suchergebnissen",
          options: {
            fastgpt: "FastGPT (KI-gestützte Antworten)",
            search: "Suche (Direkte Ergebnisse)",
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
        output: {
          title: "Antwort",
          description: "KI-generierte Antwort von FastGPT",
        },
        query: {
          title: "Anfrage",
          description: "Die ausgeführte Suchanfrage",
        },
        references: {
          title: "Referenzen",
          description: "Quellenreferenzen und Zitate",
          reference: "Referenz",
          item: {
            title: "Referenz",
            description: "Quellenreferenz mit Zitat",
            url: "URL",
            snippet: "Snippet",
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
        queryEmpty: {
          title: "Suchanfrage ist erforderlich",
          description: "Bitte geben Sie eine Suchanfrage ein",
        },
        queryTooLong: {
          title: "Suchanfrage ist zu lang",
          description: "Die Anfrage darf maximal 400 Zeichen lang sein",
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
          description:
            "Bitte überprüfen Sie Ihre Suchparameter und versuchen Sie es erneut",
        },
        internal: {
          title: "Etwas ist schief gelaufen",
          description:
            "Wir konnten Ihre Suche nicht abschließen. Bitte versuchen Sie es erneut",
        },
        notConfigured: {
          title:
            "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
          description:
            "Richten Sie {{label}} ein, um die Kagi-Suche zu aktivieren",
        },
      },
      success: {
        title: "Suche erfolgreich",
        description: "Die Kagi-Suche wurde erfolgreich abgeschlossen",
      },
    },
    tags: {
      search: "Suche",
      web: "Web",
      ai: "KI",
    },
  },
  enums: {
    provider: {
      AUTO: "Automatisch",
      BRAVE: "Brave-Suche",
      KAGI: "Kagi FastGPT",
    },
  },
};
