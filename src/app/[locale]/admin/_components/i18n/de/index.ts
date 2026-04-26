import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  navigation: {
    dashboard: "Dashboard",
    leadManagement: "Lead-Management",
    emailCampaigns: "E-Mail-Kampagnen",
    users: "Benutzer",
    emails: "Messenger",
    cronTasks: "Hintergrundaufgaben",
    sshAccess: "SSH / Maschine",
    remoteConnections: "Fernverbindungen",
    vibeSense: "Vibe Sense",
    endpoints: "Endpunkte",
    vibeFrame: "Vibe Frame",
    memories: "Erinnerungen",
    errorMonitor: "Fehlerüberwachung",
    skillsModeration: "Skills-Moderation",
    referralPayouts: "Empfehlungsauszahlungen",
    support: "Support-Warteschlange",
    settings: "Einstellungen",
    admin: "Admin",
    adminPanel: "Admin-Panel",
    administrator: "Administrator",
    adminDashboard: "Admin-Dashboard",
    backToApp: "Zurück zur App",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
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
};
