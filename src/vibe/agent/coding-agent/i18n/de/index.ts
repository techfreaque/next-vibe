import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Inaktiv",
  running: "Läuft",
  completed: "Abgeschlossen",
  interrupted: "Unterbrochen",
  failed: "Fehlgeschlagen",
  "read-only": "Schreibgeschützt",
  "workspace-write": "Schreibzugriff im Projekt",
  "danger-full-access": "Vollzugriff",
  codingAgent: {
    tags: {
      tasks: "Aufgaben",
    },
    run: {
      post: {
        title: "Coding-Agent ausführen",
        titleShort: "Coding-Agent",
        dynamicTitle: "Coding-Agent: {{prompt}}",
        description:
          "Führt eine Coding-Agent-Aufgabe über Claude Code, OpenCode, Codex oder Antigravity aus. Mit einem Namen bleiben Gespräche erhalten und lassen sich im Lauf steuern; mit interactiveMode=true öffnet sich ein Live-Terminal.",
        fields: {
          name: {
            label: "Agentenname",
            description:
              "Optionaler dauerhafter Name (1 bis 40 Buchstaben, Ziffern, Binde- oder Unterstriche). Derselbe Name setzt das Gespräch fort.",
          },
          prompt: {
            label: "Aufgabe",
            description:
              "Aufgabe oder Frage für den Coding-Agent. Dateipfade, Kontext und erwartete Prüfung angeben.",
          },
          promptFile: {
            label: "Aufgabendatei",
            description:
              "Pfad zu einer Aufgabendatei relativ zum Arbeitsverzeichnis. Alternative zum direkten Prompt.",
          },
          provider: {
            label: "Anbieter",
            description:
              "Welches CLI genutzt wird: claude-code, open-code, codex oder antigravity. Standard ist codex für neue benannte Agenten und claude-code für unbenannte Läufe.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Modell",
            description:
              "Modell-ID des Anbieters. Leer lassen für Standard (Antigravity nutzt Gemini 4 Neon High; Codex nutzt gpt-6.2-sol).",
          },
          effort: {
            label: "Denktiefe",
            description:
              "Denktiefe für Codex oder Antigravity (z. B. low, medium, high).",
          },
          sandbox: {
            label: "Codex-Sandbox",
            description:
              "Dateisystem-Sandbox für Codex (read-only, workspace-write oder danger-full-access).",
          },
          cwd: {
            label: "Arbeitsverzeichnis",
            description:
              "Verzeichnis, in dem der Agent arbeitet. Standard ist das aktuelle Verzeichnis.",
          },
          fresh: {
            label: "Neu starten",
            description:
              "Neues Gespräch beginnen, statt den gespeicherten Verlauf dieses Agenten fortzusetzen.",
          },
          taskTitle: {
            label: "Aufgabentitel",
            description:
              "Kurzer Titel zur Archivierung. Wird automatisch aus der Aufgabe erzeugt, falls leer.",
          },
          interactiveMode: {
            label: "Interaktiver Modus",
            description:
              "false (STANDARD): läuft headless und liefert die Ausgabe zurück. true: öffnet ein Terminal-Fenster für eine Live-Sitzung.",
          },
          output: {
            label: "Ausgabe",
            description:
              "Antwort oder kombinierter stdout des Coding-Agents. Leer, wenn im Hintergrund gestartet.",
          },
          durationMs: {
            label: "Dauer (ms)",
            description: "Gesamte Laufzeit des Prozesses.",
          },
          threadId: {
            label: "Gesprächs-ID",
            description:
              "Gespeicherte Thread- oder Sitzungs-ID zum Fortsetzen eines benannten Agenten.",
          },
          status: {
            label: "Status",
            description: "Ergebnis des Agenten-Durchlaufs.",
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
              "Ungültige Eingabe. Agentenname, Aufgabe und Optionen prüfen.",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Anmeldung erforderlich. Admin-Konto oder CLI-Anmeldung prüfen.",
          },
          internal: {
            title: "Ausführung fehlgeschlagen",
            description:
              "Coding-Agent-Prozess konnte nicht gestartet werden oder ist abgestürzt.",
          },
          binaryMissing: {
            title:
              "{{bin}} ist auf dieser Instanz nicht installiert. Installieren oder anderen Anbieter wählen.",
            description:
              "Die CLI des Coding-Agents liegt nicht im PATH dieses Servers.",
          },
          internalExitCode: {
            title: "Ausführung fehlgeschlagen (Exit {{exitCode}})",
            description:
              "Coding-Agent-Prozess wurde mit einem Fehlercode beendet.",
          },
          forbidden: {
            title: "Verboten",
            description:
              "Zugriff verweigert. Berechtigungen beim Anbieter prüfen.",
          },
          notFound: {
            title: "Nicht gefunden",
            description:
              "Agent, Aufgabendatei oder Arbeitsverzeichnis nicht gefunden.",
          },
          vibeCoderRedirect: {
            title: "Stattdessen ai-run mit vibe-coder verwenden",
            description:
              "Coding-Agent ist auf vibe-coder gesetzt. Verwende das ai-run-Tool mit dem vibe-coder-Skill.",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Anbieter oder Coding-Agent ist derzeit nicht erreichbar.",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Unerwarteter Fehler während der Ausführung.",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Konflikt durch ungespeicherte Änderungen erkannt.",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Unter diesem Namen läuft bereits ein Agent, oder das gespeicherte Gespräch nutzt einen anderen Anbieter.",
          },
          detail: "Agentenaktion fehlgeschlagen: {{detail}}",
        },
        backButton: {
          label: "Zurück",
        },
        submitButton: {
          label: "Starten",
          loadingText: "Läuft...",
        },
        success: {
          title: "Coding-Agent abgeschlossen",
          description:
            "Coding-Agent erfolgreich beendet. Falls die Ausgabe leer ist, wird das Ergebnis im Thread nachgeliefert.",
        },
        widget: {
          runningBatch: "Läuft...",
          runningInteractive: "Interaktive Terminal-Sitzung wird gestartet...",
          escalated:
            "Läuft im Hintergrund. Das Ergebnis wird nach Abschluss geliefert.",
          taskIdLabel: "Aufgaben-ID",
          outputLabel: "Ausgabe",
          interactiveSessionLaunched:
            "Interaktive Sitzung im Terminal gestartet.",
          copyOutput: "Kopieren",
          copied: "Kopiert!",
          interactive: "Interaktiv",
          emptyPromptHint: "Prompt eingeben, um den Coding-Agent zu starten",
          agentNamePlaceholder: "Agentenname (optional)",
        },
      },
    },
    say: {
      post: {
        title: "Coding-Agent steuern",
        titleShort: "Agent steuern",
        description:
          "Sendet eine Nachricht direkt an einen laufenden Codex- oder Antigravity-Agenten. Nach Abschluss mit demselben Namen in coding-agent fortfahren.",
        success: {
          title: "Nachricht zugestellt",
          description:
            "Steuerungsnachricht an den laufenden Agenten übergeben.",
        },
        fields: {
          message: {
            label: "Nachricht",
            description: "Anweisung für den laufenden Durchlauf.",
          },
          messageFile: {
            label: "Nachrichtendatei",
            description:
              "Pfad zu einer Datei mit der Nachricht, relativ zum Arbeitsverzeichnis.",
          },
          delivered: {
            label: "Zugestellt",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Coding-Agent unterbrechen",
        titleShort: "Agent unterbrechen",
        description:
          "Stoppt den aktiven Durchlauf eines Codex- oder Antigravity-Agenten. Mit demselben Namen lässt sich das Gespräch später fortsetzen.",
        success: {
          title: "Unterbrechung angefordert",
          description: "Unterbrechungssignal an den Coding-Agent übermittelt.",
        },
        fields: {
          interrupted: {
            label: "Unterbrechung gesendet",
          },
          noInterrupt: {
            label: "Kein laufender Durchlauf",
          },
        },
      },
    },
    list: {
      post: {
        title: "Coding-Agenten anzeigen",
        titleShort: "Agenten anzeigen",
        description:
          "Zeigt laufende und gespeicherte Coding-Agenten an. Mit einem Namen erscheinen Status, letzte Protokollzeilen und letzte Antwort.",
        success: {
          title: "Agenten geladen",
          description: "Aktive und gespeicherte Coding-Agenten geladen.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agenten",
          },
          noAgents: {
            label: "Noch keine dauerhaften Coding-Agenten.",
          },
          lines: {
            label: "Protokollzeilen",
            description:
              "Anzahl der letzten Protokollzeilen bei der Abfrage eines einzelnen Agenten.",
          },
          tail: {
            label: "Letzte Protokollzeilen",
          },
          emptyTail: {
            label: "Das Protokoll ist leer.",
          },
          lastMessage: {
            label: "Letzte Antwort",
          },
          lastError: {
            label: "Letzter Fehler",
          },
          startedAt: {
            label: "Startzeit",
          },
          finishedAt: {
            label: "Endzeit",
          },
        },
      },
    },
  },
};
