import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modelle",
  },

  get: {
    title: "Modellkatalog-Scan",
    titleShort: "Katalog-Scan",
    description:
      "Letzter Abgleich aller Anbieter-Modelllisten: neue Modelle, die wir noch nicht anbieten, Preisänderungen, entfernte IDs und angekündigte Abschaltungen. Nur lesend.",
    success: {
      title: "Scan geladen",
      description: "Letzter Modellkatalog-Scan geladen.",
    },
  },

  post: {
    title: "Modellkatalog-Scan starten",
    titleShort: "Scan starten",
    description:
      "Holt jetzt alle Modelllisten und Live-Preise der Anbieter, gleicht sie mit unseren Definitionen ab, speichert den Bericht und schickt ihn an die Ops-Postfächer. Ändert nie Code.",
    fields: {
      force: {
        label: "Auch bei frischem Scan ausführen",
        description:
          "Überspringt die 5-Tage-Sperre. Ohne diese Option kommt ein Scan, der jünger als 5 Tage ist, unverändert zurück.",
      },
      sendEmail: {
        label: "Bericht per E-Mail senden",
        description: "Schickt den Bericht an hi@ und thea@unbottled.ai.",
      },
    },
    success: {
      title: "Scan abgeschlossen",
      description: "Modellkatalog-Scan gespeichert.",
    },
  },

  response: {
    scan: "Scan",
    report: "Bericht",
    history: "Frühere Scans",
    skipped: "Übersprungen (frischer Scan)",
    reportText: "Bericht",
  },

  widget: {
    back: "Zurück",
    runNow: "Jetzt scannen",
    running: "Scan läuft...",
    empty: {
      title: "Noch kein Scan",
      message:
        "Der erste Scan läuft nach Zeitplan. Starte ihn jetzt, um zu sehen, was sich bei den Anbietern geändert hat.",
    },
    skipped:
      'Es gibt bereits einen Scan aus den letzten 5 Tagen, daher wurde nichts neu abgerufen. Mit "Auch bei frischem Scan ausführen" erzwingst du einen.',
    scannedAt: "Gescannt",
    newSince: "Neu seit",
    emailedTo: "Gesendet an",
    notEmailed: "Nicht gesendet",
    emailError: "E-Mail fehlgeschlagen",
    metrics: {
      newModels: "Neue Modelle",
      uncensored: "Wirken unzensiert",
      priceChanges: "Preisänderungen",
      missing: "Beim Anbieter weg",
      deprecations: "Abschaltung angekündigt",
      sourceErrors: "Fehlerhafte Quellen",
    },
    sections: {
      newModels: "Neue Modelle bei den Anbietern",
      priceChanges: "Preis- und Kontextabweichungen",
      missing: "Beim Anbieter entfernt",
      deprecations: "Angekündigte Abschaltungen",
      sources: "Quellen",
      history: "Frühere Scans",
    },
    legacy: "Legacy",
    suspect: "verdächtig, Fetcher prüfen",
    uncensored: "unzensiert",
    ok: "ok",
    failed: "fehlgeschlagen",
    models: "Modelle",
    perMillion: "pro 1M",
    context: "Kontext",
    nothing: "Nichts vorhanden.",
  },

  task: {
    name: "Modellkatalog-Scan",
    description:
      "Alle 5 Tage: Modelllisten und Preise der Anbieter mit unserem Katalog abgleichen, Bericht speichern und versenden.",
  },

  errors: {
    scanFailed: "Modellkatalog-Scan fehlgeschlagen: {{error}}",
    loadFailed: "Modellkatalog-Scan konnte nicht geladen werden: {{error}}",
    server: {
      title: "Serverfehler",
      description:
        "Der Scan konnte nicht abgeschlossen werden. Prüfe die Serverlogs.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen.",
    },
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe die Scan-Optionen.",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich als Admin an, um Katalog-Scans zu sehen.",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins können Katalog-Scans sehen oder starten.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Kein Katalog-Scan gefunden.",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein anderer Scan läuft gerade. Versuch es gleich noch mal.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen.",
    },
  },
};
