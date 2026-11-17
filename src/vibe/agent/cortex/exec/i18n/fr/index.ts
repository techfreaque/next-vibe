import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Exécuter une commande",
    titleShort: "Lancer une commande",
    description:
      "Exécute une commande shell sur une machine. Fonctionne uniquement sur les chemins /ssh/. Terminal persistant : le cwd est conservé d'un appel à l'autre. Les nouvelles sessions démarrent dans le répertoire de montage par défaut s'il est configuré.",
    dynamicTitle: "{{path}} : {{command}}",
    status: {
      loading: "Exécution...",
      done: "Terminé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Machine",
        description:
          'Chemin de la machine SSH. Doit commencer par /ssh/. Utilisez cortex-list(path="/ssh") pour trouver les machines et leurs montages.',
      },
      command: {
        label: "Commande",
        description: "Commande shell à exécuter",
        placeholder: "echo hello",
      },
      workingDir: {
        label: "Répertoire de travail",
        description:
          "Remplace le cwd pour cette commande. S'il est omis, le répertoire courant du terminal est utilisé.",
        placeholder: "/home/user/project",
      },
      terminalId: {
        label: "ID du terminal",
        description:
          "Réutiliser une session de terminal précise. S'il est omis, le terminal par défaut de cette connexion est utilisé.",
      },
      timeoutMs: {
        label: "Délai max (ms)",
        description:
          "Durée d'exécution maximale. Par défaut 30000 ms. Maximum 300000 ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Exécuter",
      loadingText: "Exécution...",
    },
    response: {
      output: { content: "Sortie" },
      exitCode: { title: "Code de sortie" },
      cwd: { content: "Répertoire de travail" },
      terminalId: { content: "ID du terminal" },
      backend: { title: "Backend" },
      truncated: { title: "Tronqué" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin et la commande",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Aucune permission pour cette machine",
      },
      notFound: {
        title: "Machine introuvable",
        description: "Aucune connexion SSH ni instance distante à ce chemin",
      },
      server: {
        title: "Échec de l'exécution",
        description: "L'exécution de la commande a échoué",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: {
        title: "Conflit de session",
        description: "La session de terminal est occupée",
      },
    },
    success: {
      title: "Commande terminée",
      description: "Commande exécutée",
    },
  },
  errors: {
    invalidWorkingDir:
      "Le répertoire de travail doit être un chemin absolu sans '..'",
    commandTimedOut: "Délai de la commande dépassé",
    invalidPath: "Le chemin doit commencer par /ssh/",
    noConnection: "Aucune connexion trouvée à ce chemin",
    connectionNotFound: "Connexion introuvable",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
    connectTimeout: "Délai de connexion dépassé",
    sshAuthFailed: "Échec de l'authentification SSH",
    sshConnectionFailed: "Échec de la connexion SSH",
    fingerprintMismatch:
      "L'empreinte de l'hôte a changé : risque de sécurité possible. Supprimez puis rajoutez la connexion.",
    remoteNotSupported:
      "L'exécution via une connexion distante n'est pas encore prise en charge. Utilisez une connexion SSH directe.",
  },
  log: {
    execComplete: "Commande exécutée",
    openedLocal: "Terminal local ouvert",
    failedLocal: "Impossible d'ouvrir le terminal local",
    openedSsh: "Terminal SSH ouvert",
    failedFingerprint: "Impossible d'enregistrer l'empreinte",
    failedPty: "Impossible d'ouvrir le PTY SSH",
    escalated: "Commande longue basculée en tâche d'arrière-plan",
  },
  widget: {
    title: "Terminal",
    back: "Retour",
    machineLabel: "Machine",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Saisissez une commande...",
    runButton: "Exécuter",
    running: "Exécution...",
    clearButton: "Effacer",
    ctrlEnterHint: "Ctrl+Entrée pour exécuter",
    exitCodeLabel: "Code de sortie",
    backendLabel: "Backend",
    cwdLabel: "Répertoire de travail",
    terminalLabel: "Terminal",
    truncatedWarning: "Sortie tronquée",
    emptyOutput: "Aucune sortie",
    outputLabel: "La sortie s'affiche ici",
    outputTitle: "Sortie",
    historyTitle: "Historique",
    noHistory: "Aucune commande pour l'instant",
    manageConnections: "Connexions",
    viewTerminals: "Terminaux",
    successStatus: "Réussi",
    failedStatus: "Échec",
    picker: {
      browse: "Parcourir",
      cancel: "Annuler",
      machinesTitle: "Choisissez une machine",
      machines: "Machines",
      loading: "Chargement...",
      noMachines: "Aucune machine configurée",
      defaultBadge: "Par défaut",
      useDir: "Utiliser ce répertoire",
      emptyDir: "Répertoire vide",
    },
  },
};
