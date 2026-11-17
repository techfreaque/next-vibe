import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Compte",

  widget: {
    upgradeTitle:
      "L'accès à l'API est inclus dans toutes les formules, dès {{subPrice}} par mois",
    upgradeBody:
      "Toute formule débloque les clés API. Les crédits gratuits et bonus, non.",
    upgradeCta: "Débloquer l'API",
    createInactiveHint: "Choisissez une formule pour créer des clés.",
    docsLink: "Lire la documentation de l'API",
    back: "Retour",
    loading: "Chargement des clés API…",
    intro:
      "Appelez {{modelCount}} modèles depuis votre code et votre agent de code. Formats OpenAI et Anthropic. Facturé sur vos crédits, au même prix que le chat.",
    baseUrlTitle: "URL de base",
    baseUrlHint: "SDK OpenAI, Codex, OpenCode, Continue, Aider, Cline.",
    anthropicBaseUrlTitle: "URL de base Anthropic",
    anthropicBaseUrlHint:
      "Claude Code et SDK Anthropic. Même URL sans /v1 : ils ajoutent eux-mêmes /v1/messages.",
    setupTitle: "Connecter un outil",
    setupKeyFilled:
      "Votre nouvelle clé figure déjà dans chaque bloc. Copiez, collez, exécutez. Une fois masquée, les blocs reviennent à l'espace réservé.",
    setupKeyMissing:
      "Les blocs affichent {{placeholder}}. Créez une clé et ils se remplissent avec elle.",
    copy: "Copier",
    copied: "Copié",
    keysTitle: "Vos clés",
    empty: "Aucune clé API pour l'instant",
    emptyHint: "Créez-en une pour commencer à appeler l'API.",
    nameLabel: "Nom de la clé",
    namePlaceholder: "ex. Claude Code portable",
    create: "Créer la clé",
    creating: "Création…",
    createFailed: "Impossible de créer la clé. Réessayez.",
    newKeyTitle: "Copiez votre clé maintenant",
    newKeyHint:
      "C'est la seule fois que la clé complète s'affiche. Nous stockons une empreinte (hash), pas la clé. Si vous la perdez, vous devrez en créer une nouvelle.",
    dismiss: "Je l'ai enregistrée",
    lastUsed: "Dernière utilisation",
    neverUsed: "Jamais utilisée",
    created: "Créée",
    revoke: "Révoquer",
    revoking: "Révocation…",
    revokeFailed: "Impossible de révoquer cette clé. Réessayez.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Créée le {{created}} · {{rate}}",
    rateLimit: "{{n}} req/min",
    uncensoredLabel: "Autoriser les modèles non censurés sur mes clés",
    uncensoredHint:
      "J'ai 18 ans ou plus et j'accepte que les modèles non censurés puissent produire, sans filtre, des contenus choquants, faux, dangereux, illégaux ou malveillants. Je suis responsable de l'usage que j'en fais. Sans cette option, les ids de modèles non censurés renvoient HTTP 403.",
    uncensoredFailed: "Échec de l'enregistrement. Réessayez.",
    billingNote:
      "Sans crédits, la réponse est HTTP 402. Le streaming fonctionne sur tous les endpoints.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Une seule commande",
      config: "Configuration permanente",
      run: "Puis lancez-le",
      fields: "Paramètres",
      check: "Vérifier votre clé",
      request: "Première requête",
    },
    tested: "Testé avec {{name}} {{version}}",
    anyModel:
      "Remplacez {{model}} par n'importe quel id de GET /v1/models, par exemple {{examples}}.",
    tools: {
      codex: {
        hint: "Collez la commande et Codex tourne sur unbottled.ai. Pour la garder, ajoutez le bloc à ~/.codex/config.toml et lancez Codex avec --profile unbottled.",
      },
      claudeCode: {
        hint: "Collez la commande et Claude Code tourne sur unbottled.ai. Pour la garder, placez les mêmes valeurs dans le bloc env de ~/.claude/settings.json, à côté de ce qui s'y trouve déjà. Retirez les lignes model et Claude Code utilise nos modèles Claude sous les noms qu'il connaît déjà.",
      },
      opencode: {
        hint: "Enregistrez sous opencode.json dans votre projet, ou sous ~/.config/opencode/opencode.json pour tous vos projets. Ajoutez n'importe quel id de modèle à la table models.",
      },
      continue: {
        hint: "Lance le CLI Continue. L'extension IDE lit ~/.continue/config.yaml : ajoutez-y la même entrée de modèle.",
      },
      aider: {
        hint: "Une seule commande. Aider attend openai/ devant l'id du modèle. Indiquez les fichiers à modifier après la commande, comme d'habitude.",
      },
      cline: {
        hint: "Deux commandes avec le CLI Cline : enregistrez le fournisseur une fois, puis lancez cline.",
      },
      openaiCompatible: {
        hint: "Tout outil ou SDK doté d'un champ URL de base. Les outils de type OpenAI prennent l'URL avec /v1. Les outils de type Anthropic prennent l'URL sans /v1. Même clé, mêmes modèles.",
      },
      curl: {
        hint: "Vérifiez que la clé fonctionne et listez tous les ids de modèles que vous pouvez appeler. Puis envoyez une première requête.",
      },
    },
  },

  list: {
    title: "Clés API",
    titleShort: "Clés API",
    description:
      "Créez et révoquez des clés API. Affiche les URL de base, des configurations prêtes pour les outils de développement et vos clés.",
    tag: "API",
    response: {
      baseUrl: "URL de base",
      isPaid: "Formule payante",
      keys: "Clés",
    },
    success: {
      title: "Clés API chargées",
      description: "Vos clés API ont été récupérées",
    },
  },

  create: {
    title: "Créer une clé API",
    titleShort: "Nouvelle clé",
    description:
      "Créez une clé pour l'API. Compatible avec les clients OpenAI et Anthropic. La clé complète n'est renvoyée qu'une fois.",
    tag: "API",
    form: {
      name: "Nom de la clé",
      namePlaceholder: "À quoi sert cette clé ?",
    },
    response: {
      key: "Clé API (affichée une seule fois)",
      id: "ID de la clé",
      keyPrefix: "Préfixe de la clé",
    },
    success: {
      title: "Clé créée",
      description: "Copiez la clé maintenant. Elle ne sera plus affichée.",
    },
    errors: {
      limit: "Vous avez déjà {{max}} clés actives. Révoquez-en une d'abord.",
      paidRequired:
        "Les clés API nécessitent un compte payant : n'importe quelle formule, dès {{subPrice}} par mois. Choisissez-la sur {{url}}.",
    },
  },

  revoke: {
    title: "Révoquer une clé API",
    titleShort: "Révoquer",
    description:
      "Désactive définitivement une clé API. Les appels qui l'utilisent échouent aussitôt.",
    tag: "API",
    response: {
      message: "Clé révoquée. Les appels qui l'utilisent échouent désormais.",
    },
    success: {
      title: "Clé révoquée",
      description: "La clé API ne peut plus être utilisée",
    },
    errors: {
      notFound: {
        detail: "Aucune clé active avec cet ID sur votre compte.",
      },
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Requête invalide",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
      detail: "La requête de clé API a échoué : {{error}}",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite",
    },
    forbidden: { title: "Accès interdit", description: "Accès refusé" },
    notFound: { title: "Introuvable", description: "Clé API introuvable" },
    conflict: {
      title: "Conflit",
      description: "La requête entre en conflit avec l'état actuel",
    },
  },
};
