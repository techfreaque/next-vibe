import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Alle Modellpreise aktualisieren",
    titleShort: "Preise aktualisieren",
    description:
      "Ruft aktuelle Anbieterpreise ab und zeigt Änderungen am Modellkatalog. Mit --write in der lokalen CLI übernehmen.",
    form: {
      title: "Modellpreis-Updater",
      write: "Änderungen in Quelldateien schreiben",
    },
    response: {
      diff: "Quelldatei-Diff",
      summary: {
        title: "Aktualisierungsübersicht",
        totalProviders: "Ausgeführte Anbieter",
        totalModels: "Modelle gesamt",
        modelsUpdated: "Vorgeschlagene Änderungen",
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
        detail: "Unbekannter Fehler: {{error}}",
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
      description:
        "Anbieterpreise abgerufen und mit dem Modellkatalog verglichen.",
    },
  },
  tags: {
    models: "Modelle",
  },
  updateAllModelPrices: {
    name: "Alle Modellpreise aktualisieren",
    description:
      "Vergleicht aktuelle Anbieterpreise mit dem Modellkatalog und protokolliert die Änderungen zur Prüfung.",
  },
};
