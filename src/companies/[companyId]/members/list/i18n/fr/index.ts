import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  tags: {
    companies: "Entreprises",
    members: "Membres",
    list: "Liste",
  },
  get: {
    title: "Membres de l'équipe",
    titleShort: "Membres de l'équipe",
    description: "Liste de tous les membres de cette entreprise",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise dont vous voulez lister les membres",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID d'entreprise invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les membres de l'entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'êtes pas membre de cette entreprise",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit de données",
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
        title: "Entreprise introuvable",
        description: "Cette entreprise n'existe pas",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Membres chargés",
      description: "Liste des membres récupérée",
    },
    response: {
      id: "ID du membre",
      userId: "ID de l'utilisateur",
      email: "E-mail",
      name: "Nom",
      role: "Rôle",
      isActive: "Actif",
      joinedAt: "Arrivé le",
    },
    widget: {
      back: "Retour",
      loading: "Chargement des membres...",
      title: "Membres de l'équipe",
      memberSingular: "membre",
      memberPlural: "membres",
      invite: "Inviter un membre",
      updateRole: "Changer le rôle",
      remove: "Retirer",
      active: "Actif",
      inactive: "Inactif",
      empty: {
        title: "Aucun membre pour l'instant",
        hint: "Invitez vos collègues à gérer avec vous la comptabilité et les opérations de cette entreprise.",
        cta: "Inviter un premier membre",
      },
    },
  },
};
