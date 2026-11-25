import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Spotreba kreditov",
    titleShort: "Spotreba",
    description:
      "Vývoj spotreby kreditov podľa účtov a návštevníkov, bezplatných prídelov a balíkov, modelov, funkcií a poskytovateľov. Zahŕňa náklady u poskytovateľov, maržu a účty s najvyššou spotrebou.",
    tags: {
      usage: "spotreba kreditov",
      margin: "marža",
    },
    fields: {
      actor: {
        label: "Typ používateľa",
        description: "Účty, návštevníci bez účtu alebo obe skupiny",
      },
      creditKind: {
        label: "Kredity",
        description: "Bezplatný mesačný prídel, kredity z balíkov alebo oboje",
      },
      model: {
        label: "Model",
        description: "Iba spotreba modelu s týmto ID",
      },
      feature: {
        label: "Funkcia",
        description:
          "Iba spotreba tejto funkcie, napríklad chat alebo tvorba obrázkov",
      },
      provider: {
        label: "Poskytovateľ modelu",
        description: "Iba spotreba spracovaná týmto poskytovateľom",
      },
      includeInternal: {
        label: "Zahrnúť účty správcov",
        description: "Započítať aj spotrebu účtov správcov",
      },
    },
    response: {
      window: "Obdobie",
      appliedFilters: "Použité filtre",
      kpis: "Kľúčové údaje",
      spendByActor: "Spotreba podľa typu používateľa",
      spendByKind: "Spotreba podľa druhu kreditov",
      costVsSpend: "Hodnota spotreby a náklady u poskytovateľov",
      byModel: "Podľa modelu",
      byFeature: "Podľa funkcie",
      byProvider: "Podľa poskytovateľa modelu",
      featureLabels: "Názvy funkcií",
      topSpenders: "Najvyššia spotreba",
    },
    errors: {
      validation: {
        title: "Neplatné filtre",
        description: "Skontrolujte obdobie a filtre a skúste znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Na zobrazenie spotreby kreditov sa prihláste ako správca.",
      },
      forbidden: {
        title: "Iba pre správcov",
        description: "Spotrebu kreditov môžu zobraziť iba správcovia.",
      },
      notFound: {
        title: "Nič sa nenašlo",
        description: "Žiadne údaje o spotrebe nezodpovedajú tejto požiadavke.",
      },
      server: {
        title: "Prehľad sa nepodarilo vytvoriť",
        description:
          "Prehľad spotreby kreditov sa nepodarilo vytvoriť. Skúste znova.",
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
      description: "Spotreba kreditov načítaná",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Bez zaznamenaných údajov",
      paidShareHint2:
        "Podiel zakúpených balíkov a predplatného na spotrebe so známym zdrojom. Neznámy zdroj: {{missing}}.",
      costedPct: "Podiel so známymi nákladmi (%)",
      paidShare: "Podiel platených kreditov",
      paidShareHint:
        "Spotreba zo zakúpených balíkov a predplatného v celkovej hodnote {{value}}",
      freeCostHint3:
        "Náklady u poskytovateľov na bezplatné kredity ({{credits}}). Údaje o nákladoch pokrývajú {{coverage}} spotreby.",
      fundGrants: "Pridelené kredity",
      boughtPct: "Zakúpené balíky (%)",
      subPct: "Predplatné (%)",
      grantsPct: "Pridelené kredity (%)",
      unknownPct: "Neznámy zdroj (%)",
      fundingChart: "Spotreba podľa zdroja kreditov",
      fundingNote:
        "Zdroj kreditov pri každom odpočte: bezplatný prídel, bonus za registráciu alebo newsletter, zakúpený balík, predplatné, odmena za odporúčanie alebo pridelenie správcom. Zdroj sa zapisuje pri odpočte. Chýba iba pri starších údajoch.",
      fundAllowance: "Bezplatný prídel",
      fundPurchased: "Zakúpené",
      fundSubscription: "Predplatné",
      fundBonus: "Pridelené bonusy",
      fundEarned: "Provízie za odporúčania",
      fundUnknown: "Neznámy zdroj",
      fundFreeBonus: "Bonus za registráciu alebo newsletter",
      fundFreeUnknown: "Bezplatné kredity bez zaznamenanej úrovne",
      fundAdminGrant: "Kredity pridelené správcom",
      change: "oproti predch. obdobiu",
      paidPct: "Platené kredity (%)",
      topModel: "najmä {{model}}",
      spendersHint: "Počet používateľov a návštevníkov so spotrebou: {{count}}",
      accountTag: "Účet",
      freeCostHint2:
        "Náklady u poskytovateľov na spotrebu z bezplatného prídelu. Údaje o nákladoch pokrývajú {{coverage}} spotreby.",
      notLoaded: "Prehľad sa nepodarilo načítať. Obnovte ho a skúste znova.",
      freeCost: "Náklady na spotrebu bezplatných kreditov",
      freeCostHint:
        "Náklady u poskytovateľov na spotrebu z bezplatného prídelu, ak sú zaznamenané",
      markup: "Hrubý zisk zo spotreby so známymi nákladmi",
      markupPct: "Marža",
      markupPctHint:
        "Zostatok po odpočítaní nákladov u poskytovateľov. Vychádza z cenníkovej hodnoty $0.01 za kredit, bez ohľadu na prijaté platby.",
      kindNote2:
        "Kredity z balíkov zahŕňajú nákupy, predplatné aj kredity pridelené správcom. Tento prehľad spotreby tieto zdroje nerozlišuje.",
      modelNotRecorded: "model nebol zaznamenaný",
      costedSpend: "Spotreba so zaznamenanými nákladmi",
      costChart:
        "Hodnota spotreby so známymi nákladmi a náklady u poskytovateľov",
      marginHint2: "Zo spotreby so zaznamenanými nákladmi v hodnote {{value}}",
      marginHint:
        "Pri spotrebe v hodnote {{value}} sú známe náklady. Marža je rozdiel tejto hodnoty a nákladov u poskytovateľov.",
      guestPct: "Návštevníci bez účtu (%)",
      freePct: "Bezplatné kredity (%)",
      noCost: "žiadne údaje o nákladoch",
    },
    kpi: {
      creditsSpent: "Minuté kredity",
      spendUsd: "Hodnota spotreby",
      guestShare: "Podiel návštevníkov bez účtu",
      freeShare: "Podiel bezplatných kreditov",
      upstreamCostUsd: "Náklady u poskytovateľov",
      marginUsd: "Hrubá marža",
      marginPct: "Marža",
      activeSpenders: "Používatelia a návštevníci so spotrebou",
    },
    hint: {
      spendUsd:
        "Cenníková hodnota pri $0.01 za kredit. Vyjadruje hodnotu spotreby bez ohľadu na prijaté platby.",
      guestShare: "Spotreba návštevníkov bez účtu",
      freeShare: "Čerpané z bezplatného mesačného prídelu",
      upstreamCostUsd: "Údaje o nákladoch pokrývajú {{coverage}} spotreby",
      marginUsd:
        "Rozdiel hodnoty spotreby a nákladov u poskytovateľov pri položkách so známymi nákladmi",
      marginPct: "Z hodnoty spotreby so známymi nákladmi",
      activeSpenders: "Účty a návštevníci bez účtu, ktorí minuli kredity",
    },
    chart: {
      actor: "Spotreba účtov a návštevníkov bez účtu",
      kind: "Spotreba bezplatného prídelu a kreditov z balíkov",
      kindNote:
        "Kredity z balíkov zahŕňajú nákupy, predplatné a kredity pridelené správcom.",
      cost: "Hodnota spotreby a náklady u poskytovateľov",
      costNote:
        "Náklady u poskytovateľov sú dostupné iba pri odpočtoch, pri ktorých sa zaznamenali.",
    },
    series: {
      users: "Účty",
      guests: "Návštevníci bez účtu",
      free: "Bezplatný prídel",
      pack: "Kredity z balíkov",
      spendUsd: "Hodnota spotreby",
      upstreamCostUsd: "Náklady u poskytovateľov",
    },
    breakdown: {
      model: "Model",
      feature: "Funkcia",
      provider: "Poskytovateľ",
      spender: "Typ používateľa",
      byModel: "Podľa modelu",
      byFeature: "Podľa funkcie",
      byProvider: "Podľa poskytovateľa modelu",
      topSpenders: "Najvyššia spotreba",
      topSpendersHint:
        "Kliknutím na riadok otvoríte účet alebo záznam návštevníka.",
      drillHint: "Kliknutím na riadok nastavíte filter prehľadu.",
    },
    column: {
      credits: "Kredity",
      usd: "Hodnota",
      costUsd: "Náklady",
      marginPct: "Marža",
      spenders: "Používatelia so spotrebou",
      guestShare: "Návštevníci bez účtu",
      freeShare: "Bezplatné",
      transactions: "Odpočty",
    },
    label: {
      noModel: "Nástroje a médiá",
      noFeature: "Nezaznamenané",
      noProvider: "Nezaznamenané",
      chat: "Rozhovor",
      guest: "Návštevník {{id}}",
      guestTag: "bez účtu",
      lastActivity: "posledná spotreba {{date}}",
    },
    filter: {
      actor: "Typ používateľa",
      creditKind: "Kredity",
      model: "Model",
      feature: "Funkcia",
      provider: "Poskytovateľ",
      internal: "Vrátane správcov",
    },
    empty: "V tomto období sa neminuli žiadne kredity.",
    includeInternal: "Zahrnúť správcov",
  },
  enums: {
    actor: {
      all: "Všetci",
      users: "Účty",
      guests: "Návštevníci bez účtu",
    },
    creditKind: {
      all: "Všetky kredity",
      free: "Bezplatné",
      pack: "Všetky kredity z balíkov",
      purchased: "Zakúpené",
      subscription: "Predplatné",
      grants: "Pridelené kredity",
    },
  },
};
