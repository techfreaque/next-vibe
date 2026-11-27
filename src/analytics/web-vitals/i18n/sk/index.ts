import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analytika",
  tags: {
    performance: "Výkon",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "Dobré",
      needsImprovement: "Treba zlepšiť",
      poor: "Slabé",
    },
    device: {
      mobile: "Mobil",
      desktop: "Desktop",
    },
    pageType: {
      storyHome: "Domov",
      storyPage: "Stránka story",
      blogIndex: "Prehľad blogu",
      blogPost: "Článok na blogu",
      storyCompare: "Porovnanie",
      models: "Zoznam modelov",
      modelDetail: "Stránka modelu",
      modelCompare: "Model proti modelu",
      modelChangelog: "Zmeny modelov",
      skill: "Stránka skillu",
      skills: "Zoznam skillov",
      docs: "Dokumentácia",
      help: "Pomoc",
      pricing: "Cenník",
      create: "Tvorba médií",
      threads: "Chat",
      account: "Účet",
      tools: "Nástroje",
      other: "Ostatné",
    },
  },

  fields: {
    metric: "Metrika",
    value: "Hodnota",
    rating: "Hodnotenie",
    navigationType: "Typ navigácie",
    path: "Cesta stránky",
    device: "Zariadenie",
    metrics: "Merania",
    days: "Dni",
    pageType: "Typ stránky",
    samples: "Merania",
    p75: "p75",
    goodShare: "Dobré",
    poorShare: "Slabé",
  },

  post: {
    title: "Odoslať Web Vitals",
    titleShort: "Odoslať vitals",
    description:
      "Uloží skutočné Core Web Vitals (LCP, INP, CLS, TTFB, FCP) jedného zobrazenia stránky.",
    recorded: "Uložené",
    success: {
      title: "Vitals uložené",
      description: "Merania sú uložené.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals skutočných návštevníkov podľa typu stránky: p75 a podiel dobrých a slabých návštev.",
    empty: "V tomto období zatiaľ nie sú žiadne merania.",
    since: "Od",
    total: "Merania",
    targets: "Ciele pri p75: LCP pod 2,5 s, INP pod 200 ms, CLS pod 0,1.",
    success: {
      title: "Web Vitals načítané",
      description: "Merania skutočných návštevníkov podľa typu stránky.",
    },
  },

  errors: {
    validation: {
      title: "Neplatné merania",
      description: "Skontrolujte odoslané hodnoty.",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa, aby ste videli prehľad.",
    },
    forbidden: {
      title: "Bez prístupu",
      description: "Len pre adminov.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nič sa nenašlo.",
    },
    server: {
      title: "Chyba servera",
      description: "Merania sa nepodarilo spracovať.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Stalo sa niečo neočakávané.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv uložte alebo zahoďte zmeny.",
    },
    conflict: {
      title: "Konflikt",
      description: "Údaje sa medzitým zmenili.",
    },
  },
};
