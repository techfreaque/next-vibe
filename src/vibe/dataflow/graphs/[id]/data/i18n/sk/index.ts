import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Detail grafu",
    titleShort: "Údaje grafu",
    description: "Zobraziť graf s ukazovateľmi a signálmi",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      resolution: {
        label: "Rozlíšenie",
        description: "Dĺžka časového intervalu pre časový rad",
      },
      cursor: {
        label: "Kurzor",
        description:
          "Čas najstaršieho načítaného bodu na postupné načítavanie údajov",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Názov",
        description: "Opis",
        ownerType: "Typ vlastníka",
        isActive: "Aktívny",
        createdAt: "Čas vytvorenia",
        config: "Nastavenia",
      },
      series: {
        nodeId: "ID uzla",
        timestamp: "Časová značka",
        value: "Hodnota",
      },
      signals: {
        nodeId: "ID uzla",
        timestamp: "Časová značka",
        fired: "Aktivované",
      },
    },
    widget: {
      loading: "Načítava sa graf…",
      back: "Späť",
      active: "Aktívny",
      inactive: "Neaktívne",
      nodes: "uzly",
      trigger: "Spúšťač",
      backtest: "Spätný test",
      edit: "Upraviť",
      archive: "Archivovať",
      promote: "Nastaviť ako systémový",
      signal: "Signál",
      noData: "Žiadne údaje v tomto rozsahu",
      loadingEarlierData: "Načítavajú sa staršie údaje…",
    },
    success: {
      title: "Graf načítaný",
      description: "Graf sa úspešne načítal",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať graf",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné ID",
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
