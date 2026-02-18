import { translations as batchTranslations } from "../../batch/i18n/de";
import { translations as campaignsTranslations } from "../../campaigns/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as exportTranslations } from "../../export/i18n/de";
import { translations as importTranslations } from "../../import/i18n/de";
import { translations as leadTranslations } from "../../lead/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as searchTranslations } from "../../search/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import { translations as trackingTranslations } from "../../tracking/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Lead-Verwaltung",
  tags: {
    leads: "Leads",
    batch: "Stapel",
    campaigns: "Kampagnen",
    management: "Verwaltung",
    create: "Erstellen",
    search: "Suchen",
    export: "Exportieren",
    import: "Importieren",
    csv: "CSV",
    jobs: "Jobs",
    list: "Liste",
  },
  auth: {
    public: {
      validCookie: "Gültiger Cookie-Lead gefunden",
      invalidCookie: "Ungültiger Cookie-Lead",
      created: "Anonymer Lead erstellt",
      error: "Fehler bei öffentlicher Lead-Authentifizierung",
    },
    authenticated: {
      primaryFound: "Primärer Lead für Benutzer gefunden",
      noPrimary: "Kein primärer Lead für Benutzer gefunden",
      error: "Fehler bei authentifizierter Lead-Authentifizierung",
    },
    link: {
      alreadyExists: "Lead-Verknüpfung existiert bereits",
      created: "Lead-Verknüpfung erstellt",
      error: "Fehler beim Verknüpfen von Leads",
    },
    validate: {
      error: "Fehler bei Lead-Validierung",
    },
    getOrCreate: {
      invalid: "Ungültige Lead-ID",
      error: "Fehler beim Abrufen oder Erstellen von Lead",
    },
    create: {
      existingFound: "Bestehender anonymer Lead gefunden",
      success: "Lead erfolgreich erstellt",
      error: "Fehler beim Erstellen von Lead",
    },
    createForUser: {
      success: "Lead für Benutzer erstellt",
      error: "Fehler beim Erstellen von Lead für Benutzer",
    },
    cookie: {
      set: "Lead-Cookie gesetzt",
      error: "Fehler beim Setzen von Lead-Cookie",
    },
    getUserLeads: {
      error: "Fehler beim Abrufen von Benutzer-Leads",
    },
    linkLeads: {
      sameId: "Lead kann nicht mit sich selbst verknüpft werden",
      alreadyExists: "Lead-Verknüpfung existiert bereits",
      created: "Leads erfolgreich verknüpft",
      error: "Fehler beim Verknüpfen von Leads",
    },
    getLinkedLeads: {
      error: "Fehler beim Abrufen verknüpfter Leads",
    },
    getAllLinkedLeads: {
      error: "Fehler beim Abrufen aller verknüpften Leads",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Lead kann nicht mit sich selbst verknüpft werden",
    linkFailed: "Fehler beim Verknüpfen der Leads",
  },
  batch: batchTranslations,
  campaigns: campaignsTranslations,
  create: createTranslations,
  export: exportTranslations,
  import: importTranslations,
  lead: leadTranslations,
  list: listTranslations,
  search: searchTranslations,
  stats: statsTranslations,
  tracking: trackingTranslations,
  enums: {
    engagementTypes: {
      emailOpen: "E-Mail geöffnet",
      emailClick: "E-Mail geklickt",
      websiteVisit: "Website-Besuch",
      formSubmit: "Formular abgeschickt",
      leadAttribution: "Lead-Zuordnung",
    },
    leadStatus: {
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Benutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      subscriptionConfirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Unzustellbar",
      invalid: "Ungültig",
    },
    emailCampaignStage: {
      notStarted: "Nicht gestartet",
      initial: "Erster Kontakt",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    emailStatus: {
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      bounced: "Unzustellbar",
      failed: "Fehlgeschlagen",
      unsubscribed: "Abgemeldet",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
    },
    emailJourneyVariantFilter: {
      all: "Alle",
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    leadSortField: {
      email: "E-Mail",
      businessName: "Firmenname",
      createdAt: "Erstellungsdatum",
      updatedAt: "Aktualisierungsdatum",
      lastEngagementAt: "Letztes Engagement",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead erstellt",
      leadUpdated: "Lead aktualisiert",
      emailSent: "E-Mail gesendet",
      emailOpened: "E-Mail geöffnet",
      emailClicked: "E-Mail geklickt",
      leadConverted: "Lead konvertiert",
      leadUnsubscribed: "Lead abgemeldet",
    },
    userAssociation: {
      withUser: "Mit Benutzer",
      withLead: "Mit Lead",
      standalone: "Eigenständig",
      withBoth: "Mit beiden",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
      api: "API",
    },
    leadStatusFilter: {
      all: "Alle",
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Benutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      subscriptionConfirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Unzustellbar",
      invalid: "Ungültig",
    },
    emailCampaignStageFilter: {
      all: "Alle",
      notStarted: "Nicht gestartet",
      initial: "Erster Kontakt",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    leadSourceFilter: {
      all: "Alle",
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
      api: "API",
    },
    batchOperationScope: {
      currentPage: "Aktuelle Seite",
      allPages: "Alle Seiten",
    },
    country: {
      de: "Deutschland",
      pl: "Polen",
      global: "Global",
    },
    language: {
      de: "Deutsch",
      pl: "Polnisch",
      en: "Englisch",
    },
  },
  error: {
    general: {
      internal_server_error: "Interner Serverfehler",
      not_found: "Nicht gefunden",
      unauthorized: "Nicht autorisiert",
      forbidden: "Verboten",
      bad_request: "Ungültige Anfrage",
      validation_error: "Validierungsfehler",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Ungültige Batch-Aktualisierungsanfrage",
          },
          server: {
            title: "Serverfehler beim Batch-Update von Leads",
          },
          default: "Fehler beim Batch-Update von Leads",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Serverfehler beim Abrufen der Leads",
          },
          not_found: {
            title: "Leads nicht gefunden",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead mit dieser E-Mail existiert bereits",
          },
          server: {
            title: "Serverfehler beim Erstellen des Leads",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Aktualisieren des Leads",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        error: {
          validation: {
            title: "Ungültige Abmeldeanfrage",
          },
          server: {
            title: "Serverfehler bei der Verarbeitung der Abmeldung",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Ungültige Engagement-Daten",
          },
          server: {
            title: "Serverfehler bei der Aufzeichnung des Engagements",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Serverfehler beim Exportieren der Leads",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Serverfehler bei der Verarbeitung der Kampagne",
          },
        },
      },
    },
  },
};
