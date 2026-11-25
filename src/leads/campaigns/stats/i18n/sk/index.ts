import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Výkonnosť kampaní",
  description:
    "Stav odosielania kampaní, správy uviaznuté vo fronte a výsledky jednotlivých e-mailových sérií",
  enums: {
    emailJourneyVariantFilter: {
      all: "Všetky",
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailCampaignStageFilter: {
      all: "Všetky",
    },
    emailCampaignStage: {
      notStarted: "Nespustené",
      initial: "Prvé oslovenie",
      followup1: "Nadväzujúci e-mail 1",
      followup2: "Nadväzujúci e-mail 2",
      followup3: "Nadväzujúci e-mail 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Obnovenie aktivity",
    },
  },
  get: {
    title: "Výkonnosť kampaní",
    titleShort: "Kampane",
    description:
      "Stav odosielania, stav frontu a výsledky e-mailov v čase: odoslané, otvorené, s kliknutím, zrušené odbery, vrátené a neúspešné. Členenie podľa variantu komunikačnej série, fázy a jazykového nastavenia. Kliknutím na hodnotu zobrazíte príslušné kontakty.",
    fields: {
      journeyVariant: {
        label: "Variant e-mailovej série",
        description: "Iba táto e-mailová séria",
        placeholder: "Ľubovoľná e-mailová séria",
      },
      stage: {
        label: "Fáza",
        description: "Iba e-maily z tejto fázy kampane",
        placeholder: "Ľubovoľná fáza",
      },
      locale: {
        label: "Jazykové nastavenie",
        description:
          "Jazykové nastavenie výsledného e-mailu (de-DE) alebo jazyk (de)",
        placeholder: "Ľubovoľné jazykové nastavenie",
      },
    },
    response: {
      variantTrend: "Odoslané podľa e-mailovej série",
      window: "Obdobie",
      engine: "Stav odosielania",
      queue: "Stav frontu",
      kpis: "Hlavné ukazovatele",
      totals: "Súhrn",
      trend: "Odoslané, otvorené a s kliknutím na odkaz",
      problems: "Zlyhania odoslania, vrátené e-maily a zrušené odbery",
      funnel: "E-mailový lievik",
      byVariant: "Podľa variantu e-mailovej série",
      byStage: "Podľa fázy",
      byLocale: "Podľa jazykového nastavenia",
      topErrors: "Najčastejšie chyby odoslania",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie štatistík kampaní sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť štatistiky kampaní",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítavaní štatistík kampaní nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné vstupné parametre",
      },
    },
    success: {
      title: "Štatistiky načítané",
      description: "Štatistiky kampaní sa úspešne načítali",
    },
  },
  widget: {
    noSends: "V tomto období sa neodoslali žiadne e-maily.",
    bounceProcessingOff:
      "Počet vrátených e-mailov môže byť podhodnotený. Spracovanie oznámení o nedoručení je vypnuté.",
    groups: {
      now: "Práve teraz",
      period: "Vo vybranom období",
    },
    stuck: "Bez odoslania za obdobie",
    title: "Výkonnosť kampaní",
    loading: "Načítavajú sa štatistiky kampaní…",
    filters: "Filtre",
    openQueue: "Otvoriť front",
    empty: "V tomto období sa nič neodoslalo.",
    emptySendingOff:
      "V tomto období sa nič neodoslalo. Odosielanie je vypnuté, pozrite stav vyššie.",
    noProblems:
      "V tomto období sa nezaznamenali žiadne zlyhania odoslania, vrátené e-maily ani zrušené odbery.",
    noErrors: "V tomto období neboli žiadne chyby odoslania.",
    sentNoteOff:
      "Nulový počet odoslaní tu znamená vypnuté odosielanie. Aktivitu príjemcov z neho nemožno vyvodiť.",
    errors: {
      duplicate: "Preskočené: duplicitný príjemca",
      statusChange: "Preskočené: stav kontaktu sa zmenil na {{status}}",
    },
    engine: {
      dryRun: "Skúšobný režim",
      dryRunNote: "V skúšobnom režime sa z frontu neodošle žiadny e-mail.",
      delayed: "Odoslanie mešká",
      delayedNote: "Skontrolujte stav úloh cron a plán odosielania.",
      waiting: "Čaká na prvé spustenie",
      waitingNote: "Odosielanie je naplánované a ešte čaká na prvé spustenie.",
      details: "Podrobnosti automatizácie",
      missingSummary: "Automatické odosielanie nemá plán.",
      disabledSummary: "Automatické odosielanie je vypnuté.",
      starterOff:
        "Úloha campaign-starter je tiež vypnutá, takže do e-mailových sérií nevstupujú nové kontakty.",
      otherPath:
        "Tieto správy pochádzajú z hromadného alebo ručného odoslania mimo automatického odosielania.",
      openDispatcher: "Otvoriť nastavenia odosielania",
      neverSent: "Z kampaní sa ešte neodoslal žiadny e-mail.",
      lastSend:
        "Naposledy odoslané {{when}}. Odoslané za posledných 24 h: {{count}}.",
      offTitle: "Odosielanie je vypnuté",
      failingTitle: "Odosielanie zlyháva. Počet zlyhaní za sebou: {{count}}",
      onTitle: "Odosielanie je zapnuté",
      missing:
        "Úloha email-campaigns nemá plán cron. Počet e-mailov, ktoré už mali odísť: {{count}}. Kým úlohu nenaplánujete, zostanú vo fronte.",
      disabled:
        "Úloha email-campaigns je vypnutá. Vo fronte čakajú e-maily na odoslanie ({{count}}).",
      on: "Posledné spustenie {{last}}, ďalšie {{next}}.",
      noError: "Chybové hlásenie sa nezaznamenalo.",
      openDue: "Zobraziť kontakty ({{count}})",
      state: {
        dryRun: "Skúšobný režim",
        delayed: "Odoslanie mešká",
        waiting: "Čaká na prvé spustenie",
        missing: "nenaplánované",
        disabled: "vypnuté",
        failing: "zlyháva",
        running: "beží",
      },
    },
    queue: {
      oldestBiggest:
        "Počet kontaktov: {{emails}}. Najviac e-mailov čaká v sérii {{journey}} ({{count}}).",
      stuckClaims: "Správy uviaznuté po prevzatí na odoslanie",
      stuckClaimsHint:
        "Prevzaté na spracovanie pred viac než hodinou, stále bez potvrdenia",
      stuckDaysHint: "Na odoslanie od {{when}}",
      stuckDays: "Najdlhšie meškanie, dni",
      nothingScheduled: "Nič nie je naplánované",
      dueNow: "E-maily na odoslanie",
      oldest: "Čakajúce kontakty: {{emails}}",
      nothingDue: "Nič nečaká",
      scheduled: "Naplánované na neskôr",
      scheduledHint: "Najbližších 24 h: {{count}}, najbližší termín {{when}}",
    },
    kpi: {
      bouncedOff:
        "Úloha bounce-processor je vypnutá, takže počet vrátených e-mailov môže byť podhodnotený. Podiel z odoslaných: {{rate}}.",
      ofSentRate: "{{rate}} z odoslaných",
      skippedHint:
        "Nezapočítané duplicitné alebo stavom preskočené správy: {{count}}",
      sent: "Odoslané",
      openRate: "Miera otvorenia",
      clickRate: "Miera kliknutí",
      ofSent: "Z odoslaných e-mailov: {{count}}",
      unsubscribed: "Odhlásené z odberu",
      bounced: "Vrátené",
      failed: "Chyby odoslania za obdobie",
    },
    series: {
      sent: "Odoslané",
      opened: "Otvorené",
      clicked: "S kliknutím na odkaz",
      failed: "Chyby odoslania",
      bounced: "Vrátené",
      unsubscribed: "Odhlásené z odberu",
    },
    charts: {
      errorsHint:
        "Iba skutočné zlyhania. Duplicitné alebo stavom preskočené správy sa nezobrazujú: {{count}}",
      variantTrendHint:
        "Počet odoslaných e-mailov za interval podľa variantu e-mailovej série",
      variantTrend: "Odoslané podľa e-mailovej série",
      trend: "Odoslané, otvorené a s kliknutím na odkaz",
      trendHint:
        "Podľa dňa odoslania vidíte počet odoslaných e-mailov a koľko z nich príjemcovia neskôr otvorili alebo v nich klikli na odkaz. Kliknutím na deň zobrazíte príslušné kontakty.",
      problems: "Problémy",
      problemsHint:
        "Počet zlyhaní odoslania, vrátených e-mailov a zrušených odberov za interval",
      funnel: "E-mailový lievik",
      funnelHint: "E-maily odoslané za obdobie a reakcie príjemcov",
      byVariant: "Podľa variantu e-mailovej série",
      byVariantHint:
        "Odoslané za obdobie. Na odoslanie znamená, že teraz čakajú vo fronte.",
      byStage: "Podľa fázy",
      byLocale: "Podľa jazykového nastavenia",
      errors: "Chyby odoslania",
    },
    columns: {
      failed: "Chyby odoslania",
      sent: "Odoslané",
      openRate: "Otvorené",
      clickRate: "Kliknutia",
      unsubscribed: "Odhlásené",
      bounced: "Vrátené",
      due: "E-maily na odoslanie",
      variant: "E-mailová séria",
      stage: "Fáza",
      locale: "Jazykové nastavenie",
      error: "Chyba",
      count: "Počet",
    },
    definitions:
      "Miera otvorenia a kliknutí sa počíta z e-mailov odoslaných vo vybranom období, ktoré príjemcovia otvorili alebo v nich klikli kedykoľvek neskôr. Na odoslanie znamená, že e-mail čaká a naplánovaný čas už uplynul. Odosiela ich iba úloha email-campaigns. Jazykové nastavenie sa berie z výsledného e-mailu, prípadne z jazyka a krajiny kontaktu.",
  },
};
