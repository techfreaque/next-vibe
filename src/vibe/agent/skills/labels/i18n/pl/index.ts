import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "Towarzysze",
      assistant: "Asystenci",
      coding: "Programowanie",
      creative: "Kreatywne",
      writing: "Pisanie",
      analysis: "Analiza",
      roleplay: "Odgrywanie ról",
      education: "Edukacja",
      controversial: "Kontrowersyjne",
      background: "W tle",
      custom: "Niestandardowe",
    },
    source: {
      all: "Wszystkie",
      builtIn: "Wbudowane",
      my: "Moje",
      community: "Społeczność",
    },
    ownershipType: {
      system: "Wbudowany skill",
      user: "Utworzone przez ciebie",
      public: "Ze społeczności",
    },
    voice: {
      male: "Męski głos",
      female: "Damski głos",
    },
    mode: {
      auto: "Automatyczny",
      manual: "Ręczny",
    },
    selectionType: {
      skillBased: "Na podstawie skilla",
      manual: "Konkretny model",
      filters: "Kryteria filtrów",
    },
    intelligence: {
      quick: "Szybki",
      smart: "Tanio & Mądrze",
      brilliant: "Błyskotliwy",
    },
    price: {
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
    },
    content: {
      mainstream: "Główny nurt",
      open: "Otwarty",
      uncensored: "Bez cenzury",
    },
    skillType: {
      persona: "Persona",
      specialist: "Specjalista",
      toolBundle: "Pakiet narzędzi",
    },
    skillStatus: {
      draft: "Szkic",
      published: "Opublikowany",
      unlisted: "Niewidoczny",
    },
    trustLevel: {
      community: "Społeczność",
      verified: "Zweryfikowany",
    },
    voteDirection: {
      up: "Głos za",
      down: "Głos przeciw",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencja",
      price: "Cena",
      content: "Treść",
    },
    sortDirection: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
};
