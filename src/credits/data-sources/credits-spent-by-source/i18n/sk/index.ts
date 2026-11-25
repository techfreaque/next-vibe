import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Verejné (hostia)",
      usersFree: "Bezplatné kredity používateľov",
      paid: "Platené",
      gifted: "Darované",
      internal: "Interné (správcovia)",
      unattributed: "Nepriradené (historické údaje)",
    },
  },
  post: {
    titleShort: "Spotreba podľa zdroja",
    title: "Spotreba kreditov podľa zdroja",
    description:
      "Spotreba podľa toho, kto kredity minul a z akého zdroja pochádzali: verejné kredity hostí, bezplatné kredity používateľov, platené, darované, interné alebo nepriradené kredity. Súčet všetkých zdrojov tvorí celkovú spotrebu.",
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
      source: {
        label: "Zdroj",
        description:
          "Vyberte zdroj kreditov: verejné kredity hostí, bezplatné kredity prihlásených používateľov, platené kredity z predplatného a balíkov, dary správcu, interné účty správcov alebo historické nepriradené kredity.",
      },
      result: { label: "Minuté kredity", description: "Výstupný časový rad" },
      meta: { label: "Metadáta", description: "Metadáta o vykonaní uzla" },
    },
    success: {
      title: "Spotreba kreditov podľa zdroja je vypočítaná",
      description: "Časový rad spotreby kreditov podľa zdroja je k dispozícii",
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
