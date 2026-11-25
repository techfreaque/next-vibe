import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Všetko.",
      pack: "Balíky kreditov",
      subscription: "Predplatné (nové + obnovenia)",
      newSubscription: "Nové predplatné",
      renewal: "Obnovenia",
    },
    provider: {
      all: "Všetci spracovatelia platieb",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Príjmy (USD)",
    titleShort: "Tržby",
    description:
      "Prijaté platby za časový interval, približne v USD (EUR a PLN sa prepočítavajú pevnými kurzmi). Počítajú sa úspešné aj neskôr vrátené platby. Účty správcov sú vylúčené. Filtrovať možno podľa nákupu a spracovateľa platieb.",
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
        label: "Príjmy (USD)",
        description: "Výstupný časový rad",
      },
      meta: {
        label: "Metadáta",
        description: "Metadáta o spustení uzla",
      },
      kind: {
        label: "Platené",
        description:
          "Kreditné balíčky, predplatné (nové + obnovenie), alebo jeden z nich",
      },
      provider: {
        label: "Spracovateľ platieb",
        description: "Stripe, NOWPayments alebo oboje",
      },
    },
    success: {
      title: "Počítané príjmy",
      description: "Časový rad tržieb je pripravený.",
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
