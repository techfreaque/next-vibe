import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Entreprises",
  tags: {
    companies: "Entreprises",
    create: "Créer",
    list: "Liste",
    get: "Consulter",
    update: "Modifier",
    members: "Membres",
    invite: "Inviter",
    management: "Gestion",
  },
  endpointCategories: {
    companies: "Entreprises",
    companyManagement: "Gestion de l'entreprise",
    companyMembers: "Membres de l'entreprise",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Particulier",
    },
    companyMemberRole: {
      owner: "Propriétaire",
      admin: "Administrateur",
      member: "Membre",
      accountant: "Comptable",
      viewer: "Lecteur",
    },
  },

  // Shared auth/repository error messages
  auth: {
    errors: {
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas le droit d'effectuer cette action",
      },
      notFound: {
        title: "Entreprise introuvable",
        description: "Cette entreprise n'existe pas",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite. Réessayez",
      },
      patchNotFound: {
        title: "Entreprise introuvable",
        description: "Impossible de trouver l'entreprise à modifier",
      },
      patchServer: {
        title: "Erreur serveur",
        description: "Échec de la mise à jour de l'entreprise",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Modifier le rôle du membre",
      titleShort: "Modifier le rôle",
      description: "Changez le rôle d'un membre. Réservé au Propriétaire.",
      companyId: { label: "ID de l'entreprise", description: "Entreprise" },
      memberId: { label: "ID du membre", description: "Le membre à modifier" },
      role: {
        label: "Nouveau rôle",
        description: "Rôle à attribuer à ce membre",
        placeholder: "Choisir un rôle",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Saisie invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour modifier les rôles des membres",
        },
        forbidden: {
          title: "Réservé au Propriétaire",
          description:
            "Seul le Propriétaire de l'entreprise peut changer les rôles des membres",
        },
        conflict: { title: "Conflit", description: "Conflit de données" },
        server: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite. Réessayez",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Membre introuvable",
          description: "Ce membre n'existe pas dans l'entreprise",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Rôle mis à jour",
        description: "Le rôle du membre a été modifié",
      },
      response: {
        memberId: "ID du membre",
        role: "Nouveau rôle",
      },
      widget: {
        back: "Retour aux membres",
        successLabel: "Rôle mis à jour",
        title: "Changer le rôle du membre",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Retirer le membre",
      titleShort: "Retirer le membre",
      description:
        "Retirez un membre de l'entreprise. Le dernier Propriétaire ne peut pas être retiré.",
      companyId: { label: "ID de l'entreprise", description: "Entreprise" },
      memberId: { label: "ID du membre", description: "Le membre à retirer" },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Saisie invalide",
        },
        unauthorized: {
          title: "Non connecté",
          description: "Connectez-vous pour retirer des membres",
        },
        forbidden: {
          title: "Accès refusé",
          description:
            "Rôle Propriétaire ou Administrateur requis. Le dernier Propriétaire ne peut pas être retiré.",
        },
        conflict: {
          title: "Dernier Propriétaire",
          description:
            "Impossible de retirer le dernier Propriétaire de l'entreprise",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur s'est produite. Réessayez",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue s'est produite",
        },
        network: {
          title: "Erreur réseau",
          description: "Vérifiez votre connexion et réessayez",
        },
        notFound: {
          title: "Membre introuvable",
          description: "Ce membre n'existe pas dans l'entreprise",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
      success: {
        title: "Membre retiré",
        description: "Le membre a été retiré de l'entreprise",
      },
      response: {
        removedMemberId: "ID du membre retiré",
      },
      widget: {
        back: "Retour aux membres",
        successLabel: "Membre retiré",
        confirmTitle: "Retirer ce membre ?",
        confirmDescription:
          "Il perdra immédiatement l'accès à cette entreprise. Action irréversible.",
        confirmButton: "Oui, retirer le membre",
        cancelButton: "Annuler",
      },
    },
  },
};
