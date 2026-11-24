import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "Begleiter",
      assistant: "Assistenten",
      coding: "Programmierung",
      creative: "Kreativ",
      writing: "Schreiben",
      analysis: "Analyse",
      roleplay: "Rollenspiel",
      education: "Bildung",
      controversial: "Kontrovers",
      background: "Hintergrund",
      custom: "Benutzerdefiniert",
    },
    source: {
      all: "Alle",
      builtIn: "Eingebaut",
      my: "Meine",
      community: "Community",
    },
    ownershipType: {
      system: "Integriertes Skill",
      user: "Von dir erstellt",
      public: "Aus der Community",
    },
    voice: {
      male: "Männliche Stimme",
      female: "Weibliche Stimme",
    },
    mode: {
      auto: "Automatisch",
      manual: "Manuell",
    },
    selectionType: {
      skillBased: "Basierend auf Skill",
      manual: "Bestimmtes Modell",
      filters: "Filterkriterien",
    },
    intelligence: {
      quick: "Schnell",
      smart: "Günstig & Schlau",
      brilliant: "Brillant",
    },
    price: {
      cheap: "Günstig",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Mainstream",
      open: "Offen",
      uncensored: "Unzensiert",
    },
    skillType: {
      persona: "Persona",
      specialist: "Spezialist",
      toolBundle: "Werkzeugpaket",
    },
    skillStatus: {
      draft: "Entwurf",
      published: "Veröffentlicht",
      unlisted: "Nicht gelistet",
    },
    trustLevel: {
      community: "Community",
      verified: "Verifiziert",
    },
    voteDirection: {
      up: "Hochstimmen",
      down: "Runterstimmen",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligenz",
      price: "Preis",
      content: "Inhalt",
    },
    sortDirection: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
};
