import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Démarrage Electron",
  },
  post: {
    title: "Démarrer l'application Electron",
    titleShort: "Démarrer Electron",
    description:
      "Compiler main/preload et ouvrir la fenêtre de bureau Electron (mode dev, sans empaquetage)",
    form: {
      title: "Configuration du démarrage Electron",
      description: "Configurer le démarrage de l'application Electron",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du démarrage",
    },
    fields: {
      port: {
        title: "Port",
        description: "Port du serveur vibe (par défaut : 3000)",
      },
      vibeStart: {
        title: "Lancer vibe start",
        description:
          "Lancer vibe start en arrière-plan avant d'ouvrir la fenêtre",
      },
      success: {
        title: "Succès",
      },
      output: {
        title: "Sortie",
      },
      duration: {
        title: "Durée (ms)",
      },
      errors: {
        title: "Erreurs",
      },
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
        compileFailed: "Échec de la compilation Electron : {{error}}",
        startFailed: "Échec du démarrage d'Electron : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Succès",
      description: "Application Electron démarrée",
    },
  },
};
