import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Code de confirmation",
    description: "Le code du lien reçu dans votre e-mail de bienvenue",
    placeholder: "Collez le code de votre e-mail",
  },
  response: {
    confirmed: "Confirmé",
    email: "E-mail",
    bonusCredits: "Crédits bonus par mois",
  },
  post: {
    title: "Confirmer l'e-mail de la newsletter",
    titleShort: "Confirmer l'e-mail",
    description:
      "Confirme une adresse de newsletter avec le code de l'e-mail de bienvenue. Débloque le bonus mensuel de crédits gratuits.",
    errors: {
      validation: {
        title: "Code invalide",
        description: "Le code de confirmation est absent ou mal formé",
      },
      notFound: {
        title: "Lien expiré ou invalide",
        description:
          "Ce lien de confirmation n'est pas valide. Abonnez-vous à nouveau pour en recevoir un nouveau.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      internal: {
        title: "Échec de la confirmation",
        description:
          "Un problème est survenu de notre côté. Réessayez le lien.",
      },
    },
    success: {
      title: "E-mail confirmé",
      description: "Le bonus s'applique à votre compte gratuit",
    },
  },
  widget: {
    heroTitle: "Un clic. +{{bonusCredits}} crédits chaque mois.",
    heroDescription:
      "Confirmez votre adresse. Sur un compte gratuit, le bonus s'ajoute immédiatement à votre allocation.",
    confirmButton: "Confirmer mon e-mail",
    confirming: "Confirmation...",
    confirmedTitle:
      "Confirmé. +{{bonusCredits}} crédits par mois sur votre compte gratuit.",
    confirmedDescription:
      "Connecté ? Le bonus est déjà dans votre solde gratuit et se renouvelle chaque mois tant que vous restez abonné. Pas encore de compte ? Inscrivez-vous gratuitement dans ce navigateur pour le débloquer.",
    startChatting: "Commencer à discuter",
  },
};
