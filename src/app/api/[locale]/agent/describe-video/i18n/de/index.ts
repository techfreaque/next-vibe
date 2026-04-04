// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    video: "Video",
    vision: "Vision",
    ai: "KI",
  },
  post: {
    title: "Video beschreiben",
    dynamicTitle: "Beschreiben: {{filename}}",
    description: "Beschreibe den Inhalt eines Videos mit einem KI-Modell",
    fileUrl: {
      label: "Video-URL",
      description: "URL des zu beschreibenden Videos",
    },
    context: {
      label: "Kontext",
      description: "Optionaler Kontext zur Steuerung der Beschreibung",
      placeholder: "Beschreibe dieses Video mit Fokus auf...",
    },
    submitButton: {
      label: "Video beschreiben",
      loadingText: "Beschreibe...",
    },
    response: {
      text: "Beschreibung",
      model: "Verwendetes Modell",
      creditCost: "Verwendete Credits",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Bitte gib eine gültige Video-URL an",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Vision-Dienst fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Bitte melde dich an",
      },
      forbidden: {
        title: "Verboten",
        description: "Du hast keine Berechtigung",
      },
      not_found: {
        title: "Nicht gefunden",
        description: "Das Video wurde nicht gefunden",
      },
      server_error: {
        title: "Serverfehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unknown_error: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved_changes: {
        title: "Nicht gespeicherte Änderungen",
        description: "Bitte speichere deine Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      noVisionModel: "Kein Video-Vision-Modell konfiguriert",
      descriptionFailed: "Videobeschreibung fehlgeschlagen",
      insufficientCredits:
        "Nicht genug Credits. Guthaben: {{balance}}, erforderlich: {{minimum}}",
      balanceCheckFailed: "Kontostand konnte nicht geprüft werden",
      creditsFailed: "Credits konnten nicht abgezogen werden",
    },
    success: {
      title: "Video beschrieben",
      description: "Das Video wurde erfolgreich beschrieben",
    },
  },
} as const;
