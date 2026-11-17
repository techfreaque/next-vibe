import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  patch: {
    title: "Renommer cette instance",
    titleShort: "Renommer l'instance",
    description: "Modifier le nom lisible de votre propre instance",
    newInstanceId: {
      label: "Nouvel ID d'instance",
      description: "Le nouvel identifiant de cette instance",
      placeholder: "hermes",
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
        description: "Vous devez être connecté pour renommer cette instance",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de renommer cette instance",
      },
      notFound: {
        title: "Introuvable",
        description: "Identité de l'instance introuvable",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur est survenue lors du renommage",
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
      title: "Renommée",
      description: "Instance renommée",
    },
  },
};
