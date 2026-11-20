import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Prodotti",

  // Enums
  enums: {
    productType: {
      service: "Servizio",
      physical: "Fisica",
      digital: "Digitale",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Puoi iniziare gratis. Hai {{freeCredits}} crediti al mese senza account, {{freeCreditsSignedIn}} con un account gratuito e {{freeCreditsMax}} se ti iscrivi anche alla newsletter. Ci sono quattro piani mensili: {{subCredits}} crediti a {{subPrice}}, {{plusCredits}} a {{plusPrice}}, {{proCredits}} a {{proPrice}} e {{ultraCredits}} a {{ultraPrice}}. Con un abbonamento puoi ricaricare quando vuoi con pacchetti senza scadenza da {{packCredits}} crediti a {{packPrice}}.",

  // Free tier product
  free: {
    name: "Piano gratuito",
    description: "Inizia con crediti gratuiti. Non serve una carta.",
  },

  // Subscription product
  subscription: {
    name: "Starter",
    description:
      "{{subCredits}} crediti al mese da usare con tutti i {{modelCount}} modelli di IA",
    longDescription:
      "Abbonamento mensile da {{subCredits}} crediti per tutti i {{modelCount}} modelli di IA senza censura",
    price: "Prezzo dell’abbonamento mensile",
    cta: "Abbonati",
    features: {
      credits: "{{subCredits}} crediti al mese",
      allModels: "Tutti i {{modelCount}} modelli di IA",
      allFeatures: "Tutte le funzioni incluse",
      cancel: "Disdici quando vuoi",
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
    name: "Pacchetto di crediti",
    description: "Ricarica il tuo piano. I crediti non scadono mai.",
    longDescription:
      "Ti restano pochi crediti prima del rinnovo? Aggiungi un pacchetto. I crediti si sommano a quelli mensili e non scadono mai.",
    features: {
      credits: "{{packCredits}} crediti per pacchetto",
      allModels: "Tutti i {{modelCount}} modelli di IA inclusi",
      allFeatures: "Tutte le funzioni incluse",
      multiple: "Acquista più pacchetti",
      permanent: "I crediti non scadono mai",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "Pacchetto di crediti grande (ritirato)",
    description:
      "Non è più in vendita. I crediti già acquistati restano validi.",
  },
};
