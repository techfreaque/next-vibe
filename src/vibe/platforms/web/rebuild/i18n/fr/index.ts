import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestion du serveur",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Recompiler et redémarrer",
    titleShort: "Rebuild",
    description:
      "Recompile l'application et redémarre à chaud le serveur Next.js en cours. Six étapes dans l'ordre : 1) génération de code, 2) vibe check (contrôle qualité du code), 3) build de production Next.js, 4) migrations de base de données, 5) seeding de la base, 6) redémarrage à chaud via SIGUSR1. Le vibe check bloque le build à la moindre erreur : utilisez 'vibe check' ou l'outil MCP check pour voir le détail. ATTENTION : la réponse HTTP peut être tronquée, car le serveur redémarre avant la fin de la réponse.",
    form: {
      title: "Recompiler et redémarrer",
      description: "Recompiler l'application et redémarrer le serveur",
    },
    fields: {
      framework: {
        title: "Framework",
        description: "Framework cible à compiler et redémarrer",
      },
      webpack: {
        title: "Webpack",
        description:
          "Utiliser webpack au lieu de Turbopack (par défaut : true)",
      },
      success: {
        title: "Résultat",
      },
      errors: {
        title: "Erreurs",
      },
      duration: {
        title: "Durée",
      },
      steps: {
        title: "Étapes",
      },
    },
    steps: {
      codegen: "Génération de code",
      vibeCheck: "Vibe check",
      nextBuild: "Build Next.js",
      migrate: "Migrations",
      seed: "Seeding",
      restart: "Redémarrage",
      codegenFailed: "Échec de la génération de code : {{error}}",
      vibeCheckFailed:
        "Vibe check : {{errors}} erreurs, {{warnings}} avertissements. Utilisez 'vibe check' ou l'outil MCP check pour voir le détail.",
      vibeCheckError: "Échec du vibe check : {{error}}",
      buildFailed: "Échec du build Next.js : {{error}}",
      buildOom:
        "Build Next.js tué par le système (probablement par manque de mémoire), signal : {{signal}}",
      buildExitCode: "Le build Next.js s'est terminé avec le code {{code}}",
      migrationFailed: "Échec de la migration : {{error}}",
      seedingFailed: "Échec du seeding : {{error}}",
      restartFailed: "Échec du redémarrage du serveur : {{error}}",
      unknownError: "erreur inconnue",
      noPidFile: "Aucun fichier .vibe-pid trouvé. vibe start tourne-t-il ?",
      invalidPid: "PID invalide dans .vibe-pid : {{pid}}",
      processNotRunning: "Le processus {{pid}} ne tourne pas",
      signalFailed: "Échec de l'envoi de SIGUSR1 : {{error}}",
    },
    errors: {
      validation: {
        title: "Échec de la validation",
        description: "Paramètres de rebuild invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "La connexion réseau a échoué pendant le rebuild",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour recompiler l'application",
      },
      forbidden: {
        title: "Interdit",
        description:
          "Vous n'avez pas l'autorisation de recompiler l'application",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressources de rebuild introuvables",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur est survenue pendant le rebuild",
        buildFailed: "Échec du build : {{error}}",
        migrationsFailed: "Échec des migrations : {{error}}",
        rebuildFailed: "Échec du rebuild : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue est survenue pendant le rebuild",
      },
      conflict: {
        title: "Conflit",
        description: "Un rebuild est déjà en cours",
      },
    },
    success: {
      title: "Rebuild terminé",
      description: "Application recompilée et serveur redémarré",
    },
    widget: {
      rebuildComplete: "Rebuild terminé",
      rebuildFailed: "Échec du rebuild",
      errors: "Erreurs :",
      runRebuild: "Lancer le rebuild",
      runAgain: "Relancer",
      skipped: "ignoré",
    },
  },
};
