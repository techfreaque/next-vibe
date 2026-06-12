import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  widget: {
    title: "Aktive Terminals",
    back: "Zurück",
    lastCommand: "Letzter Befehl",
    noTerminals: "Keine aktiven Terminals",
    noTerminalsHint:
      "Führe einen Befehl mit Befehl ausführen aus, um eine Terminal-Sitzung zu starten.",
    openExec: "Befehl ausführen",
    terminalCount: "Terminals",
    machineLabel: "Maschine",
    cwdLabel: "Verzeichnis",
    statusLabel: "Status",
    openedLabel: "Geöffnet",
    openTerminal: "Öffnen",
    manageConnections: "Verbindungen",
    activeStatus: "Aktiv",
  },
  get: {
    title: "Terminals auflisten",
    titleShort: "Terminals",
    description:
      "Aktive Terminal-Sitzungen mit aktuellem Arbeitsverzeichnis anzeigen.",
    dynamicTitle: "Terminals: {{path}}",
    status: {
      loading: "Laden...",
      done: "Geladen",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Maschine",
        description:
          "Auf eine bestimmte Maschine filtern, z.B. /ssh/local-machine. Leer für alle.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "Terminal-ID" },
        connectionSlug: { content: "Maschine" },
        cwd: { content: "Arbeitsverzeichnis" },
        name: { content: "Name" },
        openedAt: { content: "Geöffnet" },
        lastCommandAt: { content: "Letzter Befehl" },
        status: { content: "Status" },
      },
      total: { text: "Gesamt" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Pfad prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Nicht erlaubt",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Terminals gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen",
      },
      unknown: { title: "Fehler", description: "Etwas ist schiefgelaufen" },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Erst speichern oder verwerfen",
      },
      conflict: {
        title: "Konflikt",
        description: "Widersprüchliche Operation",
      },
    },
    success: {
      title: "Terminals geladen",
      description: "Aktive Terminals geladen",
    },
  },
};
