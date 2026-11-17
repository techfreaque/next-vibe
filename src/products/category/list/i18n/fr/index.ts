import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produits",
    category: "Catégorie",
    list: "Liste",
  },
  get: {
    title: "Catégories",
    titleShort: "Catégories",
    description:
      "Récupérer les catégories de produits d'une entreprise ou d'un propriétaire.",
    companyId: {
      label: "ID de l'entreprise",
      description: "Filtrer les catégories de cette entreprise",
    },
    page: {
      label: "Page",
      description: "Numéro de page (commence à 1)",
    },
    pageSize: {
      label: "Par page",
      description: "Résultats par page (100 max.)",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les paramètres de filtre et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les catégories",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de voir ces catégories",
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
        description: "Aucune catégorie trouvée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Catégories récupérées",
      description: "Les catégories de produits sont listées ci-dessous.",
    },
    response: {
      id: "ID de la catégorie",
      name: "Nom de la catégorie",
      parentId: "Catégorie parente",
      sortOrder: "Ordre de tri",
      isActive: "Active",
      createdAt: "Créée le",
      total: "Total",
    },
    widget: {
      addCategory: "Ajouter une catégorie",
      active: "Active",
      inactive: "Inactive",
      empty: "Aucune catégorie trouvée. Ajoutez votre première catégorie.",
      viewProducts: "Voir les produits →",
      backToCatalog: "← Produits",
      back: "Retour",
    },
  },
};
