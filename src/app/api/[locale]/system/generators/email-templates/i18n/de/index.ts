export const translations = {
  post: {
    title: "E-Mail-Vorlagen generieren",
    description: "E-Mail-Vorlagen-Registry mit Lazy Loading generieren",
    container: {
      title: "E-Mail-Vorlagen-Generator-Konfiguration",
    },
    success: {
      title: "Generierung abgeschlossen",
      description: "E-Mail-Vorlagen erfolgreich generiert",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to generated registry file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing files",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Result Message",
      },
      templatesFound: {
        title: "Templates Found",
      },
      duration: {
        title: "Generation Duration (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige E-Mail-Vorlagen-Generator-Parameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler während der Vorlagengenerierung",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Vorlagen zu generieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Vorlagengenerierung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Vorlagenverzeichnis nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "E-Mail-Vorlagen konnten nicht generiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während der Generierung aufgetreten",
      },
    },
  },
  success: {
    generated: "Email template registry generated successfully",
  },
};
