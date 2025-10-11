import { translations as statusTranslations } from "../../status/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main onboarding route translations - typed from English
  get: {
    title: "Onboarding-Status abrufen",
    description: "Aktuelle Benutzer-Onboarding-Informationen abrufen",
    form: {
      title: "Onboarding-Informationen",
      description: "Sehen Sie Ihren aktuellen Onboarding-Fortschritt",
    },
    response: {
      title: "Onboarding-Antwort",
      description: "Aktueller Onboarding-Status und Fortschritt",
      userId: {
        content: "Benutzer-ID",
      },
      completedSteps: {
        content: "Abgeschlossene Schritte",
      },
      currentStep: {
        content: "Aktueller Schritt",
      },
      isCompleted: {
        content: "Ist abgeschlossen",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  post: {
    title: "Onboarding aktualisieren",
    description: "Benutzer-Onboarding-Informationen aktualisieren",
    form: {
      title: "Onboarding aktualisieren",
      description: "Aktualisieren Sie Ihren Onboarding-Fortschritt",
    },
    completedSteps: {
      label: "Abgeschlossene Schritte",
      description: "Schritte, die abgeschlossen wurden",
      placeholder: "Abgeschlossene Schritte auswählen",
    },
    currentStep: {
      label: "Aktueller Schritt",
      description: "Aktueller Schritt im Onboarding-Prozess",
      placeholder: "Aktuellen Schritt auswählen",
    },
    isCompleted: {
      label: "Ist abgeschlossen",
      description: "Ob das Onboarding abgeschlossen ist",
    },
    response: {
      title: "Update-Antwort",
      description: "Onboarding-Update-Antwort",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Onboarding erfolgreich aktualisiert",
    },
  },
  put: {
    title: "Onboarding abschließen",
    description: "Den Benutzer-Onboarding-Prozess abschließen",
    form: {
      title: "Onboarding abschließen",
      description: "Finalisieren Sie Ihren Onboarding-Fortschritt",
    },
    completedSteps: {
      label: "Abgeschlossene Schritte",
      description: "Alle Schritte, die abgeschlossen wurden",
      placeholder: "Abgeschlossene Schritte auswählen",
    },
    currentStep: {
      label: "Aktueller Schritt",
      description: "Letzter Schritt im Onboarding-Prozess",
      placeholder: "Aktuellen Schritt auswählen",
    },
    isCompleted: {
      label: "Ist abgeschlossen",
      description: "Onboarding als abgeschlossen markieren",
    },
    response: {
      title: "Abschluss-Antwort",
      description: "Onboarding-Abschluss-Antwort",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Onboarding erfolgreich abgeschlossen",
    },
  },
  category: "Onboarding",
  tags: {
    onboarding: "onboarding",
    status: "status",
    update: "update",
  },
  enums: {
    onboardingStatus: {
      notStarted: "Nicht begonnen",
      inProgress: "In Bearbeitung",
      completed: "Abgeschlossen",
      skipped: "Übersprungen",
    },
    onboardingStep: {
      questions: "Fragen",
      pricing: "Preise",
      consultation: "Beratung",
      complete: "Abschließen",
    },
    businessType: {
      startup: "Startup",
      smallBusiness: "Kleines Unternehmen",
      mediumBusiness: "Mittleres Unternehmen",
      enterprise: "Großunternehmen",
      agency: "Agentur",
      freelancer: "Freiberufler",
      nonProfit: "Gemeinnützig",
      other: "Andere",
    },
    goalType: {
      brandAwareness: "Markenbekanntheit",
      leadGeneration: "Lead-Generierung",
      customerEngagement: "Kundenbindung",
      salesGrowth: "Umsatzwachstum",
      contentCreation: "Content-Erstellung",
      communityBuilding: "Community-Aufbau",
      reputationManagement: "Reputationsmanagement",
      analyticsInsights: "Analytics-Einblicke",
    },
    completedStep: {
      businessData: "Geschäftsdaten",
      planSelection: "Plan-Auswahl",
      consultation: "Beratung",
    },
  },

  // Global error translations referenced in repository
  errors: {
    authenticationRequired: {
      title: "Authentifizierung erforderlich",
      description:
        "Sie müssen authentifiziert sein, um auf diese Ressource zuzugreifen",
    },
    dataFetchFailed: {
      title: "Datenabruf fehlgeschlagen",
      description: "Fehler beim Abrufen der Onboarding-Daten aus der Datenbank",
    },
    unauthorized: {
      title: "Nicht autorisierter Zugriff",
      description:
        "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
    },
    unexpected: {
      title: "Unerwarteter Fehler",
      description:
        "Ein unerwarteter Fehler ist bei der Verarbeitung Ihrer Anfrage aufgetreten",
    },
    notFound: {
      title: "Onboarding nicht gefunden",
      description: "Kein Onboarding-Datensatz für diesen Benutzer gefunden",
    },
    paymentProcessingFailed: {
      title: "Zahlungsverarbeitung fehlgeschlagen",
      description:
        "Fehler bei der Zahlungsverarbeitung während des Onboardings",
    },
    paymentUrlMissing: {
      title: "Zahlungs-URL fehlt",
      description:
        "Zahlungs-URL wurde nicht vom Zahlungsabwickler bereitgestellt",
    },
    consultationRequestFailed: {
      title: "Beratungsanfrage fehlgeschlagen",
      description:
        "Fehler beim Erstellen der Beratungsanfrage während des Onboardings",
    },
  },

  // Sub-routes
  status: statusTranslations,
};
