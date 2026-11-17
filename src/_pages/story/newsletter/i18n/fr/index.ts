import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Votre adresse e-mail",
  page: {
    eyebrow: "La newsletter {{appName}}",
    title: "Un e-mail par mois. Uniquement ce qui a changé.",
    description:
      "Nouveaux modèles, nouvelles fonctionnalités, prompts qui marchent. Chaque mois.",
    subtitle:
      "Nouveaux modèles, nouvelles fonctionnalités, prompts qui marchent.",
    heroDescription:
      "Les nouveaux modèles dès leur sortie, les fonctionnalités à connaître, des configurations qui donnent vraiment des résultats. Une fois par mois. Désinscription en un clic.",
    invalidEmail: {
      title: "Adresse e-mail invalide",
      description: "Cette adresse semble incorrecte. Vérifiez-la et réessayez.",
    },
    emailProvided: {
      title: "Gérer votre abonnement",
      description:
        "Modifiez vos préférences de newsletter ou désinscrivez-vous à tout moment.",
    },
    unsubscribeText: "Vous voulez partir ?",
    unsubscribeLink: "Se désinscrire ici",
    privacyNote: "Pas de spam. Votre adresse n'est jamais partagée. Jamais.",
    cta: {
      title: "Recevez le prochain numéro.",
      description: "Un e-mail par mois. Zéro remplissage.",
      subscribeButton: "S'abonner",
    },
    benefits: {
      title: "Ce que vous recevez",
      subtitle: "Quatre choses. Rien d'autre.",
      benefit1: {
        title: "Les nouveaux modèles, en premier",
        description:
          "Chaque modèle que nous ajoutons : ce qu'il fait bien, ce qu'il coûte, quand le choisir.",
      },
      benefit2: {
        title: "Les fonctionnalités livrées",
        description:
          "Ce qui a changé, pourquoi c'est important, comment l'utiliser dès aujourd'hui.",
      },
      benefit3: {
        title: "Des prompts qui marchent",
        description:
          "De vraies configurations et compétences qui donnent des résultats. Copiez-les, ajustez-les, lancez-vous.",
      },
      benefit4: {
        title: "Offres réservées aux abonnés",
        description: "Réductions et accès anticipé avant tout le monde.",
      },
    },
    frequency: {
      title: "Une fois par mois. C'est tout.",
      description:
        "Un e-mail par mois. Désinscrivez-vous quand vous voulez : un clic, aucune question.",
    },
  },
  subscription: {
    unsubscribe: {
      title: "Se désinscrire",
      confirmButton: "Confirmer la désinscription",
      success: "Vous êtes désinscrit",
      error: "Échec de la désinscription",
    },
  },
  unsubscribe: {
    page: {
      title: "Se désinscrire de la newsletter",
      description: "Dommage de vous voir partir",
      subtitle: "Gérez votre abonnement à la newsletter",
      emailProvided: {
        title: "Confirmer la désinscription",
        description:
          "Voulez-vous vraiment vous désinscrire de notre newsletter ?",
      },
      unsubscribeButton: "Se désinscrire",
      subscribeText: "Vous avez changé d'avis ?",
      subscribeLink: "Se réabonner",
      info: {
        title: "Et ensuite ?",
        description: "Ce qu'il faut savoir sur la désinscription :",
        immediate: {
          title: "Effet immédiat",
          description: "Vous ne recevrez plus nos newsletters, dès maintenant.",
        },
        resubscribe: {
          title: "Réabonnement facile",
          description:
            "Vous pouvez vous réabonner à tout moment si vous changez d'avis.",
        },
      },
      alternatives: {
        title: "Avant de partir",
        description: "Pensez à ces alternatives :",
        subscribe: "Modifier plutôt la fréquence des e-mails",
        contact: "Nous envoyer vos retours",
      },
    },
  },
};
