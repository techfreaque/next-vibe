import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT (ÖKR)",
      DE: "DE (SKR03)",
      XX: "XX (IFRS générique)",
    },
  },
  post: {
    title: "Initialiser le plan comptable",
    titleShort: "Configuration",
    description:
      "Créez le plan comptable d'une entreprise à partir d'un modèle propre à un pays. Idempotent : vous pouvez le relancer sans risque.",
    companyId: {
      label: "ID de l'entreprise",
      description:
        "L'entreprise dont vous voulez initialiser le plan comptable",
      placeholder: "Saisissez l'UUID de l'entreprise",
    },
    country: {
      label: "Pays",
      description:
        "Référentiel national à utiliser (AT = ÖKR, DE = SKR03, XX = IFRS générique)",
      placeholder: "Choisir un pays",
    },
    response: {
      created: "Comptes créés",
      skipped: "Comptes ignorés (déjà existants)",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous devez être connecté pour configurer un plan comptable",
      },
      validation: {
        title: "Erreur de validation",
        description: "Saisie invalide : vérifiez l'ID d'entreprise et le pays",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Seuls les propriétaires et administrateurs de l'entreprise peuvent configurer les comptes",
      },
      server: {
        title: "Erreur serveur",
        description: "La configuration a échoué. Veuillez réessayer",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "Déjà initialisé",
        description: "Cette entreprise a déjà un plan comptable",
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
      description: "Tous les comptes de l'entreprise ont été créés",
    },
    widget: {
      viewAccounts: "Voir la liste des comptes",
    },
  },
  title: "Configuration du plan comptable",
  description: "Initialiser les comptes de l'entreprise à partir d'un modèle",
  category: "Plan comptable",
  tag: "Configuration",
};
