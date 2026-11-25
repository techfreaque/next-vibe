import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  breadcrumbs: { home: "Domov" },
  meta: {
    defaultTitle: "unbottled.ai: Necenzurovaný čet s AI",
    category: "Platforma na čet s AI",
    description:
      "Vyberte si z ponuky {{modelCount}} modelov AI. Rozprávajte sa so známym modelom alebo skúste model bez filtrov, ktorý odpovie aj na citlivé otázky.",
    imageAlt: "unbottled.ai: Platforma na necenzurovaný čet s AI",
    keywords:
      "necenzurovaná AI, čet s AI, GPT-4, Claude, Gemini, modely AI, bez filtrov, priame odpovede AI, rozhovory s AI",
  },
  structuredData: {
    app: {
      description:
        "V čete nájdeš {{modelCount}} modelov od {{providerCount}} tímov. Vybrať si môžeš aj otvorené a necenzurované modely. Úroveň filtrovania si vyberáš pre každý čet zvlášť. Kreditmi platíš podľa spotreby. Kód je otvorený a platformu môžeš prevádzkovať aj u seba.",
      freeOffer:
        "Každý mesiac dostaneš kredity zadarmo: {{guest}} bez účtu, {{signedIn}} s bezplatným účtom a {{max}} s bezplatným účtom a odberom noviniek. Kartu nepotrebuješ.",
      yearlyName: "Ročné predplatné",
      yearlyDescription: "{{subCredits}} kreditov mesačne pri ročnej platbe",
    },
    pricing: {
      name: "Predplatné a kredity na {{appName}}",
      description:
        "Bezplatné mesačné kredity, štyri programy predplatného a balíky na doplnenie kreditu. Jeden zostatok pre {{modelCount}} četových modelov aj modely na tvorbu obrázkov, videa, hudby a hlasu.",
    },
    organization: {
      types: {
        organization: "Organization",
        contactPoint: "ContactPoint",
      },
      contactPoint: {
        contactType: "Zákaznícka podpora",
      },
    },
  },
  constants: {
    languages: {
      it: "Taliančina",
      es: "Španielčina",
      sk: "Slovenčina",
      en: "Angličtina",
      de: "Nemčina",
      pl: "Poľština",
      fr: "Francúzština",
    },
  },
};
