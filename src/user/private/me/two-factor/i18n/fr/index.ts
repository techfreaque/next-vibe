import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil utilisateur",
  title: "Authentification à deux facteurs",
  titleShort: "Deux facteurs",
  description:
    "Protégez votre compte avec un code à usage unique issu d'une application d'authentification. Configurez-la, désactivez-la ou régénérez vos codes de récupération.",
  tag: "deux-facteurs",
  enums: {
    action: {
      status: "Statut",
      setup: "Lancer la configuration",
      enable: "Confirmer et activer",
      disable: "Désactiver",
      regenerate: "Régénérer les codes de récupération",
    },
  },
  fields: {
    action: {
      label: "Action",
      description:
        "status, setup, enable, disable ou regenerate. setup renvoie un secret, puis enable le confirme avec un code.",
    },
    code: {
      label: "Code d'authentification",
      description:
        "Code à 6 chiffres de votre application d'authentification, ou un code de récupération.",
      placeholder: "123456",
    },
    password: {
      label: "Mot de passe",
      description:
        "Le mot de passe de votre compte (alternative au code pour désactiver).",
      placeholder: "Votre mot de passe",
    },
  },
  response: {
    enabled: "Deux facteurs activée",
    message: "Statut",
    recoveryCodesRemaining: "Codes de récupération restants",
    otpauthUri: "URI d'authentification",
    secret: "Clé secrète",
    qrDataUri: "QR code",
    recoveryCodes: "Codes de récupération",
  },
  widget: {
    back: "Retour",
    statusOn: "Activée",
    statusOff: "Désactivée",
    offIntro:
      "Ajoutez une deuxième étape à la connexion. Même avec votre mot de passe, personne n'entre sans le code de votre téléphone.",
    startSetup: "Configurer la double authentification",
    setupStep1:
      "1. Scannez ce QR code avec une application d'authentification (Google Authenticator, Aegis, 1Password, Authy).",
    setupStep2: "Impossible de scanner ? Saisissez cette clé manuellement :",
    setupStep3:
      "2. Saisissez le code à 6 chiffres affiché par l'application pour confirmer.",
    confirm: "Confirmer et activer",
    confirming: "Confirmation...",
    cancelSetup: "Annuler",
    onIntro:
      "La connexion demande un code de votre application d'authentification. Codes de récupération restants : {{count}}.",
    recoveryTitle: "Enregistrez vos codes de récupération",
    recoveryHint:
      "Chaque code fonctionne une seule fois si vous perdez votre téléphone. Ils ne s'affichent que maintenant. Conservez-les en lieu sûr.",
    recoveryCopy: "Copier les codes",
    recoveryCopied: "Copié",
    recoveryDone: "Je les ai enregistrés",
    manageTitle: "Gérer",
    manageHint:
      "Saisissez un code actuel de votre application (ou un code de récupération) pour modifier les paramètres.",
    regenerate: "Régénérer les codes de récupération",
    disable: "Désactiver la double authentification",
    disablePasswordHint: "Ou confirmez plutôt avec votre mot de passe :",
    working: "En cours...",
  },
  errors: {
    notConfigured:
      "La double authentification nécessite une clé serveur (JWT_SECRET_KEY), qui n'est pas définie.",
    alreadyEnabled:
      "La double authentification est déjà activée. Désactivez-la d'abord pour relancer la configuration.",
    notEnabled: "La double authentification n'est pas activée.",
    noPendingSetup:
      "Aucune configuration en cours. Lancez d'abord la configuration.",
    codeRequired: "Saisissez le code à 6 chiffres.",
    invalidCode:
      "Ce code n'est pas valide. Vérifiez l'heure de votre téléphone et réessayez.",
    credentialRequired:
      "Saisissez un code actuel, un code de récupération ou votre mot de passe.",
    invalidPassword: "Mot de passe incorrect.",
    tooManyAttempts:
      "Trop de tentatives incorrectes. Patientez quelques minutes et réessayez.",
    userNotFound: "Compte introuvable.",
    failed:
      "Impossible de mettre à jour les paramètres de double authentification.",
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
    },
    unauthorized: {
      title: "Non autorisé",
      description:
        "Vous devez être connecté pour gérer la double authentification",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de mettre à jour la double authentification",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
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
      title: "Introuvable",
      description: "Compte introuvable",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit s'est produit",
    },
  },
  success: {
    title: "Double authentification mise à jour",
    description: "Vos paramètres de double authentification sont enregistrés",
    status: "Statut de la double authentification chargé.",
    setupStarted:
      "Scannez le QR code, puis confirmez avec un code pour l'activer.",
    enabled:
      "La double authentification est activée. Enregistrez vos codes de récupération maintenant : ils ne s'affichent qu'une fois.",
    disabled: "La double authentification est désactivée.",
    regenerated:
      "Nouveaux codes de récupération générés. Les anciens ne fonctionnent plus.",
  },
};
