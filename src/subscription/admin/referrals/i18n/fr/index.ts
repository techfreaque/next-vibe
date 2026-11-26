import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "Acquisition de contacts",
    fields: { currency: "Devise du chiffre d’affaires" },
  },
  get: {
    title: "Tableau de bord des parrainages",
    titleShort: "Activité de parrainage",
    description: "Codes de parrainage, gains et versements",
    form: {
      title: "Gestion des parrainages",
      description: "Gérer le programme de parrainage",
    },
    searchFilters: {
      title: "Recherche et filtres",
      description: "Filtrer les données de parrainage",
    },
    search: {
      label: "Recherche",
      description: "Rechercher par e-mail d'utilisateur",
      placeholder: "Rechercher des parrainages...",
    },
    payoutStatus: {
      label: "Statut du versement",
      description: "Filtrer par statut de demande de versement",
      placeholder: "Tous les statuts",
    },
    dateFrom: {
      label: "Du",
      description: "Filtre de date de début",
    },
    dateTo: {
      label: "Au",
      description: "Filtre de date de fin",
    },
    sortingOptions: {
      title: "Tri",
      description: "Configurer le tri des résultats",
    },
    sortBy: {
      label: "Trier par",
      description: "Champ de tri",
      placeholder: "Sélectionner un champ de tri...",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Sens du tri",
      placeholder: "Sélectionner l'ordre...",
    },
    response: {
      title: "Parrainages",
      description: "Données du programme de parrainage",
      summary: {
        title: "Synthèse",
        description: "Statistiques de parrainage agrégées",
        totalCodes: {
          label: "Total des codes",
        },
        totalSignups: {
          label: "Inscriptions totales",
        },
        totalEarned: {
          label: "Total gagné",
        },
        totalPaidOut: {
          label: "Total versé",
        },
        pendingPayouts: {
          label: "Versements en attente",
        },
      },
      codes: {
        code: "Code",
        ownerEmail: "Propriétaire",
        ownerName: "Nom",
        currentUses: "Utilisations du code",
        totalSignups: "Inscriptions",
        totalEarned: "Gagné",
        isActive: "Actif",
        createdAt: "Créé le",
      },
      payoutRequests: {
        id: "ID",
        userEmail: "Utilisateur",
        amountCents: "Montant",
        currency: "Devise",
        status: "Statut",
        walletAddress: "Portefeuille",
        adminNotes: "Notes",
        rejectionReason: "Motif du refus",
        createdAt: "Demandé le",
        processedAt: "Traité le",
      },
      totalCount: "Total",
      pageCount: "Nombre de pages",
    },
    page: {
      label: "Page",
    },
    limit: {
      label: "Par page",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès admin requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les parrainages",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inattendue",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
      network: {
        title: "Erreur réseau",
        description: "Connexion impossible",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune donnée de parrainage trouvée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Parrainages récupérés",
    },
  },
  post: {
    title: "Action sur un versement",
    titleShort: "Action versement",
    description: "Approuver, refuser ou finaliser une demande de versement",
    form: {
      title: "Action sur un versement",
      description: "Traiter une demande de versement",
    },
    requestId: {
      label: "ID de la demande",
      description: "Demande de versement à traiter",
      placeholder: "Saisir l'ID de la demande...",
    },
    action: {
      label: "Action",
      description: "Action à effectuer",
      placeholder: "Sélectionner une action...",
    },
    adminNotes: {
      label: "Notes admin",
      description: "Notes facultatives",
      placeholder: "Ajouter des notes...",
    },
    rejectionReason: {
      label: "Motif du refus",
      description: "Obligatoire en cas de refus",
      placeholder: "Saisir le motif...",
    },
    response: {
      title: "Résultat",
      description: "Résultat de l'action",
      success: "Succès",
      message: "Message",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      forbidden: {
        title: "Interdit",
        description: "Accès admin requis",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de traiter le versement",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inattendue",
      },
      conflict: {
        title: "Conflit",
        description: "Versement déjà traité",
      },
      network: {
        title: "Erreur réseau",
        description: "Connexion impossible",
      },
      notFound: {
        title: "Introuvable",
        description: "Demande de versement introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Versement traité",
    },
  },
  widget: {
    noReferrals: "Aucun code de parrainage trouvé.",
    noPayouts: "Aucune demande de versement.",
    approve: "Approuver",
    reject: "Refuser",
    complete: "Finaliser",
    sectionCodes: "Codes de parrainage",
    sectionPayouts: "Demandes de versement",
    refresh: "Actualiser",
    codeActive: "Actif",
    codeInactive: "Inactif",
    clicks: "clics",
    signups: "inscriptions",
    earned: "gagnés",
    confirm: {
      title: "Confirmer l'action sur le versement",
      description:
        "Voulez-vous vraiment effectuer cette action sur le versement ? Elle est irréversible.",
      cancel: "Annuler",
      proceed: "Continuer",
    },
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    payoutStatusFilter: {
      all: "Tous",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Refusé",
      processing: "En cours",
      completed: "Terminé",
      failed: "Échoué",
    },
    referralSortField: {
      createdAt: "Date de création",
      earnings: "Gains totaux",
      signups: "Inscriptions",
    },
    sortOrder: {
      asc: "Croissant",
      desc: "Décroissant",
    },
    payoutAction: {
      approve: "Approuver",
      reject: "Refuser",
      complete: "Finaliser",
    },
  },
};
