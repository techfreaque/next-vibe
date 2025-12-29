import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Generator Srodowiska",
    description: "Generuje skonsolidowane pliki konfiguracji srodowiska",
    form: {
      title: "Konfiguracja Srodowiska",
      description: "Skonfiguruj parametry generowania srodowiska",
    },
    fields: {
      outputDir: {
        label: "Katalog wyjsciowy",
        description: "Katalog do zapisu wygenerowanych plikow",
      },
      verbose: {
        label: "Szczegolowo",
        description: "Pokaz szczegolowe dane wyjsciowe",
      },
      dryRun: {
        label: "Probny przebieg",
        description: "Podglad bez zapisywania plikow",
      },
      success: {
        label: "Sukces",
      },
      message: {
        label: "Wiadomosc",
      },
      serverEnvFiles: {
        label: "Pliki Env serwera",
      },
      clientEnvFiles: {
        label: "Pliki Env klienta",
      },
      duration: {
        label: "Czas trwania",
      },
      outputPaths: {
        label: "Sciezki wyjsciowe",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Blad walidacji",
        description: "Wykryto nieprawidlowe eksporty plikow env",
      },
      server: {
        title: "Blad serwera",
        description: "Wystapil wewnetrzny blad serwera",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieznany blad",
      },
      network: {
        title: "Blad sieci",
        description: "Wystapil blad sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostep zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasob nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystapil konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Sa niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Pliki srodowiska wygenerowane pomyslnie",
    },
  },
  tags: {
    env: "srodowisko",
  },
  error: {
    validation_failed: "Walidacja pliku env nie powiodla sie",
    generation_failed: "Generowanie env nie powiodlo sie",
  },
  success: {
    generated: "Pliki srodowiska wygenerowane pomyslnie",
  },
};
