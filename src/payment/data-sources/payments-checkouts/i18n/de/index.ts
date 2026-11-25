import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Gestartet",
      paid: "Bezahlt",
      abandoned: "Abgebrochen oder abgelehnt",
    },
  },
  post: {
    title: "Checkouts",
    titleShort: "Checkouts",
    description:
      "Pro Zeitraum geöffnete Checkouts für Pakete und neue Abos, nach Ergebnis. Abgebrochen heißt: Sitzung nach 24 h abgelaufen oder Zahlung abgelehnt. Ohne Verlängerungen und Admin-Konten.",
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
        label: "Checkouts",
        description: "Ausgabe-Zeitreihe",
      },
      meta: {
        label: "Meta",
        description: "Knotenausführungsmetadaten",
      },
      outcome: {
        label: "Ergebnis",
        description: "Gestartet (alle), bezahlt oder abgebrochen/abgelehnt",
      },
    },
    success: {
      title: "Checkouts berechnet",
      description: "Checkout-Reihe zurückgegeben",
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
