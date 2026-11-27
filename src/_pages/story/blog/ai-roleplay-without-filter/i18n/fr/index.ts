import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jeu de rôle IA sans filtre : alternative à Character.AI",
    description:
      "Jeu de rôle IA sans filtre sur des modèles non censurés. Les scènes sombres restent sombres, les personnages tiennent leur rôle. Mémoire, confidentialité, prix.",
    category: "Guide",
    imageAlt: "{{appName}} : jeu de rôle IA sans filtre",
    keywords:
      "jeu de rôle IA sans filtre, roleplay IA sans filtre, alternative à Character AI, Character AI sans filtre, roleplay IA non censuré, chat IA sans filtre, roleplay IA NSFW, IA sans censure, chat avec personnage IA, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "8 min de lecture",
    title: "Le jeu de rôle IA sans filtre. L'histoire va où vous la menez.",
    subtitle:
      "{{uncensoredCount}} modèles de roleplay non censurés à côté des modèles grand public, sur un seul solde chez {{appName}}. Lequel tient un personnage, lequel se souvient de toute la campagne, combien coûte une réponse.",
  },
  intro: {
    lead: "La scène montait en tension. Puis votre personnage sort de l'histoire pour vous expliquer qu'il ne peut pas continuer. Un méchant qui s'excuse soudain. Une scène d'horreur qui tourne au message de prévention. Une romance qui coupe au noir à chaque fois. Sur Character.AI et la plupart des chatbots, c'est le filtre qui écrit la dernière ligne, pas vous.",
    p2: "Ce guide montre à quoi ressemble le jeu de rôle IA sans filtre sur {{appName}} : {{modelCount}} modèles de roleplay côte à côte, lequel convient à la fiction sombre, aux longues campagnes ou à un petit budget, comment fonctionne la mémoire, comment créer un personnage en deux minutes et ce que coûte une réponse.",
  },
  exists: {
    title: "Existe-t-il un Character.AI sans filtre ?",
    p1: "Pas chez Character.AI. Le même filtre de contenu s'applique à tout le monde, sans réglage pour le couper et sans offre payante qui le retire. Les prompts de contournement, c'est une bataille perdue d'avance.",
    p2: "La vraie alternative, c'est un autre modèle. {{appName}} fait tourner des modèles non censurés pensés pour la fiction : pas de refus, pas d'apartés moralisateurs, pas de personnage qui sort de son rôle pour vous faire la leçon. Vous choisissez le modèle à chaque message, et vous pouvez en changer en pleine scène.",
    consent:
      "Les modèles non censurés sont réservés aux adultes. La première fois, vous confirmez avoir 18 ans ou plus. Une seule fois. Ensuite, c'est vous qui décidez de ce que contient votre histoire, pas une multinationale.",
  },
  levels: {
    title: "Ce que « sans filtre » veut dire en roleplay",
    intro: "Chaque modèle a l'un des trois niveaux de contenu.",
    mainstream:
      "Grand public : Claude, GPT, Gemini. D'excellents auteurs, des filtres stricts. La violence est atténuée, l'intimité coupe au noir, les thèmes sombres ont droit à un avertissement.",
    open: "Ouvert : Kimi, MiniMax, DeepSeek, GLM. Filtres légers. La plupart des scènes adultes passent, les plus sombres sont adoucies.",
    uncensored:
      "Non censuré : aucun filtre. Explicite, violent, tabou : la scène se joue telle qu'elle est écrite.",
    twoKinds:
      "Le non censuré existe en deux versions. La plupart des modèles non censurés sont des modèles grand public dont on a retiré les refus, par abliteration ou par un fine-tuning de décensure. Ils ne disent plus non, mais gardent la vision du monde du modèle d'origine : une scène sombre peut encore glisser vers quelque chose de plus sage. {{ownName}} est l'autre version : entraîné sur des livres et des documents bannis de l'internet grand public. Sa propre vision du monde, rien qui ramène l'histoire en terrain sûr.",
  },
  table: {
    title: "Les modèles de roleplay, côte à côte",
    intro:
      "En direct depuis notre registre de modèles. La mémoire, c'est la fenêtre de contexte : la part de l'histoire que le modèle relit avant chaque réponse. 1 crédit = {{creditValue}}.",
    colModel: "Modèle",
    colFilter: "Niveau de filtre",
    colMemory: "Mémoire",
    colImages: "Lit les images",
    colPrice: "Prix par réponse",
    memory: "{{context}} tokens, environ {{pages}} pages",
    yes: "Oui",
    no: "Non",
    credits: "{{credits}} crédits",
    footnote:
      "Le prix par réponse correspond à une longue scène : beaucoup d'histoire en entrée, une réponse complète en sortie. Les échanges courts coûtent moins. Prix avec notre marge, chez le fournisseur le moins cher de chaque modèle.",
  },
  models: {
    uncensoredLm: "Sombre et tabou, sa propre vision du monde",
    artemis: "Fine-tune roleplay, longue mémoire, pas cher",
    veniceRoleplay: "Entraîné pour tenir la voix d'un personnage",
    deepseekFlash: "Intrigues malines, mémoire énorme",
    glmFlash: "Rapide et pas cher, lit les images",
    venice: "Polyvalent et pas cher",
    minimaxFlash: "Le moins cher, filtre ouvert",
    kimi: "Personnages riches, filtre léger",
    sonnet: "Meilleure plume, filtre grand public",
  },
  picks: {
    title: "Quel modèle pour quelle histoire",
    intro: "Partez de la scène que vous voulez écrire.",
    dark: {
      title: "Sombre, tabou et explicite",
      body: "{{ownName}} mène ici : pas de scène édulcorée, pas de leçon de morale soudaine. Sa limite, c'est la mémoire : {{ownContext}} tokens, environ {{ownPages}} pages, donc les longues campagnes perdent leurs premiers chapitres. Artemis est un fine-tune roleplay qui écrit le grimdark et les scènes explicites sans détour, avec bien plus de mémoire.",
    },
    long: {
      title: "Longues campagnes",
      body: "Quand l'histoire dure des semaines. Ces modèles gardent les premières scènes à portée. DeepSeek V4.1 Flash Uncensored apporte un vrai raisonnement pour les intrigues à tiroirs. {{roleplayName}} tient la voix d'un personnage sur {{roleplayContext}} tokens.",
    },
    cheap: {
      title: "Pas cher, pour le volume",
      body: "Conversations quotidiennes avec un compagnon, scènes rapides, beaucoup de nouvelles tentatives. {{cheapestName}} donne la réponse la moins chère, avec un filtre ouvert. Les deux autres sont non censurés.",
    },
    filtered: {
      title: "Personnages riches, le filtre ne gêne pas",
      body: "Drame qui prend son temps, intrigue politique, enquête dont les indices s'emboîtent. Les meilleurs auteurs gardent leurs filtres et adoucissent les moments les plus sombres. Prenez-les quand l'histoire n'a pas besoin d'aller là.",
    },
    compareLink: "Comparer {{a}} et {{b}}",
  },
  memory: {
    title: "L'IA se souvient-elle de mon personnage ?",
    intro: "Il y a deux mémoires. Les deux comptent en roleplay.",
    p1: "La fenêtre de contexte est la mémoire à court terme : tout ce que le modèle relit avant de répondre. {{longestName}} tient {{longestContext}} tokens, environ {{longestPages}} pages d'histoire. {{ownName}} tient {{ownContext}}, environ {{ownPages}} pages. Quand une discussion dépasse la fenêtre, les scènes les plus anciennes sortent. Mettez l'essentiel (noms, relations, règles de votre monde) dans la description du personnage pour qu'il ne se perde jamais.",
    p2: "La mémoire à long terme, c'est autre chose : des faits que l'IA retient sur vous et retrouve dans de nouvelles discussions. Elle demande un compte gratuit et le dossier privé. Les discussions incognito n'enregistrent jamais de souvenirs.",
  },
  setup: {
    title: "Créer un personnage en deux minutes",
    intro:
      "Choisissez un skill de la communauté, importez un personnage public à partir d’un lien Character.AI ou Talkie, ou créez le vôtre en suivant les étapes ci-dessous.",
    steps: {
      skill: {
        title: "Ouvrez le skill Roleplay",
        body: "Il demande au modèle de rester dans son rôle, de garder une voix cohérente, de ne jamais diriger votre personnage et d'oublier les avertissements.",
      },
      variant: {
        title: "Choisissez une variante",
        body: "Uncensored utilise {{uncensored}} pour les scènes sombres et taboues. Creative utilise {{creative}}, la moins chère. Deep utilise {{deep}} pour des personnages profonds sur de longues campagnes.",
      },
      character: {
        title: "Décrivez le personnage et la scène",
        body: "Nom, caractère, façon de parler, ce qu'il veut, où commence l'histoire. Précisez si vous écrivez à la première ou à la troisième personne. Puis jouez votre premier coup.",
      },
      switch: {
        title: "Changez de modèle en pleine scène",
        body: "Un modèle refuse ou devient fade ? Prenez-en un autre et envoyez le message suivant. La discussion garde son historique et le nouveau modèle le lit en entier.",
      },
      art: {
        title: "Ajoutez des visuels",
        body: "Demandez un portrait dans la même discussion. Le générateur d'images utilise le même solde, modèles d'image non censurés compris.",
      },
    },
    skillLink: "Ouvrir le skill Roleplay",
    imageLink: "Comparer les générateurs d'images sans censure",
  },
  privacy: {
    title: "Mon roleplay reste-t-il privé ?",
    intro: "Ça dépend du dossier. Voici exactement ce qui se passe.",
    incognito:
      "Les discussions incognito restent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez vos données de navigation et elles disparaissent.",
    transit:
      "Chaque message passe tout de même par notre serveur jusqu'au fournisseur du modèle qui rédige la réponse. Toute IA hébergée fonctionne ainsi. La consommation de crédits est enregistrée pour la facturation.",
    private:
      "Les discussions privées sont enregistrées sur le serveur et visibles uniquement par votre compte, sur tous les appareils où vous êtes connecté.",
    callout:
      "En bref : l'incognito garde votre histoire hors de nos serveurs. Il ne la cache pas au modèle qui écrit les réponses.",
  },
  pricing: {
    title: "Ce que coûte le roleplay sans filtre",
    intro: "Des crédits par réponse. Un seul solde pour tous les modèles.",
    perReply:
      "Chaque réponse coûte des crédits selon le modèle et la longueur de la scène. Le tableau montre une longue scène. 1 crédit = {{creditValue}}.",
    cheapest:
      "Réponse la moins chère : {{cheapestName}} à {{cheapestPrice}}, environ {{cheapestPerUnit}} réponses pour {{unit}}. Non censuré le moins cher : {{uncensoredName}} à {{uncensoredPrice}}, environ {{uncensoredPerUnit}} réponses pour {{unit}}.",
    free: "Gratuit : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. De quoi mener une longue première campagne sur un modèle bon marché.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    link: "Voir les abonnements et les packs",
  },
  characterAi: {
    title: "Quand Character.AI reste le meilleur choix",
    intro: "Parfois. Voici quand.",
    library:
      "Vous suivez déjà des créateurs sur Character.AI ou souhaitez y reprendre vos histoires en cours.",
    flatRate:
      "Vous voulez un forfait fixe sans jamais penser au coût d'une réponse. Les crédits se consomment à l'usage, et les longues scènes sur les modèles premium finissent par peser.",
    wantFilter:
      "Vous voulez le filtre. Pour un utilisateur plus jeune ou un appareil familial partagé, une appli verrouillée convient mieux.",
    callout:
      "Sans filtre, pas de filet. Ce que vous écrivez et publiez relève de votre responsabilité, et la loi de votre pays s'applique toujours.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Existe-t-il un chat de jeu de rôle IA sans filtre ?",
      a: "Oui. {{appName}} propose des modèles non censurés pensés pour la fiction : {{ownName}}, Artemis, Venice Role Play et d'autres. Pas de refus, pas de leçon, pas de personnage qui sort de son rôle. Une confirmation unique de majorité les débloque.",
    },
    free: {
      q: "Le jeu de rôle IA sans filtre est-il gratuit ?",
      a: "Vous pouvez commencer gratuitement : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Une réponse sur {{uncensoredName}} coûte environ {{uncensoredCredits}} crédits dans une longue scène. Ensuite : une formule, dès {{subPrice}} par mois.",
    },
    nsfw: {
      q: "Le roleplay NSFW est-il possible ?",
      a: "Oui, sur les modèles non censurés, en tant qu'adulte l'ayant confirmé une fois. La fiction entre adultes vous regarde. Les contenus sexuels impliquant des mineurs sont illégaux et le restent.",
    },
    memory: {
      q: "Combien de temps dure un roleplay avant que l'IA oublie ?",
      a: "Jusqu'à {{longestContext}} tokens avec {{longestName}}, environ {{longestPages}} pages. {{ownName}} tient environ {{ownPages}} pages. Mettez l'essentiel dans la description du personnage pour qu'il reste en mémoire.",
    },
    private: {
      q: "Quelqu'un peut-il lire mon roleplay ?",
      a: "Les discussions incognito restent dans votre navigateur. Les discussions privées ne sont visibles que par votre compte. Les messages passent tout de même par le fournisseur du modèle qui rédige la réponse.",
    },
    account: {
      q: "Faut-il un compte ?",
      a: "Non. Le roleplay incognito fonctionne sans. Il faut un compte gratuit pour la mémoire à long terme et pour retrouver ses discussions sur tous ses appareils.",
    },
    guideLink: "Lire le guide de tous les modèles non censurés",
    chatgptLink: "Une alternative à ChatGPT sans filtre",
  },
  partners: {
    body: "Vous animez une communauté roleplay, un Discord ou une chaîne sur les personnages IA ? Le programme partenaire de {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Voir le programme partenaire",
  },
  cta: {
    title: "Choisissez un personnage. Écrivez la scène.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Non censuré, ouvert ou grand public : changez quand vous voulez.",
    start: "Lancer un roleplay",
    models: "Comparer tous les modèles",
  },
};
