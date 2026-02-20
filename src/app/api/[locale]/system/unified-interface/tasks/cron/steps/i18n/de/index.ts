export const translations = {
  put: {
    title: "Aufgaben-Schritte bearbeiten",
    description: "Schrittfolge für eine Cron-Steps-Aufgabe aktualisieren",
    container: {
      title: "Schritt-Editor",
      description:
        "Definieren Sie die geordnete Liste der Schritte, die diese Aufgabe ausführt",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der Aufgabe",
      },
      steps: {
        label: "Schritte (JSON)",
        description:
          "Array von Schritt-Definitionen. Jeder Schritt muss einen 'type' von 'call' oder 'ai_agent' haben.",
        placeholder: '[{"type":"call","routeId":"meine-route","args":{}}]',
      },
    },
    response: {
      task: {
        title: "Aktualisierte Aufgabe",
      },
      success: {
        title: "Erfolg",
      },
    },
    submitButton: {
      label: "Schritte speichern",
      loadingText: "Wird gespeichert...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Schritt-Konfiguration ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Aufgabe zu aktualisieren",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description:
          "Die zu aktualisierende Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Beim Speichern der Schritte ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Aufgabe zu aktualisieren",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Beim Aktualisieren der Aufgabe ist ein Konflikt aufgetreten",
      },
    },
    success: {
      updated: {
        title: "Schritte gespeichert",
        description: "Aufgaben-Schritte erfolgreich aktualisiert",
      },
    },
  },
  widget: {
    noSteps: "Keine Schritte konfiguriert",
    addStep: "Schritt hinzufügen",
    removeStep: "Schritt entfernen",
    stepType: "Schritt-Typ",
    call: "Aufruf",
    aiAgent: "KI-Agent",
    routeId: "Route-ID",
    args: "Argumente",
    model: "Modell",
    character: "Charakter",
    prompt: "Prompt",
    threadMode: "Thread-Modus",
    maxTurns: "Max. Runden",
    parallel: "Parallel ausführen",
  },
};
