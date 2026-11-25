import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Point de vente",
  tags: {
    pos: "Caisse",
    terminal: "Terminal",
    session: "Session",
    order: "Commande",
    payment: "Paiement",
    create: "Créer",
    list: "Liste",
    get: "Consulter",
    open: "Ouvrir",
    close: "Clôturer",
    complete: "Finaliser",
    void: "Annuler",
    addItem: "Ajouter un article",
    removeItem: "Retirer un article",
    addPayment: "Ajouter un paiement",
  },
  endpointCategories: {
    pos: "Point de vente",
    terminals: "Terminaux",
    sessions: "Sessions",
    orders: "Commandes",
  },
  enums: {
    sessionStatus: {
      open: "Ouverte",
      closed: "Clôturée",
    },
    orderStatus: {
      open: "Ouverte",
      completed: "Finalisée",
      voided: "Annulée",
    },
    paymentMethod: {
      cash: "Espèces",
      card: "Carte",
      transfer: "Virement",
      other: "Autre",
    },
  },

  // POS Dashboard
  dashboard: {
    get: {
      title: "Tableau de bord caisse",
      titleShort: "Tableau de bord",
      description:
        "Vue d'ensemble des terminaux, des sessions ouvertes et des ventes du jour.",
      widget: {
        loading: "Chargement du tableau de bord...",
        loadingHint: "Récupération de vos données de caisse.",
        kpiTerminals: "Terminaux (actifs / total)",
        kpiOpenSessions: "Sessions ouvertes",
        kpiTodayOrders: "Commandes du jour",
        kpiTodaySales: "Chiffre d'affaires du jour",
        terminalsHeading: "Terminaux",
        refresh: "Actualiser",
        openSession: "Ouvrir une session",
        viewOrders: "Voir les commandes",
        viewSession: "Voir la session",
        allTerminals: "Tous les terminaux",
        statusActive: "Actif",
        statusInactive: "Inactif",
        statusSessionOpen: "Session ouverte",
        emptyTerminals: "Aucun terminal configuré.",
        emptyTerminalsHint:
          "Contactez votre administrateur pour configurer les terminaux de caisse.",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir le tableau de bord caisse",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès aux données de caisse",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger le tableau de bord",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucune donnée de caisse trouvée",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Tableau de bord chargé",
        description: "Vue d'ensemble de la caisse récupérée",
      },
      response: {
        terminalsTotal: "Total des terminaux",
        terminalsActive: "Terminaux actifs",
        openSessionsCount: "Sessions ouvertes",
        todayOrderCount: "Commandes du jour",
        todaySalesTotal: "Chiffre d'affaires du jour",
        currency: "Devise",
        terminalId: "ID du terminal",
        terminalName: "Nom du terminal",
        terminalLocation: "Emplacement",
        terminalCurrency: "Devise",
        terminalIsActive: "Actif",
        terminalHasOpenSession: "Session ouverte",
        terminalOpenSessionId: "ID de la session ouverte",
      },
    },
  },

  // Terminal create
  terminalCreate: {
    post: {
      title: "Créer un terminal",
      titleShort: "Créer un terminal",
      description:
        "Enregistrer un nouveau terminal de caisse pour une entreprise.",
      widget: {
        backToList: "Retour aux terminaux",
        active: "Actif",
        inactive: "Inactif",
        openSession: "Ouvrir une session",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise à laquelle appartient ce terminal",
      },
      name: {
        label: "Nom du terminal",
        description: "Nom de ce terminal",
        placeholder: "Caisse principale",
      },
      location: {
        label: "Emplacement",
        description: "Emplacement physique du terminal",
        placeholder: "Accueil",
      },
      currency: {
        label: "Devise",
        description: "Devise par défaut (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Compte de caisse",
        description: "Nœud de compte associé au tiroir-caisse",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des terminaux",
        },
        forbidden: {
          title: "Administrateur requis",
          description: "Seuls les administrateurs peuvent créer des terminaux",
        },
        conflict: {
          title: "Conflit",
          description: "Un terminal portant ce nom existe déjà",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer le terminal. Réessayez.",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Terminal créé",
        description: "Terminal enregistré",
      },
      response: {
        id: "ID du terminal",
        name: "Nom du terminal",
        companyId: "ID de l'entreprise",
        currency: "Devise",
        isActive: "Actif",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Terminaux",
      titleShort: "Terminaux",
      description: "Lister tous les terminaux d'une entreprise.",
      widget: {
        active: "Actif",
        inactive: "Inactif",
        total: "terminaux",
        createTerminal: "Nouveau terminal",
        empty: "Aucun terminal configuré.",
        emptyHint:
          "Les terminaux sont les caisses physiques de votre magasin. Contactez votre administrateur pour les configurer.",
        emptyContact: "Contacter votre administrateur",
        openSession: "Ouvrir une session",
        selectCompany: "Chargement des terminaux...",
        selectCompanyHint: "Récupération de vos terminaux.",
        loading: "Chargement des terminaux...",
        loadingHint: "Récupération de vos terminaux.",
        refresh: "Actualiser",
        back: "Retour",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise dont lister les terminaux",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les terminaux",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de lister les terminaux",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
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
        title: "Terminaux chargés",
        description: "Liste des terminaux récupérée",
      },
      response: {
        id: "ID du terminal",
        name: "Nom du terminal",
        location: "Emplacement",
        currency: "Devise",
        isActive: "Actif",
        createdAt: "Créé le",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Ouvrir une session",
      titleShort: "Ouvrir une session",
      description: "Démarrer une session de caisse sur un terminal.",
      widget: {
        viewOrders: "Voir les commandes",
        backToTerminals: "Retour aux terminaux",
        selectTerminal: "Terminal prêt",
        selectTerminalHint:
          "Saisissez le fonds de caisse et ouvrez la session.",
        terminal: "Terminal",
        readyToOpen: "Prêt",
        floatHint: "Comptez les espèces du tiroir avant l'ouverture.",
        startOrders: "Commencer les ventes",
      },
      terminalId: {
        label: "ID du terminal",
        description: "Terminal sur lequel ouvrir la session",
      },
      openingFloat: {
        label: "Fonds de caisse initial",
        description: "Espèces dans le tiroir à l'ouverture",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour ouvrir une session",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce terminal",
        },
        conflict: {
          title: "Session déjà ouverte",
          description: "Ce terminal a déjà une session ouverte",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'ouvrir la session",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Terminal introuvable",
          description: "Ce terminal n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Session ouverte",
        description: "La session a démarré",
      },
      response: {
        id: "ID de la session",
        terminalId: "ID du terminal",
        openedAt: "Ouverte le",
        status: "Statut",
        openingFloat: "Fonds de caisse initial",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      mixedCash:
        "Rapprochez les encaissements en devises avant de clôturer cette caisse.",
      title: "Clôturer la session",
      titleShort: "Clôturer la session",
      description:
        "Clôturer une session de caisse et enregistrer le fonds de caisse final.",
      widget: {
        backToTerminals: "Retour aux terminaux",
        sessionSummary: "Récapitulatif de la session",
        terminal: "Terminal",
        openedAt: "Ouverte le",
        orderCount: "Commandes",
        sessionRevenue: "Chiffre d'affaires",
        floatHint: "Comptez les espèces du tiroir avant la clôture.",
        reconciliation: "Clôture de caisse",
        sessionReady: "Session",
        active: "Active",
        openingFloat: "Fonds de caisse initial",
        cashSales: "Ventes en espèces",
        expectedClosingFloat: "Fonds de caisse final attendu",
        actualClosingFloat: "Fonds de caisse final réel",
        variance: "Écart",
        reconciliationTitle: "Rapprochement de caisse",
      },
      sessionId: {
        label: "ID de la session",
        description: "Session à clôturer",
      },
      closingFloat: {
        label: "Fonds de caisse final",
        description: "Espèces comptées dans le tiroir à la clôture",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour clôturer une session",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous ne pouvez clôturer que votre propre session",
        },
        conflict: {
          title: "Session déjà clôturée",
          description: "Cette session est déjà clôturée",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de clôturer la session",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Session introuvable",
          description: "Cette session n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Session clôturée",
        description: "La session a été clôturée",
      },
      response: {
        id: "ID de la session",
        status: "Statut",
        closedAt: "Clôturée le",
        closingFloat: "Fonds de caisse final",
        expectedFloat: "Fonds attendu",
        cashSalesTotal: "Ventes en espèces",
        variance: "Écart",
        orderCount: "Nombre de commandes",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Consulter la session",
      titleShort: "Détails de la session",
      description: "Afficher les détails d'une session.",
      widget: {
        viewOrders: "Voir les commandes",
        closeSession: "Clôturer la session",
        newOrder: "Nouvelle commande",
        sessionDetails: "Détails de la session",
        loading: "Chargement de la session...",
        back: "Retour",
      },
      sessionId: {
        label: "ID de la session",
        description: "Session à afficher",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de session invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les sessions",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette session",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger la session",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Session introuvable",
          description: "Cette session n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Session chargée",
        description: "Détails de la session récupérés",
      },
      response: {
        id: "ID de la session",
        terminalId: "ID du terminal",
        cashierUserId: "Caissier",
        status: "Statut",
        openedAt: "Ouverte le",
        closedAt: "Clôturée le",
        openingFloat: "Fonds de caisse initial",
        closingFloat: "Fonds de caisse final",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Créer une commande",
      titleShort: "Créer une commande",
      description: "Créer une nouvelle commande dans une session ouverte.",
      widget: {
        addItem: "Ajouter un article",
        viewOrder: "Voir la commande",
        creating: "Ouverture de la commande...",
        back: "Retour",
      },
      sessionId: {
        label: "ID de la session",
        description: "Session dans laquelle créer la commande",
      },
      customerId: {
        label: "ID du client",
        description: "Référence client facultative",
      },
      currency: {
        label: "Devise",
        description: "Devise de la commande",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette session",
        },
        conflict: {
          title: "Session clôturée",
          description:
            "Impossible de créer une commande dans une session clôturée",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer la commande",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Session introuvable",
          description: "Cette session n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Commande créée",
        description: "La commande a été créée",
      },
      response: {
        id: "ID de la commande",
        orderNumber: "Numéro de commande",
        sessionId: "ID de la session",
        status: "Statut",
        currency: "Devise",
        total: "Total",
      },
    },
  },

  // Order add item
  orderAddItem: {
    post: {
      title: "Ajouter un article",
      titleShort: "Ajouter un article",
      description: "Ajouter une ligne à une commande ouverte.",
      widget: {
        backToOrder: "Retour à la commande",
        linePreview: "Total de la ligne",
        taxNote: "TTC",
        multiplier: "×",
        addAnother: "Ajouter un autre article",
        searchProduct: "Rechercher dans le catalogue",
        searchPlaceholder: "Nom ou référence…",
        orManual: "Ou saisir manuellement",
        selectedProduct: "Produit sélectionné",
        clearProduct: "Effacer",
        searchButton: "Rechercher",
        noProductResults: "Aucun résultat. Saisissez l'article ci-dessous.",
      },
      orderId: {
        label: "ID de la commande",
        description: "Commande à laquelle ajouter l'article",
      },
      productId: {
        label: "ID du produit",
        description: "Référence produit facultative",
      },
      itemDescription: {
        label: "Description",
        description: "Description de l'article",
        placeholder: "Café",
      },
      quantity: {
        label: "Quantité",
        description: "Quantité",
        placeholder: "1",
      },
      unitPrice: {
        label: "Prix unitaire",
        description: "Prix à l'unité",
        placeholder: "3.50",
      },
      taxRate: {
        label: "Taux de TVA",
        description: "Taux en décimal (ex. 0.2 pour 20 %)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour ajouter des articles",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: {
          title: "Commande non ouverte",
          description:
            "Impossible d'ajouter des articles à une commande qui n'est pas ouverte",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'ajouter l'article",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Commande introuvable",
          description: "Cette commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Article ajouté",
        description: "Article ajouté à la commande",
      },
      response: {
        id: "ID de l'article",
        description: "Description",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        taxAmount: "Montant de TVA",
        lineTotal: "Total de la ligne",
        orderTotal: "Total de la commande",
      },
    },
  },

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "Retirer un article",
      titleShort: "Retirer un article",
      description: "Retirer une ligne d'une commande ouverte.",
      widget: {
        chooseLine: "Choisir une ligne",
        backToOrder: "Retour à la commande",
      },
      orderId: {
        label: "Commande",
        description: "Commande dont retirer l'article",
      },
      itemId: { label: "Ligne", description: "Article à retirer" },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour retirer des articles",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: {
          title: "Commande non ouverte",
          description:
            "Impossible de retirer des articles d'une commande qui n'est pas ouverte",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de retirer l'article",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Commande ou article introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Article retiré",
        description: "Article retiré de la commande",
      },
      response: {
        orderId: "ID de la commande",
        orderTotal: "Nouveau total",
      },
    },
  },

  // Order complete
  orderComplete: {
    post: {
      title: "Finaliser la commande",
      titleShort: "Finaliser la commande",
      description:
        "Finaliser une commande. Vérifie le paiement intégral et passe l'écriture comptable.",
      widget: {
        backToList: "Retour aux commandes",
        confirmTitle: "Finaliser cette commande ?",
        confirmHint:
          "Action irréversible. Tous les paiements doivent être encaissés.",
        orderNumber: "Commande",
        cancel: "Annuler",
      },
      orderId: {
        label: "ID de la commande",
        description: "Commande à finaliser",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour finaliser des commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: {
          title: "Solde impayé",
          description: "Les paiements ne couvrent pas le total de la commande",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de finaliser la commande",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Commande introuvable",
          description: "Cette commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Commande finalisée",
        description: "Commande finalisée et écriture comptable passée",
      },
      response: {
        id: "ID de la commande",
        status: "Statut",
        total: "Total",
        journalEntryId: "ID de l'écriture comptable",
      },
    },
  },

  // Order void
  orderVoid: {
    post: {
      title: "Annuler la commande",
      titleShort: "Annuler la commande",
      description: "Annuler une commande ouverte. Action irréversible.",
      widget: {
        tendered:
          "Un paiement a déjà été enregistré. La commande et ses lignes sont verrouillées.",
        closed: "Cette commande est clôturée.",
        backToList: "Retour aux commandes",
      },
      orderId: {
        label: "Commande",
        description: "Commande à annuler",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour annuler des commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: {
          title: "Commande non ouverte",
          description: "Seules les commandes ouvertes peuvent être annulées",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'annuler la commande",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Commande introuvable",
          description: "Cette commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Commande annulée",
        description: "La commande a été annulée",
      },
      response: {
        id: "ID de la commande",
        status: "Statut",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Consulter la commande",
      titleShort: "Détails de la commande",
      description: "Afficher une commande avec ses articles et ses paiements.",
      widget: {
        addItem: "Ajouter un article",
        addPayment: "Ajouter un paiement",
        complete: "Finaliser la commande",
        void: "Annuler la commande",
        back: "Retour",
        outstanding: "Reste dû",
        fullyPaid: "Entièrement payée",
        qtyTimesPrice: "×",
        loading: "Chargement de la commande...",
        noItems: "Aucun article. Ajoutez le premier.",
        viewJournalEntry: "Voir l'écriture comptable",
        voidedStamp: "ANNULÉE",
        completedReadOnly:
          "Cette commande est finalisée et ne peut plus être modifiée.",
        select: "Choisir une commande",
      },
      orderId: {
        label: "ID de la commande",
        description: "Commande à afficher",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger la commande",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Commande introuvable",
          description: "Cette commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Commande chargée",
        description: "Détails de la commande récupérés",
      },
      response: {
        id: "ID de la commande",
        orderNumber: "Numéro de commande",
        sessionId: "ID de la session",
        customerId: "ID du client",
        status: "Statut",
        currency: "Devise",
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
        journalEntryId: "ID de l'écriture comptable",
        createdAt: "Créée le",
        items: "Articles",
        itemId: "ID de l'article",
        productId: "ID du produit",
        description: "Description",
        quantity: "Quantité",
        unitPrice: "Prix unitaire",
        taxRate: "Taux de TVA",
        taxAmountItem: "TVA",
        lineTotal: "Total de la ligne",
        payments: "Paiements",
        paymentId: "ID du paiement",
        method: "Moyen",
        amount: "Montant",
        change: "Monnaie rendue",
        reference: "Référence",
      },
    },
  },

  // Order list
  orderList: {
    get: {
      title: "Commandes",
      titleShort: "Commandes",
      description:
        "Lister les commandes d'une session ou d'un terminal, avec filtre de statut facultatif.",
      widget: {
        newOrder: "Nouvelle commande",
        empty: "Aucune commande dans cette session pour l'instant.",
        emptyHint: "Créez une commande pour commencer à vendre.",
        back: "Retour",
        backToTerminals: "Retour aux terminaux",
        selectSession: "Choisir une session",
        selectSessionHint:
          "Saisissez un ID de session pour voir ses commandes.",
        sessionTotal: "Total de la session",
        filterAll: "Toutes",
        loading: "Chargement des commandes...",
        ordersTotal: "commandes",
        tapToView: "touchez pour voir",
      },
      sessionId: {
        label: "ID de la session",
        description: "Session dont lister les commandes",
      },
      status: {
        label: "Statut",
        description: "Filtrer par statut de commande",
        placeholder: "Tous les statuts",
      },
      page: { label: "Page", description: "Numéro de page (commence à 1)" },
      pageSize: {
        label: "Par page",
        description: "Résultats par page (100 max.)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette session",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de lister les commandes",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Session introuvable",
          description: "Cette session n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Commandes chargées",
        description: "Liste des commandes récupérée",
      },
      response: {
        count: "Total",
        id: "ID de la commande",
        orderNumber: "Numéro de commande",
        sessionId: "ID de la session",
        status: "Statut",
        currency: "Devise",
        total: "Total",
        createdAt: "Créée le",
      },
    },
  },

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "Recherche de produits",
      titleShort: "Recherche de produits",
      description:
        "Rechercher des produits du catalogue par nom ou référence pour une saisie rapide en caisse.",
      widget: {
        noResults: "Aucun produit trouvé. Essayez une autre recherche.",
        tax: "TVA",
        back: "Retour",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Limiter la recherche à une entreprise",
      },
      query: {
        label: "Recherche",
        description: "Rechercher par nom de produit ou référence",
        placeholder: "Café, BEV-001…",
      },
      page: { label: "Page", description: "Numéro de page (commence à 1)" },
      pageSize: {
        label: "Par page",
        description: "Résultats par page (50 max.)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Saisissez au moins un caractère pour rechercher",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour rechercher des produits",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de rechercher les produits",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun produit trouvé",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Produits trouvés",
        description: "Produits correspondants récupérés",
      },
      response: {
        id: "ID du produit",
        name: "Nom",
        sku: "Référence",
        type: "Type",
        basePrice: "Prix",
        currency: "Devise",
        defaultTaxRate: "Taux de TVA",
        unit: "Unité",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "Ajouter un paiement",
      titleShort: "Ajouter un paiement",
      description: "Enregistrer un paiement sur une commande ouverte.",
      widget: {
        fullyPaid: "Entièrement payée",
        backToOrder: "Retour à la commande",
        amountDue: "Montant dû",
        changeLabel: "Monnaie à rendre",
        changeHint: "À rendre au client",
        addAnotherPayment: "Ajouter un autre paiement",
      },
      orderId: {
        label: "ID de la commande",
        description: "Commande à régler",
      },
      method: {
        label: "Moyen de paiement",
        description: "Comment le client paie",
        placeholder: "Choisir un moyen",
      },
      amount: {
        label: "Montant",
        description: "Montant remis",
        placeholder: "0.00",
      },
      change: {
        label: "Monnaie rendue",
        description: "Monnaie rendue au client",
        placeholder: "0.00",
      },
      reference: {
        label: "Référence",
        description: "Code d'autorisation carte ou référence du virement",
      },
      accountNodeId: {
        label: "Nœud de compte",
        description:
          "Nœud de compte de réception (remplace celui du terminal par défaut)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour ajouter des paiements",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette commande",
        },
        conflict: {
          title: "Commande non ouverte",
          description:
            "Impossible d'ajouter un paiement à une commande qui n'est pas ouverte",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'enregistrer le paiement",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Commande introuvable",
          description: "Cette commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Paiement enregistré",
        description: "Paiement enregistré sur la commande",
      },
      response: {
        id: "ID du paiement",
        method: "Moyen",
        amount: "Montant",
        change: "Monnaie rendue",
        totalPaid: "Total payé",
        outstanding: "Reste dû",
      },
    },
  },
};
