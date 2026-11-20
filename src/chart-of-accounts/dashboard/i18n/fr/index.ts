import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Tableau de bord comptable",
    titleShort: "Tableau de bord",
    description:
      "Vue d'ensemble de votre comptabilité : période ouverte, nombre d'écritures et accès rapide à tous les outils comptables.",
    companyId: {
      label: "ID de l'entreprise",
      description: "Entreprise dont vous voulez charger le tableau de bord",
      placeholder: "UUID de l'entreprise",
    },
    response: {
      currentPeriod: "Période en cours",
      accountCount: "Comptes",
      draftEntryCount: "Écritures en brouillon",
      postedThisMonthCount: "Comptabilisées ce mois-ci",
      hasSetup: "Configuration",
      currency: "Devise",
    },
    success: {
      title: "Tableau de bord chargé",
      description: "Vue d'ensemble comptable récupérée",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Connexion requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez vos saisies",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Aucun accès à cette entreprise",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger le tableau de bord",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
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
    widget: {
      currentPeriod: "Période en cours",
      noPeriod: "Aucune période ouverte",
      createPeriod: "Créer une période",
      totalAccounts: "Comptes",
      viewAccounts: "Voir",
      draftEntries: "Écritures en brouillon",
      viewDrafts: "Voir",
      postedThisMonth: "Comptabilisées ce mois-ci",
      configured: "Configuré",
      notSetUp: "Non configuré",
      runSetup: "Lancer la configuration",
      setupStatus: "Configuration",
      loading: "Chargement du tableau de bord…",
      noData: "Aucune donnée comptable disponible.",
      navTitle: "Comptabilité",
      chartOfAccounts: "Plan comptable",
      journalEntries: "Écritures comptables",
      periods: "Périodes",
      balanceSheet: "Bilan",
      profitLoss: "Compte de résultat",
      trialBalance: "Balance générale",
      taxReport: "Déclaration fiscale",
      companies: "Entreprises",
      invoices: "Factures",
      bills: "Factures fournisseurs",
      selectCompany: "Sélectionnez une entreprise pour ouvrir sa comptabilité.",
    },
  },
  category: "Comptabilité",
  tag: "Tableau de bord",
};
