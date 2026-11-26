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
  get: {
    title: "Prehľad kódu odporúčania",
    titleShort: "Prehľad kódu",
    description:
      "Prehľad jedného kódu odporúčania. Ukazuje vlastníka, prechod od kliknutí ku kontaktom, registráciám a platiacim používateľom, tržby, provízie a výplaty vlastníkovi.",
    fields: {
      code: {
        label: "Kód odporúčania",
        description:
          "Kód, ktorého prehľad chcete zobraziť. Na veľkosti písmen nezáleží",
        placeholder: "Zadajte kód odporúčania",
      },
    },
    response: {
      window: "Obdobie",
      header: "Kód",
      kpis: "Hlavné ukazovatele",
      funnel: "Konverzný lievik",
      trend: "Trend",
      balance: "Zostatok vlastníka",
      earningsByLevel: "Provízie podľa úrovne",
      referredUsers: "Odporučení používatelia",
      referredTotal: "Odporučení používatelia spolu",
      payouts: "Výplaty vlastníkovi",
    },
    widget: {
      periodTitle: "Toto obdobie",
      owner: "Vlastník",
      ownerEmail: "E-mail vlastníka",
      openOwner: "Otvoriť účet vlastníka",
      label: "Označenie",
      noLabel: "Bez označenia",
      bonus: "Bonus pri registrácii",
      bonusValue: "Bonus k prvému plánu: +{{credits}} kred.",
      noBonus: "Žiadne",
      status: "Stav",
      active: "Aktívne",
      inactive: "Neaktívne",
      created: "Vytvorené",
      uses: "Pripísané registrácie",
      editBonus: "Zmeniť bonus",
      reassign: "Presunúť kód",
      kpi: {
        clicks: "Kliknutia",
        leads: "Kontakty",
        signups: "Registrácie",
        signupsHint: "{{rate}} z kliknutí",
        payers: "Platiaci používatelia",
        payersHint: "Odporučení používatelia, ktorí zaplatili v tomto období",
        revenue: "Tržby",
        commission: "Vzniknuté provízie",
        commissionHint:
          "Zadržané do konca lehoty na vrátenie platby: {{pending}}. Potvrdené: {{confirmed}}.",
      },
      funnel: {
        title: "Konverzný lievik",
        subtitle: "Toto obdobie",
        clicks: "Kliknutia",
        leads: "Kontakty",
        signups: "Registrácie",
        payers: "Platiaci používatelia",
      },
      chart: {
        conversions: "Konverzie",
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
      balance: {
        title: "Zostatok vlastníka za celé obdobie",
        confirmed: "Potvrdené provízie",
        pending: "Zadržané počas lehoty na vrátenie platby",
        paidOut: "Vyplatené",
        open: "Vo fronte na výplatu",
        available: "Dostupné pred odpočítaním čakajúcich výplat",
        free: "Voľný zostatok po odpočítaní čakajúcich výplat",
        overCommitted:
          "Súčet otvorených žiadostí prekračuje potvrdený zostatok. Neschvaľujte všetky.",
      },
      levels: {
        title: "Provízie podľa úrovne",
        subtitle: "Z platieb používateľov tohto kódu za dané obdobie",
        dimension: "Úroveň",
        direct: "Priama provízia (vlastník kódu)",
        upline: "Nadradená úroveň {{level}}",
        count: "Platby",
        total: "Získané",
        pending: "Zadržané",
        confirmed: "Potvrdené",
        canceled: "Zrušené",
        empty: "V tomto období nevznikli žiadne provízie.",
      },
      users: {
        title: "Odporučení používatelia",
        subtitle:
          "Za celý čas, od najvyšších platieb. Zobrazené: {{shown}} z {{total}}.",
        dimension: "Používateľ",
        signedUp: "registrácia {{date}}",
        payments: "Platby",
        revenue: "Tržby",
        commission: "Provízia",
        unpaid: "bez platby",
        empty: "S týmto kódom sa ešte nikto nezaregistroval.",
      },
      payouts: {
        title: "Výplaty vlastníkovi",
        subtitle: "Všetky žiadosti tohto partnera",
        dimension: "Žiadosť",
        amount: "Suma",
        requested: "podaná {{date}}",
        processed: "spracovaná {{date}}",
        openAll: "Otvoriť v prehľade výplat",
        empty: "Tento partner ešte nežiadal o výplatu.",
      },
      notFound: "Kód {{code}} neexistuje.",
      pickCode: "Vyberte kód z tabuľky v prehľade alebo ho zadajte vyššie.",
      pickTitle: "Nie je vybraný žiadny kód",
      browseCodes: "Prehliadať kódy",
      subtitle:
        "Kliknutia, registrácie, tržby, provízie a zostatok partnera pre jeden kód.",
      loading: "Načítava sa prehľad kódu",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte kód a obdobie",
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
      title: "Kód sa nenašiel",
      description: "Nenašiel sa zodpovedajúci kód odporúčania",
    },
    conflict: {
      title: "Konflikt",
      description: "Údaje sa pri načítavaní zmenili. Skúste znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Prehľad kódu sa nepodarilo vytvoriť",
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
    codeNotFound: "Kód odporúčania {{code}} neexistuje",
  },
  success: {
    title: "Načítané",
    description: "Prehľad kódu sa načítal",
  },
};
