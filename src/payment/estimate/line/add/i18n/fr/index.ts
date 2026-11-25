import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: { payment: "paiement", estimate: "devis", lines: "lignes" },
  post: {
    title: "Ajouter une ligne au devis",
    titleShort: "Ajouter une ligne",
    description: "Ajouter une ligne à un devis",
    form: {
      title: "Ajouter une ligne au devis",
      description: "Ajoutez un produit ou une prestation à ce devis",
    },
    response: {
      success: "Succès",
      message: "Message de statut",
      line: {
        currency: "Devise",
        title: "Ligne",
        subtitle: "Détails de la ligne ajoutée",
        id: "ID de la ligne",
        estimateId: "ID du devis",
        lineDescription: "Désignation",
        productId: "ID du produit",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        taxRate: "Taux de TVA",
        taxAmount: "Montant de TVA",
        lineTotal: "Total de la ligne",
        sortOrder: "Ordre de tri",
        createdAt: "Créée le",
        updatedAt: "Modifiée le",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les informations de la ligne",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Devis introuvable" },
      conflict: {
        title: "Conflit",
        description:
          "Le devis doit être au statut DRAFT pour recevoir de nouvelles lignes",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Ligne ajoutée",
      description: "Ligne ajoutée au devis",
    },
  },
  estimateId: {
    label: "ID du devis",
    description: "Le devis auquel ajouter une ligne",
    placeholder: "UUID du devis",
  },
  description: {
    label: "Désignation",
    description: "Description du produit ou de la prestation",
    placeholder: "ex. Développement web, 10 heures",
  },
  productId: {
    label: "ID du produit",
    description: "Référence produit facultative",
    placeholder: "UUID du produit",
  },
  quantity: {
    label: "Quantité",
    description: "Nombre d'unités",
    placeholder: "1",
  },
  unitPrice: {
    label: "Prix unitaire",
    description: "Prix par unité (HT)",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Taux de TVA",
    description: "Taux de TVA en décimal (ex. 0.20 pour 20 %)",
    placeholder: "0.20",
  },
  widget: {
    searchProduct: "Rechercher un produit",
    searchPlaceholder: "Nom du produit ou SKU...",
    searchButton: "Rechercher",
    clearProduct: "Effacer",
    noProductResults: "Aucun produit trouvé.",
    orManual: "ou saisir manuellement",
    multiplier: "×",
    taxLabel: "TVA",
    linePreview: "Total de la ligne",
    addAnotherLine: "Ajouter une autre ligne",
    viewEstimate: "Retour au devis",
    submit: "Ajouter la ligne",
  },
};
