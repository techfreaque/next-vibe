import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",
  get: {
    title: "Exporter l'env de production",
    titleShort: "Exporter l'env",
    description:
      "Générer un fichier .env prêt pour la production, avec valeurs déchiffrées, instructions de déploiement et checklist",
    tags: {
      exportEnv: "Exporter l'env",
    },
    response: {
      content: {
        title: "Contenu du fichier env",
      },
      filename: {
        title: "Nom du fichier",
      },
    },
    success: {
      title: "Env exporté",
      description: "Fichier env de production généré avec succès",
    },
    widget: {
      copy: "Copier dans le presse-papiers",
      copied: "Copié !",
      download: "Télécharger .env.prod",
      instructions:
        "Copiez ce fichier sur votre serveur et redémarrez l'application.",
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
        description: "Paramètres introuvables",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de générer le fichier env",
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
