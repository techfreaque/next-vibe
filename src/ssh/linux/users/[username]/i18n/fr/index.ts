import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Mode local uniquement",
    },
    cannotDeleteCurrentUser:
      "Impossible de supprimer l'utilisateur du processus en cours",
    cannotDeleteSystemUser:
      "Impossible de supprimer les utilisateurs système (uid < 1000)",
    userNotFound: "Utilisateur introuvable",
  },

  delete: {
    review: "Consultez le compte local dans la liste des utilisateurs Linux.",
    title: "Supprimer un utilisateur Linux",
    titleShort: "Supprimer l'utilisateur",
    description: "Supprimer un compte utilisateur système de l'hôte",
    fields: {
      removeHome: {
        label: "Supprimer le répertoire personnel",
        description: "Supprimer aussi le répertoire personnel de l'utilisateur",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès admin requis",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Impossible de supprimer les utilisateurs système ou l'utilisateur du processus en cours",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de supprimer l'utilisateur",
      },
      notFound: {
        title: "Introuvable",
        description: "Utilisateur introuvable",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: { title: "Modifications non enregistrées" },
      conflict: {
        title: "Conflit",
        description: "Impossible de supprimer cet utilisateur",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      timeout: { title: "Délai dépassé", description: "La requête a expiré" },
    },
    response: {
      ok: { title: "OK" },
    },
    success: {
      title: "Utilisateur supprimé",
      description: "Le compte utilisateur système a été supprimé",
    },
  },
};
