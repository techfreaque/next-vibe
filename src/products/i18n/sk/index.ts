import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produkty",

  // Enums
  enums: {
    productType: {
      service: "Služba",
      physical: "Fyzický tovar",
      digital: "Digitálny produkt",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Bezplatné mesačné kredity: {{freeCredits}} bez účtu, {{freeCreditsSignedIn}} s bezplatným účtom a {{freeCreditsMax}} s účtom a odberom newslettera. Štyri mesačné plány ponúkajú {{subCredits}} kreditov za {{subPrice}}, {{plusCredits}} za {{plusPrice}}, {{proCredits}} za {{proPrice}} a {{ultraCredits}} za {{ultraPrice}}. Predplatitelia si môžu kedykoľvek dokúpiť balík ({{packCredits}} kreditov za {{packPrice}}). Kredity z balíkov neprepadnú.",

  // Free tier product
  free: {
    name: "Bezplatný plán",
    description: "Začni s bezplatnými kreditmi. Platobnú kartu nepotrebuješ.",
  },

  // Subscription product
  subscription: {
    name: "Starter",
    description:
      "Mesačné kredity: {{subCredits}}. Dostupné sú všetky modely AI ({{modelCount}}).",
    longDescription:
      "Mesačné predplatné s kreditmi ({{subCredits}}) na všetky modely AI bez cenzúry ({{modelCount}}).",
    price: "Cena mesačného predplatného",
    cta: "Predplatiť si",
    features: {
      credits: "Kredity mesačne: {{subCredits}}",
      allModels: "Všetky modely AI ({{modelCount}})",
      allFeatures: "Všetky funkcie v cene",
      cancel: "Predplatné môžeš kedykoľvek zrušiť",
    },
  },

  // Higher subscription tiers (credits and prices come from config)
  subscriptionPlus: {
    name: "Plus",
  },
  subscriptionPro: {
    name: "Pro",
  },
  subscriptionUltra: {
    name: "Ultra",
  },

  // Credit pack product
  creditPack: {
    name: "Balík kreditov",
    description: "Dokúp si kredity. Nikdy neprepadnú.",
    longDescription:
      "Míňajú sa ti kredity pred obnovením predplatného? Dokúp si balík. Kredity z balíka pribudnú k mesačným kreditom a nikdy neprepadnú.",
    features: {
      credits: "Kredity v balíku: {{packCredits}}",
      allModels: "V cene sú všetky modely AI ({{modelCount}})",
      allFeatures: "Všetky funkcie v cene",
      multiple: "Kúpiť viac balíkov",
      permanent: "Kredity nikdy neprepadnú",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "Veľký balík kreditov (ukončený predaj)",
    description:
      "Balík už nie je v predaji. Zakúpené kredity zostávajú platné.",
  },
};
