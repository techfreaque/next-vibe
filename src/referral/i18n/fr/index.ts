import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Parrainage",

  // Tags
  tags: {
    referral: "parrainage",
    codes: "codes",
    earnings: "gains",
    get: "consulter",
    create: "créer",
    list: "liste",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Consulter un code de parrainage",
    titleShort: "Consulter le code",
    description: "Récupérer les détails d'un code de parrainage",
    form: {
      title: "Détails du code de parrainage",
      description: "Voir les informations du code de parrainage",
      limit: {
        label: "Limite",
        description: "Nombre maximal de résultats à renvoyer",
      },
      offset: {
        label: "Décalage",
        description: "Nombre de résultats à ignorer",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "ID du bénéficiaire",
        sourceUserId: "ID de l'utilisateur source",
        transactionId: "ID de transaction",
        level: "Niveau",
        amountCents: "Montant (centimes)",
        currency: "Devise",
        status: "Statut",
        createdAt: "Créé le",
      },
      totalCount: "Nombre total",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Créer un code de parrainage",
    titleShort: "Créer un code",
    description: "Créer un nouveau code de parrainage",
    form: {
      title: "Nouveau code de parrainage",
      description:
        "Un code par audience. Discord, blog, amis. Chacun suivi séparément.",
    },
    submit: {
      label: "Créer le code",
      loading: "Création...",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Modifier le code de parrainage",
    description: "Modifier les paramètres du code de parrainage",
    form: {
      title: "Modifier le code de parrainage",
      description: "Modifier les propriétés du code de parrainage",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Désactiver le code de parrainage",
    description: "Désactiver un code de parrainage",
    form: {
      title: "Désactiver le code de parrainage",
      description: "Désactiver ce code de parrainage",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Associer un parrainage à un lead",
      titleShort: "Associer le parrainage",
      description:
        "Associer un code de parrainage à un lead avant l'inscription",
      form: {
        title: "Associer un code de parrainage",
        description: "Associer le code de parrainage à votre session",
      },
    },
    success: {
      title: "Parrainage associé",
      description: "Code de parrainage associé à votre session",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Liste des codes de parrainage",
        titleShort: "Mes codes",
        description: "Tous vos codes de parrainage avec leurs statistiques",
        form: {
          title: "Vos codes de parrainage",
          description: "Consultez et gérez vos codes de parrainage",
        },
        response: {
          codes: {
            id: "ID",
            code: "Code",
            label: "Libellé",
            currentVisitors: "Visiteurs actuels",
            isActive: "Actif",
            createdAt: "Créé le",
            totalSignups: "Inscriptions totales",
            totalRevenueCents: "Chiffre d'affaires total (centimes)",
            totalEarningsCents: "Gains totaux (centimes)",
          },
        },
      },
      success: {
        title: "Codes récupérés",
        description: "Vos codes de parrainage ont été récupérés",
      },
      widget: {
        loading: "Chargement de vos codes...",
        empty: "Vous n'avez pas encore de code de parrainage",
        emptyHint:
          "Créez votre premier code ci-dessous. Votre lien est prêt immédiatement.",
        copied: "Copié !",
        copy: "Copier le lien",
        visitors: "Visiteurs",
        signups: "Inscriptions",
        revenue: "Chiffre d'affaires",
        earnings: "Gains",
        inactive: "Ce code de parrainage est inactif",
        conversionHint:
          "Chaque abonné à {{examplePrice}}/mois vous rapporte {{exampleEarning}}/mois, chaque mois",
        linkGen: "Lien personnalisé",
        linkGenPlaceholder: "Collez l'URL de n'importe quelle page...",
        linkGenHint:
          "Collez l'URL de n'importe quelle page unbottled pour créer un lien de parrainage suivi",
        linkGenCopy: "Copier",
        linkGenCopied: "Copié !",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Statistiques de parrainage",
      titleShort: "Stats",
      description: "Les statistiques de votre programme de parrainage",
      form: {
        title: "Vos stats de parrainage",
        description: "Consultez les performances de vos parrainages",
      },
    },
    success: {
      title: "Stats récupérées",
      description: "Vos statistiques de parrainage ont été récupérées",
    },
    widget: {
      emptyAdminMessage:
        "Le tableau de bord présente les activités de tout le programme.",
      loading: "Chargement des statistiques de parrainage",
      loadError: "Impossible de charger les statistiques de parrainage",
      retry: "Réessayer",
      emptyTitle: "Aucune activité de parrainage",
      openCodes: "Ouvrir les codes de parrainage",
      revenueCoverage:
        "Montant initial renseigné pour {{measured}} achats sur {{total}}.",
      revenueUnavailable: "Indisponible",
      walletUnits: "{{amount}} crédits",
      adminNotice:
        "Ces chiffres concernent vos parrainages. Le tableau de bord couvre tout le programme.",
      openOverview: "Ouvrir la vue d'ensemble",
      emptyMessage:
        "Partagez un code pour suivre les inscriptions et les commissions.",
    },
    fields: {
      totalSignups: "Inscriptions totales",
      totalSignupsDescription:
        "Nombre d'utilisateurs inscrits avec votre code de parrainage",
      totalRevenue: "Montant des achats renseignés",
      totalRevenueDescription:
        "Montants d’achat initiaux en USD à l’origine de vos commissions.",
      totalEarned: "Total gagné",
      totalEarnedDescription:
        "Crédits gagnés, y compris ceux encore soumis au délai de remboursement.",
      availableBalance: "Solde disponible",
      availableBalanceDescription:
        "Crédits disponibles après déduction des retraits réservés.",
      availableBalanceDescriptionLow:
        "Crédits disponibles après déduction des retraits réservés. Retrait minimum : {{minPayout}} crédits.",
      totalRevenueCredits: "Chiffre d'affaires total (crédits)",
      totalEarnedCredits: "Total gagné (crédits)",
      totalPaidOutCredits: "Total versé (crédits)",
      availableCredits: "Crédits disponibles",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Confirmer les gains de parrainage",
        titleShort: "Confirmer les gains",
        description:
          "Débloque les gains de parrainage dont le délai de remboursement est écoulé. S'exécute chaque jour.",
        container: {
          title: "Confirmation des gains",
          description:
            "Gains en attente dont le délai de remboursement est écoulé",
        },
        response: {
          confirmedCount: "Confirmés",
          failedCount: "Échoués",
        },
        success: {
          title: "Gains confirmés",
          description:
            "Les gains de parrainage arrivés à échéance sont maintenant utilisables",
        },
      },
      task: {
        description:
          "Convertit en crédits gagnés les gains de parrainage plus anciens que le délai de remboursement",
      },
    },
    list: {
      get: {
        title: "Liste des gains de parrainage",
        titleShort: "Gains",
        description: "L'historique de vos gains de parrainage",
        form: {
          title: "Vos gains de parrainage",
          description: "Consultez les gains issus de vos parrainages",
          targetUserId: "Compte partenaire",
          limit: {
            label: "Lignes par page",
            description: "Nombre de gains affichés par page",
          },
          offset: {
            label: "Commencer à",
            description: "Nombre de gains ignorés",
          },
        },
        widget: {
          subtitle:
            "Commissions sur les paiements des utilisateurs que vous avez parrainés. Chacune reste en attente jusqu'à la fin du délai de remboursement.",
          direct: "Parrainage direct",
          level: "Parrainage niveau {{level}}",
          empty: "Aucun gain pour l'instant",
          emptyHint:
            "Dès qu'une personne parrainée paie, votre commission apparaît ici.",
          loading: "Chargement des gains…",
          loadFailed: "Impossible de charger les gains",
          retry: "Réessayer",
          showing: "{{from}} à {{to}} sur {{total}}",
          previous: "Précédent",
          next: "Suivant",
          pageTotal: "Total de cette page ({{currency}})",
          col: {
            date: "Date",
            source: "Origine",
            status: "Statut",
            amount: "Commission",
          },
        },
      },
      success: {
        title: "Gains récupérés",
        description: "Vos gains de parrainage ont été récupérés",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Code",
        description:
          "Ce que les gens tapent ou voient dans votre lien. 3 à 50 caractères.",
        placeholder: "ex. ALEX10",
      },
      label: {
        label: "Libellé (visible par vous seul)",
        description: "L'endroit où vous allez le partager.",
        placeholder: "ex. Bio YouTube",
      },
      description: {
        label: "Description",
        description: "Description facultative",
        placeholder: "Saisir une description",
      },
      maxUses: {
        label: "Utilisations maximales",
        description: "Nombre maximal d'utilisations de ce code",
        placeholder: "Laisser vide pour illimité",
      },
      expiresAt: {
        label: "Date d'expiration",
        description: "Date d'expiration de ce code",
        placeholder: "Sélectionner une date",
      },
      isActive: {
        label: "Actif",
        description: "Ce code est-il actuellement actif",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Code",
    label: "Libellé",
    description: "Description",
    ownerUserId: "ID du propriétaire",
    maxUses: "Utilisations maximales",
    currentUses: "Utilisations actuelles",
    expiresAt: "Expire le",
    isActive: "Actif",
    createdAt: "Créé le",
    updatedAt: "Mis à jour le",
    referralCode: "Code de parrainage",
    success:
      "🎉 Votre code de parrainage est prêt ! Copiez le lien ci-dessous et touchez {{directPct}} de commission sur chaque abonnement, plus des gains bonus sur les parrainages de vos filleuls.",
    message: "Message",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Demandes de versement",
        titleShort: "Demandes de versement",
        description: "Gérer les demandes de versement de parrainage",
      },
      post: {
        title: "Traiter un versement",
        titleShort: "Traiter le versement",
        description: "Approuver, refuser ou finaliser une demande de versement",
      },
      fields: {
        search: {
          label: "E-mail du partenaire",
          description: "Rechercher tout ou partie de l’adresse e-mail.",
        },
        userId: {
          label: "Compte partenaire",
        },
        page: {
          label: "Page",
        },
        limit: {
          label: "Résultats par page",
        },
        status: {
          all: "Tous les statuts",
          label: "Filtre de statut",
          description: "Filtrer par statut de versement",
        },
        currency: {
          label: "Mode de versement",
          description: "Filtrer par mode de versement",
          all: "Tous les modes",
        },
        requestId: {
          label: "ID de la demande",
          description: "Identifiant de la demande de versement",
        },
        action: {
          label: "Action",
          description: "Action à effectuer sur la demande de versement",
        },
        adminNotes: {
          label: "Notes admin",
          description: "Notes facultatives pour cette action",
        },
        rejectionReason: {
          label: "Motif du refus",
          description: "Motif du refus de la demande de versement",
        },
      },
      widget: {
        empty: "Aucune demande de versement pour ces filtres",
        emptyHint: "Essayez un autre e-mail, statut ou mode.",
        results: "{{count}} résultats",
        clear: "Effacer les filtres",
        refresh: "Actualiser",
        loading: "Chargement des demandes de versement…",
        amount: "{{credits}} crédits gagnés · équivalent de {{value}} en USD",
        openPartner: "Ouvrir le compte partenaire",
        actionFor: "{{action}} le versement pour {{email}}",
        previous: "Page précédente",
        next: "Page suivante",
        page: "Page {{page}} sur {{total}}",
        confirmAction: "Confirmer l’action",
        lookupFailed: "Impossible de charger la demande de versement.",
        state: "Statut",
        valueLabel: "Montant demandé",
        destinationLabel: "Moyen de versement",
        actionSaved: "Action enregistrée.",
        approveDetail:
          "Après approbation, les crédits gagnés restent réservés à ce versement.",
        rejectDetail:
          "Le refus libère les crédits gagnés réservés à ce versement.",
        completeDetail:
          "Clôturez le versement après avoir effectué le transfert. Les crédits gagnés correspondants seront débités.",
        approve: "Approuver",
        reject: "Refuser",
        complete: "Finaliser",
        overBalanceSingle:
          "Cette demande est de {{amount}}, mais seulement {{available}} sont confirmés et non versés. Ne l'approuvez pas.",
        partnerNoCodes:
          "Aucun code propre · {{referred}} utilisateurs parrainés",
        overBalance:
          "{{count}} demandes ouvertes pour {{open}}, mais seulement {{available}} confirmés et non versés. Ne les approuvez pas toutes.",
        possibleDuplicate:
          "Doublon possible : {{count}} autre(s) demande(s) ouverte(s) avec le même montant et le même portefeuille.",
        overBalanceShort:
          "Au-delà du solde confirmé (voir la première demande de ce partenaire).",
        approveOverBalance: "Approuver quand même",
        subtitle:
          "Versements aux partenaires. Approuvez, envoyez le virement, puis marquez-le comme terminé.",
        tabAll: "Toutes",
        searchPlaceholder: "Rechercher l'e-mail du partenaire",
        flagOver: "Au-delà du solde confirmé",
        flagDuplicate: "Doublon possible ({{count}})",
        moreFor: "Plus d'actions pour {{email}}",
        rejectEllipsis: "Refuser…",
        freeLabel: "Disponible après demandes ouvertes",
        earnedLabel: "Gagné",
        earnedValue: "{{confirmed}} confirmé · {{pending}} en attente",
        paidLabel: "Déjà versé",
        codesLabel: "Codes",
        codesValue: "{{codes}} · {{referred}} utilisateurs parrainés",
        updatedLabel: "Dernière mise à jour",
        copy: "Copier",
        copied: "Copié",
        reference: "Référence de la demande",
        compactMeta: "{{method}} · {{date}}",
        showDetails: "Détails",
        hideDetails: "Masquer les détails",
        partnerScope: "Demandes de {{email}}",
        showAllPartners: "Voir tous les partenaires",
        loadFailed: "Impossible de charger les demandes de versement",
        retry: "Réessayer",
        emptyAll: "Aucune demande de versement pour l'instant",
        emptyAllHint:
          "Les partenaires demandent leurs versements depuis leur page de gains. Les nouvelles demandes arrivent ici pour validation.",
        showing: "{{from}} à {{to}} sur {{total}}",
        cancel: "Annuler",
        confirmApprove: "Approuver le versement",
        confirmReject: "Refuser le versement",
        confirmComplete: "Marquer le versement comme terminé",
        col: {
          partner: "Partenaire",
          requested: "Demandé le",
          method: "Mode",
          status: "Statut",
          amount: "Montant",
          actions: "Actions",
        },
        nextStep: {
          failed:
            "Le virement a échoué et aucun crédit n'a été déduit. Le partenaire peut soumettre une nouvelle demande.",
          processing:
            "Virement en cours. Il aboutit ou échoue seul, rien à faire.",
          credits:
            "Les versements en crédits sont convertis dès la demande : une demande en attente est donc bloquée. Refusez-la pour libérer les gains, le partenaire pourra en refaire une.",
        },
        prepareBill: "Préparer une facture fournisseur",
        codeReport: "Rapport du code",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Vos gains",
      titleShort: "Mes gains",
      description:
        "Consultez vos gains de parrainage et l'historique de vos versements",
    },
    post: {
      title: "Demander un versement",
      titleShort: "Demander un versement",
      description: "Retirer vos gains de parrainage",
    },
    fields: {
      amountCents: {
        label: "Montant (crédits)",
        description: "Montant à retirer, en crédits",
        placeholder: "ex. 5000",
      },
      currency: {
        label: "Mode de versement",
        description: "Comment vous voulez recevoir vos gains",
      },
      walletAddress: {
        label: "Adresse du portefeuille",
        description: "Obligatoire pour les versements en BTC ou USDC",
        placeholder: "Votre adresse de portefeuille",
      },
    },
    widget: {
      totalEarned: "Total gagné",
      available: "Disponible",
      locked: "Bloqué",
      credits:
        "Les versements en crédits sont convertis à la demande, une demande en attente est donc bloquée. Rejetez-la pour libérer les gains ; le partenaire peut redemander.",
      readyForPayout: "prêts pour un versement",
      moreToUnlock: "restants avant déblocage",
      pendingConfirmation: "en attente de confirmation",
      requestPayout: "Demander un versement",
      payoutHistory: "Historique des versements",
      noPayout: "Aucune demande de versement pour l'instant",
      howItWorksTitle: "Comment ça marche",
      step1Title: "Créez des codes de parrainage",
      step1Body:
        "Générez des codes uniques pour chaque audience : amis, réseaux sociaux ou campagnes.",
      step2Title: "Partagez votre lien, ou un lien de skill",
      step2Body:
        "Lien de parrainage : {{directPct}} de chaque paiement de cet utilisateur, à vie. Votre skill partagée par d'autres : {{skillBonusPct}} de chaque paiement de ces utilisateurs. Des revenus issus de liens que vous n'avez jamais publiés.",
      step3Title: "Soyez payé",
      step3Body:
        "Les gains se débloquent {{holdDays}} jours après chaque paiement, soit le délai de remboursement. Utilisez-les ensuite comme crédits de chat ou retirez-les en crypto.",
      withdrawTitle: "Retirez vos gains",
      withdrawDescription:
        "Plusieurs façons d'utiliser vos gains de parrainage",
      useAsCredits: "Utiliser en crédits de chat",
      useAsCreditsDesc:
        "Convertissez instantanément vos gains en crédits de chat pour vos conversations IA.",
      cryptoPayout: "Retirer en crypto",
      cryptoPayoutDesc:
        "Demandez un versement en BTC ou USDC sur votre adresse de portefeuille.",
      minimumNote:
        "Versement minimum : {{minPayout}}. Les versements en crypto sont traités sous {{cryptoPayoutHours}} heures après approbation.",
      progressLabel: "Progression vers le versement",
      unlockedOf: "débloqués sur",
      viewHistory: "Voir l'historique",
      historyEmpty: "Vos versements apparaîtront ici",
      pendingTitle: "{{amount}} en attente",
      pendingNote:
        "Déblocage {{holdDays}} jours après chaque paiement, soit le délai de remboursement. Un paiement remboursé annule les gains associés.",
    },
    email: {
      user: {
        subjectCrypto: "Demande de versement reçue",
        subjectCredits: "Crédits convertis",
        titleCrypto: "Votre demande de versement",
        titleCredits: "Crédits convertis",
        previewCrypto: "Votre demande de versement est en cours de traitement",
        previewCredits: "Vos crédits ont été convertis",
        bodyCrypto:
          "Nous avons bien reçu votre demande de versement. Les versements en crypto sont traités sous {{cryptoPayoutHours}} heures après approbation par un admin.",
        bodyCredits:
          "Vos gains de parrainage ont été convertis instantanément en crédits de chat et ajoutés à votre compte.",
        followUpCrypto:
          "Vous recevrez un autre e-mail une fois votre versement traité.",
        labelAmount: "Montant",
        labelMethod: "Mode",
        labelWallet: "Portefeuille",
        credits: "crédits",
      },
      admin: {
        subject: "Nouvelle demande de versement",
        title: "Nouvelle demande de versement",
        preview: "Demande de versement soumise",
        body: "Un utilisateur a soumis une demande de versement.",
        footer:
          "Vérifiez et traitez cette demande dans le panneau d'administration.",
        labelUser: "Utilisateur",
        labelAmount: "Montant",
        labelCurrency: "Devise",
        labelWallet: "Portefeuille",
        credits: "crédits",
      },
    },
    errors: {
      minimumAmount: "Le montant minimum de versement est de {{minPayout}}",
      walletRequired:
        "L'adresse du portefeuille est obligatoire pour les versements en crypto",
      insufficientBalance: "Solde insuffisant pour ce versement",
      conversionFailed:
        "La conversion a échoué. Vos gains sont intacts. Réessayez dans une minute.",
      notFound: "Demande de versement introuvable",
      invalidStatus:
        "Statut de la demande de versement invalide pour cette opération",
    },
    success: {
      creditsConverted: "Crédits convertis",
      payoutRequested:
        "Demande de versement envoyée. Traitement sous {{hours}} heures.",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres du code de parrainage invalides",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur de connexion réseau",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    forbidden: {
      title: "Interdit",
      description: "Accès interdit",
    },
    notFound: {
      title: "Introuvable",
      description: "Code de parrainage introuvable",
    },
    not_found: "Code de parrainage introuvable",
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
    },
    serverError: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
      detail: "Un problème est survenu de notre côté : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Ce code de parrainage existe déjà",
    },
    code_exists: "Ce code de parrainage existe déjà",
    code_expired: "Ce code de parrainage a expiré",
    code_inactive: "Ce code de parrainage n'est pas actif",
    max_uses_reached:
      "Ce code de parrainage a atteint son nombre maximal d'utilisations",
    invalid_code: "Code de parrainage invalide",
  },

  // Success types
  success: {
    title: "Succès",
    description: "Opération réussie",
    code_created: "Code de parrainage créé",
    code_updated: "Code de parrainage mis à jour",
    code_deactivated: "Code de parrainage désactivé",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Abonnement",
      creditPack: "Pack de crédits",
    },
    earningStatus: {
      pending: "En attente",
      confirmed: "Confirmé",
      canceled: "Annulé",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Crédits",
    },
    payoutStatus: {
      pending: "En attente",
      processing: "En cours",
      completed: "Terminé",
      failed: "Échoué",
      rejected: "Refusé",
      approved: "Approuvé",
    },
  },
};
