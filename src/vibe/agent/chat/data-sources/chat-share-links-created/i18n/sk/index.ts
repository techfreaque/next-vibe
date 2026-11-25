import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Nové odkazy na zdieľanie konverzácií",
    titleShort: "Odkazy na zdieľanie",
    description:
      "Počet vytvorených odkazov na zdieľanie konverzácií za každý časový interval.",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Časový interval výpočtu",
      },
      range: { label: "Rozsah", description: "Rozsah času pre požiadavku" },
      lookback: {
        label: "Predchádzajúce intervaly",
        description: "Dodatočné intervaly pred začiatkom rozsahu",
      },
      result: {
        label: "Vytvorené odkazy na zdieľanie",
        description: "Výsledný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta vykonania uzla" },
    },
    success: {
      title: "Výpočet metriky „Nové odkazy na zdieľanie konverzácií“ je hotový",
      description:
        "Časový rad metriky „Nové odkazy na zdieľanie konverzácií“ sa načítal",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
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
        title: "Overenie zlyhalo",
        description: "Parametre požiadavky sú neplatné",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož zmeny",
      },
    },
  },
};
