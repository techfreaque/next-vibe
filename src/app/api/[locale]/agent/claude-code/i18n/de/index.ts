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
        dynamicTitle: "Claude Code: {{prompt}}",
        description:
          "Führt eine Claude Code-Aufgabe aus. Batch-Modus (STANDARD): läuft headless und gibt die Ausgabe zurück. Interaktiver Modus: öffnet eine Live-Terminal-Sitzung - das Ergebnis wird automatisch zurückgeliefert wenn die Sitzung endet.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Die Aufgabe oder Frage für Claude Code. Spezifisch sein - Dateipfade, Kontext und erwartetes Ausgabeformat angeben.",
          },
          model: {
            label: "Modell",
            description:
              "Claude-Modell für diese Sitzung. Standard ist Sonnet (für die meisten Aufgaben empfohlen). Opus für komplexe Aufgaben, Haiku für schnelle/günstige Aufgaben.",
            options: {
              sonnet: "Sonnet 4.6 (empfohlen)",
              opus: "Opus 4.6 (bestes Denken)",
              haiku: "Haiku 4.5 (schnellstes)",
            },
          },
          maxBudgetUsd: {
            label: "Max. Budget (USD)",
            description:
              "Maximales Ausgabelimit in USD. Verhindert unkontrollierte Tool-Nutzungskosten. Weglassen für kein Limit.",
          },
          availableTools: {
            label: "Erlaubte Tools",
            description:
              "Kommagetrennte Liste erlaubter Tools (z.B. Read,Edit,Bash). Weglassen für alle Standard-Tools.",
          },
          taskTitle: {
            label: "Aufgabentitel",
            description:
              "Kurzer Titel zur Archivierung dieser Aufgabe. Wird automatisch aus dem Prompt generiert, wenn nicht angegeben.",
          },
          interactiveMode: {
            label: "Interaktiver Modus",
            description:
              "false (STANDARD): läuft headless und gibt die gesamte Ausgabe zurück. true: öffnet ein Terminal-Fenster für eine Live-Sitzung - das Ergebnis wird automatisch zurückgeliefert wenn die Sitzung endet.",
          },
          output: {
            label: "Ausgabe",
            description:
              "Kombinierter stdout des Claude Code-Prozesses. Leer wenn die Aufgabe in den Hintergrund verlagert wurde.",
          },
          durationMs: {
            label: "Dauer (ms)",
            description: "Gesamte Laufzeit des Prozesses.",
          },
          taskId: {
            label: "Aufgaben-ID",
            description:
              "Im interaktiven Modus: die Tracking-ID, die Claude Code beim Sitzungsende verwendet. Das Ergebnis wird automatisch zurückgeliefert. Im Batch-Modus: nicht vorhanden (Ergebnis inline zurückgegeben).",
          },
          hint: {
            label: "Hinweis",
            description: "Hinweis für die KI zur Lieferung des Ergebnisses.",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description:
              "Ungültige Anfrageparameter - Prompt und Felder prüfen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich - Admin-Rolle benötigt",
          },
          internal: {
            title: "Ausführung fehlgeschlagen",
            description:
              "Claude Code-Prozess konnte nicht gestartet werden oder ist abgestürzt",
          },
          internalExitCode: {
            title: "Ausführung fehlgeschlagen (exit {{exitCode}})",
            description:
              "Claude Code-Prozess wurde mit einem Fehler-Exit-Code beendet",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert - unzureichende Berechtigungen",
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
              "Ausführungskonflikt - möglicherweise läuft bereits eine Sitzung",
          },
        },
        success: {
          title: "Claude Code abgeschlossen",
          description:
            "Claude Code-Prozess erfolgreich beendet. Falls Ausgabe leer, wird das Ergebnis per Thread-Injektion geliefert.",
        },
        widget: {
          runningBatch: "Claude läuft...",
          runningInteractive: "Interaktive Terminal-Sitzung wird gestartet...",
          escalated:
            "Läuft im Hintergrund - Ergebnis wird injiziert wenn fertig.",
          taskIdLabel: "Aufgaben-ID",
          outputLabel: "Ausgabe",
          interactiveSessionLaunched:
            "Interaktive Sitzung im Terminal gestartet.",
          copyOutput: "Kopieren",
          copied: "Kopiert!",
        },
      },
    },
  },
};
