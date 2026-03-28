import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  codingAgent: {
    tags: {
      tasks: "Aufgaben",
    },
    run: {
      post: {
        title: "Coding-Agent ausführen",
        dynamicTitle: "Coding-Agent: {{prompt}}",
        description:
          "Führt eine Coding-Agent-Aufgabe aus. Batch-Modus (STANDARD): läuft headless und gibt die Ausgabe zurück. Interaktiver Modus: öffnet eine Live-Terminal-Sitzung.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Die Aufgabe oder Frage für den Coding-Agent. Spezifisch sein - Dateipfade, Kontext und erwartetes Ausgabeformat angeben.",
          },
          provider: {
            label: "Anbieter",
            description:
              "Welcher Coding-Agent-CLI verwendet wird. claude-code nutzt das Claude CLI; open-code nutzt das OpenCode CLI.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Modell",
            description:
              "Zu verwendendes Modell. Für Claude Code: Modell-ID. Für OpenCode: provider/modell. Leer lassen für Standard.",
          },
          taskTitle: {
            label: "Aufgabentitel",
            description:
              "Kurzer Titel zur Archivierung. Wird automatisch aus dem Prompt generiert, wenn nicht angegeben.",
          },
          interactiveMode: {
            label: "Interaktiver Modus",
            description:
              "false (STANDARD): läuft headless. true: öffnet ein Terminal-Fenster für eine Live-Sitzung.",
          },
          output: {
            label: "Ausgabe",
            description:
              "Kombinierter stdout des Coding-Agent-Prozesses. Leer wenn in den Hintergrund verlagert.",
          },
          durationMs: {
            label: "Dauer (ms)",
            description: "Gesamte Laufzeit des Prozesses.",
          },
          taskId: {
            label: "Aufgaben-ID",
            description:
              "Im interaktiven Modus: die Tracking-ID. Das Ergebnis wird automatisch zurückgeliefert.",
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
              "Coding-Agent-Prozess konnte nicht gestartet werden oder ist abgestürzt",
          },
          internalExitCode: {
            title: "Ausführung fehlgeschlagen (exit {{exitCode}})",
            description:
              "Coding-Agent-Prozess wurde mit einem Fehler-Exit-Code beendet",
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
            description:
              "Netzwerkfehler bei der Kommunikation mit dem Coding-Agent",
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
          title: "Coding-Agent abgeschlossen",
          description:
            "Coding-Agent-Prozess erfolgreich beendet. Falls Ausgabe leer, wird das Ergebnis per Thread-Injektion geliefert.",
        },
        widget: {
          runningBatch: "Läuft...",
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
