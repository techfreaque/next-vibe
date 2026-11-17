import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  widget: {
    title: "Synchro inverse",
    description:
      "Endpoint système. Appelé par l'instance initiatrice pour répercuter les changements de syncScope côté distant.",
    note: "Non destiné aux utilisateurs : appelé automatiquement lors de la mise à jour des paramètres de connexion.",
  },
  patch: {
    title: "Mettre à jour la connexion inverse",
    titleShort: "Mise à jour inverse",
    description:
      "Appelé par l'instance initiatrice pour synchroniser les paramètres de connexion de l'autre côté",
    syncScope: {
      label: "Périmètre de synchro",
      description: "Les domaines de données à synchroniser via cette connexion",
    },
    newInstanceId: {
      label: "Nouveau nom d'instance",
      description:
        "Le nouveau nom d'instance de l'appelant : met à jour notre libellé pour celle-ci",
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
        description: "Vous devez être connecté pour mettre à jour la connexion",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de mettre à jour cette connexion",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune connexion inverse trouvée pour cette instance",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la mise à jour de la connexion",
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
        description:
          "Un conflit est survenu lors de la mise à jour de la connexion",
      },
    },
    success: {
      title: "Connexion mise à jour",
      description: "Les paramètres de la connexion inverse ont été mis à jour",
    },
  },
};
