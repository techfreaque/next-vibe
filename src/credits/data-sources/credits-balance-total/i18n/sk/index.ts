import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Nevyčerpané kredity",
    title: "Nevyčerpané kredity používateľov",
    description:
      "Zostatok kreditov v peňaženkách prihlásených používateľov na konci každého intervalu podľa knihy kreditných transakcií. Zahŕňa kúpené, darované aj bezplatné kredity. Peňaženky hostí sú vylúčené.",
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
        label: "Nevyčerpané kredity",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o vykonaní uzla" },
    },
    success: {
      title: "Celkový zostatok kreditov je vypočítaný",
      description: "Časový rad celkového zostatku kreditov je k dispozícii",
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
