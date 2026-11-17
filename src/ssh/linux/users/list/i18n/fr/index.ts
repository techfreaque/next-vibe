import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Mode local uniquement",
    },
    connectionNotFound: "Connexion introuvable",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
    connectTimeout: "Délai de connexion dépassé",
    sshAuthFailed: "Échec de l'authentification SSH",
    sshConnectionFailed: "Échec de la connexion SSH",
    fingerprintMismatch:
      "L'empreinte de l'hôte a changé. Attaque MITM possible. Utilisez acknowledgeNewFingerprint=true pour continuer.",
  },

  get: {
    title: "Lister les utilisateurs Linux",
    titleShort: "Utilisateurs Linux",
    description:
      "Lister les comptes utilisateur système de l'hôte (uid >= 1000)",
    fields: {
      connectionId: {
        label: "Connexion",
        description: "Connexion SSH à utiliser (vide = local)",
        placeholder: "uuid",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès admin requis",
      },
      forbidden: { title: "Interdit", description: "LOCAL_MODE requis" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de lister les utilisateurs",
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
    response: {
      users: { title: "Utilisateurs" },
    },
    success: {
      title: "Utilisateurs listés",
      description: "Utilisateurs système récupérés",
    },
  },
  widget: {
    title: "Utilisateurs Linux",
    createButton: "Créer un utilisateur",
    lockButton: "Verrouiller",
    unlockButton: "Déverrouiller",
    deleteButton: "Supprimer",
    usernameCol: "Nom d'utilisateur",
    uidCol: "UID",
    homeDirCol: "Répertoire personnel",
    shellCol: "Shell",
    groupsCol: "Groupes",
    statusCol: "Statut",
    locked: "Verrouillé",
    active: "Actif",
    localModeOnly: "Disponible uniquement en LOCAL_MODE",
    noUsers: "Aucun utilisateur trouvé",
    confirmDelete: "Supprimer l'utilisateur {username} ? Action irréversible.",
  },
};
