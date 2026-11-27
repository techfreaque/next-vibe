import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  breadcrumbs: { home: "Home" },
  meta: {
    defaultTitle: "unbottled.ai: Chat non censurata AI",
    category: "AI piattaforma di chat",
    description:
      "Sperimenta conversazioni AI veramente non censurate con modelli {{modelCount}}. Nessun filtro, nessuna restrizione, solo onesto AI.",
    imageAlt: "unbottled.ai: Piattaforma di Chat non censurata AI",
    keywords:
      "uncensored AI, AI chat, GPT-4, Claude, Gemini, AI modelli, senza filtri, onesto AI, conversazioni AI",
  },
  structuredData: {
    app: {
      description:
        "chat AI con modelli {{modelCount}} da laboratori {{providerCount}}: mainstream, aperto e non censurato. Scegli il livello di filtro per chat. Paga per uso con crediti. Open source e self-hostable.",
      freeOffer:
        "{{guest}} crediti gratuiti al mese senza un account, {{signedIn}} con un account gratuito, {{max}} con un account gratuito e la newsletter. Non c'e' bisogno di una carta.",
      yearlyName: "Abbonamento annuale",
      yearlyDescription:
        "Crediti {{subCredits}} al mese, fatturati annualmente",
    },
    pricing: {
      name: "Piani e crediti {{appName}}",
      description:
        "Crediti gratuiti ogni mese, quattro piani mensili e pacchetti per ricaricare. Un solo saldo per {{modelCount}} modelli di chat e per i modelli di immagini, video, musica e voce.",
    },
    organization: {
      types: {
        organization: "Organizzazione",
        contactPoint: "Punto di contatto",
      },
      contactPoint: {
        contactType: "Servizio clienti",
      },
    },
  },
  constants: {
    languages: {
      it: "Italiano",
      es: "Spagnolo",
      sk: "Slovacco",
      hi: "Hindi",
      en: "Inglese",
      de: "Tedesco",
      pl: "Polacco",
      fr: "Francese",
    },
  },
};
