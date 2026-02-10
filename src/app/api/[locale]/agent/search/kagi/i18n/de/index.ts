import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Mit Kagi suchen",
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
};
