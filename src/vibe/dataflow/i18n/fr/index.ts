import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minute",
      "3m": "3 minutes",
      "5m": "5 minutes",
      "15m": "15 minutes",
      "30m": "30 minutes",
      "1h": "1 heure",
      "4h": "4 heures",
      "1d": "1 jour",
      "1w": "1 semaine",
      "1M": "1 mois",
    },
    runStatus: {
      running: "En cours",
      completed: "Terminé",
      failed: "Échoué",
    },
    backtestActionMode: {
      simulate: "Simuler",
      execute: "Exécuter",
    },
    graphOwnerType: {
      system: "Système",
      admin: "Admin",
      user: "Utilisateur",
    },
    triggerType: {
      manual: "Manuel",
      cron: "Planifié",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "Source", description: "Série temporelle d'entrée" },
    resolution: { label: "Résolution", description: "Intervalle de calcul" },
    range: { label: "Période", description: "Période à calculer" },
    lookback: {
      label: "Historique",
      description:
        "Barres supplémentaires avant le début de la période, pour l'amorçage",
    },
    result: { label: "Résultat", description: "Série temporelle de sortie" },
    meta: { label: "Méta", description: "Métadonnées d'exécution du nœud" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytique",
    pipeline: "pipeline",
  },

  // Graph list
  graphs: {
    list: {
      title: "Graphes de pipeline",
      description: "Lister tous les graphes visibles par l'utilisateur actuel",
      container: {
        title: "Graphes",
        description: "Tous les graphes de pipeline",
      },
      response: {
        graphs: "Graphes",
      },
      success: {
        title: "Graphes chargés",
        description: "Graphes de pipeline récupérés avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger les graphes",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Requête invalide",
        },
        notFound: { title: "Introuvable", description: "Aucun graphe trouvé" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    create: {
      title: "Créer un graphe",
      description: "Créer un nouveau graphe de pipeline",
      fields: {
        name: {
          label: "Nom",
          description: "Nom d'affichage du graphe",
          placeholder: "Mon graphe",
        },
        slug: {
          label: "Slug",
          description: "Identifiant unique",
          placeholder: "mon-graphe",
        },
        description: {
          label: "Description",
          description: "Description facultative",
          placeholder: "",
        },
        config: {
          label: "Configuration",
          description: "Configuration DAG du graphe",
        },
      },
      response: {
        id: "ID du graphe",
      },
      success: {
        title: "Graphe créé",
        description: "Graphe de pipeline créé avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de créer le graphe",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Configuration du graphe invalide",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: {
          title: "Conflit",
          description: "Ce slug de graphe existe déjà",
        },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    get: {
      title: "Obtenir un graphe",
      description: "Récupérer un graphe précis par son ID",
      fields: {
        id: {
          label: "ID du graphe",
          description: "UUID de la version du graphe",
        },
      },
      response: {
        graph: "Graphe",
      },
      success: {
        title: "Graphe chargé",
        description: "Graphe récupéré avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de charger le graphe",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "ID invalide",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    edit: {
      title: "Modifier le graphe",
      description:
        "Créer une branche d'un graphe et la modifier (crée une nouvelle version, ne modifie jamais l'existante)",
      fields: {
        id: {
          label: "ID du graphe",
          description: "UUID de la version à partir de laquelle brancher",
        },
        config: {
          label: "Configuration",
          description: "Nouvelle configuration du graphe",
        },
        name: { label: "Nom", description: "Nouveau nom" },
        description: {
          label: "Description",
          description: "Nouvelle description",
        },
      },
      response: {
        id: "ID de la nouvelle version",
      },
      success: {
        title: "Branche du graphe créée",
        description: "Nouvelle version du graphe créée avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de modifier le graphe",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Configuration invalide",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    promote: {
      title: "Promouvoir en système",
      description:
        "Promouvoir un graphe admin en graphe système (lecture seule, partagé)",
      fields: {
        id: {
          label: "ID du graphe",
          description: "UUID du graphe à promouvoir",
        },
      },
      response: {
        id: "ID du graphe",
      },
      success: {
        title: "Graphe promu",
        description: "Graphe promu en système avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Impossible de promouvoir le graphe",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "ID invalide",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    trigger: {
      title: "Déclencher le graphe",
      description: "Déclencher manuellement l'exécution du graphe à la demande",
      fields: {
        id: {
          label: "ID du graphe",
          description: "UUID du graphe à déclencher",
        },
        rangeFrom: {
          label: "Du",
          description: "Début de la période (date ISO)",
        },
        rangeTo: { label: "Au", description: "Fin de la période (date ISO)" },
      },
      response: {
        nodeCount: "Nœuds exécutés",
        errorCount: "Erreurs",
        errors: "Erreurs",
      },
      success: {
        title: "Graphe exécuté",
        description: "Le graphe s'est exécuté avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "L'exécution du graphe a échoué",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Paramètres invalides",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    backtest: {
      title: "Lancer un backtest",
      description:
        "Lancer un backtest sur une période historique (actions simulées)",
      fields: {
        id: {
          label: "ID du graphe",
          description: "UUID de la version du graphe",
        },
        rangeFrom: {
          label: "Du",
          description: "Début de la période du backtest",
        },
        rangeTo: { label: "Au", description: "Fin de la période du backtest" },
        resolution: {
          label: "Résolution",
          description: "Intervalle de temps pour l'évaluation",
        },
      },
      response: {
        runId: "ID de l'exécution",
        eligible: "Éligible",
        ineligibleNodes: "Nœuds non éligibles",
      },
      success: {
        title: "Backtest terminé",
        description: "Le backtest s'est exécuté avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Le backtest a échoué",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Paramètres invalides",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    data: {
      title: "Données du graphe",
      description:
        "Récupérer les séries temporelles d'un graphe (exécution à la demande)",
      fields: {
        id: { label: "ID du graphe", description: "UUID du graphe" },
        rangeFrom: { label: "Du", description: "Début de la période" },
        rangeTo: { label: "Au", description: "Fin de la période" },
      },
      response: {
        series: "Séries",
        signals: "Signaux",
      },
      success: {
        title: "Données chargées",
        description: "Données du graphe récupérées avec succès",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Accès refusé", description: "Accès refusé" },
        server: {
          title: "Erreur serveur",
          description: "Impossible de récupérer les données",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Paramètres invalides",
        },
        notFound: { title: "Introuvable", description: "Graphe introuvable" },
        conflict: { title: "Conflit", description: "Conflit de ressources" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description:
        "Moyenne mobile exponentielle : pondère davantage les prix récents",
      input: { source: { label: "Source" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "Période", description: "Nombre de périodes (1–500)" },
      },
    },
    rsi: {
      description: "Indice de force relative : oscillateur de momentum (0–100)",
      input: { source: { label: "Source" } },
      output: { value: { label: "RSI" } },
      params: {
        period: {
          label: "Période",
          description: "Périodes d'historique (2–100)",
        },
      },
    },
    bollinger: {
      description:
        "Bandes de Bollinger : enveloppe de volatilité autour d'une moyenne mobile",
      input: { source: { label: "Source" } },
      output: {
        upper: { label: "Bande supérieure" },
        middle: { label: "Bande médiane" },
        lower: { label: "Bande inférieure" },
      },
      params: {
        period: {
          label: "Période",
          description: "Période de la moyenne mobile",
        },
        stdDev: {
          label: "Écart-type",
          description: "Multiplicateur de l'écart-type",
        },
      },
    },
    macd: {
      description: "MACD : indicateur de momentum qui suit la tendance",
      input: { source: { label: "Source" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signal" },
        histogram: { label: "Histogramme" },
      },
      params: {
        fastPeriod: {
          label: "Période rapide",
          description: "Période de l'EMA rapide",
        },
        slowPeriod: {
          label: "Période lente",
          description: "Période de l'EMA lente",
        },
        signalPeriod: {
          label: "Période du signal",
          description: "Période de l'EMA du signal",
        },
      },
    },
    ratio: {
      description: "Calcule A / B pour chaque horodatage",
      input: { a: { label: "Numérateur" }, b: { label: "Dénominateur" } },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Variation d'une période à l'autre",
      input: { source: { label: "Source" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Borne les valeurs à [min, max]",
      input: { source: { label: "Source" } },
      output: { value: { label: "Borné" } },
      params: {
        min: { label: "Min", description: "Borne inférieure" },
        max: { label: "Max", description: "Borne supérieure" },
      },
    },
    windowAvg: {
      description: "Moyenne glissante sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Moy." } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowSum: {
      description: "Somme glissante sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Somme" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowMin: {
      description: "Minimum glissant sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowMax: {
      description: "Maximum glissant sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "Nombre de nouveaux leads créés par minute",
      output: { value: { label: "Leads créés" } },
    },
    leadsConverted: {
      description: "Nombre de leads convertis en utilisateurs par minute",
      output: { value: { label: "Leads convertis" } },
    },
    leadsActive: {
      description: "Nombre total de leads actifs (instantané quotidien)",
      output: { value: { label: "Leads actifs" } },
    },
    leadsBounced: {
      description: "Nombre de rebonds d'e-mails de leads par minute",
      output: { value: { label: "Leads en rebond" } },
    },
    leadsEngagements: {
      description:
        "Total des événements d'engagement des leads (ouvertures + clics) par minute",
      output: { value: { label: "Engagements des leads" } },
    },
    leadsEmailsSent: {
      description: "Nombre d'e-mails de campagne envoyés par minute",
      output: { value: { label: "E-mails envoyés" } },
    },
    leadsUnsubscribed: {
      description: "Nombre de leads désabonnés par minute",
      output: { value: { label: "Leads désabonnés" } },
    },
    leadsEmailOpens: {
      description: "Nombre d'ouvertures d'e-mails suivies par minute",
      output: { value: { label: "Ouvertures d'e-mails" } },
    },
    leadsEmailClicks: {
      description: "Nombre de clics sur des liens d'e-mails suivis par minute",
      output: { value: { label: "Clics dans les e-mails" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Total des leads avec un abonnement newsletter confirmé (instantané quotidien)",
      output: { value: { label: "Abonnés newsletter" } },
    },
    leadsWebsiteUsers: {
      description:
        "Total des leads au statut utilisateur du site (instantané quotidien)",
      output: { value: { label: "Utilisateurs du site" } },
    },
    leadsCampaignRunning: {
      description:
        "Total des leads actuellement dans une campagne e-mail active (instantané quotidien)",
      output: { value: { label: "En campagne" } },
    },
    leadsInContact: {
      description:
        "Total des leads actuellement au statut « en contact » (instantané quotidien)",
      output: { value: { label: "En contact" } },
    },
    leadsWebsiteVisits: {
      description:
        "Nombre d'événements d'engagement « visite du site » par minute",
      output: { value: { label: "Visites du site" } },
    },
    leadsFormSubmits: {
      description:
        "Nombre d'événements d'engagement « envoi de formulaire » par minute",
      output: { value: { label: "Formulaires envoyés" } },
    },
    usersRegistered: {
      description: "Nombre de nouvelles inscriptions par minute",
      output: { value: { label: "Utilisateurs inscrits" } },
    },
    usersActiveTotal: {
      description:
        "Nombre total d'utilisateurs actifs vérifiés (instantané quotidien)",
      output: { value: { label: "Utilisateurs actifs" } },
    },
    usersBanned: {
      description: "Nombre d'utilisateurs bannis par minute (approximatif)",
      output: { value: { label: "Utilisateurs bannis" } },
    },
    usersEmailVerified: {
      description:
        "Total des utilisateurs avec e-mail vérifié (instantané quotidien)",
      output: { value: { label: "E-mail vérifié" } },
    },
    usersMarketingConsent: {
      description:
        "Total des utilisateurs ayant donné leur consentement marketing (instantané quotidien)",
      output: { value: { label: "Consentement marketing" } },
    },
    usersWithStripe: {
      description:
        "Total des utilisateurs liés à un client Stripe (instantané quotidien)",
      output: { value: { label: "Utilisateurs Stripe" } },
    },
    usersTwoFaEnabled: {
      description:
        "Total des utilisateurs avec la 2FA activée (instantané quotidien)",
      output: { value: { label: "2FA activée" } },
    },
    usersLoginAttemptsTotal: {
      description: "Total des tentatives de connexion par minute",
      output: { value: { label: "Tentatives de connexion" } },
    },
    usersLoginAttemptsFailed: {
      description: "Tentatives de connexion échouées par minute",
      output: { value: { label: "Connexions échouées" } },
    },
    creditsSpentTotal: {
      description:
        "Total des crédits dépensés par minute, tous portefeuilles confondus",
      output: { value: { label: "Crédits dépensés" } },
    },
    creditsSpentByUsers: {
      description: "Crédits dépensés par les utilisateurs connectés par minute",
      output: { value: { label: "Crédits dépensés (utilisateurs)" } },
    },
    creditsSpentByLeads: {
      description: "Crédits gratuits dépensés par les leads par minute",
      output: { value: { label: "Crédits dépensés (leads)" } },
    },
    creditsPurchased: {
      description: "Crédits achetés ou ajoutés via un abonnement par minute",
      output: { value: { label: "Crédits achetés" } },
    },
    creditsFreeGrants: {
      description: "Crédits gratuits attribués aux leads par minute",
      output: { value: { label: "Crédits gratuits attribués" } },
    },
    creditsEarned: {
      description: "Crédits gagnés via le parrainage par minute",
      output: { value: { label: "Crédits gagnés" } },
    },
    creditsExpired: {
      description: "Crédits expirés par minute",
      output: { value: { label: "Crédits expirés" } },
    },
    creditsRefunded: {
      description: "Crédits remboursés par minute",
      output: { value: { label: "Crédits remboursés" } },
    },
    creditsBalanceTotal: {
      description:
        "Solde total de crédits de tous les portefeuilles utilisateurs (instantané quotidien)",
      output: { value: { label: "Solde de crédits" } },
    },
    creditsSubscriptionRevenue: {
      description: "Crédits issus des packs de type abonnement par minute",
      output: { value: { label: "Revenus des abonnements" } },
    },
    creditsTransferVolume: {
      description:
        "Volume de transferts de crédits entre portefeuilles par minute",
      output: { value: { label: "Volume des transferts" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Pourcentage consommé de la réserve de crédits gratuits (instantané quotidien)",
      output: { value: { label: "Utilisation de la réserve gratuite" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description:
        "Se déclenche quand la valeur d'une série satisfait une comparaison avec une constante",
      input: {
        series: { label: "Série" },
      },
      output: {
        signal: { label: "Signal" },
      },
      params: {
        op: {
          label: "Opérateur",
          description: "Opérateur de comparaison",
        },
        value: {
          label: "Valeur",
          description: "Constante de comparaison",
        },
      },
    },
    and: {
      description:
        "Se déclenche quand tous les signaux d'entrée se déclenchent au même horodatage",
      input: { signals: { label: "Signaux" } },
      output: { signal: { label: "Signal" } },
    },
    or: {
      description:
        "Se déclenche quand au moins un signal d'entrée se déclenche à un horodatage donné",
      input: { signals: { label: "Signaux" } },
      output: { signal: { label: "Signal" } },
    },
    not: {
      description: "Inverse un flux de signaux",
      input: { signal: { label: "Signal" } },
      output: { signal: { label: "Inversé" } },
    },
    crossover: {
      description:
        "Se déclenche quand la série A passe au-dessus de la série B",
      input: {
        seriesA: { label: "Série A" },
        seriesB: { label: "Série B" },
      },
      output: { signal: { label: "Signal" } },
    },
    script: {
      description:
        "Évaluateur personnalisé en sandbox : reçoit les séries d'entrée, renvoie des événements de signal",
      input: { inputs: { label: "Entrées" } },
      output: { signal: { label: "Signal" } },
      params: {
        fn: {
          label: "Fonction",
          description:
            "Corps de fonction JS qui reçoit les tableaux des séries d'entrée et renvoie des événements de signal",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "Additionne deux séries aux horodatages correspondants",
      input: {
        a: { label: "Série A" },
        b: { label: "Série B" },
      },
      output: { value: { label: "Fusionné" } },
    },
    ratio: {
      description: "Calcule A / B pour chaque horodatage",
      input: {
        a: { label: "Numérateur" },
        b: { label: "Dénominateur" },
      },
      output: { value: { label: "Ratio" } },
    },
    delta: {
      description: "Variation d'une période à l'autre",
      input: { source: { label: "Source" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Borne les valeurs à [min, max]",
      input: { source: { label: "Source" } },
      output: { value: { label: "Borné" } },
      params: {
        min: { label: "Min", description: "Borne inférieure" },
        max: { label: "Max", description: "Borne supérieure" },
      },
    },
    windowAvg: {
      description: "Moyenne glissante sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Moy." } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowSum: {
      description: "Somme glissante sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Somme" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowMin: {
      description: "Minimum glissant sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    windowMax: {
      description: "Maximum glissant sur N périodes",
      input: { source: { label: "Source" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Fenêtre", description: "Nombre de périodes (1–500)" },
      },
    },
    fieldPick: {
      description: "Extrait un champ nommé d'une série multi-valeurs",
      input: { source: { label: "Multi-valeurs" } },
      output: { value: { label: "Champ" } },
      params: {
        field: {
          label: "Nom du champ",
          description: "Nom du champ à extraire",
        },
      },
    },
    jsonPath: {
      description:
        "Extrait une valeur des méta d'un DataPoint via un chemin en notation pointée",
      input: { source: { label: "Source" } },
      output: { value: { label: "Valeur" } },
      params: {
        path: {
          label: "Chemin",
          description: "Chemin en notation pointée, p. ex. data.stats.total",
        },
      },
    },
    script: {
      description: "Transformation personnalisée par script en sandbox",
      input: { inputs: { label: "Entrées" } },
      output: { value: { label: "Résultat" } },
      params: {
        fn: {
          label: "Fonction",
          description:
            "Fonction fléchée JS qui reçoit les tableaux des séries d'entrée et renvoie DataPoint[]",
        },
      },
    },
  },

  // Shared data-source chart widget UI
  dataSourceWidget: {
    addToGraph: "Ajouter au graphe",
    newGraph: "Nouveau graphe",
    loading: "Chargement des données…",
    noData: "Aucune donnée pour cette période",
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Nettoyage Vibe Sense",
      description:
        "Lancer le nettoyage de rétention des points de données et faire expirer les instantanés",
      success: {
        title: "Nettoyage terminé",
        description: "Nettoyage de rétention terminé",
      },
      response: {
        nodesProcessed: "Nœuds traités",
        totalDeleted: "Lignes supprimées",
        snapshotsDeleted: "Instantanés supprimés",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Accès administrateur requis",
        },
        server: {
          title: "Erreur serveur",
          description: "Le nettoyage a échoué",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        validation: {
          title: "Échec de la validation",
          description: "Requête invalide",
        },
        notFound: { title: "Introuvable", description: "Introuvable" },
        conflict: { title: "Conflit", description: "Conflit" },
        network: {
          title: "Erreur réseau",
          description: "La requête réseau a échoué",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Enregistrez d'abord les modifications",
        },
      },
    },
    name: "Nettoyage Vibe Sense",
    description:
      "Supprime les anciens points de données et fait expirer le cache des instantanés",
  },
};
