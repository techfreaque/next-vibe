import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Opérations de base de données",
  tag: "migration",
  post: {
    title: "Générer les migrations",
    titleShort: "Générer les migrations",
    description:
      "Générer les fichiers de migration Drizzle à partir des modifications du schéma",
    form: {
      title: "Configuration de la génération",
      description: "Configurer les options de génération des migrations",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      network: {
        title: "Échec de la génération",
        description: "drizzle-kit generate a échoué",
        detail: "drizzle-kit generate a échoué : {{error}}",
        exitCode: "drizzle-kit generate s'est terminé avec le code {{code}}",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Permissions insuffisantes",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources introuvables",
      },
      server: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue",
      },
      conflict: { title: "Conflit", description: "Conflit détecté" },
    },
    success: {
      title: "Génération réussie",
      description: "Fichiers de migration générés avec succès",
    },
  },
  fields: {
    success: { title: "Statut de réussite" },
    output: { title: "Sortie" },
    duration: { title: "Durée (ms)" },
  },
};
