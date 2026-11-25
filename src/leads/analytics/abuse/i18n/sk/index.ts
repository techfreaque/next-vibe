import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "kontakty",
    analytics: "analytika",
  },
  get: {
    title: "Signály zneužívania",
    titleShort: "Zneužívanie",
    description:
      "Náhle nárasty kontaktov a registrácií z jednej siete alebo od jedného klienta a spotreba bezplatných kreditov návštevníkov, ktorí sa nezaregistrovali. Každý riadok otvorí príslušné kontakty.",
    fields: {
      minLeads: {
        label: "Hranica nárastu",
        description:
          "Počet kontaktov z jednej skupiny za obdobie, od ktorého ide o náhly nárast",
      },
    },
    response: {
      window: "Obdobie",
      groupByUsed: "Zoskupenie podľa",
      minLeadsUsed: "Hranica nárastu",
      kpis: "Hlavné ukazovatele",
      trend: "Kontakty z označených skupín",
      clusters: "Skupiny",
      burners: "Najvyššia spotreba bezplatných kreditov",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa ako správca.",
      },
      validation: {
        title: "Neplatné filtre",
        description: "Skontrolujte obdobie a hodnoty filtrov.",
      },
      server: {
        title: "Prehľad sa nepodarilo vytvoriť",
        description: "Prehľad zneužívania sa nepodarilo vypočítať.",
      },
      unknown: { title: "Neznáma chyba", description: "Niečo sa pokazilo." },
      network: {
        title: "Chyba siete",
        description: "Server nie je dostupný.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Iba pre správcov.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Prehľad neobsahuje údaje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Použite alebo zrušte zmeny filtrov.",
      },
      conflict: {
        title: "Konflikt",
        description: "Údaje sa zmenili. Načítajte ich znova.",
      },
    },
    success: {
      title: "Prehľad je pripravený",
      description: "Prehľad zneužívania sa načítal.",
    },
  },
  widget: {
    fast: "Rýchly nárast",
    noIp: "Bez IP adresy",
    perHour: "Kontakty za hodinu",
    thresholdOption: "Minimum kontaktov: {{count}}",
    loading: "Načítavajú sa signály zneužívania…",
    flaggedPrefixes: "Označené siete",
    flaggedAgents: "Označení klienti",
    thresholdHint: "Minimum kontaktov za obdobie: {{count}}",
    flaggedLeads: "Kontakty pri náhlych nárastoch",
    flaggedShare: "{{percent}} % nových kontaktov",
    freeCredits: "Spotrebované bezplatné kredity",
    freeCreditsHint: "Spotrebovali ich návštevníci bez účtu",
    burners: "Návštevníci so spotrebou",
    burnersHint: "Návštevníci bez účtu, ktorí spotrebovali bezplatné kredity",
    trendTitle: "Kontakty z náhlych nárastov",
    trendSubtitle:
      "Nárast sa započíta, ak počet kontaktov v skupine za obdobie dosiahne hranicu {{count}}.",
    seriesFlagged: "Z náhlych nárastov",
    seriesOther: "Ostatné kontakty",
    clustersIpTitle: "Nárasty podľa siete",
    clustersUaTitle: "Nárasty podľa identifikátora klienta",
    clustersSubtitle:
      "Zoradené podľa počtu kontaktov za hodinu. Rýchly nárast znamená aspoň {{rate}} kontaktov za hodinu. Kliknutím na riadok zobrazíte príslušné kontakty.",
    prefix: "Sieť",
    userAgent: "Identifikátor klienta",
    prefixes: "Počet rôznych sietí",
    agents: "Počet rôznych klientov",
    noClusters:
      "Za toto obdobie žiadna skupina nedosiahla stanovenú hranicu ({{count}}).",
    burnersTitle: "Najvyššia spotreba bezplatných kreditov",
    burnersSubtitle: "Návštevníci bez účtu. Kliknutím zobrazíte kontakt.",
    lead: "Kontakt",
    requests: "Požiadavky",
    noBurners:
      "V tomto období návštevníci bez účtu nespotrebovali žiadne bezplatné kredity.",
    filtersTitle: "Segment",
    filtersSubtitle: "Filter zúži všetky ukazovatele na tejto stránke.",
    apply: "Použiť",
  },
};
