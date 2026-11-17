import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Modifier le compte",
    titleShort: "Modifier le compte",
    description:
      "Modifiez le nom, la description ou l'ordre d'affichage d'un compte. Le type et le sous-type des comptes système ne peuvent pas être modifiés.",
    accountId: {
      label: "Compte",
      description: "Le compte à modifier",
      placeholder: "UUID du compte",
    },
    code: {
      label: "Numéro",
      description: "Numéro de compte",
    },
    type: {
      label: "Type",
      description: "Type de compte",
    },
    subtype: {
      label: "Sous-type",
      description: "Sous-type de compte",
    },
    isSystem: {
      label: "Compte système",
      description: "Indique s'il s'agit d'un compte système",
    },
    isActive: {
      label: "Actif",
      description: "Indique si ce compte est actif",
    },
    name: {
      label: "Intitulé du compte",
      description: "Nom affiché pour ce compte",
      placeholder: "ex. Clients",
    },
    accountDescription: {
      label: "Description",
      description: "Notes facultatives sur l'usage de ce compte",
      placeholder: "ex. Suit les montants dus par les clients",
    },
    sortOrder: {
      label: "Ordre d'affichage",
      description:
        "Position dans le groupe parent : les plus petits nombres s'affichent en premier",
      placeholder: "ex. 10",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Impossible de modifier les champs d'un compte système",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de mettre à jour le compte",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: { title: "Introuvable", description: "Compte introuvable" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Compte mis à jour",
      description: "Modifications enregistrées",
    },
    widget: {
      savedLabel: "Enregistré",
      failedLabel: "Échec",
      back: "Retour",
      submit: "Enregistrer les modifications",
      viewAccount: "Voir le compte",
      successTitle: "Modifications enregistrées",
      successDesc: "Le compte a été mis à jour.",
      systemNotice: "Compte système : type et sous-type verrouillés.",
      inactiveNotice: "Ce compte est inactif.",
      selectPrompt: "Choisissez un compte à modifier",
    },
  },
  title: "Modifier le compte",
  description: "Modifier les informations d'un compte",
  category: "Plan comptable",
  tag: "Compte",
};
