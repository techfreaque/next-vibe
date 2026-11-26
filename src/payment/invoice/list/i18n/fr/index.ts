import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Facturation",
  tags: {
    payment: "paiement",
    invoice: "facture",
  },
  get: {
    title: "Factures clients",
    titleShort: "Factures clients",
    description:
      "Recherchez par numéro de document, identifiant de facture ou de client. Filtrez par entreprise ou statut.",
    form: {
      title: "Filtres des factures",
      description: "Filtrez la liste des factures",
    },
    response: {
      customerName: "Client",
      total: "Total",
      invoices: "Factures",
      id: "ID de facture",
      invoiceSequenceNumber: "Numéro de facture",
      customerId: "ID client",
      currency: "Devise",
      status: "Statut",
      amount: "Montant",
      dueDate: "Échéance",
      notes: "Notes",
      lineCount: "Nombre de lignes",
      amountPaid: "Montant payé",
      amountDue: "Montant dû",
      isOverdue: "En retard",
      createdAt: "Créée le",
      updatedAt: "Mise à jour le",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de filtre invalides",
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
        description: "Vous devez être membre de cette entreprise",
      },
      notFound: {
        title: "Introuvable",
        description: "Entreprise introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Liste des factures récupérée",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "Brouillon",
      open: "Ouverte",
      paid: "Payée",
      void: "Annulée",
      uncollectible: "Irrécouvrable",
    },
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "Filtrer les factures de cette entreprise",
    placeholder: "Saisir l'ID de l'entreprise",
  },
  search: {
    label: "Rechercher des documents",
    description:
      "Recherchez par numéro de facture, nom du client ou identifiant.",
    placeholder: "Numéro de facture ou client",
  },
  status: {
    label: "Statut",
    description:
      "Filtrez par état ou affichez les factures en retard avec un solde à régler.",
    placeholder: "Tous les statuts",
  },
  customerId: {
    label: "ID client",
    description: "Filtrer par client",
    placeholder: "Saisir l'ID client",
  },
  page: {
    label: "Page",
    description: "Numéro de page",
  },
  pageSize: {
    label: "Taille de page",
    description: "Résultats par page",
  },
  widget: {
    creditNote: "Avoir",
    creditable: "Choisir la facture à créditer",
    noCreditable: "Aucune facture ne peut faire l’objet d’un avoir.",
    filters: "Filtres",
    partlyPaid: "Partiellement réglée",
    pageCount: "Nombre de pages",
    title: "Factures clients",
    newInvoice: "Nouvelle facture",
    loading: "Chargement des factures...",
    noInvoices: "Aucune facture pour l'instant.",
    noInvoicesHint: "Créez votre première facture pour commencer.",
    overdue: "En retard",
    due: "Échéance",
    lines: "lignes",
    line: "ligne",
    view: "Voir",
    back: "Retour",
    empty: {
      title: "Aucune facture pour l'instant.",
      hint: "Créez votre première facture pour commencer.",
      cta: "Nouvelle facture",
    },
    status: {
      draft: "Brouillon",
      open: "Ouverte",
      paid: "Payée",
      void: "Annulée",
      uncollectible: "Irrécouvrable",
    },
  },
};
