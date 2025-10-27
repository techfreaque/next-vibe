import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "TRPC-Validierung",
  description: "Validieren Sie die TRPC-Integration über Routendateien",
  category: "Generatoren",
  tags: {
    trpc: "tRPC",
    validation: "Validierung",
  },
  operations: {
    validateIntegration: "Integration validieren",
    validateRouteFile: "Routendatei validieren",
    generateReport: "Bericht generieren",
    fixRoutes: "Routen reparieren",
    checkRouterExists: "Router existiert prüfen",
  },
  severity: {
    error: "Fehler",
    warning: "Warnung",
    info: "Info",
  },
  success: {
    title: "TRPC-Validierung erfolgreich",
    description: "TRPC-Validierung erfolgreich abgeschlossen",
  },
  errors: {
    validation: {
      title: "Validierung fehlgeschlagen",
      description: "TRPC-Validierung fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, diese Aktion auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Sie haben keine Berechtigung, diese Aktion auszuführen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten",
    },
    executionFailed: {
      title: "Ausführung fehlgeschlagen",
      description: "TRPC-Validierungsvorgang fehlgeschlagen",
    },
  },
};
