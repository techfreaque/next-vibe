export const translations = {
  category: "Agent",

  get: {
    title: "Alle Modellpreise aktualisieren",
    description:
      "Aktuelle Preise für alle Modelle von jeder Anbieter-API (OpenRouter, Replicate usw.) abrufen und models.ts aktualisieren",
    form: {
      title: "Modellpreis-Updater",
    },
    response: {
      summary: {
        title: "Aktualisierungsübersicht",
        totalProviders: "Ausgeführte Anbieter",
        totalModels: "Modelle gesamt",
        modelsUpdated: "Aktualisierte Modelle",
        fileUpdated: "Datei aktualisiert",
      },
      updates: {
        title: "Aktualisierte Modelle",
        model: {
          modelId: "Modell-ID",
          name: "Modellname",
          provider: "Anbieter",
          field: "Preisfeld",
          value: "Neuer Wert",
          source: "Preisquelle",
        },
      },
      failures: {
        title: "Fehlgeschlagene Preisabrufe",
        model: {
          modelId: "Modell-ID",
          provider: "Anbieter",
          reason: "Grund",
        },
      },
      providerResults: {
        title: "Anbieterergebnisse",
        model: {
          provider: "Anbieter",
          modelsFound: "Gefundene Modelle",
          modelsUpdated: "Aktualisiert",
          error: "Fehler",
        },
      },
    },
    errors: {
      server: {
        title: "Serverfehler",
        description: "Modellpreise konnten nicht aktualisiert werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zu Preis-APIs fehlgeschlagen",
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
          "Bei der Verarbeitung der Anfrage ist ein Konflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Alle Modellpreise erfolgreich abgerufen und aktualisiert",
    },
  },
  tags: {
    models: "Modelle",
  },
  updateAllModelPrices: {
    name: "Alle Modellpreise aktualisieren",
    description:
      "Ruft aktuelle Preise für alle Modelle von jeder Anbieter-API ab und aktualisiert models.ts",
  },
};
