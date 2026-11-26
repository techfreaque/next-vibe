import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produits",
    catalog: "Catalogue",
    list: "Liste",
  },
  enums: {
    productType: {
      service: "Service",
      physical: "Physique",
      digital: "Numérique",
    },
  },
  get: {
    title: "Produits",
    titleShort: "Produits",
    description:
      "Récupérer tous les produits de votre catalogue. Filtrer par entreprise, catégorie, type ou statut actif.",
    companyId: {
      label: "ID de l'entreprise",
      description: "Filtrer les produits de cette entreprise",
    },
    categoryId: {
      label: "ID de la catégorie",
      description: "Filtrer les produits de cette catégorie",
    },
    type: {
      label: "Type de produit",
      description: "Filtrer par service, physique ou numérique",
      placeholder: "Tous les types",
    },
    isActive: {
      label: "Actifs uniquement",
      description: "Afficher uniquement les produits actifs",
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
        description: "Connectez-vous pour voir votre catalogue",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de voir ce catalogue",
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
        description: "Aucun produit trouvé",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Produits récupérés",
      description: "Les produits de votre catalogue sont listés ci-dessous.",
    },
    response: {
      id: "ID du produit",
      name: "Nom du produit",
      type: "Type",
      sku: "SKU",
      basePrice: "Prix de base",
      currency: "Devise",
      unit: "Unité",
      isActive: "Actif",
      isSubscription: "Abonnement",
      billingInterval: "Périodicité de facturation",
      categoryId: "Catégorie",
      createdAt: "Créé le",
      total: "Total",
    },
    widget: {
      checkout: "Offres vendues par la plateforme",
      checkoutHint:
        "Consultez les abonnements et les packs aux tarifs de ce marché. Pour rattacher une vente à la comptabilité, choisissez un produit d’entreprise ci-dessous et configurez son offre de paiement.",
      checkoutReference: "Référence de paiement",
      checkoutCredits: "Crédits inclus",
      oneTime: "Prix unique",
      searchPage: "Chercher par nom ou référence",
      noMatches: "Aucun produit correspondant sur cette page",
      retry: "Réessayer",
      previous: "Précédent",
      next: "Suivant",
      status: "Statut",
      addProduct: "Ajouter un produit",
      active: "Actif",
      inactive: "Inactif",
      empty:
        "Aucun produit trouvé. Ajustez les filtres ou ajoutez un nouveau produit.",
      columnProduct: "Produit",
      columnTypePrice: "Type / Prix / Statut",
      filterLoad: "Charger",
      filterAllTypes: "Tous les types",
      filterActiveOnly: "Actifs uniquement",
      filterAllStatus: "Tous les statuts",
      recurring: "Récurrent",
      billingMonthly: "Mensuel",
      billingYearly: "Annuel",
      navCategories: "Catégories",
      navTaxRates: "Taux de TVA",
      back: "Retour",
      count: "{{count}} produits",
      columnSku: "Réf.",
      columnPrice: "Prix",
      emptyTitle: "Aucun produit pour l'instant",
      emptyMessage:
        "Les produits et services que vous vendez sont ici. Factures, caisse et achats reprennent leur prix, unité et TVA.",
      clearFilters: "Effacer les filtres",
    },
  },
};
