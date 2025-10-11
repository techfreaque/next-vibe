import type { abTestingTranslations as EnglishAbTestingTranslations } from "../../../../en/sections/leads/admin/abTesting";

export const abTestingTranslations: typeof EnglishAbTestingTranslations = {
  title: "A/B-Test-Konfiguration",
  subtitle:
    "A/B-Tests für E-Mail-Journey-Varianten überwachen und konfigurieren",
  status: {
    active: "Aktiv",
    inactive: "Inaktiv",
    valid: "Gültig",
    invalid: "Ungültig",
  },
  metrics: {
    testStatus: "Test-Status",
    totalVariants: "Gesamte Varianten",
    configuration: "Konfiguration",
    trafficSplit: "Traffic-Aufteilung",
    trafficAllocation: "Traffic-Zuteilung",
  },
  variants: {
    title: "E-Mail-Journey-Varianten",
    keyCharacteristics: "Hauptmerkmale:",
  },
  config: {
    title: "Konfigurationsdetails",
    testConfiguration: "Test-Konfiguration",
    trafficDistribution: "Traffic-Verteilung",
    status: "Status",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    configurationValid: "Konfiguration gültig",
    yes: "Ja",
    no: "Nein",
    total: "Gesamt",
  },
  descriptions: {
    enabled: "A/B-Tests laufen",
    disabled: "A/B-Tests sind deaktiviert",
    emailJourneyVariants: "E-Mail-Journey-Varianten",
    configurationStatus: "Konfigurationsstatus",
  },
};
