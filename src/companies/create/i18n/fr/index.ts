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
    create: "Créer",
  },
  post: {
    title: "Créer une entreprise",
    titleShort: "Nouvelle entreprise",
    description:
      "Enregistrez une nouvelle entreprise. Vous en devenez automatiquement le propriétaire.",
    name: {
      label: "Nom de l'entreprise",
      description: "Raison sociale de l'entreprise",
      placeholder: "Acme SAS",
    },
    type: {
      label: "Type d'entreprise",
      description: "Modèle commercial : B2B, B2C ou particulier",
      placeholder: "Choisir un type",
    },
    vatNumber: {
      label: "N° de TVA",
      description: "Numéro de TVA intracommunautaire à des fins fiscales",
      placeholder: "DE123456789",
    },
    country: {
      label: "Pays",
      description: "Pays d'immatriculation de l'entreprise",
      placeholder: "Choisir un pays",
    },
    currency: {
      label: "Devise par défaut",
      description: "Devise principale de facturation",
      placeholder: "EUR",
    },
    email: {
      label: "E-mail de l'entreprise",
      description: "Adresse e-mail professionnelle principale",
      placeholder: "contact@entreprise.fr",
    },
    phone: {
      label: "Téléphone de l'entreprise",
      description: "Numéro de téléphone professionnel principal",
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
        description: "Vérifiez les champs du formulaire et réessayez",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour créer une entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas le droit de créer une entreprise",
      },
      conflict: {
        title: "Déjà existante",
        description: "Une entreprise porte déjà ce nom",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur s'est produite de notre côté. Réessayez",
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
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Entreprise créée",
      description:
        "Votre entreprise est prête. Ajoutez des membres pour commencer.",
    },
    response: {
      id: "ID de l'entreprise",
      name: "Nom de l'entreprise",
    },
    widget: {
      viewCompany: "Voir l'entreprise",
      back: "Retour à la liste",
    },
  },
};
