import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Service",
      physical: "Physique",
      digital: "Numérique",
    },
  },
  tags: {
    products: "Produits",
    catalog: "Catalogue",
    update: "Modifier",
  },
  patch: {
    title: "Modifier le produit",
    titleShort: "Modifier le produit",
    description: "Modifier les champs d'un produit existant du catalogue.",
    productId: {
      label: "ID du produit",
      description: "L'ID du produit à modifier",
    },
    name: {
      label: "Nom du produit",
      description: "Nouveau nom du produit",
      placeholder: "Pack conception web",
    },
    productDescription: {
      label: "Description",
      description: "Nouvelle description du produit",
      placeholder: "Conception complète d'un site web, jusqu'à 5 pages",
    },
    sku: {
      label: "SKU",
      description: "Nouvelle référence produit (SKU)",
      placeholder: "WD-001",
    },
    type: {
      label: "Type de produit",
      description: "Nouveau type de produit",
      placeholder: "Sélectionner un type",
    },
    unit: {
      label: "Unité",
      description: "Nouvelle unité de facturation",
      placeholder: "heure",
    },
    basePrice: {
      label: "Prix de base",
      description: "Nouveau prix de base",
      placeholder: "150.00",
    },
    currency: {
      label: "Devise",
      description: "Nouveau code devise ISO à 3 lettres",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Taux de taxe par défaut",
      description: "Nouveau taux de taxe par défaut en décimal",
      placeholder: "0.19",
    },
    categoryId: {
      label: "Catégorie",
      description: "Nouvelle catégorie du produit",
    },
    imageUrl: {
      label: "URL de l'image",
      description: "Nouvelle URL de l'image du produit",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "Actif",
      description: "Le produit est-il disponible dans le catalogue",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour modifier un produit",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de modifier ce produit",
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
      title: "Produit mis à jour",
      description: "Les détails du produit ont été enregistrés.",
    },
    response: {
      id: "ID du produit",
      name: "Nom du produit",
    },
    widget: {
      catalogCompany: "Entreprise du catalogue",
      billingCadence: "Fréquence de facturation",
      oneTime: "Achat unique",
      personalCatalog: "Catalogue personnel",
      companyUnavailable: "Nom de l’entreprise indisponible",
      couldNotLoad: "Impossible de charger le produit.",
      retry: "Réessayer",
      backToList: "Retour aux produits",
      back: "Retour",
    },
  },
};
