import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "Alle Leads",
      humans: "Menschliche Leads",
      firstChats: "Gechattet",
      signups: "Registriert",
      emailConfirmed: "E-Mail bestätigt",
      payers: "Bezahlt",
    },
  },
  post: {
    title: "Lead-Funnel-Stufe",
    titleShort: "Funnel-Stufe",
    description:
      "Neue Leads pro Zeitfenster und wie viele davon eine Funnel-Stufe erreicht haben. Bots ab der zweiten Stufe ausgeschlossen.",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      stage: {
        label: "Stufe",
        description: "Welche Funnel-Stufe gezählt wird",
      },
      result: {
        label: "Anzahl Stufe",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Lead-Funnel-Daten",
      description: "Funnel-Stufen-Zeitreihe zurückgegeben",
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
