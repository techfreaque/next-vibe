import type { servicesTranslations as EnglishServicesTranslations } from "../../../en/sections/emailJourneys/services";

export const servicesTranslations: typeof EnglishServicesTranslations = {
  abTesting: {
    noDataAvailable: "Brak dostępnych danych",
    highestConversionRate: "Najwyższa stopa konwersji: {{rate}}%",
    insufficientSampleSize: "Niewystarczająca wielkość próby",
    continueTestUntil: "Kontynuuj test do {{count}} wysłanych e-maili łącznie",
    statisticalSignificanceReached: "Osiągnięto istotność statystyczną",
    implementWinningVariant:
      "Wdróż zwycięską wersję dla wszystkich nowych leadów",
    noClearWinner: "Jeszcze brak wyraźnego zwycięzcy",
    continueTestForSignificance:
      "Kontynuuj test, aby osiągnąć istotność statystyczną",
  },
};
