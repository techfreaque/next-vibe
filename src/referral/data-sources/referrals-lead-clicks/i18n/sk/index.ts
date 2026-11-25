import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Kliknutia na odkazy s odporúčaním",
    titleShort: "Kliknutia kontaktov",
    description:
      "Kliknutia kontaktov na odkazy s odporúčaním za časový interval",
    fields: {
      resolution: { label: "Rozlíšenie", description: "Obdobie výpočtu" },
      range: { label: "Rozsah", description: "Časový rozsah dopytu" },
      lookback: {
        label: "Predchádzajúce intervaly",
        description: "Intervaly navyše pred začiatkom rozsahu",
      },
      result: {
        label: "Kliknutia na odkazy s odporúčaním",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Počet kliknutí na odkazy s odporúčaním vypočítaný",
      description: "Časový rad kliknutí na odkazy s odporúčaním sa načítal",
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
      server: { title: "Chyba servera", description: "Dopyt zlyhal" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
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
