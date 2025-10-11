import type { translations as enTranslations } from "../en";

import { translations as batchTranslations } from "../../batch/i18n/pl";
import { translations as campaignsTranslations } from "../../campaigns/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as exportTranslations } from "../../export/i18n/pl";
import { translations as importTranslations } from "../../import/i18n/pl";
import { translations as leadTranslations } from "../../lead/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as searchTranslations } from "../../search/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import { translations as trackingTranslations } from "../../tracking/i18n/pl";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Leadami",
  tags: {
    leads: "Leady",
    batch: "Wsadowe",
    campaigns: "Kampanie",
    management: "Zarządzanie",
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
      emailOpen: "E-mail otwarty",
      emailClick: "E-mail kliknięty",
      websiteVisit: "Wizyta na stronie",
      formSubmit: "Wysłanie formularza",
    },
    leadStatus: {
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania w toku",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      consultationBooked: "Konsultacja zarezerwowana",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Niedostarczony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    emailStatus: {
      pending: "Oczekujący",
      sent: "Wysłany",
      delivered: "Dostarczony",
      opened: "Otwarty",
      clicked: "Kliknięty",
      bounced: "Niedostarczony",
      failed: "Nieudany",
      unsubscribed: "Wypisany",
    },
    emailJourneyVariant: {
      personalApproach: "Podejście personalne",
      resultsFocused: "Skupiony na wynikach",
      personalResults: "Wyniki personalne",
    },
    emailJourneyVariantFilter: {
      all: "Wszystkie",
      personalApproach: "Podejście personalne",
      resultsFocused: "Skupiony na wynikach",
      personalResults: "Wyniki personalne",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    leadSortField: {
      email: "E-mail",
      businessName: "Nazwa firmy",
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      lastEngagementAt: "Ostatnie zaangażowanie",
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
      leadCreated: "Lead utworzony",
      leadUpdated: "Lead zaktualizowany",
      emailSent: "E-mail wysłany",
      emailOpened: "E-mail otwarty",
      emailClicked: "E-mail kliknięty",
      leadConverted: "Lead przekonwertowany",
      leadUnsubscribed: "Lead wypisany",
    },
    userAssociation: {
      withUser: "Z użytkownikiem",
      withLead: "Z leadem",
      standalone: "Samodzielny",
      withBoth: "Z oboma",
    },
    leadSource: {
      website: "Strona internetowa",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mailowa",
      referral: "Polecenie",
      csvImport: "Import CSV",
      api: "API",
    },
    leadStatusFilter: {
      all: "Wszystkie",
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania w toku",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      consultationBooked: "Konsultacja zarezerwowana",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Niedostarczony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStageFilter: {
      all: "Wszystkie",
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    leadSourceFilter: {
      all: "Wszystkie",
      website: "Strona internetowa",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mailowa",
      referral: "Polecenie",
      csvImport: "Import CSV",
      api: "API",
    },
    batchOperationScope: {
      currentPage: "Bieżąca strona",
      allPages: "Wszystkie strony",
    },
    country: {
      de: "Niemcy",
      pl: "Polska",
      global: "Globalnie",
    },
    language: {
      de: "Niemiecki",
      pl: "Polski",
      en: "Angielski",
    },
  },
};