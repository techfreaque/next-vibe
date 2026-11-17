import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Autriche (AT)",
      DE: "Allemagne (DE)",
      XX: "Générique (XX)",
    },
  },
  tags: {
    companies: "entreprises",
    onboard: "intégration",
    setup: "configuration",
  },
  post: {
    title: "Configurer l'entreprise",
    titleShort: "Configurer",
    description:
      "Configurez une nouvelle entreprise : plan comptable, taux de TVA et compte bancaire par défaut",
    companyId: {
      label: "ID de l'entreprise",
      description: "L'entreprise à configurer",
    },
    country: {
      label: "Pays",
      description:
        "Le pays détermine les taux de TVA et le modèle de plan comptable",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez tous les champs",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour configurer une entreprise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle Administrateur requis",
      },
      conflict: {
        title: "Déjà configurée",
        description: "Cette entreprise est déjà configurée",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de terminer la configuration",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Vérifiez votre connexion",
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
      title: "Entreprise prête",
      description: "Entreprise configurée",
    },
    response: {
      accountsCreated: "Comptes créés",
      accountsSkipped: "Comptes ignorés",
      taxRatesCreated: "Taux de TVA créés",
      cashAccountId: "ID du compte de caisse",
      bankAccountId: "ID du compte bancaire",
      success: "Succès",
    },
  },
};
