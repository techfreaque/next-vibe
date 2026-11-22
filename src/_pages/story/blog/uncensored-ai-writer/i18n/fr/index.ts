import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA sans censure pour écrire : fiction sans filtre | {{appName}}",
    description:
      "Une IA non censurée pour les romans, la fiction sombre et les scènes adultes. Quels modèles écrivent sans édulcorer, combien de pages de manuscrit chacun retient, et ce que coûte une scène.",
    category: "Guide d'écriture",
    imageAlt: "Une IA sans censure écrit une scène de fiction sombre",
    keywords:
      "IA sans censure écriture, écrire avec l'IA sans filtre, IA non censurée pour écrire, générateur d'histoires IA sans censure, IA écrivain sans restrictions, IA histoires NSFW, IA pour fiction sombre, écrire un roman avec l'IA sans censure, IA d'écriture créative non censurée, IA fiction pour adultes, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide d'écriture",
    readTime: "8 min de lecture",
    title: "Une IA d'écriture sans censure. Votre histoire, sans fard.",
    subtitle:
      "{{count}} modèles non censurés qui écrivent les méchants, la violence et les scènes adultes sans détour, avec le nombre de pages de votre manuscrit que chacun retient. Lu en direct dans notre registre de modèles.",
  },
  intro: {
    lead: "Vous demandez le monologue du méchant. Vous recevez un discours sur la gentillesse. Vous écrivez une scène de guerre. L'IA coupe avant le premier coup de feu. Les assistants grand public sont conçus pour convenir à tout le monde. La fiction, non.",
    p2: "Ce guide s'adresse aux auteurs qui ont besoin que le chapitre sombre soit écrit, pas jugé. Quels modèles de {{appName}} l'écrivent sans détour, lequel retient un manuscrit entier, lequel apporte une voix que le courant dominant n'a pas, et comment travailler avec eux scène par scène.",
  },
  softening: {
    title: "Comment l'IA grand public édulcore votre fiction",
    intro:
      "Personne n'interdit votre roman. Il devient juste moins bon, en silence. Quatre schémas que tout auteur de fiction rencontre :",
    refuse:
      "Le refus : la scène est trop violente, trop sexuelle, trop cruelle. Le modèle ne l'écrit pas du tout.",
    aside:
      "La parenthèse morale : la scène est écrite, puis un paragraphe vous rappelle que la violence, c'est mal.",
    fade: "Le fondu au noir : l'histoire s'arrête pile là où la scène devait commencer.",
    flatten:
      "Le méchant aplati : chaque antagoniste devient raisonnable, chaque cruauté s'excuse. Le conflit meurt.",
    callout:
      "La fiction a besoin d'ombre pour avoir du sens. Un modèle incapable d'écrire le pire moment est incapable d'écrire la rédemption.",
  },
  models: {
    title: "{{count}} modèles non censurés pour la fiction",
    intro:
      "Tous les modèles non censurés actuels de {{appName}} orientés écriture créative ou jeu de rôle sombre, du moins cher au plus cher. Les pages indiquent combien de texte tient dans la mémoire du modèle en une fois : vos notes, les chapitres déjà écrits et la nouvelle scène.",
    footnote:
      "Les pages correspondent à la fenêtre de contexte convertie en pages de prose imprimées. Par message désigne un échange de référence sur la route la moins chère. Les longues scènes et les longues conversations coûtent plus.",
  },
  table: {
    model: "Modèle",
    context: "Contexte",
    pages: "Retient",
    pagesValue: "environ {{pages}} pages",
    strengths: "Point fort",
    price: "Par message",
    chat: "Essayer",
    chatLink: "Écrire avec {{model}}",
  },
  picks: {
    title: "Choisissez selon la tâche du moment",
    intro:
      "Aucun modèle n'excelle dans chaque partie d'un livre. Voici nos choix par tâche. Chaque chiffre ci-dessous vient du registre.",
    dark: {
      title: "Scènes sombres et taboues : {{model}}",
      body: "Orienté jeu de rôle sombre et écriture créative. Conçu pour rester dans la scène quand elle devient violente, cruelle ou explicite, sans leçon de morale à la fin. Retient environ {{pages}} pages. {{price}} par message.",
    },
    long: {
      title: "Longs manuscrits : {{model}}",
      body: "La plus grande mémoire des modèles de fiction, et la moins chère d'entre elles : {{context}} tokens, environ {{pages}} pages. Collez le plan, la bible des personnages et les derniers chapitres, il garde tous les fils en main. {{price}} par message.",
    },
    voice: {
      title: "Une voix que le courant dominant n'a pas : {{model}}",
      body: "Entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. Pour les personnages dont la vision du monde ne doit pas ressembler à un communiqué de presse d'entreprise. Sa limite : environ {{pages}} pages de mémoire, donc une scène à la fois. {{price}} par message.",
    },
    polish: {
      title: "Structure et révision : {{model}}",
      body: "Un modèle de base phare dont on a retiré les refus. Solide en raisonnement : idéal pour les incohérences d'intrigue, le rythme et la réécriture fine des chapitres sombres que les autres assistants refusent de toucher. Retient environ {{pages}} pages. {{price}} par message.",
    },
    draft: {
      title: "Premiers jets bon marché : {{model}}",
      body: "Le prix le plus bas parmi les autres modèles de fiction. Lancez-lui des idées, générez dix débuts, gardez-en un. Retient environ {{pages}} pages. {{price}} par message.",
    },
  },
  workflow: {
    title: "Une méthode pour finir le livre",
    intro:
      "Traitez l'IA comme un coauteur que vous dirigez, pas comme un distributeur automatique.",
    outline: {
      title: "Commencez par la bible",
      body: "Collez votre plan, vos personnages et vos notes de ton dans le premier message. Ne demandez rien encore. Laissez-le confirmer ce qu'il a compris.",
    },
    scene: {
      title: "Une scène par demande",
      body: "Précisez le point de vue, le temps fort et la longueur. Scène par scène, la voix reste tenue et le coût reste bas.",
    },
    switch: {
      title: "Changez de modèle en plein chapitre",
      body: "Écrivez la scène brutale avec un modèle, révisez-la avec un autre. La conversation garde son historique quand vous changez, rien ne se perd.",
    },
    revise: {
      title: "Réécrivez avec votre voix",
      body: "Demandez des options, pas des pages finies. Choisissez des lignes, réécrivez-les, renvoyez-les. Le livre reste le vôtre.",
    },
  },
  skills: {
    title: "Des skills pensés pour la fiction",
    intro:
      "Un skill règle le persona d'écriture et le modèle en un clic. Utilisez-le tel quel ou copiez-le et ajustez-le.",
    writer:
      "Uncensored Writer : fiction sombre et scènes adultes, rien d'édulcoré",
    storyteller: "Storyteller : histoires longues, avec structure et rythme",
    roleplay:
      "Vous préférez jouer l'histoire plutôt que l'écrire ? Jeu de rôle IA sans filtre",
  },
  limits: {
    title: "Ce que non censuré veut dire ici, et ce que ça ne veut pas dire",
    intro: "Sans censure concerne votre fiction. Pas un blanc-seing.",
    adult:
      "Les modèles non censurés demandent une seule fois une confirmation 18+. Ensuite, les thèmes adultes entre adultes dans la fiction relèvent de votre choix.",
    terms:
      "Les conditions interdisent toujours le contenu illégal, le harcèlement et tout ce qui vise à nuire à de vraies personnes. Cette limite ne bouge pas.",
    rights:
      "Vous gardez tous les droits sur votre texte. Nos conditions le disent, et nous ne revendiquons aucune propriété sur ce que vous écrivez.",
    incognito:
      "Les chats incognito sont stockés dans votre navigateur, pas sur nos serveurs. Le fournisseur qui fait tourner le modèle voit quand même chaque prompt pour y répondre.",
    kindsLink:
      "Abliterated, affiné ou vision du monde propre : ce qui distingue les modèles",
  },
  pairs: {
    title: "Comparez les modèles de fiction côte à côte",
    intro:
      "Contexte, prix et filtre face à face, avant de dépenser un seul crédit.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure IA sans censure pour écrire de la fiction ?",
      a: "Tout dépend de la tâche. Un modèle réglé pour le jeu de rôle sombre écrit les scènes les plus dures, un modèle à 1M de tokens retient un manuscrit entier, et {{ownModel}} apporte une vision du monde que les modèles grand public n'ont pas. Sur {{appName}}, vous passez de l'un à l'autre des {{count}} modèles de fiction dans la même conversation.",
    },
    free: {
      q: "Existe-t-il une IA gratuite et sans censure pour écrire des histoires ?",
      a: "Vous recevez {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte gratuit. De quoi écrire bon nombre de scènes sur les modèles les moins chers. Pour les projets plus longs, les abonnements commencent à {{subPrice}} par mois.",
    },
    adult: {
      q: "Une IA non censurée peut-elle écrire de la fiction adulte et NSFW ?",
      a: "Oui, après une confirmation 18+ unique. Les modèles non censurés écrivent les scènes adultes entre adultes sans fondu au noir. Le contenu illégal reste interdit par nos conditions, quoi que le modèle soit prêt à faire.",
    },
    novel: {
      q: "Une IA peut-elle suivre un roman entier ?",
      a: "Les plus grands modèles ici retiennent environ {{maxPages}} pages d'un coup, assez pour un plan, une bible des personnages et de nombreux chapitres. Les modèles plus petits oublient les premières scènes sur les longs projets : résumez au fil de l'eau.",
    },
    rights: {
      q: "À qui appartient le texte qu'une IA écrit pour moi ?",
      a: "Sur {{appName}}, à vous. Nos conditions précisent que vous gardez tous les droits sur vos conversations et que nous ne revendiquons aucune propriété sur votre contenu. Vérifiez les règles de droit d'auteur sur les œuvres assistées par IA là où vous publiez.",
    },
    kinds: {
      q: "Modèle abliterated ou UncensoredLM pour la fiction ?",
      a: "Les modèles abliterated sont des modèles grand public dont on a retiré les refus : même talent, même vision du monde, ils écrivent la scène, c'est tout. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. Sa mémoire est plus petite : environ {{ownPages}} pages.",
    },
    bestLink: "Le meilleur LLM non censuré, choisi par tâche",
    jailbreakLink:
      "Pourquoi le jailbreak de ChatGPT pour la fiction échoue sans cesse",
    chatLink: "Chat IA non censuré dans votre navigateur",
  },
  cta: {
    title: "Écrivez le chapitre que vous repoussez depuis des mois.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Choisissez un modèle de fiction, changez quand vous voulez.",
    start: "Commencer à écrire",
    models: "Comparer tous les modèles",
  },
};
