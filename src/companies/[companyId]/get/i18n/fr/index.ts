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
    get: "Consulter",
  },
  get: {
    title: "Détails de l'entreprise",
    titleShort: "Entreprise",
    description: "Consulter les informations de l'entreprise",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise à consulter",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "ID d'entreprise invalide",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour voir les détails de l'entreprise",
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
        description:
          "Cette entreprise n'existe pas ou vous n'y avez plus accès",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Entreprise chargée",
      description: "Détails de l'entreprise récupérés",
    },
    widget: {
      backToList: "Entreprises",
      type: "Type de client",
      loadFailed: "Impossible de charger cette entreprise",
      retry: "Réessayer",
      related: "Travailler dans cette entreprise",
      setupAccounting: "Configurer la comptabilité",
      back: "Retour",
      loading: "Chargement de l'entreprise...",
      edit: "Modifier",
      members: "Membres",
      invite: "Inviter un membre",
      chartOfAccounts: "Plan comptable",
      viewInvoices: "Voir les factures",
      viewTerminals: "Voir les terminaux de caisse",
      active: "Active",
      inactive: "Inactive",
      country: "Pays",
      currency: "Devise",
      vatNumber: "N° de TVA intracommunautaire",
      taxId: "Identifiant fiscal",
      email: "E-mail",
      phone: "Téléphone",
      website: "Site web",
      createdAt: "Créée le",
      actions: "Actions",
      modules: {
        accounting: {
          label: "Comptabilité",
        },
        invoices: {
          label: "Factures",
        },
        estimates: {
          label: "Devis",
        },
        bills: {
          label: "Factures fournisseurs",
        },
        pos: {
          label: "Caisse",
        },
        purchasing: {
          label: "Achats",
        },
        inventory: {
          label: "Stocks",
        },
        team: {
          label: "Équipe",
        },
      },
    },
  },
};
