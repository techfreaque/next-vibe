import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "Inne modele czatu",
      image: "Generowanie obrazów",
      video: "Generowanie wideo",
      music: "Generowanie muzyki",
      voice: "Głos (TTS + STT)",
      tools: "Narzędzia (wyszukiwanie, pobieranie, pamięć)",
      unattributed: "Nieprzypisane",
    },
  },
  post: {
    titleShort: "Zużycie wg modelu",
    title: "Wydane kredyty wg rodziny modeli",
    description:
      "Kredyty wydane w przedziale na jedną grupę: modele czatu wg twórcy (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, inne), obraz, wideo, muzyka, głos, narzędzia. Wszyscy użytkownicy, więc grupy sumują się do całego zużycia. W kredytach.",
    fields: {
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do zapytania" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      group: {
        label: "Grupa",
        description:
          "Rodzina modeli (modele czatu wg twórcy) albo grupa mediów / narzędzi",
      },
      result: {
        label: "Wydane kredyty",
        description: "Wyjściowa seria czasowa",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Seria obliczona",
      description: "Zwrócono szereg czasowy",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Zapytanie nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
