import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Mot de passe",
      privateKey: "Clé privée (PEM)",
      keyAgent: "Agent SSH",
      local: "Machine locale",
    },
  },

  get: {
    title: "Connexions",
    titleShort: "Connexions",
    description:
      "Toutes les machines auxquelles vous pouvez vous connecter : shell local, serveurs SSH et instances distantes",
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès admin requis",
      },
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lister les connexions",
      },
      notFound: { title: "Introuvable", description: "Introuvable" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: { title: "Modifications non enregistrées" },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      timeout: { title: "Délai dépassé", description: "La requête a expiré" },
    },
    success: {
      title: "Connexions listées",
      description: "Toutes les connexions aux machines ont été récupérées",
    },
    response: {
      connections: {
        title: "Connexions",
      },
    },
  },
  widget: {
    title: "Connexions",
    back: "Retour",
    addSsh: "Ajouter SSH",
    connectRemote: "Connecter une instance distante",
    openTerminal: "Terminal",
    viewRemote: "Détails",
    defaultBadge: "Par défaut",
    localType: "Local",
    sshType: "SSH",
    remoteType: "Distant",
    healthHealthy: "Connecté",
    healthWarning: "Lent",
    healthCritical: "Injoignable",
    healthDisconnected: "Hors ligne",
    noConnections: "Aucune machine configurée",
    noConnectionsHint:
      "Ajoutez une connexion SSH ou connectez une instance distante pour commencer.",
    emptyState:
      "Aucune connexion pour l'instant. Ajoutez-en une pour accéder à des machines distantes.",
  },
};
