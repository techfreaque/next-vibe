/**
 * French translations for credits endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Crédits",
  tags: {
    credits: "crédits",
    balance: "solde",
  },
  repository: {
    bonusCreditsAdded: "{{amount}} crédits bonus ajoutés",
    tts: "Synthèse vocale",
    stt: "Reconnaissance vocale",
    search: "Recherche",
    sttHotkey: "Reconnaissance vocale (raccourci)",
  },
  enums: {
    freeStatus: {
      active: "Crédits gratuits actifs",
      verifyEmail:
        "Vérifiez votre e-mail pour débloquer les crédits de votre compte",
      subnetLimit: "Crédits gratuits suspendus pour ce réseau",
    },
    creditType: {
      userSubscription: "Crédits d'abonnement utilisateur",
      leadFree: "Crédits gratuits du lead",
    },
    transactionType: {
      purchase: "Achat",
      subscription: "Abonnement",
      usage: "Utilisation",
      expiry: "Expiration",
      freeTier: "Formule gratuite",
      monthlyReset: "Réinitialisation mensuelle",
      freeGrant: "Crédits offerts",
      freeReset: "Réinitialisation gratuite",
      refund: "Remboursement",
      transfer: "Transfert",
      otherDevices: "Utilisé sur un autre appareil",
      referralEarning: "Gain de parrainage",
      referralPayout: "Versement de parrainage",
    },
    fundingType: {
      freeAllowance: "Quota gratuit mensuel",
      freeBonus: "Bonus compte / newsletter",
      referral: "Crédits de parrainage",
      purchased: "Pack acheté",
      subscription: "Crédits d'abonnement",
      adminGrant: "Attribution admin",
      freeUnknown: "Gratuit, palier non enregistré",
      packUnknown: "Pack, origine non enregistrée",
    },
    packType: {
      subscription: "Abonnement",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Gagné",
    },
  },
  historyLabels: {
    signupCarryover: "Utilisé en tant qu'invité avant l'inscription",
    sharedLimit: "Les appareils liés partagent une même limite mensuelle",
    monthly: "Crédits gratuits mensuels",
    monthlyGuest: "Crédits gratuits mensuels (sans compte)",
    monthlyAccount: "Crédits gratuits mensuels (compte gratuit)",
    monthlyAccountNewsletter: "Crédits gratuits mensuels (compte + newsletter)",
    freeGuest: "Crédits gratuits (sans compte)",
    accountUpgrade: "Bonus compte gratuit",
    newsletterBonus: "Bonus newsletter",
    otherDevices: "Utilisé sur un autre appareil",
    linkedAccount: "Utilisé par le compte lié",
  },
  expire: {
    post: {
      title: "Faire expirer les crédits",
      titleShort: "Expirer les crédits",
      description:
        "Faire expirer les anciens crédits d'abonnement (appelé par le cron)",
      tag: "expiration",
      container: {
        title: "Faire expirer les crédits",
        description: "Résultats de l'expiration des crédits",
      },
      response: {
        expiredCount: "Nombre expirés",
      },
      success: {
        title: "Crédits expirés",
        description: "Les anciens crédits d'abonnement ont expiré",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès refusé",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de faire expirer les crédits",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
      },
    },
    task: {
      description: "Fait expirer chaque jour les anciens crédits d'abonnement",
      error: "Impossible de faire expirer les crédits",
    },
  },
  cleanup: {
    task: {
      description:
        "Nettoie chaque semaine les portefeuilles de leads orphelins",
      error: "Impossible de nettoyer les portefeuilles orphelins",
    },
  },
  errors: {
    getBalanceFailed: "Impossible de récupérer le solde de crédits",
    getLeadBalanceFailed: "Impossible de récupérer le solde de crédits du lead",
    getOrCreateLeadFailed: "Impossible de récupérer ou de créer le lead",
    addCreditsFailed: "Impossible d'ajouter les crédits",
    deductCreditsFailed: "Impossible de débiter les crédits",
    insufficientCredits:
      "Crédits insuffisants. Il vous faut {{cost}} crédits pour utiliser cette fonction.",
    deductionFailed:
      "Impossible de débiter {{cost}} crédits. Veuillez réessayer.",
    getTransactionsFailed:
      "Impossible de récupérer les transactions de crédits",
    invalidIdentifier: "Identifiant d'utilisateur ou de lead invalide",
    userNotFound: "Utilisateur introuvable",
    noLeadFound: "Aucun lead trouvé pour cet utilisateur",
    getCreditIdentifierFailed:
      "Impossible de récupérer l'identifiant de crédits",
    noCreditSource: "Aucune source de crédits disponible",
    stripeCustomerFailed: "Impossible de créer le client Stripe",
    checkoutFailed: "Impossible de créer la session de paiement",
    mergeFailed: "Impossible de fusionner les crédits du lead",
    mergeLeadWalletsFailed:
      "Impossible de fusionner les portefeuilles des leads dans le compte utilisateur",
    cleanupOrphanedFailed:
      "Impossible de nettoyer les portefeuilles de leads orphelins",
    monthlyResetFailed: "Impossible de réinitialiser les crédits mensuels",
    noLeadsToMerge: "Aucun lead fourni à fusionner",
    oldestLeadNotFound: "Impossible de trouver le plus ancien lead du groupe",
    transactionFailed: "Impossible de créer l'enregistrement de transaction",
    not_implemented_on_native:
      "{{method}} n'est pas disponible sur la plateforme native. Utilisez la version web pour cette opération.",
    expireCreditsFailed: "Impossible de faire expirer les crédits",
    invalidAmount: "Le montant de crédits doit être un nombre positif",
    walletNotFound: "Portefeuille introuvable",
    walletCreationFailed: "Impossible de créer le portefeuille",
    addEarnedCreditsFailed: "Impossible d'ajouter les crédits gagnés",
    getEarnedBalanceFailed:
      "Impossible de récupérer le solde de crédits gagnés",
    insufficientEarnedCredits:
      "Crédits gagnés insuffisants pour cette opération",
    deductEarnedCreditsFailed: "Impossible de débiter les crédits gagnés",
    getReferralTransactionsFailed:
      "Impossible de récupérer les transactions de parrainage",
  },
  get: {
    title: "Voir le solde de crédits",
    titleShort: "Solde",
    description:
      "Récupérer le solde de crédits de l'utilisateur, avec le détail",
    response: {
      title: "Solde de crédits",
      description: "Votre solde de crédits actuel et son détail",
    },
    balance: {
      subscribe: "Voir les formules",
      freePlanHint:
        "{{count}} crédits gratuits par mois, {{max}} avec la newsletter. Formules dès {{planPrice}} pour {{subCredits}} crédits par mois.",
      lowBalance: {
        title: "Plus que {{count}} crédits",
        emptyTitle: "Vous n'avez plus de crédits",
        hint: "Rechargez ci-dessous : {{packCredits}} crédits pour {{packPrice}}, sans expiration.",
        hintPlans:
          "Choisissez une formule ci-dessous. Les crédits arrivent dès le paiement.",
        offersHint:
          "Rechargez, vous repartez en quelques secondes. Les crédits du pack n'expirent jamais.",
        offersHintPlans:
          "Choisissez une formule, vous repartez en quelques secondes.",
      },
      freePlan: "Vous êtes sur la formule gratuite",
      guestPlan: "Solde invité",
      signUp: "S'inscrire gratuitement",
      loadFailed: "Le solde n'a pas pu être chargé.",
      retry: "Réessayer",
      title: "Vos crédits",
      adminTitle: "Plafond de dépense",
      description: "Un seul solde pour les {{modelCount}} modèles.",
      adminDescription:
        "Les crédits servent de plafond de dépense : contrôlez la quantité d'IA autorisée pour l'ensemble des utilisateurs.",
      credit: "{{count}} crédit",
      credits: "{{count}} crédits",
      expiring: {
        title: "Crédits à durée limitée",
        description:
          "Crédits du forfait, renouvelés à chaque cycle de facturation",
        adminDescription: "Crédits à durée limitée (cycle d'abonnement)",
      },
      permanent: {
        title: "Crédits permanents",
        description: "N'expirent jamais, ils sont à vous",
        adminDescription: "Crédits permanents, sans expiration",
      },
      free: {
        title: "Crédits gratuits",
        description:
          "{{count}} offerts chaque mois, {{max}} avec la newsletter",
        descriptionGuest:
          "{{guest}} offerts chaque mois. Inscrivez-vous pour en avoir {{signedIn}}, {{max}} avec la newsletter.",
        adminDescription:
          "Plafond gratuit par réserve et par mois (partagé entre appareils) : {{guest}} invité, {{signedIn}} connecté, {{max}} connecté + newsletter",
      },
      earned: {
        title: "Crédits gagnés",
        description:
          "Gagnés grâce au parrainage : cliquez pour inviter vos amis",
      },
      spending: {
        title: "Vos crédits gagnés",
        adminDescription:
          "Vos gains de parrainage personnels (pas ceux de toute l'instance)",
      },
    },
    total: {
      content: "Total des crédits",
    },
    expiring: {
      content: "Crédits à durée limitée (abonnement)",
    },
    permanent: {
      content: "Crédits permanents (packs)",
    },
    free: {
      content: "Crédits de la formule gratuite",
    },
    earned: {
      content: "Crédits gagnés (parrainage)",
    },
    expiresAt: {
      content: "Expire le",
    },
    capacity: {
      content: "Capacité totale",
    },
    freeStatus: {
      content: "Statut des crédits gratuits",
      subnetLimit:
        "Trop de nouveaux comptes gratuits ont été créés depuis votre réseau ce mois-ci : ce compte ne reçoit donc pas de crédits gratuits pour l'instant. Acheter des crédits les débloque, sinon ils arrivent le mois prochain, quand le réseau aura de nouveau de la place.",
    },
    success: {
      title: "Solde récupéré",
      description: "Solde de crédits récupéré",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir votre solde de crédits",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Vous n'avez pas l'autorisation d'accéder à cette ressource",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de récupérer le solde de crédits",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      noActiveSubscription: {
        title: "Abonnement actif requis",
        description:
          "Vous devez avoir un abonnement actif pour acheter des packs de crédits",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de ressources est survenu",
      },
      no_active_subscription: {
        title: "Abonnement actif requis",
        description:
          "Vous devez avoir un abonnement actif pour acheter des packs de crédits",
      },
    },
  },
  history: {
    get: {
      guestGrantsHidden: "Crédits gratuits des invités masqués",
      recent: "Activité récente",
      payment: "Paiement",
      recentTitle: "Activité récente du registre",
      guestDevice: "Appareil invité",
      kindAccount: "Compte",
      kindLead: "Lead sans compte",
      openPayment: "Ouvrir le paiement",
      currentBalance: "Solde actuel",
      currentBalanceHint: "{{paid}} payés · {{free}} gratuits",
      showingRange: "{{from}} à {{to}} sur {{total}}",
      from: "Du",
      to: "Au",
      totals: "Totaux",
      allTypes: "Tous les types",
      filteredBy: "Filtré par",
      clearFilters: "Tout effacer",
      removeFilter: "Retirer le filtre",
      spent: "Crédits dépensés",
      granted: "Crédits attribués",
      entries: "Entrées",
      periodHint: "Sur la période filtrée",
      emptyFiltered: "Aucune entrée pour ces filtres.",
      typeFilter: {
        label: "Type",
      },
      target: {
        label: "Client",
        description: "E-mail du compte, ID utilisateur ou ID de lead",
        placeholder: "client@example.com ou un ID",
      },
      resolvedTarget: "Registre de",
      detail: "Modèle ou fonction",
      targetNotFound: "Aucun compte ni lead ne correspond à {{target}}.",
      lookupTitle: "Registre client",
      lookupHint:
        "Recherchez un compte ou un lead par e-mail, ID utilisateur ou ID de lead pour voir chaque mouvement de crédits.",
      openLedger: "Ouvrir le registre",
      changeTarget: "Chercher un autre",
      colDate: "Date",
      colType: "Type",
      colDetail: "Modèle ou fonction",
      colAmount: "Montant",
      colBalance: "Solde après",
      showing: "Registre de {{who}}",
      bonusGrant: "Attribution de crédits bonus",
      relatedRecords: "Dossiers liés",
      account: "Compte client",
      lead: "Prospect",
      openAccount: "Ouvrir le compte client",
      openLead: "Ouvrir le prospect",
      openPayouts: "Voir les versements du partenaire",
      loading: "Chargement de l’historique des crédits…",
      delta: "{{amount}} crédits",
      entryBalance: "Solde après opération : {{count}} crédits",
      emptyHint: "Chaque crédit entrant et sortant apparaît ici.",
      title: "Voir l'historique des crédits",
      titleShort: "Historique des crédits",
      description: "Récupérer l'historique paginé des transactions de crédits",
      container: {
        title: "Historique des crédits",
        description: "Consultez l'historique de vos transactions de crédits",
      },
      emptyState: "Aucune transaction pour l'instant",
      balance: "Solde après : {{count}}",
      limit: {
        label: "Limite",
        description: "Nombre maximum de transactions à renvoyer (1 à 100)",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de transactions à ignorer pour la pagination",
      },
      targetUserId: {
        label: "ID de l'utilisateur cible",
      },
      targetLeadId: {
        label: "ID du lead cible",
      },
      id: "ID de transaction",
      amount: "Montant",
      type: "Type",
      modelId: "Modèle",
      messageId: "ID du message",
      createdAt: "Date",
      transactions: {
        title: "Transactions",
        description: "Liste des transactions de crédits",
      },
      paginationInfo: {
        total: "Total des transactions",
        totalPages: "Nombre de pages",
      },
      totalCount: {
        content: "Nombre total",
      },
      transaction: {
        id: {
          content: "ID de transaction",
        },
        amount: {
          content: "Montant",
        },
        balanceAfter: {
          content: "Solde après",
        },
        type: {
          content: "Type",
        },
        modelId: {
          content: "Modèle",
        },
        messageId: {
          content: "ID du message",
        },
        createdAt: {
          content: "Date",
        },
      },
      success: {
        title: "Historique récupéré",
        description: "Historique des crédits récupéré",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "La connexion réseau a échoué",
        },
        unauthorized: {
          title: "Non autorisé",
          description:
            "Vous devez être connecté pour voir votre historique de crédits",
        },
        forbidden: {
          title: "Interdit",
          description:
            "Vous n'avez pas l'autorisation d'accéder à cette ressource",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de récupérer l'historique des crédits",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de ressources est survenu",
        },
      },
    },
  },
  purchase: {
    post: {
      title: "Acheter des crédits",
      description:
        "Créer une session de paiement Stripe pour l'achat d'un pack de crédits",
      container: {
        title: "Acheter des crédits",
        description:
          "Achetez des packs de crédits pour utiliser les fonctions d'IA",
      },
      quantity: {
        label: "Quantité",
        description: "Nombre de packs de crédits à acheter (1 à 10)",
        placeholder: "Saisissez une quantité (1 à 10)",
      },
      provider: {
        label: "Prestataire de paiement",
        description: "Choisissez comment payer",
        placeholder: "Choisir un prestataire de paiement",
      },
      checkoutUrl: {
        content: "URL de paiement",
      },
      sessionId: {
        content: "ID de session",
      },
      totalAmount: {
        content: "Montant total (centimes)",
      },
      totalCredits: {
        content: "Total des crédits",
      },
      success: {
        title: "Paiement créé",
        description: "Session de paiement Stripe créée",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Quantité d'achat invalide",
        },
        network: {
          title: "Erreur réseau",
          description: "La connexion réseau a échoué",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour acheter des crédits",
        },
        forbidden: {
          title: "Interdit",
          description: "Vous n'avez pas l'autorisation d'acheter des crédits",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer la session de paiement",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de ressources est survenu",
        },
        noActiveSubscription: {
          title: "Abonnement actif requis",
          description:
            "Vous devez avoir un abonnement actif pour acheter des packs de crédits",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      renewsOn: "Renouvellement le {{date}}",
      endsOn: "Prend fin le {{date}}",
      freeBalance: "Crédits gratuits",
      balanceSplit: "{{total}} au total · {{paid}} payés · {{free}} gratuits",
      stepHint:
        "Étape 1 : vérifiez le destinataire. Étape 2 : choisissez le montant.",
      verified: "Destinataire vérifié",
      kind: "Type de destinataire",
      kindAccount: "Compte · appareils liés : {{count}}",
      subscription: "Abonnement",
      noSubscription: "Aucun abonnement",
      linkedDevices: "Appareils liés",
      recentGrants: "Derniers bonus attribués",
      noGrants: "Aucun bonus pour l'instant",
      grantLine: "{{count}} crédits le {{date}}",
      nextStep: "Ensuite : attribuer des crédits à ce compte",
      grant: "Attribuer des crédits",
      openLedger: "Ouvrir le registre",
      name: "Nom",
      balance: "Solde actuel",
      joinedAt: "Inscrit le",
      noName: "Aucun nom",
      credits: "{{count}} crédits",
      balanceLine: "Solde {{count}} crédits",
      joinedLine: "Inscrit le {{date}}",
      title: "Vérifier le destinataire",
      description: "Vérifier que le compte peut recevoir des crédits bonus.",
      accountId: "Identifiant du compte",
      email: "E-mail du destinataire",
      noLinkedDevice: "Aucun appareil n’est lié à ce compte.",
      loadFailed: "Impossible de vérifier le destinataire.",
      loading: "Vérification du destinataire…",
      retry: "Réessayer",
      openAccount: "Ouvrir le compte client",
      change: "Choisir un autre destinataire",
      verify: "Vérifier",
    },
    post: {
      stepTwo: "Étape 2 sur 2 : montant",
      testerPreset: "3 000 (testeur)",
      preview: "Solde {{before}} → {{after}} (+{{amount}})",
      title: "Ajouter des crédits",
      titleShort: "Ajouter des crédits",
      description:
        "Ajouter des packs de crédits à un compte utilisateur (admin uniquement)",
      tag: "admin",
      container: {
        title: "Attribuer des crédits bonus",
        description:
          "Sélectionnez le destinataire et saisissez le nombre exact de crédits à ajouter à son portefeuille.",
        selfTitle: "Ajouter des crédits à votre compte",
        selfDescription: "Accordez des crédits bonus à votre compte",
      },
      targetUserId: {
        label: "Destinataire",
        description: "Choisir un client dans l’annuaire des comptes.",
      },
      amount: {
        label: "Montant en crédits",
        description: "Saisissez un nombre entier de crédits bonus.",
        placeholder: "137",
      },
      packType: {
        label: "Type de pack",
        description: "Type de pack de crédits à ajouter",
      },
      response: {
        message: {
          content: "Résultat",
        },
      },
      backButton: {
        label: "Retour",
      },
      submitButton: {
        label: "Accorder les crédits bonus",
        loadingText: "Attribution des crédits…",
      },
      success: {
        title: "Crédits ajoutés",
        description: "Les crédits ont été ajoutés au compte utilisateur",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        network: {
          title: "Erreur réseau",
          description: "La connexion réseau a échoué",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Interdit",
          description: "Accès administrateur requis",
        },
        notFound: {
          title: "Introuvable",
          description: "Utilisateur introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible d'ajouter les crédits",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
        conflict: {
          title: "Conflit",
          description: "Un conflit de ressources est survenu",
        },
      },
    },
  },
  email: {
    creditPack: {
      user: {
        subject: "Votre pack de crédits est prêt | {{appName}}",
        title: "Crédits ajoutés à votre compte",
        previewText: "{{credits}} crédits ont été ajoutés à votre compte",
        greeting: "Bonjour {{privateName}},",
        body: "Votre achat de pack de crédits a réussi. {{credits}} crédits permanents ont été ajoutés à votre compte et sont prêts à l'emploi.",
        cta: "Utiliser mes crédits",
        signoff: "Merci pour votre achat !\n\nL'équipe {{appName}}",
      },
      admin: {
        subject: "[{{appName}}] Pack de crédits acheté : {{credits}} crédits",
        title: "Achat d'un pack de crédits",
        preview: "Un utilisateur a acheté un pack de crédits",
        body: "Un utilisateur a acheté un pack de crédits.",
        labelUser: "Utilisateur",
        labelCredits: "Crédits",
        footer: "Notification automatique de {{appName}}",
      },
    },
  },
};
