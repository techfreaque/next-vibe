import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Spotreba podľa funkcie",
    title: "Spotreba kreditov podľa funkcie",
    description:
      "Transakcie čerpania kreditov označené konkrétnou funkciou v každom časovom intervale",
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
      result: {
        label: "Spotreba kreditov podľa funkcie",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o vykonaní uzla" },
    },
    success: {
      title: "Spotreba kreditov podľa funkcie je vypočítaná",
      description: "Časový rad spotreby kreditov podľa funkcie je k dispozícii",
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
