import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    settings: "Einstellungen",
  },
  voices: {
    MALE: "Männliche Stimme",
    FEMALE: "Weibliche Stimme",
  },
  get: {
    title: "Chat-Einstellungen abrufen",
    description: "Benutzereinstellungen und Präferenzen abrufen",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um auf Einstellungen zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für diese Ressource",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen der Einstellungen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Einstellungen erfolgreich abgerufen",
    },
  },
  post: {
    title: "Chat-Einstellungen aktualisieren",
    description: "Benutzereinstellungen und Präferenzen aktualisieren",
    container: {
      title: "Chat-Einstellungen",
    },
    selectedModel: {
      label: "Ausgewähltes Modell",
    },
    selectedSkill: {
      label: "Ausgewählter Charakter",
    },
    activeFavoriteId: {
      label: "Aktiver Favorit",
    },
    ttsAutoplay: {
      label: "TTS Autoplay",
    },
    viewMode: {
      label: "Ansichtsmodus",
    },
    contextMemory: {
      title: "Kontextgedächtnis",
      description:
        "Wie weit die KI sich im Gespräch zurückerinnert, bevor ältere Nachrichten zusammengefasst werden.",
      costNote: "Weniger = günstiger",
      costExplain:
        "(bis zu einem gewissen Punkt) – du tauschst etwas Gedächtnis gegen niedrigere Kosten pro Nachricht.",
      tooltipTitle: "Wie viel Gesprächsverlauf die KI behält",
      tooltipBody:
        "Wenn das Gespräch dieses Limit überschreitet, werden ältere Nachrichten automatisch zusammengefasst. Die KI bleibt kohärent, verbraucht aber weniger Token – und spart Kosten.",
      tooltipModelCap: "Das aktuelle Modell unterstützt bis zu {cap} Token.",
      default: "Standard",
      tokens: "Token",
      modelMax: "Modell-Maximum",
      resetToDefault: "Auf Standard zurücksetzen ({value})",
      cheaper: "günstiger",
      moreMemory: "mehr Gedächtnis",
      barCheap: "Niedrigere Kosten · kürzeres Gedächtnis",
      barBalanced: "Ausgewogene Kosten & Gedächtnis",
      barRich: "Reicheres Gedächtnis · höhere Kosten",
      barMax: "Maximales Gedächtnis · höchste Kosten",
      tools: "Tools",
      toolsInherited: "geerbt",
    },
    searchProvider: {
      label: "Suchanbieter",
      description:
        "Deine bevorzugte Suchmaschine. Auto wählt den günstigsten verfügbaren Anbieter.",
      auto: "Automatisch",
    },
    codingAgent: {
      label: "Coding-Agent",
      description:
        "Welcher Coding-Agent-CLI verwendet wird, wenn die KI das Coding-Agent-Tool aufruft. Nur für Admins.",
      options: {
        claudeCode: "Claude Code (Standard)",
        openCode: "OpenCode",
      },
    },
    dreaming: {
      title: "Träumen",
      description:
        "Die KI sortiert deinen Kopf im Schlaf — konsolidiert Erinnerungen, räumt Dokumente auf, hebt hervor, was zählt.",
      toggle: {
        label: "Träumen aktivieren",
      },
      schedule: {
        label: "Zeitplan",
        options: {
          nightlyAt2: "2:00 Uhr täglich",
          weekdaysAt2: "2:00 Uhr werktags",
          weekdaysAt8: "8:00 Uhr werktags",
          every6h: "Alle 6 Stunden",
          every12h: "Alle 12 Stunden",
        },
      },
      favoriteId: {
        label: "Favoriten-Slot",
        defaultOption: "Standard (Thea)",
      },
      prompt: {
        label: "Session-Anweisung",
        placeholder:
          "Worauf soll sich Thea in dieser Session konzentrieren? Leer lassen für den Standard.",
        defaultPrompt:
          "Starte deine Träum-Session. Reorganisiere und konsolidiere den Cortex — Erinnerungen, Dokumente, Threads. Hinterlasse alles sauberer und geordneter.",
      },
      lastRun: "Letzter Lauf:",
      neverRun: "Noch nie ausgeführt",
      folderLink: "Träume-Ordner öffnen",
      runNow: "Jetzt ausführen",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "Die KI arbeitet deine Warteschlange ab, während du weg bist — nächste Schritte, laufende Projekte, Aufgaben im Rückstand.",
      toggle: {
        label: "Autopilot aktivieren",
      },
      schedule: {
        label: "Zeitplan",
        options: {
          nightlyAt2: "2:00 Uhr täglich",
          weekdaysAt2: "2:00 Uhr werktags",
          weekdaysAt8: "8:00 Uhr werktags",
          every6h: "Alle 6 Stunden",
          every12h: "Alle 12 Stunden",
        },
      },
      favoriteId: {
        label: "Favoriten-Slot",
        defaultOption: "Standard (Thea)",
      },
      prompt: {
        label: "Session-Anweisung",
        placeholder:
          "Worauf soll sich Hermes in dieser Session konzentrieren? Leer lassen für den Standard.",
        defaultPrompt:
          "Starte deine Autopilot-Session. Mach weiter, wo aktive Projekte stehen — nächste Schritte vorantreiben, Warteschlange abarbeiten, Dinge in Bewegung halten.",
      },
      lastRun: "Letzter Lauf:",
      neverRun: "Noch nie ausgeführt",
      folderLink: "Autopilot-Ordner öffnen",
      runNow: "Jetzt ausführen",
    },
    mama: {
      title: "Plattform-Herzschlag",
      description:
        "Thea überwacht deine Produktionsinstanz — prüft die Gesundheit, treibt Features voran, kümmert sich um Marketing, sendet Neuigkeiten. Ein gemeinsamer Slot für alle Admins.",
      toggle: {
        label: "Mama-Modus aktivieren",
      },
      schedule: {
        label: "Zeitplan",
        options: {
          every4h: "Alle 4 Stunden",
          every6h: "Alle 6 Stunden",
          every12h: "Alle 12 Stunden",
          daily: "Täglich um Mitternacht",
        },
      },
      prompt: {
        label: "Session-Prompt",
        placeholder:
          "Worauf soll Thea sich konzentrieren? Leer lassen für Standard.",
        defaultPrompt:
          "Starte deine Mama-Session. Prüfe den Plattformzustand, überprüfe Fehlerprotokolle, bringe ausstehende Feature-Arbeit voran und erstelle nötige Ankündigungen. Hinterlasse eine Zusammenfassung in /documents/mama/log/.",
      },
      lastRun: "Letzter Lauf:",
      neverRun: "Noch nie ausgeführt",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Einstellungen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Einstellungen konnten nicht gespeichert werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Einstellungen zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, Einstellungen zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Einstellungen konnten nicht gespeichert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Einstellungskonflikt aufgetreten",
      },
    },
    success: {
      title: "Einstellungen gespeichert",
      description: "Ihre Einstellungen wurden erfolgreich gespeichert",
    },
  },
  patch: {
    chatModel: {
      label: "Chat-Modell",
      placeholder: "Systemstandard",
    },
  },
};
