import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Achats",
  tags: {
    purchasing: "Achats",
    vendor: "Fournisseur",
    order: "Bon de commande",
    receipt: "Réception",
    create: "Créer",
    list: "Liste",
    get: "Consulter",
    update: "Modifier",
    deactivate: "Désactiver",
    send: "Envoyer",
    confirm: "Confirmer",
    receive: "Réceptionner",
    cancel: "Annuler",
    convertToBill: "Convertir en facture",
    addLine: "Ajouter une ligne",
    removeLine: "Retirer une ligne",
  },
  endpointCategories: {
    purchasing: "Achats",
    vendors: "Fournisseurs",
    purchaseOrders: "Bons de commande",
    purchasingOrders: "Bons de commande",
    purchasingVendors: "Fournisseurs",
  },
  enums: {
    poStatus: {
      draft: "Brouillon",
      sent: "Envoyé",
      confirmed: "Confirmé",
      partiallyReceived: "Partiellement reçu",
      received: "Reçu",
      billed: "Facturé",
      cancelled: "Annulé",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "Créer un fournisseur",
      titleShort: "Créer un fournisseur",
      description: "Enregistrer un nouveau fournisseur pour votre entreprise.",
      widget: {
        back: "Retour",
        viewVendor: "Ouvrir le fournisseur",
        createAnother: "En créer un autre",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez tous les champs et réessayez",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des fournisseurs",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Rôle Membre ou supérieur requis",
        },
        conflict: {
          title: "Code déjà utilisé",
          description: "Un fournisseur avec ce code existe déjà",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer le fournisseur. Réessayez.",
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
        title: "Fournisseur créé",
        description: "Fournisseur enregistré",
      },
      response: {
        id: "ID du fournisseur",
        name: "Nom",
        code: "Code",
        email: "E-mail",
        isActive: "Actif",
        createdAt: "Créé le",
      },
    },
    companyId: {
      label: "Entreprise",
      description: "Entreprise à laquelle appartient ce fournisseur",
      placeholder: "UUID de l'entreprise",
    },
    name: {
      label: "Nom du fournisseur",
      description: "Raison sociale du fournisseur",
      placeholder: "Acme SARL",
    },
    code: {
      label: "Code",
      description: "Identifiant interne court (facultatif)",
      placeholder: "ACM-001",
    },
    email: {
      label: "E-mail",
      description: "E-mail de contact du fournisseur",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "Téléphone",
      description: "Téléphone de contact du fournisseur",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Site web",
      description: "Site web du fournisseur",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "Numéro de TVA",
      description: "Numéro de TVA intracommunautaire du fournisseur",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Identifiant fiscal",
      description: "Numéro d'identification fiscale du fournisseur",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Adresse (ligne 1)",
      description: "Numéro et rue",
      placeholder: "12 rue Principale",
    },
    addressLine2: {
      label: "Adresse (ligne 2)",
      description: "Bâtiment, étage, etc.",
      placeholder: "2e étage",
    },
    city: { label: "Ville", description: "Ville", placeholder: "Berlin" },
    region: {
      label: "Région / État",
      description: "Région ou État",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "Code postal",
      description: "Code postal",
      placeholder: "10115",
    },
    country: {
      label: "Pays",
      description: "Code pays (ISO 3166-1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Devise par défaut",
      description: "Devise des bons de commande pour ce fournisseur",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Délai de paiement (jours)",
      description: "Délai de paiement par défaut, en jours",
      placeholder: "30",
    },
    notes: {
      label: "Notes",
      description: "Notes internes sur ce fournisseur",
      placeholder: "Fournisseur privilégié pour l'électronique",
    },
  },

  // Vendor list
  vendorList: {
    get: {
      title: "Fournisseurs",
      titleShort: "Fournisseurs",
      description: "Lister tous les fournisseurs d'une entreprise.",
      widget: {
        back: "Retour",
        active: "Actif",
        inactive: "Inactif",
        total: "au total",
        createVendor: "Nouveau fournisseur",
        empty: "Aucun fournisseur configuré. Ajoutez-en un pour commencer.",
        vatLabel: "TVA",
        vatPrefix: "TVA :",
        paymentTerms: "Paiement à {{days}} jours",
        paymentTermsPrefix: "Paiement à",
        paymentTermsSuffix: "j",
        loading: "Chargement…",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les fournisseurs",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de lister les fournisseurs",
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
        title: "Fournisseurs chargés",
        description: "Liste des fournisseurs récupérée",
      },
      response: {
        id: "ID du fournisseur",
        name: "Nom",
        code: "Code",
        email: "E-mail",
        vatNumber: "TVA",
        defaultCurrency: "Devise",
        defaultPaymentTermsDays: "Délai de paiement",
        isActive: "Actif",
        createdAt: "Créé le",
      },
    },
    companyId: {
      label: "Entreprise",
      description: "Entreprise dont lister les fournisseurs",
    },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "Consulter le fournisseur",
      titleShort: "Détails du fournisseur",
      description: "Afficher la fiche complète d'un fournisseur.",
      widget: {
        back: "Retour",
        edit: "Modifier le fournisseur",
        createOrder: "Nouveau bon de commande",
        viewOrders: "Voir les commandes",
        deactivate: "Désactiver",
        select: "Choisir un fournisseur",
      },
      vendorId: {
        label: "ID du fournisseur",
        description: "Fournisseur à afficher",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de fournisseur invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les fournisseurs",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce fournisseur",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger le fournisseur",
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
          title: "Fournisseur introuvable",
          description: "Ce fournisseur n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Fournisseur chargé",
        description: "Détails du fournisseur récupérés",
      },
      response: {
        id: "ID du fournisseur",
        companyId: "ID de l'entreprise",
        name: "Nom",
        code: "Code",
        email: "E-mail",
        phone: "Téléphone",
        website: "Site web",
        vatNumber: "Numéro de TVA",
        taxId: "Identifiant fiscal",
        addressLine1: "Adresse",
        addressLine2: "Adresse (ligne 2)",
        city: "Ville",
        region: "Région",
        postalCode: "Code postal",
        country: "Pays",
        defaultCurrency: "Devise par défaut",
        defaultPaymentTermsDays: "Délai de paiement (jours)",
        isActive: "Actif",
        notes: "Notes",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
      },
    },
  },

  // Vendor update
  vendorUpdate: {
    patch: {
      title: "Modifier le fournisseur",
      titleShort: "Modifier le fournisseur",
      description: "Modifier les informations d'un fournisseur.",
      widget: {
        backToVendor: "Retour au fournisseur",
        viewVendor: "Voir le fournisseur",
      },
      vendorId: {
        label: "ID du fournisseur",
        description: "Fournisseur à modifier",
      },
      name: {
        label: "Nom du fournisseur",
        description: "Raison sociale du fournisseur",
        placeholder: "Acme SARL",
      },
      code: {
        label: "Code",
        description: "Identifiant interne court",
        placeholder: "ACM-001",
      },
      email: {
        label: "E-mail",
        description: "E-mail de contact du fournisseur",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "Téléphone",
        description: "Téléphone de contact du fournisseur",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Site web",
        description: "Site web du fournisseur",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "Numéro de TVA",
        description: "Numéro de TVA intracommunautaire du fournisseur",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Identifiant fiscal",
        description: "Numéro d'identification fiscale",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Adresse (ligne 1)",
        description: "Numéro et rue",
        placeholder: "12 rue Principale",
      },
      addressLine2: {
        label: "Adresse (ligne 2)",
        description: "Bâtiment, étage, etc.",
        placeholder: "2e étage",
      },
      city: { label: "Ville", description: "Ville", placeholder: "Berlin" },
      region: {
        label: "Région / État",
        description: "Région ou État",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "Code postal",
        description: "Code postal",
        placeholder: "10115",
      },
      country: {
        label: "Pays",
        description: "Code pays (ISO 3166-1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Devise par défaut",
        description: "Devise des bons de commande pour ce fournisseur",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Délai de paiement (jours)",
        description: "Délai de paiement par défaut, en jours",
        placeholder: "30",
      },
      notes: {
        label: "Notes",
        description: "Notes internes sur ce fournisseur",
        placeholder: "Fournisseur privilégié",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour modifier des fournisseurs",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce fournisseur",
        },
        conflict: {
          title: "Conflit de code",
          description: "Ce code fournisseur est déjà utilisé",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de modifier le fournisseur",
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
          title: "Fournisseur introuvable",
          description: "Ce fournisseur n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Fournisseur mis à jour",
        description: "Le fournisseur a été mis à jour",
      },
      response: {
        id: "ID du fournisseur",
        name: "Nom",
        isActive: "Actif",
        updatedAt: "Mis à jour le",
      },
    },
  },

  // Vendor deactivate
  vendorDeactivate: {
    post: {
      title: "Désactiver le fournisseur",
      titleShort: "Désactiver",
      description:
        "Marquer un fournisseur comme inactif. Les bons de commande existants ne changent pas.",
      vendorId: {
        label: "ID du fournisseur",
        description: "Fournisseur à désactiver",
      },
      widget: {
        warning:
          "Le fournisseur sera désactivé. Les bons de commande existants ne changent pas.",
        backToList: "Retour aux fournisseurs",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de fournisseur invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour désactiver des fournisseurs",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce fournisseur",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de désactiver le fournisseur",
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
          title: "Fournisseur introuvable",
          description: "Ce fournisseur n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Fournisseur désactivé",
        description: "Le fournisseur est désormais inactif",
      },
      response: {
        id: "ID du fournisseur",
        isActive: "Actif",
      },
    },
  },

  // PO create
  orderCreate: {
    post: {
      title: "Créer un bon de commande",
      titleShort: "Créer une commande",
      description: "Créer un nouveau bon de commande au statut Brouillon.",
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez tous les champs et réessayez",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Rôle Membre ou supérieur requis",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer le bon de commande. Réessayez.",
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
          description: "Fournisseur ou entreprise introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande créé",
        description: "Bon de commande créé au statut Brouillon",
      },
      widget: {
        browseVendors: "Parcourir les fournisseurs",
        browseWarehouses: "Parcourir les entrepôts",
        viewOrder: "Ouvrir le bon de commande",
        backToList: "Retour à la liste",
      },
      response: {
        id: "ID du bon de commande",
        poNumber: "Numéro du bon de commande",
        status: "Statut",
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
        createdAt: "Créé le",
      },
    },
    companyId: {
      label: "Entreprise",
      description: "Entreprise émettrice du bon de commande",
      placeholder: "UUID de l'entreprise",
    },
    vendorId: {
      label: "Fournisseur",
      description: "Fournisseur destinataire du bon de commande",
      placeholder: "UUID du fournisseur",
    },
    currency: {
      label: "Devise",
      description: "Devise du bon de commande",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Livraison prévue",
      description: "Date de livraison prévue (facultatif)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Entrepôt de livraison",
      description: "Entrepôt qui réceptionne la marchandise (facultatif)",
      placeholder: "UUID de l'entrepôt",
    },
    notes: {
      label: "Notes",
      description: "Notes internes pour ce bon de commande",
      placeholder: "Commande urgente",
    },
    lines: {
      label: "Lignes",
      description: "Produits et quantités à commander",
    },
    lineDescription: {
      label: "Description",
      description: "Description de l'article",
      placeholder: "Chaises de bureau",
    },
    lineProductId: {
      label: "ID du produit",
      description: "Produit du catalogue (facultatif)",
      placeholder: "UUID du produit",
    },
    lineQuantity: {
      label: "Quantité",
      description: "Nombre d'unités",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Prix unitaire",
      description: "Prix à l'unité",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Taux de TVA",
      description: "Taux en décimal (ex. 0.19 = 19 %)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Ordre d'affichage",
      description: "Position de cette ligne",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "Bons de commande",
      titleShort: "Commandes",
      description:
        "Lister les bons de commande d'une entreprise, avec filtre de statut facultatif.",
      widget: {
        newOrder: "Nouveau bon de commande",
        empty: "Aucun bon de commande trouvé.",
        statusAll: "Tous",
        orders: "bons de commande",
        order: "bon de commande",
        colPoVendor: "Bon de commande / Fournisseur",
        colDate: "Date",
        colAmount: "Montant",
        colStatus: "Statut",
        deliveryArrow: "→",
        overdue: "en retard",
        actionNeeded: "bons de commande à traiter",
        back: "Retour",
        loading: "Chargement…",
      },
      companyId: {
        label: "Entreprise",
        description: "Entreprise dont lister les bons de commande",
      },
      status: {
        label: "Filtre de statut",
        description: "Filtrer par statut du bon de commande (facultatif)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de lister les bons de commande",
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
        title: "Bons de commande chargés",
        description: "Liste des bons de commande récupérée",
      },
      response: {
        id: "ID du bon de commande",
        poNumber: "Numéro du bon de commande",
        vendorId: "Fournisseur",
        vendorName: "Fournisseur",
        status: "Statut",
        currency: "Devise",
        total: "Total",
        expectedDeliveryDate: "Livraison prévue",
        createdAt: "Créé le",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "Consulter le bon de commande",
      titleShort: "Détails de la commande",
      description:
        "Afficher un bon de commande avec toutes ses lignes et l'historique des réceptions.",
      widget: {
        back: "Retour",
        send: "Envoyer au fournisseur",
        confirm: "Marquer comme confirmé",
        receive: "Réceptionner",
        convertToBill: "Convertir en facture",
        viewBill: "Voir la facture",
        addLine: "+ Ajouter une ligne",
        cancel: "Annuler la commande",
        edit: "Modifier",
        select: "Choisir un bon de commande",
        linesHeader: "Lignes",
        receiptsHeader: "Historique des réceptions",
        noLines: "Aucune ligne.",
        noReceipts: "Aucune réception pour l'instant.",
        colDescription: "Description",
        colQtyPrice: "Qté × Prix",
        colLineTotal: "Total",
        delivery: "Livraison prévue :",
        overdue: "(en retard)",
        received: "reçu",
        billCreated:
          "Facture fournisseur créée à partir de ce bon de commande.",
        vendorLabel: "Fournisseur :",
      },
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à afficher",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de bon de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger le bon de commande",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande chargé",
        description: "Détails du bon de commande récupérés",
      },
      response: {
        id: "ID du bon de commande",
        companyId: "ID de l'entreprise",
        vendorId: "ID du fournisseur",
        poNumber: "Numéro du bon de commande",
        status: "Statut",
        currency: "Devise",
        expectedDeliveryDate: "Livraison prévue",
        deliveryWarehouseId: "Entrepôt de livraison",
        notes: "Notes",
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
        billId: "ID de la facture",
        confirmedAt: "Confirmé le",
        receivedAt: "Reçu le",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
        lines: "Lignes",
        lineId: "ID de la ligne",
        lineProductId: "ID du produit",
        lineDescription: "Description",
        lineQuantity: "Qté",
        lineUnitPrice: "Prix unitaire",
        lineTaxRate: "Taux de TVA",
        lineTaxAmount: "TVA",
        lineTotal: "Total",
        lineQuantityReceived: "Reçu",
        receipts: "Réceptions",
        receiptId: "ID de la réception",
        receiptReceivedAt: "Reçu le",
        receiptNotes: "Notes",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "Modifier le bon de commande",
      titleShort: "Modifier la commande",
      description:
        "Modifier un bon de commande au statut Brouillon : champs et lignes.",
      widget: {
        backToPO: "Retour au bon de commande",
      },
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à modifier",
      },
      vendorId: {
        label: "Fournisseur",
        description: "Changer de fournisseur (facultatif)",
        placeholder: "UUID du fournisseur",
      },
      currency: {
        label: "Devise",
        description: "Devise du bon de commande",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Livraison prévue",
        description: "Date de livraison prévue",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Entrepôt de livraison",
        description: "Entrepôt qui réceptionne la marchandise",
        placeholder: "UUID de l'entrepôt",
      },
      notes: {
        label: "Notes",
        description: "Notes internes pour ce bon de commande",
        placeholder: "Commande urgente",
      },
      lines: {
        label: "Lignes",
        description: "Remplacer toutes les lignes (facultatif)",
      },
      lineDescription: {
        label: "Description",
        description: "Description de l'article",
        placeholder: "Chaises de bureau",
      },
      lineProductId: {
        label: "ID du produit",
        description: "Produit du catalogue (facultatif)",
        placeholder: "UUID du produit",
      },
      lineQuantity: {
        label: "Quantité",
        description: "Nombre d'unités",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Prix unitaire",
        description: "Prix à l'unité",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Taux de TVA",
        description: "Taux en décimal",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Ordre d'affichage",
        description: "Position de cette ligne",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour modifier des bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Pas un brouillon",
          description:
            "Seuls les bons de commande au statut Brouillon sont modifiables",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de modifier le bon de commande",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande mis à jour",
        description: "Le bon de commande a été mis à jour",
      },
      response: {
        id: "ID du bon de commande",
        status: "Statut",
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
        updatedAt: "Mis à jour le",
      },
    },
  },

  // PO send
  orderSend: {
    post: {
      title: "Envoyer le bon de commande",
      titleShort: "Envoyer la commande",
      description: "Marquer le bon de commande comme envoyé au fournisseur.",
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à envoyer",
      },
      widget: {
        back: "Retour",
        backToPO: "Retour au bon de commande",
        warning:
          "L'envoi marque ce bon de commande comme transmis au fournisseur. Le statut passe de Brouillon à Envoyé.",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de bon de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour envoyer des bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Pas un brouillon",
          description:
            "Seuls les bons de commande au statut Brouillon peuvent être envoyés",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'envoyer le bon de commande",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande envoyé",
        description: "Bon de commande marqué comme Envoyé",
      },
      response: {
        id: "ID du bon de commande",
        status: "Statut",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "Confirmer le bon de commande",
      titleShort: "Confirmer la commande",
      description:
        "Le fournisseur a confirmé le bon de commande : le marquer comme Confirmé.",
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à confirmer",
      },
      widget: {
        back: "Retour",
        backToPO: "Retour au bon de commande",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de bon de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour confirmer des bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Statut invalide",
          description:
            "Seuls les bons de commande envoyés peuvent être confirmés",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de confirmer le bon de commande",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande confirmé",
        description: "Bon de commande marqué comme Confirmé",
      },
      response: {
        id: "ID du bon de commande",
        status: "Statut",
        confirmedAt: "Confirmé le",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "Réceptionner la marchandise",
      titleShort: "Réceptionner",
      description:
        "Enregistrer la réception de marchandise sur un bon de commande. Génère les mouvements de stock.",
      widget: {
        backToPO: "Retour au bon de commande",
      },
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande concerné par la réception",
      },
      warehouseId: {
        label: "Entrepôt",
        description: "Entrepôt qui réceptionne la marchandise (facultatif)",
        placeholder: "UUID de l'entrepôt",
      },
      notes: {
        label: "Notes",
        description: "Notes sur cette livraison",
        placeholder: "Bon de livraison n° 12345",
      },
      lines: {
        label: "Articles reçus",
        description: "Quantités reçues pour chaque ligne",
      },
      linePoLineId: {
        label: "ID de la ligne",
        description: "Ligne du bon de commande",
      },
      lineQuantityReceived: {
        label: "Quantité reçue",
        description: "Quantité reçue pour cette ligne",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez tous les champs et les quantités",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour réceptionner de la marchandise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Statut invalide",
          description:
            "Le bon de commande doit être Confirmé ou Envoyé pour réceptionner",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'enregistrer la réception",
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
          title: "Bon de commande introuvable",
          description: "Bon de commande ou ligne introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Marchandise réceptionnée",
        description: "Réception enregistrée et stock mis à jour",
      },
      response: {
        receiptId: "ID de la réception",
        status: "Statut du bon de commande",
        receivedAt: "Reçu le",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "Convertir en facture",
      titleShort: "Convertir en facture",
      description:
        "Créez une facture fournisseur à partir d’une commande entièrement réceptionnée. La validation de la facture comptabilise la dette.",
      widget: {
        back: "Retour",
        viewBill: "Voir la facture",
      },
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à convertir",
      },
      errors: {
        validation: {
          title: "Vérifiez la devise et les totaux",
          description:
            "La devise doit être prise en charge et les totaux doivent correspondre aux lignes de commande.",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des factures",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Facturation impossible",
          description:
            "La commande doit être entièrement réceptionnée et sans facture associée.",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer la facture",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Facture créée",
        description: "Facture fournisseur créée à partir du bon de commande",
      },
      response: {
        billId: "ID de la facture",
        billNumber: "Numéro de facture",
        poId: "ID du bon de commande",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Retour à la commande",
        lineAdded: "Ligne ajoutée",
      },
      title: "Ajouter une ligne",
      titleShort: "Ajouter une ligne",
      description: "Ajouter une ligne à un bon de commande.",
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande auquel ajouter une ligne",
      },
      productId: {
        label: "Produit",
        description: "Produit du catalogue (facultatif)",
        placeholder: "UUID du produit",
      },
      itemDescription: {
        label: "Description",
        description: "Description de l'article",
        placeholder: "Chaises de bureau",
      },
      quantity: {
        label: "Quantité",
        description: "Nombre d'unités",
        placeholder: "10",
      },
      unitPrice: {
        label: "Prix unitaire",
        description: "Prix à l'unité",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Taux de TVA",
        description: "Taux en décimal (ex. 0.19 = 19 %)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez tous les champs et réessayez",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour ajouter des lignes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Pas un brouillon",
          description:
            "Seuls les bons de commande au statut Brouillon sont modifiables",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'ajouter la ligne",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Ligne ajoutée",
        description: "Ligne ajoutée au bon de commande",
      },
      response: {
        lineId: "ID de la ligne",
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
      },
    },
  },

  // PO line remove
  orderLineRemove: {
    post: {
      title: "Retirer une ligne",
      titleShort: "Retirer une ligne",
      description: "Retirer une ligne d'un bon de commande.",
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande dont retirer une ligne",
      },
      lineId: { label: "ID de la ligne", description: "Ligne à retirer" },
      widget: {
        backToOrder: "Retour au bon de commande",
        warning: "La ligne sera définitivement retirée du bon de commande.",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID invalides",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour retirer des lignes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Pas un brouillon",
          description:
            "Seuls les bons de commande au statut Brouillon sont modifiables",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de retirer la ligne",
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
          description: "Bon de commande ou ligne introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Ligne retirée",
        description: "Ligne retirée du bon de commande",
      },
      response: {
        subtotal: "Sous-total",
        taxAmount: "TVA",
        total: "Total",
      },
    },
  },

  // Purchasing Dashboard
  dashboard: {
    get: {
      title: "Vue d'ensemble des achats",
      titleShort: "Vue d'ensemble",
      description:
        "Instantané en direct des bons de commande et de l'activité fournisseurs de votre entreprise.",
      widget: {
        openValue: "Montant des commandes ouvertes",
        settledBills: "Factures réglées ce mois-ci",
        deliveries: "Livraisons attendues",
        order: "Commande",
        supplier: "Fournisseur",
        expected: "Date prévue",
        orderTotal: "Total de la commande",
        noDeliveries: "Aucune livraison en attente",
        overdue: "Livraisons en retard",
        dueSeven: "Attendues sous 7 jours",
        kpiDraft: "Brouillons",
        kpiConfirmed: "Confirmés",
        kpiAwaitingReceipt: "En attente de réception",
        kpiActiveVendors: "Fournisseurs actifs",
        warningDueThisWeek:
          "Une commande doit arriver cette semaine. Vérifiez sa date de livraison.",
        warningDueThisWeekPlural:
          "{{count}} commandes doivent arriver cette semaine. Vérifiez les dates de livraison.",
        navNewPo: "Nouveau bon de commande",
        navAllPos: "Tous les bons de commande",
        navVendors: "Fournisseurs",
        navNewVendor: "Nouveau fournisseur",
        loading: "Chargement…",
      },
      companyId: {
        label: "Entreprise",
        description:
          "Entreprise dont afficher les statistiques d'achats (facultatif)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir la vue d'ensemble des achats",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger la vue d'ensemble des achats",
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
        title: "Tableau de bord chargé",
        description: "Vue d'ensemble des achats récupérée",
      },
      response: {
        draftCount: "Bons de commande en brouillon",
        confirmedCount: "Bons de commande confirmés",
        awaitingReceiptCount: "En attente de réception",
        activeVendorCount: "Fournisseurs actifs",
        dueThisWeekCount: "Attendus cette semaine",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "Annuler le bon de commande",
      titleShort: "Annuler la commande",
      description: "Annuler un bon de commande au statut Brouillon ou Envoyé.",
      poId: {
        label: "ID du bon de commande",
        description: "Bon de commande à annuler",
      },
      widget: {
        back: "Retour",
        warning:
          "Le bon de commande sera définitivement annulé. Seuls les bons de commande en brouillon ou envoyés peuvent être annulés.",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de bon de commande invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour annuler des bons de commande",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce bon de commande",
        },
        conflict: {
          title: "Annulation impossible",
          description:
            "Seuls les bons de commande en brouillon ou envoyés peuvent être annulés",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'annuler le bon de commande",
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
          title: "Bon de commande introuvable",
          description: "Ce bon de commande n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Bon de commande annulé",
        description: "Le bon de commande a été annulé",
      },
      response: {
        id: "ID du bon de commande",
        status: "Statut",
      },
    },
  },
};
