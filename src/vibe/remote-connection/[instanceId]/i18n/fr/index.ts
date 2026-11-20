import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  widget: {
    loading: "Chargement de la connexion…",
    title: "Connexion distante",
    signInDescription:
      "Connectez-vous pour configurer votre connexion distante",
    back: "Retour",
    // ── Status section ─────────────────────────────────────────────────────
    statusSection: "État",
    connected: {
      title: "Connecté",
      badge: "Active",
      connectedTo: "URL distante",
      transport: "Transport (sortant)",
      remoteTransport: "Leur transport",
      remoteInstance: "Instance distante",
      capabilities: "Version des capacités",
      lastSynced: "Dernier échange de synchronisation",
      wsConnected: "Connecté depuis",
      refresh: "Actualiser",
      transportReverseWs: "WS inverse (tunnel)",
      transportDirectHttp: "HTTP direct",
    },
    notConnected: {
      title: "Non connecté",
      description:
        "Reliez un compte cloud (par ex. unbottled.ai) pour synchroniser vos mémoires et appeler les outils IA depuis votre terminal, où que vous soyez.",
      benefit1:
        "Les mémoires se synchronisent automatiquement entre cet appareil et votre compte cloud",
      benefit2: "Lancez les outils IA en ligne de commande avec",
      benefit2Code: "vibe --remote",
      benefit3: "Local et cloud restent synchronisés",
    },
    // ── Behavior section ───────────────────────────────────────────────────
    behaviorSection: "Comportement",
    // ── Sync section ───────────────────────────────────────────────────────
    syncSection: "Synchro et accès",
    syncScope: {
      memories: "Mémoires",
      documents: "Documents",
      skills: "Skills",
      favorites: "Favoris",
      threads: "Fils de discussion",
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription:
      "Parcourir le système de fichiers partagé de cette connexion.",
    cortexLink: "Ouvrir Cortex",
    sshSection: "SSH et terminal",
    sshDescription:
      "Configurations SSH et sessions de terminal via cette connexion.",
    sshLink: "Ouvrir les connexions SSH",
    // ── Connection state banner ────────────────────────────────────────────
    state: {
      noSyncRecorded: "Aucune synchronisation enregistrée",
      syncRecorded: "Synchronisation enregistrée",
      tunnelActive: "WebSocket ouvert",
      bridgeActive: "Connecté",
      degraded: "Connexion dégradée",
      connectionLost: "Connexion perdue",
      inactive: "Inactive",
      connectedSince: "Depuis",
      initialSync: "Synchronisé",
    },
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Se réauthentifier",
    renameButton: "Renommer",
    editButton: "Modifier",
    reconnectButton: "Reconnecter",
    disconnectButton: "Déconnecter",
    disconnectConfirmTitle: "Déconnecter cette instance ?",
    disconnectConfirmDescription:
      "La connexion sera supprimée. Vous pouvez vous reconnecter à tout moment.",
    disconnectConfirmCancel: "Annuler",
    disconnectConfirmProceed: "Déconnecter",
    // ── Edit section titles ────────────────────────────────────────────────
    edit: {
      identitySection: "Nom",
      reauthSection: "Réauthentification",
      transportSection: "Transport",
      behaviorSection: "Comportement",
    },
  },
  get: {
    title: "État de la connexion distante",
    titleShort: "Connexion",
    description: "État complet et paramètres d'une connexion distante",
    instanceId: {
      label: "ID d'instance",
      description: "L'instance de connexion à afficher",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
      },
      unauthorized: {
        title: "Non connecté",
        description:
          "Vous devez être connecté pour voir votre connexion distante",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de voir ceci",
      },
      notFound: {
        title: "Non connecté",
        description: "Aucune connexion distante trouvée pour cette instance",
      },
      server: {
        title: "Erreur serveur",
        description:
          "Une erreur est survenue lors de la récupération de votre connexion",
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
    success: {
      title: "Connexion récupérée",
      description: "État de la connexion distante récupéré",
    },
  },
  patch: {
    title: "Mettre à jour la connexion distante",
    titleShort: "Mettre à jour",
    description:
      "Renommer, se réauthentifier ou configurer le transport et la synchro",
    // ── Rename ──────────────────────────────────────────────────────────────
    newInstanceId: {
      label: "Nouveau nom",
      description:
        "Renomme cette connexion. Met à jour le libellé local et le synchronise côté distant.",
    },
    // ── Reauth ──────────────────────────────────────────────────────────────
    email: {
      label: "E-mail",
      description: "L'e-mail de votre compte sur l'instance distante",
    },
    password: {
      label: "Mot de passe",
      description: "Le mot de passe de votre compte sur l'instance distante",
    },
    // ── Transport ────────────────────────────────────────────────────────────
    transportMode: {
      label: "Mode de transport",
      description:
        "Comment cette connexion communique. reverse-ws : WS sortant persistant (ouvert dès l'enregistrement). direct-http : appels HTTP directs.",
      options: {
        reverseWs: "WS inverse",
        directHttp: "HTTP direct",
      },
    },
    remoteTransportMode: {
      label: "Leur mode de transport",
      description:
        "Comment le pair joint ce côté. reverse-ws : nous gardons un connecteur sortant pour recevoir ses envois. direct-http : il envoie des POST à notre pont.",
    },
    // ── Behavior ────────────────────────────────────────────────────────────
    isInferenceProvider: {
      label: "Fournisseur d'inférence",
      description:
        "Autoriser cette connexion à servir l'inférence IA : l'instance distante exécute la boucle LLM via reverse-WS.",
    },
    forceSystemProvider: {
      label: "Forcer le fournisseur système",
      description:
        "Priorité admin : fait passer TOUS les flux IA par cette connexion, en ignorant les règles de coût et de routage par utilisateur. Une seule connexion à la fois.",
    },
    threadMirrorMode: {
      label: "Miroir des fils",
      description:
        "Indique si les fils de discussion se synchronisent entre cette instance et l'instance connectée. 'both' les duplique dans les deux sens ; 'off' laisse chaque fil là où il a été créé.",
      options: {
        both: "Miroir dans les deux sens",
        off: "Pas de miroir",
      },
    },
    loopLocation: {
      label: "Emplacement de la boucle",
      description:
        "Où tourne la boucle IA d'un fil distant. 'target' l'exécute sur l'instance connectée (par défaut) ; 'caller' garde la boucle ici, les outils s'exécutant toujours à distance.",
      options: {
        target: "Sur l'instance connectée",
        caller: "Sur cette instance",
      },
    },
    // ── Sync scope ──────────────────────────────────────────────────────────
    syncScope: {
      label: "Périmètre de synchro",
      description:
        "Les fournisseurs de données synchronisés par cette connexion : mémoires, documents, skills, favoris, fils de discussion.",
      memories: "Mémoires",
      documents: "Documents",
      skills: "Skills",
      favorites: "Favoris",
      threads: "Fils de discussion",
    },
    reconnectNow: {
      label: "Reconnecter maintenant",
      description:
        "Ferme puis rouvre la connexion, ce qui déclenche la synchro pull-on-connect.",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: { title: "Erreur réseau", description: "Échec de la connexion" },
      unauthorized: {
        title: "Non connecté",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Rôle admin requis pour ce champ",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Échec de la mise à jour de la connexion",
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
    success: {
      title: "Connexion mise à jour",
      description: "Paramètres enregistrés",
    },
  },
  delete: {
    title: "Déconnecter",
    titleShort: "Déconnecter",
    description:
      "Supprimer cette connexion distante et fermer le canal WebSocket",
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      network: { title: "Erreur réseau", description: "Échec de la connexion" },
      unauthorized: {
        title: "Non connecté",
        description: "Authentification requise",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
      server: {
        title: "Erreur serveur",
        description: "Échec de la déconnexion",
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
    success: {
      title: "Déconnecté",
      description: "Connexion distante supprimée",
    },
  },
};
