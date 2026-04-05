export const translations = {
  tags: {
    models: "Modelle",
  },
  endpointCategories: {
    ai: "KI",
  },
  get: {
    title: "KI-Modelle auflisten",
    description:
      "Alle verfügbaren KI-Modelle durchsuchen und filtern. Nach Typ, Inhaltsstufe, Intelligenz, Preis oder Fähigkeiten filtern.",
    dynamicTitle: "{{count}} Modelle",

    fields: {
      query: {
        label: "Suche",
        description:
          "Modelle nach Name, Anbieter oder Fähigkeit filtern (z.B. 'coding', 'uncensored', 'image').",
        placeholder: "z.B. GPT, Gemini, coding…",
      },
      modelType: {
        label: "Typ",
        description:
          "Nach Modelltyp filtern: text, image, video oder audio. Leer lassen für alle Typen.",
        placeholder: "Alle Typen",
      },
      contentLevel: {
        label: "Inhaltsstufe",
        description:
          "Nach Inhaltspolitik filtern. Mainstream = Standard-Sicherheitsfilter. Open = weniger Einschränkungen. Uncensored = keine Filter.",
        placeholder: "Alle Inhaltsstufen",
      },
      intelligence: {
        label: "Intelligenz",
        description:
          "Mindest-Intelligenzstufe. Quick = schnell & effizient. Smart = ausgewogene Qualität. Brilliant = tiefes Reasoning.",
        placeholder: "Beliebige Intelligenz",
      },
      page: {
        label: "Seite",
        description: "Seitennummer für die Paginierung (beginnt bei 1).",
      },
      pageSize: {
        label: "Seitengröße",
        description: "Anzahl der Modelle pro Seite (Standard 50, max 200).",
      },
    },

    response: {
      models: "Modelle",
      totalCount: "Gesamt",
      matchedCount: "Gefunden",
      currentPage: "Seite",
      totalPages: "Seiten",
      hint: "Hinweis",
      model: {
        id: "Modell-ID",
        name: "Name",
        provider: "Anbieter",
        type: "Typ",
        description: "Beschreibung",
        contextWindow: "Kontext",
        parameterCount: "Parameter",
        intelligence: "Intelligenz",
        speed: "Geschwindigkeit",
        content: "Inhalt",
        price: "Preis (Credits)",
        supportsTools: "Tools",
        utilities: "Fähigkeiten",
        inputs: "Eingaben",
        outputs: "Ausgaben",
      },
    },

    errors: {
      server: {
        title: "Serverfehler",
        description: "Modellliste konnte nicht abgerufen werden.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Filterparameter.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein.",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Modelle gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Anforderungskonflikt.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen.",
      },
    },

    success: {
      title: "Modelle geladen",
      description: "KI-Modellliste erfolgreich abgerufen.",
    },

    browser: {
      supportsTools: "✓ Tools",
      noModels: "Keine Modelle entsprechen deinen Filtern.",
      allLabel: "Alle",
      pageLabel: "Seite {{current}}/{{total}}",
      statsLabel: "{{matched}} von {{total}} Modellen",
      statsLabelFiltered: "{{matched}} gefiltert",
      free: "Kostenlos",
      credits: "~{{cost}} Credits",
      ctx: "Kontext",
    },
  },
} as const;
