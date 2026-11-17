import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",
  title: "Vérifier votre e-mail",
  titleShort: "Vérifier l'e-mail",
  description:
    "Confirmez votre adresse e-mail avec le lien que nous vous avons envoyé. Appelez sans jeton pour renvoyer le lien.",
  tag: "verification-email",
  token: {
    label: "Jeton de vérification",
    description:
      "Issu du lien de votre e-mail de vérification. Laissez vide pour renvoyer l'e-mail.",
    placeholder: "Jeton reçu par e-mail",
  },
  response: {
    verified: "Vérifié",
    message: "Statut",
    email: "E-mail",
  },
  widget: {
    heroTitle: "Confirmez votre e-mail",
    heroDescription: "Un clic et votre adresse est vérifiée.",
    confirmButton: "Vérifier mon e-mail",
    confirming: "Vérification...",
    doneTitle: "E-mail vérifié",
    doneDescription: "Votre adresse est confirmée. Tout est prêt.",
    resend: "M'envoyer un nouveau lien",
    continue: "Continuer",
  },
  creditsPrompt: {
    title: "Confirmez votre e-mail pour recevoir vos crédits gratuits",
    description:
      "Cliquez sur le lien que nous vous avons envoyé et votre compte recevra {{credits}} crédits gratuits chaque mois.",
    resend: "Renvoyer le lien",
    sending: "Envoi...",
    sent: "Lien envoyé à {{email}}. Pensez aussi à vérifier vos spams.",
  },
  email: {
    subject: "Débloquez vos {{credits}} crédits gratuits sur {{appName}}",
    title: "Confirmez votre e-mail",
    previewText:
      "Un clic confirme votre adresse et active vos crédits gratuits.",
    greeting: "Bonjour {{name}},",
    body: "Votre compte est prêt. Confirmez cette adresse et il recevra {{credits}} crédits gratuits chaque mois. Aucune carte bancaire requise.",
    newsletter:
      "Ce même clic confirme aussi votre abonnement à la newsletter : votre compte reçoit {{credits}} crédits gratuits supplémentaires chaque mois tant que vous restez abonné.",
    button: "Confirmer et débloquer mes crédits",
    reminder: {
      subject: "Vos {{credits}} crédits gratuits sont toujours en attente",
      previewText: "Un clic sur le lien suffit pour les activer.",
      body: "Vous avez créé votre compte {{appName}} hier, mais cette adresse n'est pas encore confirmée. Tant qu'elle ne l'est pas, vos {{credits}} crédits gratuits mensuels restent en attente. Un clic suffit.",
    },
    expiry:
      "Ce lien est valable {{days}} jours. Si vous n'avez pas créé de compte, ignorez cet e-mail.",
    signoff: "L'équipe {{appName}}",
  },
  emailTemplates: {
    name: "Vérification de l'e-mail",
    description:
      "Envoyé après l'inscription et sur demande pour vérifier l'e-mail du compte",
    category: "Compte",
  },
  errors: {
    invalidToken:
      "Ce lien de vérification est invalide ou a expiré. Demandez-en un nouveau depuis les paramètres.",
    userNotFound: "Compte introuvable.",
    failed: "Impossible de vérifier l'e-mail.",
    needLogin: "Connectez-vous pour renvoyer l'e-mail de vérification.",
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Connectez-vous pour renvoyer l'e-mail de vérification",
    },
    server: {
      title: "Erreur serveur",
      description: "La vérification a échoué à cause d'une erreur serveur",
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
      description: "Vous n'avez pas l'autorisation de faire cela",
    },
    notFound: {
      title: "Introuvable",
      description: "Le compte est introuvable",
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
    title: "Terminé",
    description: "Vérification de l'e-mail mise à jour",
    verified: "Votre e-mail est vérifié.",
    alreadyVerified: "Votre e-mail est déjà vérifié.",
    sent: "E-mail de vérification envoyé. Consultez votre boîte de réception.",
  },
};
