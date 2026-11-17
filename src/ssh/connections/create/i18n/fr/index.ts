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

  errors: {
    sshSecretKeyNotSet:
      "Variable d'environnement JWT_SECRET_KEY non définie. Ajoutez une valeur hexadécimale de 32 octets pour activer le mode SSH.",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
    noRowReturned: "Aucune ligne renvoyée par l'insertion",
  },

  post: {
    title: "Créer une connexion SSH",
    titleShort: "Créer une connexion",
    description:
      "Enregistrer une nouvelle connexion SSH. Les identifiants sont chiffrés au repos en AES-256-GCM.",
    fields: {
      label: {
        label: "Libellé",
        description: "Un nom lisible pour identifier cette connexion",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Nom d'hôte / IP",
        description: "Nom d'hôte ou adresse IP du serveur SSH",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "Port du serveur SSH (par défaut : 22)",
        placeholder: "22",
      },
      username: {
        label: "Nom d'utilisateur",
        description: "L'utilisateur SSH avec lequel s'authentifier",
        placeholder: "deploy",
      },
      authType: {
        label: "Méthode d'authentification",
        description:
          "Mode d'authentification. Mot de passe : connexion simple par mot de passe. Clé privée : fichier de clé PEM. Agent SSH : utilise l'agent SSH du système (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Mot de passe / clé privée",
        description:
          "Authentification par mot de passe : le mot de passe. Clé privée : collez la clé PEM complète (-----BEGIN ... KEY-----). Laissez vide pour l'agent SSH.",
        placeholder: "",
      },
      passphrase: {
        label: "Phrase secrète de la clé",
        description:
          "Si votre clé privée est protégée par une phrase secrète, saisissez-la ici. Laissez vide si la clé n'est pas chiffrée.",
        placeholder: "",
      },
      isDefault: {
        label: "Définir comme connexion par défaut",
        description:
          "Utiliser cette connexion par défaut pour les sessions IA, le terminal et les commandes exec quand aucune connexion n'est indiquée.",
      },
      notes: {
        label: "Notes",
        description: "Notes internes facultatives sur cette connexion",
        placeholder: "VPS derrière un NAT, hôte de rebond requis",
      },
    },
    response: {
      id: { title: "ID de connexion" },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs du formulaire et réessayez",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Accès admin requis",
      },
      forbidden: {
        title: "Interdit",
        description: "Vous n'avez pas l'autorisation de créer des connexions",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible d'enregistrer la connexion",
      },
      notFound: { title: "Introuvable", description: "Ressource introuvable" },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
      conflict: {
        title: "Libellé déjà utilisé",
        description: "Une connexion porte déjà ce libellé",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      timeout: { title: "Délai dépassé", description: "La requête a expiré" },
    },
    success: {
      title: "Connexion enregistrée",
      description: "La connexion SSH a été enregistrée",
    },
    submitButton: {
      text: "Enregistrer la connexion",
      loadingText: "Enregistrement...",
    },
  },
  widget: {
    title: "Nouvelle connexion SSH",
    createButton: "Enregistrer la connexion",
    creating: "Enregistrement...",
    testFirst: "Testez la connexion avant de l'enregistrer",
  },
};
