import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "MRR (USD)",
    titleShort: "MRR",
    description:
      "Mesačné opakované tržby prepočítané približne na USD ku koncu každého časového intervalu. Hodnota každého trvajúceho predplatného vychádza z poslednej uhradenej platby za predplatné. Pri ročných plánoch sa započíta 1/12. Účty správcov sa vylučujú.",
    fields: {
      resolution: {
        label: "Rozlíšenie",
        description: "Obdobie výpočtu",
      },
      range: {
        label: "Rozsah",
        description: "Časový rozsah dopytu",
      },
      lookback: {
        label: "Predchádzajúce intervaly",
        description: "Intervaly navyše pred začiatkom rozsahu",
      },
      result: {
        label: "MRR (USD)",
        description: "Výstupný časový rad",
      },
      meta: {
        label: "Metadáta",
        description: "Metadáta spustenia uzla",
      },
    },
    success: {
      title: "Mesačné opakované tržby vypočítané",
      description: "Časový rad mesačných opakovaných tržieb sa načítal",
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
        description: "Dopyt zlyhal",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašlo sa",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt",
      },
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
