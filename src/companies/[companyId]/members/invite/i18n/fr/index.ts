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
    invite: "Inviter",
  },
  post: {
    title: "Inviter un membre",
    titleShort: "Inviter un membre",
    description: "Invitez un utilisateur inscrit dans l'entreprise par e-mail",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise dans laquelle inviter l'utilisateur",
    },
    email: {
      label: "E-mail de l'utilisateur",
      description: "E-mail de l'utilisateur inscrit à inviter",
      placeholder: "collegue@entreprise.fr",
    },
    role: {
      label: "Rôle",
      description: "Le rôle attribué au nouveau membre",
      placeholder: "Choisir un rôle",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez l'e-mail et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour inviter des membres",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Le rôle Administrateur ou Propriétaire est requis pour inviter des membres",
      },
      conflict: {
        title: "Déjà membre",
        description: "Cet utilisateur est déjà membre de l'entreprise",
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
        title: "Utilisateur introuvable",
        description: "Aucun utilisateur inscrit avec cet e-mail",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Membre invité",
      description: "L'utilisateur a été ajouté à l'entreprise",
    },
    response: {
      memberId: "ID du membre",
      userId: "ID de l'utilisateur",
      role: "Rôle",
    },
    widget: {
      back: "Retour aux membres",
      invited: "Membre invité",
    },
  },
};
