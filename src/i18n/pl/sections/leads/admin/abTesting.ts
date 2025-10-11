import type { abTestingTranslations as EnglishAbTestingTranslations } from "../../../../en/sections/leads/admin/abTesting";

export const abTestingTranslations: typeof EnglishAbTestingTranslations = {
  title: "Konfiguracja Testów A/B",
  subtitle:
    "Monitoruj i konfiguruj testy A/B dla wariantów podróży e-mailowych",
  status: {
    active: "Aktywny",
    inactive: "Nieaktywny",
    valid: "Ważny",
    invalid: "Nieważny",
  },
  metrics: {
    testStatus: "Status Testu",
    totalVariants: "Łączne Warianty",
    configuration: "Konfiguracja",
    trafficSplit: "Podział Ruchu",
    trafficAllocation: "Alokacja Ruchu",
  },
  variants: {
    title: "Warianty Podróży E-mailowej",
    keyCharacteristics: "Kluczowe Cechy:",
  },
  config: {
    title: "Szczegóły Konfiguracji",
    testConfiguration: "Konfiguracja Testu",
    trafficDistribution: "Dystrybucja Ruchu",
    status: "Status",
    enabled: "Włączony",
    disabled: "Wyłączony",
    configurationValid: "Konfiguracja Ważna",
    yes: "Tak",
    no: "Nie",
    total: "Łącznie",
  },
  descriptions: {
    enabled: "Testy A/B są uruchomione",
    disabled: "Testy A/B są wyłączone",
    emailJourneyVariants: "Warianty podróży e-mailowej",
    configurationStatus: "Status konfiguracji",
  },
};
