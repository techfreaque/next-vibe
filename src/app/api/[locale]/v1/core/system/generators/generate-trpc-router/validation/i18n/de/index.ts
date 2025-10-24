import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "tRPC-Integration validieren",
  description: "tRPC-Router-Integration mit API-Endpunkten validieren",
  category: "API Endpunkt",
  tags: {
    trpc: "tRPC",
    validation: "Validierung",
  },
  operations: {
    validateIntegration: "Integration validieren",
    validateRouteFile: "Route-Datei validieren",
    generateReport: "Bericht generieren",
    fixRoutes: "Routen reparieren",
    checkRouterExists: "Router prüfen",
  },
  severity: {
    error: "Fehler",
    warning: "Warnung",
    info: "Info",
  },
  fields: {
    operation: {
      label: "Operation",
      description: "Auszuführende Validierungsoperation",
      placeholder: "Validierungsoperation auswählen",
    },
    filePath: {
      label: "Dateipfad",
      description: "Optionaler spezifischer Dateipfad zur Validierung",
      placeholder: "Dateipfad eingeben",
    },
    options: {
      label: "Optionen",
      description: "Validierungsoptionen",
      placeholder: "Optionen eingeben",
    },
  },
  response: {
    success: {
      label: "Erfolg",
    },
    operation: {
      label: "Operation",
    },
    result: {
      label: "Ergebnis",
    },
  },
  errors: {
    executionFailed: {
      title: "TRPC-Validierung fehlgeschlagen",
    },
  },
};
