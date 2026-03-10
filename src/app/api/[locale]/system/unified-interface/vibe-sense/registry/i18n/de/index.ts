import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },
  get: {
    title: "Indikator-Registry",
    description:
      "Alle registrierten Indikatoren für den Graph-Builder auflisten",
    container: {
      title: "Indikatoren",
      description: "Alle registrierten Indikatoren",
    },
    response: {
      indicators: "Indikatoren",
      indicator: {
        id: "ID",
        domain: "Domaene",
        description: "Beschreibung",
        resolution: "Aufloesung",
        persist: "Persistenz",
        lookback: "Rueckblick",
        inputs: {
          item: "Eingabe",
        },
        isDerived: "Abgeleitet",
        isMultiValue: "Mehrwertig",
      },
    },
    success: {
      title: "Registry geladen",
      description: "Indikator-Registry erfolgreich abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Registry konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Registry nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
