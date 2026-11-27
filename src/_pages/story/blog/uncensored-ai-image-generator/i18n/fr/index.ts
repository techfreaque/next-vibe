import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Générateur d'images IA sans censure, prix par image",
    description:
      "{{uncensoredCount}} générateurs d'images IA sans censure à côté de Flux, Seedream, GPT Image et Recraft : {{modelCount}} modèles, vrai prix par image, aucun flou. Retouche incluse.",
    category: "Comparatif de modèles",
    imageAlt: "{{appName}} : générateurs d'images IA sans censure comparés",
    keywords:
      "générateur d'images IA sans censure, générateur d'images IA non censuré, générateur d'images IA sans restriction, générateur d'images IA sans filtre, générateur d'images IA NSFW, retouche photo IA sans filtre, Chroma, Lustify, Qwen Edit Uncensored, FLUX.3, Seedream 5.5, GPT Image, Recraft, prix par image IA, générateur d'images IA pas cher, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif de modèles",
    readTime: "8 min de lecture",
    title: "Générateurs d'images IA sans censure. Vrais prix, aucun flou.",
    subtitle:
      "{{modelCount}} modèles d'image de {{labCount}} labos sur un seul solde, dont {{uncensoredCount}} sans censure. Ce que fait chacun, ce qu'il coûte par image, et où il atteint ses limites.",
  },
  intro: {
    lead: "Un prompt banal. L'image revient floutée, recadrée ou refusée. Une étude de nu, une couverture de roman d'horreur, une scène de votre propre livre. Les grands générateurs d'images filtrent pour l'utilisateur le plus frileux de la planète, et vous payez un abonnement pour ça.",
    p2: "{{appName}} fait tourner {{modelCount}} modèles d'image de {{labCount}} labos, dont {{uncensoredCount}} sans censure, tous sur un même solde de crédits. Au programme : les modèles qui génèrent vraiment sans filtre, tous les modèles côte à côte avec leur niveau de filtre et leur vrai prix par image, le bon choix selon la tâche, et comment créer ou retoucher une image directement depuis une discussion.",
  },
  exists: {
    title: "Existe-t-il un générateur d'images IA sans censure ?",
    intro:
      "Oui. {{uncensoredCount}} tournent ici, servis par Venice.ai, sans flou et sans refus. Deux créent des images à partir de texte, deux retouchent une image que vous leur fournissez.",
    models: {
      lustify:
        "Images adultes photoréalistes. Pensé pour les corps et la peau. Faible sur le texte dans l'image et les scènes complexes.",
      chroma:
        "Poids ouverts, réentraîné sans filtrage de contenu. Prompts longs, large palette de styles, contenu explicite compris.",
      qwenEdit:
        "Retouche sans censure. Donnez-lui une image et une consigne : changer une tenue, un style, transformer la scène.",
      fireRed:
        "Retouches précises. Il modifie ce que vous décrivez et laisse le reste de l'image intact.",
      other:
        "Modèle d'image sans censure. Sa page modèle indique ce qu'il fait de mieux.",
    },
    consent:
      "Les modèles sans censure sont réservés aux adultes. La première fois, vous confirmez avoir 18 ans ou plus. Une seule fois. Ensuite, c'est vous qui décidez de ce que vous créez, pas une multinationale.",
  },
  levels: {
    title: "Ce que les niveaux de filtre changent pour les images",
    intro: "Chaque modèle d'image a l'un des trois niveaux.",
    mainstream:
      "Grand public ({{mainstreamCount}} modèles) : OpenAI et Recraft. Filtres stricts. Excellents pour le texte et le design, inutilisables pour tout ce qu'un service de conformité signalerait.",
    open: "Ouvert ({{openCount}} modèles) : FLUX, Seedream, Qwen, Grok Imagine, Wan et d'autres. Filtres plus légers, parfaits pour l'art sombre et les thèmes adultes, mais pas pour l'explicite.",
    uncensored:
      "Sans censure ({{uncensoredCount}} modèles) : aucun filtre de notre part, aucun refus chez le fournisseur. Images explicites sur les modèles conçus pour ça.",
    p1: "Vous choisissez le niveau par image, pas par compte. Une photo produit nette ? Un modèle ouvert. La scène dont votre histoire a vraiment besoin ? Un modèle sans censure. Même solde, même discussion.",
  },
  table: {
    title: "Les {{modelCount}} modèles d'image, côte à côte",
    intro:
      "Sans censure d'abord, puis ouvert, puis grand public. Du moins cher au plus cher dans chaque niveau. Prix avec notre marge de {{markup}} % incluse. 1 crédit = {{creditValue}}.",
    colModel: "Modèle",
    colFilter: "Niveau de filtre",
    colInput: "Entrée",
    colCredits: "Crédits / image",
    colPrice: "Prix / image",
    inputText: "Texte",
    inputEdit: "Texte ou image",
    perUnit: "{{perUnit}} images pour {{unit}}",
    footnote:
      "« Texte ou image » signifie que le modèle accepte une image de référence : retouche, image vers image, personnages cohérents. Le prix vaut pour la taille par défaut, quelques modèles facturent plus cher les grands formats. Les modèles facturés au token plutôt qu'à l'image figurent dans la liste complète.",
    allModels: "Voir tous les modèles avec leur fiche complète",
  },
  picks: {
    title: "Le meilleur générateur d'images IA pour chaque tâche",
    intro:
      "Aucun modèle ne gagne partout. Six usages, les modèles qui collent, et les faits concrets pour chacun.",
    factLine:
      "{{credits}} crédits ({{price}}) · {{perUnit}} pour {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Sans filtre : explicite et tabou",
      body: "À partir de texte, rien de flouté. Chroma pour la polyvalence : illustration, peinture, fantasy, prompts longs et détaillés. Lustify pour les corps photoréalistes. Les deux comptent parmi les modèles les moins chers de la plateforme.",
    },
    uncensoredEdit: {
      title: "Sans filtre : retoucher votre propre image",
      body: "Envoyez une image, décrivez le changement. Qwen Edit Uncensored est celui qui est prévu pour le contenu explicite. FireRed est le plus précis. Sur une retouche difficile, essayez les deux.",
    },
    cheap: {
      title: "Le moins cher : brouillons et volume",
      body: "Miniatures, planches d'ambiance, test d'un prompt avant le vrai rendu. {{cheapestName}} coûte {{cheapestCredits}} crédits, soit {{cheapestPerUnit}} images pour {{unit}}.",
    },
    quality: {
      title: "Le plus de détail : le rendu final",
      body: "Quand l'image est le livrable. Détails plus fins, prompt mieux respecté. Brouillon sur un modèle bon marché, rendu final ici.",
    },
    text: {
      title: "Du texte dans l'image : affiches, logos, pubs",
      body: "La plupart des modèles massacrent les lettres. Pas ceux-là. Recraft est pensé pour le design. GPT Image garde les mises en page denses intactes. Qwen Image 3 Pro est l'option ouverte. Tous sont filtrés.",
    },
    references: {
      title: "Images de référence et personnages cohérents",
      body: "Même visage, même produit, image après image. Ces modèles acceptent une ou plusieurs images de référence. Au total, {{editCount}} modèles ici prennent une image en entrée.",
    },
  },
  chat: {
    title: "Créer une image depuis n'importe quelle discussion",
    intro:
      "Pas d'application à part. Demandez dans n'importe quelle discussion sur {{appName}} et l'IA lance le générateur d'images pour vous.",
    steps: {
      ask: {
        title: "Décrivez l'image",
        body: "Sujet, style, lumière, cadrage. Avec vos mots. L'IA rédige le prompt de génération.",
      },
      model: {
        title: "Gardez le modèle par défaut, ou nommez-en un",
        body: "Le réglage image de votre skill choisit le modèle : {{defaultModel}} tant que vous n'y touchez pas. Envie d'un autre ? Dites-le : « utilise FLUX.3 ».",
      },
      edit: {
        title: "Joignez une image pour la retoucher",
        body: "Glissez une image et dites ce qui doit changer. Il faut un modèle qui accepte les images, comme Qwen Edit Uncensored ou Seedream. Les modèles texte seul ne voient pas votre image.",
      },
      result: {
        title: "Regardez, gardez",
        body: "L'image apparaît dans la discussion en quelques secondes et s'enregistre dans votre espace. Continuez la conversation pour l'affiner.",
      },
    },
    toolPage:
      "Besoin de tout contrôler ? La page du générateur d'images règle directement le modèle, la taille, le format et la qualité.",
    toolLink: "Ouvrir le générateur d'images",
    roleplayLink:
      "Des visuels pour vos personnages : le guide du jeu de rôle IA sans filtre",
  },
  pricing: {
    title: "Ce que coûte une image IA ici",
    intro: "Des crédits par image. Un seul solde pour tous les modèles.",
    perImage:
      "Chaque modèle a un prix par image : le prix du fournisseur plus notre marge de {{markup}} %, arrondi au dixième de crédit supérieur. 1 crédit = {{creditValue}}.",
    range:
      "Le moins cher en ce moment : {{cheapestName}} à {{cheapestPrice}}. Le moins cher sans censure : {{uncensoredName}} à {{uncensoredPrice}}. Le plus cher : {{priciestName}} à {{priciestPrice}}.",
    failed:
      "Les crédits ne sont débités qu'une fois l'image livrée. Échec ou refus du fournisseur : vous ne payez rien.",
    free: "Gratuit : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Sur {{uncensoredName}}, cela fait {{freeUncensoredImages}} images par mois sans rien payer.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    link: "Voir les abonnements et les packs",
  },
  limits: {
    title: "Les limites, sans détour",
    intro: "Connaissez les angles morts avant de dépenser.",
    textOnly:
      "Les deux générateurs sans censure n'acceptent que du texte. Pour modifier une image existante sans filtre, passez à un modèle de retouche sans censure.",
    specialists:
      "Les modèles sans censure sont des spécialistes. Pour la typographie, les logos et les photos produit propres, les modèles ouverts et grand public font mieux.",
    upstream:
      "Les modèles ouverts et grand public passent par la modération de leur fournisseur. Un refus ne coûte rien. Changez de modèle plutôt que de reformuler.",
    video:
      "La vidéo, c'est autre chose. Chaque modèle vidéo ici vient d'un grand labo, avec les filtres de son fournisseur. Le sans censure s'arrête à l'image fixe.",
    law: "Pas de filtre, pas de filet. Ce que vous créez et publiez relève de votre responsabilité, et la loi de votre pays s'applique toujours. Les images sexuelles de mineurs sont illégales partout. Dans de nombreux pays, les images sexuelles d'une personne réelle sans son consentement le sont aussi.",
    callout:
      "Les adultes décident de ce qu'ils regardent. Nous fournissons les outils et les faits, pas la morale.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Existe-t-il un générateur d'images IA sans restriction ?",
      a: "Oui. {{appName}} propose {{uncensoredCount}} modèles d'image sans censure : Chroma et Lustify créent à partir de texte, Qwen Edit Uncensored et FireRed retouchent vos propres images. Aucun flou, aucun refus. Une confirmation unique de majorité les débloque.",
    },
    free: {
      q: "Existe-t-il un générateur d'images IA sans censure gratuit ?",
      a: "Vous pouvez commencer gratuitement. {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. {{uncensoredName}} coûte {{uncensoredCredits}} crédits par image. Ensuite : une formule, dès {{subPrice}} par mois.",
    },
    cheapest: {
      q: "Quel est le générateur d'images IA le moins cher ?",
      a: "En ce moment {{cheapestName}}, à {{cheapestCredits}} crédits ({{cheapestPrice}}) par image. Les {{modelCount}} prix figurent dans le tableau ci-dessus, lus en direct dans notre registre de modèles.",
    },
    edit: {
      q: "Puis-je retoucher une photo sans filtre ?",
      a: "Oui. Joignez l'image dans une discussion, décrivez la modification et demandez Qwen Edit Uncensored ou FireRed. Les modèles de retouche ouverts et grand public appliquent les filtres de leur fournisseur.",
    },
    consent: {
      q: "Pourquoi dois-je confirmer que j'ai 18 ans ?",
      a: "Les modèles sans censure peuvent produire du contenu explicite. Vous confirmez une fois être majeur, et c'est tout. Pas de pièce d'identité à envoyer, pas d'avertissements à répétition.",
    },
    watermark: {
      q: "Les images portent-elles un filigrane ?",
      a: "Pas de notre part. Aucun logo, aucune incrustation. Certains labos intègrent d'eux-mêmes des données de provenance invisibles, cela vient du labo.",
    },
    api: {
      q: "Puis-je générer des images via l'API ?",
      a: "L'API {{appName}} couvre les modèles de chat aux formats OpenAI et Anthropic. La génération d'images se fait dans la discussion et sur la page du générateur d'images.",
    },
    videoLink: "Comparer les générateurs de vidéo IA",
    chatLink: "Lire le guide de tous les modèles de chat sans censure",
  },
  partners: {
    body: "Vous animez une chaîne ou une communauté autour de l'art IA ? Le programme partenaire de {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Voir le programme partenaire",
  },
  cta: {
    title: "Choisissez un modèle. Créez l'image.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Sans censure, ouvert ou grand public, image par image.",
    generate: "Générer une image",
    models: "Parcourir tous les modèles",
  },
};
