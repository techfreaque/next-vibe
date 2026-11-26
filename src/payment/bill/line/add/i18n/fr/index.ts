import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
  },
  post: {
    title: "Ajouter une ligne de facture",
    titleShort: "Ajouter une ligne",
    description:
      "Ajouter une ligne de dépense à une facture fournisseur en brouillon",
    form: {
      title: "Nouvelle ligne de facture",
      description: "Saisissez les informations de la dépense",
    },
    errors: {
      evidenceReview:
        "Vérifiez la facture fournisseur d’origine avant de modifier son imputation.",
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour ajouter des lignes de facture",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Comptable ou Admin requis",
      },
      conflict: {
        title: "Facture non modifiable",
        description:
          "Seules les factures en DRAFT peuvent recevoir de nouvelles lignes",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'ajouter la ligne",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion",
      },
      notFound: {
        title: "Facture introuvable",
        description: "Cette facture n'existe pas",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Ligne ajoutée",
      description: "Ligne de dépense ajoutée à la facture",
    },
    response: {
      success: "Succès",
      message: "Message",
      line: {
        currency: "Devise",
        title: "Détails de la ligne",
        subtitle: "Ligne ajoutée",
        id: "ID de la ligne",
        billId: "ID de la facture",
        lineDescription: "Désignation",
        productId: "ID du produit",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        taxRate: "Taux de TVA",
        taxAmount: "Montant de TVA",
        lineTotal: "Total de la ligne",
        expenseAccountId: "Compte de charges",
        sortOrder: "Ordre de tri",
        createdAt: "Créée le",
        updatedAt: "Modifiée le",
      },
    },
  },
  billId: {
    label: "ID de la facture",
    description: "La facture à laquelle ajouter cette ligne",
    placeholder: "UUID de la facture",
  },
  description: {
    label: "Désignation",
    description: "Ce qui a été acheté",
    placeholder: "Fournitures de bureau",
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
    description: "Prix par unité",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Taux de TVA",
    description: "Taux de TVA (0 à 1, ex. 0.20 pour 20 %)",
    placeholder: "0.20",
  },
  expenseAccountId: {
    label: "Compte de charges",
    description: "Compte de charges sur lequel imputer cette ligne",
    placeholder: "UUID du compte",
  },
  widget: {
    submit: "Ajouter la ligne",
    searchProduct: "Rechercher un produit",
    searchPlaceholder: "Nom du produit ou SKU…",
    searchButton: "Rechercher",
    clearProduct: "Effacer",
    noProductResults: "Aucun produit trouvé.",
    orManual: "ou saisir manuellement",
    multiplier: "×",
    taxLabel: "TVA",
    linePreview: "Total de la ligne (aperçu)",
    addAnotherLine: "Ajouter une autre ligne",
    viewBill: "Voir la facture",
  },
};
