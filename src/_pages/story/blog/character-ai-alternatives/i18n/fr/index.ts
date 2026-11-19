import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative Character AI sans filtre : le comparatif 2026",
    description:
      "Les alternatives à Character.AI sans filtre, comparées sur leurs propres pages de prix, de filtre et de confidentialité : Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice et {{appName}}. En bonus : importez vos personnages Character.AI.",
    category: "Comparatif",
    imageAlt: "Les alternatives à Character.AI sans filtre, comparées",
    keywords:
      "alternative Character AI sans filtre, alternative à Character AI, alternatives Character.AI, Character AI sans filtre, site comme Character AI, appli comme Character AI, Character AI non censuré, alternative Character AI NSFW, alternative à Janitor AI, importer un personnage Character AI, jeu de rôle IA sans filtre, roleplay IA sans filtre, Character.AI alternatives, Character AI alternative no filter, sites like Character AI, uncensored Character AI, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "10 min de lecture",
    title:
      "Les alternatives à Character.AI sans filtre. Vérifiées, pas devinées.",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées sur ce que disent leurs propres pages de prix, de filtre et de confidentialité. Vérifié le {{date}}. Emmenez vos personnages avec vous.",
  },
  intro: {
    lead: "La plupart des listes d'alternatives à Character.AI se copient entre elles. « Sans filtre », « gratuit », « idéal pour le NSFW » : des affirmations que personne n'a vérifiées. Puis vous vous inscrivez et tombez sur un paywall après 50 messages, ou sur un filtre que la liste n'avait jamais mentionné.",
    p2: "Nous avons lu la page de prix, les conditions, la politique de confidentialité et le centre d'aide de chaque plateforme le {{date}}. Chaque affirmation ci-dessous vient de ces pages, sources à un clic. Nous gérons l'une de ces plateformes, {{appName}}. Nous le disons, nous la mettons en premier, et nous vous disons où les autres font mieux.",
  },
  criteria: {
    title: "Ce qui compte vraiment quand vous changez",
    intro: "Cinq questions. Répondez-y avant de choisir.",
    filter:
      "Filtre : qu'est-ce qui est autorisé, qui décide, y a-t-il une vérification d'âge ? « Sans filtre » sur la page d'accueil et « interdit » dans les conditions, ça arrive sur le même site.",
    memory:
      "Mémoire : quelle part de l'histoire le modèle relit avant chaque réponse. Petit contexte, et votre personnage oublie les premiers chapitres.",
    price:
      "Prix : abonnement fixe, limite de messages ou paiement à l'usage. Les offres gratuites vont de l'illimité à un aperçu de 50 messages.",
    privacy:
      "Confidentialité : vos chats sont-ils stockés, utilisés pour l'entraînement, pour la publicité ? Le jeu de rôle, c'est personnel. Lisez cette partie.",
    characters:
      "Personnages : une grande bibliothèque communautaire, vos propres créations, ou les deux. Et pouvez-vous emmener ceux que vous avez déjà ?",
  },
  table: {
    title: "Toutes côte à côte",
    intro:
      "Faites défiler sur le côté sur mobile. Faits des concurrents vérifiés le {{date}} sur leurs propres pages. Faits de {{appName}} lus en direct dans notre configuration. Character.AI ferme le tableau comme référence filtrée.",
  },
  us: {
    title: "{{appName}} : choisissez le modèle, réglez le filtre",
    intro:
      "Pas une appli de personnages avec un seul modèle maison. Un chat avec {{modelCount}} modèles, où les personnages sont des compétences que vous choisissez, créez ou importez.",
    models:
      "Modèles : {{uncensored}} modèles non censurés à côté de {{mainstream}} modèles grand public et {{open}} ouverts. Changez à chaque message, en pleine scène. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public : il ne ramène pas une histoire sombre en terrain sûr.",
    characters:
      "Personnages : la compétence Jeu de rôle demande à n'importe quel modèle de rester dans son personnage. La page des compétences liste les personnages intégrés et les compétences communautaires publiées par d'autres utilisateurs. Créez le vôtre dans l'éditeur, ou laissez le Créateur de skills l'écrire avec vous dans un chat.",
    import:
      "Import : collez un lien public Character.AI ou Talkie et obtenez votre propre copie du personnage, créateur d'origine crédité.",
    privacy:
      "Confidentialité : les chats incognito restent dans votre navigateur, sans compte. Les chats privés sont enregistrés uniquement sur votre compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Abonnements à partir de {{subPrice}} par mois. Les packs de crédits rechargent un abonnement actif et n'expirent jamais.",
    weak: "Là où nous sommes plus faibles : notre bibliothèque communautaire est petite à côté de Character.AI ou Janitor AI, et les crédits sont décomptés à l'usage : les longues scènes sur des modèles premium finissent par coûter.",
    skillsLink: "Voir les compétences intégrées et communautaires",
    roleplayLink: "Ouvrir la compétence Jeu de rôle",
    creatorLink: "Créer un personnage avec le Créateur de skills",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifiées le {{date}}. Ce que chacune est, ce que son filtre autorise vraiment, ce qu'elle coûte, ce que deviennent vos chats.",
    heading: "{{number}}. {{name}} : {{kind}}",
    filter: "Filtre :",
    price: "Prix :",
    priceValue: "Offre gratuite : {{free}}. Payant : {{plans}}.",
    privacy: "Confidentialité :",
    pro: "Point fort :",
    con: "Le hic :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} contre {{name}} : le comparatif complet",
    visit: "Visiter {{name}}",
  },
  import: {
    title: "Emmenez vos personnages Character.AI avec vous",
    intro:
      "Changer ne veut pas dire repartir de zéro. Importez un personnage depuis son lien public en moins d'une minute.",
    steps: {
      account: {
        title: "Connectez-vous",
        body: "L'import demande un compte gratuit, pour que le personnage ait un propriétaire.",
      },
      create: {
        title: "Ouvrez l'éditeur de personnage",
        body: "Sur la page des compétences, cliquez sur « Créer une compétence personnalisée » puis choisissez « Importer via un lien ».",
      },
      paste: {
        title: "Collez le lien public",
        body: "Character.AI (character.ai, c.ai) ou Talkie (talkie-ai.com). Nous copions ce que montre la page publique : nom, avatar, message d'accueil, description et tags, plus la définition quand le créateur l'a rendue publique. Gardez-le privé, non répertorié ou public.",
      },
      model: {
        title: "Choisissez le modèle",
        body: "Le personnage tourne désormais sur n'importe lequel de nos modèles. Commencez sur un modèle non censuré, changez en pleine scène quand un modèle s'essouffle. La discussion garde son historique.",
      },
    },
    callout:
      "Le créateur d'origine est crédité sur le personnage importé, avec un lien vers la source. Importer deux fois le même lien ouvre votre copie existante au lieu d'un doublon.",
  },
  privacy: {
    title: "Qui lit vos jeux de rôle ?",
    intro: "Sur {{appName}}, voici exactement ce qui se passe.",
    incognito:
      "Les chats incognito vivent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données de votre navigateur et ils disparaissent.",
    transit:
      "Chaque message passe quand même par notre serveur jusqu'au fournisseur du modèle qui écrit la réponse. Toute IA hébergée fonctionne ainsi. La consommation de crédits est enregistrée pour la facturation.",
    others:
      "Ailleurs, lisez la ligne confidentialité de chaque fiche ci-dessus. Plusieurs plateformes écrivent dans leur propre politique que les chats peuvent entraîner leurs modèles ou alimenter la publicité.",
    callout:
      "L'incognito garde votre histoire hors de nos serveurs. Il ne la cache pas au modèle qui écrit les réponses.",
  },
  stay: {
    title: "Quand Character.AI reste le bon choix",
    intro: "Parfois, le filtre est la fonctionnalité.",
    library:
      "Vous voulez la plus grande bibliothèque de personnages prêts à l'emploi et ne voulez jamais en créer un.",
    flat: "Vous voulez des messages gratuits illimités et acceptez en échange la publicité et un modèle filtré.",
    filter:
      "L'utilisateur est un adolescent, ou l'appareil est partagé avec un adolescent. Une appli verrouillée convient mieux.",
    callout:
      "Sans filtre veut dire sans filet. Ce que vous écrivez et publiez relève de vous, et la loi de votre pays s'applique toujours.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à Character.AI sans filtre ?",
      a: "Ça dépend de ce que vous cherchez. Une énorme bibliothèque communautaire gratuite : Janitor AI. Le contrôle total sur votre propre machine : SillyTavern. Un compagnon au long cours avec voix et selfies : Kindroid ou Nomi. Le choix du modèle, des modèles non censurés et vos propres personnages sur un seul solde : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Character.AI sans filtre ?",
      a: "Oui. Janitor AI a une offre gratuite avec des bots NSFW marqués Limitless. SillyTavern est un logiciel libre, vous fournissez le modèle. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, modèles non censurés compris après une confirmation unique de majorité (18+).",
    },
    import: {
      q: "Puis-je transférer mes personnages Character.AI vers une autre appli ?",
      a: "Sur {{appName}}, oui : collez le lien public du personnage et vous obtenez votre propre copie avec nom, avatar, message d'accueil, description et tags, plus la définition si elle est publique. Les liens Talkie fonctionnent aussi. Il faut un compte gratuit.",
    },
    nsfw: {
      q: "Quelles alternatives à Character.AI autorisent le NSFW ?",
      a: "D'après leurs propres pages : Janitor AI autorise les bots NSFW marqués Limitless pour les adultes qui se déclarent majeurs. CrushOn a un interrupteur Unfiltered après une vérification d'âge. Kindroid se dit sans filtre, avec quelques lignes rouges. Nomi laisse le texte sans filtre et filtre la nudité dans les images. {{appName}} débloque les modèles non censurés après une confirmation unique de majorité (18+). Character.AI affirme que le contenu pornographique ne sera jamais pris en charge.",
    },
    private: {
      q: "Quelle alternative garde mes chats privés ?",
      a: "SillyTavern stocke les chats sur votre propre machine. Sur {{appName}}, les chats incognito restent dans votre navigateur. Venice affirme que l'historique reste sur votre appareil. Les messages envoyés à un modèle hébergé, quel qu'il soit, arrivent quand même chez le fournisseur qui y répond.",
    },
    account: {
      q: "Faut-il un compte pour essayer ?",
      a: "Pas sur {{appName}} : le chat incognito fonctionne sans compte. Il faut un compte gratuit pour importer des personnages, publier les vôtres et retrouver vos chats sur tous vos appareils.",
    },
    roleplayLink: "Le jeu de rôle IA sans filtre : modèles, mémoire et prix",
    kindsLink:
      "Abliteré, fine-tuné ou sa propre vision du monde : les trois sortes d'IA non censurée",
  },
  partners: {
    body: "Vous animez une communauté de jeu de rôle, un Discord ou une chaîne sur les personnages IA ? Le programme partenaire de {{appName}} vous verse {{referralPercent}} % de chaque paiement que vous apportez, chaque mois.",
    link: "Découvrir le programme partenaire",
  },
  cta: {
    title: "Amenez un personnage. Choisissez le modèle.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Non censuré, ouvert ou grand public : changez quand vous voulez.",
    start: "Lancer un jeu de rôle",
    skills: "Voir les compétences",
  },
};
