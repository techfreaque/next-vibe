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
    update: "Modifier",
    management: "Gestion",
  },
  patch: {
    title: "Modifier l'entreprise",
    titleShort: "Modifier l'entreprise",
    description:
      "Modifiez les informations de l'entreprise. Rôle Administrateur ou Propriétaire requis.",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise à modifier",
    },
    name: {
      label: "Nom de l'entreprise",
      description: "Raison sociale de l'entreprise",
      placeholder: "Acme SAS",
    },
    type: {
      label: "Type d'entreprise",
      description: "Modèle commercial",
      placeholder: "Choisir un type",
    },
    vatNumber: {
      label: "N° de TVA",
      description: "Numéro de TVA intracommunautaire",
      placeholder: "DE123456789",
    },
    country: {
      label: "Pays",
      description: "Pays d'immatriculation",
      placeholder: "DE",
    },
    currency: {
      label: "Devise par défaut",
      description: "Devise principale de facturation",
      placeholder: "EUR",
    },
    email: {
      label: "E-mail de l'entreprise",
      description: "E-mail professionnel principal",
      placeholder: "contact@entreprise.fr",
    },
    phone: {
      label: "Téléphone de l'entreprise",
      description: "Téléphone professionnel principal",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Site web",
      description: "URL du site web de l'entreprise",
      placeholder: "https://entreprise.fr",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez le formulaire et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour modifier l'entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Le rôle Administrateur ou Propriétaire est requis pour modifier l'entreprise",
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
      title: "Entreprise mise à jour",
      description: "Informations de l'entreprise enregistrées",
    },
    response: {
      id: "ID de l'entreprise",
      name: "Nom de l'entreprise",
    },
    widget: {
      back: "Retour",
      successLabel: "Entreprise mise à jour",
      viewCompany: "Voir l'entreprise",
    },
  },
};
