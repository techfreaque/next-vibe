import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produits",
    catalog: "Catalogue",
    get: "Consulter",
  },
  get: {
    title: "Consulter un produit du catalogue",
    titleShort: "Détails du produit",
    description: "Récupérer un produit du catalogue par son ID.",
    productId: {
      label: "ID du produit",
      description: "L'ID du produit à récupérer",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez l'ID du produit et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les détails du produit",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de voir ce produit",
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
      title: "Produit récupéré",
      description: "Détails du produit chargés.",
    },
    response: {
      id: "ID du produit",
      companyId: "Entreprise",
      name: "Nom du produit",
      description: "Description",
      sku: "SKU",
      type: "Type",
      unit: "Unité",
      basePrice: "Prix de base",
      currency: "Devise",
      defaultTaxRate: "Taux de taxe par défaut",
      categoryId: "Catégorie",
      imageUrl: "URL de l'image",
      isActive: "Actif",
      isSubscription: "Abonnement",
      billingInterval: "Périodicité de facturation",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
    },
    widget: {
      unavailable: "Produit indisponible",
      prices: "Tarifs actifs",
      stock: "Stock",
      viewStock: "Voir le stock des entrepôts",
      offers: "Offres de paiement",
      noOffers: "Aucune offre active n’est liée à ce produit.",
      configureOffer: "Configurer une offre de paiement",
      offerNeedsSku:
        "Activez le produit et donnez-lui une référence pour configurer une offre.",
      revenueAccount: "Compte de produits",
      liabilityAccount: "Compte de produits constatés d’avance",
      edit: "Modifier",
      deactivate: "Désactiver",
      activate: "Activer",
      active: "Actif",
      inactive: "Inactif",
      back: "Retour",
      loading: "Chargement du produit...",
      typeService: "Service",
      typePhysical: "Physique",
      typeDigital: "Numérique",
      recurring: "Récurrent",
      billingMonthly: "Mensuel",
      billingYearly: "Annuel",
      addToInvoice: "Ajouter à la facture",
      details: "Détails",
      select: "Sélectionner un produit",
    },
  },
};
