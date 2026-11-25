import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "Spoločníci",
      assistant: "Asistenti",
      coding: "Programovanie",
      creative: "Tvorba",
      writing: "Písanie",
      analysis: "Analýza",
      roleplay: "Hranie rolí",
      education: "Vzdelávanie",
      controversial: "Kontroverzné",
      background: "Na pozadí",
      custom: "Vlastné",
    },
    source: {
      all: "Všetky",
      builtIn: "Vstavané",
      my: "Moje",
      community: "Komunita",
    },
    ownershipType: {
      system: "Vstavaná zručnosť",
      user: "Tvoja zručnosť",
      public: "Od komunity",
    },
    voice: {
      male: "Mužský hlas",
      female: "Ženský hlas",
    },
    mode: {
      auto: "Automatické",
      manual: "Ručne",
    },
    selectionType: {
      skillBased: "Podľa zručnosti",
      manual: "Konkrétny model",
      filters: "Kritériá filtra",
    },
    intelligence: {
      quick: "Rýchly",
      smart: "Inteligentný a lacný",
      brilliant: "Pokročilý",
    },
    price: {
      cheap: "Lacné",
      standard: "Štandard",
      premium: "Prémiová",
    },
    content: {
      mainstream: "Bežné modely",
      open: "Otvorené",
      uncensored: "Bez cenzúry",
    },
    skillType: {
      persona: "Postava",
      specialist: "Špecialista",
      toolBundle: "Sada nástrojov",
    },
    skillStatus: {
      draft: "Návrh",
      published: "Zverejnené",
      unlisted: "Prístup cez odkaz",
    },
    trustLevel: {
      community: "Komunita",
      verified: "Overené",
    },
    voteDirection: {
      up: "Kladný hlas",
      down: "Záporný hlas",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencia",
      price: "Cena",
      content: "Obsah",
    },
    sortDirection: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
  },
};
