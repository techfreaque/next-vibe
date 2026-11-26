import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  platformSummary: {
    grossReceipts: "Prijaté platby",
    refunds: "Vrátené platby",
    netReceipts: "Príjmy po vrátení platieb",

    valuationBasis:
      "Marža je cenníková hodnota kreditov po odpočítaní nákladov dodávateľa. Zahŕňa len využitie so zaznamenanými nákladmi.",
    valuationCost: "Odhadované náklady na AI",
    valuationMargin: "Odhadovaná marža z používania AI",
    newAccount: "Zaregistrovaný účet",
    receivedPayment: "Prijatá platba",
    completedTask: "Naplánovaná úloha dokončená",
    operations: "Prevádzka",
    emptyActivity: "V tomto období nebola zaznamenaná žiadna aktivita.",
    period: "Posledných 30 dní v porovnaní s predchádzajúcimi 30 dňami",
    retry: "Skúsiť znova",
    title: "Prehľad platformy",
    description:
      "Skontrolujte získavanie zákazníkov, výnosy a stav služieb za posledných 30 dní.",
    unavailable: "Údaj nie je dostupný",
    recent: "Posledná aktivita",
  },
  category: "Analytika",
  tags: {
    analytics: "Analytika",
    overview: "Prehľad",
  },
  get: {
    title: "Prehľad podnikania",
    titleShort: "Prehľad",
    description:
      "Návštevnosť, kontakty, registrácie, platiaci zákazníci, tržby, náklady na AI a upozornenia za vybrané obdobie v porovnaní s predchádzajúcim. Každé číslo otvorí príslušný prehľad.",
    response: {
      window: "Obdobie",
      generatedAt: "Stav údajov k",
      acquisition: "Získavanie kontaktov",
      referral: "Odporúčania",
      money: "Financie",
      ops: "Prevádzka",
    },
    widget: {
      kpi: {
        visits: "Návštevy od ľudí",
        humanLeads: "Nové kontakty",
        botLeadsHint: "Vylúčené kontakty od botov: {{count}}",
        botVisitsHint: "Vylúčené návštevy botov: {{count}}",
        excludedLeadsHint:
          "Vylúčené kontakty od botov: {{bots}}. Vylúčené kontakty neznámeho typu: {{unknown}}.",
        excludedVisitsHint:
          "Vylúčené návštevy botov: {{bots}}. Vylúčené návštevy neznámeho typu: {{unknown}}.",
        creditSpendHintNoPrevCost:
          "Náklady na služby poskytovateľov: {{cost}} (za predchádzajúce obdobie chýbajú údaje). Spotreba hostí: {{guests}}.",
        creditSpendHintNoCompare:
          "Náklady na služby poskytovateľov: {{cost}}. Spotreba hostí: {{guests}}.",
        payersHint: "Počet rôznych zákazníkov, ktorí v danom období zaplatili",
        signups: "Registrácie",
        signupRateHint: "{{rate}} z nových kontaktov",
        payers: "Zákazníci, ktorí zaplatili",
        revenue: "Tržby",
        revenueHint: "Prijaté platby, približne v USD",
        revenueNetHint:
          "Prijaté platby, približne v USD. Po odpočítaní nákladov na AI: {{net}}.",
        creditSpend: "Spotreba AI (spotrebované kredity)",
        guestSpendHint: "Spotreba hostí: {{amount}}",
        creditSpendHint:
          "Náklady na služby poskytovateľov: {{cost}} (predtým {{previous}}). Spotreba hostí: {{guests}}.",
        margin: "Marža z používania AI",
        marginPartial: "Marža za AI (čiastočné údaje)",
        marginHint:
          "Náklady na služby poskytovateľov: {{cost}}. Marža je rozdiel medzi vyúčtovanou sumou a nákladmi pri položkách so známymi nákladmi.",
        marginBaseHint:
          "Pokrytie údajmi o nákladoch: {{rate}} z vyúčtovanej spotreby {{base}}. Náklady na služby poskytovateľov: {{cost}}.",
        marginRateHint:
          "Marža {{margin}} z vyúčtovanej spotreby {{base}} so známymi nákladmi ({{coverage}} celkovej spotreby).",
        errors: "Nevyriešené chyby",
        errorsHint: "Počet výskytov za obdobie: {{count}}",
        botShare: "Podiel kontaktov od botov",
        botShareHint:
          "Kontakty od botov: {{count}}. Hlavný zdroj nájdete v časti Vyžaduje pozornosť.",
        botShareTopHint:
          "Kontakty od botov: {{count}}. Najvýraznejší nárast v rozsahu IP: {{prefix}}.",
      },
      trafficChart: "Kontakty od ľudí a registrácie",
      trafficChartHint: "Bez botov",
      moneyChart: "Tržby",
      moneyChartHint: "Prijaté platby podľa časových intervalov",
      series: {
        visits: "Návštevy",
        leads: "Nové kontakty",
        signups: "Registrácie",
        revenueUsd: "Tržby",
        spendUsd: "Vyúčtovaná spotreba AI",
        upstreamCostUsd: "Náklady na služby poskytovateľa",
      },
      sources: "Zdroje kontaktov pri prvej návšteve",
      sourcesDimension: "Kanál",
      sourcesHint:
        "Aktivita v tomto období podľa kanála, cez ktorý človek prišiel prvýkrát",
      referralsHint:
        "Kliknutia, registrácie a platby pripísané ku kódu v tomto období",
      leadShare: "Podiel kontaktov",
      revenueShare: "Podiel tržieb",
      footerSources:
        "Tržby v týchto riadkoch: {{rows}} z celkovej sumy {{total}} prijatej za obdobie",
      footerReferrals:
        "Ku kódom sa pripísalo {{rows}} z celkovej sumy {{total}} prijatej za obdobie. Pripísaná suma slúži na výpočet provízií.",
      referrals: "Najúspešnejšie kódy odporúčaní",
      referralsDimension: "Kód",
      columns: {
        leads: "Kontakty",
        signups: "Registrácie",
        payers: "Platiaci zákazníci",
        clicks: "Kliknutia",
        revenueUsd: "Tržby",
        conversion: "Podiel kontaktov, ktoré sa zaregistrovali",
        clickToSignup: "Podiel kliknutí, ktoré viedli k registrácii",
      },
      alerts: {
        severity: { high: "Vysoká", medium: "Stredná", low: "Nízka" },
        title: "Vyžaduje pozornosť",
        none: "Za toto obdobie bez upozornení.",
        abuse:
          "Rozsahy IP s prudkým nárastom kontaktov: {{count}}. Najvýraznejší: {{prefix}} (počet kontaktov: {{leads}}).",
        payouts: "Čakajúce žiadosti o výplatu: {{count}} (spolu {{amount}})",
        tasks: "Zlyhávajúce naplánované úlohy: {{count}}",
        connections: "Vzdialené pripojenia s problémami: {{count}}",
        costCoverage:
          "Náklady na služby poskytovateľov sú známe len pre {{coverage}} spotreby AI. Marža vychádza z tejto časti.",
        unattributed: "Tržby bez známeho zdroja: {{share}} ({{amount}})",
        errors:
          "Nevyriešené chyby: {{count}}. Výskyty v období: {{occurrences}}.",
        errorsSince:
          "Nevyriešené chyby: {{count}}. Výskyty od {{date}}: {{occurrences}}. Od tohto dátumu sú dostupné denné počty.",
      },
      open: {
        acquisition: "Prehľad získavania kontaktov",
        funnel: "Konverzný lievik",
        referrals: "Prehľad odporúčaní",
        revenue: "Prehľad tržieb",
        usage: "Prehľad spotreby AI",
        errors: "Záznamy chýb",
      },
      unavailable: "Túto časť sa nepodarilo načítať.",
      asOf: "Stav údajov k {{time}}. Vyrovnávacia pamäť ich uchováva jednu minútu.",
      loading: "Načítava sa prehľad",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Ak chcete zobraziť prehľad podnikania, prihláste sa ako správca.",
      },
      validation: {
        title: "Neplatné obdobie",
        description: "Skontrolujte obdobie a dátumy.",
      },
      server: {
        title: "Prehľad sa nepodarilo vytvoriť",
        description: "Prehľad sa nepodarilo vypočítať. Skúste znova.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Pri načítavaní prehľadu nastala chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru.",
      },
      forbidden: {
        title: "Iba pre správcov",
        description: "Prehľad podnikania môžu zobraziť iba správcovia.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Prehľad nie je k dispozícii.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv zmeny uložte alebo zrušte.",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sa počas načítavania zmenili. Skúste znova.",
      },
    },
    success: {
      title: "Prehľad načítaný",
      description: "Prehľad podnikania za vybrané obdobie.",
    },
  },
};
