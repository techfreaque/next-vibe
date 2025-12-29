/**
 * Text-to-Speech Polish translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Tekst na mowę",
    description:
      "Konwertuj tekst na naturalnie brzmiącą mowę za pomocą AI (~0,00052 kredytów na znak)",
    form: {
      title: "Konwersja tekstu na mowę",
      description:
        "Wprowadź tekst do przekształcenia na mowę (Amazon Polly: ~0,00052 kredytów na znak)",
    },
    text: {
      label: "Tekst",
      description: "Tekst do przekształcenia na mowę",
      placeholder: "Wprowadź tekst, który chcesz przekształcić na mowę...",
    },
    provider: {
      label: "Dostawca",
      description: "Dostawca AI do syntezy mowy",
    },
    voice: {
      label: "Głos",
      description: "Typ głosu do syntezy mowy",
    },
    language: {
      label: "Język",
      description: "Język do syntezy mowy",
    },
    response: {
      title: "Wynik audio",
      description: "Wygenerowane audio mowy",
      success: "Sukces",
      audioUrl: "URL audio",
      provider: "Użyty dostawca",
    },
    errors: {
      validation_failed: {
        title: "Błąd walidacji",
        description: "Podany tekst lub parametry są nieprawidłowe",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby korzystać z tekstu na mowę",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do korzystania z tekstu na mowę",
      },
      not_found: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server_error: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas konwersji tekstu na mowę",
      },
      unknown_error: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsaved_changes: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      apiKeyMissing: "Klucz API Eden AI nie jest skonfigurowany",
      conversionFailed: "Synteza mowy nie powiodła się: {error}",
      noText: "Nie podano tekstu",
      noAudioUrl: "Nie otrzymano URL audio od dostawcy",
      audioFetchFailed: "Nie udało się pobrać pliku audio",
      providerError: "Błąd dostawcy: {error}",
      internalError: "Wewnętrzny błąd serwera",
      creditsFailed: "Nie udało się odjąć kredytów: {{error}}",
    },
    success: {
      title: "Sukces",
      description: "Tekst pomyślnie przekształcony na mowę",
      conversionComplete: "Synteza mowy zakończona pomyślnie",
    },
  },
  providers: {
    openai: "OpenAI",
    google: "Google Text-to-Speech",
    amazon: "Amazon Polly",
    microsoft: "Microsoft Azure",
    ibm: "IBM Watson",
    lovoai: "Lovo AI",
  },
  voices: {
    MALE: "Męski",
    FEMALE: "Żeński",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    es: "Hiszpański",
    fr: "Francuski",
    it: "Włoski",
  },
};

export default translations;
