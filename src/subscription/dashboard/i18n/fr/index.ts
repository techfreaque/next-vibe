import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Vue d'ensemble de l'abonnement",
    titleShort: "Tableau de bord",
    description: "Votre abonnement en un coup d'œil",
    errors: {
      unauthorized: {
        title: "Connexion requise",
        description: "Connectez-vous pour voir votre abonnement",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir ceci",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger les données d'abonnement",
        detail: "Impossible de charger votre abonnement : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Un problème inattendu est survenu",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur de connexion",
        description: "Vérifiez votre connexion Internet",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun abonnement trouvé",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Chargé",
      description: "Données d'abonnement chargées",
    },
    response: {
      activeCount: "Actifs",
      cancelingCount: "En cours de résiliation",
      trialCount: "Essai",
      totalCount: "Total",
    },
  },
  widget: {
    renewalDiagnostics: "Renouvellements et échecs de paiement",
    actions: "Actions rapides",
    mySubscription: "Mon abonnement",
    manage: "Gérer",
    refresh: "Actualiser",
    noData: "Aucune donnée d'abonnement disponible",
  },
};
