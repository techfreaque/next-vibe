import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Dossiers",
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
    title: "Mettre à jour le dossier",
    titleShort: "Modifier le dossier",
    description: "Met à jour un dossier existant",
    container: {
      title: "Mettre à jour le dossier",
      description: "Modifier les propriétés du dossier",
    },
    id: {
      label: "ID du dossier",
      description: "L'identifiant unique du dossier à mettre à jour",
    },
    sections: {
      updates: {
        title: "Modifications du dossier",
        description: "Champs à mettre à jour",
      },
    },
    name: {
      label: "Nom",
      description: "Le nom du dossier",
    },
    icon: {
      label: "Icône",
      description: "Nom d'icône Lucide ou Simple Icons",
    },
    color: {
      label: "Couleur",
      description: "Code couleur hexadécimal pour le distinguer visuellement",
    },
    parentId: {
      label: "Dossier parent",
      description:
        "Déplacer le dossier sous un autre parent (null pour la racine)",
    },
    expanded: {
      label: "Déplié",
      description: "Indique si le dossier est déplié dans l'interface",
    },
    sortOrder: {
      label: "Ordre de tri",
      description: "Ordre de tri des dossiers",
    },
    pinned: {
      label: "Épinglé",
      description: "Épingler ce dossier en haut de la barre latérale",
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
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Mis à jour le",
        },
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Les données fournies sont invalides",
        circularReference:
          "Un dossier ne peut pas être son propre dossier parent",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour modifier des dossiers",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas la permission de modifier ce dossier",
      },
      notFound: {
        title: "Introuvable",
        description: "Le dossier demandé est introuvable",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur s'est produite lors de la mise à jour du dossier",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un dossier portant ce nom existe déjà",
      },
    },
    success: {
      title: "Succès",
      description: "Dossier mis à jour",
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Mettre à jour",
      loadingText: "Mise à jour...",
    },
  },
};
