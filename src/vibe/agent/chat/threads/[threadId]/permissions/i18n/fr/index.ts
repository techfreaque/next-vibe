import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Fils de discussion",
    permissions: "Autorisations",
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
    },
  },
  dialog: {
    title: "Autorisations du fil : {{threadTitle}}",
  },
  get: {
    title: "Récupérer les autorisations du fil",
    titleShort: "Accès au fil",
    description: "Récupérer la liste des modérateurs d'un fil",
    container: {
      title: "Autorisations du fil",
      description: "Voir et gérer les droits d'accès au fil",
    },
    threadId: {
      label: "ID du fil",
      description: "Identifiant unique du fil",
    },
    response: {
      title: "Autorisations du fil",
      rolesView: {
        label: "Rôles en lecture",
        description: "Rôles qui peuvent voir ce fil",
      },
      rolesEdit: {
        label: "Rôles en modification",
        description: "Rôles qui peuvent modifier les paramètres du fil",
      },
      rolesPost: {
        label: "Rôles en publication",
        description: "Rôles qui peuvent publier des messages",
      },
      rolesModerate: {
        label: "Rôles de modération",
        description: "Rôles qui peuvent modérer le contenu",
      },
      rolesAdmin: {
        label: "Rôles d'administration",
        description: "Rôles avec un accès administrateur complet",
      },
      moderatorIds: {
        title: "ID des modérateurs",
        description: "Liste des ID utilisateur pouvant modérer ce fil",
        content: "ID utilisateur",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la récupération des autorisations",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir les autorisations du fil",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de voir les autorisations de ce fil",
      },
      notFound: {
        title: "Introuvable",
        description: "Le fil demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération des autorisations",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit avec l'état actuel",
      },
    },
    backButton: {
      label: "Retour",
    },
    success: {
      title: "Succès",
      description: "Autorisations du fil récupérées",
    },
  },
  patch: {
    title: "Modifier les autorisations du fil",
    titleShort: "Accès au fil",
    description: "Modifier la liste des modérateurs d'un fil",
    container: {
      title: "Modifier les autorisations du fil",
      description: "Modifier les droits d'accès au fil",
    },
    threadId: {
      label: "ID du fil",
      description: "Identifiant unique du fil à modifier",
    },
    rolesView: {
      label: "Rôles en lecture",
      description: "Rôles qui peuvent voir ce fil",
    },
    rolesEdit: {
      label: "Rôles en modification",
      description: "Rôles qui peuvent modifier les paramètres du fil",
    },
    rolesPost: {
      label: "Rôles en publication",
      description: "Rôles qui peuvent publier des messages",
    },
    rolesModerate: {
      label: "Rôles de modération",
      description: "Rôles qui peuvent modérer le contenu",
    },
    rolesAdmin: {
      label: "Rôles d'administration",
      description: "Rôles avec un accès administrateur complet",
    },
    permissions: {
      title: "Modification des autorisations",
      moderatorIds: {
        label: "ID des modérateurs",
        description: "Liste des ID utilisateur pouvant modérer ce fil",
      },
    },
    response: {
      title: "Autorisations mises à jour",
      rolesView: {
        label: "Rôles en lecture",
        description: "Rôles qui peuvent voir ce fil",
      },
      rolesEdit: {
        label: "Rôles en modification",
        description: "Rôles qui peuvent modifier les paramètres du fil",
      },
      rolesPost: {
        label: "Rôles en publication",
        description: "Rôles qui peuvent publier des messages",
      },
      rolesModerate: {
        label: "Rôles de modération",
        description: "Rôles qui peuvent modérer le contenu",
      },
      rolesAdmin: {
        label: "Rôles d'administration",
        description: "Rôles avec un accès administrateur complet",
      },
      message: {
        content: "Autorisations du fil mises à jour",
      },
      moderatorIds: {
        title: "Modérateurs actuels",
        description: "Liste mise à jour des modérateurs de ce fil",
        content: "ID utilisateur",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les ID de modérateurs fournis sont invalides",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la modification des autorisations",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour modifier les autorisations du fil",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas l'autorisation de modifier les autorisations de ce fil",
      },
      notFound: {
        title: "Introuvable",
        description: "Le fil demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la modification des autorisations",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit avec l'état actuel",
      },
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Enregistrer les autorisations",
      loadingText: "Enregistrement…",
    },
    success: {
      title: "Succès",
      description: "Autorisations du fil mises à jour",
    },
  },
};
