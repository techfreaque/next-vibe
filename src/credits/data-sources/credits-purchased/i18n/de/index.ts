import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Bezahlt (Pakete + Abos)",
      packs: "Bezahlte Pakete",
      subscriptions: "Abo-Credits",
      gifted: "Geschenkt (Admin-Gutschriften)",
    },
  },
  post: {
    titleShort: "Ausgegebene Credits",
    title: "Ausgegebene Credits (bezahlt, geschenkt)",
    description:
      "Credits, die Wallets pro Bucket gutgeschrieben wurden, in Credits (kein Geld): bezahlte Pakete und Abo-Credits aus echten Checkouts oder geschenkte Admin-Gutschriften (Tester, Creator, Kulanz).",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      kind: {
        label: "Art",
        description:
          "Welche Gutschriften zählen: bezahlte Pakete + Abos, nur Pakete, nur Abos oder geschenkte Admin-Gutschriften",
      },
      result: {
        label: "Ausgegebene Credits",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Gekaufte Credits berechnet",
      description: "Gekaufte Credits-Reihe zurückgegeben",
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
      server: { title: "Serverfehler", description: "Abfrage fehlgeschlagen" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
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
