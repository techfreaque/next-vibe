import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Accueil",
  },
  breadcrumb: "Aide",
  meta: {
    contact: {
      title: "Centre d'aide : FAQ, guides et support | {{appName}}",
      description:
        "Réponses sur les crédits, les paiements, la confidentialité, les modèles non censurés et l'accès API. Des guides pour chaque partie de {{appName}}, et un support direct par e-mail et Discord.",
      category: "Support",
      imageAlt: "Centre d'aide {{appName}}",
      keywords:
        "aide {{appName}}, FAQ {{appName}}, support chat IA, aide IA non censurée, crédits IA, accès API IA",
      ogTitle: "Centre d'aide {{appName}}",
      ogDescription:
        "Crédits, paiements, confidentialité, modèles non censurés et accès API : toutes les réponses.",
      twitterTitle: "Centre d'aide {{appName}}",
      twitterDescription: "Réponses, guides et support direct.",
    },
  },
  pages: {
    help: {
      title: "Comment pouvons-nous vous aider ?",
      subtitle:
        "D'abord les réponses rapides. Des guides pour aller plus loin. Un humain quand il le faut.",
      topics: {
        title: "Trouvez votre chemin",
        models: {
          title: "Modèles",
          body: "Comparez {{modelCount}} modèles de chat par prix, contexte et niveau de censure.",
        },
        uncensored: {
          title: "Chat IA non censuré",
          body: "Quels modèles répondent sans les filtres des grands acteurs, et comment démarrer.",
        },
        skills: {
          title: "Skills",
          body: "Des spécialistes et des personnages prêts à l'emploi. Ou créez le vôtre.",
        },
        studio: {
          title: "Media Studio",
          body: "Images, vidéo, musique, voix et transcription au même endroit.",
        },
        pricing: {
          title: "Formules et crédits",
          body: "Ce que contient une formule, le fonctionnement des crédits et la recharge.",
        },
        api: {
          title: "Documentation API",
          body: "Endpoints compatibles OpenAI et Anthropic, avec des exemples à copier.",
        },
        selfHost: {
          title: "Auto-hébergement",
          body: "Faites tourner votre propre instance à partir du code open source.",
        },
      },
      info: {
        title: "Toujours bloqué ? Écrivez-nous",
        intro:
          "Envoyez un message ci-dessous ou contactez-nous directement. Nous lisons chaque demande.",
        supportEmail: "E-mail du support",
        discord: "Discord",
        discordUrl: "Rejoindre notre communauté Discord",
      },
      guides: {
        title: "Guides populaires",
      },
      faq: {
        title: "Questions fréquentes",
        more: "En savoir plus",
        questions: {
          q1: {
            question: "Qu'est-ce que {{appName}} ?",
            answer:
              "{{appName}} est une plateforme de chat IA avec {{modelCount}} modèles : grand public, ouverts et non censurés. Vous choisissez le modèle, et avec lui le niveau de filtrage. Skills, dossiers, génération de médias et API en plus.",
          },
          q2: {
            question: "Quels moyens de paiement acceptez-vous ?",
            answer:
              "Carte, PayPal, Apple Pay et Google Pay via Stripe, plus les cryptomonnaies (Bitcoin, Ethereum, stablecoins) via NOWPayments. Formules dès {{subscriptionPrice}} par mois. Les packs de crédits servent de recharge aux abonnés.",
          },
          q3: {
            question: "Comment fonctionne le système de crédits ?",
            answer:
              "Chaque modèle coûte des crédits à l'usage. Des crédits gratuits pour démarrer. Chaque formule ajoute des crédits tous les mois : {{subscriptionPrice}} pour {{subscriptionCredits}}, {{plusPrice}} pour {{plusCredits}}, {{proPrice}} pour {{proCredits}}, {{ultraPrice}} pour {{ultraCredits}}. Besoin de plus ? Les abonnés rechargent avec des packs de crédits ({{packPrice}} pour {{packCredits}} crédits). Les crédits des packs n'expirent jamais et fonctionnent sur les {{modelCount}} modèles d'IA.",
          },
          q4: {
            question: "Mes données sont-elles privées et sécurisées ?",
            answer:
              "Les dossiers privés ne sont visibles que par vous. Le mode incognito garde l'historique des conversations hors de nos serveurs, mais les fichiers médias générés y restent stockés. Depuis les paramètres, exportez toutes vos données ou supprimez votre compte et les données personnelles associées. Nous ne vendons jamais vos données.",
          },
          q5: {
            question: "Puis-je essayer sans compte ?",
            answer:
              "Oui. Les invités reçoivent jusqu'à {{freeCreditsGuest}} crédits gratuits par mois. Un compte gratuit et vérifié passe à {{freeCreditsSignedIn}}, et un abonnement confirmé à la newsletter à {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "Quelle différence entre modèles abliterés et non censurés ?",
            answer:
              "Les modèles abliterés sont des modèles grand public dont on a retiré le réflexe de refus : ils répondent au lieu d'esquiver. Uncensored LM est différent : il est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui donne un modèle aux opinions politiques à contre-courant.",
          },
          q7: {
            question: "Comment obtenir l'accès à l'API ?",
            answer:
              "Les clés API se débloquent avec votre premier achat, une formule ou un pack de crédits. Les crédits gratuits ne débloquent pas l'API. Créez ensuite une clé dans votre compte et pointez n'importe quel client OpenAI ou Anthropic vers notre URL de base.",
          },
          q8: {
            question:
              "Puis-je faire tourner {{appName}} sur mon propre serveur ?",
            answer:
              "Oui. Le code est open source. Clonez le dépôt, lancez bun i puis vibe dev, et terminez la configuration dans le navigateur. Vous pouvez relier votre instance à votre compte {{appName}}.",
          },
        },
      },
    },
  },
};
