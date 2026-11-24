import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Système",

  errors: {
    readFailed: "Impossible de lire les paramètres système",
    writeFailed: "Impossible d'écrire les paramètres dans le fichier .env",
    readOnly: "La configuration est en lecture seule dans cet environnement",
    defaultPasswordDetected: "Mot de passe admin par défaut détecté",
    passwordNotConfigured: "Mot de passe admin non configuré",
  },

  messages: {
    settingsUpdated: "Paramètres mis à jour",
  },

  get: {
    title: "Paramètres système",
    titleShort: "Paramètres système",
    description:
      "Consulter et gérer la configuration de l'environnement, regroupée par module",
    tags: {
      settings: "Paramètres",
    },
    response: {
      modules: {
        title: "Modules de configuration",
      },
      isWritable: {
        title: "Modifiable",
      },
      isDevMode: {
        title: "Mode dev",
      },
      needsOnboarding: {
        title: "Configuration initiale requise",
      },
      onboardingIssues: {
        title: "Problèmes de configuration initiale",
      },
      wizardSteps: {
        title: "Étapes de l'assistant de configuration",
      },
    },
    success: {
      title: "Paramètres chargés",
      description: "Paramètres d'environnement récupérés avec succès",
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
        description: "Impossible de charger les paramètres",
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

  patch: {
    title: "Mettre à jour les paramètres",
    titleShort: "Mettre à jour",
    description:
      "Mettre à jour les valeurs de configuration de l'environnement dans le fichier .env",
    tags: {
      settings: "Paramètres",
    },
    fields: {
      settings: {
        label: "Paramètres",
        description: "Paires clé-valeur à mettre à jour",
      },
    },
    response: {
      updated: {
        title: "Clés mises à jour",
      },
      needsRestart: {
        title: "Redémarrage requis",
      },
      resultMessage: {
        title: "Paramètres mis à jour",
      },
    },
    success: {
      title: "Paramètres enregistrés",
      description: "Paramètres d'environnement mis à jour avec succès",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Valeurs de paramètres invalides",
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
        description: "Impossible d'enregistrer les paramètres",
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

  widget: {
    title: "Configuration système",
    subtitle: "Variables d'environnement regroupées par module",
    readOnlyBanner:
      "La configuration est en lecture seule. Modifiez directement le fichier .env ou utilisez la CLI.",
    onboardingBanner:
      "Configuration requise : renseignez les champs en surbrillance pour commencer.",
    defaultPasswordWarning:
      "Mot de passe admin par défaut détecté ! Changez-le immédiatement.",
    cancel: "Annuler",
    save: "Enregistrer",
    saving: "Enregistrement...",
    apply: "Appliquer et redémarrer",
    applying: "Application...",
    saved: "Paramètres enregistrés",
    restartRequired:
      "Paramètres enregistrés. Un redémarrage est nécessaire pour appliquer les modifications.",
    devRestartHint:
      "Redémarrez le serveur de dev (Ctrl+C puis vibe dev) pour appliquer les modifications.",
    notSet: "non défini",
    configured: "Configuré",
    partial: "Partiel",
    notConfigured: "Non configuré",
    required: "Requis",
    selectPlaceholder: "Sélectionner...",
    boolTrue: "activé",
    boolFalse: "désactivé",
    logPathDisabled: "journalisation dans un fichier désactivée",
    openSetup: "Ouvrir la configuration",
    restartWizard: "Assistant de configuration",
    exportProd: "Exporter pour la production",
    generate: "Générer",
    editConfirmHint: "[Entrée] confirmer  [Échap] annuler",
    editSettings: "Modifier les paramètres",
    exit: "Quitter",
    loading: "Chargement des paramètres...",
    moduleLabels: {
      env: "Cœur",
      agent: "Fournisseurs IA",
      leadsCampaigns: "Campagnes de leads",
      messenger: "Messagerie / SMTP",
      imap: "IMAP",
      payment: "Paiements",
      sms: "SMS",
      serverSystem: "Serveur / Plateforme",
    },
  },

  wizard: {
    title: "Bienvenue dans la configuration Vibe",
    subtitle: "Trois étapes rapides, et vous discutez.",
    alreadyConfigured: "Déjà configuré",
    stepOf: "Étape {{step}} sur {{total}}",
    next: "Suivant",
    continue: "Continuer",
    back: "Retour",
    skip: "Passer cette étape",
    finish: "Terminer la configuration",
    restart: "Relancer l'assistant",
    done: "Configuration terminée",
    doneSubtitle:
      "Votre instance est prête. Modifiez chaque paramètre plus tard via Voir tous les paramètres.",
    goToSettings: "Accéder à tous les paramètres",
    startChatting: "Commencer à discuter",
    viewAllSettings: "Voir tous les paramètres",
    encryptionNote: "Stockée chiffrée. Personne ne peut la relire en clair.",
    autoGeneratedNote: "Générée pour vous. Gardez-la ou collez la vôtre.",
    steps: {
      admin: "Compte admin",
      database: "Base de données",
      security: "Clés de sécurité",
      ai: "Fournisseur IA",
    },
    ai: {
      claudeCodeTitle: "Claude Code (détecté sur cette machine)",
      claudeCodeDescription:
        "Utilise votre session Claude CLI locale. Aucune clé API.",
      claudeDetected:
        "Claude CLI trouvé. Vérifiez que vous êtes connecté avec `claude login`.",
      claudeNotDetected:
        "Claude CLI introuvable. Installez-le depuis claude.ai/code et lancez `claude login`, ou choisissez une autre option sur cette page.",
      claudeInstallHint:
        "Facultatif. Votre compte unbottled.ai ou une clé OpenRouter font tout aussi bien l'affaire.",
      openRouterTitle: "Clé API OpenRouter",
      openRouterDescription:
        "Des centaines de modèles avec une seule clé. Seule ou avec Claude Code.",
      openRouterHint:
        "Obtenez une clé sur openrouter.ai/keys. Les modèles gratuits ne demandent pas de carte bancaire.",
      recommended: "Recommandé",
      unbottledTitle: "Votre compte unbottled.ai",
      unbottledDescription:
        "Connectez-vous une fois et cette instance accède à tous les modèles d'unbottled.ai. Les conversations restent dans votre base de données, l'usage des modèles est débité de vos crédits. Abonnement payant ou pack de crédits requis.",
      unbottledNoAccount:
        "Pas encore de compte ? Créez-le sur unbottled.ai, puis connectez-vous ici.",
      unbottledConnected: "Connecté à {{url}}",
      unbottledDisconnected: "Non connecté",
      unbottledSignIn: "Se connecter",
      unbottledSigningIn: "Connexion...",
      unbottledDisconnect: "Se déconnecter",
      unbottledEmail: "E-mail",
      unbottledPassword: "Mot de passe",
      unbottledRemoteUrl: "URL du cloud",
      unbottledLoginFailed:
        "Échec de la connexion. Vérifiez votre e-mail et votre mot de passe.",
      unbottledConnectionError:
        "Impossible de joindre le serveur. Vérifiez l'URL.",
      orDivider: "Ou votre propre fournisseur",
    },
  },

  post: {
    title: "Se connecter à unbottled.ai",
    titleShort: "Connexion Unbottled",
    description:
      "Connexion via proxy côté serveur : vos identifiants ne quittent jamais votre serveur",
    tags: { settings: "Connexion Unbottled" },
    fields: {
      email: {
        label: "E-mail",
        description: "E-mail du compte unbottled.ai",
        placeholder: "vous@exemple.com",
      },
      password: {
        label: "Mot de passe",
        description: "Mot de passe du compte unbottled.ai",
        placeholder: "Mot de passe",
      },
      remoteUrl: {
        label: "URL distante",
        description: "URL de l'instance unbottled.ai",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Identifiant",
        description: "Chaîne d'identifiant encodée",
      },
      syncScope: {
        label: "Périmètre de synchronisation",
        description: "Les données synchronisées via cette connexion.",
      },
    },
    success: { title: "Connecté", description: "Identifiant récupéré" },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez l'e-mail, le mot de passe et l'URL",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Accès administrateur requis",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      network: {
        title: "Échec de la connexion",
        description: "Impossible de joindre l'instance distante",
      },
      server: {
        title: "Échec de la connexion",
        description: "E-mail ou mot de passe incorrect",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
    },
  },

  export: {
    title: "Exporter pour la production",
    subtitle:
      "Générez un fichier .env prêt à déployer sur votre serveur. Les valeurs sensibles apparaissent en clair : conservez ce fichier en lieu sûr.",
    copyButton: "Copier dans le presse-papiers",
    copied: "Copié !",
    downloadButton: "Télécharger .env.prod",
    instructions:
      "Copiez ce fichier sur votre serveur :\n  scp .env.prod user@yourserver:/app/.env\nOu collez-le manuellement :\n  ssh user@yourserver && nano /app/.env",
    checklist: "Checklist de déploiement",
    close: "Fermer",
  },
};
