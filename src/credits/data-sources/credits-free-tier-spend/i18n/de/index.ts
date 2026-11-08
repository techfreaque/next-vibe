import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Gratis-Ausgaben",
    title: "Gratis-Ausgaben (spiegelt öffentlichen Cap)",
    description:
      "Von Gästen und kostenlosen Nutzern verbrauchte Gratis-Credits. Gleiche Achse wie Heute ausgegeben im öffentlichen Tages-Cap, gebucketet am lokalen Servermitternacht-Reset des Caps.",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      result: {
        label: "Gratis-Ausgaben",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Gratis-Ausgaben berechnet",
      description: "Gratis-Ausgaben-Reihe zurückgegeben",
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
