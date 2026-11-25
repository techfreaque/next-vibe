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
      otherChat: "Ostatné četové modely",
      image: "Generovanie obrázkov",
      video: "Generovanie videa",
      music: "Generovanie hudby",
      voice: "Hlas (syntéza a rozpoznávanie reči)",
      tools: "Nástroje (vyhľadávanie, načítanie, pamäť)",
      unattributed: "Nepriradené",
    },
  },
  post: {
    titleShort: "Spotreba podľa modelu",
    title: "Spotreba kreditov podľa rodiny modelov",
    description:
      "Kredity minuté za interval v jednej skupine: četové modely podľa výrobcu (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini a ostatné), obrázky, video, hudba, hlas alebo nástroje. Metrika zahŕňa všetkých používateľov a súčet skupín zodpovedá celkovej spotrebe.",
    fields: {
      resolution: {
        label: "Časový krok",
        description: "Časový interval výpočtu",
      },
      range: {
        label: "Obdobie",
        description: "Obdobie, za ktoré sa majú načítať údaje",
      },
      lookback: {
        label: "Spätný rozsah",
        description: "Počet ďalších intervalov pred začiatkom obdobia",
      },
      group: {
        label: "Skupina",
        description:
          "Vyberte rodinu četových modelov podľa výrobcu alebo skupinu multimediálnych modelov či nástrojov.",
      },
      result: {
        label: "Minuté kredity",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o vykonaní uzla" },
    },
    success: {
      title: "Časový rad je vypočítaný",
      description: "Časový rad je k dispozícii",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pokračovanie sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: { title: "Chyba servera", description: "Dopyt zlyhal" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny",
      },
    },
  },
};
