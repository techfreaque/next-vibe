import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  get: {
    title: "Générer une clé secrète",
    titleShort: "Générer une clé",
    description:
      "Générer une clé hexadécimale aléatoire de 64 caractères, cryptographiquement sûre",
    tags: {
      generateKey: "Générer une clé",
    },
    response: {
      key: {
        title: "Clé générée",
      },
    },
    success: {
      title: "Clé générée",
      description: "Clé sécurisée générée avec succès",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      notFound: {
        title: "Introuvable",
        description: "Introuvable",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de générer la clé",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu",
      },
    },
  },
};
