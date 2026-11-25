import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Beendete Abos",
    titleShort: "Beendet",
    description:
      "Pro Zeitraum beendete Abos (Zugang endet). Ohne unvollständige Checkouts und Admin-Konten.",
    fields: {
      resolution: {
        label: "Auflösung",
        description: "Berechnungszeitrahmen",
      },
      range: {
        label: "Bereich",
        description: "Abzufragender Zeitraum",
      },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      result: {
        label: "Beendete Abos",
        description: "Ausgabe-Zeitreihe",
      },
      meta: {
        label: "Meta",
        description: "Knotenausführungsmetadaten",
      },
    },
    success: {
      title: "Beendete Abos berechnet",
      description: "Reihe beendeter Abos zurückgegeben",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Abfrage fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt",
      },
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
