import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Neue zahlende Kunden",
    titleShort: "Neue Zahler",
    description:
      "Nutzer, deren allererste Zahlung (Paket oder Abo) in diesen Zeitraum fällt. Zählt Personen, nicht Zahlungen. Ohne Admin-Konten.",
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
        label: "Neue zahlende Kunden",
        description: "Ausgabe-Zeitreihe",
      },
      meta: {
        label: "Meta",
        description: "Knotenausführungsmetadaten",
      },
    },
    success: {
      title: "Neue zahlende Kunden berechnet",
      description: "Reihe neuer zahlender Kunden zurückgegeben",
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
