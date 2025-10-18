import type { translations as EnglishTrackingTranslations } from "../../en/tracking";

export const translations: typeof EnglishTrackingTranslations = {
  redirecting: "Weiterleitung...",
  processing: "Ihre Anfrage wird bearbeitet...",
  errors: {
    invalidLeadId: "Ungültiger Tracking-Link",
    missingParameters: "Fehlende erforderliche Tracking-Parameter",
    trackingFailed: "Fehler beim Aufzeichnen der Tracking-Daten",
    redirectFailed: "Fehler bei der Weiterleitung zum Ziel",
    missingId: "Fehlende Lead-ID",
    invalidIdFormat: "Ungültiges Lead-ID-Format",
    invalidCampaignIdFormat: "Ungültiges Kampagnen-ID-Format",
    invalidUrl: "Ungültiges URL-Format",
  },
  engagement: {
    emailOpened: "E-Mail geöffnet",
    emailClicked: "E-Mail geklickt",
    websiteVisited: "Website besucht",
    formSubmitted: "Formular abgesendet",
  },
  conversion: {
    leadConverted: "Lead erfolgreich konvertiert",
    conversionFailed: "Fehler bei der Lead-Konvertierung",
    alreadyConverted: "Lead bereits konvertiert",
  },
};
