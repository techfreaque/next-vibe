import { translations as buildTranslations } from "../../build/i18n/en";
import { translations as devTranslations } from "../../dev/i18n/en";
import { translations as healthTranslations } from "../../health/i18n/en";
import { translations as startTranslations } from "../../start/i18n/en";

export const translations = {
  category: "Server Management",
  enum: {
    processStatus: {
      running: "Running",
      stopped: "Stopped",
      error: "Error",
    },
    environment: {
      development: "Development",
      production: "Production",
      testing: "Testing",
      staging: "Staging",
    },
    mode: {
      development: "Development",
      production: "Production",
    },
  },
  build: buildTranslations,
  dev: devTranslations,
  health: healthTranslations,
  start: startTranslations,
};
