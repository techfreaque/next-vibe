import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Build- und Bundle-Tool für das Projekt",
  cli: {
    build: {
      description: "Build-Typ: build",
      configOption: "Geben Sie den Konfigurationsdateipfad an",
      defaultConfig: "build.config.ts",
    },
  },
  errors: {
    inputFileNotFound: "Eingabedatei {{filePath}} existiert nicht",
    invalidOutputFileName: "Ausgabedateiname ist ungültig",
    invalidBuildConfig:
      "Ungültiges Build-Konfigurationsformat. Stellen Sie sicher, dass die Konfiguration ein Standard-BuildConfig-Objekt exportiert.",
  },
};
