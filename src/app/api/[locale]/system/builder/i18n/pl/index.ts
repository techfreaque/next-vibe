import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Builder",
  description: "Narzędzie do budowania i pakowania projektu",
  cli: {
    build: {
      description: "Typ budowania: build",
      configOption: "określ ścieżkę pliku konfiguracyjnego",
      defaultConfig: "build.config.ts",
    },
  },
  errors: {
    inputFileNotFound: "Plik wejściowy {{filePath}} nie istnieje",
    invalidOutputFileName: "Nazwa pliku wyjściowego jest nieprawidłowa",
    invalidBuildConfig:
      "Nieprawidłowy format konfiguracji budowania. Upewnij się, że konfiguracja eksportuje domyślny obiekt BuildConfig.",
  },
};
