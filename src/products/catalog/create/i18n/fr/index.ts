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
    create: "Créer",
  },
  post: {
    title: "Créer un produit",
    titleShort: "Créer un produit",
    description: "Ajoutez un produit ou un service à votre catalogue.",
    name: {
      label: "Nom du produit",
      description: "Nom du produit ou du service",
      placeholder: "Pack conception web",
    },
    productDescription: {
      label: "Description",
      description: "Brève description du contenu du produit ou du service",
      placeholder: "Conception complète d'un site web, jusqu'à 5 pages",
    },
    sku: {
      label: "SKU",
      description: "Référence produit (SKU) : votre code produit interne",
      placeholder: "WD-001",
    },
    type: {
      label: "Type de produit",
      description: "Service, bien physique ou article numérique",
      placeholder: "Sélectionner un type",
    },
    unit: {
      label: "Unité",
      description: "Unité de facturation (ex. heure, pièce, licence)",
      placeholder: "heure",
    },
    basePrice: {
      label: "Prix de base",
      description: "Prix par défaut dans la devise sélectionnée",
      placeholder: "150.00",
    },
    currency: {
      label: "Devise",
      description: "Code devise ISO à 3 lettres",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Taux de taxe par défaut",
      description:
        "Taux de TVA/taxe par défaut en décimal (ex. 0.19 pour 19 %)",
      placeholder: "0.19",
    },
    companyId: {
      label: "Entreprise",
      description: "Associer ce produit à une entreprise",
    },
    categoryId: {
      label: "Catégorie",
      description: "Catégorie du produit",
    },
    imageUrl: {
      label: "URL de l'image",
      description: "URL d'une image du produit",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "Produit sur abonnement",
      description: "Facturer les clients de façon récurrente",
    },
    billingInterval: {
      label: "Périodicité de facturation",
      description: "Fréquence de facturation des clients",
      placeholder: "Sélectionner la périodicité",
      monthly: "Mensuel",
      yearly: "Annuel",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs du formulaire et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour créer un produit",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de créer ce produit",
      },
      conflict: {
        title: "Existe déjà",
        description: "Un produit avec ce SKU existe déjà",
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
        description: "Ressource introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Produit créé",
      description: "Votre produit est maintenant dans le catalogue.",
    },
    response: {
      id: "ID du produit",
      name: "Nom du produit",
    },
    widget: {
      viewProduct: "Voir le produit",
      backToList: "Retour aux produits",
      back: "Retour",
    },
  },
};
