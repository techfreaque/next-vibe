import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finance",
  tags: {
    finance: "finance",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
    },
    provider: {
      all: "Tous les fournisseurs",
    },
    eventKind: {
      charge: "Encaissement",
      refund: "Remboursement",
      dispute: "Litige",
      cancellation: "Résiliation",
      payout: "Versement",
      fee: "Frais du prestataire de paiement",
    },
    runStatus: {
      ok: "OK",
      skipped: "Ignoré",
      failed: "Échec",
    },
    alertType: {
      lowBalance: "Solde prépayé faible",
      negativeMargin: "Marge négative",
      thinMargin: "Marge faible",
      balanceDrain: "Solde qui fond",
      spendSpike: "Pic de dépenses",
      refundSpike: "Pic de remboursements",
      disputeSpike: "Pic de litiges",
      cancellationSpike: "Pic de résiliations",
      billingGap: "Écart de facturation",
    },
    severity: {
      warning: "Avertissement",
      critical: "Critique",
    },
    threshold: {
      openrouterLowBalanceUsd: "OpenRouter : solde minimum (USD)",
      openrouterLowBalanceDays: "OpenRouter : réserve de dépenses (jours)",
      nanoGptLowBalanceUsd: "NanoGPT : solde minimum (USD)",
      nanoGptLowBalanceDays: "NanoGPT : réserve de dépenses (jours)",
      veniceLowBalanceUsd: "Venice : solde minimum (USD)",
      veniceLowBalanceDays: "Venice : réserve de dépenses (jours)",
      marginFloorPct: "Marge plancher (%)",
      drainMultiplier: "Multiplicateur de baisse (x moyenne glissante)",
      hourlySpendCapUsd: "Plafond de dépenses horaire par fournisseur ($/h)",
      minSpikeUsd: "Dépense minimale pour évaluer un pic ($)",
      refundRatePct: "Taux de remboursement max. (% des encaissements)",
      disputeCountDaily: "Litiges par jour",
      cancellationMultiplier: "Pic de résiliations (x moyenne glissante)",
      cancellationMin: "Résiliations minimales pour évaluer un pic",
      billingGapPct: "Écart de facturation max. (% au-delà du facturé)",
      alertDedupHours: "Fenêtre anti-répétition des alertes (heures)",
      minRevenueUsd:
        "Chiffre d'affaires journalier minimal pour évaluer la marge ($)",
      minCostUsd: "Coût journalier minimal pour évaluer la marge ($)",
    },
    scope: {
      all: "Tout",
      balances: "Soldes fournisseurs uniquement",
      revenue: "Chiffre d'affaires uniquement",
    },
    costCoverage: {
      complete: "Complet",
      partial: "Coût partiel",
      none: "Coût inconnu",
    },
    metric: {
      stripeRevenue: "Chiffre d'affaires Stripe (brut, $)",
      nowpaymentsRevenue: "Chiffre d'affaires NOWPayments (brut, $)",
      netRevenue: "Chiffre d'affaires net ($)",
      refunds: "Remboursements ($)",
      upstreamCost: "Coût fournisseurs ($)",
      internalBilled: "Facturé aux utilisateurs ($)",
      grossMarginUsd: "Marge brute ($)",
      grossMarginPct: "Marge brute (%)",
      providerSpend: "Dépenses fournisseur ($)",
      providerBalance: "Solde fournisseur restant ($)",
      alerts: "Alertes déclenchées",
    },
  },
  ingest: {
    title: "Collecte financière",
    titleShort: "Collecte",
    description:
      "Lecture seule du chiffre d'affaires réel (Stripe, NOWPayments) et des soldes réels des fournisseurs. Calcule la marge journalière et déclenche des alertes. Ne déplace aucun argent.",
    task: {
      balances:
        "Toutes les heures : lit chaque solde fournisseur, mesure les dépenses, signale les baisses anormales et les pics.",
      revenue:
        "Chaque jour : récupère le chiffre d'affaires Stripe et NOWPayments, consolide la marge, signale remboursements, litiges et marges faibles.",
    },
    fields: {
      scope: {
        label: "Périmètre",
        description: "Ce qu'il faut récupérer",
      },
      dryRun: {
        label: "Simulation",
        description: "Lire et calculer, sans rien stocker ni envoyer",
      },
      windowDays: {
        label: "Fenêtre de chiffre d'affaires (jours)",
        description:
          "Nombre de jours de chiffre d'affaires à récupérer à nouveau. Par défaut : 3.",
      },
      backfillFrom: {
        label: "Recalcul à partir du (YYYY-MM-DD)",
        description:
          "Recalcule les consolidations journalières de ce jour UTC jusqu'à backfill-to (aujourd'hui par défaut). Reconstruit le chiffre d'affaires depuis tout notre historique de paiements ; écrit toujours (ignore la simulation). Laissez vide pour une collecte normale.",
      },
      backfillTo: {
        label: "Recalcul jusqu'au (YYYY-MM-DD)",
        description: "Dernier jour UTC à recalculer. Par défaut : aujourd'hui.",
      },
    },
    response: {
      dryRun: "Simulation",
      ranAt: "Exécuté le",
      sources: "Sources",
      days: "Marge journalière",
      alertsRaised: "Alertes déclenchées",
      alertsSuppressed: "Alertes ignorées (doublons)",
      alerts: "Alertes",
    },
    widget: {
      hint: "Lit uniquement nos propres comptes. Une source sans endpoint est ignorée et la raison enregistrée.",
      submit: "Lancer la collecte",
      submitting: "Exécution…",
      result: "Résultat de la collecte",
      resultDry: "Simulation (rien stocké, rien envoyé)",
      events: "{{count}} lignes",
      margin: "Marge : CA net - frais - coût fournisseurs",
      costUnknown: "coût inconnu",
      alerts: "Alertes : {{raised}} déclenchées, {{suppressed}} ignorées",
    },
  },
  status: {
    title: "Finance",
    titleShort: "Finance",
    description:
      "Chiffre d'affaires face au coût fournisseurs : soldes fournisseurs, marge, alertes et seuils.",
    response: {
      lastIngestAt: "Dernière collecte",
      sources: "Sources",
      week: "7 derniers jours",
      days: "Marge journalière",
      alerts: "Alertes récentes",
      thresholds: "Seuils",
    },
    widget: {
      title: "Finance",
      refresh: "Actualiser",
      runIngest: "Lancer la collecte",
      loading: "Chargement des finances…",
      lastIngest: "Dernière collecte : {{when}}",
      never: "jamais",
      neverRun: "Jamais exécutée",
      margin: {
        title: "Marge (7 derniers jours)",
        revenue: "CA net",
        cost: "Coût fournisseurs",
        fees: "Frais de paiement",
        margin: "Marge brute",
        pct: "Marge en %",
        empty: "Aucune consolidation pour l'instant. Lancez une collecte.",
        costUnknown: "coût inconnu",
        costIncomplete:
          "La marge couvre {{tracked}} jours sur {{total}} : seuls les jours avec un coût fournisseurs complet comptent. CA net sur les {{total}} jours : {{revenue}}.",
      },
      providers: {
        title: "Soldes fournisseurs",
        lastSpend: "Dépensé depuis le dernier relevé : {{amount}}",
        noSpend: "Aucune dépense mesurée pour l'instant",
      },
      revenue: {
        title: "Sources de chiffre d'affaires",
        fallback: "Repli : nos propres données",
      },
      alerts: {
        title: "Alertes récentes",
        empty: "Aucune alerte. Marge et soldes normaux.",
      },
      thresholds: {
        title: "Seuils",
        hint: "Les valeurs par défaut s'appliquent tant que vous n'en définissez pas. Une alerte se répète au plus une fois par fenêtre.",
        custom: "Personnalisé",
        default: "Par défaut",
        edit: "Modifier",
      },
    },
  },
  thresholds: {
    title: "Définir un seuil financier",
    titleShort: "Définir un seuil",
    description:
      "Remplace un seuil d'alerte. Une valeur désactivée revient à la valeur par défaut.",
    fields: {
      key: { label: "Seuil", description: "La limite à modifier" },
      value: { label: "Valeur", description: "La nouvelle limite" },
      enabled: {
        label: "Utiliser cette valeur",
        description: "Désactivé : retour à la valeur par défaut",
      },
      note: {
        label: "Note",
        description: "Pourquoi cette limite",
        placeholder: "ex. semaine de lancement, remboursements attendus",
      },
    },
    response: { key: "Seuil enregistré" },
    widget: {
      back: "Retour",
      hint: "Les modifications s'appliquent à la prochaine collecte.",
    },
  },
  series: {
    title: "Séries financières",
    titleShort: "Finance",
    description:
      "Séries temporelles du suivi financier : chiffre d'affaires par prestataire de paiement, CA net, coût fournisseurs, marge, dépenses et solde des fournisseurs, alertes.",
    fields: {
      resolution: {
        label: "Résolution",
        description: "Taille des intervalles",
      },
      range: { label: "Plage", description: "Plage temporelle à récupérer" },
      lookback: {
        label: "Historique préalable",
        description: "Intervalles de préchauffage avant la plage",
      },
      metric: { label: "Indicateur", description: "La série à afficher" },
      provider: {
        label: "Fournisseur",
        description: "Filtrer les dépenses et le solde par fournisseur",
      },
      result: { label: "Série", description: "Série temporelle financière" },
      meta: { label: "Méta", description: "Métadonnées d'exécution" },
    },
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les champs signalés",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'administrateur",
    },
    forbidden: {
      title: "Réservé aux administrateurs",
      description: "Les outils financiers exigent le rôle administrateur",
    },
    notFound: {
      title: "Introuvable",
      description: "Cette entrée n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "L'entrée a changé entre-temps. Rechargez et réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de traiter la requête",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un échec inattendu s'est produit",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    invalidThreshold: "Un seuil doit être un nombre positif ou nul",
    ingestFailed: "Échec de la collecte financière : {{error}}",
    backfill: {
      invalidRange:
        "Le recalcul exige une date de début valide, antérieure ou égale à la date de fin (YYYY-MM-DD)",
      tooWide:
        "Plage de recalcul trop large : {{max}} jours maximum par exécution",
    },
  },
  success: {
    title: "Terminé",
    description: "Enregistré",
  },
};
