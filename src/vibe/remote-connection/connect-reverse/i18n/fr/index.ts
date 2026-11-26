import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  post: {
    title: "Enregistrer une instance locale",
    titleShort: "Enregistrer l'instance",
    description:
      "Appelé par une instance locale pendant la connexion pour s'enregistrer sur le cloud",
    instanceId: {
      label: "Nom de l'instance",
      description: "L'identifiant unique de l'instance locale",
      placeholder: "hermes",
      validation: {
        invalid:
          "Utilisez uniquement des minuscules, des chiffres et des tirets",
      },
    },
    localUrl: {
      label: "URL locale",
      description: "L'URL de l'application de l'instance locale",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Saisissez l'URL locale",
        invalid: "Saisissez une URL valide",
      },
    },
    reverseToken: {
      label: "Jeton inverse",
      description:
        "Jeton JWT permettant à l'instance distante de s'authentifier auprès de celle-ci",
    },
    reverseLeadId: {
      label: "ID du lead inverse",
      description: "ID du lead pour la connexion inverse",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez vos informations et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer une instance",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation d'enregistrer une instance",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de l'enregistrement de l'instance",
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
        title: "ID d'instance déjà enregistré",
        description:
          "Une instance avec cet ID est déjà enregistrée pour votre compte. Choisissez un autre ID d'instance.",
      },
    },
    success: {
      title: "Instance enregistrée",
      description: "L'instance locale a été enregistrée",
    },
  },
};
