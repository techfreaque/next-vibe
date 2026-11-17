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
    emptyStateCloud: "Aucune instance reliée pour l'instant.",
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
      heroTitle: "Votre propre instance",
      heroSubtitle:
        "Faites tourner next-vibe sur votre matériel et reliez-le à ce compte. Vos discussions, souvenirs et skills vous suivent. Vos outils tournent chez vous.",
      stepsTitle: "Connecté en trois étapes",
      step1Title: "Installer next-vibe",
      step1Body:
        "Open source. Tourne sur un portable, un serveur maison ou un VPS.",
      step2Title: "Relier depuis votre instance",
      step2Body:
        "Sur votre instance, ouvrez Abonnement, puis Synchro cloud, puis Se connecter au cloud. Saisissez {{appUrl}} et les identifiants de ce compte. Dans un terminal sur cette machine :",
      step2Command: "vibe remote-connect -i",
      step3Title: "Choisir ce qui se synchronise",
      step3Body:
        "Souvenirs, documents, skills, favoris, discussions. Un interrupteur chacun, modifiable à tout moment sur votre instance.",
      githubCta: "Voir sur GitHub",
      quickstartCta: "Démarrage rapide",
      trustTitle: "Ce qu'une instance reliée peut faire",
      trust1:
        "Elle agit en votre nom. Elle lit et écrit vos propres discussions, souvenirs et skills. Rien d'un autre compte.",
      trust2:
        "Les outils d'administration restent verrouillés. Votre instance a exactement les droits de votre compte.",
      trust3:
        "Les requêtes IA qu'elle envoie ici consomment vos crédits au tarif normal : coût du fournisseur plus 30 %.",
      trust4:
        "Jusqu'à {{max}} instances. Déconnectez-en une ci-dessous et son lien s'arrête aussitôt.",
      paidTitle: "Réservé aux comptes payants",
      paidBody:
        "Relier votre propre instance demande un compte payant. N'importe quel pack de crédits ou abonnement le débloque.",
      paidCta: "Débloquer",
      alreadyHaveLocal: "Vos instances reliées",
      alreadyHaveLocalSub:
        "Chacune agit au nom de ce compte. Ouvrez-en une pour voir son état ou la déconnecter.",
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
