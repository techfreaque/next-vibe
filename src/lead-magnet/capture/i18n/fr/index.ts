import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "S'abonner et accéder",
    titleShort: "S'abonner",
    description:
      "Envoyez vos coordonnées pour rejoindre la liste du créateur et accéder à cette compétence",
    groups: {
      main: {
        title: "Accéder",
        description: "Renseignez vos coordonnées ci-dessous",
      },
    },
    fields: {
      skillId: {
        label: "Skill",
        description: "La compétence depuis laquelle vous vous abonnez",
      },
      firstName: {
        label: "Prénom",
        description: "Votre prénom",
        placeholder: "ex. Camille",
      },
      email: {
        label: "Adresse e-mail",
        description: "Votre adresse e-mail",
        placeholder: "vous@exemple.fr",
      },
    },
    response: {
      captured: "Abonné",
      nextStep: "Étape suivante",
      signupUrl: "URL d'inscription",
    },
    success: {
      title: "C'est fait !",
      description:
        "Consultez votre boîte de réception, puis inscrivez-vous pour utiliser la compétence",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Non autorisé",
      },
      forbidden: {
        title: "Interdit",
        description: "Interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Compétence introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Une erreur interne est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
    },
  },
  form: {
    signUp: "Créer un compte",
    headline: "Restez informé",
    namePlaceholder: "Votre prénom",
    emailPlaceholder: "Votre e-mail",
    send: "S'abonner",
    sending: "...",
    doneHeading: "C'est fait.",
    doneSub: "Vous êtes sur la liste.",
    finePrint: "Pas de spam. Désabonnement en un clic, à tout moment.",
    error: "Une erreur est survenue. Réessayez.",
  },
};
