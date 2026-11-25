import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Odporúčania",
  tags: {
    referral: "odporúčania",
    admin: "správca",
    analytics: "analytika",
  },
  enums: {
    sort: {
      revenue: "Tržby",
      commission: "Provízia",
      payers: "Platiaci používatelia",
      signups: "Registrácie",
      leads: "Kontakty",
      clicks: "Kliknutia",
      conversion: "Miera registrácie z kliknutí",
      ownerQueue: "Čakajúce výplaty vlastníkovi",
      ownerFree: "Voľný zostatok vlastníka na výplatu (od najnižšieho)",
      newest: "Najnovší kód",
    },
  },
  get: {
    title: "Prehľad odporúčaní",
    titleShort: "Prehľad",
    description:
      "Všetky kódy odporúčaní a partneri v jednom prehľade. Porovnajte kliknutia, kontakty, registrácie, platiacich, tržby, provízie a čakajúce výplaty s predchádzajúcim obdobím.",
    fields: {
      search: {
        label: "Vyhľadať",
        description: "Kód, označenie alebo e-mail vlastníka",
        placeholder: "Kód, označenie alebo e-mail vlastníka",
      },
      ownerUserId: {
        label: "Vlastník",
        description: "Iba kódy tohto partnera (ID používateľa)",
      },
      activeOnly: {
        label: "Iba aktívne kódy",
        description: "Skryť deaktivované kódy",
      },
      sortBy: {
        label: "Zoradiť kódy podľa",
        description: "Poradie riadkov v tabuľke kódov",
      },
      limit: {
        label: "Zobrazené kódy",
        description: "Najvyšší počet riadkov v tabuľke kódov",
      },
    },
    response: {
      window: "Obdobie",
      kpis: "Hlavné ukazovatele",
      trend: "Trend",
      codes: "Kódy",
      codesTotal: "Kódy zodpovedajúce filtrom",
      overCommittedOwners: "Vlastníci so žiadosťami nad zostatkom",
      payouts: "Čakajúce výplaty",
    },
    widget: {
      kpi: {
        clicks: "Kliknutia",
        clicksHint: "Návštevy z prehliadača s kódom",
        leads: "Kontakty",
        leadsHint: "Návštevníci pripísaní ku kódu",
        signups: "Registrácie",
        signupsHint: "{{rate}} z kliknutí",
        payers: "Platiaci používatelia",
        payersHint: "Odporučení používatelia, ktorí zaplatili v tomto období",
        revenue: "Tržby",
        revenueHint: "Platby odporučených používateľov",
        commission: "Získané provízie",
        commissionHint: "Zadržané: {{pending}} · Potvrdené: {{confirmed}}",
        payoutsPaid: "Vyplatené",
        payoutsPaidHint: "Dokončené v tomto období",
        queue: "Čakajúce výplaty",
        queueHint: "Otvorené žiadosti: {{count}}",
        queueEmpty: "Nič nečaká",
      },
      chart: {
        traffic: "Návštevnosť",
        trafficSub: "Kliknutia a pripísané kontakty",
        conversions: "Konverzie",
        conversionsSub: "Nové registrácie a platiaci používatelia",
        money: "Tržby a provízie",
        moneySub: "USD podľa dátumu platby",
      },
      series: {
        clicks: "Kliknutia",
        leads: "Kontakty",
        signups: "Registrácie",
        payers: "Platiaci používatelia",
        revenue: "Tržby",
        commission: "Provízia",
      },
      table: {
        title: "Kódy",
        subtitle:
          "Zobrazené kódy: {{shown}} z {{total}}. Kliknutím otvoríte prehľad kódu.",
        dimension: "Kód",
        clicks: "Kliknutia",
        leads: "Kontakty",
        signups: "Registrácie",
        payers: "Platiaci",
        conversion: "Miera registrácie z kliknutí",
        revenue: "Tržby",
        commission: "Provízia",
        signupsChange: "Registrácie oproti predchádzajúcemu obdobiu",
        ownerQueue: "Čakajúce výplaty vlastníkovi",
        ownerFree: "Voľný zostatok vlastníka na výplatu",
        inactive: "neaktívny",
        overCommitted: "žiadosti nad zostatkom",
        overCommittedOwners: "Vlastníci so žiadosťami nad zostatkom: {{count}}",
        empty: "Žiadne kódy nezodpovedajú filtrom.",
        sort: "Zoradiť",
      },
      payouts: {
        title: "Výplaty podľa stavu",
        subtitle:
          "Aktuálny stav všetkých žiadostí. Kliknutím na stav otvoríte príslušný zoznam.",
        dimension: "Stav",
        count: "Žiadosti",
        amount: "Suma",
        open: "Otvoriť výplaty",
        empty: "Zatiaľ bez žiadostí o výplatu.",
      },
      filters: {
        search: "Vyhľadať",
        owner: "Vlastník",
        activeOnly: "Iba aktívne",
        searchPlaceholder: "Kód, označenie alebo e-mail vlastníka",
      },
      loading: "Načítava sa prehľad odporúčaní",
      cli: {
        payouts:
          "Otvorené žiadosti o výplatu: {{count}} · Suma spolu: {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Neplatné filtre",
      description: "Skontrolujte obdobie a filtre",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description:
        "Ak chcete zobraziť analytiku odporúčaní, prihláste sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Analytiku odporúčaní môžu zobraziť iba správcovia",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Filtrom nič nezodpovedá",
    },
    conflict: {
      title: "Konflikt",
      description: "Údaje sa pri načítavaní zmenili. Skúste znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Prehľad odporúčaní sa nepodarilo vytvoriť",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zahoďte",
    },
  },
  success: {
    title: "Načítané",
    description: "Prehľad odporúčaní sa načítal",
  },
};
