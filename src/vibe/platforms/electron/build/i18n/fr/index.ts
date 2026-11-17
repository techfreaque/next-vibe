import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Build Electron",
  },
  post: {
    title: "Compiler l'application Electron",
    titleShort: "Build Electron",
    description:
      "Compiler main/preload avec bun, lancer vibe build, puis empaqueter avec electron-builder",
    form: {
      title: "Configuration du build Electron",
      description: "Configurer les paramètres du build Electron",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse du build",
    },
    fields: {
      viBuild: {
        title: "Lancer vibe build",
        description:
          "Lancer vibe build (Next.js + migrations) avant l'empaquetage",
      },
      generate: {
        title: "Générer les endpoints",
        description: "Régénérer l'index des endpoints avant le build",
      },
      platform: {
        title: "Plateforme cible",
        description: "Plateforme pour laquelle empaqueter",
        options: {
          current: "OS actuel",
          linux: "Linux",
          mac: "macOS",
          win: "Windows",
          all: "Toutes les plateformes",
        },
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
        viBuildFailed: "Échec de vibe build : {{error}}",
        compileFailed: "Échec de la compilation Electron : {{error}}",
        builderFailed: "Échec d'electron-builder : {{error}}",
        buildFailed: "Échec du build Electron : {{error}}",
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
      description: "Application Electron compilée",
    },
  },
};
