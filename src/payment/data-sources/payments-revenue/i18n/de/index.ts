import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Alles",
      pack: "Credit-Pakete",
      subscription: "Abos (neu + Verlängerungen)",
      newSubscription: "Neue Abos",
      renewal: "Verlängerungen",
    },
    provider: {
      all: "Alle Anbieter",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Umsatz (USD)",
    titleShort: "Umsatz",
    description:
      "Eingenommenes Geld pro Zeitraum in ca. USD (EUR und PLN zu festen Kursen). Erfolgreiche und später erstattete Zahlungen, ohne Admin-Konten. Filterbar nach Produktart und Zahlungsanbieter.",
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
        label: "Umsatz (USD)",
        description: "Ausgabe-Zeitreihe",
      },
      meta: {
        label: "Meta",
        description: "Knotenausführungsmetadaten",
      },
      kind: {
        label: "Bezahlt für",
        description:
          "Credit-Pakete, Abos (neu + Verlängerungen) oder eines davon",
      },
      provider: {
        label: "Zahlungsanbieter",
        description: "Stripe, NOWPayments oder beide",
      },
    },
    success: {
      title: "Umsatz berechnet",
      description: "Umsatzreihe zurückgegeben",
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
