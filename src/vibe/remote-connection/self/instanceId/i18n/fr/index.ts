import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  get: {
    title: "ID de cette instance",
    titleShort: "ID d'instance",
    description:
      "Lire l'identifiant de votre propre instance sur cette machine",
    instanceId: {
      label: "ID d'instance",
      description: "L'identifiant de cette instance",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non connecté",
        description:
          "Vous devez être connecté pour lire l'ID de cette instance",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de lire l'ID de cette instance",
      },
      notFound: {
        title: "Introuvable",
        description: "Identité de l'instance introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la lecture de l'ID d'instance",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu",
      },
    },
    success: {
      title: "ID d'instance",
      description: "ID de cette instance résolu",
    },
  },
};
