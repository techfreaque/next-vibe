import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    accountType: {
      ASSET: "Actif",
      LIABILITY: "Passif",
      EQUITY: "Capitaux propres",
      REVENUE: "Produits",
      EXPENSE: "Charges",
    },
    accountSubtype: {
      CURRENT_ASSET: "Actif circulant",
      FIXED_ASSET: "Immobilisation",
      BANK: "Banque",
      CASH: "Caisse",
      ACCOUNTS_RECEIVABLE: "Clients",
      INVENTORY: "Stocks",
      PREPAID: "Charges constatées d'avance",
      ACCOUNTS_PAYABLE: "Fournisseurs",
      VAT_PAYABLE: "TVA collectée",
      VAT_RECEIVABLE: "TVA déductible",
      ACCRUED_LIABILITY: "Charges à payer",
      SHORT_TERM_DEBT: "Dettes à court terme",
      LONG_TERM_DEBT: "Dettes à long terme",
      SHARE_CAPITAL: "Capital social",
      RETAINED_EARNINGS: "Report à nouveau",
      REVENUE_SALES: "Ventes de marchandises",
      REVENUE_SERVICE: "Prestations de services",
      COGS: "Coût des marchandises vendues",
      PAYROLL: "Charges de personnel",
      RENT: "Loyers",
      UTILITIES: "Énergie et fluides",
      OPEX: "Charges d'exploitation",
      FINANCIAL_INCOME: "Produits financiers",
      FINANCIAL_EXPENSE: "Charges financières",
      TAX_EXPENSE: "Impôts et taxes",
      OTHER: "Autre",
    },
  },
  post: {
    title: "Créer un compte",
    titleShort: "Nouveau compte",
    description:
      "Ajoutez un compte personnalisé au plan comptable de l'entreprise",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise à laquelle ajouter le compte",
      placeholder: "Saisissez l'UUID de l'entreprise",
    },
    code: {
      label: "Numéro de compte",
      description: "Numéro unique du compte",
      placeholder: "ex. 1150",
    },
    name: {
      label: "Intitulé du compte",
      description: "Nom descriptif du compte",
      placeholder: "ex. Petite caisse",
    },
    type: {
      label: "Type de compte",
      description: "Classification principale du compte",
      placeholder: "Choisir un type",
    },
    subtype: {
      label: "Sous-type de compte",
      description: "Classification détaillée au sein du type",
      placeholder: "Choisir un sous-type",
    },
    parentId: {
      label: "Compte parent",
      description: "Compte parent facultatif pour regrouper la hiérarchie",
      placeholder: "UUID du compte parent (facultatif)",
    },
    response: {
      id: "ID du compte",
      code: "Numéro",
      name: "Intitulé",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs obligatoires",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer le compte",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Numéro déjà utilisé",
        description: "Un compte avec ce numéro existe déjà",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: {
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Compte créé",
      description: "Le compte a été ajouté",
    },
    widget: {
      viewButton: "Voir le compte",
      addAnotherButton: "En ajouter un autre",
      back: "Retour",
    },
  },
  title: "Créer un compte",
  description: "Ajouter un compte personnalisé",
  category: "Plan comptable",
  tag: "Compte",
};
