import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Vyhodnotenie skriptom",
    titleShort: "Vyhodnotiť skriptom",
    description:
      "Vyhodnotenie pomocou tela funkcie od používateľa v izolovanom prostredí",
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
      fn: {
        label: "Funkcia",
        description: "Telo funkcie prijíma pole inputs a vracia SignalEvent[]",
      },
      signals: { label: "Signály", description: "Výstupné udalosti signálov" },
    },
    success: {
      title: "Skript vyhodnotený",
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
        description: "Vyhodnotenie skriptu zlyhalo",
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
