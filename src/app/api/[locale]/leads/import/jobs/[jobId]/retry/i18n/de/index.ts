import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Import-Job wiederholen",
    description: "Einen fehlgeschlagenen Import-Job wiederholen",
    jobId: {
      label: "Job-ID",
      description: "Eindeutige Kennung für den zu wiederholenden Import-Job",
    },
    form: {
      title: "Import-Job wiederholen",
      description: "Den fehlgeschlagenen Import-Job wiederholen",
    },
    response: {
      title: "Wiederholungsergebnis",
      description: "Ergebnis der Wiederholungsoperation",
      success: {
        content: "Erfolgsstatus",
      },
      message: {
        content: "Wiederholungsnachricht",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Job-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich, um Jobs zu wiederholen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Job zu wiederholen",
      },
      notFound: {
        title: "Job nicht gefunden",
        description: "Kein Import-Job mit der angegebenen ID gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Wiederholen des Jobs ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Wiederholungskonflikt",
        description: "Job kann nicht wiederholt werden, während er verarbeitet wird",
      },
    },
    success: {
      title: "Erfolg",
      description: "Import-Job erfolgreich wiederholt",
    },
  },
};
