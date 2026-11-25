import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Prekríženie nahor",
    titleShort: "Prekríženie nahor",
    description:
      "Vyšle signál, keď sa hodnota radu A dostane nad hodnotu radu B. V predchádzajúcom bode musela byť na rovnakej alebo nižšej úrovni.",
    fields: {
      seriesA: { label: "Rad A", description: "Prvý vstupný časový rad" },
      seriesB: { label: "Rad B", description: "Druhý vstupný časový rad" },
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
      title: "Prekríženie nahor sa vyhodnotilo",
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
        description: "Vyhodnotenie prekríženia zlyhalo",
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
