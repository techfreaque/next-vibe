import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Vorkommen",
      distinct: "Gesehene Fehlerklassen",
      new: "Neue Fehlerklassen",
      openBacklog: "Offener Rückstand (jetzt ungelöst)",
    },
    level: {
      all: "Fehler und Warnungen",
      error: "Nur Fehler",
      warn: "Nur Warnungen",
    },
  },
  post: {
    title: "Fehlerprotokoll-Reihe",
    titleShort: "Fehlerprotokolle",
    description:
      "Fehleraufkommen im Zeitverlauf. Vorkommen und gesehene Klassen stammen aus dem Tageszähler (Tages-Buckets, Verlauf seit 22.11.2026). Neue Klassen zählen Erstsichtungen. Der offene Rückstand ist die aktuelle Zahl ungelöster Klassen, bei jedem Graphlauf gespeichert.",
    fields: {
      resolution: {
        label: "Auflösung",
        description:
          "Berechnungszeitrahmen (Vorkommen und Klassen höchstens täglich)",
      },
      range: {
        label: "Bereich",
        description: "Abzufragender Zeitraum",
      },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      metric: {
        label: "Metrik",
        description:
          "Was gezählt wird: Vorkommen, gesehene Fehlerklassen, neue Klassen oder offener Rückstand",
      },
      level: {
        label: "Stufe",
        description: "Fehler, Warnungen oder beides",
      },
      result: {
        label: "Fehlerprotokoll-Anzahl",
        description: "Ausgabe-Zeitreihe",
      },
      meta: {
        label: "Meta",
        description: "Knotenausführungsmetadaten",
      },
    },
    success: {
      title: "Fehlerprotokoll-Reihe berechnet",
      description: "Fehlerprotokoll-Reihe zurückgegeben",
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
