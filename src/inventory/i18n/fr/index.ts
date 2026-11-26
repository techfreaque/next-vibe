import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stocks",
  shared: {
    errors: {
      failedToRecordMovement: "Échec de l'enregistrement du mouvement de stock",
      failedToApplyMovement: "Échec de l'application du mouvement de stock",
    },
  },
  tags: {
    inventory: "Stocks",
    warehouse: "Entrepôt",
    stock: "Stock",
    transfer: "Transfert",
    create: "Créer",
    list: "Lister",
    get: "Consulter",
    update: "Modifier",
    adjust: "Ajuster",
    receive: "Réceptionner",
    issue: "Sortie",
    dispatch: "Expédier",
  },
  endpointCategories: {
    inventory: "Stocks",
    warehouses: "Entrepôts",
    stock: "Niveaux de stock",
    transfers: "Transferts",
  },
  enums: {
    movementType: {
      receipt: "Réception",
      issue: "Sortie",
      transferIn: "Transfert entrant",
      transferOut: "Transfert sortant",
      adjustment: "Ajustement",
      sale: "Vente",
      return: "Retour",
    },
    transferStatus: {
      draft: "Brouillon",
      inTransit: "En transit",
      received: "Réceptionné",
      cancelled: "Annulé",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "Créer un entrepôt",
      titleShort: "Nouvel entrepôt",
      description: "Enregistrer un nouvel entrepôt pour une entreprise.",
      widget: {
        backToList: "Retour aux entrepôts",
        active: "Actif",
        inactive: "Inactif",
        default: "Par défaut",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise à laquelle appartient cet entrepôt",
      },
      name: {
        label: "Nom de l'entrepôt",
        description: "Nom complet de l'entrepôt",
        placeholder: "Entrepôt principal",
      },
      code: {
        label: "Code",
        description: "Identifiant court (ex. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresse",
        description: "Adresse physique de l'entrepôt",
        placeholder: "12 rue des Entrepôts",
      },
      isActive: {
        label: "Actif",
        description: "Indique si cet entrepôt est opérationnel",
      },
      isDefault: {
        label: "Entrepôt par défaut",
        description: "Définir comme entrepôt par défaut de cette entreprise",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des entrepôts",
        },
        forbidden: {
          title: "Droits admin requis",
          description: "Seuls les admins peuvent créer des entrepôts",
        },
        conflict: {
          title: "Code déjà utilisé",
          description: "Un entrepôt avec ce code existe déjà",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de la création de l'entrepôt. Réessayez.",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
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
        title: "Entrepôt créé",
        description: "Entrepôt enregistré avec succès",
      },
      response: {
        id: "ID de l'entrepôt",
        name: "Nom de l'entrepôt",
        code: "Code",
        companyId: "ID de l'entreprise",
        isActive: "Actif",
        isDefault: "Par défaut",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "Entrepôts",
      titleShort: "Entrepôts",
      description: "Lister tous les entrepôts d'une entreprise.",
      widget: {
        active: "Actif",
        inactive: "Inactif",
        default: "Par défaut",
        total: "entrepôts",
        createWarehouse: "Nouvel entrepôt",
        empty: "Aucun entrepôt pour l'instant.",
        emptyHint: "Créez votre premier entrepôt pour suivre vos stocks.",
        emptyIcon: "🏭",
        back: "Retour",
        loading: "Chargement des entrepôts…",
        load: "Charger",
        viewStock: "Voir le stock",
        selectCompany:
          "Saisissez un ID d'entreprise pour charger les entrepôts.",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise dont lister les entrepôts",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les entrepôts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement des entrepôts",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
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
        title: "Entrepôts chargés",
        description: "Liste des entrepôts récupérée",
      },
      response: {
        id: "ID de l'entrepôt",
        name: "Nom",
        code: "Code",
        address: "Adresse",
        isActive: "Actif",
        isDefault: "Par défaut",
        createdAt: "Créé le",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "Consulter un entrepôt",
      titleShort: "Entrepôt",
      description: "Récupérer les détails d'un entrepôt.",
      widget: {
        companyName: "Entreprise",
        stockedProducts: "Produits en stock",
        companyInventory: "Inventaire de l’entreprise",
        missingValuation: "Coût manquant",
        details: "Détails de l’entrepôt",
        related: "Inventaire",
        backToList: "Retour aux entrepôts",
        back: "Retour",
        edit: "Modifier l'entrepôt",
        viewStock: "Voir le stock",
        select: "Choisir un entrepôt",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt à consulter",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID d'entrepôt invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les entrepôts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cet entrepôt",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement de l'entrepôt",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Entrepôt introuvable",
          description: "Cet entrepôt n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Entrepôt chargé",
        description: "Détails de l'entrepôt récupérés",
      },
      response: {
        id: "ID de l'entrepôt",
        companyId: "ID de l'entreprise",
        name: "Nom",
        code: "Code",
        address: "Adresse",
        isActive: "Actif",
        isDefault: "Par défaut",
        createdAt: "Créé le",
        updatedAt: "Modifié le",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "Modifier l'entrepôt",
      titleShort: "Modifier l'entrepôt",
      description: "Modifier les informations de l'entrepôt.",
      widget: {
        backToWarehouse: "Retour à l'entrepôt",
        active: "Actif",
        inactive: "Inactif",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt à modifier",
      },
      name: {
        label: "Nom de l'entrepôt",
        description: "Nom complet de l'entrepôt",
        placeholder: "Entrepôt principal",
      },
      code: {
        label: "Code",
        description: "Identifiant court",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresse",
        description: "Adresse physique",
        placeholder: "12 rue des Entrepôts",
      },
      isActive: {
        label: "Actif",
        description: "Indique si cet entrepôt est opérationnel",
      },
      isDefault: {
        label: "Entrepôt par défaut",
        description: "Définir comme entrepôt par défaut",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour modifier des entrepôts",
        },
        forbidden: {
          title: "Droits admin requis",
          description: "Seuls les admins peuvent modifier des entrepôts",
        },
        conflict: {
          title: "Conflit de code",
          description: "Ce code d'entrepôt est déjà pris",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de la modification de l'entrepôt",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Entrepôt introuvable",
          description: "Cet entrepôt n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Entrepôt modifié",
        description: "Entrepôt modifié avec succès",
      },
      response: {
        id: "ID de l'entrepôt",
        name: "Nom",
        code: "Code",
        isActive: "Actif",
        isDefault: "Par défaut",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "Niveaux de stock",
      titleShort: "Niveaux de stock",
      description:
        "Voir les niveaux de stock d'un entrepôt, avec disponibilité et alertes de stock bas.",
      widget: {
        unnamedProduct: "Nom du produit indisponible",
        search: "Rechercher un produit ou un entrepôt",
        stockStatus: "État du stock",
        actions: "Actions",
        noMatches: "Aucun stock correspondant",
        loadMore: "Afficher la suite",

        back: "Retour",
        defaultLowStockRule: "Stock bas sous {{threshold}} unités disponibles",
        reorderPointRule:
          "Stock bas à {{threshold}} unités disponibles ou moins",
        stockValuePrecision:
          "La valeur du stock correspond à la quantité en stock × le coût unitaire non arrondi. Les coûts affichés sont arrondis à deux décimales.",
        lowStock: "Stock bas",
        available: "Disponible",
        onHand: "En stock",
        reserved: "Réservé",
        onOrder: "En commande",
        reorderPoint: "Seuil de réapprovisionnement",
        empty: "Aucun stock enregistré pour l'instant.",
        emptyHint:
          "Réceptionnez du stock dans un entrepôt pour voir les niveaux ici.",
        emptyIcon: "📦",
        loading: "Chargement des niveaux de stock…",
        filterProduct: "Filtrer par produit",
        load: "Charger",
        selectWarehouse:
          "Saisissez un ID d'entrepôt pour voir les niveaux de stock.",
        total: "articles",
        adjust: "Ajuster",
        transfer: "Transférer",
        outOfStock: "en rupture",
        belowReorderPoint: "sous le seuil de réapprovisionnement",
        bulletSeparator: "·",
        stockValue: "Valeur du stock",
        statusOk: "En stock",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt dont consulter le stock",
      },
      productId: {
        label: "ID du produit",
        description: "Filtrer sur un produit précis (facultatif)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir le stock",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cet entrepôt",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement des niveaux de stock",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Entrepôt introuvable",
          description: "Cet entrepôt n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Stock chargé",
        description: "Niveaux de stock récupérés",
      },
      response: {
        currency: "Devise",
        id: "ID du stock",
        warehouseId: "ID de l'entrepôt",
        warehouseName: "Entrepôt",
        productId: "ID du produit",
        productName: "Produit",
        quantityOnHand: "En stock",
        quantityReserved: "Réservé",
        quantityOnOrder: "En commande",
        quantityAvailable: "Disponible",
        reorderPoint: "Seuil de réappro.",
        reorderQuantity: "Qté de réappro.",
        unitCost: "Coût unitaire",
        isLowStock: "Stock bas",
        updatedAt: "Modifié le",
      },
    },
  },

  // Stock adjust
  stockAdjust: {
    post: {
      title: "Ajuster le stock",
      titleShort: "Ajuster le stock",
      description:
        "Ajuster manuellement la quantité en stock. Utilisez des valeurs négatives pour les mises au rebut.",
      widget: {
        backToStock: "Retour au stock",
        reserved: "Réservé",
        preview: "Aperçu",
        quantityChange: "Variation de quantité",
        positiveHint: "Une quantité positive ajoute du stock",
        negativeHint: "Une quantité négative retire du stock",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt dans lequel ajuster le stock",
      },
      productId: { label: "ID du produit", description: "Produit à ajuster" },
      quantity: {
        label: "Quantité",
        description:
          "Variation de quantité signée (positive = ajout, négative = retrait)",
        placeholder: "10",
      },
      reason: {
        label: "Motif",
        description: "Raison de cet ajustement",
        placeholder: "Correction après inventaire physique",
      },
      unitCost: {
        label: "Coût unitaire",
        description: "Coût par unité (facultatif)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour ajuster le stock",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cet entrepôt",
        },
        conflict: {
          title: "Stock insuffisant",
          description: "Stock disponible insuffisant pour cet ajustement",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de l'ajustement du stock",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Entrepôt ou produit introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Stock ajusté",
        description: "Ajustement de stock enregistré",
      },
      response: {
        movementId: "ID du mouvement",
        productId: "ID du produit",
        warehouseId: "ID de l'entrepôt",
        quantityOnHand: "Nouveau stock",
        quantityAvailable: "Disponible",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "Réceptionner du stock",
      titleShort: "Réceptionner du stock",
      description:
        "Enregistrer une entrée de stock : met à jour la quantité en stock et le coût moyen pondéré.",
      widget: {
        backToStock: "Retour au stock",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt qui réceptionne le stock",
      },
      productId: {
        label: "ID du produit",
        description: "Produit réceptionné",
      },
      quantity: {
        label: "Quantité",
        description: "Nombre d'unités réceptionnées",
        placeholder: "100",
      },
      unitCost: {
        label: "Coût unitaire",
        description: "Coût par unité réceptionnée",
        placeholder: "0.00",
      },
      reference: {
        label: "Référence",
        description: "Numéro de bon de commande ou de bon de livraison",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour réceptionner du stock",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cet entrepôt",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec de la réception du stock",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Entrepôt ou produit introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Stock réceptionné",
        description: "Réception de stock enregistrée",
      },
      response: {
        movementId: "ID du mouvement",
        productId: "ID du produit",
        warehouseId: "ID de l'entrepôt",
        quantityOnHand: "Nouveau stock",
        unitCost: "Nouveau coût unitaire",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "Sortir du stock",
      titleShort: "Sortir du stock",
      description:
        "Sortir du stock d'un entrepôt. Vérifie que la quantité disponible suffit.",
      widget: {
        backToStock: "Retour au stock",
      },
      warehouseId: {
        label: "ID de l'entrepôt",
        description: "Entrepôt d'où sort le stock",
      },
      productId: { label: "ID du produit", description: "Produit à sortir" },
      quantity: {
        label: "Quantité",
        description: "Nombre d'unités à sortir",
        placeholder: "10",
      },
      reference: {
        label: "Référence",
        description:
          "Ordre de fabrication, numéro de chantier ou autre référence",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Coût unitaire",
        description: "Coût par unité (par défaut : coût moyen pondéré actuel)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour sortir du stock",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cet entrepôt",
        },
        conflict: {
          title: "Stock insuffisant",
          description: "Stock disponible insuffisant pour cette sortie",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de la sortie de stock",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Entrepôt ou produit introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Stock sorti",
        description: "Sortie de stock effectuée",
      },
      response: {
        movementId: "ID du mouvement",
        productId: "ID du produit",
        warehouseId: "ID de l'entrepôt",
        quantityOnHand: "Nouveau stock",
        quantityAvailable: "Disponible",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "Créer un transfert",
      titleShort: "Nouveau transfert",
      description:
        "Créer une demande de transfert entre entrepôts. Démarre au statut Brouillon.",
      widget: {
        backToList: "Retour aux transferts",
        viewTransfer: "Voir le transfert",
        browseWarehouses: "Parcourir les entrepôts",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise à laquelle appartient ce transfert",
      },
      fromWarehouseId: {
        label: "Entrepôt d'origine",
        description: "Entrepôt qui envoie le stock",
      },
      toWarehouseId: {
        label: "Entrepôt de destination",
        description: "Entrepôt qui reçoit le stock",
      },
      reference: {
        label: "Référence",
        description: "Numéro de référence du transfert",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Notes",
        description: "Notes complémentaires sur ce transfert",
        placeholder: "Réassort saisonnier",
      },
      items: {
        label: "Articles",
        description: "Produits et quantités à transférer",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour créer des transferts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: {
          title: "Même entrepôt",
          description:
            "Les entrepôts d'origine et de destination doivent être différents",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de la création du transfert",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Introuvable",
          description: "Entrepôt introuvable",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Transfert créé",
        description: "Brouillon de transfert créé",
      },
      response: {
        id: "ID du transfert",
        status: "Statut",
        reference: "Référence",
        fromWarehouseId: "Entrepôt d'origine",
        toWarehouseId: "Entrepôt de destination",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "Transferts",
      titleShort: "Transferts",
      description: "Lister les transferts entre entrepôts d'une entreprise.",
      widget: {
        back: "Retour",
        newTransfer: "Nouveau transfert",
        empty: "Aucun transfert pour l'instant.",
        emptyHint: "Créez un transfert pour déplacer du stock entre entrepôts.",
        emptyIcon: "🔄",
        loading: "Chargement des transferts…",
        load: "Charger",
        selectCompany:
          "Saisissez un ID d'entreprise pour charger les transferts.",
        total: "transferts",
        view: "Voir",
        draft: "Brouillon",
        inTransit: "En transit",
        viewTransfer: "Voir le transfert",
        tabAll: "Tous",
        tabDraft: "En attente",
        tabInTransit: "En transit",
        tabReceived: "Terminés",
        tabCancelled: "Annulés",
        arrowSeparator: "→",
      },
      companyId: {
        label: "ID de l'entreprise",
        description: "Entreprise dont lister les transferts",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour lister les transferts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement des transferts",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
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
        title: "Transferts chargés",
        description: "Liste des transferts récupérée",
      },
      response: {
        id: "ID du transfert",
        fromWarehouseId: "ID de l'entrepôt d'origine",
        fromWarehouseName: "Origine",
        toWarehouseId: "ID de l'entrepôt de destination",
        toWarehouseName: "Destination",
        status: "Statut",
        reference: "Référence",
        createdAt: "Créé le",
        completedAt: "Terminé le",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "Consulter un transfert",
      titleShort: "Transfert",
      description: "Récupérer un transfert avec toutes ses lignes.",
      widget: {
        retry: "Réessayer",
        noItems: "Ce transfert ne contient aucun article.",
        noItemsHint:
          "Ajoutez les produits à déplacer lors de la création du transfert. Sans articles, il ne peut pas être expédié.",
        receivedOf: "{{received}} sur {{requested}} reçus",
        newTransfer: "Nouveau transfert",
        back: "Retour",
        dispatch: "Expédier le transfert",
        receive: "Marquer comme réceptionné",
        status: "Statut",
        select: "Choisir un transfert",
      },
      transferId: {
        label: "ID du transfert",
        description: "Transfert à consulter",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de transfert invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir les transferts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce transfert",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement du transfert",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Transfert introuvable",
          description: "Ce transfert n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Transfert chargé",
        description: "Détails du transfert récupérés",
      },
      response: {
        id: "ID du transfert",
        companyId: "ID de l'entreprise",
        fromWarehouseId: "Entrepôt d'origine",
        fromWarehouseName: "Entrepôt d'origine",
        toWarehouseId: "Entrepôt de destination",
        toWarehouseName: "Entrepôt de destination",
        status: "Statut",
        reference: "Référence",
        notes: "Notes",
        createdAt: "Créé le",
        completedAt: "Terminé le",
        items: "Articles",
        itemId: "ID de l'article",
        productId: "ID du produit",
        productName: "Produit",
        quantityRequested: "Demandé",
        quantityReceived: "Réceptionné",
      },
    },
  },

  // Transfer dispatch
  transferDispatch: {
    post: {
      title: "Expédier le transfert",
      titleShort: "Expédier",
      description:
        "Passer le transfert en transit. Le stock quitte l'entrepôt d'origine.",
      widget: {
        backToTransfer: "Retour au transfert",
      },
      transferId: {
        label: "ID du transfert",
        description: "Transfert à expédier",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de transfert invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour expédier des transferts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce transfert",
        },
        conflict: {
          title: "Pas un brouillon",
          description:
            "Seuls les transferts en brouillon peuvent être expédiés",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de l'expédition du transfert",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Transfert introuvable",
          description: "Ce transfert n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Transfert expédié",
        description: "Le transfert est maintenant en transit",
      },
      response: {
        id: "ID du transfert",
        status: "Statut",
      },
    },
  },

  // Transfer receive
  transferReceive: {
    post: {
      title: "Réceptionner le transfert",
      titleShort: "Réceptionner le transfert",
      description:
        "Marquer le transfert comme réceptionné. Crée les mouvements de stock et met à jour les stocks des deux entrepôts.",
      widget: {
        backToTransfer: "Retour au transfert",
      },
      transferId: {
        label: "ID du transfert",
        description: "Transfert à réceptionner",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "ID de transfert invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour réceptionner des transferts",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à ce transfert",
        },
        conflict: {
          title: "Pas en transit",
          description:
            "Seuls les transferts en transit peuvent être réceptionnés",
        },
        server: {
          title: "Erreur serveur",
          description: "Échec de la réception du transfert",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Transfert introuvable",
          description: "Ce transfert n'existe pas",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Transfert réceptionné",
        description: "Mouvements de stock créés et stocks mis à jour",
      },
      response: {
        id: "ID du transfert",
        status: "Statut",
        completedAt: "Terminé le",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "Vue d'ensemble des stocks",
      titleShort: "Vue d'ensemble",
      description:
        "État des stocks en temps réel : santé du stock, transferts en cours et nombre d'entrepôts.",
      widget: {
        kpiInStock: "En stock",
        kpiOutOfStock: "En rupture",
        kpiLowStock: "Stock bas",
        kpiWarehouses: "Entrepôts",
        attention: "Stocks à surveiller",
        noAttention: "Aucun article à réapprovisionner.",
        newPurchaseOrder: "Nouvelle commande",
        kpiTransfersInTransit: "Transferts en transit",
        alertOutOfStock: "{{count}} produit en rupture de stock",
        alertOutOfStockPlural: "{{count}} produits en rupture de stock",
        navStockLevels: "Niveaux de stock",
        navTransfers: "Transferts",
        navWarehouses: "Entrepôts",
        loading: "Chargement…",
        pendingTransfers: "{{count}} transfert en transit",
        pendingTransfersPlural: "{{count}} transferts en transit",
      },
      companyId: {
        label: "Entreprise",
        description:
          "Entreprise dont afficher les statistiques de stock (facultatif)",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez les champs obligatoires",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour voir la vue d'ensemble des stocks",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Aucun accès à cette entreprise",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Échec du chargement de la vue d'ensemble des stocks",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
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
        description: "Vue d'ensemble des stocks récupérée",
      },
      response: {
        inStockCount: "En stock",
        outOfStockCount: "En rupture",
        lowStockCount: "Stock bas",
        pendingTransferCount: "Transferts en cours",
        warehouseCount: "Entrepôts",
      },
    },
  },
};
