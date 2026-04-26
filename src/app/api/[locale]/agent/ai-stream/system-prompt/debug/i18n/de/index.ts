export const translations = {
  get: {
    title: "System-Prompt Debug",
    description:
      "Zeigt den vollständigen System-Prompt für einen gegebenen Nutzerkontext. Nur für Admins/Dev.",
    status: {
      loading: "Erstellt...",
      done: "Fertig",
    },
    tags: {
      debug: "Debug",
    },
    fields: {
      rootFolderId: {
        label: "Root-Ordner",
        description:
          "Ordnerkontext simulieren (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
      },
      userRole: {
        label: "Nutzerrolle",
        description: "Simulierte Nutzerrolle: public | customer | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "Nutzer-Nachricht",
        description: "Simulierte Nachricht für Cortex-Embedding-Suche",
        placeholder: "Was haben wir zuletzt besprochen?",
      },
      threadId: {
        label: "Thread-ID",
        description: "Optionale Thread-ID für Kontext",
        placeholder: "UUID oder leer lassen",
      },
      userId: {
        label: "Nutzer-ID",
        description:
          "Optionale Nutzer-ID für Cortex-Daten (Standard: eigener Account)",
        placeholder: "UUID oder leer lassen",
      },
      skillId: {
        label: "Skill-ID",
        description: "Optionale Skill-ID für den System-Prompt",
        placeholder: "Skill-UUID oder leer lassen",
      },
      subFolderId: {
        label: "Unterordner-ID",
        description: "Optionale Unterordner-UUID",
        placeholder: "UUID oder leer lassen",
      },
    },
    response: {
      systemPrompt: { text: "System-Prompt" },
      trailingSystemMessage: { text: "Trailing-Kontext" },
      charCount: { text: "Zeichen" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Cortex Embedding-Diagnose" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Parameter prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: {
        title: "Nicht eingeloggt",
        description: "Zuerst anmelden",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Admin-Zugang erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nutzer oder Ressource fehlt",
      },
      server: {
        title: "Server-Fehler",
        description: "Prompt konnte nicht erstellt werden",
      },
      unknown: { title: "Fehler", description: "Etwas ist schiefgelaufen" },
      unsavedChanges: {
        title: "Ungespeichert",
        description: "Speichern oder verwerfen",
      },
      conflict: { title: "Konflikt", description: "Inkonsistenter Zustand" },
    },
    success: {
      title: "Prompt erstellt",
      description: "System-Prompt erfolgreich gerendert",
    },
  },
};
