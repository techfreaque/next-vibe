import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Utilisateurs",

    title: "Confirmer la réinitialisation du mot de passe",
    titleShort: "Confirmer la réinitialisation",
    description:
      "Confirmez la réinitialisation de votre mot de passe en choisissant un nouveau mot de passe",
    tag: "Réinitialisation du mot de passe",
    email: {
      title: "Mot de passe réinitialisé",
      subject: "Votre mot de passe a été réinitialisé - {{appName}}",
      previewText:
        "Votre mot de passe {{appName}} a été réinitialisé. Connectez-vous et discutez avec {{modelCount}} modèles d'IA.",
      greeting: "Bonjour {{name}},",
      successMessage:
        "Votre mot de passe a été réinitialisé. Tout est prêt : connectez-vous et reprenez là où vous vous étiez arrêté.",
      loginButton: "Se connecter à {{appName}}",
      promoText: "{{modelCount}} modèles d'IA. Sans filtres. Sans leçons de morale.",
      securityWarning:
        "Vous n'avez pas réinitialisé votre mot de passe ? Contactez immédiatement le support : votre compte est peut-être menacé.",
    },
    groups: {
      verification: {
        title: "Vérification",
        description: "Vérifiez votre demande de réinitialisation du mot de passe",
      },
      newPassword: {
        title: "Nouveau mot de passe",
        description: "Choisissez votre nouveau mot de passe",
      },
    },
    fields: {
      token: {
        label: "Jeton de réinitialisation",
        description: "Le jeton de réinitialisation reçu par e-mail",
        placeholder: "Saisissez le jeton de réinitialisation",
        help: "Retrouvez le jeton de réinitialisation dans votre e-mail et saisissez-le ici",
        validation: {
          required: "Le jeton de réinitialisation est obligatoire",
        },
      },
      email: {
        label: "Adresse e-mail",
        description: "Votre adresse e-mail",
        placeholder: "Saisissez votre adresse e-mail",
        validation: {
          invalid: "Veuillez saisir une adresse e-mail valide",
        },
      },
      password: {
        label: "Nouveau mot de passe",
        description: "Votre nouveau mot de passe",
        placeholder: "Saisissez un nouveau mot de passe",
        help: "Choisissez un mot de passe robuste d'au moins 8 caractères, avec des lettres, des chiffres et des symboles",
        validation: {
          minLength: "Le mot de passe doit contenir au moins 8 caractères",
        },
      },
      confirmPassword: {
        label: "Confirmer le mot de passe",
        description: "Confirmez votre nouveau mot de passe",
        placeholder: "Confirmez le nouveau mot de passe",
        validation: {
          minLength: "Le mot de passe doit contenir au moins 8 caractères",
        },
      },
    },
    validation: {
      passwords: {
        mismatch: "Les mots de passe ne correspondent pas",
      },
    },
    response: {
      title: "Réponse de réinitialisation du mot de passe",
      description: "Confirmation de la réinitialisation du mot de passe",
      message: {
        label: "Message",
        description: "Message de réponse",
      },
      securityTip:
        "Pensez à activer l'authentification à deux facteurs pour mieux protéger votre compte",
      nextSteps: [
        "Connectez-vous avec votre nouveau mot de passe",
        "Mettez à jour les mots de passe enregistrés dans votre navigateur",
        "Pensez à activer la 2FA pour plus de sécurité",
      ],
    },
    errors: {
      title: "Erreur de réinitialisation du mot de passe",
      no_email: "Aucun compte n'est associé à cette adresse e-mail",
      validation: {
        title: "Erreur de validation",
        description: "Veuillez vérifier votre saisie et réessayer",
        passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Jeton de réinitialisation invalide ou expiré",
      },
      internal: {
        title: "Erreur serveur",
        description: "Une erreur interne du serveur s'est produite",
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
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation d'effectuer cette action",
      },
      notFound: {
        title: "Introuvable",
        description: "Jeton de réinitialisation introuvable ou expiré",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors du traitement de votre demande",
      },
    },
    success: {
      title: "Mot de passe réinitialisé",
      description: "Votre mot de passe a bien été réinitialisé",
      message: "Le mot de passe a bien été réinitialisé",
      password_reset: "Votre mot de passe a bien été réinitialisé",
    },
    actions: {
      requestNewLink: "Demander un nouveau lien de réinitialisation",
    },
    emailTemplates: {
      confirm: {
        name: "E-mail de confirmation de réinitialisation du mot de passe",
        description:
          "E-mail envoyé aux utilisateurs une fois leur mot de passe réinitialisé",
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
        },
      },
    },
  },
  request: {
    category: "Utilisateurs",
    title: "Demande de réinitialisation du mot de passe",
    titleShort: "Réinitialiser le mot de passe",
    description: "Demander la réinitialisation du mot de passe",
    tag: "Réinitialisation du mot de passe",
    ui: {
      title: "Réinitialiser votre mot de passe",
      subtitle:
        "Saisissez votre e-mail. Nous vous enverrons un lien de réinitialisation.",
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
        label: "E-mail",
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
      no_email: "Aucun compte n'est associé à cette adresse e-mail",
      email_generation_failed: "Impossible de générer l'e-mail",
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
  },
  validate: {
    category: "Utilisateurs",

    title: "Valider le jeton de réinitialisation",
    titleShort: "Valider le jeton",
    description: "Endpoint de validation du jeton de réinitialisation du mot de passe",
    tag: "Validation de la réinitialisation du mot de passe",
    groups: {
      tokenInput: {
        title: "Validation du jeton",
        description: "Saisissez le jeton de réinitialisation à valider",
      },
    },
    fields: {
      token: {
        label: "Jeton de réinitialisation",
        description: "Jeton de réinitialisation reçu par e-mail",
        placeholder: "Saisissez le jeton de réinitialisation",
        help: "Saisissez le jeton reçu dans votre e-mail",
        validation: {
          required: "Le jeton de réinitialisation est obligatoire",
        },
      },
    },
    response: {
      title: "Résultat de la validation",
      description: "Réponse de validation du jeton",
      valid: "Jeton valide",
      message: "Message de validation",
      validationMessage: "Validation du jeton de réinitialisation terminée",
      userId: "ID utilisateur",
      expiresAt: "Expiration du jeton",
      nextSteps: {
        item: "Prochaines étapes après la validation",
        setPassword: "Passez à la définition de votre nouveau mot de passe",
        choosePassword: "Choisissez un mot de passe robuste et unique",
      },
    },
    errors: {
      title: "Erreur",
      validation: {
        title: "Erreur de validation",
        description: "La validation du jeton a échoué",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Jeton invalide ou expiré",
      },
      internal: {
        title: "Erreur interne",
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
        description: "Jeton introuvable",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées détectées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit de données s'est produit",
      },
    },
    success: {
      title: "Jeton valide",
      description: "Le jeton de réinitialisation du mot de passe est valide",
    },
    post: {
      title: "Valider",
      description: "Endpoint de validation",
      form: {
        title: "Configuration de la validation",
        description: "Configurer les paramètres de validation",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de la validation",
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
  },
  actions: {
    back: "Retour",
    submit: "Envoyer",
    submitting: "Envoi...",
  },
  success: {
    password_reset: "Votre mot de passe a bien été réinitialisé.",
  },
  errors: {
    tokenValidationFailed: "La validation du jeton a échoué",
    userLookupFailed: "Impossible de rechercher l'utilisateur",
    tokenDeletionFailed: "Impossible de supprimer le jeton",
    userDeletionFailed: "Impossible de supprimer l'utilisateur",
    resetFailed: "La réinitialisation du mot de passe a échoué",
    tokenCreationFailed: "Impossible de créer le jeton de réinitialisation",
    noDataReturned: "Aucune donnée renvoyée par la base de données",
    tokenInvalid: "Le jeton de réinitialisation est invalide",
    tokenExpired: "Le jeton de réinitialisation a expiré",
    tokenVerificationFailed: "La vérification du jeton a échoué",
    userNotFound: "Utilisateur introuvable",
    passwordUpdateFailed: "Impossible de mettre à jour le mot de passe",
    passwordResetFailed: "La réinitialisation du mot de passe a échoué",
    requestFailed: "La demande de réinitialisation a échoué",
    emailMismatch: "L'adresse e-mail ne correspond pas",
    confirmationFailed:
      "La confirmation de la réinitialisation du mot de passe a échoué",
  },
};
