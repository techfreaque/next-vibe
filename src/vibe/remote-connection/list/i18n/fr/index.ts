import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/fr";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Compte",
  tags: {
    remoteConnection: "Connexion distante",
  },
  enums: {
    fleetStatus: {
      all: "Toutes",
      unhealthy: "En défaut",
      critical: "Critique",
      warning: "Alerte",
      disconnected: "Déconnectée",
      healthy: "Saine",
    },
  },
  fleet: {
    reasonPart: {
      register: "inscription",
      bridge: "pont",
      sync: "synchronisation",
      notPaid: "aucune offre payante",
      noConnection: "aucune connexion",
      connectionLimit: "limite de connexions",
    },
    title: "État des connexions",
    subtitle:
      "Toutes les connexions de ce serveur. Le statut repose sur la dernière activité enregistrée.",
    kpi: {
      attention: "À vérifier",
      total: "Connexions",
      healthy: "Saines",
      unhealthy: "En défaut",
      disconnected: "Déconnectées",
      totalHint: "{{active}} actives, {{inactive}} inactives",
      healthyHint: "Synchronisées, aucun problème",
      unhealthyHint: "{{critical}} critiques · {{warning}} alertes",
      disconnectedHint: "Inactives, rien en panne",
    },
    status: {
      healthy: "Saine",
      warning: "Alerte",
      critical: "Critique",
      disconnected: "Déconnectée",
    },
    issue: {
      reauthRequired: "Inactive : le pair refuse la connexion enregistrée",
      inactive: "Inactive",
      accessDenied: "Accès refusé depuis le dernier contact",
      disconnectedAt: "Déconnexion enregistrée {{at}}",
      noToken: "Aucun jeton, les appels ne peuvent pas s'authentifier",
      neverSynced: "Jamais synchronisée, liée {{at}}",
      staleSync: "Synchronisation en retard. Dernière synchronisation {{at}}",
      transportDrift:
        "Configuré {{configured}}, mais le dernier appel est passé par {{used}}",
      transportMismatch: "Les deux côtés divergent sur le transport",
      mismatch: "{{sender}} envoie {{sent}}, {{receiver}} attend {{expected}}",
      denial: "{{action}} par nous {{at}} : {{reason}}",
      peerToolsStale: "Le pair a une ancienne copie de nos outils",
    },
    table: {
      instance: "Connexion",
      trustTools: "Droits et outils",
      title: "Connexions",
      subtitle: "Les problèmes d’abord, puis les contacts les plus récents.",
      empty: "Aucune connexion dans cet état.",
      emptyAll: "Aucune instance n'est liée à ce serveur.",
      count: "{{shown}} sur {{total}}",
    },
    direction: {
      incoming: "Liée par le pair",
      outgoing: "Liée par nous",
      mine: "La vôtre",
    },
    trust: {
      standard: "Standard : droits client, IA chez le pair",
      tools: "{{count}} outils",
      peerBuild: "Build du pair {{version}}",
      noBuild: "Aucun build signalé",
      syncsAll: "Synchronise tout",
      syncsNone: "Ne synchronise rien",
      syncsAllBut: "Synchronise tout sauf {{missing}}",
      syncsOnly: "Synchronise seulement {{list}}",
      admin: "Agit en admin",
      noTools: "Aucun outil du pair enregistré",
      loopHere: "IA ici",
    },
    meta: {
      out: "Nous → pair",
      in: "Pair → nous",
      lastCall: "Notre dernier appel",
      none: "aucun pour l'instant",
      capabilities: "Capacités",
      owner: "Propriétaire",
      trust: "Droits",
    },
    lastCallNone: "aucun appel sortant pour l'instant",
    earlier: "Avant : {{text}}",
    yours: "la vôtre",
    otherEnd: "autre bout {{peer}}",
    lastCall: "notre dernier appel {{used}}",
    transportPair: "nous → pair {{out}} · pair → nous {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    detail: {
      lastContact: "Dernier contact",
      lastSynced: "Dernière synchro",
      socket: "Socket ouvert depuis",
      socketNone: "Pas de socket",
      lastUsed: "Dernier appel",
      lastUsedValue: "{{transport}}, {{at}}",
      outMode: "Nous joignons le pair via",
      inMode: "Le pair nous joint via",
      capabilities: "Outils du pair",
      capabilitiesValue: "{{count}} outils · {{version}}",
      ourTools: "Nos outils chez le pair",
      ourToolsCurrent: "{{sent}} (à jour)",
      ourToolsStale: "{{sent}}, la version actuelle est {{current}}",
      inference: "Fournisseur d'inférence",
      forced: "Fournisseur système imposé",
      syncScope: "Synchronise",
      loop: "La boucle IA tourne sur",
      loopTarget: "Le pair",
      loopCaller: "Ce serveur",
      created: "Liée le",
      remoteUrl: "URL du pair",
      owner: "Propriétaire",
      yes: "Oui",
      no: "Non",
      none: "Rien",
      unknown: "Inconnu",
      openOwner: "Ouvrir le propriétaire",
      openDetail: "Réglages de votre connexion",
      showDetails: "Détails",
      hideDetails: "Masquer",
    },
    scope: {
      memories: "Mémoires",
      documents: "Documents",
      skills: "Skills",
      favorites: "Favoris",
      threads: "Chats",
    },
    never: "Jamais",
    audit: {
      unknownPeer: "Connexion indisponible",
      allEvents: "Tous les événements",
      eventsShown: "({{first}}–{{last}} sur {{total}})",
      previous: "Événements plus récents",
      next: "Événements plus anciens",
      peer: "Journal de {{peer}}",
      title: "Journal d'audit",
      subtitle: "Enregistrements, déconnexions et refus sur ce serveur.",
      events: "Événements d'audit",
      failures: "Refusés ou limités",
      trend: "Événements dans le temps",
      byReason: "Par action et motif",
      reason: "Action et motif",
      count: "Événements",
      recent: "Derniers événements",
      empty: "Aucun événement d'audit sur cette période.",
      openRecent: "Voir le journal",
    },
    action: {
      registered: "Enregistrée",
      reregistered: "Réenregistrée",
      disconnected: "Déconnectée",
      denied: "Refusée",
      rate_limited: "Limitée",
    },
    cli: {
      counts:
        "{{total}} connexions : {{healthy}} saines, {{unhealthy}} en défaut, {{disconnected}} déconnectées",
      attention: "À surveiller",
      ok: "Saines",
      none: "Aucune",
      audit:
        "Audit {{period}} : {{events}} événements, {{failures}} refusés ou limités",
      lastContact: "dernier contact {{at}}",
    },
  },
  get: {
    title: "Connexions distantes",
    titleShort: "Connexions",
    description:
      "Vos instances liées. Les admins voient aussi l'état de chaque connexion sur ce serveur.",
    fields: {
      activeOnly: {
        label: "Actives uniquement",
        description: "Ne renvoyer que les connexions actives",
      },
      auditOffset: {
        label: "Décalage du journal",
        description: "Nombre d’événements à ignorer.",
      },
      auditConnection: {
        label: "Connexion",
        description: "Filtrer le journal sur une connexion.",
      },
      fleetStatus: {
        label: "État",
        description: "Afficher uniquement les connexions dans cet état",
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
    loading: "Chargement des connexions…",
    refresh: "Actualiser les connexions",
    back: "Retour",
    socketSince: "WebSocket ouvert depuis",
    transportLabel: "Transport",
    viewConnection: "Ouvrir la connexion {{instance}}",
    pickConnection: "Choisir",
    title: "Connexions distantes",
    addButton: "Ajouter une connexion",
    emptyState:
      "Aucune instance liée. Liez une instance pour partager les données et les outils choisis.",
    emptyStateCloud: "Aucune instance reliée pour l'instant.",
    connectedBadge: "Connectée",
    registeredBadge: "Enregistrée",
    selfBadge: "Cette instance",
    lastSynced: "Dernier échange de synchronisation",
    never: "Jamais",
    connectButton: "Relier une instance locale",
    connectButtonLocal: "Se connecter au cloud",
    incomingBadge: "Entrante",
    inactiveBadge: "Inactive",
    inferenceProviderBadge: "Inférence",
    transportBadge: "sortant {{out}} · entrant {{in}}",
    transport: {
      unknown: "Inconnu",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "Nom de l'instance",
    remoteUrl: "URL distante",
    viewButton: "Voir",
    editButton: "Modifier",
    deleteButton: "Déconnecter",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      socketOpen: "WebSocket ouvert",
      noSyncRecorded: "Aucune synchronisation enregistrée",
      overdue: "Synchronisation en retard",
      syncRecorded: "Synchronisation enregistrée",
      tunnelOpen: "Tunnel ouvert",
      bridgeActive: "Connectée",
      tunnelWarning: "Tunnel en connexion",
      bridgeWarning: "Synchronisation",
      tunnelLost: "Tunnel perdu",
      bridgeFailed: "Échec de la connexion",
      disconnected: "Déconnecté",
      reauthRequired: "Connexion requise",
      incomingActive: "Active",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reauth: "Se reconnecter",
      reconnect: "Reconnecter",
      retry: "Réessayer",
      resync: "Resynchroniser",
    },
    // Cloud marketing panel
    cloud: {
      connectAnother: "Connecter une autre instance",
      heroTitle: "Votre propre instance",
      heroSubtitle:
        "Faites tourner next-vibe sur votre matériel et reliez-le à ce compte. Vos discussions, souvenirs et skills vous suivent. Vos outils tournent chez vous.",
      stepsTitle: "Connecté en trois étapes",
      step1Title: "Installer next-vibe",
      step1Body:
        "Open source. Tourne sur un portable, un serveur maison ou un VPS.",
      step2Title: "Relier depuis votre instance",
      step2Body:
        "Sur votre instance, ouvrez Abonnement, puis Synchro cloud, puis Se connecter au cloud. Saisissez {{appUrl}} et les identifiants de ce compte.",
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
        "Liez cette instance au cloud pour synchroniser les données choisies et lancer des outils locaux depuis le cloud.",
      benefit1:
        "Les mémoires se synchronisent dans les deux sens, automatiquement",
      benefit2: "L'IA cloud découvre et exécute vos outils locaux",
      benefit3: "Déléguez des tâches du cloud à cette machine",
      noConnectionsYet: "Rien n'est encore relié",
      connectionsTitle: "Connexions reliées",
    },
    // Self-identity
    selfIdentity: {
      title: "Nom de votre instance",
      description:
        "Les autres instances voient ce serveur sous ce nom. Il doit être unique parmi toutes les instances connectées.",
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
