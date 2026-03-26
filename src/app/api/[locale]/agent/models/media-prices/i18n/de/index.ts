import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Medienmodell-Preise abrufen",
    description:
      "Aktuelle Preise für Bild- und Audiogenerierungsmodelle von Replicate, OpenAI, Fal.ai und OpenRouter abrufen und models.ts aktualisieren",
    form: {
      title: "Medienmodell-Preise",
    },
    response: {
      summary: {
        title: "Aktualisierungsübersicht",
        totalModels: "Gesamte Medienmodelle",
        modelsUpdated: "Modelle aktualisiert",
        fileUpdated: "Datei aktualisiert",
      },
      models: {
        title: "Aktualisierte Modelle",
        model: {
          id: "Modell-ID",
          name: "Modellname",
          provider: "Anbieter",
          costUsd: "Kosten (USD)",
          creditCost: "Credits",
          source: "Preisquelle",
        },
      },
    },
    errors: {
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen der Medienmodell-Preise",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zu Preis-APIs nicht möglich",
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
        description: "Sie sind nicht berechtigt, diese Aktion durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Beim Verarbeiten der Anfrage ist ein Konflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Medienmodell-Preise erfolgreich abgerufen und aktualisiert",
    },
  },
  tags: {
    models: "Modelle",
  },
  updateMediaModelPrices: {
    name: "Medienmodell-Preise aktualisieren",
    description:
      "Ruft aktuelle Preise für Bild- und Audiogenerierungsmodelle von Anbieter-APIs ab und aktualisiert models.ts",
  },
};
