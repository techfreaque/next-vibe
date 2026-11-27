import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Tržby",
    titleShort: "Tržby",
    description:
      "Tržby z balíkov kreditov, nových predplatných a obnovení podľa spracovateľa platieb, plánu a meny. Zahŕňa vrátené platby, platobné spory, mesačné opakované tržby (MRR), aktívne predplatné a mieru ukončenia.",
    tags: {
      revenue: "príjmy",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Druh",
        description:
          "Kreditné balíčky, nové predplatné, obnovenie, alebo všetky",
      },
      provider: {
        label: "Spracovateľ platieb",
        description: "Iba platby prostredníctvom tohto spracovateľa",
      },
      currency: {
        label: "Mena",
        description: "Iba platby v tejto mene (USD, EUR, PLN)",
      },
      plan: {
        label: "Plán",
        description: "Iba platby a predplatné na tento plán",
      },
      includeInternal: {
        label: "Zahrnúť účty správcov",
        description: "Počet platieb podľa admin účtov príliš",
      },
    },
    response: {
      window: "Obdobie",
      appliedFilters: "Použité filtre",
      kpis: "Kľúčové údaje",
      revenueByKind: "Tržby podľa typu platby",
      revenueByProcessor: "Tržby podľa spracovateľa",
      subscriptionFlow: "Nové vs churted predplatné",
      byPlan: "Podľa plánu alebo produktu",
      byCurrency: "Podľa meny",
      byProcessor: "Spracovateľ",
      recentPayments: "Nedávne platby",
      fxRates: "Sadzby FX do USD",
    },
    errors: {
      validation: {
        title: "Neplatné filtre",
        description: "Skontrolujte obdobie a filtre a skúste znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa ako administrátor vidieť príjmy.",
      },
      forbidden: {
        title: "Iba administrátori",
        description: "Iba administrátori môžu vidieť príjmy.",
      },
      notFound: {
        title: "Nič sa nenašlo",
        description: "Žiadna platba nezodpovedá tejto požiadavke.",
      },
      server: {
        title: "Prehľad sa nepodarilo vytvoriť",
        description: "Správa o príjmoch nemohla byť postavená.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Niečo sa pokazilo pri načítavaní správy.",
      },
      network: {
        title: "Chyba pripojenia",
        description: "Nepodarilo sa pripojiť k serveru.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv použite alebo zahoďte zmeny filtrov.",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sa počas načítavania zmenili. Obnovte prehľad.",
      },
    },
    success: {
      title: "Prehľad je pripravený",
      description: "Tržby načítané",
    },
  },
  widget: {
    loadingReport: "Načítava sa prehľad tržieb…",
    operatingTitle: "Prevádzkové tržby",
    currencyBasis: "Sumy sú uvádzané v približnej hodnote v USD.",
    filterDisclosure: "Filtre",
    extra: {
      grossHint: "Predplatné {{subs}} · balíky {{packs}} · cca. USD",
      newSubsHint:
        "Predplatné začaté v období · Počet prvých platieb: {{count}}",
      churn30Hint: "Ukončené v období · 30-dňová miera ukončenia {{rate}}",
      notLoaded: "Prehľad sa nepodarilo načítať. Obnovte ho a skúste znova.",
      firstPayments: "Prvé platby predplatného",
      openAll: "Otvoriť všetky platby",
      churnChart: "30-dňová miera ukončenia predplatného",
      churnNote:
        "Počet predplatných ukončených za 30 dní pred každým bodom ÷ počet aktívnych predplatných na začiatku týchto 30 dní",
      kindPack: "Balík kreditov",
      kindNew: "Prvá platba predplatného",
      kindRenewal: "Obnova",
      paid: "Zaplatené",
      subscriptionNote:
        "Údaje o predplatnom nezohľadňujú filtre typu platby a meny.",
      netHint:
        "Hrubé tržby po odpočítaní platieb vrátených v období. Spory a poplatky spracovateľa sa neodpočítavajú.",
      mrrHint:
        "Predplatné aktívne na konci obdobia. Ročné plány sa vydelia 12.",
      mrrChart: "MRR v priebehu času",
      mrrNote:
        "Opakované tržby z predplatného aktívneho v jednotlivých časových bodoch.",
      churnRate: "{{rate}} z predplatného aktívneho na začiatku obdobia",
      seriesMrr: "MRR",
      seriesActive: "Aktívne predplatné",
      packUnknown: "Balík kreditov bez údaja o veľkosti",
      filterIgnored: "Bez vplyvu filtra typu platby alebo meny",
      processorAll: "Všetci spracovatelia platieb",
      currencyAll: "Všetky meny",
    },
    group: {
      money: "Financie",
      customers: "Zákazníci a predplatné",
      volume: "Objem platieb",
    },
    kpi: {
      grossRevenueUsd: "Hrubé tržby",
      netRevenueUsd: "Čisté tržby",
      refundsUsd: "Vrátené platby",
      mrrUsd: "MRR",
      payingCustomers: "Platiaci zákazníci",
      activeSubscriptions: "Aktívne predplatné",
      newSubscriptions: "Nové predplatné",
      churnedSubscriptions: "Ukončené",
      renewals: "Obnovenia",
      packPurchases: "Nákupy balíkov",
      disputes: "Spory o platby",
      failedPayments: "Zlyhané platby",
    },
    hint: {
      grossRevenueUsd: "Prijaté platby, približne v USD",
      netRevenueUsd: "Hrubé tržby po odpočítaní platieb vrátených v období",
      refundsUsd: "Platby vrátené v období",
      mrrUsd: "Aktívne predplatné na konci obdobia, ročne / 12",
      payingCustomers: "Účty s aspoň jednou prijatou platbou",
      activeSubscriptions: "Aktívne na konci obdobia",
      newSubscriptions: "Predplatné sa začalo v období",
      churnedSubscriptions: "Predplatné, ktoré sa skončili v období",
      renewals: "Prijaté platby za obnovenie predplatného",
      packPurchases: "Prijaté platby za balíky kreditov",
      disputes: "Spory o platby začaté v období",
      failedPayments: "Platby, ktoré v danom období zlyhali",
    },
    chart: {
      kind: "Tržby podľa typu platby",
      processor: "Tržby podľa spracovateľa",
      flow: "Predplatné: nové a ukončené",
    },
    series: {
      pack: "Balíky kreditov",
      newSubscription: "Nové predplatné",
      renewal: "Obnovenia",
      new: "Nové",
      churned: "Ukončené",
    },
    breakdown: {
      byPlan: "Podľa plánu alebo produktu",
      byCurrency: "Podľa meny",
      byProcessor: "Spracovateľ",
      recent: "Nedávne platby",
      recentHint:
        "Kliknutím na platbu ju zobrazíte medzi transakciami spracovateľa platieb.",
      drillHint: "Kliknutím na riadok nastavíte filter prehľadu.",
      plan: "Plán alebo produkt",
      currency: "Mena",
      processor: "Spracovateľ platieb",
      payment: "Platba",
    },
    column: {
      revenueUsd: "Tržby",
      amount: "Pôvodná suma",
      payments: "Platby",
      customers: "Zákazníci",
      failed: "Neúspešné",
      refundsUsd: "Vrátené platby",
      usd: "USD",
    },
    label: {
      creditPack: "Balík 500 kreditov",
      creditPackLarge: "Balík 2 500 kreditov",
      pack: "Balík kreditov",
      newSubscription: "Nové predplatné, nezaznamenaný plán",
      renewal: "Obnova, nezaznamenaný plán",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Celkový súčet v cca. USD pri statických mierach: {{rates}}.",
    subscriptionNote:
      "Na údaje o predplatnom sa vzťahujú iba filtre podľa spracovateľa platieb a plánu.",
    filter: {
      kind: "Druh",
      provider: "Spracovateľ platieb",
      currency: "Mena",
      plan: "Plán",
      internal: "Vrátane správcov",
    },
    empty: "Žiadne platby v tomto období.",
    includeInternal: "Zahrnúť správcov",
  },
  enums: {
    kind: {
      all: "Všetky",
      pack: "Balíky",
      newSubscription: "Prvé platby",
      renewal: "Obnovenia",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      whop: "Whop",
    },
    paymentStatus: {
      pending: "Čaká na spracovanie",
      processing: "Spracúva sa",
      succeeded: "Úspešná",
      failed: "Neúspešné",
      canceled: "Zrušená",
      refunded: "Vrátená",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
