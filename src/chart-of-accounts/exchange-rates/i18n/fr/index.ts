import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Comptabilité",
  tags: {
    ledger: "grand-livre",
    fx: "fx",
    rates: "taux-de-change",
  },
  fields: {
    companyId: "Entreprise",
    baseCurrency: "Devise de base",
    quoteCurrency: "Devise cotée",
    rate: "Taux de change",
    rateDate: "Date du taux",
    source: "Source",
    asOfDate: "Date de réévaluation",
    dryRun: "Aperçu uniquement",
    postReversalNextDay: "Extourne automatique le lendemain",
    currency: "Devise",
    limit: "Nombre max de lignes",
  },
  list: {
    title: "Taux de change",
    titleShort: "Taux FX",
    description:
      "Taux de référence quotidiens de la BCE et taux manuels pour la comptabilité multidevise",
    syncEcbAction: "Synchroniser les taux BCE",
    setManualAction: "Ajouter un taux manuel",
    revalueAction: "Réévaluation de clôture FX",
    empty:
      "Aucun taux de change enregistré. Synchronisez les taux BCE ou ajoutez un taux manuel.",
    countLabel: "Taux enregistrés",
    latestDate: "Dernière date",
    success: "Taux de change chargés",
  },
  set: {
    title: "Définir un taux de change manuel",
    description:
      "Enregistrer un taux manuel (1 devise de base = taux devise cotée). Le taux manuel prime sur la BCE à la même date.",
    action: "Enregistrer le taux",
    success: "Taux de change enregistré",
  },
  sync: {
    title: "Synchroniser les taux quotidiens BCE",
    description:
      "Récupérer les derniers taux de référence de l'euro publiés par la Banque centrale européenne",
    action: "Récupérer les taux BCE",
    success: "Taux quotidiens BCE synchronisés",
    upsertedCount: "Taux mis à jour",
  },
  revaluation: {
    title: "Réévaluation de change en fin de période",
    description:
      "Réévaluer les créances, dettes et soldes bancaires en devises étrangères au taux de clôture",
    action: "Lancer la réévaluation FX",
    previewAction: "Aperçu de la réévaluation",
    postAction: "Comptabiliser la réévaluation",
    success: "Réévaluation FX terminée",
    noAdjustments:
      "Aucun solde ouvert en devise étrangère ne nécessite de réévaluation.",
    functionalCurrency: "Devise fonctionnelle",
    totalUnrealized: "Écart de change latent net",
    journalEntryId: "Écriture de réévaluation",
    reversalEntryId: "Écriture d'extourne",
    missingRates: "Devises sans taux de clôture",
    account: "Compte",
    foreignBalance: "Solde d'origine",
    carryingFunctional: "Valeur comptable",
    closingRate: "Taux de clôture",
    revaluedFunctional: "Valeur réévaluée",
    unrealizedDelta: "Écart latent",
    previewBanner: "Aperçu uniquement. Aucune écriture comptabilisée.",
    postedBanner: "Écriture de réévaluation de change comptabilisée.",
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les codes devise, la date et le taux de change.",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour gérer les taux de change.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Des droits comptables sont requis pour cette action.",
    },
    notFound: {
      title: "Introuvable",
      description: "Entreprise ou taux de change introuvable.",
    },
    conflict: {
      title: "Conflit",
      description: "Période comptable ouverte ou comptes FX manquants.",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le flux de taux de la BCE.",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur inattendue lors du traitement FX.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue est survenue.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Des modifications ne sont pas enregistrées.",
    },
  },
};
