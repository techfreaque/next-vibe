import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Désactiver le compte",
    titleShort: "Désactiver",
    description:
      "Désactive un compte sans le supprimer. Impossible pour les comptes système et les comptes ayant des lignes d'écriture comptabilisées.",
    accountId: {
      label: "Compte",
      description: "Le compte à désactiver",
      placeholder: "Choisir un compte",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "ID de compte invalide",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Les comptes système ne peuvent pas être désactivés",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de désactiver le compte",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Compte mouvementé",
        description:
          "Impossible de désactiver un compte qui contient des lignes d'écriture",
      },
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
      title: "Compte désactivé",
      description: "Le compte est désormais inactif",
    },
    widget: {
      confirmWarning:
        "Ce compte va être désactivé. Pour les comptes ayant des écritures comptabilisées, cette action est irréversible.",
      doneLabel: "Terminé",
      confirmTitle: "Désactiver le compte ?",
      confirmDescription:
        "Ce compte sera désactivé et ne pourra plus servir à de nouvelles écritures. Les écritures existantes ne sont pas modifiées.",
      confirmButton: "Oui, désactiver",
      cancelButton: "Annuler",
    },
  },
  title: "Désactiver le compte",
  description: "Désactiver un compte sans le supprimer",
  category: "Plan comptable",
  tag: "Compte",
};
