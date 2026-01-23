import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Page metadata
  title: "Leads-Statistiken",
  description:
    "Ansicht und Analyse von Lead-Statistiken und Leistungskennzahlen",
  filter: "Filtern",
  refresh: "Aktualisieren",

  // UI Component translations
  totalLeads: "Gesamt Leads",
  newThisMonth: "Neu diesen Monat",
  activeLeads: "Aktive Leads",
  ofTotal: "von gesamt",
  conversionRate: "Konversionsrate",
  convertedLeads: "Konvertierte Leads",
  emailEngagement: "E-Mail-Engagement",
  emailsSent: "Gesendete E-Mails",
  bookingRate: "Buchungsrate",
  dataCompleteness: "Datenvollständigkeit",
  profileCompleteness: "Profilvollständigkeit",
  leadVelocity: "Lead-Geschwindigkeit",
  leadsPerDay: "Leads pro Tag",
  signedUpLeads: "Angemeldete Leads",
  signupRate: "Anmelderate",
  subscriptionConfirmedLeads: "Abonnement bestätigte Leads",
  confirmationRate: "Bestätigungsrate",
  unsubscribedLeads: "Abgemeldete Leads",
  bouncedLeads: "Zurückgewiesene Leads",
  invalidLeads: "Ungültige Leads",
  leadsWithEmailEngagement: "Leads mit E-Mail-Engagement",
  leadsWithoutEmailEngagement: "Leads ohne E-Mail-Engagement",
  averageEmailEngagementScore: "Durchschnittlicher E-Mail-Engagement-Score",
  engagementScore: "Engagement-Score",
  totalEmailEngagements: "Gesamt E-Mail-Engagements",
  totalEngagements: "Gesamt Engagements",
  todayActivity: "Heutige Aktivität",
  leadsCreatedToday: "Heute erstellte Leads",
  leadsUpdatedToday: "Heute aktualisierte Leads",
  weekActivity: "Aktivität dieser Woche",
  leadsCreatedThisWeek: "Diese Woche erstellte Leads",
  leadsUpdatedThisWeek: "Diese Woche aktualisierte Leads",
  monthActivity: "Aktivität dieses Monats",
  leadsCreatedThisMonth: "Diesen Monat erstellte Leads",
  leadsUpdatedThisMonth: "Diesen Monat aktualisierte Leads",
  metrics: {
    campaign_running_leads: "Kampagne laufende Leads",
    website_user_leads: "Website-Benutzer Leads",
    newsletter_subscriber_leads: "Newsletter-Abonnenten Leads",
  },

  // API endpoint translations
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
