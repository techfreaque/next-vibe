import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    titleShort: "MACD",
    description:
      "Indikátor MACD sleduje trend a meria dynamiku zmeny pomocou rozdielu exponenciálnych kĺzavých priemerov",
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
      fastPeriod: {
        label: "Obdobie rýchleho priemeru",
        description: "Obdobie rýchleho EMA (1 až 100)",
      },
      slowPeriod: {
        label: "Obdobie pomalého priemeru",
        description: "Obdobie pomalého EMA (1 až 200)",
      },
      signalPeriod: {
        label: "Obdobie signálnej čiary",
        description: "Obdobie EMA signálnej čiary (1 až 50)",
      },
      macd: {
        label: "MACD",
        description: "Čiara MACD (rýchly EMA − pomalý EMA)",
      },
      signal: {
        label: "Signál",
        description: "Signálna čiara (EMA čiary MACD)",
      },
      histogram: {
        label: "Histogram",
        description: "Histogram (MACD − signálna čiara)",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "MACD vypočítané",
      description:
        "Časové rady MACD, signálnej čiary a histogramu sú pripravené",
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
        description: "Výpočet MACD zlyhal",
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
