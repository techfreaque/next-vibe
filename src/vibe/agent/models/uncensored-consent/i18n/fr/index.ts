import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Consentement",
  },

  get: {
    title: "Consentement aux modèles non censurés",
    titleShort: "Consentement non censuré",
    description:
      "Indique si ce compte ou cet invité a confirmé avoir 18 ans ou plus et accepte les réponses non filtrées des modèles non censurés. Les modèles non censurés refusent de tourner tant que ce n'est pas confirmé.",
    response: {
      consented: "Confirmé",
      consentedAt: "Confirmé le",
      version: "Version du consentement",
    },
    success: {
      title: "Statut du consentement chargé",
      description: "Statut actuel du consentement aux modèles non censurés",
    },
  },

  post: {
    title: "Débloquer les modèles non censurés",
    titleShort: "Débloquer le non censuré",
    description:
      "Confirmation unique pour les modèles non censurés : vous avez 18 ans ou plus et acceptez qu'ils puissent produire des contenus offensants, faux, dangereux, illégaux ou malveillants, sans aucun filtre. Un humain doit le confirmer, jamais une IA agissant à sa place.",
    fields: {
      confirm: {
        label: "J'ai 18 ans ou plus et j'accepte",
        description:
          "Mettre à true pour confirmer que vous avez 18 ans ou plus, acceptez les réponses non filtrées et assumez la responsabilité de leur usage.",
      },
    },
    success: {
      title: "Modèles non censurés débloqués",
      description:
        "Votre confirmation est enregistrée. La question ne vous sera plus posée.",
    },
  },

  delete: {
    title: "Retirer le consentement non censuré",
    titleShort: "Retirer le consentement",
    description:
      "Retire la confirmation pour les modèles non censurés. Ils restent verrouillés jusqu'à une nouvelle confirmation.",
    success: {
      title: "Consentement retiré",
      description: "Les modèles non censurés sont de nouveau verrouillés.",
    },
  },

  errors: {
    validation: {
      title: "Confirmation manquante",
      description:
        "Confirmez que vous avez 18 ans ou plus et acceptez les conditions pour continuer.",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous ne pouvez pas modifier ce consentement.",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Cette action n'est pas disponible ici.",
    },
    notFound: {
      title: "Introuvable",
      description: "Aucun compte ni session invité trouvé.",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible d'enregistrer votre choix. Réessayez.",
    },
    network: {
      title: "Erreur réseau",
      description: "Serveur injoignable. Vérifiez votre connexion.",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Un problème est survenu. Réessayez.",
    },
    conflict: {
      title: "Conflit",
      description:
        "Votre consentement a changé dans un autre onglet. Rechargez la page.",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Confirmez ou annulez d'abord.",
    },
    noIdentity:
      "Aucun compte ni session invité. Rechargez la page et réessayez.",
    saveFailed: "Impossible d'enregistrer votre choix. Réessayez.",
  },

  gate: {
    required:
      "{{model}} est non censuré. Une confirmation unique est nécessaire : vous avez 18 ans ou plus et acceptez que les modèles non censurés puissent produire des contenus offensants, faux, dangereux, illégaux ou malveillants, sans filtre. Un humain le confirme dans le chat, ou exécute : vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} est non censuré. Ce compte n'a pas confirmé avoir 18 ans ou plus ni accepté les réponses non filtrées. Cochez une fois la case des modèles non censurés sur la page des clés API, puis réessayez.",
  },

  dialog: {
    eyebrow: "Modèles non censurés",
    title: "Réservé aux adultes. Aucun filtre.",
    stance:
      "Ce que vous lisez, c'est à vous d'en décider. Pas à une entreprise. Alors on vous pose la question une fois, au lieu de filtrer chaque réponse.",
    modelLine: "Vous avez choisi {{model}}.",
    pointAge: "J'ai 18 ans ou plus.",
    pointContent:
      "Les modèles non censurés peuvent produire des contenus offensants, faux, dangereux, illégaux ou malveillants.",
    pointNoFilter: "Rien ne les filtre. Ni le modèle, ni nous.",
    pointResponsible:
      "Je suis responsable de l'usage que je fais de ce qu'il écrit.",
    agree: "J'ai 18 ans ou plus et j'accepte",
    agreeing: "Enregistrement…",
    pickAnother: "Choisir un autre modèle",
    close: "Fermer",
    footnote:
      "Demandé une seule fois. Révocable à tout moment dans les paramètres.",
    saveFailed: "Échec de l'enregistrement. Réessayez.",
  },

  widget: {
    title: "Modèles non censurés",
    statusOn: "Débloqués",
    statusOff: "Verrouillés",
    since: "Confirmé le {{date}}",
    onBody:
      "Vous avez confirmé avoir 18 ans ou plus et accepter les réponses non filtrées. Les modèles non censurés répondent sans filtre.",
    offBody:
      "Les modèles non censurés restent verrouillés tant que vous n'avez pas confirmé avoir 18 ans ou plus et accepter les réponses non filtrées.",
    outdatedBody:
      "Le texte du consentement a changé depuis votre confirmation. Confirmez à nouveau pour continuer à utiliser les modèles non censurés.",
    withdraw: "Retirer le consentement",
    withdrawing: "Retrait…",
    unlock: "Débloquer les modèles non censurés",
    guestNote:
      "Enregistré pour ce navigateur. Inscrivez-vous et il passe sur votre compte.",
    loading: "Chargement du consentement…",
    back: "Retour",
    menuLabel: "Modèles non censurés",
    menuOn: "Activé",
    menuOff: "Désactivé",
  },
};
