import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    bill: "facture-fournisseur",
    ap: "comptabilité-fournisseurs",
  },
  get: {
    title: "Factures fournisseurs",
    titleShort: "Factures fournisseurs",
    description:
      "Recherchez par numéro de facture, nom du fournisseur ou identifiant. Filtrez par entreprise ou statut.",
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les paramètres de filtre",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les factures",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'êtes pas membre de cette entreprise",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les factures",
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
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Factures chargées",
      description: "Factures fournisseurs récupérées",
    },
    response: {
      totalCount: "Total",
      id: "ID",
      supplierName: "Fournisseur",
      billNumber: "N° de facture",
      billDate: "Date de facture",
      dueDate: "Date d'échéance",
      currency: "Devise",
      billTotal: "Montant",
      status: "Statut",
      createdAt: "Créée le",
    },
  },
  companyId: {
    label: "Entreprise",
    description: "Filtrer par entreprise",
    placeholder: "UUID de l'entreprise",
  },
  search: {
    label: "Rechercher des documents",
    description:
      "Recherchez par numéro de facture, nom du fournisseur ou identifiant. Filtrez par entreprise ou statut.",
    placeholder: "Numéro de facture, fournisseur ou identifiant",
  },
  status: {
    label: "Statut",
    description: "Filtrer par statut de facture",
    placeholder: "Tous les statuts",
  },
  page: { label: "Page", description: "Numéro de page" },
  pageSize: { label: "Par page", description: "Résultats par page" },
  enums: {
    billStatus: {
      DRAFT: "Brouillon",
      RECEIVED: "Reçue",
      APPROVED: "Approuvée",
      PAID: "Payée",
      DISPUTED: "Contestée",
    },
  },
  widget: {
    pageCount: "Nombre de pages",
    back: "Retour",
    title: "Factures fournisseurs",
    newBill: "Enregistrer une facture",
    loading: "Chargement des factures...",
    empty: {
      title: "Aucune facture fournisseur",
      hint: "Enregistrez une facture dès que vous recevez celle d'un fournisseur.",
      cta: "Enregistrer une facture",
    },
    company: {
      select: "Choisir une entreprise",
      selected: "Entreprise sélectionnée",
    },
    due: "Échéance",
    overdue: "En retard",
    view: "Voir",
  },
};
