import type { trackingTranslations as EnglishTrackingTranslations } from "../../en/sections/tracking";

export const trackingTranslations: typeof EnglishTrackingTranslations = {
  redirecting: "Przekierowywanie...",
  processing: "Przetwarzanie Twojego żądania...",
  errors: {
    invalidLeadId: "Nieprawidłowy link śledzenia",
    missingParameters: "Brakujące wymagane parametry śledzenia",
    trackingFailed: "Nie udało się zarejestrować danych śledzenia",
    redirectFailed: "Nie udało się przekierować do miejsca docelowego",
    missingId: "Brakujące ID lead",
    invalidIdFormat: "Nieprawidłowy format ID lead",
    invalidCampaignIdFormat: "Nieprawidłowy format ID kampanii",
    invalidUrl: "Nieprawidłowy format URL",
  },
  engagement: {
    emailOpened: "E-mail otwarty",
    emailClicked: "E-mail kliknięty",
    websiteVisited: "Strona internetowa odwiedzona",
    formSubmitted: "Formularz przesłany",
  },
  conversion: {
    leadConverted: "Lead pomyślnie skonwertowany",
    conversionFailed: "Nie udało się skonwertować leada",
    alreadyConverted: "Lead już skonwertowany",
  },
};
