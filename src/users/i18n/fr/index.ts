import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  tags: {
    create: "Créer",
    admin: "Admin",
    user: "Utilisateur",
    view: "Afficher",
    stats: "Statistiques",
  },
  create: {
    category: "Utilisateurs",
    tags: {
      create: "Créer",
      admin: "Admin",
    },
    post: {
      title: "Créer un utilisateur",
      description: "Créer un nouveau compte utilisateur",
      form: {
        title: "Création d'utilisateur",
        description: "Renseignez les informations du nouvel utilisateur",
      },
      email: {
        label: "Adresse e-mail",
        description:
          "Adresse e-mail de l'utilisateur pour la connexion et les échanges",
      },
      password: {
        label: "Mot de passe",
        description: "Mot de passe sécurisé du compte",
      },
      privateName: {
        label: "Nom privé",
        description:
          "Nom légal complet de l'utilisateur (visible uniquement par les admins)",
      },
      publicName: {
        label: "Nom public",
        description:
          "Nom d'affichage de l'utilisateur (visible par tous les utilisateurs)",
      },
      firstName: {
        label: "Prénom",
        description: "Prénom de l'utilisateur",
      },
      lastName: {
        label: "Nom",
        description: "Nom de famille de l'utilisateur",
      },
      company: {
        label: "Entreprise",
        description: "Entreprise ou organisation de l'utilisateur",
      },
      phone: {
        label: "Numéro de téléphone",
        description: "Numéro de téléphone de l'utilisateur",
      },
      preferredContactMethod: {
        label: "Moyen de contact préféré",
        description: "Comment l'utilisateur préfère être contacté",
      },
      roles: {
        label: "Rôles de l'utilisateur",
        description: "Attribuer des rôles à l'utilisateur",
      },
      imageUrl: {
        label: "URL de la photo de profil",
        description: "URL de la photo de profil de l'utilisateur",
      },
      bio: {
        label: "Biographie",
        description: "Courte présentation de l'utilisateur",
      },
      website: {
        label: "Site web",
        description: "Site personnel ou professionnel de l'utilisateur",
      },
      jobTitle: {
        label: "Poste",
        description: "Poste ou fonction de l'utilisateur",
      },
      emailVerified: {
        label: "E-mail vérifié",
        description: "Indique si l'e-mail de l'utilisateur est vérifié",
      },
      isActive: {
        label: "Statut actif",
        description: "Indique si le compte utilisateur est actif",
      },
      leadId: {
        label: "ID du lead",
        description: "Identifiant du lead associé",
      },
      country: {
        label: "Pays",
        description: "Pays de résidence de l'utilisateur",
      },
      language: {
        label: "Langue",
        description: "Langue préférée de l'utilisateur",
      },
      response: {
        title: "Utilisateur créé",
        description: "Détails du nouvel utilisateur",
        id: {
          content: "ID utilisateur",
        },
        leadId: {
          content: "ID du lead associé",
        },
        country: {
          label: "Pays",
          description: "Pays de résidence de l'utilisateur",
        },
        language: {
          label: "Langue",
          description: "Langue préférée de l'utilisateur",
        },
        email: {
          content: "Adresse e-mail",
        },
        privateName: {
          content: "Nom privé",
        },
        publicName: {
          content: "Nom public",
        },
        firstName: {
          content: "Prénom",
        },
        lastName: {
          content: "Nom",
        },
        company: {
          content: "Entreprise",
        },
        phone: {
          content: "Numéro de téléphone",
        },
        preferredContactMethod: {
          content: "Moyen de contact préféré",
        },
        imageUrl: {
          content: "Photo de profil",
        },
        bio: {
          content: "Biographie",
        },
        website: {
          content: "Site web",
        },
        jobTitle: {
          content: "Poste",
        },
        emailVerified: {
          content: "E-mail vérifié",
        },
        isActive: {
          content: "Statut actif",
        },
        stripeCustomerId: {
          content: "ID client Stripe",
        },
        userRoles: {
          content: "Rôles de l'utilisateur",
          id: {
            content: "ID du rôle",
          },
          role: {
            content: "Rôle",
          },
        },
        createdAt: {
          content: "Créé le",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
      errors: {
        unauthorized: {
          title: "Accès non autorisé",
          description: "Vous devez être connecté pour créer des utilisateurs",
        },
        validation: {
          title: "Validation échouée",
          description: "Vérifiez les données du formulaire et réessayez",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible de créer l'utilisateur suite à une erreur serveur",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de la création de l'utilisateur",
        },
        network: {
          title: "Erreur réseau",
          description:
            "La connexion réseau a échoué pendant la création de l'utilisateur",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de créer des utilisateurs",
        },
        notFound: {
          title: "Ressource introuvable",
          description:
            "Une ressource nécessaire à la création de l'utilisateur est introuvable",
        },
        conflict: {
          title: "Utilisateur déjà existant",
          description: "Un utilisateur avec cet e-mail existe déjà",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        internal: {
          title: "Erreur interne",
          description:
            "Une erreur interne s'est produite lors de la création de l'utilisateur",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "Échec du SMS de bienvenue",
            description:
              "Impossible d'envoyer le SMS de bienvenue à l'utilisateur",
          },
          verification_failed: {
            title: "Échec du SMS de vérification",
            description:
              "Impossible d'envoyer le SMS de vérification à l'utilisateur",
          },
        },
      },
      success: {
        title: "Utilisateur créé",
        description: "Le nouveau compte utilisateur a été créé",
        message: {
          content: "Utilisateur créé",
        },
        created: {
          content: "Créé",
        },
      },
    },
    widget: {
      headerCreated: "Utilisateur créé",
      headerCreate: "Créer un utilisateur",
      headerSubtitle: "Créer un compte admin ou un compte client",
      activeBadge: "Actif",
      verifiedBadge: "Vérifié",
      copiedTooltip: "Copié !",
      copyUserIdTooltip: "Copier l'ID utilisateur",
      copyIdButton: "Copier l'ID",
      copiedButton: "Copié !",
      viewUserButton: "Voir l'utilisateur",
      fullProfileButton: "Profil complet",
      creditHistoryButton: "Historique des crédits",
      createAnotherButton: "Créer un autre utilisateur",
      createdPrefix: "Créé",
    },
    email: {
      users: {
        welcome: {
          greeting: "Bienvenue sur notre plateforme, {{firstName}} !",
          preview: "Votre compte a bien été créé",
          subject: "Bienvenue sur {{companyName}} : votre compte est prêt !",
          introduction:
            "Bonjour {{firstName}}, ravis de vous compter parmi nous ! Votre compte a bien été créé et vous avez maintenant accès à toutes nos fonctionnalités.",
          accountDetails: "Détails du compte",
          email: "E-mail",
          name: "Nom",
          publicName: "Nom d'affichage",
          company: "Entreprise",
          phone: "Téléphone",
          nextSteps: "Prochaines étapes",
          loginButton: "Se connecter à votre compte",
          support:
            "Une question ? Notre équipe support est là pour vous aider. Contactez-nous à tout moment !",
        },
        admin: {
          newUser: "Nouvel utilisateur créé",
          preview:
            "Le nouvel utilisateur {{firstName}} {{lastName}} a été créé",
          subject:
            "Nouveau compte utilisateur créé : {{firstName}} {{lastName}}",
          notification:
            "Un nouveau compte utilisateur a été créé dans le système. Voici les détails :",
          userDetails: "Détails de l'utilisateur",
          viewUser: "Voir le profil de l'utilisateur",
        },
        errors: {
          missing_data:
            "Des données utilisateur requises manquent pour le modèle d'e-mail",
        },
        error: {
          general: {
            internal_server_error:
              "Une erreur interne du serveur s'est produite",
          },
        },
        labels: {
          id: "ID :",
          email: "E-mail :",
          name: "Nom :",
          privateName: "Nom complet :",
          publicName: "Nom d'affichage :",
          company: "Entreprise :",
          created: "Créé le :",
          leadId: "ID du lead :",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "Bienvenue {{firstName}} ! Votre compte a bien été créé. Rendez-vous sur {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, votre code de vérification : {{code}}. Saisissez-le dans les 10 minutes.",
      },
      errors: {
        welcome_failed: {
          title: "Échec du SMS de bienvenue",
          description:
            "Impossible d'envoyer le SMS de bienvenue à l'utilisateur",
        },
        verification_failed: {
          title: "Échec du SMS de vérification",
          description:
            "Impossible d'envoyer le SMS de vérification à l'utilisateur",
        },
      },
    },
  },
  list: {
    get: {
      title: "Liste des utilisateurs",
      description: "Rechercher et filtrer les utilisateurs",
      form: {
        title: "Gestion des utilisateurs",
        description: "Gérer et filtrer les utilisateurs",
      },
      actions: {
        refresh: "Actualiser",
        refreshing: "Actualisation...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Recherche et filtres",
        description: "Rechercher et filtrer les utilisateurs par critères",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des utilisateurs par nom ou e-mail",
        placeholder: "Rechercher des utilisateurs...",
      },
      status: {
        label: "Statut",
        description: "Filtrer les utilisateurs par statut",
        placeholder: "Choisir un statut...",
      },
      role: {
        label: "Rôle",
        description: "Filtrer les utilisateurs par rôle",
        placeholder: "Choisir un rôle...",
      },
      subscription: {
        label: "Abonnement",
        description: "Filtrer par statut d'abonnement",
        placeholder: "Tous les statuts d'abonnement",
      },
      creditActivity: {
        label: "Activité crédits",
        description: "Filtrer par achat ou dépense de crédits",
        placeholder: "Toute activité de crédits",
      },
      threads: {
        label: "Fils de discussion",
        description: "Filtrer selon que l'utilisateur a des fils de discussion",
        placeholder: "Tous",
      },
      referralActivity: {
        label: "Activité de parrainage",
        description:
          "Filtrer par lien de parrainage, clics, inscriptions ou abonnés payants",
        placeholder: "Toute activité de parrainage",
      },
      // Sorting section
      sortingOptions: {
        title: "Tri",
        description: "Configurer le tri des résultats",
      },
      sortBy: {
        label: "Trier par",
        description: "Champ de tri",
        placeholder: "Choisir un champ de tri...",
      },
      sortOrder: {
        label: "Ordre de tri",
        description: "Sens du tri",
        placeholder: "Choisir l'ordre de tri...",
      },
      // Response section
      response: {
        title: "Utilisateurs",
        description: "Utilisateurs correspondant aux critères",
        users: {
          id: "ID utilisateur",
          email: "E-mail",
          privateName: "Nom privé",
          publicName: "Nom public",
          isActive: "Actif",
          emailVerified: "Vérifié",
          createdAt: "Créé",
          updatedAt: "Mis à jour",
          referralCode: "Code de parrainage utilisé",
          referredByUserId: "Parrainé par",
          totalReferrals: "Parrainages effectués",
        },
        totalCount: "Total utilisateurs",
        pageCount: "Total pages",
      },
      // Pagination section
      page: {
        label: "Page",
      },
      limit: {
        label: "Par page",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour voir les utilisateurs",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres invalides",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de voir les utilisateurs",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de récupérer les utilisateurs",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        conflict: {
          title: "Conflit",
          description:
            "Impossible de lister les utilisateurs à cause de conflits",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur",
        },
        notFound: {
          title: "Introuvable",
          description: "Aucun utilisateur trouvé",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Succès",
        description: "Utilisateurs récupérés",
      },
    },
    // Legacy keys for backward compatibility
    title: "Lister les utilisateurs",
    description: "Lister et rechercher des utilisateurs avec filtres",
    category: "Utilisateurs",
    tag: "Liste",
    container: {
      title: "Liste des utilisateurs",
      description: "Rechercher et filtrer les utilisateurs",
    },
    response: {
      summary: {
        title: "Résumé des utilisateurs",
        description: "Statistiques récapitulatives de la liste",
      },
      users: {
        title: "Utilisateurs",
      },
      user: {
        title: "Utilisateur",
        id: "ID utilisateur",
        email: "E-mail",
        privateName: "Nom privé",
        publicName: "Nom public",
        firstName: "Prénom",
        lastName: "Nom",
        company: "Entreprise",
        phone: "Téléphone",
        isActive: "Actif",
        emailVerified: "E-mail vérifié",
        role: "Rôle",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
      },
      total: {
        content: "Total utilisateurs",
      },
      page: {
        content: "Page actuelle",
      },
      limit: {
        content: "Utilisateurs par page",
      },
      totalPages: {
        content: "Total pages",
      },
    },
    errors: {
      unauthorized: {
        title: "Accès non autorisé",
        description: "Vous devez être connecté pour voir les utilisateurs",
      },
      validation: {
        title: "Validation échouée",
        description: "Paramètres invalides pour la liste des utilisateurs",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas le droit de voir les utilisateurs",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de récupérer les utilisateurs suite à une erreur serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors du listage des utilisateurs",
      },
      conflict: {
        title: "Conflit",
        description:
          "Impossible de lister les utilisateurs à cause de conflits existants",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      notFound: {
        title: "Aucun utilisateur trouvé",
        description: "Aucun utilisateur ne correspond à vos critères",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      internal: {
        title: "Erreur interne",
        description:
          "Une erreur interne s'est produite lors du listage des utilisateurs",
      },
    },
    post: {
      title: "Liste",
      description: "Endpoint de liste",
      form: {
        title: "Configuration de la liste",
        description: "Configurer les paramètres de la liste",
      },
      response: {
        title: "Réponse",
        description: "Données de la liste",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
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
          title: "Accès refusé",
          description: "Accès interdit",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de données s'est produit",
        },
      },
      success: {
        title: "Succès",
        description: "Opération réussie",
      },
    },
    widget: {
      statusActive: "Actif",
      statusInactive: "Inactif",
      statusUnverified: "Non vérifié",
      joined: "Inscrit",
      creditHistory: "Historique des crédits",
      view: "Voir",
      edit: "Modifier",
      delete: "Supprimer",
      stats: "Stats",
      graphs: "Graphiques",
      newUser: "Nouvel utilisateur",
      searchPlaceholder: "Rechercher par nom ou e-mail… (Ctrl+F)",
      roleFilterLabel: "Rôle",
      sortLabel: "Tri :",
      clearFilters: "Effacer les filtres",
      noUsersMatchFilters: "Aucun utilisateur ne correspond à vos filtres.",
      noUsersFound: "Aucun utilisateur trouvé.",
      userStatistics: "Statistiques utilisateurs",
      refresh: "Actualiser",
      roleAll: "Tous",
      roleAdmin: "Admin",
      roleCustomer: "Client",
      rolePartnerAdmin: "Admin partenaire",
      rolePartnerEmployee: "Employé partenaire",
      statusAll: "Tous",
      sortNewest: "Plus récents",
      sortOldest: "Plus anciens",
      sortNameAZ: "Nom A-Z",
      sortNameZA: "Nom Z-A",
      sortEmailAZ: "E-mail A-Z",
      of: "sur",
      usersShown: "utilisateurs affichés",
      paginationPage: "Page",
      paginationOf: "sur",
      paginationSeparator: "·",
      paginationUsers: "utilisateurs",
    },
    enums: {
      userSortField: {
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
        email: "E-mail",
        privateName: "Nom privé",
        publicName: "Nom public",
        firstName: "Prénom",
        lastName: "Nom",
        company: "Entreprise",
        lastLogin: "Dernière connexion",
      },
      sortOrder: {
        asc: "Croissant",
        desc: "Décroissant",
      },
      userStatusFilter: {
        all: "Tous",
        active: "Actif",
        inactive: "Inactif",
        pending: "En attente",
        suspended: "Suspendu",
        emailVerified: "E-mail vérifié",
        emailUnverified: "E-mail non vérifié",
      },
      userStatus: {
        active: "Actif",
        inactive: "Inactif",
        pending: "En attente",
        suspended: "Suspendu",
      },
      userRoleFilter: {
        all: "Tous",
        user: "Utilisateur",
        public: "Public",
        customer: "Client",
        moderator: "Modérateur",
        partnerAdmin: "Admin partenaire",
        partnerEmployee: "Employé partenaire",
        admin: "Admin",
        superAdmin: "Super admin",
      },
      subscriptionPresenceFilter: {
        any: "Tous",
        hasActive: "Abonnement actif",
        hadAny: "Déjà abonné",
        never: "Jamais abonné",
      },
      creditActivityFilter: {
        any: "Tous",
        boughtPack: "A acheté un pack de crédits",
        spentCredits: "A dépensé des crédits",
        neverSpent: "N'a jamais dépensé de crédits",
      },
      threadsFilter: {
        any: "Tous",
        hasThreads: "A des fils",
        noThreads: "Aucun fil",
      },
      referralActivityFilter: {
        any: "Tous",
        hasCode: "A un lien de parrainage",
        hasClicks: "A des clics de parrainage",
        hasSignups: "A des inscriptions parrainées",
        hasSubscribers: "A des filleuls payants",
      },
    },
  },
  stats: {
    title: "Statistiques utilisateurs",
    description: "Analyses et statistiques complètes sur les utilisateurs",
    category: "Utilisateurs",
    tag: "Statistiques",
    container: {
      title: "Tableau de bord des statistiques utilisateurs",
      description: "Analyses et statistiques complètes sur les utilisateurs",
    },
    actions: {
      refresh: "Actualiser",
      refreshing: "Actualisation...",
    },
    basicFilters: {
      title: "Filtres de base",
      description: "Filtrer les utilisateurs par statut et rôle",
    },
    subscriptionFilters: {
      title: "Filtres d'abonnement",
      description: "Filtrer par abonnement et paiement",
    },
    locationFilters: {
      title: "Filtres géographiques",
      description: "Filtrer par pays et langue",
    },
    timePeriodOptions: {
      title: "Options de période",
      description: "Configurer la période et le graphique",
    },
    sections: {
      filterOptions: {
        title: "Options de filtrage",
        description: "Configurer les filtres des statistiques utilisateurs",
      },
    },
    fields: {
      status: {
        label: "Filtre de statut",
        description: "Filtrer les statistiques par statut utilisateur",
      },
      role: {
        label: "Filtre de rôle",
        description: "Filtrer les statistiques par rôle utilisateur",
      },
      country: {
        label: "Filtre de pays",
        description: "Filtrer les statistiques par pays",
        placeholder: "Choisir un pays...",
      },
      language: {
        label: "Filtre de langue",
        description: "Filtrer les statistiques par langue",
        placeholder: "Choisir une langue...",
      },
      search: {
        label: "Recherche",
        description: "Rechercher des utilisateurs pour les statistiques",
        placeholder: "Saisir un terme de recherche...",
      },
      chartType: {
        label: "Type de graphique",
        description: "Choisir le type de graphique à afficher",
      },
      dateRangePreset: {
        label: "Période prédéfinie",
        description: "Choisir une période prédéfinie",
      },
      includeComparison: {
        label: "Inclure la comparaison",
        description: "Comparer avec la période précédente",
      },
      timePeriod: {
        label: "Période",
        description: "Choisir la période des statistiques",
      },
      subscriptionStatus: {
        label: "Statut d'abonnement",
        description: "Filtrer par statut d'abonnement",
      },
      paymentMethod: {
        label: "Moyen de paiement",
        description: "Filtrer par moyen de paiement",
      },
    },
    response: {
      overviewStats: {
        title: "Vue d'ensemble",
        description: "Statistiques générales sur les utilisateurs",
        totalUsers: {
          label: "Total utilisateurs",
        },
        activeUsers: {
          label: "Utilisateurs actifs",
        },
        inactiveUsers: {
          label: "Utilisateurs inactifs",
        },
        newUsers: {
          label: "Nouveaux utilisateurs",
        },
      },
      emailStats: {
        title: "Statistiques e-mail",
        description: "Statistiques de vérification des e-mails",
        emailVerifiedUsers: {
          label: "E-mails vérifiés",
        },
        emailUnverifiedUsers: {
          label: "E-mails non vérifiés",
        },
        verificationRate: {
          label: "Taux de vérification",
        },
      },
      profileStats: {
        title: "Statistiques de profil",
        description: "Statistiques de complétion des profils",
        complete: {
          title: "Complétion des profils",
          description: "Indicateurs détaillés de complétion des profils",
          usersWithPhone: {
            content: "Utilisateurs avec téléphone",
          },
          usersWithBio: {
            content: "Utilisateurs avec biographie",
          },
          usersWithWebsite: {
            content: "Utilisateurs avec site web",
          },
          usersWithJobTitle: {
            content: "Utilisateurs avec poste",
          },
          usersWithImage: {
            content: "Utilisateurs avec photo de profil",
          },
          completionRate: {
            content: "Taux de complétion des profils",
          },
        },
      },
      subscriptionStats: {
        title: "Statistiques d'abonnement",
        description: "Répartition des abonnements",
        activeSubscriptions: {
          label: "Actifs",
        },
        canceledSubscriptions: {
          label: "Résiliés",
        },
        expiredSubscriptions: {
          label: "Expirés",
        },
        noSubscription: {
          label: "Sans abonnement",
        },
        subscriptionChart: {
          label: "Répartition des abonnements",
          description: "Répartition visuelle des statuts d'abonnement",
        },
      },
      paymentStats: {
        title: "Statistiques de paiement",
        description: "Statistiques de revenu et de transactions",
        totalRevenue: {
          label: "Revenu total",
        },
        transactionCount: {
          label: "Transactions",
        },
        averageOrderValue: {
          label: "Panier moyen",
        },
        refundRate: {
          label: "Taux de remboursement",
        },
      },
      roleStats: {
        title: "Statistiques par rôle",
        description: "Répartition des utilisateurs par rôle",
        publicUsers: {
          label: "Publics",
        },
        customerUsers: {
          label: "Clients",
        },
        partnerAdminUsers: {
          label: "Admins partenaires",
        },
        partnerEmployeeUsers: {
          label: "Employés partenaires",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Répartition par rôle",
          description: "Répartition visuelle des utilisateurs par rôle",
        },
      },
      timeStats: {
        title: "Statistiques temporelles",
        description: "Création et croissance des utilisateurs dans le temps",
        usersCreatedToday: {
          label: "Aujourd'hui",
        },
        usersCreatedThisWeek: {
          label: "Cette semaine",
        },
        usersCreatedThisMonth: {
          label: "Ce mois-ci",
        },
        usersCreatedLastMonth: {
          label: "Le mois dernier",
        },
        growthRate: {
          label: "Taux de croissance",
        },
      },
      companyStats: {
        title: "Statistiques entreprises",
        description: "Statistiques des utilisateurs liées aux entreprises",
        uniqueCompanies: {
          content: "Entreprises distinctes",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Total utilisateurs",
      },
      activeUsers: {
        content: "Utilisateurs actifs",
      },
      inactiveUsers: {
        content: "Utilisateurs inactifs",
      },
      newUsers: {
        content: "Nouveaux utilisateurs",
      },
      emailVerifiedUsers: {
        content: "Utilisateurs avec e-mail vérifié",
      },
      emailUnverifiedUsers: {
        content: "Utilisateurs avec e-mail non vérifié",
      },
      verificationRate: {
        content: "Taux de vérification des e-mails",
      },
      usersWithPhone: {
        content: "Utilisateurs avec téléphone",
      },
      usersWithBio: {
        content: "Utilisateurs avec biographie",
      },
      usersWithWebsite: {
        content: "Utilisateurs avec site web",
      },
      usersWithJobTitle: {
        content: "Utilisateurs avec poste",
      },
      usersWithImage: {
        content: "Utilisateurs avec photo de profil",
      },
      usersWithStripeId: {
        content: "Utilisateurs avec ID Stripe",
      },
      usersWithoutStripeId: {
        content: "Utilisateurs sans ID Stripe",
      },
      stripeIntegrationRate: {
        content: "Taux d'intégration Stripe",
      },
      usersWithLeadId: {
        content: "Utilisateurs avec ID de lead",
      },
      usersWithoutLeadId: {
        content: "Utilisateurs sans ID de lead",
      },
      leadAssociationRate: {
        content: "Taux d'association aux leads",
      },
      publicUsers: {
        content: "Utilisateurs publics",
      },
      customerUsers: {
        content: "Utilisateurs clients",
      },
      partnerAdminUsers: {
        content: "Utilisateurs admins partenaires",
      },
      partnerEmployeeUsers: {
        content: "Utilisateurs employés partenaires",
      },
      adminUsers: {
        content: "Utilisateurs admins",
      },
      uniqueCompanies: {
        content: "Entreprises distinctes",
      },
      usersCreatedToday: {
        content: "Utilisateurs créés aujourd'hui",
      },
      usersCreatedThisWeek: {
        content: "Utilisateurs créés cette semaine",
      },
      usersCreatedThisMonth: {
        content: "Utilisateurs créés ce mois-ci",
      },
      usersCreatedLastMonth: {
        content: "Utilisateurs créés le mois dernier",
      },
      growthRate: {
        content: "Taux de croissance",
      },
      leadToUserConversionRate: {
        content: "Taux de conversion lead vers utilisateur",
      },
      retentionRate: {
        content: "Taux de rétention des utilisateurs",
      },
      generatedAt: {
        content: "Statistiques générées le",
      },
      growthMetrics: {
        title: "Indicateurs de croissance",
        description: "Croissance et conversion des utilisateurs",
        growthChart: {
          label: "Croissance des utilisateurs dans le temps",
          description: "Évolution visuelle des créations de comptes",
        },
      },
      performanceRates: {
        title: "Taux de performance",
        description: "Indicateurs de performance et de conversion",
        growthRate: {
          label: "Taux de croissance",
        },
        leadToUserConversionRate: {
          label: "Conversion des leads",
        },
        retentionRate: {
          label: "Taux de rétention",
        },
      },
      businessInsights: {
        title: "Indicateurs business",
        description: "Informations et analyses business",
        uniqueCompanies: {
          label: "Entreprises distinctes",
        },
        generatedAt: {
          label: "Généré le",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation échouée",
        description: "Paramètres de statistiques invalides",
      },
      unauthorized: {
        title: "Accès non autorisé",
        description: "Vous devez être connecté pour voir les statistiques",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas le droit de voir les statistiques",
      },
      notFound: {
        title: "Statistiques introuvables",
        description: "Les statistiques demandées sont introuvables",
      },
      conflict: {
        title: "Conflit",
        description:
          "Impossible de générer les statistiques à cause de conflits existants",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vos modifications non enregistrées seront perdues",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Impossible de générer les statistiques suite à une erreur serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la génération des statistiques",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "Tous",
        active: "Actif",
        trialing: "En essai",
        pastDue: "En retard de paiement",
        canceled: "Résilié",
        unpaid: "Impayé",
        paused: "En pause",
        noSubscription: "Sans abonnement",
      },
      paymentMethodFilter: {
        all: "Tous",
        card: "Carte",
        bankTransfer: "Virement bancaire",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "Prélèvement SEPA",
        crypto: "Cryptomonnaie",
        noPaymentMethod: "Aucun moyen de paiement",
      },
    },
    success: {
      title: "Statistiques générées",
      description: "Les statistiques utilisateurs ont bien été générées",
    },
    widget: {
      headerTitle: "Statistiques utilisateurs",
      refresh: "Actualiser",
      labelTotalUsers: "Total utilisateurs",
      labelActiveUsers: "Utilisateurs actifs",
      labelNewToday: "Nouveaux aujourd'hui",
      labelNewThisWeek: "Nouveaux cette semaine",
      labelNewThisMonth: "Nouveaux ce mois-ci",
      labelTotalRevenue: "Revenu total",
      labelAvgRevenuePerUser: "Revenu moyen / utilisateur",
      labelEmailVerified: "E-mail vérifié",
      labelVerificationRate: "Taux de vérification",
      labelEmailUnverified: "E-mail non vérifié",
      labelGrowthRate: "Taux de croissance",
      labelLeadUserCvr: "Taux de conversion lead → utilisateur",
      labelRetentionRate: "Taux de rétention",
      chartByRole: "Par rôle",
      chartBySubscriptionStatus: "Par statut d'abonnement",
      chartGrowthOverTime: "Croissance dans le temps",
      recentSignupsSummary: "Résumé des inscriptions récentes",
      rowToday: "Aujourd'hui",
      rowThisWeek: "Cette semaine",
      rowThisMonth: "Ce mois-ci",
      rowLastMonth: "Le mois dernier",
      generatedAt: "Généré le :",
      filters: "Filtres",
      filtersTitle: "Options de filtrage",
      applyFilters: "Appliquer les filtres",
      viewUsers: "Voir les utilisateurs",
      createUser: "Créer un utilisateur",
    },
  },
  user: {
    category: "Utilisateurs",
    tag: "Gestion des utilisateurs",
    errors: {
      not_found: {
        title: "Utilisateur introuvable",
        description: "L'utilisateur demandé est introuvable",
      },
      internal: {
        title: "Erreur interne",
        description:
          "Une erreur interne s'est produite lors du traitement de la requête utilisateur",
      },
    },
    id: {
      category: "Utilisateurs",
      tag: "Gestion des utilisateurs",
      id: {
        roles: {
          post: {
            title: "Ajouter un rôle",
            description: "Attribuer un rôle à un compte utilisateur",
            container: {
              title: "Ajouter un rôle",
              description: "Choisissez le rôle à attribuer à cet utilisateur",
            },
            id: {
              label: "ID utilisateur",
              description:
                "Identifiant unique de l'utilisateur qui reçoit le rôle",
              placeholder: "Saisir l'ID utilisateur...",
            },
            role: {
              label: "Rôle",
              description: "Le rôle à attribuer à l'utilisateur",
              placeholder: "Choisir un rôle...",
            },
            submit: {
              label: "Ajouter le rôle",
            },
            response: {
              roleId: {
                content: "ID d'attribution du rôle",
              },
              userId: {
                content: "ID utilisateur",
              },
              assignedRole: {
                content: "Rôle attribué",
              },
            },
            errors: {
              unauthorized: {
                title: "Non autorisé",
                description:
                  "Vous devez être connecté pour gérer les rôles des utilisateurs",
              },
              validation: {
                title: "Validation échouée",
                description: "Indiquez un ID utilisateur et un rôle valides",
              },
              forbidden: {
                title: "Accès refusé",
                description:
                  "Seuls les administrateurs peuvent gérer les rôles des utilisateurs",
              },
              notFound: {
                title: "Utilisateur introuvable",
                description: "L'utilisateur indiqué est introuvable",
              },
              conflict: {
                title: "Rôle déjà attribué",
                description: "Cet utilisateur possède déjà ce rôle",
              },
              network: {
                title: "Erreur réseau",
                description: "Impossible de se connecter au serveur",
              },
              unsavedChanges: {
                title: "Modifications non enregistrées",
                description:
                  "Vos modifications non enregistrées seront perdues",
              },
              server: {
                title: "Erreur serveur",
                description:
                  "Impossible d'ajouter le rôle suite à une erreur serveur",
              },
              unknown: {
                title: "Erreur inconnue",
                description:
                  "Une erreur inattendue s'est produite lors de l'ajout du rôle",
              },
            },
            success: {
              title: "Rôle ajouté",
              description: "Le rôle a bien été attribué à l'utilisateur",
            },
          },
          delete: {
            title: "Retirer un rôle",
            description: "Retirer un rôle à un compte utilisateur",
            container: {
              title: "Retirer un rôle",
              description: "Choisissez le rôle à retirer à cet utilisateur",
            },
            id: {
              label: "ID utilisateur",
              description:
                "Identifiant unique de l'utilisateur qui perd le rôle",
              placeholder: "Saisir l'ID utilisateur...",
            },
            role: {
              label: "Rôle",
              description: "Le rôle à retirer à l'utilisateur",
              placeholder: "Choisir un rôle...",
            },
            submit: {
              label: "Retirer le rôle",
            },
            response: {
              success: {
                content: "Rôle retiré",
              },
            },
            errors: {
              unauthorized: {
                title: "Non autorisé",
                description:
                  "Vous devez être connecté pour gérer les rôles des utilisateurs",
              },
              validation: {
                title: "Validation échouée",
                description: "Indiquez un ID utilisateur et un rôle valides",
              },
              forbidden: {
                title: "Accès refusé",
                description:
                  "Seuls les administrateurs peuvent gérer les rôles des utilisateurs",
              },
              notFound: {
                title: "Utilisateur introuvable",
                description: "L'utilisateur indiqué est introuvable",
              },
              conflict: {
                title: "Conflit",
                description:
                  "Impossible de retirer le rôle à cause de dépendances existantes",
              },
              network: {
                title: "Erreur réseau",
                description: "Impossible de se connecter au serveur",
              },
              unsavedChanges: {
                title: "Modifications non enregistrées",
                description:
                  "Vos modifications non enregistrées seront perdues",
              },
              server: {
                title: "Erreur serveur",
                description:
                  "Impossible de retirer le rôle suite à une erreur serveur",
              },
              unknown: {
                title: "Erreur inconnue",
                description:
                  "Une erreur inattendue s'est produite lors du retrait du rôle",
              },
            },
            success: {
              title: "Rôle retiré",
              description: "Le rôle a bien été retiré à l'utilisateur",
            },
          },
        },
        get: {
          title: "Afficher l'utilisateur",
          description: "Obtenir les informations détaillées d'un utilisateur",
          container: {
            title: "Détails de l'utilisateur",
            description: "Informations détaillées sur l'utilisateur",
          },
          id: {
            label: "ID utilisateur",
            description: "Identifiant unique de l'utilisateur",
            placeholder: "Saisir l'ID utilisateur...",
          },
          response: {
            userProfile: {
              title: "Profil utilisateur",
              description: "Informations détaillées du profil",
              basicInfo: {
                title: "Informations de base",
                description: "Informations principales de l'utilisateur",
                id: {
                  content: "ID utilisateur",
                },
                email: {
                  content: "Adresse e-mail",
                },
                privateName: {
                  content: "Nom privé",
                },
                publicName: {
                  content: "Nom public",
                },
                firstName: {
                  content: "Prénom",
                },
                lastName: {
                  content: "Nom",
                },
                company: {
                  content: "Entreprise",
                },
              },
              contactDetails: {
                title: "Coordonnées",
                description: "Coordonnées de l'utilisateur",
                phone: {
                  content: "Numéro de téléphone",
                },
                preferredContactMethod: {
                  content: "Moyen de contact préféré",
                },
                website: {
                  content: "Site web",
                },
              },
            },
            profileDetails: {
              title: "Détails du profil",
              description: "Informations de profil complémentaires",
              imageUrl: {
                content: "Photo de profil",
              },
              bio: {
                content: "Biographie",
              },
              jobTitle: {
                content: "Poste",
              },
              leadId: {
                content: "ID du lead associé",
              },
            },
            accountStatus: {
              title: "Statut du compte",
              description: "Informations sur le statut du compte",
              isActive: {
                content: "Statut actif",
              },
              emailVerified: {
                content: "E-mail vérifié",
              },
              stripeCustomerId: {
                content: "ID client Stripe",
              },
              userRoles: {
                content: "Rôles de l'utilisateur",
              },
            },
            timestamps: {
              title: "Horodatages",
              description: "Dates de création et de mise à jour",
              createdAt: {
                content: "Créé le",
              },
              updatedAt: {
                content: "Mis à jour le",
              },
            },
            referralInfo: {
              title: "Parrainage",
              description: "Chaîne de parrainage et gains",
              referredByUserId: {
                content: "Parrainé par (ID utilisateur)",
              },
              referredByCode: {
                content: "Code de parrainage utilisé",
              },
              totalReferrals: {
                content: "Utilisateurs parrainés",
              },
              totalEarnedCents: {
                content: "Total gagné (centimes)",
              },
            },
            leadId: {
              content: "ID du lead associé",
            },
            email: {
              content: "Adresse e-mail",
            },
            privateName: {
              content: "Nom privé",
            },
            publicName: {
              content: "Nom public",
            },
            firstName: {
              content: "Prénom",
            },
            lastName: {
              content: "Nom",
            },
            company: {
              content: "Entreprise",
            },
            phone: {
              content: "Numéro de téléphone",
            },
            preferredContactMethod: {
              content: "Moyen de contact préféré",
            },
            imageUrl: {
              content: "Photo de profil",
            },
            bio: {
              content: "Biographie",
            },
            website: {
              content: "Site web",
            },
            jobTitle: {
              content: "Poste",
            },
            emailVerified: {
              content: "E-mail vérifié",
            },
            isActive: {
              content: "Statut actif",
            },
            stripeCustomerId: {
              content: "ID client Stripe",
            },
            userRoles: {
              content: "Rôles de l'utilisateur",
            },
            createdAt: {
              content: "Créé le",
            },
            updatedAt: {
              content: "Mis à jour le",
            },
          },
          errors: {
            unauthorized: {
              title: "Accès non autorisé",
              description:
                "Vous devez être connecté pour voir les détails d'un utilisateur",
            },
            validation: {
              title: "Validation échouée",
              description: "ID utilisateur invalide",
            },
            forbidden: {
              title: "Accès refusé",
              description: "Vous n'avez pas le droit de voir cet utilisateur",
            },
            notFound: {
              title: "Utilisateur introuvable",
              description: "L'utilisateur demandé est introuvable",
            },
            conflict: {
              title: "Conflit",
              description:
                "Impossible de récupérer l'utilisateur à cause de conflits existants",
            },
            network: {
              title: "Erreur réseau",
              description: "Impossible de se connecter au serveur",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Vos modifications non enregistrées seront perdues",
            },
            server: {
              title: "Erreur serveur",
              description:
                "Impossible de récupérer l'utilisateur suite à une erreur serveur",
            },
            unknown: {
              title: "Erreur inconnue",
              description:
                "Une erreur inattendue s'est produite lors de la récupération de l'utilisateur",
            },
          },
          success: {
            title: "Utilisateur récupéré",
            description: "Les détails de l'utilisateur ont bien été récupérés",
          },
        },
        put: {
          title: "Modifier l'utilisateur",
          description:
            "Modifier les informations et le profil d'un utilisateur",
          container: {
            title: "Modifier l'utilisateur",
            description: "Modifier les informations et les paramètres",
          },
          id: {
            label: "ID utilisateur",
            description: "Identifiant unique de l'utilisateur à modifier",
            placeholder: "Saisir l'ID utilisateur...",
          },
          sections: {
            basicInfo: {
              title: "Informations de base",
              description: "Modifier les informations de base",
            },
            contactInfo: {
              title: "Coordonnées",
              description: "Modifier les coordonnées",
            },
            profileDetails: {
              title: "Détails du profil",
              description:
                "Modifier les informations de profil complémentaires",
            },
            adminSettings: {
              title: "Paramètres d'administration",
              description: "Modifier les paramètres d'administration",
            },
          },
          email: {
            label: "Adresse e-mail",
            description:
              "Adresse e-mail de l'utilisateur pour la connexion et les échanges",
            placeholder: "Saisir l'adresse e-mail...",
          },
          privateName: {
            label: "Nom privé",
            description:
              "Nom légal complet de l'utilisateur (visible uniquement par les admins)",
          },
          publicName: {
            label: "Nom public",
            description:
              "Nom d'affichage de l'utilisateur (visible par tous les utilisateurs)",
          },
          firstName: {
            label: "Prénom",
            description: "Prénom de l'utilisateur",
            placeholder: "Saisir le prénom...",
          },
          lastName: {
            label: "Nom",
            description: "Nom de famille de l'utilisateur",
            placeholder: "Saisir le nom...",
          },
          company: {
            label: "Entreprise",
            description: "Entreprise ou organisation de l'utilisateur",
            placeholder: "Saisir le nom de l'entreprise...",
          },
          phone: {
            label: "Numéro de téléphone",
            description: "Numéro de téléphone de l'utilisateur",
            placeholder: "Saisir le numéro de téléphone...",
          },
          preferredContactMethod: {
            label: "Moyen de contact préféré",
            description: "Comment l'utilisateur préfère être contacté",
          },
          bio: {
            label: "Biographie",
            description: "Courte présentation de l'utilisateur",
            placeholder: "Saisir la biographie...",
          },
          website: {
            label: "Site web",
            description: "Site personnel ou professionnel de l'utilisateur",
            placeholder: "Saisir l'URL du site...",
          },
          jobTitle: {
            label: "Poste",
            description: "Poste ou fonction de l'utilisateur",
            placeholder: "Saisir le poste...",
          },
          emailVerified: {
            label: "E-mail vérifié",
            description: "Indique si l'e-mail de l'utilisateur est vérifié",
          },
          isActive: {
            label: "Statut actif",
            description: "Indique si le compte utilisateur est actif",
          },
          leadId: {
            label: "ID du lead",
            description: "Identifiant du lead associé",
            placeholder: "Saisir l'ID du lead...",
          },
          isBanned: {
            label: "Banni",
            description: "Indique si l'utilisateur est banni de la plateforme",
          },
          bannedReason: {
            label: "Motif du bannissement",
            description: "Raison du bannissement de l'utilisateur",
          },
          response: {
            leadId: {
              content: "ID du lead associé",
            },
            email: {
              content: "Adresse e-mail",
            },
            privateName: {
              content: "Nom privé",
            },
            publicName: {
              content: "Nom public",
            },
            firstName: {
              content: "Prénom",
            },
            lastName: {
              content: "Nom",
            },
            company: {
              content: "Entreprise",
            },
            phone: {
              content: "Numéro de téléphone",
            },
            preferredContactMethod: {
              content: "Moyen de contact préféré",
            },
            imageUrl: {
              content: "Photo de profil",
            },
            bio: {
              content: "Biographie",
            },
            website: {
              content: "Site web",
            },
            jobTitle: {
              content: "Poste",
            },
            emailVerified: {
              content: "E-mail vérifié",
            },
            isActive: {
              content: "Statut actif",
            },
            stripeCustomerId: {
              content: "ID client Stripe",
            },
            userRoles: {
              content: "Rôles de l'utilisateur",
            },
            createdAt: {
              content: "Créé le",
            },
            updatedAt: {
              content: "Mis à jour le",
            },
          },
          errors: {
            unauthorized: {
              title: "Accès non autorisé",
              description:
                "Vous devez être connecté pour modifier des utilisateurs",
            },
            validation: {
              title: "Validation échouée",
              description: "Vérifiez les données du formulaire et réessayez",
            },
            forbidden: {
              title: "Accès refusé",
              description:
                "Vous n'avez pas le droit de modifier cet utilisateur",
            },
            notFound: {
              title: "Utilisateur introuvable",
              description: "L'utilisateur à modifier est introuvable",
            },
            conflict: {
              title: "Conflit de mise à jour",
              description:
                "Les données de l'utilisateur sont en conflit avec des enregistrements existants",
            },
            server: {
              title: "Erreur serveur",
              description:
                "Impossible de modifier l'utilisateur suite à une erreur serveur",
            },
            unknown: {
              title: "Erreur inconnue",
              description:
                "Une erreur inattendue s'est produite lors de la modification de l'utilisateur",
            },
            network: {
              title: "Erreur réseau",
              description: "Impossible de se connecter au serveur",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Vos modifications non enregistrées seront perdues",
            },
          },
          success: {
            title: "Utilisateur modifié",
            description:
              "Les informations de l'utilisateur ont bien été modifiées",
          },
        },
        delete: {
          title: "Supprimer l'utilisateur",
          description: "Supprimer définitivement un compte utilisateur",
          container: {
            title: "Supprimer l'utilisateur",
            description: "Retirer définitivement l'utilisateur du système",
          },
          id: {
            label: "ID utilisateur",
            description: "Identifiant unique de l'utilisateur à supprimer",
            placeholder: "Saisir l'ID utilisateur...",
            helpText: "ATTENTION : cette action est irréversible",
          },
          submitButton: {
            label: "Supprimer l'utilisateur",
            loadingText: "Suppression...",
          },
          response: {
            deletionResult: {
              title: "Résultat de la suppression",
              description: "Résultat de l'opération de suppression",
              success: {
                content: "Suppression réussie",
              },
              message: {
                content: "Message de suppression",
              },
              deletedAt: {
                content: "Supprimé le",
              },
            },
            success: {
              content: "Suppression réussie",
            },
            message: {
              content: "Message de suppression",
            },
          },
          errors: {
            unauthorized: {
              title: "Accès non autorisé",
              description:
                "Vous devez être connecté pour supprimer des utilisateurs",
            },
            validation: {
              title: "Validation échouée",
              description: "ID utilisateur invalide pour la suppression",
            },
            forbidden: {
              title: "Accès refusé",
              description:
                "Vous n'avez pas le droit de supprimer des utilisateurs",
            },
            notFound: {
              title: "Utilisateur introuvable",
              description: "L'utilisateur à supprimer est introuvable",
            },
            server: {
              title: "Erreur serveur",
              description:
                "Impossible de supprimer l'utilisateur suite à une erreur serveur",
            },
            unknown: {
              title: "Erreur inconnue",
              description:
                "Une erreur inattendue s'est produite lors de la suppression de l'utilisateur",
            },
            conflict: {
              title: "Conflit",
              description:
                "Impossible de supprimer l'utilisateur à cause de dépendances existantes",
            },
            network: {
              title: "Erreur réseau",
              description: "Impossible de se connecter au serveur",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Vos modifications non enregistrées seront perdues",
            },
          },
          success: {
            title: "Utilisateur supprimé",
            description: "L'utilisateur a bien été supprimé",
          },
        },
        widget: {
          userProfile: "Profil utilisateur",
          active: "Actif",
          inactive: "Inactif",
          leadId: "ID du lead :",
          viewLead: "Voir le lead",
          created: "Créé",
          lastUpdated: "Dernière mise à jour",
          fullProfile: "Profil complet",
          referrals: "Parrainages",
          subscription: "Abonnement",
          creditHistory: "Historique des crédits",
          deleteUser: "Supprimer l'utilisateur",
          userDeletedSuccessfully: "Utilisateur supprimé",
          deletedAt: "Supprimé le",
          confirmDeletion: "Confirmer la suppression",
          confirmDeletionMessage:
            "L'utilisateur et toutes ses données associées seront définitivement supprimés. Cette action est irréversible.",
          titleReferralCodes: "Voir les codes de parrainage et leurs stats",
          titleSubscription: "Voir l'abonnement",
          titleCopyUserId: "Copier l'ID utilisateur",
        },
      },
    },
  },
  view: {
    category: "Utilisateurs",
    tags: {
      user: "Utilisateur",
      view: "Afficher",
    },

    badge: "Détails de l'utilisateur",
    get: {
      title: "Voir l'utilisateur",
      description: "Voir les informations détaillées d'un utilisateur",
      userId: {
        label: "ID utilisateur",
      },
    },
    errors: {
      validation: {
        title: "Requête invalide",
        description: "Vérifiez l'ID utilisateur et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Connexion impossible. Vérifiez votre connexion internet",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour voir les détails de l'utilisateur",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas le droit de voir cet utilisateur",
      },
      notFound: {
        title: "Utilisateur introuvable",
        description: "Impossible de trouver cet utilisateur",
      },
      serverError: {
        title: "Un problème est survenu",
        description:
          "Impossible de charger les détails de l'utilisateur. Réessayez",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un imprévu s'est produit. Réessayez",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Conflit de données",
        description:
          "Les données de l'utilisateur ont changé. Actualisez et réessayez",
      },
    },
    success: {
      title: "Utilisateur chargé",
      description: "Détails de l'utilisateur chargés",
    },
    empty: "Aucune donnée utilisateur",
    sections: {
      basicInfo: "Informations de base",
      chatActivity: "Activité de chat",
      credits: "Crédits",
      payments: "Paiements",
      newsletter: "Newsletter",
      referrals: "Parrainages",
      recentActivity: "Activité récente",
    },
    status: {
      active: "Actif",
      banned: "Banni",
      inactive: "Inactif",
      verified: "Vérifié",
    },
    fields: {
      userId: "ID utilisateur",
      locale: "Langue et région",
      twoFactor: "Authentification à deux facteurs",
      enabled: "Activée",
      disabled: "Désactivée",
      marketing: "Marketing",
      optedIn: "Accepté",
      optedOut: "Refusé",
      created: "Créé",
      lastUpdated: "Dernière mise à jour",
      banReason: "Motif du bannissement",
      roles: "Rôles",
    },
    credits: {
      currentBalance: "Solde actuel",
      availableCredits: "Crédits disponibles",
      packBreakdown: "Détail des packs de crédits",
      subscription: "Abonnement",
      permanent: "Permanents",
      bonus: "Bonus",
      earned: "Gagnés",
      expires: "Expire le",
    },
    payment: {
      stripeCustomerId: "ID client Stripe",
      activeSubscription: "Abonnement actif",
      subscriptionPlan: "Formule",
      subscriptionStatus: "Statut de l'abonnement",
      nextBilling: "Prochaine facturation",
    },
    common: {
      yes: "Oui",
      no: "Non",
    },
    newsletter: {
      status: "Statut",
      subscribed: "Inscrit",
      notSubscribed: "Non inscrit",
      subscribedAt: "Inscrit le",
      confirmedAt: "Confirmé le",
      lastEmailSent: "Dernier e-mail envoyé",
    },
    referrals: {
      totalReferrals: "Total parrainages",
      activeCodes: "Codes actifs",
      revenue: "Revenu",
      earnings: "Gains",
    },
    activity: {
      lastLogin: "Dernière connexion",
      lastThread: "Dernier fil",
      lastMessage: "Dernier message",
      lastPayment: "Dernier paiement",
    },
    tabs: {
      overview: "Vue d'ensemble",
      credits: "Crédits",
      referrals: "Parrainages",
      earnings: "Gains",
      connections: "Connexions",
      favorites: "Favoris",
      skills: "Skills",
    },
    modelUsage: {
      title: "Utilisation des modèles",
      model: "Modèle",
      spent: "Crédits dépensés",
      messages: "Messages",
      noUsage: "Aucune donnée d'utilisation des modèles",
    },
    connections: {
      title: "Connexions",
      leadsTitle: "Leads liés",
      usersTitle: "Utilisateurs liés",
      noLeads: "Aucun lead lié",
      noUsers: "Aucun utilisateur lié",
      leadEmail: "E-mail",
      leadBusiness: "Entreprise",
      leadStatus: "Statut",
      ipAddress: "Adresse IP",
      device: "Appareil",
      linkReason: "Motif du lien",
      linkedAt: "Lié le",
      userId: "ID utilisateur",
      userEmail: "E-mail",
      userPublicName: "Nom d'utilisateur",
      viewLead: "Voir le lead",
      viewUser: "Voir l'utilisateur",
    },
    ban: {
      banUser: "Bannir l'utilisateur",
      unbanUser: "Lever le bannissement",
    },
    widget: {
      actions: {
        edit: "Modifier",
        delete: "Supprimer",
        viewCreditHistory: "Voir l'historique des crédits",
        viewSubscription: "Voir l'abonnement",
        viewReferralCodes: "Voir les codes de parrainage",
        viewReferralEarnings: "Voir les gains de parrainage",
        addCredits: "Ajouter des crédits",
        viewLead: "Voir le lead",
        copyUserId: "Copier l'ID utilisateur",
        copied: "Copié !",
      },
      sections: {
        quickActions: "Actions rapides",
      },
      stats: {
        totalThreads: "Total fils",
        totalMessages: "Total messages",
        userMessages: "Messages de l'utilisateur",
        lastActivity: "Dernière activité",
        never: "Jamais",
        freeCredits: "Crédits gratuits",
        freePeriod: "Période",
        totalSpent: "Total dépensé",
        totalPurchased: "Total acheté",
        totalRevenue: "Revenu total",
        payments: "paiements",
        successful: "Réussis",
        failed: "Échoués",
        totalRefunds: "Total remboursé",
        lastPayment: "Dernier paiement",
      },
    },
  },
};
