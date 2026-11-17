import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abonnement",
    company: "Entreprise",
    get: "Consulter",
  },
  get: {
    title: "Abonnement de l'entreprise",
    titleShort: "Abo. entreprise",
    description: "Récupérer l'abonnement actif d'une entreprise",
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
