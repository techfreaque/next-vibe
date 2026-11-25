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
    title: "Konverzný lievik",
    titleShort: "Konverzný lievik",
    description:
      "Kontakty vytvorené v období a ich dosiahnuté kroky: človek, prvý čet, registrácia, potvrdenie e-mailu a platba. Rozdelenie podľa kanála, zdroja alebo kódu odporúčania. Kliknutím na krok zobrazíte príslušné kontakty.",
    response: {
      window: "Obdobie",
      dimensionUsed: "Dimenzia segmentu",
      steps: "Kroky lievika",
      previousSteps: "Kroky v predchádzajúcom období",
      rates: "Miera konverzie",
      segments: "Lievik podľa segmentu",
      trend: "Vývoj kohort",
      signupSteps: "Kroky registrácie za obdobie",
      previousSignupSteps: "Kroky registrácie za predchádzajúce obdobie",
      signupSegments: "Kroky registrácie podľa segmentu",
      signupTrackedSince: "Kroky registrácie sledujeme od",
      wallSteps: "Prekážky konverzie za obdobie",
      previousWallSteps: "Prekážky konverzie za predchádzajúce obdobie",
      wallSegments: "Prekážky konverzie podľa segmentu",
      wallTrackedSince: "Prekážky konverzie sledujeme od",
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
        description: "Prehľad konverzného lievika sa nepodarilo vypočítať.",
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
      description: "Prehľad konverzného lievika sa načítal.",
    },
  },
  widget: {
    wallTitle: "Prekážky konverzie",
    wallSubtitle:
      "Ľudia, ktorých zastavila prekážka, sa počítajú ku dňu, keď na ňu narazili. Každého počítame pri každej prekážke iba raz.",
    wallTrackedHint:
      "Sledujeme od {{date}}. Skoršie prekážky sme nezaznamenávali.",
    creditWallGuests: "Hostia bez kreditov",
    creditWallAccounts: "Účty bez kreditov",
    consentDeclined: "Vek 18+ nepotvrdený",
    creditWallHint:
      "Odoslanie bolo zamietnuté a zobrazilo sa upozornenie na nedostatok kreditov",
    consentDeclinedHint: "Dialóg potvrdenia veku zavreli bez súhlasu",
    wallSegmentsTitle: "Prekážky podľa segmentu",
    wallSegmentsSubtitle: "Rovnaké prekážky rozdelené podľa vybranej dimenzie.",
    wallEmpty: "V tomto období nikto nenarazil na prekážku.",
    signupTitle: "Potvrdenie registrácie",
    signupSubtitle:
      "Počet kontaktov pri každom kroku sa počíta ku dňu, keď ho vykonali. Pokles ukazuje, pri ktorom kroku sa registrácie zastavujú.",
    signupTrackedHint:
      "Sledujeme od {{date}}. Pri starších registráciách sme evidovali iba neúspechy.",
    started: "Začaté",
    emailSent: "E-mail odoslaný",
    sendFailed: "Odoslanie zlyhalo",
    bounced: "Vrátené",
    expired: "Uplynula platnosť",
    expiredHint: "Odoslanie zlyhalo: {{failed}} · Pripomenuté: {{reminded}}",
    reminded: "Pripomenuté",
    confirmed: "Potvrdené",
    confirmRate: "Miera potvrdenia",
    ofStarted: "{{count}} z {{total}} začatých",
    signupSegmentsTitle: "Kroky registrácie podľa segmentu",
    signupSegmentsSubtitle: "Rovnaké kroky rozdelené podľa vybranej dimenzie.",
    signupEmpty: "V tomto období neprebehli žiadne registrácie.",
    signupLost: "Nedokončené pri e-maile",
    signupLostHint:
      "Pred potvrdením sa e-mail vrátil, nepodarilo sa ho odoslať alebo vypršala platnosť potvrdzovacieho odkazu",
    loading: "Načítava sa konverzný lievik…",
    cohortHint: "Vytvorené kontakty celkom: {{count}}",
    signupRate: "Podiel registrácií",
    payRate: "Podiel platiacich",
    overallRate: "Od kontaktu k platiacemu",
    overallShort: "Na platiacich",
    ofHumans: "{{count}} z {{total}} kontaktov bez robotov",
    ofSignups: "{{count}} z {{total}} registrácií",
    funnelTitle: "Konverzný lievik kohorty",
    funnelSubtitle:
      "Lievik pre kontakty bez robotov (prehliadač alebo chýbajúci identifikátor klienta). Roboty a všetky kontakty sú v prvej karte.",
    trendTitle: "Kohorta podľa dňa vytvorenia",
    trendSubtitle: "Kontakty bez robotov a počet konverzií z nich.",
    segmentsTitle: "Lievik podľa segmentu",
    segmentsSubtitle:
      "Podiely sa počítajú z kontaktov po vylúčení robotov. Kliknutím na riadok zobrazíte príslušné kontakty.",
    filtersTitle: "Segment",
    filtersSubtitle: "Filter zúži všetky ukazovatele na tejto stránke.",
    apply: "Použiť",
    empty: "V tomto období nie sú žiadne kontakty.",
  },
};
