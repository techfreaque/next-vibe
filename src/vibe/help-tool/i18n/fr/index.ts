import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aide et documentation",
  tag: "Aide",
  uncategorized: "Autres",
  admin: {
    recordBackTo: "Retour vers {{section}}",
    recordAccessDenied: "Vous n’avez pas accès à cette fiche",
    overviewLoadError: "Le récapitulatif n’a pas pu être chargé",
    accountMenu: "Paramètres du compte",
    homeDescription: "Gérez la plateforme et consultez les points à traiter.",
    new: "Nouveau",
    destinations: "Listes et rapports",
    noDestinations:
      "Aucune liste ni aucun rapport ne sont disponibles dans cet espace.",
    automations: "Automatisations",
    developer: "Outils de développement",
    openDeveloper: "Ouvrir le catalogue de développement",
    title: "Administration",
    workspaces: "Espaces de travail",
    pinned: "Outils épinglés",
    categoryTools: "Outils de cet espace",
    results: "Résultats de recherche",
    resultsForOne: "1 résultat pour « {{query}} »",
    resultsFor: "{{count}} résultats pour « {{query}} »",
    jumpTo: "Ou ouvrez un espace de travail",
    tool: "Outil",
  },
  erp: {
    navigation: {
      sales: "Ventes",
      purchases: "Achats",
      invoices: "Factures clients",
      estimates: "Devis",
      bills: "Factures fournisseurs",
    },
    overview: {
      chooseCompany: "Choisissez une société pour afficher son rapport.",
      loading: "Chargement du tableau de bord de l’entreprise",
      loadError: "Impossible de charger le tableau de bord de l’entreprise",
    },
    home: "Accueil",
    title: "Espace comptabilité",
    description:
      "Configurez votre entreprise, gérez vos factures et préparez la clôture du mois.",
    companies: "Gérer les entreprises",
    activeDescription:
      "Consultez vos comptes et préparez votre prochaine facture.",
    newInvoice: "Nouvelle facture",
    createCompany: "Configurer votre entreprise",
    companySwitch: {
      label: "Entreprise comptable",
      select: "Sélectionner une entreprise",
      current: "Entreprise actuelle : {{name}}",
    },
    workflows: "Tâches courantes",
    sales: {
      title: "Facturer un client",
      description:
        "Préparez un brouillon de facture ou ouvrez une facture existante pour enregistrer un paiement.",
      primary: "Créer une facture client",
      secondary: "Voir les factures clients",
    },
    expenses: {
      title: "Saisir une facture fournisseur",
      description:
        "Enregistrez les sommes dues aux fournisseurs et suivez les règlements depuis la facture.",
      primary: "Créer une facture fournisseur",
      secondary: "Voir les factures fournisseurs",
    },
    receivables: {
      title: "Suivre les impayés",
      description: "Consultez les créances clients par ancienneté du retard.",
      primary: "Voir les créances",
    },
    payables: {
      title: "Vérifier les dettes fournisseurs",
      description:
        "Consultez les soldes ouverts et les factures à valider ou contestées.",
      primary: "Voir les dettes fournisseurs",
    },
    bank: {
      title: "Importer des opérations bancaires",
      description:
        "Importez un relevé CSV, puis vérifiez les opérations non rapprochées.",
      primary: "Importer un relevé",
      secondary: "Voir les opérations non rapprochées",
    },
    stock: {
      title: "Contrôler les stocks",
      description:
        "Vérifiez les quantités en stock et repérez les articles à réapprovisionner.",
      primary: "Ouvrir les stocks",
    },
    tax: {
      title: "Vérifier la TVA",
      description:
        "Contrôlez les montants de TVA de la période avant de les déclarer.",
      primary: "Ouvrir le rapport de TVA",
    },
    exports: {
      title: "Contrôler et exporter le journal",
      description:
        "Vérifiez les anomalies ou téléchargez les écritures comptabilisées au format CSV.",
      primary: "Contrôler les écritures",
      secondary: "Ouvrir l’export du journal",
    },
    close: {
      title: "Clôturer une période comptable",
      description:
        "Vérifiez la balance comptable avant de clôturer la période.",
      primary: "Voir les périodes",
      secondary: "Ouvrir la balance",
    },
  },
  catalog: {
    moreMatches: "Autres résultats ({{count}})",
    title: "Catalogue d’outils",
    searchLabel: "Rechercher dans le catalogue d’outils",
    searchAction: "Rechercher des outils",
    clearSearch: "Effacer la recherche",
    overview: "Vue d'ensemble",
    allTools: "Tous les outils",
    selectRecord: "Sélectionnez une fiche pour en consulter les détails.",
    openRecord: "Ouvrir la fiche",
    findRecord: "Trouver une fiche",
    recordPlaceholder: "Nom, adresse e-mail ou référence",
    loadError: "Impossible de charger le catalogue",
    retry: "Réessayer",
    noTools: "Aucun outil dans cette vue",
    noMatches:
      "Aucun résultat pour « {{query}} ». Essayez un autre nom d’outil.",
    openPrimary: "Ouvrir {{title}}",
    allInCategory: "Tous les outils",
    general: "Général",
    toolUnavailable: "Disponible sur une autre plateforme",
    previous: "Précédente",
    next: "Suivante",
    page: "Page {{page}} sur {{total}}",
    openSidebar: "Ouvrir le volet des outils",
    browse: "Parcourir les outils",
    backHome: "Aller à l’accueil de l’administration",
    toolUnavailableHint:
      "Ce lien peut être obsolète ou votre rôle peut ne pas y donner accès. Consultez les outils à votre disposition.",
    openError: "Impossible d’ouvrir cet outil",
    toolNotFound: "Cet outil est indisponible",
    localInstance: "Instance locale",
    allowTool: "Autoriser l’IA à utiliser cet outil",
    blockTool: "Retirer l’accès de l’IA à cet outil",
    pinWeb: "Épingler dans le volet",
    unpinWeb: "Retirer du volet",
    webSidebar: "Volet Web",
    webSidebarHint: "Outils épinglés dans le volet.",
  },
  groups: {
    ai: "IA",
    analytics: "Croissance",
    business: "Gestion",
    system: "Exploitation",
    comms: "Communication",
    platform: "Plateforme",
    people: "Personnes et CRM",
    billing: "Facturation",
    content: "Contenu",
  },
  get: {
    title: "Aide des outils : découvrez les outils disponibles",
    titleShort: "Aide des outils",
    description:
      "Recherchez et découvrez tous les outils à votre disposition. Sans paramètre : liste de tous les outils et catégories. query : recherche par nom, description ou alias. toolName : schéma complet des paramètres d'un outil précis. category : filtre par catégorie. Pagination via page/pageSize. Taille de page par défaut pour l'IA/MCP : 100.",
    tags: {
      tools: "outils",
    },
    fields: {
      interactive: {
        label: "Interactif",
        description: "Ouvrir le navigateur d'outils interactif complet",
      },
      query: {
        label: "Recherche (facultatif)",
        description:
          "Filtre les outils par mot-clé. Tous les mots séparés par des espaces sont requis (ex. 'fetch url' trouve les outils contenant les deux mots). Insensible à la casse, sur le nom, les alias, la description et les tags. Les correspondances de nom ou d'alias sont mieux classées. Une correspondance exacte de nom ou d'alias affiche directement le détail complet. Omettez-le pour lister tous les outils.",
        placeholder: "ex. fetch url, image gen, mémoire...",
      },
      category: {
        label: "Filtre de catégorie",
        description:
          "Filtre les outils par nom de catégorie ou de sous-catégorie (insensible à la casse). Accepte une clé de catégorie parente (ex. 'ai') ou un nom de sous-catégorie (ex. 'Search'). Omettez-le pour voir toutes les catégories.",
      },
      toolName: {
        label: "Nom de l'outil (détail)",
        description:
          "Obtenir le schéma complet des paramètres d'un outil via son toolName exact (ex. agent_search_brave_GET) ou son alias. À utiliser avant d'appeler un outil inconnu.",
      },
      page: {
        label: "Page",
        description: "Numéro de page des résultats paginés (par défaut : 1)",
        title: "Numéro de la page actuelle",
      },
      pageSize: {
        label: "Taille de page",
        description:
          "Nombre de résultats par page. Par défaut IA/MCP : 100. Par défaut Web/CLI : 800. Max : 1000.",
        title: "Taille de page effective",
      },
      tools: {
        title: "Outils disponibles",
      },
      totalCount: {
        title: "Nombre total d'outils",
      },
      matchedCount: {
        title: "Nombre d'outils trouvés",
      },
      categories: {
        title: "Catégories d'outils",
      },
      hint: {
        title: "Conseil d'utilisation",
      },
      pinnedCount: {
        title: "Nombre d'outils épinglés",
      },
      allowedCount: {
        title: "Nombre d'outils autorisés",
      },
      webPinnedCount: {
        title: "Nombre d'outils épinglés (web)",
      },
      currentPage: {
        title: "Page actuelle",
      },
      effectivePageSize: {
        title: "Taille de page effective",
      },
      totalPages: {
        title: "Nombre total de pages",
      },
      parameters: {
        title: "Paramètres",
      },
      aliases: {
        title: "Alias",
      },
      openTool: {
        label: "Ouvrir l'outil",
      },
      platform: {
        label: "Plateforme",
        description:
          "Filtre les outils par plateforme (admin uniquement). Affiche les outils disponibles sur la plateforme choisie. Utilisez 'all' pour voir les outils de toutes les plateformes.",
      },
      includeProdOnly: {
        label: "Inclure les outils réservés à la production",
        description:
          "Si activé, inclut les outils marqués comme réservés à la production (admin uniquement). Utilisez le filtre de plateforme 'all' pour voir les outils de toutes les plateformes.",
      },
      platforms: {
        title: "Plateformes disponibles",
      },
      viewAsRole: {
        label: "Voir en tant que rôle",
        description:
          "Voir les outils visibles pour un rôle utilisateur donné (admin uniquement)",
        options: {
          admin: "Admin",
          customer: "Client",
          public: "Public",
        },
      },
      instanceId: {
        label: "ID d'instance",
        description:
          "Facultatif. Limite aux outils d'une instance distante précise. Omettez-le pour chercher dans les outils locaux.",
      },
      pinnedToolIds: {
        label: "ID des outils épinglés",
        description:
          "Liste facultative des ID d'outils épinglés par l'utilisateur. Si elle est fournie, le serveur ne renvoie que ces outils, mais toujours avec le totalCount complet.",
      },
      statsFilter: {
        label: "Filtre d'outils",
        description:
          "Afficher tous les outils, uniquement les épinglés ou uniquement les autorisés",
      },
    },
    hints: {
      noCapabilitySnapshot:
        "Aucun instantané des capacités pour l'instance \"{{instanceId}}\". Connectez l'instance et attendez une synchronisation.",
      remoteFullSchema:
        'Schéma complet pour {{count}} outil(s) de "{{instanceId}}". Appel : execute-tool toolName="{{instanceId}}__<name>" input={...}.',
      remoteList:
        '{{matched}} outils sur {{total}} de l\'instance distante "{{instanceId}}". Affinez la recherche à ≤{{detailThreshold}} résultats pour obtenir les schémas complets, ou passez toolName= pour un outil précis.{{pagination}}',
      toolNotFound:
        'Outil "{{name}}" introuvable. Utilisez query pour chercher par mot-clé.',
      detailMode:
        'Appel : execute-tool toolName="{{name}}"{{aliases}}. CLI : vibe {{name}} [--field=value].',
      detailModeAliases: " (alias : {{aliases}})",
      noToolsMatched:
        "Aucun outil trouvé. Élargissez la recherche ou appelez sans paramètre pour voir toutes les catégories.",
      compactFullSchema:
        'Schéma complet pour {{count}} outil(s). Appel : execute-tool toolName="<name>" input={...}.',
      compactCategoryOnly:
        '{{matched}} outils répartis dans {{categories}} catégories. Utilisez category="<name>" pour affiner (catégorie parente ou sous-catégorie). Sous {{listThreshold}} résultats, les noms des outils s\'affichent ; sous {{detailThreshold}}, les schémas complets.',
      compactList:
        '{{matched}} outils. Affinez à ≤{{detailThreshold}} pour les schémas complets, ou passez toolName="<name>" pour le détail. Appeler un outil : execute-tool toolName="<name>".{{pagination}}',
      cliFullDetail:
        "Détail complet de {{count}} outil(s). CLI : vibe <name> [--field=value].",
      cliList:
        "Page {{page}}/{{total}} : {{matched}} outils correspondent. Utilisez vibe help <name> pour le détail complet.",
      cliListSingle:
        "{{matched}} outils trouvés. Utilisez vibe help <name> pour le détail complet.",
      pagination:
        " Page {{page}}/{{total}} : passez page={{next}} pour continuer.",
      paginationCli: " (suite : vibe help --page={{next}})",
    },
    success: {
      title: "Outils récupérés",
      description: "Les outils disponibles ont été récupérés",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission d'accéder aux outils",
      },
      notFound: {
        title: "Introuvable",
        description: "Endpoint des outils introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer les outils",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la récupération des outils",
      },
    },
  },
  interactive: {
    post: {
      title: "Mode interactif",
      description:
        "Lancer l'explorateur interactif pour parcourir et exécuter les routes",
      category: "Aide système",
      tags: {
        system: "système",
        help: "aide",
      },
      summary: "Lancer le mode interactif",
    },
    ui: {
      title: "Explorateur d'API interactif",
      description: "Parcourez et exécutez tous les",
      availableEndpoints: "endpoints disponibles",
      endpointsLabel: "Endpoints",
      aliasesLabel: "Alias :",
      selectEndpoint: "Choisissez un endpoint dans la liste pour commencer",
    },
    response: {
      started: "Mode interactif lancé",
    },
    errors: {
      cliOnly: {
        title: "CLI uniquement",
        description: "Le mode interactif n'est disponible que depuis la CLI",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour le mode interactif",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lancer le mode interactif",
      },
    },
    success: {
      title: "Succès",
      description: "Mode interactif lancé",
    },
    grouping: {
      category: "Catégorie",
      tags: "Tags",
      path: "Chemin",
    },
  },
  post: {
    title: "Afficher l'aide",
    description: "Afficher l'aide des commandes CLI",
    form: {
      title: "Options d'aide",
      description: "Obtenir de l'aide sur une commande ou sur l'usage général",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de la commande d'aide invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de récupérer l'aide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à consulter l'aide",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de consulter l'aide",
      },
      notFound: {
        title: "Commande introuvable",
        description: "La commande indiquée est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de générer l'aide",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la génération de l'aide",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit détecté lors de la génération de l'aide",
      },
    },
    success: {
      title: "Aide générée",
      description: "L'aide a été générée",
    },
  },
  fields: {
    command: {
      label: "Commande",
      description:
        "Commande pour laquelle afficher l'aide (laisser vide pour l'aide générale)",
      placeholder: "ex. check, list, db:ping",
    },
    header: {
      title: "En-tête",
      description: "Description de l'en-tête",
    },
    title: {
      label: "Titre",
    },
    description: {
      label: "Description",
    },
    usage: {
      title: "Utilisation",
      patterns: {
        item: "Syntaxe",
      },
    },
    commonCommands: {
      title: "Commandes courantes",
      items: "Commandes",
      command: "Commande",
      description: "Description",
    },
    options: {
      title: "Options",
      items: "Options",
      flag: "Option",
      description: "Description",
    },
    examples: {
      title: "Exemples",
      items: "Exemples",
      command: "Commande",
      description: "Description",
    },
    details: {
      title: "Détails",
      category: {
        content: "Catégorie",
      },
      path: {
        content: "Chemin",
      },
      method: {
        content: "Méthode",
      },
      aliases: {
        content: "Alias",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "épinglés web",
      webPinnedTooltip:
        "Outils épinglés dans la barre latérale pour un accès rapide",
      pinnedLabel: "épinglés",
      pinnedTooltip:
        "Les outils épinglés sont toujours dans le contexte : l'IA les voit à chaque tour",
      enabledLabel: "autorisés IA",
      enabledTooltip:
        "Les outils autorisés pour l'IA peuvent être appelés à la demande quand l'aide est activée",
      totalLabel: "total",
      totalTooltip: "Afficher tous les outils (clic pour retirer le filtre)",
      searchPlaceholder: "Rechercher des outils...",
      chipWeb: "Web",
      chipAiPins: "Épinglés IA",
      chipAiAllowed: "Autorisés IA",
      chipAll: "Tous",
      chipCli: "CLI",
      chipMcpPinned: "MCP visibles",
      chipMcpAllowed: "MCP tous",
      searchNoResults: "Aucun résultat",
      searchResultOne: "1 résultat",
      searchResultMany: "{{count}} résultats",
      expandAll: "Tout déplier",
      collapseAll: "Tout replier",
      deselectAll: "Tout désélectionner",
      selectAll: "Tout sélectionner",
      resetToDefault: "Rétablir par défaut",
      loading: "Chargement...",
      noToolsFound: "Aucun outil ne correspond à votre recherche",
      noToolsAvailable: "Aucun outil IA disponible",
      legendActive: "Toujours dans le contexte (épinglé)",
      legendConfirm: "Demande avant d'exécuter",
      legendWebPin: "Épinglé dans la barre latérale",
      stats: "{{pinned}} outils épinglés sur {{total}}",
      activeOn:
        "Toujours dans le contexte de l'IA. Désépinglez pour un usage à la demande uniquement",
      activeOff: "Hors contexte. Épinglez pour l'inclure à chaque tour de l'IA",
      confirmOn:
        "L'IA vous demande avant d'exécuter. Cliquez pour approuver automatiquement",
      confirmOff:
        "S'exécute sans demander. Cliquez pour exiger votre approbation",
      closeSidebar: "Fermer la barre latérale des outils",
      selectTool: "Choisir un outil",
      selectToolHint:
        "Choisissez un outil dans la barre latérale pour commencer",
      allPlatforms: "Toutes les plateformes",
      prodOnly: "Prod uniquement",
      adminFilters: "Filtres admin",
      resetPins: "Rétablir les épingles par défaut",
      aiPinsTitle: "Outils épinglés pour l'IA",
      aiPinsDescription:
        "Ces outils sont actifs dans chaque conversation avec l'IA. Elle peut les appeler d'elle-même, sans que vous ayez à le demander.",
      resetToDefaults: "Rétablir par défaut",
      noPinnedTools: "Aucun outil épinglé pour l'instant",
      noPinnedToolsHint:
        "Parcourez tous les outils et épinglez ceux que l'IA doit utiliser",
      webPinsDescription:
        "Raccourcis de la barre latérale. Outils à lancement rapide épinglés dans votre panneau d'administration.",
      aiAllowedDescription:
        "Outils que l'IA peut appeler à la demande. Tout ce qui figure ici peut être invoqué dès que l'IA le juge utile.",
      noAllowedTools: "Aucun outil autorisé",
    },

    platformFilter: {
      all: "Toutes les plateformes",
      cli: "CLI",
      cliPackage: "Paquet CLI",
      mcp: "MCP",
      ai: "IA",
      web: "Web",
      cron: "Cron",
      electron: "Bureau",
      frame: "Frame",
      skill: "Skill",
      nextPage: "Page Next",
      nextApi: "API Next",
    },
    envFilter: {
      development: "Développement",
      production: "Production",
    },
  },
  list: {
    post: {
      title: "Lister les commandes disponibles",
      description:
        "Afficher toutes les commandes CLI disponibles avec leurs descriptions et alias",
      form: {
        title: "Options de la liste des commandes",
        description: "Configurer l'affichage des commandes",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de la commande list invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de récupérer la liste des commandes",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à lister les commandes",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas la permission de lister les commandes",
        },
        notFound: {
          title: "Introuvable",
          description: "Liste des commandes introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de générer la liste des commandes",
          errorLoading: "Erreur lors du chargement des commandes : {{error}}",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors du listage des commandes",
        },
        conflict: {
          title: "Conflit",
          description: "Conflit détecté dans la liste des commandes",
        },
      },
      success: {
        title: "Commandes listées",
        description: "La liste des commandes a été récupérée",
      },
    },
    tag: "Aide",
    fields: {
      category: {
        label: "Filtrer par catégorie",
        description: "N'afficher que les commandes de cette catégorie",
        placeholder: "ex. system, database, user",
      },
      format: {
        label: "Format de sortie",
        description: "Comment afficher la liste des commandes",
        options: {
          tree: "Arborescence (hiérarchie imbriquée)",
          flat: "Liste simple",
          json: "Format JSON (pour l'analyse)",
        },
      },
      showAliases: {
        label: "Afficher les alias",
        description: "Afficher tous les alias de commande disponibles",
      },
      showDescriptions: {
        label: "Afficher les descriptions",
        description: "Inclure les descriptions des commandes dans la sortie",
      },
      success: {
        label: "Succès",
      },
      totalCommands: {
        label: "Nombre de commandes",
        description: "Nombre de commandes disponibles",
      },
      commandsText: {
        label: "Commandes disponibles",
        description: "Liste formatée de toutes les commandes disponibles",
      },
      commands: {
        alias: "Alias de la commande",
        message: "Message de la commande",
        description: "Description de la commande",
        category: "Catégorie de la commande",
        aliases: "Alias de la commande",
        rule: "Règle de la commande",
      },
    },
    response: {
      commands: {
        title: "Commandes disponibles",
        emptyState: {
          description: "Aucune commande trouvée",
        },
        alias: "Commande",
        path: "Chemin de l'API",
        method: "Méthode HTTP",
        category: "Catégorie",
        description: "Description",
        aliases: "Alias",
      },
    },
  },
};
