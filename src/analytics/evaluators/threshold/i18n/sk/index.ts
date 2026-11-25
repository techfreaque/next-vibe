import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    op: {
      gt: ">",
      lt: "<",
      gte: ">=",
      lte: "<=",
      eq: "==",
    },
  },
  post: {
    title: "Prah",
    titleShort: "Prah",
    description:
      "Vyšle signál, keď hodnota radu splní podmienku porovnania s konštantou",
    fields: {
      source: { label: "Zdroj", description: "Vstupný časový rad" },
      resolution: {
        label: "Časové rozlíšenie",
        description: "Časový interval výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah na vyhodnotenie" },
      lookback: {
        label: "Počet predchádzajúcich intervalov",
        description:
          "Dodatočné intervaly pred začiatkom rozsahu na inicializáciu výpočtu",
      },
      op: {
        label: "Operátor",
        description: "Operátor porovnania (>, <, >=, <=, ==)",
      },
      value: {
        label: "Prah",
        description: "Konštantná hodnota na porovnanie",
      },
      signals: { label: "Signály", description: "Výstupné udalosti signálov" },
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Vyhodnotiť",
      loadingText: "Vyhodnocuje sa…",
    },
    success: {
      title: "Prah vyhodnotený",
      description: "Výsledné udalosti signálov sú pripravené",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Chyba servera",
        description: "Vyhodnotenie prahu zlyhalo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
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
