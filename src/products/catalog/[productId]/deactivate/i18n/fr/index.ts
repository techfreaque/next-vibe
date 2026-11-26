import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produits",
    catalog: "Catalogue",
    deactivate: "Désactiver",
  },
  post: {
    title: "Désactiver le produit",
    titleShort: "Désactiver",
    description:
      "Suppression logique d'un produit du catalogue : il est marqué comme inactif. Les données du produit sont conservées.",
    productId: {
      label: "ID du produit",
      description: "L'ID du produit à désactiver",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez l'ID du produit et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour désactiver un produit",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de désactiver ce produit",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu",
      },
      server: {
        title: "Erreur serveur",
        description: "Un problème est survenu de notre côté. Réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez",
      },
      notFound: {
        title: "Introuvable",
        description: "Produit introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Produit désactivé",
      description: "Le produit a été retiré du catalogue actif.",
    },
    response: {
      id: "ID du produit",
      isActive: "Statut actif",
    },
    widget: {
      backToList: "Retour aux produits",
      cancel: "Annuler",
      back: "Retour",
      warning:
        "Le produit sera désactivé et retiré du catalogue actif. Ses données sont conservées.",
    },
  },
};
