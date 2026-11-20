import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "paiement",
    dashboard: "tableau-de-bord",
  },
  get: {
    title: "Tableau de bord des paiements",
    titleShort: "Tableau de bord",
    description:
      "Vue d'ensemble des factures, factures fournisseurs et paiements",
    form: {
      title: "Tableau de bord",
      description: "Vue d'ensemble des paiements de votre entreprise",
    },
    response: {
      openInvoices: "Factures ouvertes",
      overdueInvoices: "En retard",
      unpaidBills: "Factures fournisseurs impayées",
      draftInvoices: "Factures en brouillon",
      currency: "Devise",
      recentInvoices: "Factures récentes",
      openCount: "Nombre ouvertes",
      openTotal: "Total ouvert",
      overdueCount: "Nombre en retard",
      overdueTotal: "Total en retard",
      unpaidCount: "Nombre impayées",
      unpaidTotal: "Total impayé",
      draftCount: "Nombre de brouillons",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur de connexion réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous devez être membre de cette entreprise",
      },
      notFound: {
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Données du tableau de bord chargées",
    },
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "L'entreprise dont afficher le tableau de bord",
    placeholder: "Saisissez l'ID de l'entreprise",
  },
  widget: {
    commercialDocuments: "Documents commerciaux",
    processorDiagnostics: "Diagnostic des paiements",
    loading: "Chargement du tableau de bord...",
    noData: "Aucune entreprise sélectionnée.",
    noDataHint: "Choisissez une entreprise pour voir ses paiements.",
    openInvoices: "Factures ouvertes",
    overdue: "En retard",
    unpaidBills: "Factures fournisseurs impayées",
    draftInvoices: "Brouillons",
    quickActions: "Actions rapides",
    newInvoice: "Nouvelle facture",
    allInvoices: "Toutes les factures",
    newEstimate: "Nouveau devis",
    allEstimates: "Devis",
    allBills: "Factures fournisseurs",
    recentInvoices: "Factures récentes",
    noRecentInvoices: "Aucune facture récente.",
    view: "Voir",
    due: "Échéance",
    status: {
      draft: "Brouillon",
      open: "Ouverte",
      paid: "Payée",
      void: "Annulée",
      uncollectible: "Irrécouvrable",
    },
  },
};
