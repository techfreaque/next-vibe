import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Créez une compétence. Partagez le lien. Gagnez chaque mois.",
    description:
      "Les compétences {{appName}} : des configs IA créées une fois, partagées partout. Votre lien rapporte 10 % de chaque paiement, et 5 % via les autres.",
    category: "Économie des compétences",
    imageAlt:
      "Une personne qui crée des compétences d'IA et touche des revenus récurrents en les partageant",
    keywords:
      "compétences IA, revenu passif, programme de parrainage, {{appName}}, IA personnalisée, partage de compétences, économie des compétences",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Économie des compétences",
    readTime: "7 min de lecture",
    title: "Créez une compétence. Partagez le lien. Gagnez chaque mois.",
    subtitle:
      "Configurez une IA une seule fois. Partagez-la partout. Touchez 10 % récurrents sur chaque paiement des personnes qui s'inscrivent par ce lien.",
    quote:
      "« J'ai créé une compétence de raisonnement clinique pour les étudiants en médecine. Trois mois plus tard, elle paie mon abonnement, et même plus. »",
  },
  whatAreSkills: {
    title: "Que sont les compétences sur {{appName}} ?",
    p1: "Une compétence, c'est une configuration d'IA complète (prompt système, personnage compagnon, choix du modèle par modalité, voix, réglages de génération d'images) réglée une fois et réutilisable partout. Voyez-la comme une recette : vous trouvez les bons ingrédients une fois, puis tout le monde peut s'en servir.",
    p2: "La plateforme propose {{modelCount}} modèles : grand public, open source, non censurés. Chaque compétence définit quel modèle utiliser pour la conversation, lequel pour la vision, lequel pour la génération d'images, quelle voix parle. La plupart des utilisateurs ne toucheront jamais ces réglages : ils utilisent la compétence, c'est tout. Vous, le créateur, faites ce travail une fois.",
    p3: "Créer une compétence est gratuit. Aucun abonnement payant requis. Aucun code. Si vous savez décrire ce que vous attendez d'une IA, vous savez créer une compétence.",
    buildTitle: "Trois façons de créer une compétence",
    build1Title: "À la main, sur la page de la compétence",
    build1Body:
      "Contrôle total. Vous réglez chaque paramètre directement. Idéal si vous savez exactement ce que vous voulez.",
    build2Title: "En demandant à Thea ou Hermes dans la conversation",
    build2Body:
      "Décrivez ce que vous voulez construire. Réfléchissez avec eux : laissez-les rédiger le prompt système, contester vos idées, itérer. La meilleure façon de construire quelque chose de nuancé. Ils connaissent la plateforme.",
    build3Title: "Pour les développeurs : générer un skill.ts",
    build3Body:
      "Demandez à votre agent de créer un fichier de compétence. Il produit un skill.ts qui suit la même structure que les compétences compagnons intégrées, prêt à être commité et utilisé tout de suite.",
  },
  shareLink: {
    title: "Le lien de partage : comment vous gagnez vraiment",
    p1: "Quand vous cliquez sur Partager et gagner sur une compétence, vous obtenez une URL qui fait deux choses à la fois :",
    bullet1:
      "Elle montre la compétence aux visiteurs : ce qu'elle fait, comment elle est configurée, quel type d'IA c'est",
    bullet2:
      "Elle vous place dans la chaîne de parrainage : toute personne qui s'inscrit par ce lien vous est attribuée",
    p2: "Concrètement, cette attribution signifie ceci : quand quelqu'un s'inscrit via le lien de votre compétence, vous êtes son parrain direct. Vous touchez 10 % de chacun de ses paiements, pour toujours. Et quand un autre membre partage votre compétence avec son propre lien, vous touchez quand même 5 % en tant que créateur de la compétence, sur des utilisateurs que vous n'avez jamais approchés.",
    p3: "Ce n'est pas une récompense unique. Ce n'est pas une prime d'inscription. Chaque renouvellement d'abonnement, chaque recharge, chaque achat : vous en touchez 10 %. Vous n'avez fait le travail qu'une fois.",
    p4: "L'URL ressemble à ceci : {{appName}}/track?ref=YOUR_CODE&url=/en/skill/SKILL_ID",
  },
  examples: {
    title: "Les compétences que les gens partagent vraiment, et qui rapportent",
    p1: "Les compétences qui marchent le mieux règlent un problème précis et récurrent, difficile à expliquer sans le montrer. Voici des schémas qui fonctionnent :",
    example1Title: "Le compagnon spécialiste",
    example1Body:
      "Un étudiant en médecine crée une compétence qui vous parle comme un confrère clinicien expérimenté : cas, diagnostics différentiels, raisonnement sous pression. Partagée sur les forums de fac de médecine. Chaque inscription venue de cette communauté paie tous les mois.",
    example2Title: "Le vrai produit de ceux qui vendent leur savoir",
    example2Body:
      "Coachs, consultants, créateurs de formations : ils vendaient jusqu'ici des PDF et des appels Zoom. Une compétence bien construite avec leur vraie expertise génère un revenu récurrent sans les frais fixes. C'est mieux qu'une formation.",
    example3Title: "L'option non censurée",
    example3Body:
      "Des compétences qui utilisent des modèles non censurés pour l'écriture créative, le jeu de rôle ou le débat. Partagées dans des communautés où la censure des IA grand public est une frustration quotidienne. Forte intention d'inscription.",
    example4Title: "Le relecteur de code du développeur",
    example4Body:
      "Il connaît votre stack et fait respecter les conventions de votre équipe. Partagé dans des communautés d'ingénieurs qui dépensent 100 à 200 $ par mois en IA. Des inscriptions à forte valeur, qui restent.",
  },
  theMath: {
    title: "Le calcul : 10 % par utilisateur et par mois, pour toujours",
    p1: "Quand quelqu'un s'inscrit via le lien de votre compétence et s'abonne, vous touchez 10 % de chacun de ses paiements. D'autres partagent votre compétence ? Vous touchez aussi 5 % sur leurs inscriptions. Pas seulement le premier mois. Chaque mois, tant qu'ils restent abonnés.",
    tableHeaderProfile: "Profil utilisateur",
    tableHeaderSpend: "Dépense mensuelle",
    tableHeaderEarn: "Vous gagnez/mois (via le lien de la compétence)",
    row1Profile: "Abonné Starter",
    row1Spend: "{{planPrice}}/mois",
    row1Earn: "{{planEarn}}/mois",
    row2Profile: "Starter + 1 pack de crédits",
    row2Spend: "{{plusPackSpend}}/mois",
    row2Earn: "{{plusPackEarn}}/mois",
    row3Profile: "Utilisateur intensif : Starter + {{heavyPacks}} packs",
    row3Spend: "{{heavySpend}}/mois",
    row3Earn: "{{heavyEarn}}/mois",
    row4Profile: "Gros utilisateur : Starter + {{powerPacks}} packs",
    row4Spend: "{{powerSpend}}/mois",
    row4Earn: "{{powerEarn}}/mois",
    p2: "La compétence est l'appât. Le lien est le revenu. Vous gagnez que la personne utilise votre compétence tous les jours ou passe à autre chose : l'attribution du parrainage vous reste quoi qu'il arrive.",
    p3: "Partagez une compétence à cinq endroits. Une partie des gens clique. Une partie s'inscrit. Ces inscrits vous rapportent 10 % chaque mois. Partagez une autre compétence le mois suivant. Vos gains grandissent sans que le travail augmente d'autant.",
  },
  chain: {
    title: "Vous gagnez aussi quand vos utilisateurs parrainent à leur tour",
    p1: "Quand les utilisateurs que vous avez parrainés en parrainent d'autres, vous touchez aussi une part de ces paiements, jusqu'à 5 niveaux de profondeur, chaque niveau divisé par deux :",
    level1: "Niveau 2 (les filleuls de vos filleuls) : ~5 % de chaque paiement",
    level2: "Niveau 3 : ~2,5 % de chaque paiement",
    level3: "Niveau 4 : ~1,25 % de chaque paiement",
    level4: "Niveau 5 : ~0,625 % de chaque paiement",
    p2: "Pour être honnête : les bonus de chaîne fondent vite. Presque tous vos revenus viennent des 10 % sur les parrainages directs via vos compétences. Voyez les gains de chaîne comme un bonus. N'optimisez pas pour la profondeur, optimisez pour des partages de qualité.",
  },
  howTo: {
    title: "5 minutes jusqu'à votre premier lien de partage",
    step1Title: "Créer ou trouver une compétence",
    step1Body:
      "Créez-en une de zéro sur la page de la compétence, demandez à Thea ou Hermes de vous aider à la rédiger, ou trouvez une compétence intégrée qui mérite d'être partagée.",
    step2Title: "Ouvrir la compétence",
    step2Body:
      "Cliquez sur la compétence pour afficher sa page de détails. C'est là que se trouve le bouton Partager et gagner.",
    step3Title: "Générer votre lien de partage",
    step3Body:
      "Cliquez sur Partager et gagner. Si vous avez un code de parrainage, sélectionnez-le. Sinon, créez-en un en trois secondes. Votre lien porte votre code de parrainage et l'ID de la compétence : l'attribution est suivie automatiquement.",
    step4Title: "Partager là où ça compte",
    step4Body:
      "Publiez-le dans les communautés où les gens utiliseraient vraiment la compétence : serveurs Discord, subreddits, fils de forum, articles de blog, canaux Slack. Le ciblé bat le généraliste.",
    step5Title: "Suivre le tableau de bord",
    step5Body:
      "Votre tableau de bord de parrainage affiche visiteurs, inscriptions et gains en temps réel. Chaque nouvelle inscription via votre lien, c'est 10 % de revenu récurrent.",
  },
  close: {
    title: "La compétence est le produit. Le lien est le revenu.",
    p1: "La plupart des gens voient le parrainage comme le partage d'un lien d'inscription générique. Ça marche, mais c'est difficile à vendre. « Voici un lien vers une plateforme d'IA » ne mène nulle part. « Voici une IA qui raisonne comme un clinicien chevronné », ça, les gens l'envoient vraiment.",
    p2: "Construisez ce que vous aimeriez utiliser vous-même. Soyez précis. Puis partagez le lien. Les 10 % suivront d'eux-mêmes.",
    createSkill: "Créer votre première compétence",
    referralPage: "Configurer votre code de parrainage",
  },
};
