import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "Aucun shell de connexion",
    },
  },

  errors: {
    localModeOnly: {
      title: "Mode local uniquement",
    },
    invalidUsername:
      "Nom d'utilisateur invalide : il doit commencer par une lettre, suivie de minuscules, chiffres ou tirets (32 caractères max.)",
    userAlreadyExists: "Un utilisateur porte déjà ce nom",
    connectionNotFound: "Connexion SSH introuvable",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
    connectTimeout: "Délai de connexion dépassé",
    sshAuthFailed: "Échec de l'authentification SSH",
    sshConnectionFailed: "Échec de la connexion SSH",
    sudoAuthFailed:
      "Échec de l'authentification sudo : mot de passe erroné ou droits sudo insuffisants",
    permissionDenied:
      "Permission refusée : indiquez votre mot de passe sudo pour créer des utilisateurs système",
    fingerprintMismatch:
      "L'empreinte de l'hôte a changé. Attaque MITM possible. Acceptez-la pour continuer.",
  },

  post: {
    title: "Créer un utilisateur Linux",
    titleShort: "Créer un utilisateur",
    description:
      "Créer un nouveau compte utilisateur système. Exécute useradd sur l'hôte cible. Réservé aux admins.",
    fields: {
      connectionId: {
        label: "Connexion SSH",
        description:
          "Serveur sur lequel créer l'utilisateur. Laissez vide pour utiliser la connexion par défaut ou le mode local.",
        placeholder: "Choisir une connexion…",
      },
      username: {
        label: "Nom d'utilisateur",
        description:
          "Doit commencer par une lettre, suivie de minuscules, chiffres ou tirets. 32 caractères max.",
        placeholder: "alice",
      },
      groups: {
        label: "Groupes supplémentaires",
        description:
          "Groupes supplémentaires facultatifs auxquels ajouter l'utilisateur (séparés par des virgules). Exemple : docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Shell de connexion",
        description:
          "Le shell lancé quand cet utilisateur se connecte en mode interactif.",
      },
      homeDir: {
        label: "Répertoire personnel",
        description:
          "Chemin du répertoire personnel de l'utilisateur. Par défaut /home/<username> si vide.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Accorder l'accès sudo",
        description:
          "Ajouter l'utilisateur au groupe sudo pour qu'il puisse exécuter des commandes en root. À utiliser avec prudence.",
      },
      sudoPassword: {
        label: "Mot de passe sudo",
        description:
          "Votre mot de passe sudo pour exécuter useradd avec des privilèges élevés. Laissez vide si sudo sans mot de passe est configuré.",
        placeholder: "Saisir le mot de passe sudo…",
      },
    },
    response: {
      ok: { title: "Succès" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Répertoire personnel" },
      shell: { title: "Shell" },
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
        description: "Le mode local n'est pas activé sur ce serveur",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de créer le compte utilisateur",
      },
      notFound: {
        title: "Introuvable",
        description: "Connexion SSH introuvable",
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
        title: "Nom d'utilisateur déjà pris",
        description: "Un utilisateur porte déjà ce nom sur le serveur",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      timeout: { title: "Délai dépassé", description: "La requête a expiré" },
    },
    success: {
      title: "Utilisateur créé",
      description: "Le compte utilisateur système a été créé",
    },
    submitButton: {
      text: "Créer l'utilisateur",
      loadingText: "Création…",
    },
  },
  widget: {
    title: "Créer un utilisateur Linux",
    createButton: "Créer l'utilisateur",
    creating: "Création…",
    sudoWarning:
      "L'accès sudo donne à l'utilisateur des privilèges root. Ne l'accordez qu'à un utilisateur en qui vous avez une confiance totale.",
  },
};
