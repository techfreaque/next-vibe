import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Prudký pokles",
    titleShort: "Pokles",
    description:
      "Vyšle signál, keď hodnota prudko klesne pod priemer svojich predchádzajúcich hodnôt",
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
      window: {
        label: "Predchádzajúce intervaly",
        description:
          "Počet predchádzajúcich intervalov, z ktorých sa počíta referenčný priemer",
      },
      dropPct: {
        label: "Pokles",
        description:
          "Vyšle signál, keď hodnota klesne pod referenčný priemer × (1 − podiel poklesu). Hodnota 0,5 znamená pokles o 50 %.",
      },
      minBaseline: {
        label: "Minimálny referenčný priemer",
        description:
          "Preskočí intervaly, ktorých referenčný priemer je nižší ako táto hodnota (príliš málo údajov)",
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
      title: "Pokles sa vyhodnotil",
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
        description: "Vyhodnotenie poklesu zlyhalo",
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
