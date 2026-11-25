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
      estimates: "Devis",
      byCurrency: "Totaux par devise",
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
    unnumberedInvoice: "Facture sans numéro",
    subtitle:
      "Factures, devis et factures fournisseurs que vous émettez. Les paiements carte et crypto sont dans les transactions de paiement.",
    estimatesSent: "Devis envoyés",
    estimateDrafts: "{{count}} brouillons",
    recentEstimates: "Devis récents",
    noRecentEstimates: "Aucun devis pour l'instant",
    validUntil: "Valable jusqu'au {{date}}",
    notInvoicesHint:
      "Les paiements par carte et crypto sont des transactions du prestataire, pas des factures. Ici ne figurent que les factures que vous émettez.",
    openTransactions: "Ouvrir les transactions de paiement",
    commercialDocuments: "Documents commerciaux",
    processorDiagnostics: "Transactions de paiement",
    loading: "Chargement du tableau de bord...",
    noData: "Aucune entreprise sélectionnée.",
    noDataHint: "Choisissez une entreprise pour voir ses paiements.",
    openInvoices: "Factures ouvertes",
    overdue: "En retard",
    unpaidBills: "Factures fournisseurs impayées",
    draftInvoices: "Brouillons de factures",
    quickActions: "Actions rapides",
    newInvoice: "Nouvelle facture",
    allInvoices: "Toutes les factures",
    newEstimate: "Nouveau devis",
    allEstimates: "Devis",
    allBills: "Factures fournisseurs",
    recentInvoices: "Factures récentes",
    noRecentInvoices: "Aucune facture émise pour l'instant",
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
