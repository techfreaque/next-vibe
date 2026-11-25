import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Autriche (ÖKR)",
      DE: "Allemagne (SKR03)",
      XX: "Modèle IFRS générique",
    },
  },
  post: {
    title: "Configurer le plan comptable",
    titleShort: "Configurer le plan comptable",
    description:
      "Complétez les comptes de votre entreprise à partir d’un modèle standard.",
    companyId: {
      label: "Entreprise",
      description: "Choisissez l’entreprise à configurer.",
      placeholder: "Choisir une entreprise",
    },
    country: {
      label: "Modèle de plan comptable",
      description: "Choisissez la structure des comptes à ajouter.",
      placeholder: "Choisir un modèle",
    },
    response: {
      created: "Comptes créés",
      skipped: "Comptes conservés",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour configurer un plan comptable",
      },
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez l’entreprise et le modèle de plan comptable.",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Seuls les propriétaires et administrateurs de l'entreprise peuvent configurer les comptes",
      },
      server: {
        title: "Erreur serveur",
        description: "Réessayez d’appliquer le modèle.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Vérifier la configuration",
        description:
          "Actualisez les comptes de l’entreprise avant d’appliquer le modèle.",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      notFound: {
        title: "Modèle introuvable",
        description: "Aucun modèle de plan comptable pour ce pays",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Plan comptable prêt",
      description:
        "Le modèle a été appliqué. Consultez les comptes ajoutés et conservés.",
    },
    widget: {
      review: "Vérifier la configuration",
      previewLoading: "Recherche des comptes existants…",
      previewFailed: "Le nombre de comptes existants est indisponible.",
      existing: "Comptes existants : {{count}}.",
      empty: "Cette entreprise ne possède pas encore de comptes.",
      consequences:
        "La configuration ajoute les codes de compte manquants du modèle et préserve les données existantes.",
      submit: "Ajouter les comptes du modèle",
      back: "Retour",
      viewAccounts: "Ouvrir le plan comptable",
      viewPeriods: "Voir les périodes comptables",
    },
  },
  title: "Configuration du plan comptable",
  description: "Initialiser les comptes de l'entreprise à partir d'un modèle",
  category: "Plan comptable",
  tag: "Configuration",
};
