import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minúta",
      "3m": "3 minúty",
      "5m": "5 minút",
      "15m": "15 minút",
      "30m": "30 minút",
      "1h": "1 hodina",
      "4h": "4 hodiny",
      "1d": "1 deň",
      "1w": "1 týždeň",
      "1M": "1 mesiac",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Spustiť spätný test",
    titleShort: "Spätný test",
    description:
      "Spustiť spätný test na historických údajoch. Akcie sa simulujú.",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      rangeFrom: {
        label: "Od",
        description: "Začiatok obdobia spätného testu",
      },
      rangeTo: { label: "Do", description: "Koniec obdobia spätného testu" },
      resolution: {
        label: "Rozlíšenie",
        description: "Časový rámec hodnotenia",
      },
    },
    response: {
      runId: "ID spustenia",
      eligible: "Možno testovať",
      ineligibleNodes: "Uzly bez podpory spätného testu",
    },
    widget: {
      eligible: "Možno testovať",
      notEligible: "Nemožno testovať",
      runLabel: "Spustenie:",
      ineligibleNodesLabel: "Uzly bez podpory spätného testu:",
      ineligibleNodesHint:
        "Tieto uzly nepodporujú spätný test. Chýbajú uložené údaje, časové rozlíšenie nie je kompatibilné alebo sa vyhodnocujú výhradne skriptom.",
    },
    success: {
      title: "Spätný test dokončený",
      description: "Spätný test sa úspešne dokončil",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: {
        title: "Chyba servera",
        description: "Spätný test zlyhal",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre",
      },
      notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
      conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
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
