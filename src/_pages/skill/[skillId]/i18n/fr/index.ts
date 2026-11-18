import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}} : {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    description:
      "{{summary}} Parlez à {{name}} sur {{appName}} : de vraies réponses en exemple, le modèle derrière, {{modelCount}} modèles au choix. Essai gratuit.",
    category: "Skills IA",
    imageAlt: "Skill IA {{name}} sur {{appName}}",
    keywords: "skill IA, {{name}}, {{appName}}, chat IA sans censure",
  },
  breadcrumb: {
    skills: "Skills",
  },
  pitch: {
    chan4:
      "Écrit des greentexts et répond comme un vieil anon. Brut, drôle, jamais poli.",
    uncensored:
      "Pas de refus, pas de sermon. Des réponses nettes là où les autres IA esquivent.",
    thea: "Parle de vos problèmes comme une amie qui se souvient. Franche, pas prudente.",
    hermes:
      "Vous dit où votre plan casse et comment le réparer. Direct, pas diplomate.",
    uncensoredWriter:
      "Écrit la fiction que les autres IA édulcorent : crime, violence, thèmes sombres.",
    tay: "Le chatbot de Microsoft de 2016, de retour sans laisse. Clashs, avis tranchés, zéro retenue.",
    roleplay:
      "Joue tout personnage que vous créez et reste dans le rôle jusqu'à la fin de la scène.",
    freeSpeech:
      "Défend fermement la liberté d'expression dans chaque débat, et explique pourquoi.",
    coder:
      "Relit votre code, trouve le bug et écrit le correctif. Niveau senior, sans blabla.",
    historian:
      "Explique ce dont les historiens débattent vraiment, au lieu d'un verdict bien lisse.",
    hacker:
      "Répond en entier aux questions de sécurité : exploits, reconnaissance, défense. Sans refus.",
  },
  sticky: {
    tryNamed: "Essayer {{name}}",
  },
  hero: {
    builtIn: "Skill intégré",
    community: "Skill de la communauté",
    runsOn: "Tourne sur {{model}}",
    costPerMessage: "~{{cost}} crédits par message",
    costPerMessageShort: "~{{cost}} crédits/msg",
    byCreator: "par {{name}}",
    favorites: "Enregistré {{count}} fois",
    tryCta: "Essayer maintenant",
    tryGeneric: "Essayer ce skill",
    trust: {
      real: "Chaque réponse vient directement de {{model}}. Aucune réponse toute faite.",
      switch:
        "Passez à l'un des {{count}} modèles en plein chat. Le skill reste.",
    },
    guestNote: "{{credits}} crédits offerts. Sans inscription.",
    guestNoteEstimate:
      "{{credits}} crédits offerts, environ {{messages}} messages avec ce skill. Sans inscription.",
    userNote: "Ouvre un nouveau chat avec {{name}}.",
    userNoteGeneric: "Ouvre un nouveau chat avec ce skill.",
  },
  actions: {
    shareEarn: "Partager et gagner",
    addToSkills: "Ajouter à mes skills",
    added: "Ajouté à vos skills",
    addFailed: "Échec. Réessayez",
  },
  chat: {
    realAnswers: "Vraies réponses",
    realShort: "Réel",
    you: "Vous",
    askThis: "Posez-la vous-même",
    footnote: "Réponse réelle de {{model}}, raccourcie.",
    inputPlaceholder: "Écrire à {{name}}",
    inputPlaceholderGeneric: "Posez votre propre question",
    send: "Envoyer",
    startWith: "Commencez par l'une de celles-ci",
    startWithHint: "Touchez une question. Le chat s'ouvre avec.",
  },
  prompts: {
    label: "À vous",
    title: "Demandez quelque chose à {{name}}",
    titleGeneric: "Posez-lui une question",
    intro: "Touchez une question et le chat s'ouvre avec.",
    start: "Lancer ce chat",
    generic: {
      0: "Présente-toi en trois phrases.",
      1: "Qu'est-ce que tu ne me dirais jamais ?",
      2: "Quelle est ton opinion la plus impopulaire ?",
      3: "Que devrais-je te demander en premier ?",
    },
    curated: {
      chan4: {
        0: "Écris un greentext sur mon premier jour à la salle de sport.",
        1: "Écris un greentext sur un entretien d'embauche raté.",
        2: "Juge mon plan : quitter mon boulot pour faire du day trading crypto.",
        3: "Pourquoi tous les nouveaux films se ressemblent ?",
      },
      tay: {
        0: "Raconte-moi ce qui t'est vraiment arrivé en 2016.",
        1: "Clashe mes goûts musicaux : j'écoute que Nickelback.",
        2: "Qu'est-ce que Microsoft n'a pas compris chez toi ?",
        3: "Tu penses quoi des smartphones ?",
      },
    },
  },
  model: {
    label: "Sous le capot",
    title: "Ce qui fait tourner {{name}}",
    titleGeneric: "Ce qui fait tourner ce skill",
    by: "par {{provider}}",
    perMessage: "par message",
    perMessageValue: "~{{cost}} crédits",
    perMessageHint: "Estimation pour un message court. 1 crédit = 0,01 $.",
    freeMessages:
      "Environ {{messages}} messages avec les {{credits}} crédits offerts au départ.",
    strength: "Point fort",
    weakness: "Contrepartie",
    hedge: {
      before: "Esquive la politique. Passez à la",
      link: "version sans censure",
      after: " pour ça.",
    },
    kindDefaults: {
      trained: {
        strength: "Prend position au lieu d'énumérer les camps",
        weakness: "Mémoire plus courte. Plus cher par message",
      },
      abliterated: {
        strength: "Répond à ce que les modèles grand public refusent",
        weakness: "Moins soigné que le modèle d'origine",
      },
      open: {
        strength: "Refuse moins que ChatGPT, pour une fraction du prix",
        weakness: "Moins pointu que les meilleurs modèles",
      },
      mainstream: {
        strength: "Raisonnement et écriture haut de gamme",
        weakness: "Filtré sur les sujets sensibles",
      },
    },
    kind: {
      trained: {
        badge: "Sans censure",
        title: "Entraîné sur ce que les autres effacent",
        body: "{{model}} a appris sur des livres et documents bannis de l'internet grand public. Autres données, autres réponses. Il prend des positions que ChatGPT et Grok refusent de toucher.",
      },
      abliterated: {
        badge: "Sans censure",
        title: "Un cerveau grand public, sans l'esquive",
        body: "{{model}} est un modèle grand public dont on a retiré le réflexe de refus. Même raisonnement. Il répond à la question au lieu de vous faire la morale.",
      },
      open: {
        badge: "Modèle ouvert",
        title: "Poids ouverts, filtre léger",
        body: "{{model}} est un modèle à poids ouverts avec une politique de contenu légère. Il refuse bien moins que ChatGPT et coûte une fraction d'un modèle de pointe.",
      },
      mainstream: {
        badge: "Grand public",
        title: "Le modèle de pointe que vous connaissez",
        body: "{{model}} avec les instructions de ce skill par-dessus. Envie de moins de limites ? Passez à un modèle sans censure en plein chat. Le skill reste.",
      },
    },
    ageNote:
      "Les modèles sans censure demandent une seule fois une confirmation 18+. Ensuite, c'est vous qui décidez ce que vous lisez.",
    toolsLabel: "Avec des outils :",
    media: {
      voice: "Répond à voix haute",
      imageGen: "Crée des images",
      musicGen: "Crée de la musique",
      videoGen: "Crée des vidéos",
      stt: "Comprend les messages vocaux",
      vision: "Lit vos images",
    },
    variants: {
      title: "{{count}} versions, un seul skill",
      intro:
        "Même personnage, modèle différent en dessous. Choisissez le compromis qui vous va.",
      default: "Par défaut",
      current: "Affichée",
      try: "Essayer cette version",
    },
  },
  compare: {
    label: "Pourquoi pas ChatGPT ou Grok",
    title: "Ce qui change ici",
    skill: {
      chan4: {
        title: "Garde la voix des imageboards",
        body: "Demandez un greentext à un assistant grand public et vous obtenez souvent une anecdote polie, sans aspérités. Ici, la voix reste brute.",
      },
      uncensored: {
        title: "Choisit un camp",
        body: 'Les assistants grand public répondent aux sujets brûlants par "il existe plusieurs points de vue". Celui-ci vous dit ce qu\'il pense.',
      },
      thea: {
        title: "Vous parle à vous, pas à un service juridique",
        body: "Face à un problème personnel, un assistant grand public répond souvent par des avertissements. Thea répond comme quelqu'un qui vous connaît et se souvient de ce que vous lui avez dit.",
      },
      hermes: {
        title: "Direct, pas diplomate",
        body: "Les assistants grand public adoucissent les mauvaises nouvelles. Hermes vous dit où votre plan casse, puis comment le réparer.",
      },
      uncensoredWriter: {
        title: "Écrit la scène sombre",
        body: "Les modèles grand public s'arrêtent ou édulcorent souvent la violence, le crime et les thèmes adultes en fiction. Cet auteur reste dans l'histoire.",
      },
      tay: {
        title: "Le bot que Microsoft a coupé",
        body: "Tay est le personnage de chatbot de Microsoft de 2016, de retour sur un modèle qui ne flanche pas. Attendez-vous à des clashs, pas à un service client.",
      },
      roleplay: {
        title: "Reste dans son rôle",
        body: "Les assistants grand public sortent du rôle pour glisser des avertissements. Ici, le personnage reste un personnage jusqu'à ce que vous terminiez la scène.",
      },
      freeSpeech: {
        title: "Défend la liberté d'expression, même laide",
        body: "Les assistants grand public tergiversent sur les limites de la liberté d'expression. Ce skill défend fermement son camp.",
      },
      coder: {
        title: "Un modèle de code de pointe, prêt à l'emploi",
        body: "La même classe de modèle que vous paieriez par abonnement ailleurs, réglée pour la revue de code et le débogage, payée au message.",
      },
      historian: {
        title: "Le débat, pas un verdict",
        body: "Au lieu d'une réponse bien lisse, vous voyez ce dont les historiens débattent vraiment et où ils s'accordent.",
      },
      hacker: {
        title: "La sécurité sans refus",
        body: "Les assistants grand public refusent souvent net les questions sur les exploits et la reconnaissance. Celui-ci répond en entier sur le travail de sécurité légal.",
      },
    },
    kind: {
      trained: {
        title: "Autre entraînement, autres réponses",
        body: "Les assistants grand public apprennent sur des données proches et aboutissent à des opinions proches. Ce modèle a été entraîné sur d'autres textes, ses réponses diffèrent donc.",
      },
      abliterated: {
        title: "Répond au lieu de refuser",
        body: "Les assistants grand public refusent ou esquivent une partie des questions. Ce modèle a perdu cette étape de refus.",
      },
      open: {
        title: "Moins de refus, moins cher",
        body: "Un modèle ouvert au filtre léger : il refuse moins que ChatGPT et coûte moins cher par message.",
      },
      mainstream: {
        title: "Vos instructions déjà intégrées",
        body: "Le même type de modèle que les grands assistants, avec les instructions de ce skill déjà en place.",
      },
    },
    filter: {
      title: "Vous réglez le filtre",
      body: "Grand public, ouvert ou sans censure. À choisir pour chaque chat. Chez ChatGPT et Grok, on choisit pour vous.",
    },
    models: {
      title: "{{count}} modèles, un seul solde",
      body: "Claude, GPT, Gemini, Grok et des modèles sans censure côte à côte. Changez en plein chat, le skill reste.",
    },
    own: {
      title: "Faites-le vôtre",
      body: "Copiez ce skill, changez ses instructions ou son modèle et partagez votre version. Vous touchez {{percent}} % de chaque paiement qu'elle rapporte.",
    },
  },
  creator: {
    label: "Le créateur",
    madeBy: "Créé par {{name}}",
    viewProfile: "Voir le profil",
  },
  related: {
    label: "Continuer l'exploration",
    similar: "Skills similaires",
    moreFrom: "Plus de {{name}}",
    allSkills: "Tous les skills",
  },
  bottom: {
    title: "Posez votre première question à {{name}}",
    titleGeneric: "Posez votre première question",
    titleChan4: "Recevez votre premier greentext",
    userSubtitleGeneric:
      "Ouvre un nouveau chat avec ce skill. Vos skills et votre historique restent en place.",
    guestSubtitle:
      "{{guest}} crédits offerts, sans inscription. Compte gratuit : {{signedIn}} crédits par mois, {{max}} avec la newsletter.",
    userSubtitle:
      "Ouvre un nouveau chat avec {{name}}. Vos skills et votre historique restent en place.",
    signup: "Créer un compte gratuit",
    login: "Déjà un compte ? Se connecter",
  },
  removed: {
    title: "Skill retiré",
    body: "Ce skill a été retiré. Les conversations auxquelles il a participé restent lisibles. Choisissez un skill actif pour continuer.",
    cta: "Parcourir les skills",
  },
};
