import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Import-Job stoppen",
    description: "Einen laufenden Import-Job stoppen",
    jobId: {
      label: "Job-ID",
      description: "Eindeutige Kennung für den zu stoppenden Import-Job",
    },
    form: {
      title: "Import-Job stoppen",
      description: "Den laufenden Import-Job stoppen",
    },
    response: {
      title: "Stoppergebnis",
      description: "Ergebnis der Stoppoperation",
      success: {
        content: "Erfolgsstatus",
      },
      message: {
        content: "Stoppnachricht",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Job-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich, um Jobs zu stoppen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Job zu stoppen",
      },
      notFound: {
        title: "Job nicht gefunden",
        description: "Kein Import-Job mit der angegebenen ID gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Stoppen des Jobs ist ein Fehler aufgetreten",
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
        title: "Stoppkonflikt",
        description:
          "Job kann nicht gestoppt werden, wenn er nicht verarbeitet wird",
      },
    },
    success: {
      title: "Erfolg",
      description: "Import-Job erfolgreich gestoppt",
    },
  },
  widget: {
    title: "Import-Job stoppen",
    successMessage: "Job erfolgreich gestoppt",
  },
};
