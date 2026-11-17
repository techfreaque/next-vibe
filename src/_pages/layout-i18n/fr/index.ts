import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    defaultTitle: "unbottled.ai - Chat IA non censuré",
    category: "Plateforme de chat IA",
    description:
      "Des conversations IA vraiment non censurées avec {{modelCount}} modèles. Pas de filtres, pas de restrictions. Juste une IA honnête.",
    imageAlt: "unbottled.ai, la plateforme de chat IA non censurée",
    keywords:
      "IA non censurée, chat IA, GPT-4, Claude, Gemini, modèles d'IA, sans filtre, IA honnête, conversations IA",
  },
  structuredData: {
    app: {
      description:
        "Chat IA avec {{modelCount}} modèles issus de {{providerCount}} labos : grand public, open source et non censurés. Vous choisissez le niveau de filtrage pour chaque discussion. Paiement à l'usage avec des crédits. Open source et auto-hébergeable.",
      freeOffer:
        "{{guest}} crédits gratuits par mois sans compte, {{signedIn}} avec un compte gratuit, {{max}} avec un compte gratuit et la newsletter. Aucune carte bancaire requise.",
      yearlyName: "Abonnement annuel",
      yearlyDescription:
        "{{subCredits}} crédits par mois, facturation annuelle",
    },
    pricing: {
      name: "Formules et crédits {{appName}}",
      description:
        "Des crédits gratuits chaque mois, un abonnement ou un pack de crédits ponctuel. Un seul solde pour {{modelCount}} modèles de chat, plus des modèles d'image, de vidéo, de musique et de voix.",
    },
    organization: {
      types: {
        organization: "Organization",
        contactPoint: "ContactPoint",
      },
      contactPoint: {
        contactType: "Service client",
      },
    },
  },
  constants: {
    languages: {
      en: "Anglais",
      de: "Allemand",
      pl: "Polonais",
      fr: "Français",
    },
  },
};
