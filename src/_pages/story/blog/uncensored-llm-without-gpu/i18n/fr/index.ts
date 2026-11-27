import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "LLM non censuré en ligne, sans GPU ni installation | {{appName}}",
    description:
      "LLM non censuré en ligne, sans carte graphique. La VRAM qu'exigent les modèles locaux, les modèles abliterated dans le navigateur et le prix par message.",
    category: "Guide des modèles",
    imageAlt: "Un LLM non censuré en ligne, sans GPU",
    keywords:
      "LLM non censuré en ligne, LLM non censuré sans GPU, alternative en ligne au LLM local, IA sans censure sans carte graphique, modèle abliterated en ligne, modèle non censuré dans le navigateur, VRAM pour LLM local, alternative à Ollama en ligne, alternative à LM Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "8 min de lecture",
    title: "LLM non censuré en ligne. Sans GPU. Sans installation.",
    subtitle:
      "Ce qu'un modèle non censuré local exige vraiment de votre matériel, et {{count}} modèles non censurés qui tournent à la place dans un onglet. Prix et contexte lus en direct dans notre registre de modèles.",
  },
  intro: {
    lead: "Tous les guides sur les modèles non censurés disent la même chose : téléchargez-le, lancez-le en local. Puis vous regardez votre carte graphique. Les gros modèles demandent plus de mémoire qu'aucun PC de jeu n'en a. Les petits qui rentrent ne sont pas ceux dont tout le monde parle.",
    p2: "Il existe une deuxième voie. Les mêmes modèles, hébergés, dans un onglet du navigateur. Pas de GPU, pas de pilotes, pas de téléchargement de 40 Go. Ce guide montre ce que le local exige vraiment, quand il reste gagnant, et quels {{count}} modèles non censurés tournent sur {{appName}} en ce moment.",
  },
  table: {
    model: "Modèle",
    context: "Contexte",
    price: "Par message",
  },
  hardware: {
    title: "Ce que le local exige vraiment",
    intro:
      "La mémoire est le mur. Les poids du modèle doivent tenir dans la VRAM de votre carte (ou la mémoire unifiée d'un Mac) pour tourner à une vitesse utilisable. Voici les modèles non censurés de notre catalogue dont le nombre de paramètres est publié.",
    colParams: "Paramètres",
    colMemory: "Poids en 4 bits / 8 bits",
    paramsValue: "{{count}} Md",
    memoryValue: "{{q4}} Go / {{q8}} Go",
    unknown: "Non publié",
    footnote:
      "Poids seuls, calculés à partir du nombre de paramètres : environ 0,5 Go par milliard de paramètres en 4 bits, 1 Go en 8 bits. Le contexte (cache KV) et le moteur d'exécution s'y ajoutent, et les longues conversations demandent beaucoup plus.",
    small:
      "Jusqu'à environ 12 Go de poids : tient sur une carte de 16 Go avec de la marge pour le contexte.",
    mid: "De 20 à 40 Go : une carte de 24 Go en 4 bits avec un contexte court, deux cartes, ou un Mac avec beaucoup de mémoire unifiée.",
    large:
      "Des centaines de Go : aucune machine grand public. Ce sont les modèles de taille frontier, et la seule façon pratique de les utiliser, c'est l'hébergement.",
    callout:
      "La quantification réduit le fichier et coûte un peu de qualité. Une version 4 bits d'un modèle moyen n'offre pas la même expérience que le modèle complet dans le cloud.",
  },
  local: {
    title: "Quand le local reste le bon choix",
    intro:
      "Le local n'est pas une erreur. C'est un compromis. Des outils comme Ollama et LM Studio le rendent simple si votre matériel suit.",
    winsTitle: "Là où le local gagne",
    offline:
      "Hors ligne : pas d'internet, pas de compte, aucun fournisseur dans la boucle. Rien ne quitte la machine.",
    catchTitle: "Le revers",
    verdict:
      "En bref : un GPU puissant, besoin d'une confidentialité totale, et un modèle moyen vous suffit ? Lancez-le en local. Vous voulez les gros modèles, un long contexte ou simplement une réponse dans la minute ? Passez en ligne.",
  },
  online: {
    title: "{{count}} modèles non censurés directement dans le navigateur",
    intro:
      "Tous les modèles non censurés actuels sur {{appName}}, du moins cher au plus cher. Contexte et prix par message viennent directement de notre registre de modèles. Cliquez sur un modèle pour discuter.",
    colChat: "Essayer",
    chatLink: "Discuter avec {{model}}",
    footnote:
      "Par message signifie un échange de référence sur la route la moins chère. Les longues conversations et les longues réponses coûtent plus. Tout tourne sur des serveurs, votre portable n'a besoin que d'un navigateur.",
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
  },
  steps: {
    title: "De zéro à une réponse en une minute",
    intro: "Aucun téléchargement, pas de compte pour commencer.",
    open: {
      title: "Ouvrez un chat",
      body: "Cliquez sur un modèle ci-dessus ou lancez un chat incognito. Les invités reçoivent {{guestCredits}} crédits gratuits par mois.",
    },
    pick: {
      title: "Choisissez le modèle",
      body: "Dans le sélecteur, prenez le niveau non censuré. Changez en pleine conversation quand vous voulez, l'historique reste.",
    },
    confirm: {
      title: "Confirmez vos 18 ans",
      body: "Les modèles non censurés demandent une seule fois la confirmation de votre majorité et l'acceptation des conditions. Ensuite, ils restent débloqués.",
    },
    ask: {
      title: "Posez la vraie question",
      body: "Celle que les autres assistants esquivent. Pas de prompt de jailbreak, pas de déguisement en jeu de rôle.",
    },
  },
  kinds: {
    title: "Deux sortes de non censuré, toutes deux en ligne",
    intro: "Tous les modèles non censurés ne le sont pas de la même manière.",
    abliterated:
      "Les versions abliterated et affinées : des modèles grand public ou ouverts, légèrement modifiés pour ne plus esquiver les questions. Même entraînement, même vision du monde. Ils répondent, c'est tout.",
    own: "{{ownModel}} : entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. Il est servi en hébergé, via uncensored.ai.",
    link: "Abliterated, affiné ou vision du monde propre : les différences",
  },
  privacy: {
    title: "Ce que voit un modèle hébergé",
    intro:
      "En ligne, le modèle tourne sur le serveur de quelqu'un d'autre. Voici précisément qui voit quoi.",
    transit:
      "Chaque message passe par notre serveur jusqu'au fournisseur qui fait tourner le modèle. Le fournisseur voit le prompt, selon ses propres conditions. Toute IA hébergée fonctionne ainsi.",
    incognito:
      "Les chats incognito sont stockés dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et ils disparaissent.",
    selfHost:
      "{{appName}} est open source. Hébergez-le vous-même et branchez vos propres modèles locaux quand rien ne doit quitter votre machine.",
    selfHostLink: "Héberger {{appName}} soi-même",
    callout:
      "Si un prompt ne doit jamais quitter votre matériel, passez en local. Pour tout le reste, l'hébergé est la voie rapide.",
  },
  cost: {
    title: "Combien ça coûte, local contre en ligne",
    intro: "En local, pas de prix par message. Le prix, c'est le matériel.",
    guest:
      "En ligne chez nous : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter.",
    plan: "Abonnements à partir de {{subPrice}} par mois. Les packs de crédits complètent un abonnement actif et n'expirent jamais.",
    local:
      "En local : gratuit par message, mais un GPU capable de faire tourner les gros modèles coûte plus cher que des années de chat hébergé. Sans compter l'électricité.",
  },
  pairs: {
    title: "Le modèle de base à côté de sa version non censurée",
    intro:
      "Même labo, même taille, sans les refus. Comparez contexte, prix et filtre côte à côte.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    gpu: {
      q: "Puis-je utiliser un LLM non censuré sans GPU ?",
      a: "Oui, en version hébergée. Le modèle tourne sur les serveurs du fournisseur, il vous suffit d'un navigateur. Sur {{appName}}, cela représente {{count}} modèles non censurés, dont des modèles de taille frontier qu'aucun PC personnel ne peut porter.",
    },
    free: {
      q: "Existe-t-il un LLM non censuré gratuit en ligne ?",
      a: "Sur {{appName}}, vous recevez {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Le nombre de messages dépend du modèle et de la longueur de la conversation. Les modèles non censurés demandent une confirmation 18+ unique.",
    },
    vram: {
      q: "Combien de VRAM faut-il pour faire tourner un modèle non censuré en local ?",
      a: "Règle empirique pour les poids : environ 0,5 Go par milliard de paramètres en 4 bits, 1 Go en 8 bits. Un modèle 24B demande environ 12 Go en 4 bits, un modèle 70B environ 35 à 40 Go. Le contexte et le moteur s'y ajoutent.",
    },
    private: {
      q: "Un LLM non censuré en ligne est-il privé ?",
      a: "Moins que le local. Le fournisseur qui fait tourner le modèle voit votre prompt. Sur {{appName}}, les chats incognito restent dans le stockage de votre navigateur, pas sur nos serveurs. Pour les prompts qui ne doivent jamais quitter votre machine, passez en local.",
    },
    offline: {
      q: "Puis-je utiliser un modèle non censuré hors ligne ?",
      a: "Pas un modèle hébergé. Hors ligne signifie local : téléchargez un modèle qui tient dans votre mémoire et lancez-le avec un outil comme Ollama ou LM Studio.",
    },
    truly: {
      q: "Les modèles abliterated sont-ils vraiment non censurés ?",
      a: "Ils cessent de refuser, mais gardent l'entraînement et la vision du monde de leur modèle de base. {{ownModel}} est différent : entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    },
    chatLink: "Chat IA non censuré dans votre navigateur",
    platformsLink:
      "Plateformes d'IA non censurées comparées, outils locaux compris",
  },
  cta: {
    title: "Oubliez le téléchargement. Posez votre question.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Choisissez un modèle non censuré et changez quand vous voulez.",
    start: "Lancer un chat non censuré",
    models: "Comparer tous les modèles",
  },
};
