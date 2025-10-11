import type { servicesTranslations as EnglishServicesTranslations } from "../../../en/sections/emailJourneys/services";

export const servicesTranslations: typeof EnglishServicesTranslations = {
  abTesting: {
    noDataAvailable: "Keine Daten verfügbar",
    highestConversionRate: "Höchste Konversionsrate: {{rate}}%",
    insufficientSampleSize: "Unzureichende Stichprobengröße",
    continueTestUntil:
      "Test fortsetzen bis {{count}} E-Mails insgesamt gesendet",
    statisticalSignificanceReached: "Statistische Signifikanz erreicht",
    implementWinningVariant:
      "Gewinnende Variante für alle neuen Leads implementieren",
    noClearWinner: "Noch kein klarer Gewinner",
    continueTestForSignificance:
      "Test fortsetzen, um statistische Signifikanz zu erreichen",
  },
};
