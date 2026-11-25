import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Registrácie",
  titleShort: "Registrácie",
  description:
    "Zistite, odkiaľ prichádzajú noví používatelia, koľkí overili e-mail, zostali aktívni či zaplatili a kto čerpá bezplatné kredity. Údaje porovnávame s predošlým obdobím. Kliknutím na kartu alebo riadok zobrazíte príslušné účty.",
  category: "Používatelia",
  tag: "Štatistiky",
  response: {
    window: "Obdobie",
    kpis: "Hlavné ukazovatele",
    totals: "Súčty",
    signupTrend: "Vývoj registrácií",
    activityTrend: "Vývoj aktivity",
    funnel: "Od registrácie k platbe",
    byChannel: "Podľa kanála",
    byRefCode: "Podľa kódu odporúčania",
    byPlan: "Predplatitelia podľa plánu",
    byLocale: "Podľa jazyka a regiónu",
    freeBurners: "Najvyššia spotreba bez platby",
  },
  widget: {
    cohortNote:
      "Výsledky k dnešnému dňu. Používatelia so staršou registráciou mali viac času overiť e-mail, využiť kredity či zaplatiť.",
    activityToggle: "Aktivita účtov",
    reviewUnverified: "Skontrolovať neoverené registrácie ({{count}})",
    planLapsed: "Predplatné sa skončilo",
    planPacks: "Iba balíky kreditov",
    groups: {
      abuse: "Zneužitie",
      signups: "Registrácie v tomto období",
      accounts: "Všetky účty podľa filtrov za toto obdobie",
    },
    cliHint:
      "Účty k týmto registráciám: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Počítajú sa štatistiky…",
    filters: "Filtre",
    openUsers: "Zobraziť účty",
    empty: "V tomto období sa nikto nezaregistroval.",
    noJourney: "(nesleduje sa)",
    noRefCodes: "V tomto období sa nikto nezaregistroval cez kód odporúčania.",
    noSubscribers: "V tejto skupine nie sú žiadni aktívni predplatitelia.",
    noBurners: "V tomto období nikto nečerpal bezplatné kredity.",
    signedUpOn: "registrácia {{date}}",
    banned: "Zablokovaní",
    unverified: "Neoverení",
    kpi: {
      revenuePerPayerHint: "Tržby za obdobie vydelené počtom platiacich účtov",
      revenuePerPayer: "Tržby na platiaci účet",
      revenuePeriod: "Tržby za obdobie",
      activatedRate: "Minuté kredity",
      signups: "Registrácie",
      signupsHint:
        "Registrácie v tomto období. Počet účtov zodpovedajúcich filtrom za celý čas: {{total}}.",
      verifiedRate: "Overení",
      paidConversion: "Podiel platiacich",
      ofSignups: "{{count}} z {{total}} registrácií",
      activeUsers: "Aktívne účty",
      activeHint:
        "Všetky účty podľa filtrov, ktoré v tomto období čerpali kredity",
      payingUsers: "Platiace účty",
      payingHint: "Všetky účty podľa filtrov, ktoré v tomto období zaplatili",
      revenue: "Tržby",
      revenueHint:
        "Úspešné platby všetkých účtov podľa filtrov za zvolené obdobie v USD",
      freeBurn: "Spotreba bezplatných kreditov",
      freeBurnHint:
        "Kredity minuté účtami, ktoré nikdy nezaplatili. Počet účtov: {{count}}.",
      banned: "Zablokované nové účty",
      bannedHint: "Účty založené v tomto období, ktoré sú teraz zablokované",
    },
    series: {
      paid: "Zaplatili",
      verified: "Overení bez platby",
      unverified: "Neoverení bez platby",
      active: "Aktívne účty",
      paying: "Platiace účty",
    },
    funnel: {
      paid: "Zaplatili",
      active: "Minuté kredity",
      verified: "Overený e-mail",
      signups: "Registrácia",
    },
    charts: {
      signups: "Registrácie",
      signupsHint:
        "Nové účty v jednotlivých intervaloch podľa toho, čo od registrácie urobili. Kliknutím na stĺpec zobrazíte účty.",
      activity: "Aktivita",
      activityHint:
        "Všetky účty podľa filtrov v jednotlivých intervaloch. Legenda uvádza počet jedinečných účtov za celé obdobie.",
      funnel: "Čo nasledovalo po registrácii",
      funnelHint:
        "Koľko registrácií z tohto obdobia dosiahlo jednotlivé míľniky. Súhrnné karty vyššie uvádzajú rovnaké počty.",
      byChannel: "Registrácie podľa kanála prvej návštevy",
      byChannelHint:
        "Kanál, z ktorého používatelia prišli prvýkrát. Tržby zahŕňajú ich platby vo vybranom období.",
      byRefCode: "Registrácie podľa kódu odporúčania",
      byRefCodeHint:
        "Registrácie podľa kódu, ktorému sa pripísalo odporúčanie, prípadne podľa kódu z prvej návštevy. Počty môžu byť vyššie ako pri kanáloch s predponou ref:.",
      byPlan: "Platiace účty podľa plánu",
      byPlanHint:
        "Účty, ktoré v tomto období zaplatili, a tržby z ich platieb. Súčty zodpovedajú kartám platiacich účtov a tržieb.",
      byLocale: "Registrácie podľa jazyka a regiónu",
      freeBurners: "Najvyššia spotreba bez platby",
      freeBurnersHint:
        "Najvyššia spotreba kreditov v tomto období na účtoch bez jedinej platby",
    },
    columns: {
      ofSignups: "% registrácií",
      accounts: "Účty",
      milestone: "Míľnik",
      active: "Minuté kredity",
      creditsGranted: "Pridelené",
      creditsSpentTotal: "Celé obdobie",
      creditBalance: "Zostatok",
      signups: "Registrácie",
      verified: "Overení",
      paid: "Zaplatili",
      conversion: "Konverzia",
      revenue: "Tržby za obdobie",
      channel: "Kanál",
      refCode: "Kód odporúčania",
      plan: "Plán",
      subscribers: "Účty",
      revenueWindow: "Tržby",
      locale: "Jazyk a región",
      account: "Účet",
      creditsSpent: "V tomto období",
    },
    definitions:
      "Predvolene sa vylúčia správcovia a testovacie domény. Za aktívny sa považuje účet, ktorý čerpal kredity z vlastnej alebo prepojenej peňaženky návštevníka. Tržby sa prepočítajú na USD pevnými kurzami. Do konverzií sa počítajú platby uskutočnené kedykoľvek po registrácii.",
  },
  errors: {
    validation: {
      title: "Neplatná požiadavka na štatistiky",
      description: "Skontrolujte obdobie a dátumy",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete zobraziť štatistiky, prihláste sa",
    },
    forbidden: {
      title: "Len pre správcov",
      description: "Na zobrazenie štatistík potrebujete rolu správcu",
    },
    notFound: {
      title: "Žiadne údaje",
      description: "Za zvolené obdobie nie sú žiadne údaje",
    },
    server: {
      title: "Štatistiky sa nepodarilo vypočítať",
      description: "Server nedokázal vypočítať štatistiky používateľov",
    },
    network: {
      title: "Chyba siete",
      description: "So serverom sa nepodarilo spojiť",
    },
    unknown: {
      title: "Neočakávaná chyba",
      description: "Pri výpočte štatistík sa vyskytla chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Požiadavka je v rozpore s aktuálnymi údajmi",
    },
  },
  success: {
    title: "Štatistiky sú pripravené",
    description: "Štatistiky používateľov sa vypočítali",
  },
};
