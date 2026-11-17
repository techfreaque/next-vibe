import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Mot de passe",
      privateKey: "Clé privée (PEM)",
      keyAgent: "Agent SSH",
      local: "Machine locale",
    },
    clusterRole: {
      none: "Aucun rôle de cluster",
      controlPlane: "Plan de contrôle",
      worker: "Worker",
      storage: "Stockage",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "Mode local uniquement",
      description: "Cette fonction n'est disponible qu'en LOCAL_MODE",
    },
    adminOnly: {
      title: "Réservé aux admins",
      description: "Seuls les admins ont accès aux fonctions machine",
    },
    connectionNotFound: "Connexion introuvable",
    sessionNotFound: "Session introuvable",
    fileNotFound: "Fichier introuvable",
    directoryNotFound: "Répertoire introuvable",
    permissionDenied: "Permission refusée",
    sshSecretKeyNotSet:
      "Variable d'environnement JWT_SECRET_KEY non définie. Ajoutez une valeur hexadécimale de 32 octets pour activer le mode SSH.",
    encryptionFailed:
      "Échec du chiffrement : JWT_SECRET_KEY est peut-être invalide",
    noRowReturned: "Aucune ligne renvoyée par l'insertion",
    notImplemented: {
      test: "Backend SSH pas encore implémenté. Impossible de tester les connexions distantes pour l'instant.",
      local:
        "Backend SSH pas encore implémenté. Laissez connectionId vide pour exécuter en local.",
      fileList: "Backend SSH pas encore implémenté pour le listage de fichiers",
      fileRead: "Backend SSH pas encore implémenté pour la lecture de fichiers",
      fileWrite:
        "Backend SSH pas encore implémenté pour l'écriture de fichiers",
      session:
        "Sessions PTY SSH pas encore implémentées. Utilisez ssh_exec_POST pour les commandes distantes.",
    },
    fingerprintMismatch:
      "L'empreinte de l'hôte a changé. Attaque MITM possible. Utilisez acknowledgeNewFingerprint=true pour continuer.",
    noDefaultConnection:
      "Aucune connexion SSH par défaut configurée. Créez une connexion et définissez-la par défaut.",
    sshConnectionFailed: "Échec de la connexion SSH",
    sshAuthFailed: "Échec de l'authentification SSH",
    connectTimeout: "Délai de connexion dépassé",
    invalidWorkingDir:
      "Répertoire de travail invalide : il doit s'agir d'un chemin absolu sans segment '..'",
    invalidPath: "Chemin invalide : il doit être absolu et sans segment '..'",
    parentDirNotFound:
      "Répertoire parent introuvable. Définissez createDirs=true pour le créer.",
    commandTimedOut: "Délai d'exécution de la commande dépassé",
    cannotDeleteCurrentUser:
      "Impossible de supprimer l'utilisateur du processus en cours",
    cannotDeleteSystemUser:
      "Impossible de supprimer les utilisateurs système (uid < 1000)",
    userNotFound: "Utilisateur introuvable",
    userAlreadyExists: "L'utilisateur existe déjà",
    invalidUsername:
      "Nom d'utilisateur invalide : minuscules, chiffres et tirets uniquement, en commençant par une lettre",
  },

  session: {
    read: {
      get: {
        title: "Lire la sortie d'une session SSH",
        description: "Lire la sortie mise en tampon d'une session SSH active",
        fields: {
          sessionId: {
            label: "ID de session",
            description: "ID de la session SSH à lire",
          },
          waitMs: {
            label: "Attente (ms)",
            description: "Durée d'attente de la sortie, en millisecondes",
          },
          maxBytes: {
            label: "Octets max.",
            description: "Nombre maximal d'octets à lire",
          },
        },
        response: {
          output: { title: "Sortie" },
          eof: { title: "EOF" },
          status: { title: "Statut" },
        },
        success: {
          title: "Sortie de session lue",
          description: "La sortie de la session a été lue",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de lecture de session invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de lire la sortie de la session",
          },
          notFound: {
            title: "Session introuvable",
            description: "Session SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    close: {
      post: {
        title: "Fermer une session SSH",
        description: "Fermer une session SSH active",
        fields: {
          sessionId: {
            label: "ID de session",
            description: "ID de la session SSH à fermer",
          },
        },
        response: {
          ok: { title: "Succès" },
        },
        success: {
          title: "Session fermée",
          description: "La session SSH a été fermée",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de fermeture de session invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de fermer la session",
          },
          notFound: {
            title: "Session introuvable",
            description: "Session SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    write: {
      post: {
        title: "Écrire dans une session SSH",
        description: "Envoyer une entrée à une session SSH active",
        fields: {
          sessionId: {
            label: "ID de session",
            description: "ID de la session SSH cible",
          },
          input: {
            label: "Entrée",
            description: "Texte à envoyer à la session",
          },
          raw: {
            label: "Brut",
            description:
              "Envoyer l'entrée en octets bruts, sans retour à la ligne",
          },
        },
        response: {
          ok: { title: "Succès" },
        },
        success: {
          title: "Entrée envoyée",
          description: "L'entrée a été écrite dans la session",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres d'écriture invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible d'écrire dans la session",
          },
          notFound: {
            title: "Session introuvable",
            description: "Session SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    open: {
      post: {
        title: "Ouvrir une session SSH",
        description: "Ouvrir une session de terminal SSH interactive",
        fields: {
          connectionId: {
            label: "ID de connexion",
            description: "ID de la connexion SSH à utiliser",
          },
          name: {
            label: "Nom de la session",
            description: "Nom facultatif de la session",
          },
          cols: {
            label: "Colonnes",
            description: "Largeur du terminal en colonnes",
          },
          rows: {
            label: "Lignes",
            description: "Hauteur du terminal en lignes",
          },
        },
        disconnected: "Déconnecté",
        response: {
          sessionId: { title: "ID de session" },
          status: { title: "Statut" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Session ouverte",
          description: "La session SSH a été ouverte",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de session invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible d'ouvrir la session",
          },
          notFound: {
            title: "Connexion introuvable",
            description: "Connexion SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "Terminal SSH",
      description: "Widget de terminal SSH interactif",
      response: {
        ok: { title: "Terminal prêt" },
      },
      success: {
        title: "Terminal prêt",
        description: "Le terminal SSH est prêt",
      },
      errors: {
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        server: { title: "Erreur serveur", description: "Erreur du terminal" },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées détectées",
        },
        notFound: {
          title: "Introuvable",
          description: "Ressource introuvable",
        },
        conflict: { title: "Conflit", description: "Un conflit est survenu" },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        validation: {
          title: "Erreur de validation",
          description: "La validation a échoué",
        },
        forbidden: { title: "Interdit", description: "Accès refusé" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Lire un fichier distant",
        description: "Lire le contenu d'un fichier via SSH",
        fields: {
          connectionId: {
            label: "ID de connexion",
            description: "Connexion SSH à utiliser",
            placeholder: "uuid",
          },
          path: {
            label: "Chemin du fichier",
            description: "Chemin absolu du fichier",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Octets max.",
            description: "Nombre maximal d'octets à lire",
            placeholder: "102400",
          },
          offset: {
            label: "Décalage",
            description: "Position en octets à partir de laquelle lire",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Contenu" },
          size: { title: "Taille" },
          truncated: { title: "Tronqué" },
          encoding: { title: "Encodage" },
        },
        success: {
          title: "Fichier lu",
          description: "Le contenu du fichier a été récupéré",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de lecture de fichier invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de lire le fichier",
          },
          notFound: {
            title: "Fichier introuvable",
            description: "Fichier ou connexion introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    list: {
      get: {
        title: "Lister des fichiers distants",
        description: "Lister les fichiers d'un répertoire distant via SSH",
        fields: {
          connectionId: {
            label: "ID de connexion",
            description: "Connexion SSH à utiliser",
            placeholder: "uuid",
          },
          path: {
            label: "Chemin du répertoire",
            description: "Chemin absolu du répertoire",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Entrées" },
          currentPath: { title: "Chemin actuel" },
        },
        success: {
          title: "Répertoire listé",
          description: "Le contenu du répertoire a été récupéré",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de listage invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de lister le répertoire",
          },
          notFound: {
            title: "Introuvable",
            description: "Répertoire ou connexion introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    write: {
      post: {
        title: "Écrire un fichier distant",
        description: "Écrire du contenu dans un fichier via SSH",
        fields: {
          connectionId: {
            label: "ID de connexion",
            description: "Connexion SSH à utiliser",
            placeholder: "uuid",
          },
          path: {
            label: "Chemin du fichier",
            description: "Chemin absolu où écrire",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Contenu",
            description: "Contenu à écrire dans le fichier",
            placeholder: "contenu du fichier",
          },
          createDirs: {
            label: "Créer les répertoires",
            description: "Créer les répertoires parents s'ils n'existent pas",
          },
        },
        response: {
          ok: { title: "Succès" },
          bytesWritten: { title: "Octets écrits" },
        },
        success: {
          title: "Fichier écrit",
          description: "Le fichier a été écrit",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres d'écriture de fichier invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible d'écrire le fichier",
          },
          notFound: {
            title: "Introuvable",
            description: "Chemin ou connexion introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Lister les utilisateurs Linux",
          description:
            "Lister les utilisateurs Linux d'un serveur distant via SSH",
          response: {
            users: { title: "Utilisateurs" },
          },
          success: {
            title: "Utilisateurs listés",
            description: "Les utilisateurs Linux ont été récupérés",
          },
          errors: {
            validation: {
              title: "Erreur de validation",
              description: "La validation a échoué",
            },
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            forbidden: { title: "Interdit", description: "Accès refusé" },
            server: {
              title: "Erreur serveur",
              description: "Impossible de lister les utilisateurs",
            },
            notFound: {
              title: "Introuvable",
              description: "Ressource introuvable",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inattendue est survenue",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Modifications non enregistrées détectées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit est survenu",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Supprimer un utilisateur Linux",
          description:
            "Supprimer un utilisateur Linux d'un serveur distant via SSH",
          fields: {
            removeHome: {
              label: "Supprimer le répertoire personnel",
              description:
                "Supprimer aussi le répertoire personnel de l'utilisateur",
            },
          },
          response: {
            ok: { title: "Succès" },
          },
          success: {
            title: "Utilisateur supprimé",
            description: "L'utilisateur Linux a été supprimé",
          },
          errors: {
            validation: {
              title: "Erreur de validation",
              description: "La validation a échoué",
            },
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            forbidden: { title: "Interdit", description: "Accès refusé" },
            server: {
              title: "Erreur serveur",
              description: "Impossible de supprimer l'utilisateur",
            },
            notFound: {
              title: "Utilisateur introuvable",
              description: "Utilisateur Linux introuvable",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inattendue est survenue",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Modifications non enregistrées détectées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit est survenu",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
          },
        },
      },
      create: {
        post: {
          title: "Créer un utilisateur Linux",
          description:
            "Créer un utilisateur Linux sur un serveur distant via SSH",
          fields: {
            username: {
              label: "Nom d'utilisateur",
              description: "Nom d'utilisateur du nouveau compte",
              placeholder: "deploy",
            },
            groups: {
              label: "Groupes",
              description:
                "Groupes supplémentaires auxquels ajouter l'utilisateur",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Shell de connexion de l'utilisateur",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Répertoire personnel",
              description: "Chemin du répertoire personnel",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Accès sudo",
              description: "Accorder l'accès sudo à l'utilisateur",
            },
          },
          response: {
            ok: { title: "Succès" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Répertoire personnel" },
            shell: { title: "Shell" },
          },
          success: {
            title: "Utilisateur créé",
            description: "L'utilisateur Linux a été créé",
          },
          errors: {
            validation: {
              title: "Erreur de validation",
              description: "La validation a échoué",
            },
            unauthorized: {
              title: "Non autorisé",
              description: "Authentification requise",
            },
            forbidden: { title: "Interdit", description: "Accès refusé" },
            server: {
              title: "Erreur serveur",
              description: "Impossible de créer l'utilisateur",
            },
            notFound: {
              title: "Introuvable",
              description: "Connexion introuvable",
            },
            unknown: {
              title: "Erreur inconnue",
              description: "Une erreur inattendue est survenue",
            },
            unsavedChanges: {
              title: "Modifications non enregistrées",
              description: "Modifications non enregistrées détectées",
            },
            conflict: {
              title: "Conflit",
              description: "Un conflit est survenu",
            },
            network: {
              title: "Erreur réseau",
              description: "Une erreur réseau est survenue",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "Exécuter une commande SSH",
      description: "Exécuter une commande sur un serveur distant via SSH",
      fields: {
        connectionId: {
          label: "ID de connexion",
          description: "Connexion SSH à utiliser",
          placeholder: "uuid",
        },
        command: {
          label: "Commande",
          description: "Commande à exécuter",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Répertoire de travail",
          description: "Répertoire de travail de la commande",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Délai max. (ms)",
          description: "Délai maximal de la commande, en millisecondes",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Code de sortie" },
        status: { title: "Statut" },
        durationMs: { title: "Durée (ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Tronqué" },
      },
      success: {
        title: "Commande exécutée",
        description: "La commande a été exécutée",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de commande invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        forbidden: { title: "Interdit", description: "Accès refusé" },
        server: {
          title: "Erreur serveur",
          description: "Échec de l'exécution de la commande",
        },
        notFound: {
          title: "Connexion introuvable",
          description: "Connexion SSH introuvable",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Modifications non enregistrées détectées",
        },
        conflict: { title: "Conflit", description: "Un conflit est survenu" },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "Obtenir une connexion SSH",
        description: "Obtenir les détails d'une connexion SSH",
        response: {
          id: { title: "ID" },
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
          title: "Connexion trouvée",
          description: "La connexion SSH a été récupérée",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "La validation a échoué",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible d'obtenir la connexion",
          },
          notFound: {
            title: "Connexion introuvable",
            description: "Connexion SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    list: {
      get: {
        title: "Lister les connexions SSH",
        description: "Lister toutes les connexions SSH",
        response: {
          connections: { title: "Connexions" },
        },
        success: {
          title: "Connexions listées",
          description: "Les connexions SSH ont été récupérées",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "La validation a échoué",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de lister les connexions",
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
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    create: {
      post: {
        title: "Créer une connexion SSH",
        description: "Créer une nouvelle connexion SSH",
        fields: {
          label: {
            label: "Libellé",
            description: "Nom lisible de la connexion",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Hôte",
            description: "Nom d'hôte ou IP du serveur SSH",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "Port du serveur SSH",
            placeholder: "22",
          },
          username: {
            label: "Nom d'utilisateur",
            description: "Nom d'utilisateur SSH",
            placeholder: "deploy",
          },
          authType: {
            label: "Type d'authentification",
            description: "Méthode d'authentification",
          },
          secret: {
            label: "Secret",
            description: "Mot de passe ou clé privée",
          },
          passphrase: {
            label: "Phrase secrète",
            description: "Phrase secrète de la clé privée (le cas échéant)",
          },
          isDefault: {
            label: "Par défaut",
            description: "Définir comme connexion par défaut",
          },
          clusterRole: {
            label: "Rôle dans le cluster",
            description: "Rôle de ce serveur dans le cluster k8s",
          },
          notes: {
            label: "Notes",
            description: "Notes facultatives sur cette connexion",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Connexion créée",
          description: "La connexion SSH a été créée",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de connexion invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Impossible de créer la connexion",
          },
          notFound: {
            title: "Introuvable",
            description: "Ressource introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
    test: {
      post: {
        title: "Tester une connexion SSH",
        description: "Tester une connexion SSH",
        fields: {
          connectionId: {
            label: "ID de connexion",
            description: "ID de la connexion SSH à tester",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Accepter l'empreinte",
            description: "Accepter la nouvelle empreinte de l'hôte",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Succès" },
          latencyMs: { title: "Latence (ms)" },
          fingerprint: { title: "Empreinte" },
          fingerprintChanged: { title: "Empreinte modifiée" },
        },
        success: {
          title: "Connexion réussie",
          description: "Le test de connexion SSH a réussi",
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description: "Paramètres de test invalides",
          },
          unauthorized: {
            title: "Non autorisé",
            description: "Authentification requise",
          },
          forbidden: { title: "Interdit", description: "Accès refusé" },
          server: {
            title: "Erreur serveur",
            description: "Le test de connexion a échoué",
          },
          notFound: {
            title: "Connexion introuvable",
            description: "Connexion SSH introuvable",
          },
          unknown: {
            title: "Erreur inconnue",
            description: "Une erreur inattendue est survenue",
          },
          unsavedChanges: {
            title: "Modifications non enregistrées",
            description: "Modifications non enregistrées détectées",
          },
          conflict: { title: "Conflit", description: "Un conflit est survenu" },
          network: {
            title: "Erreur réseau",
            description: "Une erreur réseau est survenue",
          },
        },
      },
    },
  },
};
