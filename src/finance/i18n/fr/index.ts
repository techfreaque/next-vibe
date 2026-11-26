import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  profit: {
    run: "Afficher le rapport",
    unallocatedRevenue:
      "Produits comptabilisés sans affectation par modèle : {{amount}}",
    estimatedCosts: "Coûts estimés des modèles : {{amount}}",
    usageValue: "Usage payant valorisé aux prix d’achat connus : {{amount}}",
    estimatedMargin: "Marge d’usage estimée : {{amount}}",
    marginUnknown:
      "Marge indisponible. Le financement ou la valeur de l’usage payant est incomplet.",
    missingPrice:
      "Prix d’achat non confirmé pour {{credits}} crédits consommés.",
    title: "Résultat mensuel",
    description:
      "Consultez les produits et charges comptabilisés et le résultat par mois.",
    revenue: "Produits nets",
    expenses: "Charges",
    net: "Bénéfice ou perte nette",
    empty: "Aucun produit ni aucune charge n’a été comptabilisé ce mois-ci.",
    areas: "Sources des charges",
    signedExpenseAreas:
      "Les contre-passations et autres écritures au crédit réduisent les charges. Un total négatif indique que les crédits ont dépassé les charges ce mois-ci.",
    openLedger: "Voir les écritures",
    noAccounts: "Aucun mouvement.",
    estimatesHint:
      "Estimations d’usage en USD pour au plus 20 modèles des prestataires associés. Les forfaits et les coûts sans relevé d’usage sont exclus.",
    estimatesEmpty:
      "Aucune estimation de coût des modèles pour cette sélection.",
    unknownModel: "Modèle non identifié",
    paid: "Crédits achetés : {{amount}}",
    free: "Quota gratuit : {{amount}}",
    gifted: "Crédits offerts : {{amount}}",
    unknownFunding: "Financement inconnu : {{amount}}",
    missing: "Coût exact indisponible pour {{credits}} crédits consommés.",
  },
  suppliers: {
    bankTransaction: "Opération bancaire",
    bankLoading: "Chargement de l’opération bancaire…",
    bankUnavailable: "L’opération bancaire vérifiée est indisponible.",
    previewBankLink: "Prévisualiser le lien",
    linkToBankBill: "Associer le justificatif",
    bankDraftBill: "Facture issue de la transaction (facultatif)",
    sponsorshipSource: "Parrainage de créateur",
    confirmSeparateBankBill:
      "Confirmer que la dépense est distincte des brouillons bancaires",
    possibleBankDuplicate:
      "Une facture issue du relevé bancaire présente des données similaires. Sélectionnez-la pour associer le justificatif ou confirmez que la dépense est distincte.",
    monthlyReview: "Aperçu mensuel des sources",
    monthlyReviewHint:
      "Vérifiez les relevés enregistrés et les prépaiements confirmés du mois. Des périodes incomplètes peuvent produire des écarts.",
    counterTotal: "Usage relevé au compteur (USD) : {{amount}}",
    estimatedTotal: "Usage estimé (USD) : {{amount}}",
    unclassifiedTotal: "Usage sans base identifiée (USD) : {{amount}}",
    readingCoverage:
      "{{readings}} relevés, dont {{missing}} sans coût d’intervalle.",
    receiptTotal:
      "Prépaiements confirmés : {{amount}} dans {{count}} pièces, dont {{posted}} comptabilisées.",
    noReceipts: "Aucun justificatif de prépaiement confirmé ce mois-ci.",
    ledgerPrepaid: "Solde prépayé comptabilisé",
    estimates: "Coûts estimés des modèles",
    estimatesHint:
      "Les 20 estimations d’usage les plus élevées des prestataires associés. Les forfaits et les coûts sans relevé d’usage sont exclus.",
    month: "Mois (AAAA-MM)",
    monthly: "Charges mensuelles comptabilisées",
    noMonthly: "Aucune charge comptabilisée pour ce mois.",
    area: {
      referral: "Commissions de parrainage",
      provider: "Prestataires",
      processor: "Traitement des paiements",
      sponsorship: "Parrainage",
      supplier: "Autres justificatifs fournisseurs",
      unallocated: "Sans affectation",
    },
    spendBasis: {
      counter: "Compteur du prestataire",
      "balance-delta": "Estimation d’après la variation de solde",
      "usage-estimate": "Estimation d’après l’usage interne",
    },
    title: "Justificatifs fournisseurs",
    description:
      "Consultez les soldes des prestataires et les justificatifs fournisseurs.",
    record: "Enregistrer un justificatif",
    recordDescription:
      "Vérifiez le justificatif avant de créer une facture ou une écriture.",
    company: "Société",
    vendor: "Fournisseur",
    chooseSupplier: "Choisir un fournisseur",
    operation: "Action",
    provider: "Prestataire",
    reference: "Référence du justificatif",
    invoiceReference: "Numéro de facture fournisseur",
    servicePeriodStart: "Début de la prestation (AAAA-MM-JJ)",
    servicePeriodEnd: "Fin de la prestation (AAAA-MM-JJ)",
    date: "Date comptable (AAAA-MM-JJ)",
    gross: "Montant brut",
    tax: "Montant de taxe confirmé",
    currency: "Devise (EUR, USD ou PLN)",
    memo: "Description",
    preview: "Aperçu uniquement",
    debit: "Compte de débit ou de charges",
    credit: "Compte de crédit",
    result: "Résultat",
    balances: "Soldes des prestataires",
    observed: "Solde relevé",
    interval: "Coût du dernier intervalle, base non vérifiée",
    unavailable: "Indisponible",
    recent: "Justificatifs récents",
    noBindings: "Aucun prestataire n’est associé à cette société.",
    noEvidence: "Aucun justificatif fournisseur enregistré.",
    run: "Afficher les justificatifs fournisseurs",
    previewEvidence: "Prévisualiser le justificatif",
    invalid:
      "Vérifiez la référence, les montants confirmés, la devise de la société, les comptes et la période ouverte.",
    conflict: "Cette référence est déjà associée à un autre justificatif.",
    taxHint: "Saisissez 0 si le justificatif confirme l’absence de taxe.",
    referralHint:
      "Sélectionnez le fournisseur dont l’adresse e-mail correspond à celle vérifiée du bénéficiaire. Reprenez le montant TTC, la devise et la taxe du justificatif de commission. La demande de versement indique uniquement des crédits.",
    evidenceHint:
      "Utilisez le reçu ou le relevé d’origine. Le solde du prestataire seul ne suffit pas.",
    openBill: "Ouvrir la facture",
    openJournal: "Ouvrir l’écriture",
    banked:
      "Les soldes et coûts relevés servent au contrôle. Les coûts historiques peuvent être estimés.",
    kind: {
      processorFee: "Utiliser les frais de paiement vérifiés",
      fundBill: "Facture d’acompte fournisseur",
      bind: "Associer un prestataire",
      bill: "Facture fournisseur",
      fund: "Alimenter le solde prépayé",
      consume: "Utiliser le solde prépayé",
      paid: "Enregistrer une charge payée",
      sponsorship: "Utiliser un contrat de parrainage",
      referral: "Saisir une facture de commission",
    },
    outcome: {
      linked: "Justificatif fournisseur associé",
      preview: "Aperçu validé",
      bound: "Prestataire associé",
      bill: "Brouillon de facture créé",
      posted: "Écriture comptabilisée",
      replayed: "Déjà enregistré",
      review:
        "Contrôle requis. La source seule ne justifie ni le règlement dans la devise de la société ni la taxe.",
    },
  },
  spendAlert: {
    explained: "Le registre d’usage explique le pic chez {{provider}}.",
    unexplained: "Clé API potentiellement compromise chez {{provider}}.",
    cap: "{{spend}} dépensés en {{hours}} h ({{rate}}/h, plafond de {{cap}}/h).",
    drain:
      "La dépense de {{rate}}/h représente {{ratio}} fois la moyenne récente de {{baseline}}/h sur {{coveredHours}} h mesurées (seuil : {{limit}} fois).",
    ledgerCost:
      "Le registre indique {{cost}} de frais fournisseur sur cette période.",
    topWallets: "Portefeuilles ayant utilisé le plus de crédits : {{wallets}}.",
  },
  category: "Finance",
  documents: {
    status: "Statut",
    activeFilters: "{{label}} actifs",
    loadFailed: "Impossible de charger les documents",
    loadFailedHint: "Rechargez la liste.",
    scopeDenied: "Vous ne pouvez pas accéder aux documents sélectionnés.",
    retry: "Réessayer",
    openAction: "Ouvrir",
    pickAction: "Sélectionner",
    pageSingle: "Page {{page}} sur {{pages}} · {{total}} résultat",
    clearCompany: "Retirer le filtre entreprise",
    clearCustomer: "Retirer le filtre client",
    pageTotals: "Totaux · {{currency}}",
    pageDocumentCount: "Documents sur cette page : {{count}}",
    search: "Rechercher des documents",
    matches: "Documents trouvés ({{count}})",
    emptyTitle: "Aucun document ne correspond à ces filtres",
    emptyHint: "Modifiez la recherche ou les filtres.",
    allCompanies: "Toutes les entreprises auxquelles vous avez accès",
    chooseCompany: "Choisir une entreprise",
    allCustomers: "Tous les clients",
    chooseCustomer: "Choisir un client",
    apply: "Appliquer les filtres",
    clear: "Effacer les filtres",
    page: "Page {{page}} sur {{pages}} · {{total}} résultats",
    previous: "Page précédente",
    next: "Page suivante",
    select: "Sélectionner {{reference}}",
    open: "Ouvrir {{reference}}",
    noReference: "Sans numéro de document",
    invoices: "Factures clients",
    bills: "Factures fournisseurs",
    estimates: "Devis",
    heading: "Documents commerciaux",
  },
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
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
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
      openrouterAutoTopUpFloorUsd:
        "OpenRouter : seuil d’alerte de recharge automatique (USD)",
      openrouterAutoTopUpGraceHours:
        "OpenRouter : délai de recharge automatique (heures)",
      gabLowBalanceCredits: "Gab AI : solde minimum (crédits)",
      uncensoredAiLowBalanceCredits: "uncensored.ai : solde minimum (crédits)",
      freedomGptLowBalanceCredits: "FreedomGPT : solde minimum (crédits)",
      nanoGptAutoTopUpFloorUsd:
        "NanoGPT seuil d’alerte de recharge automatique (USD)",
      nanoGptAutoTopUpGraceHours:
        "NanoGPT délai de recharge automatique (heures)",
      veniceAutoTopUpFloorUsd:
        "Venice seuil d’alerte de recharge automatique (USD)",
      modelsLabLowBalanceUsd: "Seuil de solde ModelsLab (USD)",
      edenAiLowBalanceUsd: "Seuil de solde Eden AI (USD)",
      veniceAutoTopUpGraceHours:
        "Venice délai de recharge automatique (heures)",
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
      providerBalanceNative: "Solde fournisseur restant (crédits fournisseur)",
      providerCost: "Coût fournisseur selon nos relevés ($)",
      costTotal: "Coût fournisseurs total ($)",
      costPaid: "Coût fournisseurs de l’usage payant ($)",
      costFree: "Coût fournisseurs de l’usage gratuit ($)",
      consumedList: "Crédits consommés au prix catalogue ($)",
      earned: "Gagné : crédits payants au prix payé ($)",
      freeList: "Crédits gratuits consommés au prix catalogue ($)",
      aiMarginUsd: "Marge IA : gagné moins coût fournisseurs ($)",
      aiMarginPct: "Marge IA (% du gagné)",
      paidMarginUsd: "Marge de l’usage payant ($)",
      paidMarginPct: "Marge de l’usage payant (%)",
      alerts: "Alertes déclenchées",
    },
  },
  ingest: {
    title: "Collecte financière",
    titleShort: "Collecte",
    description:
      "Lecture seule du chiffre d'affaires réel (Stripe, NOWPayments) et des soldes réels des fournisseurs. Calcule la marge journalière et déclenche des alertes. Ne déplace aucun argent.",
    task: {
      balancesName: "Synchronisation des soldes fournisseurs",
      revenueName: "Synchronisation des revenus",
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
      margin: "Encaissements et dépenses fournisseurs par jour (pas une marge)",
      dayLine: "encaissé {{cash}} · dépenses fournisseurs {{cost}}",
      costUnknown: "coût inconnu",
      alerts: "Alertes : {{raised}} déclenchées, {{suppressed}} ignorées",
    },
  },
  status: {
    title: "Finance",
    titleShort: "Coûts et marge",
    description:
      "Chiffre d'affaires face au coût fournisseurs : soldes fournisseurs, marge, alertes et seuils.",
    response: {
      lastIngestAt: "Dernière tentative de synchronisation",
      lastSuccessfulIngestAt: "Dernière synchronisation réussie",
      asOf: "Date du bilan",
      sources: "Sources",
      week: "7 derniers jours",
      days: "Marge journalière",
      alerts: "Alertes récentes",
      thresholds: "Seuils",
    },
    widget: {
      back: "Retour",
      title: "Finance",
      refresh: "Actualiser",
      runIngest: "Lancer la collecte",
      loading: "Chargement des finances…",
      lastIngest: "Dernière tentative {{when}}",
      lastSuccessful: "Dernière synchronisation réussie {{when}}",
      snapshot: "Dernier relevé du fournisseur {{when}}",
      stale: "Relevé ancien",
      noBalance: "Aucun solde communiqué",
      noSources: "Aucune source financière n’a communiqué de données.",
      never: "jamais",
      neverRun: "Jamais exécutée",
      margin: {
        title: "Marge IA (7 derniers jours)",
        earned: "Gagné sur les crédits payants",
        cost: "Coût fournisseurs",
        margin: "Marge IA",
        pct: "Marge IA %",
        paidPct: "Marge de l’usage payant %",
        basis:
          "Gagné = crédits payants consommés au prix payé. Coût = coût fournisseurs de tout l’usage, dont {{free}} de crédits gratuits au prix catalogue.",
        cash: "Encaissements nets : {{net}}, frais de paiement {{fees}}. Flux de trésorerie, jamais déduit du coût fournisseurs.",
        cashDay: "encaissé {{net}}",
        empty: "Aucun usage ces 7 derniers jours.",
        missingPct: "Rien de gagné",
      },
      providers: {
        title: "Soldes fournisseurs",
        lastSpend: "Dépensé depuis le dernier relevé : {{amount}}",
        lastSpendEstimate:
          "Dépenses estimées depuis le dernier relevé : {{amount}}",
        previousDaySpend: "Crédits consommés le {{day}} (UTC) : {{amount}}",
        lastNativeSpend:
          "Crédits facturés par l’API à la dernière heure pleine : {{amount}}",
        noSpend: "Aucune dépense mesurée pour l'instant",
      },
      revenue: {
        title: "Sources de chiffre d'affaires",
        fallback: "Repli : nos propres données",
      },
      alerts: {
        title: "Alertes récentes",
        empty: "Aucune alerte enregistrée",
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
      costProvider: {
        label: "Fournisseur de coût",
        description:
          "ID du fournisseur API pour le coût, par ex. openrouter, nano-gpt ou unattributed",
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
