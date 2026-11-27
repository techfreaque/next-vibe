import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Créer un paiement d'abonnement",
    description: "Créer une session de paiement Stripe pour un abonnement",
    category: "Abonnement",

    // Tags
    tags: {
      subscription: "abonnement",
      checkout: "paiement",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Configuration du paiement",
      description: "Configurer les paramètres de la session de paiement",
      fields: {
        planId: {
          label: "Formule d'abonnement",
          description: "Choisissez la formule d'abonnement",
          placeholder: "Choisir une formule",
        },
        billingInterval: {
          label: "Périodicité de facturation",
          description: "Choisissez la fréquence de facturation",
          placeholder: "Choisir la périodicité",
        },
        provider: {
          label: "Prestataire de paiement",
          description: "Choisissez comment payer",
          placeholder: "Choisir un prestataire de paiement",
        },
        metadata: {
          label: "Métadonnées",
          description:
            "Métadonnées supplémentaires pour la session de paiement",
          placeholder: "Saisissez les métadonnées en JSON",
        },
      },
    },

    // Response fields
    response: {
      success: "Session de paiement créée",
      sessionId: "ID de session Stripe",
      checkoutUrl: "URL de paiement",
      message: "Message de statut",
    },

    // Error types
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
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
        description: "Ressource introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur est survenue",
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
        description: "Un conflit de données est survenu",
      },
    },

    // Success types
    success: {
      title: "Succès",
      description: "Session de paiement créée",
    },

    // POST endpoint specific translations
    post: {
      title: "Créer une session de paiement",
      description: "Créer une nouvelle session de paiement d'abonnement",
      form: {
        title: "Configuration de la session de paiement",
        description: "Configurer les paramètres de la session de paiement",
      },
      response: {
        title: "Réponse du paiement",
        description: "Données de réponse de la session de paiement",
      },
      errors: {
        alreadySubscribed: {
          title: "Déjà abonné",
          description: "Vous avez déjà un abonnement actif",
        },
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de paiement invalides",
          reason: {
            enterpriseCustomPricing:
              "La formule ENTERPRISE nécessite un tarif sur mesure",
          },
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
          description: "Session de paiement introuvable",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur est survenue",
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
          description: "Un conflit de données est survenu",
        },
      },
      success: {
        title: "Succès",
        description: "Session de paiement créée",
      },
    },

    // General error message
    error: "Une erreur est survenue pendant le paiement",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Mensuel",
      yearly: "Annuel",
    },
  },

  // Main subscription domain
  category: "Facturation",

  // Tags
  tags: {
    subscription: "abonnement",
    billing: "facturation",
    get: "consulter",
    create: "créer",
    update: "modifier",
    cancel: "résilier",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Formule Starter",
    },
    professional: {
      title: "Formule Professional",
    },
    premium: {
      title: "Formule Premium",
    },
    enterprise: {
      title: "Formule Enterprise",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Mensuel",
    yearly: "Annuel",
  },

  // GET endpoint
  get: {
    title: "Voir l'abonnement",
    titleShort: "Mon abonnement",
    description: "Récupérer les détails de l'abonnement actuel",
    form: {
      title: "Détails de l'abonnement",
      description: "Consultez les informations de votre abonnement actuel",
    },
  },

  // POST endpoint
  post: {
    title: "Créer un abonnement",
    titleShort: "Créer une session",
    description: "Créer un nouvel abonnement",
    form: {
      title: "Création d'abonnement",
      description: "Créer un nouvel abonnement avec la formule choisie",
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez les détails de votre abonnement et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Connexion impossible. Vérifiez votre connexion Internet",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour créer un abonnement",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de créer un abonnement",
      },
      notFound: {
        title: "Formule introuvable",
        description: "La formule d'abonnement choisie est introuvable",
      },
      server: {
        title: "Un problème est survenu",
        description: "Nous n'avons pas pu créer votre abonnement. Réessayez",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème inattendu est survenu. Réessayez",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Abonnement existant",
        description: "Vous avez déjà un abonnement actif",
      },
    },
    success: {
      title: "Abonnement créé",
      description: "Votre abonnement est activé",
    },
  },

  // PUT endpoint
  put: {
    title: "Modifier l'abonnement",
    titleShort: "Modifier l'abo",
    description: "Modifier un abonnement existant",
    form: {
      title: "Modification de l'abonnement",
      description: "Modifiez votre formule ou votre périodicité de facturation",
    },
    errors: {
      validation: {
        title: "Modification invalide",
        description: "Vérifiez vos modifications et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Impossible d'enregistrer vos modifications. Réessayez",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour modifier votre abonnement",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de modifier cet abonnement",
      },
      notFound: {
        title: "Abonnement introuvable",
        description: "Nous n'avons pas trouvé l'abonnement à modifier",
      },
      server: {
        title: "Échec de la modification",
        description:
          "Nous n'avons pas pu enregistrer vos modifications. Réessayez",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème inattendu est survenu. Réessayez",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Conflit de modification",
        description:
          "Votre abonnement a changé. Actualisez la page et réessayez",
      },
    },
    submit: {
      label: "Modifier l'abonnement",
      loading: "Modification en cours...",
    },
    success: {
      title: "Abonnement modifié",
      description: "Votre abonnement a été mis à jour",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Résilier l'abonnement",
    titleShort: "Résilier l'abo",
    description: "Résilier votre abonnement",
    warning:
      "Si vous résiliez, votre accès prendra fin à la fin de la période de facturation.",
    form: {
      title: "Résiliation de l'abonnement",
      description: "Résiliez votre abonnement, avec options facultatives",
    },
    errors: {
      validation: {
        title: "Requête invalide",
        description: "Vérifiez les détails de la résiliation et réessayez",
      },
      network: {
        title: "Erreur de connexion",
        description: "Impossible de traiter la résiliation. Réessayez",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour résilier votre abonnement",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de résilier cet abonnement",
      },
      notFound: {
        title: "Abonnement introuvable",
        description: "Nous n'avons pas trouvé l'abonnement à résilier",
      },
      server: {
        title: "Échec de la résiliation",
        description: "Nous n'avons pas pu résilier votre abonnement. Réessayez",
      },
      unknown: {
        title: "Erreur inattendue",
        description: "Un problème inattendu est survenu. Réessayez",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Conflit de résiliation",
        description:
          "Le statut de votre abonnement a changé. Actualisez la page et réessayez",
      },
    },
    submit: {
      label: "Résilier l'abonnement",
      loading: "Résiliation en cours...",
    },
    success: {
      title: "Abonnement résilié",
      description: "Votre abonnement a été résilié",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Formule d'abonnement",
        description: "Choisissez votre formule d'abonnement",
        placeholder: "Choisir une formule",
      },
      billingInterval: {
        label: "Périodicité de facturation",
        description: "Choisissez la fréquence de facturation",
        placeholder: "Choisir la périodicité",
      },
      provider: {
        label: "Prestataire de paiement",
        description: "Choisissez votre prestataire de paiement",
      },
      catalogProductId: {
        label: "Produit du catalogue",
        description: "Lier un produit du catalogue à cet abonnement",
      },
      cancelAtPeriodEnd: {
        label: "Résilier en fin de période",
        description: "Résilier l'abonnement à la fin de la période en cours",
      },
      reason: {
        label: "Motif de résiliation",
        description: "Indiquez le motif de la résiliation",
        placeholder: "Saisissez le motif de résiliation",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "URL de paiement",
    sessionId: "ID de session",
    hasSubscription: "A un abonnement",
    id: "ID d'abonnement",
    userId: "ID utilisateur",
    status: "Statut de l'abonnement",
    planId: "ID de formule",
    billingInterval: "Périodicité de facturation",
    currentPeriodStart: "Début de la période en cours",
    currentPeriodEnd: "Fin de la période en cours",
    cancelAtPeriodEnd: "Résiliation en fin de période",
    cancelAt: "Résiliation le",
    canceledAt: "Résilié le",
    endedAt: "Terminé le",
    checkoutProviders: "Moyens de paiement disponibles",
    nowPaymentsAcceptsCards: "Le paiement crypto accepte les cartes",
    trialStart: "Début de l'essai",
    trialEnd: "Fin de l'essai",
    success: "Opération réussie",
    message: "Message de statut",
    subscriptionId: "ID d'abonnement",
    stripeCustomerId: "ID client Stripe",
    updatedFields: "Champs modifiés",
    endsAt: "Se termine le",
    createdAt: "Créé le",
    updatedAt: "Modifié le",
    provider: "Prestataire de paiement",
    providerSubscriptionId: "ID d'abonnement chez le prestataire",
  },

  // Error types
  errors: {
    tierChange: {
      notActive:
        "Votre formule n'est pas active. Démarrez une nouvelle formule.",
      cryptoNotSupported:
        "Une formule payée en crypto ne change pas en cours de période. Choisissez la nouvelle quand celle-ci se termine.",
      paymentRequired:
        "Votre banque demande une confirmation pour la mise à niveau. Ouvrez la facture pour la terminer : {{url}}",
      failed: "Le changement de formule a échoué : {{error}}",
      upgraded:
        "Passage à {{plan}}. {{credits}} crédits en plus pour cette période.",
      changed: "Formule changée : {{plan}}.",
      downgraded:
        "Passage à {{plan}} au prochain renouvellement. Vous gardez vos crédits actuels jusque-là.",
      unchanged: "Vous avez déjà cette formule.",
    },
    validation: {
      title: "Erreur de validation",
      description: "Paramètres d'abonnement invalides",
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
      description: "Abonnement introuvable",
    },
    not_found: "Abonnement introuvable",
    not_found_description: "L'abonnement demandé est introuvable",
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
    },
    serverError: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    use_checkout_flow:
      "Passez par le parcours de paiement pour souscrire un abonnement",
    use_checkout_flow_description:
      "La création directe d'abonnement n'est pas autorisée. Passez par le parcours de paiement.",
    conflict: {
      title: "Conflit",
      description: "Un conflit de données est survenu",
    },
    sync_failed:
      "Impossible de synchroniser l'abonnement avec la base de données",
    database_error: "Erreur de base de données : {{error}}",
    create_crashed: "La création de l'abonnement a échoué",
    cancel_failed: "Impossible de résilier l'abonnement : {{error}}",
    user_not_found: "Utilisateur introuvable",
    stripe_customer_creation_failed: "Impossible de créer le client Stripe",
    not_implemented_on_native:
      "{{method}} n'est pas disponible sur la plateforme native. Utilisez la version web pour cette opération.",
    no_provider_id: "Aucun ID de prestataire de paiement trouvé",
  },

  sync: {
    failed: "Impossible de synchroniser l'abonnement : {{error}}",
    stripe_error: "Erreur de synchronisation Stripe : {{error}}",
    success: "Abonnement synchronisé",
  },

  // Cancel operation
  cancel: {
    success: "Abonnement résilié",
  },

  // Success types
  success: {
    title: "Succès",
    description: "Opération terminée",
  },

  // Status translations
  status: {
    incomplete: "Incomplet",
    incomplete_expired: "Incomplet expiré",
    trialing: "En essai",
    active: "Actif",
    pastDue: "Paiement en retard",
    canceled: "Résilié",
    unpaid: "Impayé",
    paused: "En pause",
  },

  // Email translations
  email: {
    success: {
      headline: "C'est parti. Pas de filtres, pas de sermons.",
      subject: "Votre abonnement {{appName}} est actif",
      previewText:
        "{{privateName}}, c'est activé. {{subscriptionCredits}} crédits/mois, {{modelCount}} modèles, zéro restriction.",
      activeBadge: "Actif",
      greeting: "Bonjour {{privateName}},",
      intro:
        "Votre abonnement {{appName}} est confirmé et prêt. Vous disposez de {{subscriptionCredits}} crédits chaque mois sur tous les modèles. Pas de plafond quotidien, pas de filtre de contenu, aucune justification à donner.",
      models: {
        title: "{{modelCount}} modèles, 3 catégories",
        mainstream: "Grand public",
        open: "Open source",
        uncensored: "Non censurés",
      },
      included: {
        title: "Ce que vous recevez chaque mois :",
        credits:
          "{{subscriptionCredits}} crédits par mois (renouvelés automatiquement)",
        models: "Accès aux {{modelCount}} modèles d'IA",
        nolimits:
          "Pas de limite quotidienne : utilisez vos crédits quand vous voulez",
        uncensored: "Des modèles non censurés, sans filtre de contenu",
        packs: "Des packs de crédits en plus, qui n'expirent jamais",
        cancel: "Résiliable à tout moment, sans justification",
      },
      cta: "Commencer à discuter",
      packs: {
        title: "Besoin de plus de crédits ?",
        description:
          "À court avant le renouvellement ? Rechargez quand vous voulez : {{packPrice}} les {{packCredits}} crédits. Les packs n'expirent jamais et s'ajoutent à vos crédits mensuels.",
        cta: "Acheter un pack de crédits",
      },
      manage: "Gérez ou résiliez votre abonnement à tout moment dans",
      manageLink: "les paramètres de votre compte",
      signoff: "Bonnes discussions,\nL'équipe {{appName}}",
    },
    admin_notification: {
      title: "Nouvel abonnement",
      subject: "Nouvel abonnement : {{planName}}",
      preview: "Nouvel abonnement : {{userName}} a souscrit à {{planName}}",
      message: "Un nouvel utilisateur s'est abonné à {{appName}}.",
      details: "Détails de l'abonnement",
      user_name: "Nom de l'utilisateur",
      user_email: "E-mail de l'utilisateur",
      plan: "Formule",
      status: "Statut",
      contact_user: "Contacter l'utilisateur",
      footer: "Ceci est une notification automatique de {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "E-mail de confirmation d'abonnement",
      description:
        "E-mail de confirmation envoyé quand un utilisateur active un abonnement",
      category: "abonnement",
      preview: {
        privateName: {
          label: "Nom de l'utilisateur",
          description: "Le nom affiché de l'utilisateur",
        },
        userId: {
          label: "ID utilisateur",
          description: "L'identifiant unique de l'utilisateur",
        },
        leadId: {
          label: "ID du lead",
          description: "L'identifiant du lead associé",
        },
        planName: {
          label: "Nom de la formule",
          description: "Le nom de la formule d'abonnement",
        },
      },
    },
    adminNotification: {
      name: "Notification admin d'abonnement",
      description:
        "Notification interne envoyée aux admins quand un utilisateur s'abonne",
      category: "admin",
      preview: {
        privateName: {
          label: "Nom de l'utilisateur",
        },
        publicName: {
          label: "Nom public",
        },
        email: {
          label: "E-mail de l'utilisateur",
        },
        planName: {
          label: "Nom de la formule",
        },
        statusName: {
          label: "Statut de l'abonnement",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Retour",
    confirm: {
      title: "Résilier votre abonnement ?",
      description:
        "Votre accès prendra fin à la fin de la période de facturation. Impossible d'annuler.",
      cancel: "Garder l'abonnement",
      proceed: "Oui, résilier",
    },
  },

  // Widget display keys
  title: "Votre abonnement",
  description: "Gérez votre abonnement et votre facturation",
  notAvailable: "N/D",
  canceledOn: "Résilié le",
  endedOn: "Terminé le",
  billingInterval: "Périodicité de facturation",
  currentPeriodStart: "Début de la période en cours",
  endsOn: "Se termine le",
  nextBillingDate: "Prochaine facturation",
  cancellation: {
    title: "Résiliation programmée",
    description:
      "Votre abonnement sera résilié le {{date}}. Vous gardez l'accès jusque-là.",
  },
  canceled: {
    title: "Abonnement terminé",
    description:
      "Votre abonnement est terminé. Renouvelez-le pour retrouver toutes les fonctionnalités.",
  },
  noSubscription: {
    title: "Pas encore d'abonnement",
    description:
      "Abonnez-vous pour débloquer des crédits mensuels et l'accès à tous les modèles.",
    cta: "Voir les formules",
  },
  manage: {
    nowpayments: {
      info: "Contactez le support pour gérer votre abonnement NowPayments.",
      button: "Gérer l'abonnement",
    },
    stripe: {
      button: "Gérer l'abonnement",
    },
    portal: {
      error: "Impossible d'ouvrir l'espace client. Réessayez.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Incomplet",
      incompleteExpired: "Incomplet expiré",
      trialing: "En essai",
      active: "Actif",
      pastDue: "Paiement en retard",
      canceled: "Résilié",
      unpaid: "Impayé",
      paused: "En pause",
      canceling: "Résiliation en cours",
    },
    billing: {
      monthly: "Mensuel",
      yearly: "Annuel",
    },
    cancellation: {
      tooExpensive: "Trop cher",
      missingFeatures: "Fonctionnalités manquantes",
      switchingService: "Changement de service",
      temporaryPause: "Pause temporaire",
      other: "Autre",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} crédits",
      note: "Recharge unique. N'expirent jamais.",
      aria: "Acheter {{credits}} crédits pour {{price}}, paiement unique",
    },
    plan: {
      title: "{{credits}} crédits / mois",
      note: "{{plan}}. Sans engagement.",
      perMonth: "/mois",
      aria: "Démarrer {{plan}} : {{credits}} crédits chaque mois pour {{price}}",
    },
    upgrade: {
      title: "Passer à {{plan}}",
      note: "{{credits}} crédits / mois",
      aria: "Passer à {{plan}} : {{credits}} crédits chaque mois pour {{price}}",
      confirm:
        "Vous payez maintenant la différence pour le reste de la période. Les crédits en plus arrivent tout de suite.",
      confirmButton: "Confirmer",
      cancel: "Annuler",
      working: "Changement en cours...",
    },
    opening: "Ouverture du paiement...",
    secure: "Carte, PayPal, Apple Pay, Google Pay via Stripe.",
    allPlans: "Toutes les formules et la crypto",
    moreOptions: "Crypto et autres options",
    error: "Le paiement ne s'est pas ouvert. Réessayez.",
  },
  tiers: {
    examples: {
      heading: "Ce que {{credits}} crédits par mois vous offrent",
      subheading: "Messages par mois avec quelques modèles populaires.",
      perMessage: "env. {{credits}} crédits par message",
      messages: "env. {{amount}} messages",
      note: "Estimation pour un message typique : {{input}} tokens en entrée (votre conversation jusqu’ici) et {{output}} en sortie. Les conversations courtes coûtent moins, les longues et les fichiers coûtent plus.",
    },
    faq: {
      heading: "Questions avant de payer",
      credit: {
        question: "Combien vaut un crédit ?",
        answer:
          "Un crédit vaut {{unitPrice}}. Les modèles légers coûtent moins d’un crédit par message, les meilleurs quelques crédits. Les exemples ci-dessus utilisent les vrais prix des modèles.",
      },
      unused: {
        question: "Que deviennent les crédits non utilisés ?",
        answer:
          "Les crédits de la formule couvrent votre mois de facturation et se rechargent au renouvellement. Les packs de crédits n’expirent jamais.",
      },
      cancel: {
        question: "Puis-je résilier ?",
        answer:
          "Oui, à tout moment, ici même. Vous gardez votre formule et ses crédits jusqu’à la fin de la période payée.",
      },
      free: {
        question: "Qu’est-ce qui reste gratuit ?",
        answer:
          "Les visiteurs reçoivent {{freeCreditsGuest}} crédits par mois. Un compte gratuit en reçoit {{freeCreditsSignedIn}}, et {{freeCreditsMax}} avec un abonnement confirmé à la newsletter. Sans carte.",
      },
      api: {
        question: "Une formule débloque-t-elle l’API ?",
        answer:
          "Oui. Toute formule ou tout pack de crédits débloque les clés API pour les clients compatibles OpenAI et Anthropic. Les crédits gratuits, non.",
      },
      pay: {
        question: "Comment payer ?",
        answer: "Par carte ou PayPal via Stripe, ou en crypto via NOWPayments.",
      },
      more: "Plus de réponses dans le centre d’aide",
    },
    heading: "Choisissez votre formule",
    subheading:
      "Des crédits neufs chaque mois pour les {{modelCount}} modèles. Sans engagement.",
    changeHeading: "Changer de formule",
    changeSubheading: "Vous êtes sur {{plan}} : {{credits}} crédits par mois.",
    recommended: "Recommandé",
    current: "Votre formule",
    perMonth: "/ mois",
    perYear: "/ an",
    creditsPerMonth: "crédits / mois",
    yearlyEquivalent: "{{monthlyPrice}} / mois en facturation annuelle",
    picked: "{{plan}} : {{credits}} crédits chaque mois",
    pickedNote:
      "Les {{modelCount}} modèles. Crédits renouvelés chaque mois. Sans engagement.",
    cta: {
      start: "Choisir {{plan}}",
      upgrade: "Passer à {{plan}}",
      downgrade: "Passer à {{plan}} au renouvellement",
      intervalYearly: "Passer en facturation annuelle",
      intervalMonthly: "Passer à {{plan}} en mensuel",
      current: "Votre formule actuelle",
    },
    signInHint: "Créez un compte gratuit pour démarrer une formule.",
    cryptoHint:
      "Payer en crypto ? Plus, Pro et Ultra au mois ou à l'année, Starter à l'année.",
    confirm: {
      upgradeTitle: "Passer à {{plan}} ?",
      upgradeBody:
        "Vous payez maintenant la différence pour le reste de la période, et les crédits en plus arrivent tout de suite. Dès le prochain renouvellement : {{price}} par mois pour {{credits}} crédits.",
      upgradeButton: "Payer et changer",
      downgradeTitle: "Passer à {{plan}} ?",
      downgradeBody:
        "Prend effet à votre prochain renouvellement, le {{date}}. D'ici là, vous gardez votre formule et vos crédits. Ensuite : {{price}} par mois pour {{credits}} crédits.",
      downgradeButton: "Changer au renouvellement",
      intervalTitle: "Changer de facturation ?",
      intervalBody:
        "Votre période de facturation repart aujourd'hui et Stripe règle la différence au prorata. Nouvelle formule : {{plan}}, {{price}}{{period}}, {{credits}} crédits par mois.",
      intervalButton: "Changer la facturation",
      cancel: "Pas maintenant",
      working: "Changement en cours...",
    },
    packsLocked: {
      title: "Packs de crédits : {{price}} les {{credits}} crédits",
      body: "Les packs rechargent une formule active. Démarrez une formule, puis ajoutez des packs quand vous êtes à court. Ils n'expirent jamais.",
    },
    topUp: {
      heading: "Recharger",
      subheading:
        "À court avant le renouvellement ? Les packs s'ajoutent à votre formule et n'expirent jamais.",
    },
  },
  buy: {
    provider: {
      stripe: "Carte, PayPal et portefeuilles",
      stripeDescription: "Carte, PayPal, Apple Pay, Google Pay via Stripe",
      nowpayments: "Crypto (NowPayments)",
      nowpaymentsDescription: "Payez en Bitcoin, Ethereum et plus encore",
      cryptoMonthlyDisabled:
        "Starter se paie en crypto à l'année. Plus, Pro et Ultra se paient aussi en crypto au mois.",
    },
    login: "Se connecter",
    signup: "S'inscrire gratuitement",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Abonnement",
      description: "Gérez votre abonnement et votre facturation",
    },
    buyCredits: {
      title: "Acheter des crédits",
      description: "Achetez des crédits supplémentaires pour votre compte",
    },
    history: {
      title: "Historique de facturation",
      description: "Consultez l'historique de vos factures et transactions",
    },
    overview: {
      title: "Vue d'ensemble de l'abonnement",
      description: "Consultez le statut et les détails de votre abonnement",
    },
  },
};
