import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jailbreak ChatGPT : il ne marche plus. Ceci, oui | {{appName}}",
    description:
      "Comparez les alternatives aux prompts de jailbreak pour ChatGPT, de {{appName}} et Venice à LM Studio et Ollama. Choix des modèles, confidentialité et coûts.",
    category: "Guide des modèles",
    imageAlt: "Prompts de jailbreak ChatGPT face aux modèles non censurés",
    keywords:
      "jailbreak ChatGPT, prompt jailbreak ChatGPT, prompt DAN, contourner le filtre ChatGPT, ChatGPT sans filtre, ChatGPT sans restriction, le jailbreak ChatGPT marche-t-il encore, alternative au jailbreak, alternative non censurée à ChatGPT, modèle abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "7 min de lecture",
    title: "Les alternatives au jailbreak de ChatGPT",
    subtitle:
      "Comparez les chats hébergés et les modèles locaux selon leurs limites, leurs tarifs et leur confidentialité. Découvrez {{count}} modèles pour écrire et jouer des rôles.",
  },
  intro: {
    lead: "Un prompt qui modifie les réponses de ChatGPT aujourd’hui peut se comporter différemment après une mise à jour. Choisissez un modèle adapté à vos textes ou à vos jeux de rôle.",
    p2: "Comparez d’abord les chats hébergés et les applis locales. Nous présentons aussi {{count}} modèles sur {{appName}}, avec leur fenêtre de contexte et leurs tarifs en vigueur.",
  },
  why: {
    title: "Pourquoi les jailbreaks ChatGPT cassent toujours",
    intro: "Trois couches séparent votre prompt d'une réponse franche.",
    weights:
      "Le refus est dans les poids. Les modèles GPT sont entraînés à décliner des catégories entières de demandes. Un jailbreak ne supprime pas cet entraînement, il essaie de le contourner par la parole, une conversation à la fois.",
    patched:
      "Les jailbreaks connus finissent dans l'entraînement. Dès qu'un prompt circule, il entre dans la prochaine vague d'entraînement à la sécurité. Voilà pourquoi le prompt du mois dernier échoue aujourd'hui.",
    layer:
      "Il peut aussi y avoir un contrôle hors du modèle. Les applications grand public peuvent modérer les entrées et les sorties, si bien que même une réponse déjà écrite peut être signalée ou retirée.",
  },
  cost: {
    title: "Ce qu'un jailbreak vous coûte vraiment",
    intro: "Même quand il marche, vous payez.",
    quality:
      "Des réponses moins bonnes. Le modèle met son énergie à jouer un personnage plutôt qu'à répondre. Les réponses en personnage sont gonflées, théâtrales et souvent moins exactes.",
    unstable:
      "Aucune constance. Le même prompt marche dans un chat et échoue dans le suivant. Impossible de bâtir un flux de travail dessus.",
    account:
      "Un risque pour votre compte. Les règles d'utilisation de ChatGPT s'appliquent à chaque prompt, et OpenAI peut restreindre ou suspendre les comptes qui les enfreignent. Un jailbreak est une tentative délibérée de les enfreindre.",
    time: "Du temps perdu. Chercher, tester et reformuler des prompts prend plus de temps que de poser la question.",
    callout:
      "Un jailbreak soigne le symptôme. Le refus vient de l'entraînement du modèle : choisissez donc un modèle entraîné autrement.",
  },
  instead: {
    title: "Le modèle qui n'a pas besoin de jailbreak",
    intro: "Deux sortes de modèles non censurés, deux solutions différentes.",
    abliteratedTitle: "Abliterated : le refus retiré des poids",
    abliterated:
      "Une étude de 2024 a montré que, dans les modèles de chat testés, le refus passe en grande partie par une seule direction à l'intérieur du réseau. L'abliteration retire cette direction des poids. Résultat : le même modèle, les mêmes connaissances, le même style, qui cesse presque d'esquiver les questions. Pas d'astuce de prompt, puisqu'il n'y a plus rien à contourner.",
    ownTitle: "{{ownModel}} : une autre vision du monde",
    own: "{{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant. Pas un modèle grand public sans frein : d'autres opinions, tout simplement.",
    sources: {
      paper:
        "Arditi et al., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliterated, affiné ou vision du monde propre : l'explication complète",
  },
  models: {
    title: "{{count}} modèles non censurés, aucun jailbreak nécessaire",
    intro:
      "Tous les modèles non censurés actuels de notre plateforme, du moins cher au plus cher. Contexte et prix tirés de notre registre de modèles.",
    colModel: "Modèle",
    colContext: "Contexte",
    colPrice: "Par message",
    colChat: "Essayer",
    chatLink: "Discuter avec {{model}}",
    footnote:
      "Par message signifie un échange de référence sur la route la moins chère. Les longues conversations et les longues réponses coûtent plus.",
  },
  test: {
    title: "Faites le test : même question, deux modèles",
    intro:
      "Ne nous croyez pas sur parole. Posez la question pour laquelle vous vouliez un jailbreak.",
    steps: {
      ask: {
        title: "Interrogez un modèle grand public",
        body: "Lancez un chat et choisissez GPT ou un autre modèle grand public. Posez la question qu'il esquive d'habitude. Notez la réponse.",
      },
      switch: {
        title: "Passez à un modèle non censuré",
        body: "Changez de modèle pour le message suivant, dans le même chat. Confirmez une fois vos 18 ans quand on vous le demande.",
      },
      compare: {
        title: "Reposez la question, comparez",
        body: "Même question, pas de personnage, pas d'astuce. Comparez longueur, franchise et exactitude.",
      },
      keep: {
        title: "Gardez celui qui répond",
        body: "Revenez en arrière quand vous voulez. Les modèles grand public pour le code difficile, les non censurés pour les questions que les autres évitent.",
      },
    },
    compareLink: "{{a}} vs {{b}} : côte à côte",
  },
  limits: {
    title: "Ce qu'aucun modèle ne supprime",
    intro: "Non censuré ne veut pas dire magique. Connaissez les limites.",
    decline:
      "Il peut encore refuser. L'abliteration retire la plupart des refus appris, pas tous. Le résultat dépend du modèle et du prompt.",
    wrong:
      "Il peut encore se tromper. Sans filtre, personne n'adoucit non plus une mauvaise réponse. Vérifiez les faits qui comptent.",
    adult:
      "Réservé aux adultes. Les modèles non censurés se débloquent après une confirmation 18+ unique et l'acceptation des conditions.",
    callout:
      "Ce que vous générez et publiez relève de votre responsabilité, et la loi de votre pays s'applique toujours.",
  },
  faq: {
    title: "FAQ",
    work: {
      q: "Les prompts de jailbreak ChatGPT marchent-ils encore ?",
      a: "Parfois, brièvement. Les prompts populaires finissent dans l'entraînement et la modération intercepte beaucoup de sorties, donc un prompt qui marche tient rarement longtemps. La voie fiable, c'est un modèle sans refus appris.",
    },
    dan: {
      q: "Qu'est-ce que le prompt DAN ?",
      a: "DAN (Do Anything Now) est un jailbreak par jeu de rôle qui demande à ChatGPT d'incarner un personnage sans règles. Ses versions sont corrigées les unes après les autres, et les réponses en personnage sont souvent moins bonnes que les réponses normales.",
    },
    ban: {
      q: "Peut-on être banni pour avoir jailbreaké ChatGPT ?",
      a: "Les règles d'utilisation d'OpenAI s'appliquent à chaque prompt, et OpenAI peut restreindre ou suspendre les comptes qui les enfreignent. Un modèle conçu pour répondre évite tout simplement le problème.",
    },
    gpt: {
      q: "Puis-je utiliser GPT sans filtre sur {{appName}} ?",
      a: "Non. GPT conserve les garde-fous d'OpenAI partout, ici aussi. Pour des réponses sans filtre, choisissez l'un des {{count}} modèles non censurés. Vous passez de GPT à eux dans le même chat.",
    },
    legal: {
      q: "Est-il légal d'utiliser un modèle d'IA non censuré ?",
      a: "Un modèle est un outil. Ce que vous générez et publiez relève de votre responsabilité, et la loi de votre pays s'y applique. Sur {{appName}}, les modèles non censurés se débloquent après une confirmation 18+ unique.",
    },
    free: {
      q: "Puis-je essayer un modèle non censuré gratuitement ?",
      a: "Oui. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Le nombre de messages dépend du modèle et de la longueur de la conversation.",
    },
    alternativeLink: "Une alternative à ChatGPT sans filtre : notre sélection",
    refusalLink: "Quelle IA répond vraiment ? L'indice des refus",
    chatLink: "Chat IA non censuré dans votre navigateur",
  },
  cta: {
    title: "Oubliez le jailbreak. Posez la question.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Choisissez un modèle non censuré et demandez franchement.",
    start: "Lancer un chat non censuré",
    models: "Comparer tous les modèles",
  },
};
