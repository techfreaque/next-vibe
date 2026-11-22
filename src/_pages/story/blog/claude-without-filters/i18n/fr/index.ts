import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Claude sans filtre : pourquoi il refuse et ce qui marche | {{appName}}",
    description:
      "Claude non censuré n'existe pas. Pourquoi Claude refuse, pourquoi les jailbreaks et les faux sites « Claude non censuré » ne tiennent pas, et ce qui marche : Claude plus des modèles non censurés dans le même fil. Prix en direct.",
    category: "Guide des modèles",
    imageAlt: "Claude à côté de modèles non censurés dans un même chat",
    keywords:
      "Claude sans filtre, Claude non censuré, Claude sans censure, jailbreak Claude, Claude sans restrictions, Claude refuse, alternative à Claude pour la fiction, alternative à Claude sans filtre, alternative à Claude NSFW, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide des modèles",
    readTime: "7 min de lecture",
    title: "Claude sans filtre. Pourquoi ça n'existe pas, et ce qui marche.",
    subtitle:
      "Gardez {{claudeName}} pour ce qu'il fait de mieux. Confiez le reste à {{count}} modèles sans couche de refus, dans le même fil.",
  },
  intro: {
    lead: "Claude signe une des meilleures proses de tous les modèles. Il sait aussi s'arrêter en pleine scène, ajouter un avertissement que personne n'a demandé ou transformer votre méchant en thérapeute.",
    p2: "Aucun réglage ne coupe ça. Voici pourquoi, ce qui ne marche pas et ce qui marche : {{claudeName}} et des modèles non censurés côte à côte, une conversation, un solde. {{appName}} propose les deux.",
  },
  why: {
    title: "Pourquoi Claude refuse",
    intro: "Trois raisons, et aucune n'est un réglage.",
    trained:
      "Appris. Anthropic grave ses valeurs dans le modèle lui-même. Les refus viennent de l'entraînement, pas d'un filtre qu'on désactive.",
    policy:
      "Des règles partout. La politique d'utilisation d'Anthropic s'applique dans chaque appli et chaque API qui sert Claude, chez nous aussi. Une autre interface ne change pas le modèle.",
    closed:
      "Poids fermés. Personne hors d'Anthropic ne peut modifier Claude. Les modèles ouverts peuvent être abliterated, légèrement modifiés pour ne plus esquiver. Claude, non.",
  },
  tricks: {
    title: "Ce qui ne marche pas",
    intro:
      "Chaque semaine, une nouvelle astuce circule. Elles ont toutes les mêmes défauts.",
    jailbreak:
      "Les prompts de jailbreak. Ils sont corrigés, ils dégradent l'écriture, et contourner les garde-fous viole les conditions d'Anthropic. Des comptes sont bannis pour ça.",
    fiction:
      "« C'est juste de la fiction. » Ça aide pour du contenu léger. Ça échoue précisément sur les scènes qui comptent.",
    fake: "Les sites « Claude non censuré ». Soit un prompt de jailbreak sous emballage, soit un autre modèle qui porte le nom de Claude. Impossible de savoir lequel.",
    callout:
      "Si un site promet Claude non censuré, demandez quel modèle répond vraiment. La réponse honnête n'est jamais Claude.",
    jailbreakLink:
      "Pourquoi les prompts de jailbreak finissent toujours par casser",
  },
  switch: {
    title: "Ce qui marche : changer de modèle à chaque message",
    intro:
      "{{claudeName}} et les modèles non censurés partagent un même fil. Le modèle change, l'histoire reste.",
    steps: {
      draft: {
        title: "Écrire le brouillon avec Claude",
        body: "Plan, structure, dialogues : ce que {{claudeName}} fait bien.",
      },
      switch: {
        title: "Changer quand il bloque",
        body: "Choisissez un modèle non censuré pour le message suivant. Il lit toute la conversation et écrit la scène que Claude a refusée.",
      },
      back: {
        title: "Revenir pour la finition",
        body: "Rendez le texte à Claude pour la relecture quand le contenu le permet. Ou continuez sans censure.",
      },
      compare: {
        title: "Comparer sur le même prompt",
        body: "Vous hésitez sur la voix ? Envoyez un prompt à deux modèles et gardez le meilleur brouillon.",
      },
    },
  },
  models: {
    title: "Claude et les modèles non censurés, côte à côte",
    intro:
      "Sous chaque nom : le niveau de contenu ou la méthode de décensure. En direct depuis notre catalogue.",
    colModel: "Modèle",
    colContext: "Contexte",
    colStrengths: "Points forts",
    colPrice: "Par message",
    colChat: "Essayer",
    chatLink: "Discuter avec {{model}}",
    footnote:
      "Prix d'un message de référence, notre marge de {{markup}} % comprise.",
  },
  picks: {
    title: "Quel modèle non censuré pour quelle tâche",
    intro:
      "Même chat que Claude. Choisissez selon la tâche, pas selon la mode.",
    long: {
      title: "Longs projets créatifs : {{model}}",
      body: "Le Kimi phare de Moonshot AI, abliterated. Tient une longue intrigue et la pense jusqu'au bout. {{price}} le message.",
    },
    fast: {
      title: "Polyvalent et rapide : {{model}}",
      body: "Un modèle grand public légèrement modifié pour ne plus esquiver. Vif, précis, bon en prose comme en code. {{price}} le message.",
    },
    contrary: {
      title: "Les opinions que Claude ne dira pas : {{model}}",
      body: "{{model}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui en fait un modèle aux opinions politiques à contre-courant. Pour des personnages et des essais qui contestent le consensus. {{price}} le message.",
    },
    roleplay: {
      title: "Personnages et scènes sombres : {{model}}",
      body: "Affiné pour le jeu de rôle. Reste dans son personnage et ne sort pas de l'histoire pour vous mettre en garde. {{price}} le message.",
    },
    cheap: {
      title: "Premiers jets pas chers : {{model}}",
      body: "DeepSeek sans les refus. Rapide et économique pour écrire beaucoup de brouillons. {{price}} le message.",
    },
    compareLink: "{{a}} contre {{b}}",
    writerLink: "Rédacteur IA non censuré : le guide complet",
  },
  limits: {
    title: "Les vraies limites",
    intro: "Zéro refus ne veut pas dire zéro compromis.",
    style:
      "Des voix différentes. Chaque modèle écrit à sa façon. Essayez-en deux sur la même scène avant de choisir.",
    mistakes:
      "Les mêmes erreurs. Les modèles non censurés se trompent sur les faits aussi souvent que les originaux. Vérifiez ce qui compte.",
    claude:
      "Claude reste Claude. Changer de modèle ne change rien à ce que Claude écrira lui-même. Simplement, vous n'êtes plus coincé avec lui.",
    callout:
      "Les modèles non censurés se débloquent après une confirmation unique de majorité. C'est vous qui décidez de ce que vous lisez.",
  },
  faq: {
    title: "FAQ",
    can: {
      q: "Claude peut-il être non censuré ?",
      a: "Non. Les refus de Claude sont appris dans un modèle fermé, personne ne peut donc les retirer. Tout ce qui se vend comme Claude non censuré est une astuce de prompt ou un autre modèle. La vraie alternative, ce sont les modèles ouverts dont les refus ont été retirés.",
    },
    jailbreak: {
      q: "A-t-on le droit de jailbreaker Claude ?",
      a: "Non. Contourner les garde-fous viole la politique d'utilisation d'Anthropic et peut vous coûter votre compte. Ça dégrade aussi le texte. Passer à un modèle sans couche de refus donne le même résultat, sans le risque.",
    },
    best: {
      q: "Quelle est la meilleure alternative à Claude pour la fiction ?",
      a: "Pour une fiction longue, sombre ou explicite : un modèle abliterated comme {{firstName}}. Pour des personnages qui contredisent le courant dominant : {{ownModel}}. Pour le jeu de rôle : un modèle affiné pour le jeu de rôle. Sur {{appName}}, tous sont à côté de Claude.",
    },
    same: {
      q: "Puis-je utiliser Claude et un modèle non censuré dans le même chat ?",
      a: "Oui. Vous choisissez le modèle à chaque message. L'historique suit, le modèle non censuré reprend donc exactement là où Claude s'est arrêté.",
    },
    api: {
      q: "Puis-je appeler Claude et des modèles non censurés via une seule API ?",
      a: "Oui. Des endpoints compatibles OpenAI et Anthropic, une clé pour Claude et les modèles non censurés. Votre premier achat débloque les clés API, les formules démarrent à {{apiSubPrice}} par mois.",
    },
    free: {
      q: "Puis-je l'essayer gratuitement ?",
      a: "Oui. {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit. Modèles non censurés inclus après une confirmation unique de majorité.",
    },
    chatLink: "Chat IA non censuré : choisissez un modèle et lancez-vous",
    roleplayLink: "Jeu de rôle IA sans filtre",
    refusalLink: "Refusal Index : qui répond, qui refuse",
  },
  cta: {
    title: "Gardez la plume de Claude. Lâchez les freins.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Commencez avec {{firstName}}.",
    start: "Lancer un chat non censuré",
    models: "Comparer tous les modèles",
  },
};
