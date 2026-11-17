import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utilisateurs",

  title: "Confirmer la réinitialisation du mot de passe",
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
};
