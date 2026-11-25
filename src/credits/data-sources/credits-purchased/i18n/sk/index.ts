import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Platené (balíky a predplatné)",
      packs: "Kúpené balíky",
      subscriptions: "Kredity z predplatného",
      gifted: "Darované (pridelené správcom)",
    },
  },
  post: {
    titleShort: "Vydané kredity",
    title: "Vydané kredity (platené a darované)",
    description:
      "Kredity pripísané do peňaženiek v každom intervale. Výsledok je v kreditoch. Zahŕňa reálne nákupy balíkov a predplatného aj kredity darované správcom napríklad testerom, tvorcom alebo v rámci ústretového gesta.",
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
      kind: {
        label: "Druh",
        description:
          "Vyberte, ktoré prídely započítať: platby za balíky aj predplatné, iba balíky, iba predplatné alebo kredity darované správcom.",
      },
      result: {
        label: "Vydané kredity",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o vykonaní uzla" },
    },
    success: {
      title: "Počet kúpených kreditov je vypočítaný",
      description: "Časový rad kúpených kreditov je k dispozícii",
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
