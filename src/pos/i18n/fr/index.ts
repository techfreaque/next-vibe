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
  workflow: {
    backToSessionOrders: "Retour aux commandes de la session",
    receiptTitle: "Reçu",
    amountDue: "Montant dû",
    ledgerCurrencyMismatch:
      "La devise de cette commande diffère de celle de la comptabilité. Utilisez une caisse ou une commande dans la devise comptable avant d’encaisser.",
    postingUnavailable:
      "La vente n’a pas pu être comptabilisée. Vérifiez la devise de la société, la période ouverte et les comptes.",
    cashCurrencyMismatch:
      "Les espèces doivent être dans la devise de la caisse. Choisissez un autre moyen de paiement pour cette commande.",
    tenderMinorUnits: "Saisissez des montants au centime près.",
    legacyTenderReview:
      "Un paiement antérieur comporte une fraction de centime. Vérifiez le paiement avant d’en encaisser un autre.",
    legacyTenderRecorded:
      "Cette commande conserve les montants d’origine à quatre décimales.",
    legacyPostingReview:
      "Les montants comportant une fraction de centime ne peuvent pas être comptabilisés. Vérifiez le paiement d’origine avant de conclure la vente.",
    viewReceipt: "Voir le reçu",
    openDrawer: "Ouvrir la caisse",
    warehouse: "Entrepôt de vente",
    noWarehouse: "Aucun entrepôt attribué",
    chooseCompanyFirst: "Sélectionnez d’abord une société.",
    warehouseInstruction:
      "Choisissez un entrepôt actif de la société sélectionnée.",
    stockUnavailable:
      "Le stock disponible dans l’entrepôt de cette caisse est insuffisant. Vérifiez les quantités avant de terminer la vente.",
  },
  dashboard: {
    get: {
      title: "Tableau de bord caisse",
      titleShort: "Tableau de bord",
      description:
        "Vue d'ensemble des terminaux, des sessions ouvertes et des ventes du jour.",
      widget: {
        title: "Point de vente",
        subtitle:
          "Ouvrez une caisse, encaissez, clôturez le service avec un comptage.",
        salesHistory: "Historique des ventes",
        newTill: "Nouvelle caisse",
        kpiSalesToday: "Ventes du jour",
        kpiSalesCount: "Ventes : {{count}}",
        kpiOpenTills: "Caisses ouvertes",
        kpiTillsTotal: "{{active}} actives sur {{total}}",
        kpiAverage: "Panier moyen",
        kpiRefunds: "Remboursements du jour",
        kpiRefundsCount: "Remboursements : {{count}}",
        tillsTitle: "Caisses",
        manageTills: "Gérer les caisses",
        emptyTitle: "Aucune caisse",
        emptyMessage: "Ajoutez une caisse pour vendre au comptoir.",
        createTill: "Ajouter une caisse",
        tillSelling: "En vente",
        tillReady: "Prête",
        tillInactive: "Inactive",
        openRegister: "Ouvrir l'écran de caisse",
        openTill: "Ouvrir la caisse",
        closeTill: "Fermer la caisse",
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
        refundsToday: "Remboursements du jour",
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
      title: "Nouvelle caisse",
      titleShort: "Nouvelle caisse",
      description:
        "Ajouter une caisse à une entreprise : nom, devise, compte de caisse et entrepôt.",
      widget: {
        title: "Nouvelle caisse",
        subtitle:
          "Une caisse vend dans une devise, comptabilise les espèces sur un compte et sort le stock d'un entrepôt.",
        subtitleCompany:
          "Nouvelle caisse pour {{company}}. Elle vend dans une devise et comptabilise les espèces sur un compte.",
        back: "Retour",
        backToList: "Toutes les caisses",
        openTill: "Ouvrir la caisse",
        cancel: "Annuler",
        submit: "Créer la caisse",
        none: "Aucun",
        sectionTill: "Caisse",
        sectionMoney: "Argent",
        sectionMoneyHint:
          "La devise de vente et le compte qui reçoit les espèces.",
        sectionStock: "Stock",
        sectionStockHint:
          "Les ventes terminées sortent le stock de cet entrepôt. Laissez vide si vous ne vendez que des services.",
        defaultCashAccount: "Compte de caisse par défaut de l'entreprise",
        noWarehouse: "Sans suivi de stock",
        chooseCompanyFirst: "Choisissez d'abord une entreprise.",
      },
      companyId: {
        label: "Entreprise",
        description: "L'entreprise propriétaire de la caisse",
      },
      name: {
        label: "Nom",
        description: "Affiché sur la carte de caisse et sur les tickets",
        placeholder: "Comptoir principal",
      },
      location: {
        label: "Emplacement",
        description: "Où se trouve la caisse. Facultatif.",
        placeholder: "Rez-de-chaussée",
      },
      currency: {
        label: "Devise",
        description: "Chaque vente sur cette caisse utilise cette devise",
        placeholder: "Choisir une devise",
      },
      cashAccountNodeId: {
        label: "Compte de caisse",
        description:
          "Les espèces encaissées ici sont comptabilisées sur ce compte.",
        invalid:
          "Choisissez un compte de caisse ou de banque imputable de cette entreprise.",
      },
      warehouseId: {
        label: "Entrepôt",
        description:
          "Le stock sort de cet entrepôt quand une vente est terminée.",
      },
      errors: {
        validation: {
          title: "Vérifiez la caisse",
          description: "Saisissez un nom et choisissez une devise.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour ajouter des caisses.",
        },
        forbidden: {
          title: "Réservé aux admins",
          description: "Seuls les admins de l'entreprise ajoutent des caisses.",
        },
        conflict: {
          title: "Nom déjà pris",
          description: "Une caisse porte déjà ce nom.",
        },
        server: {
          title: "Caisse non créée",
          description: "Un problème est survenu. Réessayez.",
        },
        unknown: {
          title: "Caisse non créée",
          description: "Un problème est survenu. Réessayez.",
        },
        network: {
          title: "Pas de connexion",
          description: "Vérifiez votre connexion et réessayez.",
        },
        notFound: {
          title: "Introuvable",
          description: "L'entreprise ou l'entrepôt n'existe pas.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Terminez ou annulez vos modifications d'abord.",
        },
      },
      success: {
        title: "Caisse créée",
        description: "Comptez le fond de caisse et ouvrez-la pour vendre.",
      },
      response: {
        id: "Caisse",
        name: "Nom",
        companyId: "Entreprise",
        currency: "Devise",
        isActive: "Active",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Caisses",
      titleShort: "Caisses",
      description:
        "Toutes les caisses de vos entreprises et celles qui vendent en ce moment.",
      widget: {
        title: "Caisses",
        pickTitle: "Choisir une caisse",
        subtitle:
          "Chaque caisse de votre comptoir et si elle vend en ce moment.",
        summary: "Caisses : {{total}} · En vente : {{selling}}",
        newTill: "Nouvelle caisse",
        createTill: "Ajouter une caisse",
        emptyTitle: "Aucune caisse",
        emptyMessage: "Ajoutez une caisse pour vendre au comptoir.",
        selling: "En vente",
        ready: "Prête",
        inactive: "Inactive",
        openRegister: "Ouvrir l'écran de caisse",
        openTill: "Ouvrir la caisse",
        loading: "Chargement des caisses",
        back: "Retour",
      },
      companyId: {
        label: "Entreprise",
        description: "Seulement les caisses de cette entreprise",
      },
      terminalId: {
        label: "Caisse",
        description: "Seulement cette caisse",
      },
      errors: {
        validation: {
          title: "Vérifiez le filtre",
          description: "L'entreprise ou la caisse n'est pas valide.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour voir les caisses.",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'êtes pas membre de cette entreprise.",
        },
        conflict: {
          title: "Conflit",
          description: "Les données ont changé. Rechargez et réessayez.",
        },
        server: {
          title: "Caisses non chargées",
          description: "Un problème est survenu. Réessayez.",
        },
        unknown: {
          title: "Caisses non chargées",
          description: "Un problème est survenu. Réessayez.",
        },
        network: {
          title: "Pas de connexion",
          description: "Vérifiez votre connexion et réessayez.",
        },
        notFound: {
          title: "Introuvable",
          description: "Cette entreprise n'existe pas.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Terminez ou annulez vos modifications d'abord.",
        },
      },
      success: {
        title: "Caisses chargées",
        description: "Vos caisses sont à jour.",
      },
      response: {
        id: "Caisse",
        name: "Nom",
        location: "Emplacement",
        currency: "Devise",
        isActive: "Active",
        companyName: "Entreprise",
        openSessionId: "Service ouvert",
        createdAt: "Créée",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Ouvrir la caisse",
      titleShort: "Ouvrir la caisse",
      description:
        "Démarrer un service sur une caisse avec le fond compté dans le tiroir.",
      widget: {
        title: "Ouvrir la caisse",
        subtitle: "Comptez les espèces du tiroir, puis démarrez le service.",
        back: "Retour",
        cancel: "Annuler",
        loadingTill: "Chargement de la caisse",
        selling: "En vente",
        ready: "Prête",
        inactive: "Inactive",
        alreadyOpen: "Cette caisse est déjà ouverte. Continuez à vendre.",
        openRegister: "Ouvrir l'écran de caisse",
        floatHint:
          "Le fond de caisse sert à rendre la monnaie. À la fermeture, le comptage est comparé à ce montant.",
      },
      terminalId: {
        label: "Caisse",
        description: "La caisse à ouvrir",
      },
      openingFloat: {
        label: "Fond de caisse",
        description: "Espèces dans le tiroir au début du service",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Vérifiez le fond de caisse",
          description: "Saisissez les espèces du tiroir, zéro ou plus.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour ouvrir une caisse.",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'êtes pas membre de l'entreprise de cette caisse.",
        },
        conflict: {
          title: "Caisse déjà ouverte",
          description: "Cette caisse a déjà un service ouvert.",
        },
        server: {
          title: "Caisse non ouverte",
          description: "Un problème est survenu. Réessayez.",
        },
        unknown: {
          title: "Caisse non ouverte",
          description: "Un problème est survenu. Réessayez.",
        },
        network: {
          title: "Pas de connexion",
          description: "Vérifiez votre connexion et réessayez.",
        },
        notFound: {
          title: "Caisse introuvable",
          description: "Cette caisse n'existe pas.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Terminez ou annulez vos modifications d'abord.",
        },
      },
      success: {
        title: "Caisse ouverte",
        description: "Le service a commencé. Encaissez la première vente.",
      },
      response: {
        id: "Service",
        terminalId: "Caisse",
        openedAt: "Ouverte le",
        status: "Statut",
        openingFloat: "Fond de caisse",
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
        backToTerminals: "Retour",
        sessionSummary: "Récapitulatif de la session",
        terminal: "Terminal",
        openedAt: "Ouverte le",
        orderCount: "Commandes : {{count}}",
        sessionRevenue: "Chiffre d'affaires",
        floatHint: "Comptez tous les billets et pièces du tiroir.",
        reconciliation: "Clôture de caisse",
        sessionReady: "Session",
        active: "Active",
        openingFloat: "Fond de caisse",
        cashSales: "Ventes en espèces",
        expectedClosingFloat: "Attendu en caisse",
        actualClosingFloat: "Espèces comptées",
        variance: "Écart",
        reconciliationTitle: "Comptage de caisse",
        title: "Fermer la caisse",
        subtitle: "{{terminal}} · ouverte depuis {{time}}",
        cashRefunds: "Remboursements en espèces",
        balanced: "Caisse juste",
        over: "Excédent de {{amount}}",
        short: "Manque {{amount}}",
        openSaleBlocks:
          "Une vente est encore ouverte sur cette caisse. Terminez-la ou annulez-la à l'écran de caisse, puis fermez la caisse.",
        backToPos: "Retour au point de vente",
      },
      sessionId: {
        label: "ID de la session",
        description: "Session à clôturer",
      },
      closingFloat: {
        label: "Espèces comptées",
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
        cashRefundsTotal: "Remboursements en espèces",
        openingFloat: "Fonds de caisse initial",
        variance: "Écart",
        orderCount: "Nombre de commandes",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Récapitulatif du service",
      titleShort: "Service",
      description:
        "Un service sur une caisse : ouverture, caissier et montant attendu dans le tiroir.",
      widget: {
        title: "Service",
        back: "Retour",
        loading: "Chargement du service",
        selling: "En vente",
        closed: "Fermée",
        subtitleOpen: "Ouverte depuis {{time}}",
        subtitleClosed: "Fermée le {{time}}",
        sales: "Ventes",
        closeTill: "Fermer la caisse",
        openRegister: "Ouvrir l'écran de caisse",
        drawerTitle: "Tiroir-caisse",
        variance: "Écart",
        closeSession: "Fermer la caisse",
        newOrder: "Nouvelle commande",
      },
      sessionId: {
        label: "Service",
        description: "Le service à afficher",
      },
      errors: {
        validation: {
          title: "Vérifiez le service",
          description: "Ce lien de service n'est pas valide.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour voir les services.",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Vous n'êtes pas membre de l'entreprise de cette caisse.",
        },
        conflict: {
          title: "Conflit",
          description: "Les données ont changé. Rechargez et réessayez.",
        },
        server: {
          title: "Service non chargé",
          description: "Un problème est survenu. Réessayez.",
        },
        unknown: {
          title: "Service non chargé",
          description: "Un problème est survenu. Réessayez.",
        },
        network: {
          title: "Pas de connexion",
          description: "Vérifiez votre connexion et réessayez.",
        },
        notFound: {
          title: "Service introuvable",
          description: "Ce service n'existe pas.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Terminez ou annulez vos modifications d'abord.",
        },
      },
      success: {
        title: "Service chargé",
        description: "Les montants du tiroir sont à jour.",
      },
      response: {
        id: "Service",
        terminalId: "Caisse",
        terminalName: "Caisse",
        companyName: "Entreprise",
        cashierUserId: "Caissier",
        cashierName: "Caissier",
        status: "Statut",
        openedAt: "Ouverte le",
        closedAt: "Fermée le",
        openingFloat: "Fond de caisse",
        closingFloat: "Compté à la fermeture",
        cashSalesTotal: "Ventes en espèces",
        cashRefundsTotal: "Remboursements en espèces",
        expectedCash: "Attendu dans le tiroir",
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
      mergeWithLine: {
        label: "Ajouter à la ligne existante",
        description:
          "Augmente la quantité de la ligne déjà présente pour ce produit",
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
      quantity: {
        label: "Quantité à retirer",
        description: "Laissez vide pour retirer toute la ligne",
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
        refund: "Rembourser",
        continueInRegister: "Continuer en caisse",
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
        title: "Ventes",
        subtitleAll: "Toutes les ventes en caisse, les plus récentes d'abord.",
        subtitleSession: "Ventes de cette session, les plus récentes d'abord.",
        openRegister: "Ouvrir l'écran de caisse",
        colSale: "Vente",
        colTime: "Heure",
        colStatus: "Statut",
        colTotal: "Total",
        count: "Ventes : {{count}}",
        newOrder: "Nouvelle commande",
        empty: "Aucune vente",
        emptyHint: "Les ventes encaissées apparaissent ici avec leur ticket.",
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
      companyId: {
        label: "Entreprise",
        description: "Entreprise dont afficher les ventes en caisse",
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
        terminalName: "Caisse",
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
      titleShort: "Produits",
      description:
        "Trouver des produits du catalogue par nom ou référence, avec prix et TVA.",
      widget: {
        title: "Produits",
        pickTitle: "Choisir un produit",
        subtitle:
          "Cherchez par nom ou référence. Un code-barres scanné trouve le produit exact.",
        back: "Retour",
        loading: "Chargement des produits",
        emptyTitle: "Aucun produit",
        emptyMessage:
          "Les produits de votre catalogue apparaissent ici avec leur prix.",
        noMatchTitle: "Aucun résultat pour « {{query}} »",
        noMatchMessage: "Vérifiez l'orthographe ou cherchez par référence.",
        vat: "TVA {{rate}}",
        noVat: "Sans TVA",
        perUnit: "par {{unit}}",
      },
      companyId: {
        label: "Entreprise",
        description: "Seulement les produits de cette entreprise",
      },
      query: {
        label: "Rechercher des produits",
        description:
          "Nom du produit ou référence. Laissez vide pour parcourir.",
        placeholder: "Nom ou référence",
      },
      currency: {
        label: "Devise",
        description: "Seulement les produits dans cette devise",
      },
      page: {
        label: "Page",
        description: "Numéro de page, à partir de 1",
      },
      pageSize: {
        label: "Par page",
        description: "Résultats par page, 50 au plus",
      },
      errors: {
        validation: {
          title: "Vérifiez la recherche",
          description: "120 caractères au plus.",
        },
        unauthorized: {
          title: "Connexion requise",
          description: "Connectez-vous pour chercher des produits.",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'êtes pas membre de cette entreprise.",
        },
        conflict: {
          title: "Conflit",
          description: "Les données ont changé. Rechargez et réessayez.",
        },
        server: {
          title: "Recherche impossible",
          description: "Un problème est survenu. Réessayez.",
        },
        unknown: {
          title: "Recherche impossible",
          description: "Un problème est survenu. Réessayez.",
        },
        network: {
          title: "Pas de connexion",
          description: "Vérifiez votre connexion et réessayez.",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun produit trouvé.",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Terminez ou annulez vos modifications d'abord.",
        },
      },
      success: {
        title: "Produits trouvés",
        description: "Les résultats sont à jour.",
      },
      response: {
        id: "Produit",
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
