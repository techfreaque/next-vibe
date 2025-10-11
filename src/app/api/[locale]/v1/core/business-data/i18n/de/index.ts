import { translations as audienceTranslations } from "../../audience/i18n/de";
import { translations as brandTranslations } from "../../brand/i18n/de";
import { translations as businessInfoTranslations } from "../../business-info/i18n/de";
import { translations as challengesTranslations } from "../../challenges/i18n/de";
import { translations as competitorsTranslations } from "../../competitors/i18n/de";
import { translations as goalsTranslations } from "../../goals/i18n/de";
import { translations as profileTranslations } from "../../profile/i18n/de";
import { translations as socialTranslations } from "../../social/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main business data aggregation endpoint
  category: "Geschäftsdaten",
  tags: {
    businessData: "Geschäftsdaten",
    aggregation: "Aggregation",
  },
  get: {
    title: "Alle Geschäftsdaten abrufen",
    description: "Umfassenden Geschäftsdaten-Vollständigkeitsstatus abrufen",
    form: {
      title: "Geschäftsdaten-Übersicht",
      description:
        "Vollständigkeitsstatus für alle Geschäftsdaten-Bereiche anzeigen",
    },
    response: {
      title: "Geschäftsdaten-Status",
      description: "Vollständigkeitsstatus für alle Geschäftsdaten-Bereiche",
      completionStatus: {
        title: "Gesamtvollständigkeitsstatus",
        description: "Vollständigkeitsstatus für alle Geschäftsdaten-Bereiche",
        audience: {
          title: "Zielgruppen-Bereich",
          description: "Vollständigkeitsstatus der Zielgruppen-Informationen",
          isComplete: "Zielgruppen-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Zielgruppen-Felder",
          totalFields: "Gesamt-Zielgruppen-Felder",
          completionPercentage: "Zielgruppen-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Zielgruppen-Felder",
        },
        brand: {
          title: "Marken-Bereich",
          description: "Vollständigkeitsstatus der Marken-Informationen",
          isComplete: "Marken-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Marken-Felder",
          totalFields: "Gesamt-Marken-Felder",
          completionPercentage: "Marken-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Marken-Felder",
        },
        businessInfo: {
          title: "Geschäftsinfo-Bereich",
          description: "Vollständigkeitsstatus der Geschäfts-Informationen",
          isComplete: "Geschäftsinfo-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Geschäftsinfo-Felder",
          totalFields: "Gesamt-Geschäftsinfo-Felder",
          completionPercentage: "Geschäftsinfo-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Geschäftsinfo-Felder",
        },
        challenges: {
          title: "Herausforderungen-Bereich",
          description: "Vollständigkeitsstatus der Geschäfts-Herausforderungen",
          isComplete: "Herausforderungen-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Herausforderungen-Felder",
          totalFields: "Gesamt-Herausforderungen-Felder",
          completionPercentage: "Herausforderungen-Vollständigkeitsprozentsatz",
          missingRequiredFields:
            "Fehlende erforderliche Herausforderungen-Felder",
        },
        competitors: {
          title: "Wettbewerber-Bereich",
          description: "Vollständigkeitsstatus der Wettbewerber-Informationen",
          isComplete: "Wettbewerber-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Wettbewerber-Felder",
          totalFields: "Gesamt-Wettbewerber-Felder",
          completionPercentage: "Wettbewerber-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Wettbewerber-Felder",
        },
        goals: {
          title: "Ziele-Bereich",
          description: "Vollständigkeitsstatus der Geschäfts-Ziele",
          isComplete: "Ziele-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Ziele-Felder",
          totalFields: "Gesamt-Ziele-Felder",
          completionPercentage: "Ziele-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Ziele-Felder",
        },
        profile: {
          title: "Profil-Bereich",
          description: "Vollständigkeitsstatus des Geschäfts-Profils",
          isComplete: "Profil-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Profil-Felder",
          totalFields: "Gesamt-Profil-Felder",
          completionPercentage: "Profil-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Profil-Felder",
        },
        social: {
          title: "Social-Media-Bereich",
          description: "Vollständigkeitsstatus der Social-Media-Daten",
          isComplete: "Social-Media-Bereich abgeschlossen",
          completedFields: "Abgeschlossene Social-Media-Felder",
          totalFields: "Gesamt-Social-Media-Felder",
          completionPercentage: "Social-Media-Vollständigkeitsprozentsatz",
          missingRequiredFields: "Fehlende erforderliche Social-Media-Felder",
        },
        overall: {
          title: "Gesamtstatus",
          description: "Gesamtvollständigkeitsstatus der Geschäftsdaten",
          isComplete: "Alle Bereiche abgeschlossen",
          completedSections: "Abgeschlossene Bereiche",
          totalSections: "Gesamt-Bereiche",
          completionPercentage: "Gesamtvollständigkeitsprozentsatz",
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Die Geschäftsdaten-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Unbefugter Zugriff",
      description:
        "Sie haben keine Berechtigung zum Zugriff auf Geschäftsdaten",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler beim Abrufen der Geschäftsdaten ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerk-Fehler",
      description: "Verbindung zum Geschäftsdaten-Service nicht möglich",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie dürfen nicht auf diese Geschäftsdaten zugreifen",
    },
    notFound: {
      title: "Daten nicht gefunden",
      description:
        "Die angeforderten Geschäftsdaten konnten nicht gefunden werden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description:
        "Sie haben ungespeicherte Änderungen an Ihren Geschäftsdaten",
    },
    conflict: {
      title: "Datenkonflikt",
      description:
        "Die Geschäftsdaten stehen im Konflikt mit vorhandenen Informationen",
    },
  },
  success: {
    title: "Geschäftsdaten abgerufen",
    description: "Geschäftsdaten wurden erfolgreich abgerufen",
  },

  // Child domain translations
  audience: audienceTranslations,
  brand: brandTranslations,
  businessData: {}, // TODO: Define business-data overview translations
  businessInfo: businessInfoTranslations,
  challenges: challengesTranslations,
  competitors: competitorsTranslations,
  goals: goalsTranslations,
  profile: profileTranslations,
  social: socialTranslations,
};
