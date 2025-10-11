import type { translations as enTranslations } from "../en";

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

export const translations: typeof enTranslations = {
  category: "Lead-Verwaltung",
  tags: {
    leads: "Leads",
    batch: "Stapel",
    campaigns: "Kampagnen",
    management: "Verwaltung",
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
    },
    leadStatus: {
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Benutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      consultationBooked: "Beratung gebucht",
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
      personalApproach: "Persönlicher Ansatz",
      resultsFocused: "Ergebnisorientiert",
      personalResults: "Persönliche Ergebnisse",
    },
    emailJourneyVariantFilter: {
      all: "Alle",
      personalApproach: "Persönlicher Ansatz",
      resultsFocused: "Ergebnisorientiert",
      personalResults: "Persönliche Ergebnisse",
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
      consultationBooked: "Beratung gebucht",
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
};