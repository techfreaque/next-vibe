/**
 * German translations for WS Provider Models endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Modelle",
  tags: {
    models: "Modelle",
    aiModels: "KI-Modelle",
  },
  get: {
    title: "KI-Modelle auflisten",
    description:
      "Gibt alle verfuegbaren KI-Modelle mit Preis- und Faehigkeitsinformationen zurueck",
    response: {
      models: {
        title: "Modelle",
      },
      id: {
        content: "Modell-ID",
      },
      name: {
        content: "Name",
      },
      provider: {
        content: "Anbieter",
      },
      category: {
        content: "Kategorie",
      },
      description: {
        content: "Beschreibung",
      },
      contextWindow: {
        content: "Kontextfenster",
      },
      supportsTools: {
        content: "Unterstuetzt Tools",
      },
      creditCost: {
        content: "Kreditkosten",
      },
    },
    success: {
      title: "Modelle abgerufen",
      description: "KI-Modellliste erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungueltige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Modelle nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Modelle konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Sie haben ungespeicherte Aenderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
};
