import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Jedineční používatelia četu",
    titleShort: "Jedineční používatelia",
    description:
      "Počet rôznych prihlásených účtov, ktoré odoslali správu v uloženej konverzácii za každý časový interval. Údaje o hosťoch a režime inkognito nájdeš v metrike Ľudia používajúci AI. Štatistika zahŕňa len čety ľudí. Vynecháva čety agentov na pozadí, vzdialené kópie a účty správcov. Čety inkognito sa neukladajú.",
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
        label: "Jedineční používatelia",
        description: "Výsledný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta vykonania uzla" },
    },
    success: {
      title: "Výpočet metriky „Jedineční používatelia četu“ je hotový",
      description:
        "Časový rad metriky „Jedineční používatelia četu“ sa načítal",
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
