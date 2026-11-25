import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Pridané spôsoby platby",
    titleShort: "Spôsoby platby",
    description:
      "Nové spôsoby platby pridané podľa skupín na riešenie problémov",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Časový rámec výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dotazu" },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Dodatočné intervaly pred začiatkom rozsahu",
      },
      result: {
        label: "Pridané metódy",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o spustení uzla" },
    },
    success: {
      title: "Vypočítané spôsoby platby",
      description: "Platobné metódy Pridané série vrátené",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa prístup správcu",
      },
      server: { title: "Chyba servera", description: "Dopyt zlyhal" },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      validation: {
        title: "Validácia zlyhala",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová žiadosť zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Uložiť zmeny ako prvé",
      },
    },
  },
};
