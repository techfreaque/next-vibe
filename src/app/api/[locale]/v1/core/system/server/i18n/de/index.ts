import { translations as buildTranslations } from "../../build/i18n/de";
import { translations as devTranslations } from "../../dev/i18n/de";
import { translations as healthTranslations } from "../../health/i18n/de";
import { translations as startTranslations } from "../../start/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System Server",
  enum: {
    processStatus: {
      running: "Läuft",
      stopped: "Gestoppt",
      error: "Fehler",
    },
    environment: {
      development: "Entwicklung",
      production: "Produktion",
      testing: "Test",
      staging: "Staging",
    },
    mode: {
      development: "Entwicklung",
      production: "Produktion",
    },
  },
  build: buildTranslations,
  dev: devTranslations,
  health: healthTranslations,
  start: startTranslations,
};
