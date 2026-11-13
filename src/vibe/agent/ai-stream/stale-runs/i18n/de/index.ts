import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Wartung",
  },
  post: {
    title: "Hängende Läufe aufräumen",
    titleShort: "Hängende Läufe",
    description:
      "Gibt Chats frei, die nach dem Absturz des schreibenden Prozesses auf 'streaming' hängen. Die Teilantwort bleibt erhalten und wird als unterbrochen markiert, wartende Nachrichten starten. Laufende Antworten auf jedem Knoten bleiben unangetastet.",
    container: {
      title: "Hängende Läufe aufräumen",
      description: "Hängende Chats anzeigen oder freigeben",
    },
    fields: {
      localThresholdMinutes: {
        label: "Lokale Schwelle (Min.)",
        description:
          "Lokalen Lauf freigeben, wenn sein Prozess so lange kein Lebenszeichen sendet",
      },
      remoteThresholdMinutes: {
        label: "Remote-Schwelle (Min.)",
        description:
          "Lauf auf einer anderen Instanz freigeben, wenn so lange nichts ankommt",
      },
      batchSize: {
        label: "Max. Chats",
        description: "Höchstzahl freigegebener Chats pro Durchlauf",
      },
      dryRun: {
        label: "Probelauf",
        description: "Hängende Chats auflisten, nichts ändern",
      },
    },
    response: {
      candidates: "Hängende Chats gefunden",
      reaped: "Chats freigegeben",
      lost: "Übersprungen: wieder aktiv",
      failed: "Fehlgeschlagen",
      queuedStarted: "Wartende Nachrichten gestartet",
      threadIds: "Chat-IDs",
      executionTimeMs: "Ausführungszeit (ms)",
    },
    success: {
      title: "Durchlauf fertig",
      description: "Hängende Chats freigegeben",
    },
  },
  interrupted: {
    content:
      "Der Server wurde während dieser Antwort neu gestartet. Die Teilantwort ist gespeichert. Erneut senden, um fortzufahren.",
  },
  errors: {
    failed: "Aufräumen hängender Läufe fehlgeschlagen: {{error}}",
    server: {
      title: "Aufräumfehler",
      description: "Das Aufräumen hängender Läufe ist fehlgeschlagen",
    },
  },
  task: {
    name: "Hängende Läufe aufräumen",
    description:
      "Alle 5 Minuten: gibt Chats frei, die ein mitten in der Antwort abgestürzter Prozess auf 'streaming' hinterlassen hat",
  },
};
