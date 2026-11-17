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
    subtitle: "Configurons votre instance en quelques étapes.",
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
      "Votre instance est prête. Vous pourrez modifier les paramètres à tout moment.",
    goToSettings: "Accéder à tous les paramètres",
    viewAllSettings: "Voir tous les paramètres",
    encryptionNote:
      "Cette valeur sera chiffrée et stockée de façon sécurisée. Elle ne sera jamais lisible en clair.",
    autoGeneratedNote:
      "Générée automatiquement : utilisable telle quelle, ou remplacez-la par votre propre valeur.",
    steps: {
      admin: "Compte admin",
      database: "Base de données",
      security: "Clés de sécurité",
      ai: "Fournisseur IA",
    },
    ai: {
      claudeCodeTitle: "Claude Code (détecté automatiquement)",
      claudeCodeDescription:
        "Utilise votre session Claude CLI locale, sans clé API. Ajoutez OpenRouter ci-dessous pour accéder à plus de 200 modèles supplémentaires.",
      claudeDetected:
        "Claude CLI détecté ! Vérifiez que vous êtes connecté avec `claude login`.",
      claudeNotDetected:
        "Claude CLI introuvable. Installez-le depuis claude.ai/code, puis lancez `claude login`. Ou passez cette étape et utilisez OpenRouter ci-dessous.",
      claudeInstallHint:
        "Facultatif : vous pouvez utiliser OpenRouter ou d'autres fournisseurs à la place.",
      openRouterTitle: "Clé API OpenRouter",
      openRouterDescription:
        "Accédez à tous les modèles IA d'OpenRouter (GPT-4, Claude, Llama et plus). Fonctionne avec Claude Code ou seul.",
      openRouterHint:
        "Obtenez votre clé API gratuite sur openrouter.ai/keys. Aucune carte bancaire requise pour les modèles gratuits.",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Connectez-vous à unbottled.ai pour accéder à tous les modèles IA sans gérer de clés API. Votre instance auto-hébergée passe par le cloud.",
      unbottledConnected: "Connecté à {{url}}",
      unbottledDisconnected: "Non connecté",
      unbottledSignIn: "Se connecter",
      unbottledSigningIn: "Connexion...",
      unbottledDisconnect: "Se déconnecter",
      unbottledEmail: "E-mail",
      unbottledPassword: "Mot de passe",
      unbottledRemoteUrl: "URL du cloud",
      unbottledLoginFailed:
        "Échec de la connexion : vérifiez votre e-mail et votre mot de passe.",
      unbottledConnectionError:
        "Impossible de joindre le serveur. Vérifiez l'URL.",
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
