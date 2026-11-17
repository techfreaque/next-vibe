import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  get: {
    title: "Connexions distantes",
    titleShort: "Connexions",
    description: "Lister toutes les connexions distantes de votre compte",
    fields: {
      activeOnly: {
        label: "Actives uniquement",
        description: "Ne renvoyer que les connexions actives",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Vous devez être connecté pour voir les connexions",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation",
      },
      server: {
        title: "Erreur serveur",
        description: "Échec du listage des connexions",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune connexion trouvée",
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
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
    },
    success: {
      title: "Connexions listées",
      description: "Connexions distantes récupérées",
    },
  },
  widget: {
    title: "Connexions distantes",
    addButton: "Ajouter une connexion",
    emptyState:
      "Reliez une autre instance : vos mémoires et vos outils se synchronisent dans les deux sens, chaque minute.",
    emptyStateCloud:
      "Reliez ici votre installation locale dès qu'elle tourne. Vos mémoires et vos outils se synchroniseront automatiquement.",
    connectedBadge: "Connectée",
    registeredBadge: "Enregistrée",
    selfBadge: "Cette instance",
    lastSynced: "Synchro initiale",
    never: "Jamais",
    connectButton: "Relier une instance locale",
    connectButtonLocal: "Se connecter au cloud",
    incomingBadge: "Entrante",
    inactiveBadge: "Inactive",
    inferenceProviderBadge: "Inférence",
    transportBadge: "sortant {{out}} · entrant {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "ID d'instance",
    remoteUrl: "URL distante",
    viewButton: "Voir",
    editButton: "Modifier",
    deleteButton: "Déconnecter",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      tunnelOpen: "Tunnel ouvert",
      bridgeActive: "Connectée",
      tunnelWarning: "Tunnel en connexion",
      bridgeWarning: "Synchronisation",
      tunnelLost: "Tunnel perdu",
      bridgeFailed: "Échec de la connexion",
      disconnected: "Inactive",
      incomingActive: "Active",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reconnect: "Reconnecter",
      retry: "Réessayer",
      resync: "Resynchroniser",
    },
    // Cloud marketing panel
    cloud: {
      heroTitle: "Votre IA vous appartient. Partout.",
      heroSubtitle:
        "unbottled.ai est votre cerveau dans le cloud. Ajoutez une instance locale et votre IA agit des deux côtés : les mémoires se synchronisent, les outils tournent sur votre machine, Claude Code s'exécute sur votre matériel.",
      benefit1:
        "Les mémoires se synchronisent dans les deux sens, automatiquement",
      benefit2: "L'IA cloud découvre et exécute vos outils locaux",
      benefit3: "Déléguez des tâches du cloud à votre machine",
      feature1Title: "Vos outils, votre machine",
      feature1Body:
        "SSH, fichiers locaux, exécution de code : l'IA cloud découvre et lance vos outils locaux automatiquement. Pas de redirection de port. Pas de VPN.",
      feature2Title: "Mémoire partagée",
      feature2Body:
        "Tout ce que vous dites à l'IA ici se synchronise avec votre instance locale. Votre contexte vous suit.",
      feature3Title: "Aucune dépendance",
      feature3Body:
        "C'est open source. Forkez-le, auto-hébergez-le, maîtrisez chaque ligne. Aucune boîte noire.",
      feature4Title: "Une commande pour démarrer",
      feature4Body:
        "Clonez le dépôt, ajoutez votre clé API, lancez vibe dev. Votre stack IA personnelle tourne en moins d'une minute.",
      githubCta: "Voir sur GitHub →",
      quickstartCta: "Guide de démarrage rapide",
      alreadyHaveLocal: "Vous avez déjà une instance locale ?",
      alreadyHaveLocalSub:
        "Connectez-vous depuis votre machine locale : ouvrez-y Connexions distantes et reliez-la à cette instance cloud.",
      connectSectionTitle: "Reliez votre instance locale",
    },
    // Local panel
    local: {
      cloudTitle: "Se connecter au cloud",
      cloudSubtitle:
        "Reliez cette instance locale à unbottled.ai (ou à toute autre instance cloud). Une fois connectée, les mémoires se synchronisent toutes les 60 secondes et Thea peut découvrir et exécuter vos outils locaux.",
      benefit1:
        "Les mémoires se synchronisent dans les deux sens, automatiquement",
      benefit2: "L'IA cloud découvre et exécute vos outils locaux",
      benefit3: "Déléguez des tâches du cloud à cette machine",
      noConnectionsYet: "Rien n'est encore relié",
      connectionsTitle: "Connexions reliées",
    },
    // Self-identity
    selfIdentity: {
      title: "ID de votre instance",
      description:
        "Les autres instances voient ce serveur sous cet ID. Il doit être unique parmi toutes les instances connectées.",
    },
    // Sync settings (admin only)
    syncSettings: {
      title: "Synchro auto",
      description:
        "Synchroniser tâches et mémoires avec toutes les instances connectées chaque minute",
      enabledBadge: "Active",
      disabledBadge: "Inactive",
      toggleLabel: "Activer/désactiver la synchro auto",
    },
  },
};
