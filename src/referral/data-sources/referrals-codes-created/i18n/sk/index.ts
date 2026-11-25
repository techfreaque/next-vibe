import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Vytvorené kódy odporúčaní",
    titleShort: "Vytvorené kódy",
    description: "Nové kódy odporúčaní za časový interval",
    fields: {
      resolution: { label: "Rozlíšenie", description: "Obdobie výpočtu" },
      range: { label: "Rozsah", description: "Časový rozsah dopytu" },
      lookback: {
        label: "Predchádzajúce intervaly",
        description: "Intervaly navyše pred začiatkom rozsahu",
      },
      result: {
        label: "Vytvorené kódy odporúčaní",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Počet vytvorených kódov odporúčaní vypočítaný",
      description: "Časový rad vytvorených kódov odporúčaní sa načítal",
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
