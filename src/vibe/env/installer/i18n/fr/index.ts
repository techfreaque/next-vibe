import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Installer {{appName}}",
    description:
      "Progression de l'installation locale et configuration optionnelle d'un dépôt GitHub privé.",
  },
  enums: {
    stepStatus: {
      done: "Prêt",
      inProgress: "En cours",
      pending: "En attente",
      skipped: "Ignoré",
      error: "Action requise",
    },
    action: {
      refresh: "Revérifier l'état",
      githubAuthStart: "Se connecter à GitHub",
      githubAuthCheck: "Vérifier la connexion GitHub",
      githubCreatePrivateRepo: "Créer le dépôt privé",
      githubSkip: "Ignorer GitHub",
      githubReset: "Configurer GitHub",
    },
    checkoutMode: {
      cloned: "Clonage neuf",
      existing: "Copie existante conservée",
      unknown: "Copie locale",
    },
  },
  get: {
    title: "État de l'installeur",
    titleShort: "Installeur",
    description:
      "Vérifier l'avancement de l'installation locale, le dossier du dépôt et la configuration GitHub optionnelle.",
    tags: {
      installer: "Installeur",
    },
    success: {
      title: "État chargé",
      description: "L'état local de l'installation a été récupéré.",
    },
    response: {
      installDir: { title: "Dossier d'installation" },
      os: { title: "Système d'exploitation" },
      arch: { title: "Architecture" },
      checkoutMode: { title: "Mode du dépôt" },
      branch: { title: "Branche Git" },
      originUrl: { title: "Remote origin" },
      upstreamUrl: { title: "Remote upstream" },
      port: { title: "Port local" },
      stateFilePath: { title: "Fichier d'état" },
      updatedAt: { title: "Dernière mise à jour" },
      lastError: { title: "Dernière erreur" },
      steps: { title: "Étapes d'installation" },
      github: { title: "État GitHub" },
      setup: { title: "État de la configuration" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête d'état invalide.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise.",
      },
      forbidden: {
        title: "Usage local uniquement",
        description:
          "L'installeur est disponible uniquement sur une instance locale en première installation.",
      },
      notFound: {
        title: "Introuvable",
        description: "État de l'installeur introuvable.",
      },
      network: {
        title: "Erreur réseau",
        description: "La requête réseau a échoué.",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lire l'état local de l'installation.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue.",
      },
      unsavedChanges: {
        title: "Conflit",
        description: "L'état a changé pendant la lecture.",
      },
      conflict: {
        title: "Conflit",
        description: "Conflit sur l'état de l'installeur.",
      },
    },
  },
  post: {
    title: "Exécuter une action d'installation",
    titleShort: "Action installeur",
    description:
      "Actualiser les vérifications locales ou configurer un dépôt GitHub privé.",
    tags: {
      installer: "Installeur",
    },
    request: {
      action: {
        label: "Action",
        description: "Action d'installation à exécuter.",
      },
      repoName: {
        label: "Nom du dépôt privé",
        description: "Nom du dépôt sur votre compte GitHub.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Résultat" },
    },
    success: {
      title: "Action terminée",
      description: "L'action d'installation s'est terminée avec succès.",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Action ou nom de dépôt invalide.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise.",
      },
      forbidden: {
        title: "Usage local uniquement",
        description:
          "Les actions d'installation ne sont disponibles que sur une instance locale.",
      },
      notFound: {
        title: "Introuvable",
        description: "Un outil local requis est introuvable.",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Impossible de joindre GitHub. Vérifiez votre connexion et réessayez.",
      },
      server: {
        title: "Erreur serveur",
        description: "L'action d'installation a échoué.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue.",
      },
      unsavedChanges: {
        title: "Conflit",
        description: "L'état a changé pendant l'action.",
      },
      conflict: {
        title: "Le dépôt existe déjà",
        description: "Conflit avec un dépôt GitHub existant.",
      },
    },
  },
  errors: {
    localOnly:
      "L'installeur est uniquement disponible sur une instance locale en première installation.",
    invalidRepoName:
      "Utilisez des lettres, chiffres, points, tirets ou underscores (100 caractères maximum).",
    ghNotInstalled:
      "GitHub CLI (gh) n'est pas installé sur cette machine. Utilisez les étapes manuelles ci-dessous ou ignorez cette étape.",
    ghAuthStartFailed:
      "Impossible de lancer la connexion GitHub par appareil. Exécutez 'gh auth login --web' dans votre terminal ou suivez les étapes manuelles.",
    ghNotSignedIn: "Connectez-vous d'abord à GitHub puis réessayez.",
    ghCreateFailed:
      "Impossible de créer ou de pousser vers le dépôt GitHub privé. Vérifiez vos droits GitHub et réessayez.",
  },
  actions: {
    refreshed: "Vérifications de l'environnement actualisées.",
    githubAuthPending:
      "Saisissez le code à usage unique sur GitHub puis cliquez sur Vérifier la connexion.",
    githubAuthReady: "Connecté à GitHub en tant que {{username}}.",
    githubAuthWaiting:
      "En attente de validation de la connexion GitHub dans votre navigateur.",
    githubRepoCreated: "Dépôt privé connecté et synchronisé.",
    githubSkipped:
      "Configuration GitHub ignorée. Vous pourrez connecter un dépôt plus tard.",
    githubReset: "Configuration GitHub rouverte.",
  },
  widget: {
    progressOf: "{{done}} étapes sur {{total}} prêtes",
    title: "Votre installation locale est prête.",
    titleIncomplete: "Terminer votre installation locale",
    subtitle:
      "next-vibe tourne sur votre machine. Connectez un dépôt GitHub privé si vous le souhaitez, puis passez à l'assistant de configuration.",
    subtitleIncomplete:
      "Vérifiez les étapes ci-dessous, corrigez les éléments signalés, puis continuez vers l'assistant de configuration.",
    checkoutLabel: "Dossier",
    stateFileLabel: "Fichier d'état",
    recheck: "Revérifier",
    rechecking: "Vérification...",
    copy: "Copier",
    copied: "Copié",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Git est introuvable dans PATH.",
        missingRecovery:
          "Installez git, ouvrez un nouveau terminal et relancez l'installeur.",
      },
      bun: {
        title: "Runtime Bun",
        missingDetail: "Bun est introuvable dans PATH.",
        missingRecovery:
          "Installez Bun depuis https://bun.sh et relancez l'installeur.",
      },
      clone: {
        title: "Copie next-vibe",
        clonedDetail: "Cloné dans {{dir}}",
        existingDetail: "Copie existante conservée dans {{dir}}",
        unknownDetail: "Exécuté depuis {{dir}}",
      },
      dependencies: {
        title: "Dépendances et CLI",
        readyDetail: "Paquets installés et CLI vibe prêt.",
        missingDetail: "node_modules est incomplet.",
        missingRecovery: "Exécutez 'bun install' dans votre dossier projet.",
      },
      github: {
        title: "Dépôt GitHub privé",
        optionalTag: "Optionnel",
        connectedDetail: "Origin pointe vers {{url}}",
        skippedDetail:
          "Ignoré pour l'instant. Les mises à jour proviennent toujours de next-vibe.",
        pendingDetail:
          "Optionnel. Gardez votre propre copie privée sur GitHub.",
      },
      server: {
        title: "Serveur local",
        readyDetail: "Actif sur http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Dépôt GitHub privé",
      badge: "Optionnel",
      body: "Créez votre propre dépôt privé afin de garder vos modifications privées sur GitHub tout en conservant upstream vers next-vibe.",
      connectedTitle: "Dépôt privé connecté",
      connectedOpen: "Ouvrir sur GitHub",
      skippedNotice:
        "Configuration GitHub ignorée. Vous pouvez connecter un dépôt privé à tout moment.",
      reopenButton: "Configurer GitHub",
      skipButton: "Ignorer pour l'instant",
      signedInAs: "Connecté à GitHub en tant que {{username}}",
      repoNameLabel: "Nom du dépôt privé",
      repoNameHelp:
        "Créé en privé sur votre compte GitHub. Upstream reste lié à next-vibe.",
      createButton: "Créer le dépôt privé",
      creatingButton: "Création et envoi...",
      signInButton: "Se connecter à GitHub",
      startingSignIn: "Lancement de la connexion...",
      deviceTitle: "Valider la connexion sur GitHub",
      deviceBody:
        "Copiez le code à usage unique ci-dessous, ouvrez la page appareil GitHub et autorisez l'accès. Aucun jeton n'est enregistré ici.",
      deviceOpenLink: "Ouvrir la page appareil GitHub",
      deviceCheckButton: "Connexion terminée, revérifier",
      manualTitle: "Configuration manuelle (sans GitHub CLI)",
      manualBody:
        "GitHub CLI (gh) n'est pas installé. Créez un dépôt privé vide sur GitHub puis exécutez ces trois commandes dans le dossier du projet.",
      manualNewRepoLink: "Créer un dépôt privé sur GitHub",
      manualShowCommands: "Afficher les commandes git",
      manualHideCommands: "Masquer les commandes git",
    },
    handover: {
      continueToSetup: "Continuer vers l'assistant de configuration",
      openApp: "Ouvrir l'application",
      hint: "Ensuite : créez votre accès admin et connectez votre compte unbottled.ai ou vos clés API.",
      completeHint:
        "La configuration initiale est déjà terminée sur cette instance.",
    },
  },
};
