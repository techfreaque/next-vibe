import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "OpenRouter-Modellpreise abrufen",
    description:
      "Modellpreise und Metadaten von OpenRouter API abrufen und models.ts aktualisieren",
    form: {
      title: "OpenRouter-Modellpreise",
    },
    response: {
      summary: {
        title: "Aktualisierungsübersicht",
        totalModels: "Gesamte Modelle",
        modelsFound: "Modelle gefunden",
        modelsUpdated: "Modelle aktualisiert",
        fileUpdated: "Datei aktualisiert",
      },
      models: {
        title: "Aktualisierte Modelle",
        model: {
          id: "Modell-ID",
          name: "Modellname",
          contextLength: "Kontextlänge",
          inputTokenCost: "Eingabekosten ($/1M Token)",
          outputTokenCost: "Ausgabekosten ($/1M Token)",
        },
      },
      missingOpenRouterModels: {
        title: "Fehlende OpenRouter-Modelle",
        model: {
          modelId: "Modell-ID",
          openRouterId: "OpenRouter-ID",
          suggestion: "Vorschlag",
        },
      },
      nonOpenRouterModels: {
        title: "Nicht-OpenRouter-Modelle",
        model: {
          modelId: "Modell-ID",
          provider: "Anbieter",
        },
      },
    },
    errors: {
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen von OpenRouter API",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zur OpenRouter API konnte nicht hergestellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Aktion auszuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Bei der Verarbeitung der Anfrage ist ein Konflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Modellpreise erfolgreich abgerufen und aktualisiert",
    },
  },
  tags: {
    models: "Modelle",
  },
} as const;
