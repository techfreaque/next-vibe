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
    title: "Akvizícia",
    titleShort: "Akvizícia",
    description:
      "Odkiaľ prichádzajú návštevníci a kontakty: kanál, zdroj, odkazujúca stránka, kampaň, vstupná stránka, krajina, zariadenie a rozdelenie na ľudí a roboty. Kliknutím na hodnotu zobrazíte príslušné kontakty.",
    response: {
      window: "Obdobie",
      kpis: "Hlavné ukazovatele",
      trend: "Trend",
      breakdown: "Rozdelenie",
      agents: "Klienti",
      coverage: "Pokrytie sledovania",
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
        description: "Prehľad akvizície sa nepodarilo vypočítať.",
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
      description: "Prehľad akvizície sa načítal.",
    },
  },
  widget: {
    revenue: "Tržby",
    humanVisits: "Návštevy ľudí",
    botVisits: "Návštevy robotov",
    botVisitsHint: "Návštevy robotov: {{count}}",
    unknownLeadsHint:
      "Ďalšie návštevy bez identifikátora klienta (neznáme): {{count}}",
    botsTitle: "Kontakty robotov",
    botsSubtitle:
      "Indexovacie roboty, náhľady a skripty. Kliknutím na stĺpec zobrazíte príslušné kontakty.",
    loading: "Načítava sa prehľad akvizície…",
    coverage:
      "Návštevy sledujeme od {{date}}. Staršie kontakty započítavame, ich návštevy však nemáme zaznamenané.",
    botShareHint: "{{percent}} nových kontaktov",
    leadsTitle: "Kontakty od ľudí",
    leadsSubtitle:
      "Nové kontakty od ľudí. Kliknutím na stĺpec zobrazíte príslušné kontakty.",
    visitsTitle: "Zaznamenané návštevy",
    visitsSubtitle:
      "Zaznamenané príchody ľudí a kontaktov označených ako roboty.",
    conversionsTitle: "Registrácie a platiaci",
    conversionsSubtitle: "Podľa dňa, v ktorom nastal daný krok.",
    breakdownTitle: "Odkiaľ kontakty prichádzajú",
    breakdownSubtitle:
      "Podľa zdroja prvého kontaktu. Kliknutím na riadok zobrazíte príslušné kontakty.",
    agentsTitle: "Kto prichádza",
    agentsSubtitle: "Skupina podľa identifikátora klienta.",
    filtersTitle: "Segment",
    filtersSubtitle: "Filter zúži všetky ukazovatele na tejto stránke.",
    apply: "Použiť",
    empty: "V tomto období nie sú žiadne kontakty.",
    emptyHint: "Vyberte dlhšie obdobie alebo zrušte filtre.",
  },
};
