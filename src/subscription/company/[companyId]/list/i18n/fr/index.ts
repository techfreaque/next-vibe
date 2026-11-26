import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abonnement",
    company: "Entreprise",
    list: "Liste",
  },
  get: {
    title: "Abonnements du propriétaire",
    titleShort: "Abonnements du propriétaire",
    description:
      "Consultez l’abonnement personnel du propriétaire de l’entreprise.",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise dont les abonnements doivent être listés",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID d'entreprise invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description:
          "Connectez-vous pour lister les abonnements de l'entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas accès aux abonnements de cette entreprise",
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
        title: "Entreprise introuvable",
        description: "Cette entreprise n'existe pas",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Abonnements chargés",
      description: "Abonnements de l'entreprise récupérés",
    },
  },
};
