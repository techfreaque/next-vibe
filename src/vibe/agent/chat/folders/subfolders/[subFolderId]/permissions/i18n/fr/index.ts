import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
    permissions: "Permissions",
  },
  get: {
    title: "Obtenir les permissions du dossier",
    titleShort: "Accès au dossier",
    description: "Récupère la liste des modérateurs d'un dossier",
    noData: "Aucune donnée disponible",
    edit: "Modifier",
    about: "À propos des permissions",
    inheritFromParent: "Hérite du parent",
    container: {
      title: "Permissions du dossier",
      description: "Voir et gérer les permissions d'accès au dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier",
    },
    response: {
      title: "Permissions du dossier",
      rolesView: {
        label: "Rôles en lecture",
        description: "Rôles autorisés à voir ce dossier",
      },
      rolesManage: {
        label: "Rôles de gestion",
        description: "Rôles autorisés à gérer les paramètres du dossier",
      },
      rolesCreateThread: {
        label: "Rôles de création de fils",
        description: "Rôles autorisés à créer des fils dans ce dossier",
      },
      rolesPost: {
        label: "Rôles de publication",
        description: "Rôles autorisés à publier des messages",
      },
      rolesModerate: {
        label: "Rôles de modération",
        description: "Rôles autorisés à modérer le contenu",
      },
      rolesAdmin: {
        label: "Rôles administrateur",
        description: "Rôles disposant d'un accès administrateur complet",
      },
      moderatorIds: {
        title: "ID des modérateurs",
        description: "Liste des ID utilisateurs autorisés à modérer ce dossier",
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
          "Une erreur réseau s'est produite lors de la récupération des permissions du dossier",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour voir les permissions du dossier",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission de voir les permissions de ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la récupération des permissions du dossier",
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
    success: {
      title: "Succès",
      description: "Permissions du dossier récupérées",
    },
    backButton: { label: "Retour" },
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
  patch: {
    title: "Mettre à jour les permissions du dossier",
    titleShort: "Accès au dossier",
    description: "Met à jour la liste des modérateurs d'un dossier",
    container: {
      title: "Mettre à jour les permissions du dossier",
      description: "Modifier les permissions d'accès au dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à mettre à jour",
    },
    rolesView: {
      label: "Rôles en lecture",
      description: "Rôles autorisés à voir ce dossier",
    },
    rolesManage: {
      label: "Rôles de gestion",
      description: "Rôles autorisés à gérer les paramètres du dossier",
    },
    rolesCreateThread: {
      label: "Rôles de création de fils",
      description: "Rôles autorisés à créer des fils dans ce dossier",
    },
    rolesPost: {
      label: "Rôles de publication",
      description: "Rôles autorisés à publier des messages",
    },
    rolesModerate: {
      label: "Rôles de modération",
      description: "Rôles autorisés à modérer le contenu",
    },
    rolesAdmin: {
      label: "Rôles administrateur",
      description: "Rôles disposant d'un accès administrateur complet",
    },
    permissions: {
      title: "Mise à jour des permissions",
      moderatorIds: {
        label: "ID des modérateurs",
        description: "Liste des ID utilisateurs autorisés à modérer ce dossier",
      },
    },
    response: {
      title: "Permissions mises à jour",
      rolesView: {
        label: "Rôles en lecture",
        description: "Rôles autorisés à voir ce dossier",
      },
      rolesManage: {
        label: "Rôles de gestion",
        description: "Rôles autorisés à gérer les paramètres du dossier",
      },
      rolesCreateThread: {
        label: "Rôles de création de fils",
        description: "Rôles autorisés à créer des fils dans ce dossier",
      },
      rolesPost: {
        label: "Rôles de publication",
        description: "Rôles autorisés à publier des messages",
      },
      rolesModerate: {
        label: "Rôles de modération",
        description: "Rôles autorisés à modérer le contenu",
      },
      rolesAdmin: {
        label: "Rôles administrateur",
        description: "Rôles disposant d'un accès administrateur complet",
      },
      message: {
        content: "Permissions du dossier mises à jour",
      },
      moderatorIds: {
        title: "Modérateurs actuels",
        description: "Liste mise à jour des modérateurs de ce dossier",
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
          "Une erreur réseau s'est produite lors de la mise à jour des permissions du dossier",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour modifier les permissions du dossier",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas la permission de modifier les permissions de ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la mise à jour des permissions du dossier",
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
    success: {
      title: "Succès",
      description: "Permissions du dossier mises à jour",
    },
    backButton: { label: "Retour" },
    submitButton: {
      label: "Mettre à jour les permissions",
      loadingText: "Mise à jour...",
    },
  },
};
