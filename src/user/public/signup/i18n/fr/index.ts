import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Relever les échecs de livraison à l’inscription",
    description:
      "Vérifie si la boîte système a reçu des avis de non-remise pour les e-mails de confirmation.",
    marked: "Inscriptions mises à jour",
    result: "Inscriptions mises à jour : {{count}}",
    productionOnly: "Le relevé fonctionne uniquement en production.",
    mailboxUnavailable:
      "Impossible de relever les avis de non-remise dans la boîte système.",
  },
  events: {
    started: "Inscription commencée",
    emailSent: "E-mail de confirmation envoyé",
    sendFailed: "Échec de l'e-mail de confirmation",
    bounced: "E-mail de confirmation rejeté",
    expired: "Confirmation expirée",
    confirmed: "E-mail confirmé",
  },
  confirmation: {
    bouncedTitle: "L’e-mail de confirmation n’a pas été remis",
    changeAddress: "Modifier l’adresse e-mail",
    description:
      "Terminez votre inscription avec le code ou le lien reçu par e-mail.",
    title: "Consultez votre messagerie",
    sent: "Saisissez le code envoyé à {{email}}. Il reste valable 30 minutes.",
    code: "Code à 6 chiffres",
    confirm: "Confirmer et se connecter",
    change: "Adresse incorrecte ? Modifiez-la",
    resend: "Renvoyer le code",
    countdown: "Nouvel envoi dans {{seconds}} s",
    save: "Envoyer à cette adresse",
    cancel: "Annuler",
    email: "Adresse e-mail",
    hint: "Pour créer votre compte, saisissez ce code ou ouvrez le lien ci-dessous dans les 30 minutes.",
    bounce:
      "Le message envoyé à {{email}} nous est revenu. Corrigez votre adresse pour recevoir un nouveau code.",
    invalid:
      "Ce code ou ce lien est incorrect ou a expiré. Demandez un nouveau code.",
    cooldown: "Trop de demandes. Patientez avant de demander un nouveau code.",
    domain:
      "Ce domaine ne peut pas recevoir de messages. Vérifiez votre adresse.",
    bouncePolicy:
      "Votre messagerie a bloqué notre message. Les adresses scolaires et professionnelles refusent souvent les messages externes. Utilisez une autre adresse.",
    bounceMailboxMissing:
      "Votre messagerie indique que l’adresse {{email}} n’existe pas. Vérifiez la saisie ou utilisez une autre adresse.",
    bounceMailboxFull:
      "La boîte de réception de {{email}} est pleine. Libérez de l’espace et demandez un nouveau code, ou utilisez une autre adresse.",
    sendFailed:
      "L’envoi à {{email}} a échoué. Vérifiez votre adresse ou réessayez.",
    done: "Votre adresse est confirmée. Vous êtes connecté.",
    newsletter:
      "Vous confirmez également votre inscription à la newsletter demandée.",
    link: "Confirmer mon adresse",
    pendingId: "Référence d’inscription",
    token: "Jeton du lien de confirmation",
    callback: "Chemin de retour",
    suggestion: "Vouliez-vous écrire {{email}} ?",
    expired:
      "Cette inscription a expiré. Recommencez pour recevoir un nouveau code.",
    retry: "Recommencer l’inscription",
  },
  category: "Utilisateurs",

  _components: {
    passwordStrength: {
      label: "Robustesse du mot de passe",
      weak: "Faible",
      fair: "Moyen",
      good: "Bon",
      strong: "Robuste",
      requirement: {
        minLength: {
          icon: "✗",
          text: "Au moins 8 caractères",
        },
        uppercase: {
          icon: "✗",
          text: "Au moins une majuscule",
        },
        lowercase: {
          icon: "✗",
          text: "Au moins une minuscule",
        },
        number: {
          icon: "✗",
          text: "Au moins un chiffre",
        },
        special: {
          icon: "!",
          text: "Caractère spécial (facultatif, renforce le mot de passe)",
        },
      },
    },
    post: {
      title: "_components",
      description: "Endpoint _components",
      form: {
        title: "Configuration de _components",
        description: "Configurer les paramètres de _components",
      },
      response: {
        title: "Réponse",
        description: "Données de réponse de _components",
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
  title: "Inscription",
  titleShort: "S'inscrire",
  description: "Endpoint d'inscription des utilisateurs",
  tag: "Authentification",
  form: {
    title: "Créer votre compte",
    description: "Tous les modèles. Vos règles. Gratuit pour commencer.",
  },
  actions: {
    submit: "Envoyer le code",
    submitting: "Envoi du code…",
  },
  fields: {
    privateName: {
      label: "Nom privé",
      description:
        "Le nom que l'IA utilise pour vous. Jamais montré à personne d'autre.",
      placeholder: "ex. Alex",
      validation: {
        required: "Le nom privé est obligatoire",
        minLength: "Le nom doit contenir au moins 2 caractères",
        maxLength: "Le nom doit contenir moins de 100 caractères",
      },
    },
    publicName: {
      label: "Nom public",
      description: "Affiché dans les chats partagés et les forums.",
      placeholder: "ex. alex_builds",
      validation: {
        required: "Le nom affiché est obligatoire",
        minLength: "Le nom affiché doit contenir au moins 2 caractères",
        maxLength: "Le nom affiché doit contenir moins de 100 caractères",
      },
    },
    email: {
      label: "E-mail",
      description: "Uniquement pour la connexion. Jamais partagé.",
      placeholder: "vous@exemple.com",
      help: "Ce sera votre e-mail de connexion et votre principal moyen de contact",
      validation: {
        required: "L'adresse e-mail est obligatoire",
        invalid: "Veuillez saisir une adresse e-mail valide",
      },
    },
    password: {
      label: "Mot de passe",
      description:
        "8 caractères minimum, avec majuscule, minuscule et chiffre. Conservez-le précieusement : le chiffrement de bout en bout arrive, et une réinitialisation effacera alors votre historique.",
      placeholder: "Créez un mot de passe",
      validation: {
        required: "Le mot de passe est obligatoire",
        minLength: "Le mot de passe doit contenir au moins 8 caractères",
        complexity:
          "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
      },
    },
    confirmPassword: {
      label: "Confirmer le mot de passe",
      validation: {
        required: "Veuillez confirmer votre mot de passe",
        minLength: "Le mot de passe doit contenir au moins 8 caractères",
        mismatch: "Les mots de passe ne correspondent pas",
      },
    },
    subscribeToNewsletter: {
      label:
        "Abonnez-vous à la newsletter pour recevoir des crédits gratuits en bonus chaque mois",
      description:
        "Confirmez votre adresse pour activer le bonus mensuel de la newsletter.",
      checkboxLabel:
        "S'abonner à la newsletter : +{{credits}} crédits gratuits chaque mois",
      hint: "Les nouveaux modèles et les actualités du produit toutes les quelques semaines. Désabonnez-vous à tout moment.",
      tooltip:
        "Après confirmation de votre adresse, vous recevez {{credits}} crédits supplémentaires par mois, soit {{total}} au total, tant que vous restez abonné.",
    },
    acceptTerms: {
      label: "J'accepte les conditions",
      description:
        "Nos conditions respectent votre liberté et votre vie privée.",
      termsLink: "conditions d'utilisation",
      conditionsLink: "politique de confidentialité",
      descriptionPrefix: "Nos",
      descriptionAnd: "et notre",
      descriptionSuffix: "respectent votre liberté et votre vie privée.",
      validation: {
        required: "Vous devez accepter les conditions générales pour continuer",
      },
    },
    referralCode: {
      label: "Code de parrainage (facultatif)",
      description:
        "Un ami vous a donné un code ? Il est récompensé quand vous vous abonnez.",
      placeholder: "Saisissez le code",
      labelPrefilled: "Code de parrainage",
      subscriptionBonus:
        "+{{credits}} crédits bonus avec votre premier abonnement.",
      descriptionPrefilled:
        "Votre ami est récompensé quand vous créez votre compte.",
      validation: {
        invalid:
          "Ce code de parrainage n'existe pas ou n'est plus actif. Corrigez-le ou videz le champ.",
      },
    },
    supportedSkillId: {
      label: "Soutenir un créateur",
      description:
        "Votre inscription soutient le créateur de cette compétence avec un bonus de +5 % sur vos abonnements.",
      selectorTitle: "Soutenir un créateur",
      selectorDescription:
        "Vous avez ajouté à vos favoris des compétences de créateurs indépendants. Choisissez-en un à soutenir : il reçoit +5 % de vos abonnements. Vous pouvez changer à tout moment.",
      selectorNone: "Aucun (passer)",
    },
    localFavorites: {
      label: "Favoris locaux",
    },
  },

  footer: {
    alreadyHaveAccount: "Vous avez déjà un compte ? Connectez-vous",
  },
  errors: {
    title: "Erreur d'inscription",
    validation: {
      title: "Erreur de validation",
      description: "Veuillez vérifier votre saisie et réessayer",
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
      description: "Une erreur inattendue s'est produite",
    },
    conflict: {
      title: "Compte existant",
      description: "Un compte existe déjà avec cette adresse e-mail",
      detail:
        "Un compte existe déjà avec cette adresse e-mail. Connectez-vous plutôt.",
    },
    disposableEmail: {
      title: "Adresse e-mail permanente requise",
      detail:
        "Les adresses jetables ne permettent pas de s'inscrire. Utilisez une adresse e-mail permanente.",
    },
    subnetSignupLimit: {
      title: "Trop d'inscriptions depuis votre réseau",
      detail:
        "Trop de comptes ont été créés depuis votre réseau aujourd'hui. Réessayez demain ou connectez-vous à un compte existant.",
    },
    userNotFound: "Aucun compte trouvé pour {{email}}",
    forbidden: {
      title: "Accès interdit",
      description: "Accès refusé",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite",
    },
    notFound: {
      title: "Introuvable",
      description: "Ressource introuvable",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    autoLoginFailed:
      "Compte créé, mais nous n'avons pas pu vous connecter. Connectez-vous avec votre nouveau mot de passe.",
    internal: {
      title: "Échec de l'inscription pour {{email}} : {{error}}",
      description: "Une erreur interne s'est produite",
    },
  },
  emailCheck: {
    title: "Vérification de disponibilité de l'e-mail",
    description:
      "Vérifier si l'adresse e-mail est disponible pour l'inscription",
    tag: "Vérification de l'e-mail",
    fields: {
      email: {
        label: "Adresse e-mail",
        description: "Adresse e-mail à vérifier",
        placeholder: "Saisissez l'adresse e-mail",
        validation: {
          invalid: "Format d'adresse e-mail invalide",
        },
      },
    },
    response: {
      title: "Réponse de vérification de l'e-mail",
      description: "Résultat de la vérification de disponibilité de l'e-mail",
      available: "E-mail disponible",
      message: "Message de disponibilité",
    },
    errors: {
      validation: {
        title: "E-mail invalide",
        description: "Veuillez saisir une adresse e-mail valide",
      },
      internal: {
        title: "Impossible de vérifier {{email}} : {{error}}",
        description:
          "Erreur lors de la vérification de disponibilité de l'e-mail",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
      },
      conflict: {
        title: "E-mail déjà utilisé",
        description: "Cette adresse e-mail est déjà enregistrée",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de vérifier cet e-mail",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la vérification de l'e-mail",
      },
      notFound: {
        title: "Service introuvable",
        description: "Le service de vérification d'e-mail n'est pas disponible",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise pour vérifier l'e-mail",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Vérification de l'e-mail terminée",
      description: "Disponibilité de l'e-mail vérifiée",
    },
  },
  post: {
    title: "Inscription",
    description: "Endpoint d'inscription",
    form: {
      title: "Configuration de l'inscription",
      description: "Configurer les paramètres d'inscription",
    },
    response: {
      title: "Réponse",
      description: "Données de réponse de l'inscription",
      success: "Inscription réussie",
      message: "Message d'état",
      userId: "ID utilisateur",
      nextSteps: "Prochaines étapes",
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
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description: "Opération réussie",
      processing: "Inscription en cours de traitement",
    },
  },
  response: {
    title: "Réponse",
    description: "Données de réponse de l'inscription",
    success: "Inscription réussie",
    message: "Message d'état",
    user: {
      id: "ID utilisateur",
      email: "Adresse e-mail",
      firstName: "Prénom",
      lastName: "Nom",
      privateName: "Nom privé",
      publicName: "Nom public",
      imageUrl: "URL de la photo de profil",
      verificationRequired: "Vérification requise",
    },
    verificationInfo: {
      title: "Vérification de l'e-mail",
      description: "Détails du processus de vérification de l'e-mail",
      emailSent: "E-mail envoyé",
      expiresAt: "Expiration de la vérification",
      checkSpamFolder: "Vérifiez vos spams",
    },
    nextSteps: "Prochaines étapes",
  },
  success: {
    title: "Consultez votre messagerie",
    description: "Saisissez le code reçu par e-mail.",
  },
  admin_notification: {
    title: "Nouvelle inscription",
    subject: "Nouvelle inscription - {{privateName}}",
    preview: "Le nouvel utilisateur {{privateName}} s'est inscrit",
    message: "Un nouvel utilisateur s'est inscrit sur {{appName}}",
    privateName: "Nom privé",
    publicName: "Nom public",
    email: "E-mail",
    locale: "Langue",
    creditBalance: "Solde de crédits",
    leadCreditBalance: "Solde de crédits du lead",
    signup_preferences: "Préférences d'inscription",
    user_details: "Détails de l'utilisateur",
    basic_information: "Informations de base",
    signup_type: "Type d'inscription",
    direct_signup: "Inscription directe",
    newsletter: "Newsletter",
    subscribed: "Abonné",
    not_subscribed: "Non abonné",
    signup_details: "Détails de l'inscription",
    signup_date: "Date d'inscription",
    user_id: "ID utilisateur",
    recommended_next_steps: "Prochaines étapes recommandées",
    direct_recommendation:
      "Vérifier le profil de l'utilisateur et la configuration du paiement",
    contact_user: "Contacter l'utilisateur",
    footer: "Ceci est une notification automatique de {{appName}}",
  },
  email: {
    subject: "C'est parti. {{appName}} vous attend",
    previewText:
      "Bonjour {{privateName}}, votre compte est prêt. Discutez avec Claude, GPT, Gemini, DeepSeek et {{modelCount}} autres modèles. Gratuit, sans carte bancaire.",
    headline: "Votre IA vous attend.",
    greeting: "Bonjour {{privateName}},",
    intro:
      "Bienvenue sur {{appName}}. Tout ce que vous aimez dans ChatGPT, plus des modèles open source et des modèles sans filtres de contenu. Un seul compte, un seul endroit.",
    models: {
      title: "{{modelCount}} modèles dans 3 catégories",
      mainstream: "Grand public",
      open: "Open source",
      uncensored: "Non censurés",
    },
    free: {
      title: "Ce que vous obtenez gratuitement, pour toujours :",
      credits:
        "{{freeCreditsSignedIn}} crédits gratuits chaque mois, +{{freeCreditsNewsletterBonus}} avec la newsletter. Sans carte bancaire",
      allModels: "Accès aux {{modelCount}} modèles d'IA",
      uncensored:
        "Des modèles non censurés qui répondent vraiment à vos questions",
      chatModes: "Modes de chat Privé, Incognito, Partagé et Public",
      noCard: "Aucune carte bancaire requise. Jamais.",
    },
    verify: {
      note: "Vos crédits gratuits s'activent dès que vous confirmez cette adresse.",
      cta: "Confirmer l'e-mail et recevoir {{freeCreditsSignedIn}} crédits",
    },
    ctaButton: "Commencer à discuter",
    upgrade: {
      title: "Envie de plus ?",
      desc: "Formules dès {{subscriptionPrice}}/mois pour {{subscriptionCredits}} crédits, jusqu'à {{ultraCredits}} crédits pour {{ultraPrice}}. Les abonnés rechargent avec des packs qui n'expirent jamais.",
      cta: "Voir les formules",
    },
    signoff: "Bonnes discussions,\nL'équipe {{appName}}",
    ps: "P.-S. Utilisez le mode Incognito pour garder vos conversations uniquement sur votre appareil. Nous ne les stockons jamais sur nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques).",
  },
  emailTemplates: {
    welcome: {
      name: "E-mail de bienvenue à l'inscription",
      description:
        "E-mail de bienvenue envoyé aux utilisateurs après leur inscription",
      category: "Authentification",
      preview: {
        privateName: {
          label: "Nom privé",
          description: "Le nom privé de l'utilisateur",
        },
        userId: {
          label: "ID utilisateur",
          description: "L'identifiant unique de l'utilisateur",
        },
        leadId: {
          label: "ID du lead",
          description: "L'identifiant de lead de l'utilisateur",
        },
      },
    },
    adminSignup: {
      name: "E-mail de notification d'inscription (admin)",
      description:
        "E-mail envoyé aux administrateurs lors d'une nouvelle inscription",
      category: "Administration",
      preview: {
        privateName: {
          label: "Nom privé",
        },
        publicName: {
          label: "Nom public",
        },
        email: {
          label: "Adresse e-mail",
        },
        userId: {
          label: "ID utilisateur",
        },
        subscribeToNewsletter: {
          label: "Abonnement à la newsletter",
        },
      },
    },
  },
};
