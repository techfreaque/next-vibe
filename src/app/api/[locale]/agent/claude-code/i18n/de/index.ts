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
            title: "Prompt",
            description:
              "Die Aufgabe oder Frage für Claude Code. Spezifisch sein — Dateipfade, Kontext und erwartetes Ausgabeformat angeben.",
          },
          model: {
            title: "Modell",
            description:
              "Claude Modell-ID (z.B. claude-sonnet-4-6, claude-opus-4-6). Verwendet Claude Code-Standard wenn nicht angegeben.",
          },
          maxBudgetUsd: {
            title: "Max. Budget (USD)",
            description:
              "Maximales Ausgabelimit in USD. Verhindert unkontrollierte Tool-Nutzungskosten. Weglassen für kein Limit.",
          },
          systemPrompt: {
            title: "System-Prompt",
            description:
              "Optionaler System-Prompt. Für Persona, Einschränkungen oder Kontext der gesamten Sitzung.",
          },
          allowedTools: {
            title: "Erlaubte Tools",
            description:
              "Kommagetrennte Liste erlaubter Tools (z.B. Read,Edit,Bash). Weglassen für alle Standard-Tools.",
          },
          headless: {
            title: "Headless (Batch-Modus)",
            description:
              "BEVORZUGE false (Standard). headless:false öffnet eine vollständige interaktive Claude Code-Sitzung — Max sieht die Ausgabe live und kann teilnehmen. Nur auf true setzen für vollautomatisierte Batch-Aufgaben (Cron-Jobs, Pipelines) ohne menschliche Interaktion.",
          },
          timeoutMs: {
            title: "Timeout (ms)",
            description:
              "Maximale Ausführungszeit in Millisekunden. Standard: 600000 (10 Minuten).",
          },
          output: {
            title: "Ausgabe",
            description: "Kombinierter stdout des Claude Code-Prozesses.",
          },
          exitCode: {
            title: "Exit-Code",
            description: "Prozess-Exit-Code. 0 = Erfolg, ungleich 0 = Fehler.",
          },
          durationMs: {
            title: "Dauer (ms)",
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
