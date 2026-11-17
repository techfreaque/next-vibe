import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    clusterRole: {
      none: "Aucun",
      controlPlane: "Plan de contrôle",
      worker: "Worker",
      storage: "Stockage",
    },
    authType: {
      password: "Mot de passe",
      privateKey: "Clé privée (PEM)",
      keyAgent: "Agent SSH",
      local: "Machine locale",
    },
  },

  errors: {
    connectionNotFound: "Connexion introuvable",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
  },

  get: {
    title: "Connexion SSH",
    titleShort: "Connexion SSH",
    description: "Afficher les détails d'une connexion SSH",
    fields: {
      id: { label: "ID de connexion", description: "La connexion à afficher" },
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
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de charger la connexion",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
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
    response: {
      label: { title: "Libellé" },
      host: { title: "Hôte" },
      port: { title: "Port" },
      username: { title: "Nom d'utilisateur" },
      authType: { title: "Type d'authentification" },
      isDefault: { title: "Par défaut" },
      fingerprint: { title: "Empreinte" },
      notes: { title: "Notes" },
      createdAt: { title: "Créée le" },
    },
    success: {
      title: "Connexion chargée",
      description: "Les détails de la connexion ont été récupérés",
    },
  },
  patch: {
    title: "Modifier une connexion SSH",
    titleShort: "Modifier la connexion",
    description: "Modifier les paramètres d'une connexion SSH",
    fields: {
      id: { label: "ID de connexion", description: "La connexion à modifier" },
      label: {
        label: "Libellé",
        description: "Nom affiché pour cette connexion",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hôte",
        description: "Nom d'hôte ou adresse IP",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "Port SSH", placeholder: "22" },
      username: {
        label: "Nom d'utilisateur",
        description: "Utilisateur de connexion SSH",
        placeholder: "deploy",
      },
      authType: {
        label: "Type d'authentification",
        description: "Méthode d'authentification",
      },
      secret: {
        label: "Mot de passe / clé privée",
        description: "Laissez vide pour conserver le secret actuel",
      },
      passphrase: {
        label: "Phrase secrète de la clé",
        description:
          "Laissez vide pour conserver ou effacer la phrase secrète actuelle",
      },
      isDefault: {
        label: "Définir par défaut",
        description:
          "Utiliser cette connexion par défaut pour les sessions de terminal",
      },
      clusterRole: {
        label: "Rôle dans le cluster",
        description:
          "Rôle de ce serveur dans le cluster k8s (control-plane, worker, storage ou none)",
      },
      notes: {
        label: "Notes",
        description: "Notes facultatives sur cette connexion",
      },
    },
    response: {
      updatedAt: { title: "Modifiée le" },
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
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de modifier la connexion",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
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
      title: "Connexion modifiée",
      description: "La connexion a été modifiée",
    },
  },
  delete: {
    title: "Supprimer une connexion SSH",
    titleShort: "Supprimer la connexion",
    description: "Supprimer une connexion SSH",
    fields: {
      id: { label: "ID de connexion", description: "La connexion à supprimer" },
    },
    response: {
      deleted: { title: "Supprimée" },
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
      forbidden: { title: "Interdit", description: "Permission refusée" },
      server: {
        title: "Erreur serveur",
        description: "Impossible de supprimer la connexion",
      },
      notFound: { title: "Introuvable", description: "Connexion introuvable" },
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
      title: "Connexion supprimée",
      description: "La connexion a été supprimée",
    },
  },
  widget: {
    title: "Détails de la connexion",
    host: "Hôte",
    user: "Utilisateur",
    auth: "Authentification",
    notes: "Notes",
    saveButton: "Enregistrer les modifications",
    deleteButton: "Supprimer la connexion",
    testButton: "Tester la connexion",
    confirmDelete: "Supprimer cette connexion ? Action irréversible.",
    mountsSection: "Répertoires montés",
    manageMounts: "Gérer les montages",
  },
};
