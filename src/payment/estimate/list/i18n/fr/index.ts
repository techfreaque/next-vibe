import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Devis",
  tags: {
    payment: "paiement",
    estimate: "devis",
    list: "liste",
  },
  get: {
    title: "Devis",
    titleShort: "Devis",
    description:
      "Recherchez par numéro de devis, client, e-mail, titre ou identifiant. Filtrez par entreprise ou statut.",
    form: {
      title: "Filtres des devis",
      description: "Filtrer et paginer les devis",
    },
    response: {
      totalCount: "Nombre total",
      id: "ID du devis",
      estimateNumber: "N° de devis",
      status: "Statut",
      customerId: "ID du client",
      customerName: "Nom du client",
      currency: "Devise",
      total: "Total",
      validUntil: "Valable jusqu'au",
      lineCount: "Nombre de lignes",
      createdAt: "Créé le",
      updatedAt: "Modifié le",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
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
      notFound: { title: "Introuvable", description: "Entreprise introuvable" },
      conflict: { title: "Conflit", description: "Un conflit s'est produit" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Des modifications ne sont pas enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Devis récupérés",
    },
  },
  enums: {
    estimateStatus: {
      DRAFT: "Brouillon",
      SENT: "Envoyé",
      ACCEPTED: "Accepté",
      DECLINED: "Refusé",
      EXPIRED: "Expiré",
      CONVERTED: "Converti",
    },
  },
  companyId: {
    label: "ID de l'entreprise",
    description: "Filtrer par entreprise",
    placeholder: "Saisissez l'ID de l'entreprise",
  },
  search: {
    label: "Rechercher des documents",
    description:
      "Recherchez par numéro de devis, client, e-mail, titre ou identifiant. Filtrez par entreprise ou statut.",
    placeholder: "Numéro de devis, client ou titre",
  },
  status: {
    label: "Statut",
    description: "Filtrer par statut",
    placeholder: "Tous les statuts",
  },
  customerId: {
    label: "ID du client",
    description: "Filtrer par client",
    placeholder: "Saisissez l'ID du client",
  },
  page: {
    label: "Page",
    description: "Numéro de page",
  },
  pageSize: {
    label: "Taille de page",
    description: "Éléments par page",
  },
  widget: {
    pageCount: "Nombre de pages",
    back: "Retour",
    title: "Devis",
    newEstimate: "Nouveau devis",
    loading: "Chargement des devis...",
    noEstimates: "Aucun devis pour l'instant.",
    noEstimatesHint: "Créez votre premier devis pour commencer.",
    empty: {
      title: "Aucun devis pour l'instant.",
      hint: "Créez votre premier devis pour commencer.",
      cta: "Nouveau devis",
    },
    valid: "Valable",
    lines: "lignes",
    line: "ligne",
    view: "Voir",
    status: {
      draft: "Brouillon",
      sent: "Envoyé",
      accepted: "Accepté",
      declined: "Refusé",
      expired: "Expiré",
      converted: "Converti",
    },
  },
};
