import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abonnement",
    company: "Entreprise",
    get: "Consulter",
  },
  view: {
    empty: "Aucun abonnement",
    emptyHelp: "Votre compte ne comporte aucun abonnement.",
    status: "Statut",
    interval: "Fréquence de facturation",
    periodStart: "Début de la période en cours",
    periodEnd: "Fin de la période en cours",
    unavailable: "Non renseigné",
    provider: "Prestataire de paiement",
    cancellation: "Résiliation",
    endOfPeriod: "À la fin de la période",
    scheduled: "Résiliation prévue",
    canceled: "Résilié le",
    ended: "Terminé le",
    open: "Ouvrir le détail de l’abonnement",
    list: "Retour aux abonnements",
  },
  get: {
    title: "Abonnement du propriétaire",
    titleShort: "Abonnement du propriétaire",
    description:
      "Consultez l’abonnement personnel du propriétaire de l’entreprise.",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise dont l'abonnement doit être récupéré",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID d'entreprise invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les abonnements de l'entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas accès à l'abonnement de cette entreprise",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur est survenue. Réessayez.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion et réessayez",
      },
      notFound: {
        title: "Aucun abonnement trouvé",
        description: "Cette entreprise n'a pas d'abonnement",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Abonnement chargé",
      description: "Abonnement de l'entreprise récupéré",
    },
  },
};
