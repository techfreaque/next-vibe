import { translations as buildTranslations } from "../../build/i18n/pl";
import { translations as devTranslations } from "../../dev/i18n/pl";
import { translations as healthTranslations } from "../../health/i18n/pl";
import { translations as startTranslations } from "../../start/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Serwer systemowy",
  enum: {
    processStatus: {
      running: "Działa",
      stopped: "Zatrzymany",
      error: "Błąd",
    },
    environment: {
      development: "Rozwój",
      production: "Produkcja",
      testing: "Testowanie",
      staging: "Staging",
    },
    mode: {
      development: "Rozwój",
      production: "Produkcja",
    },
  },
  build: buildTranslations,
  dev: devTranslations,
  health: healthTranslations,
  start: startTranslations,
};
