import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Začaté",
      paid: "Zaplatené",
      abandoned: "Nedokončené alebo zamietnuté",
    },
  },
  post: {
    title: "Platobné relácie",
    titleShort: "Platobné relácie",
    description:
      "Začaté platby za balíky a nové predplatné podľa časového intervalu a výsledku. Nedokončená znamená, že platobná relácia vypršala po 24 hodinách alebo bola platba zamietnutá. Obnovenia a účty správcov sa nezapočítavajú.",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Časový rámec výpočtu",
      },
      range: {
        label: "Rozsah",
        description: "Časový rozsah dotazu",
      },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Dodatočné intervaly pred začiatkom rozsahu",
      },
      result: {
        label: "Platobné relácie",
        description: "Výstupný časový rad",
      },
      meta: {
        label: "Metadáta",
        description: "Metadáta o spustení uzla",
      },
      outcome: {
        label: "Výsledok",
        description:
          "Začaté (všetky), uhradené alebo nedokončené či zamietnuté platby",
      },
    },
    success: {
      title: "Počty platobných relácií vypočítané",
      description: "Časový rad platobných relácií je pripravený.",
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
      server: {
        title: "Chyba servera",
        description: "Dopyt zlyhal",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      validation: {
        title: "Validácia zlyhala",
        description: "Neplatné parametre požiadavky",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenájdené",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt",
      },
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
