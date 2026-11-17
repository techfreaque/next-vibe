import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  roles: {
    widget: {
      added: "Rôle attribué : {{role}}",
      removed: "Rôle retiré : {{role}}",
      removeWarning:
        "L'utilisateur perd toutes les autorisations de ce rôle dès sa prochaine requête.",
      addHint: "Effectif dès la prochaine requête de l'utilisateur.",
    },
    post: {
      title: "Ajouter un rôle",
      titleShort: "Ajouter un rôle",
      description: "Attribuer un rôle à un compte utilisateur",
      container: {
        title: "Ajouter un rôle",
        description: "Choisissez un rôle à attribuer à cet utilisateur",
      },
      id: {
        label: "ID utilisateur",
        description: "Identifiant unique de l'utilisateur qui reçoit le rôle",
        placeholder: "Saisir l'ID utilisateur...",
      },
      role: {
        label: "Rôle",
        description: "Le rôle à attribuer à l'utilisateur",
        placeholder: "Choisir un rôle...",
      },
      submit: {
        label: "Ajouter le rôle",
      },
      response: {
        roleId: {
          content: "ID d'attribution du rôle",
        },
        userId: {
          content: "ID utilisateur",
        },
        assignedRole: {
          content: "Rôle attribué",
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour gérer les rôles",
        },
        validation: {
          title: "Échec de la validation",
          description: "Indiquez un ID utilisateur et un rôle valides",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Seuls les administrateurs peuvent gérer les rôles",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur indiqué est introuvable",
          detail: "Aucun utilisateur avec l'ID {{userId}}.",
        },
        conflict: {
          title: "Rôle déjà attribué",
          description: "Cet utilisateur possède déjà ce rôle",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible d'ajouter le rôle suite à une erreur serveur",
          detail:
            "Impossible d'attribuer le rôle {{role}} à l'utilisateur {{userId}}.",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors de l'ajout du rôle",
        },
      },
      success: {
        title: "Rôle ajouté",
        description: "Le rôle a bien été attribué à l'utilisateur",
      },
    },
    delete: {
      title: "Retirer un rôle",
      titleShort: "Retirer un rôle",
      description: "Révoquer un rôle d'un compte utilisateur",
      container: {
        title: "Retirer un rôle",
        description: "Choisissez un rôle à révoquer pour cet utilisateur",
      },
      id: {
        label: "ID utilisateur",
        description:
          "Identifiant unique de l'utilisateur dont le rôle est révoqué",
        placeholder: "Saisir l'ID utilisateur...",
      },
      role: {
        label: "Rôle",
        description: "Le rôle à révoquer",
        placeholder: "Choisir un rôle...",
      },
      submit: {
        label: "Retirer le rôle",
      },
      response: {
        success: {
          content: "Rôle retiré",
        },
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté pour gérer les rôles",
        },
        validation: {
          title: "Échec de la validation",
          description: "Indiquez un ID utilisateur et un rôle valides",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Seuls les administrateurs peuvent gérer les rôles",
        },
        notFound: {
          title: "Utilisateur introuvable",
          description: "L'utilisateur indiqué est introuvable",
          detail: "Aucun utilisateur avec l'ID {{userId}}.",
        },
        conflict: {
          title: "Conflit",
          description:
            "Impossible de retirer le rôle : des dépendances existent",
        },
        network: {
          title: "Erreur réseau",
          description: "Impossible de joindre le serveur",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vos modifications non enregistrées seront perdues",
        },
        server: {
          title: "Erreur serveur",
          description:
            "Impossible de retirer le rôle suite à une erreur serveur",
          detail:
            "Impossible de retirer le rôle {{role}} à l'utilisateur {{userId}}.",
        },
        unknown: {
          title: "Erreur inconnue",
          description:
            "Une erreur inattendue s'est produite lors du retrait du rôle",
        },
      },
      success: {
        title: "Rôle retiré",
        description: "Le rôle a bien été révoqué",
      },
    },
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Client",
      partnerAdmin: "Admin partenaire",
      partnerEmployee: "Employé partenaire",
      admin: "Admin",
      cliOff: "CLI désactivée",
      cliAuthBypass: "Contournement d'auth CLI",
      aiToolOff: "Outil IA désactivé",
      webOff: "Web désactivé",
      mcpOff: "MCP désactivé",
      mcpVisible: "MCP visible",
      productionOff: "Production désactivée",
      skillOff: "Skill désactivé",
    },
  },
};
