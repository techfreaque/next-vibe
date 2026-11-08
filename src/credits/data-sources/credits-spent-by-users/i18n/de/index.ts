import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Nutzer: Gesamtausgaben",
    title: "Gesamtausgaben der Nutzer (bezahlt + gratis)",
    description:
      "Credits, die Nutzer-Wallets ausgegeben haben, bezahlt und gratis zusammen. Nicht die Cap-Achse - siehe Gratis-Ausgaben.",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      result: {
        label: "Gesamtausgaben der Nutzer",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Von Nutzern ausgegebene Credits berechnet",
      description: "Von Nutzern ausgegebene Credits-Reihe zurückgegeben",
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
