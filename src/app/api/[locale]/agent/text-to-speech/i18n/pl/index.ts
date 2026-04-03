/**
 * Text-to-Speech Polish translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Mowa",
    tts: "Tekst na mowę",
    ai: "AI",
  },

  post: {
    title: "Tekst na mowę",
    description:
      "Konwertuj tekst na naturalnie brzmiącą mowę za pomocą AI (~0,00052 kredytów na znak)",
    form: {
      title: "Konwersja tekstu na mowę",
      description:
        "Wprowadź tekst do przekształcenia na mowę (OpenAI TTS: ~0,00052 kredytów na znak)",
    },
    text: {
      label: "Tekst",
      description: "Tekst do przekształcenia na mowę",
      placeholder: "Wprowadź tekst, który chcesz przekształcić na mowę...",
    },
    voice: {
      label: "Głos",
      description: "Model głosu do syntezy mowy",
    },
    response: {
      title: "Wynik audio",
      description: "Wygenerowane audio mowy",
      success: "Sukces",
      audioUrl: "URL audio",
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
      notConfigured:
        "Klucz API {{label}} nie jest skonfigurowany. Dodaj {{envKey}}=<twój-klucz> do pliku .env. Pobierz klucz na {{url}}",
      conversionFailed: "Synteza mowy nie powiodła się: {{error}}",
      noText: "Nie podano tekstu",
      noAudioUrl: "Nie otrzymano URL audio od dostawcy",
      providerError: "Błąd dostawcy: {{error}}",
      internalError: "Wewnętrzny błąd serwera",
      unsupportedProvider: "Nieobsługiwany dostawca TTS dla głosu: {{voiceId}}",
      creditsFailed: "Nie udało się odjąć kredytów: {{error}}",
      audioFetchFailed: "Nie można utworzyć pliku audio. Spróbuj ponownie",
      balanceCheckFailed:
        "Nie można sprawdzić salda kredytów. Spróbuj ponownie",
      insufficientCredits:
        "Nie masz wystarczającej liczby kredytów na tę konwersję. Dodaj więcej kredytów, aby kontynuować",
    },
    success: {
      title: "Sukces",
      description: "Tekst pomyślnie przekształcony na mowę",
      conversionComplete: "Synteza mowy zakończona pomyślnie",
    },
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    es: "Hiszpański",
    fr: "Francuski",
    it: "Włoski",
  },
  models: {
    descriptions: {
      openaiAlloy: "OpenAI Alloy",
      openaiNova: "OpenAI Nova",
      openaiOnyx: "OpenAI Onyx",
      openaiEcho: "OpenAI Echo",
      openaiShimmer: "OpenAI Shimmer",
      openaiFable: "OpenAI Fable",
      elevenlabsRachel: "ElevenLabs Rachel",
      elevenlabsJosh: "ElevenLabs Josh",
      elevenlabsBella: "ElevenLabs Bella",
      elevenlabsAdam: "ElevenLabs Adam",
    },
  },
};

export default translations;
