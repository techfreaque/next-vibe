import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
    lines: "lignes",
  },
  post: {
    title: "Ajouter une ligne de facture",
    titleShort: "Ajouter une ligne",
    description: "Ajoute une ligne à un brouillon de facture",
    form: {
      title: "Ligne de facture",
      description: "Définissez l'élément facturable à ajouter",
    },
    response: {
      success: "Ligne ajoutée",
      message: "Message d'état",
      line: {
        currency: "Devise",
        title: "Détails de la ligne",
        subtitle: "Ligne de facture créée",
        id: "ID de ligne",
        invoiceId: "ID de facture",
        lineDescription: "Description",
        productId: "ID produit",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        taxRate: "Taux de TVA",
        taxAmount: "Montant de TVA",
        lineTotal: "Total de la ligne",
        sortOrder: "Ordre",
        createdAt: "Créée le",
        updatedAt: "Mise à jour le",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de ligne invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Facture introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "La facture n'est pas à l'état de brouillon",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Ligne ajoutée à la facture",
    },
  },
  invoiceId: {
    label: "ID de facture",
    description: "Le brouillon de facture auquel ajouter cette ligne",
    placeholder: "Saisir l'ID de facture",
  },
  description: {
    label: "Description",
    description: "Ce que représente cette ligne",
    placeholder: "ex. Développement web : 10 heures",
  },
  productId: {
    label: "ID produit",
    description: "Référence produit facultative",
    placeholder: "Saisir l'ID produit",
  },
  quantity: {
    label: "Quantité",
    description: "Nombre d'unités",
    placeholder: "1",
  },
  unitPrice: {
    label: "Prix unitaire",
    description: "Prix par unité",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Taux de TVA",
    description: "Taux de TVA en décimal (ex. 0.20 pour 20 %)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Rechercher dans le catalogue",
    searchPlaceholder: "Nom ou SKU…",
    searchButton: "Rechercher",
    clearProduct: "Effacer",
    noProductResults:
      "Aucun résultat : saisissez la ligne manuellement ci-dessous.",
    orManual: "Ou saisir manuellement",
    multiplier: "×",
    taxLabel: "TVA",
    linePreview: "Total de la ligne",
    lineAdded: "Ligne ajoutée",
    addAnotherLine: "Ajouter une autre ligne",
    viewInvoice: "Voir la facture",
    submit: "Ajouter la ligne",
  },
};
