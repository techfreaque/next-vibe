import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Parrainage",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Bonus du code de parrainage",
    titleShort: "Bonus du code",
    description:
      "Définissez les crédits bonus uniques qu'un code de parrainage offre aux personnes qu'il amène. Versés à leur première formule payante, jamais à l'inscription gratuite. 0 supprime le bonus.",
    fields: {
      code: {
        label: "Code de parrainage",
        description: "Le code à modifier (majuscules indifférentes)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Crédits bonus",
        description:
          "Accordés une fois avec la première formule payante. 0 = aucun bonus.",
        placeholder: "100",
      },
    },
    response: {
      code: "Code",
      ownerEmail: "Propriétaire du code",
      previousBonusCredits: "Bonus précédent",
      subscriptionBonusCredits: "Crédits bonus",
    },
    widget: {
      back: "Retour",
      hint: 'Affiché à l\'inscription : "+N crédits bonus avec votre premier abonnement". Une fois par utilisateur.',
      submit: "Enregistrer le bonus",
      set: "{{code}} ({{owner}}) : +{{credits}} crédits avec la première formule (avant : {{previous}}).",
      cleared: "{{code}} ({{owner}}) : aucun bonus (avant : {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez le code et le nombre de crédits",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en admin pour définir des bonus",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Seuls les admins définissent les bonus de code",
    },
    notFound: {
      title: "Introuvable",
      description: "Le code n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "Le code a changé entre-temps, réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible d'enregistrer le bonus",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    codeNotFound: "Le code de parrainage {{code}} n'existe pas",
  },
  success: {
    title: "Enregistré",
    description: "Bonus du code mis à jour",
  },
};
