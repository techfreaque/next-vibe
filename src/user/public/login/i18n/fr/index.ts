import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  title: "Bon retour parmi nous",
  titleShort: "Se connecter",
  description:
    "Accédez aux modèles d'IA non censurés et à l'historique de vos conversations.",
  tag: "Authentification",
  options: {
    category: "Utilisateurs",

    title: "Options de connexion",
    description: "Options de configuration de la connexion",
    tag: "options-connexion",
    container: {
      title: "Configuration de la connexion",
      description: "Configurer les paramètres et options de connexion",
    },
    fields: {
      email: {
        label: "Adresse e-mail",
        description: "Saisissez votre adresse e-mail",
        placeholder: "vous@exemple.com",
      },
      allowPasswordAuth: {
        label: "Autoriser l'authentification par mot de passe",
        description: "Activer l'authentification par mot de passe",
      },
      allowSocialAuth: {
        label: "Autoriser la connexion via les réseaux sociaux",
        description:
          "Activer l'authentification via des fournisseurs de réseaux sociaux",
      },
      maxAttempts: {
        label: "Nombre maximal de tentatives de connexion",
        description: "Nombre maximal de tentatives de connexion autorisées",
      },
      requireTwoFactor: {
        label: "Exiger l'authentification à deux facteurs",
        description: "Exiger la 2FA pour la connexion des utilisateurs",
      },
      socialProviders: {
        label: "Fournisseurs sociaux",
        description: "Fournisseurs d'authentification sociale disponibles",
      },
      socialProvider: {
        title: "Fournisseur social",
        description: "Configuration du fournisseur d'authentification sociale",
        enabled: {
          label: "Activé",
          description: "Indique si ce fournisseur est activé",
        },
        name: {
          label: "Nom du fournisseur",
          description: "Nom du fournisseur social",
        },
        providers: {
          label: "Options des fournisseurs",
          description: "Options de fournisseurs sociaux disponibles",
        },
      },
    },
    response: {
      title: "Réponse des options de connexion",
      description: "Options de configuration de la connexion disponibles",
      success: {
        badge: "Succès",
      },
      message: {
        content: "Message d'état",
      },
      forUser: {
        content: "Adresse e-mail",
      },
      loginMethods: {
        title: "Méthodes de connexion",
        description: "Méthodes d'authentification disponibles",
        password: {
          title: "Connexion par mot de passe",
          description: "Authentification standard par mot de passe",
          enabled: {
            badge: "Activé",
          },
        },
        social: {
          title: "Connexion sociale",
          description: "Options d'authentification via les réseaux sociaux",
          enabled: {
            badge: "Activé",
          },
          providers: {
            item: {
              title: "Fournisseur social",
              description: "Fournisseur d'authentification sociale",
            },
            name: {
              content: "Nom du fournisseur",
            },
            id: {
              content: "ID du fournisseur",
            },
            enabled: {
              badge: "Disponible",
            },
            description: "Description du fournisseur",
          },
        },
      },
      security: {
        title: "Paramètres de sécurité",
        description: "Exigences de sécurité de l'authentification",
        maxAttempts: {
          content: "Nombre maximal de tentatives de connexion",
        },
        requireTwoFactor: {
          badge: "2FA requise",
        },
      },
      recommendations: {
        item: "Option de connexion recommandée",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Accès refusé",
      },
      notFound: {
        title: "Introuvable",
        description: "Ressource introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Les modifications n'ont pas été enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Options de connexion récupérées",
    },
    post: {
      title: "Options de connexion",
      description: "Obtenir les options de connexion disponibles",
      response: {
        title: "Réponse des options de connexion",
        description: "Options de configuration de la connexion disponibles",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Paramètres de requête invalides",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Authentification requise",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne du serveur s'est produite",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inconnue s'est produite",
        },
      },
      success: {
        description: "Options de connexion récupérées",
      },
    },
    enums: {
      socialProviders: {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
      },
    },
    messages: {
      successMessage: "Options de connexion récupérées",
      passwordAuthDescription:
        "Connectez-vous avec votre adresse e-mail et votre mot de passe",
      socialAuthDescription:
        "La connexion via les réseaux sociaux n'est pas encore disponible. Utilisez votre e-mail et votre mot de passe.",
      continueWithProvider: "Continuer avec {{provider}}",
      twoFactorRequired: "Sécurité renforcée : 2FA requise",
      standardSecurity: "Exigences de sécurité standard",
      tryPasswordFirst: "Essayez d'abord la connexion par mot de passe",
      useSocialLogin: "Utiliser la connexion sociale",
      socialLoginFaster:
        "La connexion sociale est plus rapide pour les nouveaux utilisateurs",
    },
  },
  actions: {
    submit: "Se connecter",
    submitting: "Connexion...",
  },
  fields: {
    email: {
      label: "Votre e-mail",
      description: "L'adresse e-mail utilisée lors de votre inscription.",
      placeholder: "Saisissez votre e-mail",
      validation: {
        required: "L'adresse e-mail est obligatoire",
        invalid: "Veuillez saisir une adresse e-mail valide",
      },
    },
    password: {
      label: "Votre mot de passe",
      description:
        "Saisissez le mot de passe choisi lors de votre inscription.",
      placeholder: "Saisissez votre mot de passe",
      help: "Saisissez le mot de passe de votre compte",
      validation: {
        required: "Le mot de passe est obligatoire",
        minLength: "Le mot de passe doit contenir au moins 8 caractères",
      },
    },
    twoFactorCode: {
      label: "Code d'authentification",
      description:
        "Utilisez le code de l'application ou un code de récupération.",
      placeholder: "Code à 6 chiffres",
    },
    rememberMe: {
      label: "Rester connecté",
    },
  },
  twoFactorStep: {
    title: "Vérification en deux étapes",
    helper:
      "Saisissez le code à 6 chiffres de votre application d'authentification.",
    recoveryHelper:
      "Saisissez l'un de vos codes de récupération. Chacun ne fonctionne qu'une fois.",
    codeLabel: "Code d'authentification",
    recoveryLabel: "Code de récupération",
    recoveryPlaceholder: "XXXXX-XXXXX",
    useRecovery: "Utiliser un code de récupération",
    useApp: "Utiliser l'application d'authentification",
    verify: "Vérifier",
    verifying: "Vérification...",
    back: "Retour",
  },
  groups: {
    credentials: {
      title: "Identifiants de connexion",
      description: "Saisissez vos informations de connexion",
    },
    options: {
      title: "Options de connexion",
      description: "Préférences et paramètres de connexion supplémentaires",
    },
    preferences: {
      title: "Préférences de connexion",
      description: "Options de connexion supplémentaires",
    },
    advanced: {
      title: "Options avancées",
      description: "Paramètres de connexion avancés",
    },
  },
  footer: {
    forgotPassword: "Mot de passe oublié ?",
    createAccount: "Pas encore de compte ? Inscrivez-vous",
  },
  response: {
    title: "Réponse de connexion",
    description: "Données de réponse de la connexion",
    success: "Connexion réussie",
    message: "Message d'état",
    user: {
      title: "Détails de l'utilisateur",
      description: "Informations sur l'utilisateur connecté",
      id: "ID utilisateur",
      email: "Adresse e-mail",
      firstName: "Prénom",
      lastName: "Nom",
      privateName: "Nom privé",
      publicName: "Nom public",
      imageUrl: "Photo de profil",
    },
    sessionInfo: {
      title: "Informations de session",
      description: "Détails de la session utilisateur",
      expiresAt: "Expiration de la session",
      rememberMeActive: "Statut « Rester connecté »",
      loginLocation: "Lieu de connexion",
    },
    nextSteps: {
      title: "Prochaines étapes",
      item: "Prochaines étapes",
    },
  },
  errors: {
    title: "Erreur de connexion",
    account_suspended:
      "Compte suspendu. Une erreur selon vous ? Écrivez au support.",
    account_locked: "Le compte est verrouillé",
    accountLocked: "Le compte est verrouillé",
    accountLockedDescription:
      "Votre compte a été verrouillé. Veuillez contacter le support.",
    invalid_credentials:
      "E-mail ou mot de passe incorrect. Pas encore de compte ? Inscrivez-vous d'abord.",
    two_factor_required: "Authentification à deux facteurs requise",
    invalid_two_factor_code: "Code d'authentification invalide",
    auth_error: "Échec de l'authentification pour {{email}} : {{error}}",
    user_not_found: "Aucun utilisateur trouvé pour {{userId}}",
    session_creation_failed:
      "Impossible de créer une session pour {{userId}} : {{error}}",
    token_save_failed: "Échec de l'enregistrement du jeton d'authentification",
    validation: {
      title: "Échec de la validation",
      description: "Veuillez vérifier votre saisie",
    },
    unauthorized: {
      title: "Échec de la connexion",
      description: "Identifiants invalides",
    },
    unknown: {
      title: "Erreur de connexion",
      description: "Une erreur s'est produite lors de la connexion",
    },
    network: {
      title: "Erreur réseau",
      description: "Échec de la connexion au serveur",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Connexion non autorisée",
    },
    notFound: {
      title: "Utilisateur introuvable",
      description: "Compte utilisateur introuvable",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Les modifications n'ont pas été enregistrées",
    },
    conflict: {
      title: "Conflit de connexion",
      description: "Conflit de connexion détecté",
    },
    server: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur s'est produite",
    },
  },
  success: {
    title: "Connexion réussie",
    description: "Vous êtes connecté",
    message: "Bon retour ! Vous êtes bien connecté.",
  },
  token: {
    save: {
      failed: "Échec de l'enregistrement du jeton d'authentification",
      success: "Jeton d'authentification enregistré",
    },
  },
  process: {
    failed: "Le processus de connexion a échoué",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Connexion rapide (dev)",
  },
};
