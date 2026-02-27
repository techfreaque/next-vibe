import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  claudeCode: {
    tags: {
      tasks: "Aufgaben",
    },
    run: {
      post: {
        title: "Claude Code ausführen",
        description:
          "Startet eine Claude Code-Sitzung auf Hermes (dem lokalen Entwicklungsrechner). BEVORZUGE headless:false (Standard) — öffnet eine vollständige bidirektionale Claude Code-Sitzung, bei der Max aktiv teilnehmen kann. headless:true nur für vollautomatisierte Batch-Aufgaben ohne menschliche Eingabe verwenden (z.B. Cron-Jobs). Im interaktiven Modus wird die Sitzung live ins Terminal gestreamt; im Batch-Modus läuft `claude -p` und gibt die gesamte Ausgabe zurück. Läuft immer mit --dangerously-skip-permissions.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Die Aufgabe oder Frage für Claude Code. Spezifisch sein — Dateipfade, Kontext und erwartetes Ausgabeformat angeben.",
          },
          model: {
            label: "Modell",
            description:
              "Claude Modell-ID (z.B. claude-sonnet-4-6, claude-opus-4-6). Verwendet Claude Code-Standard wenn nicht angegeben.",
          },
          maxBudgetUsd: {
            label: "Max. Budget (USD)",
            description:
              "Maximales Ausgabelimit in USD. Verhindert unkontrollierte Tool-Nutzungskosten. Weglassen für kein Limit.",
          },
          allowedTools: {
            label: "Erlaubte Tools",
            description:
              "Kommagetrennte Liste erlaubter Tools (z.B. Read,Edit,Bash). Weglassen für alle Standard-Tools.",
          },
          interactiveMode: {
            label: "Interaktiver Modus",
            description:
              "BEVORZUGE true (Standard). Interaktiver Modus öffnet eine vollständige Claude Code-Sitzung — Max sieht die Ausgabe live und kann teilnehmen. Nur auf false setzen für vollautomatisierte Batch-Aufgaben (Cron-Jobs, Pipelines) ohne menschliche Interaktion.",
          },
          timeoutMs: {
            label: "Timeout (ms)",
            description:
              "Maximale Ausführungszeit in Millisekunden. Standard: 600000 (10 Minuten).",
          },
          output: {
            label: "Ausgabe",
            description: "Kombinierter stdout des Claude Code-Prozesses.",
          },
          exitCode: {
            label: "Exit-Code",
            description: "Prozess-Exit-Code. 0 = Erfolg, ungleich 0 = Fehler.",
          },
          taskTitle: {
            label: "Aufgabentitel",
            description:
              "Kurzer Titel zur Archivierung dieser Aufgabe (z.B. 'Login-Bug beheben'). Wird automatisch aus dem Prompt generiert, wenn nicht angegeben.",
          },
          durationMs: {
            label: "Dauer (ms)",
            description: "Gesamte Laufzeit des Prozesses.",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description:
              "Ungültige Anfrageparameter — Prompt und Felder prüfen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich — Admin-Rolle benötigt",
          },
          internal: {
            title: "Ausführung fehlgeschlagen",
            description:
              "Claude Code-Prozess konnte nicht gestartet werden oder ist abgestürzt",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert — unzureichende Berechtigungen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource oder Arbeitsverzeichnis nicht gefunden",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler bei der Kommunikation mit Claude Code",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Unerwarteter Fehler während der Ausführung",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Konflikt durch ungespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Ausführungskonflikt — möglicherweise läuft bereits eine Sitzung",
          },
        },
        success: {
          title: "Claude Code abgeschlossen",
          description:
            "Claude Code-Prozess beendet — exitCode für Erfolg/Fehler und output für Ergebnisse prüfen",
        },
      },
    },
  },
};
