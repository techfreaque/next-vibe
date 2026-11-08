// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/pl";
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
    titleShort: "Tekst na mowę",
    dynamicTitle: "Mowa: {{text}}",
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
    download: "Pobierz",
    response: {
      title: "Wynik audio",
      description: "Wygenerowane audio mowy",
      success: "Sukces",
      audioUrl: "URL audio",
      creditCost: "Zużyte kredyty",
    },
    submitButton: {
      label: "Przeczytaj",
      loadingText: "Generuję głos...",
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
      noTtsProviderConfigured:
        "Nie skonfigurowano żadnego dostawcy syntezy mowy. Dodaj OPENAI_API_KEY, EDEN_AI_API_KEY albo ELEVENLABS_API_KEY – lub podłącz systemowego dostawcę inferencji.",
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
        "Za mało kredytów na tę konwersję. Saldo: {{balance}}, wymagane minimum: {{minimum}}. Doładuj, aby kontynuować",
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
      kokoroBella:
        "Kokoro Bella - Otwarty model 82M, ciepły amerykański głos kobiecy. Bez filtra treści.",
      kokoroSarah:
        "Kokoro Sarah - Otwarty model 82M, wyraźny amerykański głos kobiecy. Bez filtra treści.",
      kokoroNicole:
        "Kokoro Nicole - Otwarty model 82M, miękki, stonowany głos kobiecy. Bez filtra treści.",
      kokoroAdam:
        "Kokoro Adam - Otwarty model 82M, spokojny amerykański głos męski. Bez filtra treści.",
      kokoroMichael:
        "Kokoro Michael - Otwarty model 82M, pewny siebie amerykański głos męski. Bez filtra treści.",
      kokoroEmma:
        "Kokoro Emma - Otwarty model 82M, brytyjski głos kobiecy. Bez filtra treści.",
      kokoroGeorge:
        "Kokoro George - Otwarty model 82M, brytyjski głos męski. Bez filtra treści.",
      inworldAshley:
        "Inworld Ashley - Szybki, tani głos kobiecy o żywej narracji.",
      inworldCraig: "Inworld Craig - Szybki, tani brytyjski głos męski.",
      xaiEve:
        "xAI Eve - Ekspresyjny głos kobiecy ze sterowaniem emocjami w tekście.",
      geminiZephyr:
        "Gemini Zephyr - Jasny głos kobiecy, ponad 100 języków, sterowanie intonacją.",
      geminiPuck:
        "Gemini Puck - Energiczny głos męski, ponad 100 języków, sterowanie intonacją.",
    },
    names: modelTranslations.names,
  },
};

export default translations;
