import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  title: "Options de connexion",
  titleShort: "Options de connexion",
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
    socialAuthDescription: "Connectez-vous avec vos comptes de réseaux sociaux",
    continueWithProvider: "Continuer avec {{provider}}",
    twoFactorRequired: "Sécurité renforcée : 2FA requise",
    standardSecurity: "Exigences de sécurité standard",
    tryPasswordFirst: "Essayez d'abord la connexion par mot de passe",
    useSocialLogin: "Utiliser la connexion sociale",
    socialLoginFaster:
      "La connexion sociale est plus rapide pour les nouveaux utilisateurs",
  },
};
