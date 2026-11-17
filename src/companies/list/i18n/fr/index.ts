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
    list: "Liste",
  },
  get: {
    title: "Mes entreprises",
    titleShort: "Mes entreprises",
    description: "Les entreprises dont vous êtes membre",
    page: {
      label: "Page",
      description: "Numéro de page (à partir de 1)",
    },
    pageSize: {
      label: "Par page",
      description: "Résultats par page (100 max.)",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir vos entreprises",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès refusé",
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
        title: "Introuvable",
        description: "Aucune entreprise trouvée",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Entreprises chargées",
      description: "Liste des entreprises récupérée",
    },
    widget: {
      back: "Retour",
      loading: "Chargement des entreprises...",
      title: "Mes entreprises",
      create: "Nouvelle entreprise",
      total: "entreprises",
      totalSingular: "entreprise",
      inactive: "Inactive",
      empty: {
        title: "Aucune entreprise pour l'instant",
        hint: "Créez une entreprise pour gérer votre comptabilité, votre facturation et votre équipe.",
        cta: "Créer votre première entreprise",
      },
    },
    response: {
      total: "Total",
      id: "ID",
      name: "Nom",
      type: "Type",
      role: "Votre rôle",
      isActive: "Active",
      country: "Pays",
      currency: "Devise",
      email: "E-mail",
      createdAt: "Créée le",
    },
  },
};
