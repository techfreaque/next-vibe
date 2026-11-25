import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bollingerove pásma",
    titleShort: "Bollinger",
    description:
      "Bollingerove pásma majú strednú čiaru z jednoduchého kĺzavého priemeru (SMA). Horné a dolné pásmo vychádza zo smerodajnej odchýlky.",
    fields: {
      source: { label: "Zdroj", description: "Vstupný časový rad" },
      resolution: {
        label: "Časové rozlíšenie",
        description: "Časový interval výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah výpočtu" },
      lookback: {
        label: "Počet predchádzajúcich intervalov",
        description:
          "Dodatočné intervaly pred začiatkom rozsahu na inicializáciu výpočtu",
      },
      period: {
        label: "Obdobie",
        description: "Počet období (2 až 200)",
      },
      stdDev: {
        label: "Násobok smerodajnej odchýlky",
        description: "Násobok smerodajnej odchýlky (0,1 až 5)",
      },
      upper: {
        label: "Horné pásmo",
        description: "Časový rad horného Bollingerovho pásma",
      },
      middle: {
        label: "Stredné pásmo",
        description: "Časový rad stredného pásma (SMA)",
      },
      lower: {
        label: "Dolné pásmo",
        description: "Časový rad dolného Bollingerovho pásma",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Bollingerove pásma vypočítané",
      description:
        "Časové rady horného, stredného a dolného pásma sú pripravené",
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
        description: "Výpočet Bollingerových pásiem zlyhal",
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
