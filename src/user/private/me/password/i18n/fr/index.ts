import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil utilisateur",

  title: "Changer le mot de passe",
  titleShort: "Changer le mot de passe",
  description:
    "Confirmez votre mot de passe actuel, puis choisissez-en un nouveau.",
  tag: "changement-mot-de-passe",
  debug: {
    updatingPassword: "Mise à jour du mot de passe",
    errorUpdatingPassword: "Erreur lors de la mise à jour du mot de passe",
    settingPassword: "Définition du mot de passe",
    errorSettingPassword: "Erreur lors de la définition du mot de passe",
  },
  groups: {
    currentCredentials: {
      title: "Mot de passe actuel",
      description: "Confirmez votre mot de passe actuel pour continuer",
    },
    newCredentials: {
      title: "Nouveau mot de passe",
      description:
        "Choisissez un nouveau mot de passe robuste pour votre compte",
    },
  },
  currentPassword: {
    label: "Mot de passe actuel",
    description: "Saisissez votre mot de passe actuel",
    placeholder: "Votre mot de passe actuel",
    help: "Saisissez votre mot de passe actuel pour confirmer votre identité avant de le changer",
  },
  newPassword: {
    label: "Nouveau mot de passe",
    description: "Au moins 8 caractères.",
    placeholder: "Au moins 8 caractères",
    help: "Choisissez un mot de passe robuste d'au moins 8 caractères, avec des lettres, des chiffres et des symboles",
  },
  confirmPassword: {
    label: "Répéter le nouveau mot de passe",
    description: "Confirmez votre nouveau mot de passe",
    placeholder: "Saisissez-le à nouveau",
    help: "Saisissez à nouveau votre nouveau mot de passe pour éviter toute faute de frappe",
  },
  twoFactorCode: {
    label: "Code à deux facteurs",
    description:
      "Saisissez votre code d'authentification à deux facteurs si elle est activée",
    placeholder: "Code 2FA",
  },
  response: {
    title: "Réponse au changement de mot de passe",
    description: "Réponse à l'opération de changement de mot de passe",
    success: "Mot de passe changé",
    message: "Message d'état",
    securityTip: "Conseil de sécurité",
    nextSteps: {
      item: "Prochaines étapes",
    },
  },
  validation: {
    currentPassword: {
      minLength: "Le mot de passe actuel doit contenir au moins 8 caractères",
    },
    newPassword: {
      minLength: "Le nouveau mot de passe doit contenir au moins 8 caractères",
    },
    confirmPassword: {
      minLength: "La confirmation doit contenir au moins 8 caractères",
    },
    passwords: {
      mismatch: "Les mots de passe ne correspondent pas",
    },
  },
  errors: {
    passwords_do_not_match: "Les mots de passe ne correspondent pas",
    user_not_found: "Utilisateur {{userId}} introuvable",
    incorrect_password: "Mot de passe incorrect",
    update_failed: "Échec de la mise à jour du mot de passe",
    token_creation_failed: "Impossible de créer le jeton de mot de passe",
    two_factor_code_required: "Code d'authentification à deux facteurs requis",
    invalid_two_factor_code: "Code d'authentification à deux facteurs invalide",
    invalid_request: {
      title: "Requête invalide",
      description: "La demande de changement de mot de passe est invalide",
    },
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être connecté pour changer votre mot de passe",
    },
    server: {
      title: "Erreur serveur",
      description:
        "Impossible de mettre à jour le mot de passe en raison d'une erreur serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description:
        "Une erreur inattendue s'est produite lors de la mise à jour du mot de passe",
    },
    network: {
      title: "Erreur réseau",
      description: "La connexion réseau a échoué",
    },
    forbidden: {
      title: "Accès interdit",
      description: "Vous n'êtes pas autorisé à effectuer cette action",
    },
    notFound: {
      title: "Utilisateur introuvable",
      description: "Le compte utilisateur est introuvable",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vos modifications non enregistrées seront perdues",
    },
    conflict: {
      title: "Conflit de données",
      description:
        "Un conflit s'est produit lors de la mise à jour du mot de passe",
    },
  },
  success: {
    updated: "Mot de passe mis à jour",
    securityTip:
      "Pour plus de sécurité, activez l'authentification à deux facteurs",
    nextSteps: {
      logoutOther:
        "Toutes les autres sessions sont déconnectées. Utilisez le nouveau mot de passe la prochaine fois.",
      enable2fa:
        "Pensez à activer l'authentification à deux facteurs pour mieux protéger votre compte",
    },
    title: "Mot de passe mis à jour",
    description: "Votre mot de passe a bien été mis à jour",
  },
  update: {
    success: {
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a bien été mis à jour",
    },
    errors: {
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite lors de la mise à jour du mot de passe",
      },
    },
  },
  widget: {
    back: "Retour",
    submit: "Mettre à jour le mot de passe",
    submitting: "Mise à jour...",
  },
};
