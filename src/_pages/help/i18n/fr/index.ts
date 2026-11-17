import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Accueil",
  },
  meta: {
    contact: {
      title: "Contact et support - {{appName}}",
      description:
        "Obtenez de l'aide sur {{appName}}, la plateforme de chat IA non censurée. Contactez notre équipe support.",
      category: "Support",
      imageAlt: "Support {{appName}}",
      keywords: "contact, support, aide, {{appName}}, chat IA, assistance",
      ogTitle: "Contacter le support {{appName}}",
      ogDescription: "De l'aide pour votre chat IA non censuré",
      twitterTitle: "Contacter {{appName}}",
      twitterDescription: "Écrivez à notre équipe support",
    },
  },
  pages: {
    help: {
      title: "Comment pouvons-nous vous aider ?",
      subtitle:
        "Obtenez de l'aide pour votre chat IA non censuré ou trouvez les réponses aux questions fréquentes",
      info: {
        title: "Coordonnées",
        supportEmail: "E-mail du support",
        discord: "Discord",
        discordUrl: "Rejoindre notre communauté Discord",
      },
      faq: {
        title: "Questions fréquentes",
        questions: {
          q1: {
            question: "Qu'est-ce que {{appName}} ?",
            answer:
              "{{appName}} est une plateforme de chat IA non censurée qui donne accès à {{modelCount}} modèles d'IA. Des conversations IA honnêtes, plus des fonctions avancées : gestion de dossiers, personnages personnalisés et prise en charge de plusieurs modèles.",
          },
          q2: {
            question: "Quels moyens de paiement acceptez-vous ?",
            answer:
              "Nous acceptons les cartes bancaires via Stripe et les cryptomonnaies (Bitcoin, Ethereum, stablecoins) via NowPayments. L'abonnement à {{subPrice}}/mois inclut {{subCredits}} crédits par mois. Besoin de plus ? Achetez des packs de crédits ({{packPrice}} pour {{packCredits}} crédits). Les packs de crédits n'expirent jamais, même après la fin de l'abonnement.",
          },
          q3: {
            question: "Comment fonctionne le système de crédits ?",
            answer:
              "L'accès au chat IA passe par l'abonnement à {{subPrice}}/mois, qui inclut {{subCredits}} crédits par mois. Besoin de plus ? Achetez des packs de crédits ({{packPrice}} pour {{packCredits}} crédits). Les packs de crédits n'expirent jamais, même après la fin de votre abonnement : ils restent utilisables sur les {{modelCount}} modèles d'IA dès que vous le réactivez.",
          },
          q4: {
            question: "Mes données sont-elles privées et sécurisées ?",
            answer:
              "Oui. Les dossiers privés ne sont visibles que par vous, le mode incognito garde vos chats hors de nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques), et vous pouvez exporter toutes vos données ou supprimer votre compte (et les données personnelles qui y sont liées) depuis les paramètres. Vos conversations vous appartiennent : nous ne vendons jamais vos données. Le chiffrement de bout en bout arrive bientôt.",
          },
        },
      },
    },
  },
};
