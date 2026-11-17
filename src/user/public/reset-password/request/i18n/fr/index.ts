import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",
  title: "Demande de réinitialisation du mot de passe",
  description: "Demander la réinitialisation du mot de passe",
  tag: "Réinitialisation du mot de passe",
  ui: {
    title: "Réinitialiser votre mot de passe",
    subtitle:
      "Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe",
    sendResetLink: "Envoyer le lien de réinitialisation",
    alreadyHaveAccount: "Vous avez déjà un compte ? Connectez-vous",
  },
  actions: {
    submitting: "Envoi...",
  },
  email: {
    title: "Réinitialisez votre mot de passe {{appName}}",
    subject: "Demande de réinitialisation du mot de passe - {{appName}}",
    previewText:
      "Réinitialisez votre mot de passe {{appName}}. Lien valable {{hours}} heures.",
    greeting: "Bonjour {{name}},",
    requestInfo:
      "Une réinitialisation du mot de passe a été demandée pour votre compte {{appName}}. Si c'est bien vous, cliquez sur le bouton ci-dessous.",
    buttonText: "Réinitialiser mon mot de passe",
    expirationInfo:
      "Ce lien expire dans {{hours}} heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.",
    signoff: "L'équipe {{appName}}",
    promoText: "{{modelCount}} modèles d'IA. Sans filtres. Sans leçons de morale.",
  },
  groups: {
    emailInput: {
      title: "Adresse e-mail",
      description:
        "Saisissez votre adresse e-mail pour recevoir les instructions de réinitialisation",
    },
  },
  fields: {
    email: {
      label: "Adresse e-mail",
      description: "Saisissez votre adresse e-mail",
      placeholder: "vous@exemple.com",
      help: "Saisissez l'adresse e-mail associée à votre compte",
      validation: {
        invalid: "Veuillez saisir une adresse e-mail valide",
      },
    },
  },
  response: {
    title: "Réponse de la demande de réinitialisation",
    description: "Réponse à la demande de réinitialisation du mot de passe",
    success: {
      message: "Lien de réinitialisation envoyé",
    },
    deliveryInfo: {
      estimatedTime: "d'ici 5 minutes",
      expiresAt: "dans 4 heures",
    },
    nextSteps: {
      checkEmail: "Vérifiez votre boîte de réception et vos spams",
      clickLink: "Cliquez sur le lien de réinitialisation dans l'e-mail",
      createPassword: "Créez un nouveau mot de passe sécurisé",
    },
  },
  errors: {
    title: "Erreur",
    validation: {
      title: "Erreur de validation",
      description: "Saisie invalide",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Demande non autorisée",
    },
    internal: {
      title: "Erreur interne",
      description: "Erreur interne du serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Erreur de connexion réseau",
    },
    forbidden: {
      title: "Accès interdit",
      description: "Accès refusé",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Les modifications n'ont pas été enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit de données s'est produit",
    },
    no_email: "Aucun compte trouvé pour {{email}}",
    email_generation_failed:
      "Impossible de générer l'e-mail de réinitialisation pour {{email}} : {{errorMessage}}",
  },
  success: {
    title: "Demande envoyée",
    description: "Demande de réinitialisation du mot de passe envoyée",
  },
  post: {
    title: "Demande",
    description: "Endpoint de demande",
    form: {
      title: "Configuration de la demande",
      description: "Configurer les paramètres de la demande",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de la demande",
    },
    errors: {
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
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
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
    },
  },
  emailTemplates: {
    request: {
      name: "E-mail de demande de réinitialisation du mot de passe",
      description:
        "E-mail envoyé aux utilisateurs avec un lien pour réinitialiser leur mot de passe",
      category: "Authentification",
      preview: {
        publicName: {
          label: "Nom public",
          description: "Le nom d'affichage public de l'utilisateur",
        },
        userId: {
          label: "ID utilisateur",
          description: "L'identifiant unique de l'utilisateur",
        },
        passwordResetUrl: {
          label: "URL de réinitialisation du mot de passe",
          description: "L'URL permettant de réinitialiser le mot de passe",
        },
      },
    },
  },
};
