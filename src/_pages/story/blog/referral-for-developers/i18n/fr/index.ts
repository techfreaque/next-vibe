import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Vous avez construit quelque chose avec l'IA. Gagnez en le partageant.",
    description:
      "Pour les développeurs : vos READMEs GitHub, articles de blog et tutoriels ont déjà un potentiel de parrainage. Voici le calcul, bonus compétence (5 %) compris quand d'autres partagent votre compétence.",
    category: "Programme d'affiliation",
    imageAlt:
      "Le terminal d'un développeur avec des statistiques de gains à côté du code",
    keywords:
      "programme de parrainage développeur, affiliation IA, revenu passif développeur, monétisation open source",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Pour les développeurs",
    readTime: "5 min de lecture",
    title:
      "Vous avez construit quelque chose avec l'IA. Gagnez en le partageant.",
    subtitle:
      "Vous livrez déjà avec l'IA. Votre lien de parrainage est une source de revenus que vous n'avez pas encore activée.",
  },
  useCase: {
    title: "Là où les développeurs recommandent naturellement",
    p1: "Vous créez déjà du contenu qui mène les gens vers des outils. Un article sur votre workflow. Un README qui mentionne l'IA utilisée. Un tutoriel YouTube. Une réponse sur Discord où vous recommandez une plateforme. Autant de potentiel de parrainage que la plupart des développeurs laissent dormir.",
    p2: "Partout où vous mentionneriez {{appName}}, ajoutez votre lien de parrainage. Chaque personne qui clique et s'abonne vous rapporte 10 % de chacun de ses paiements, chaque mois, pour toujours. Vous ne changez rien à votre discours. Vous ajoutez juste le lien.",
    examples: [
      "README GitHub : « Construit avec l'API de {{appName}}. Essayez : [votre lien] »",
      "Pied d'article : « Mes outils : ...{{appName}} pour l'accès à l'IA [lien de parrainage] »",
      "Discord/Slack : « J'utilise {{appName}}, voici mon lien de parrainage si ça vous tente »",
      "Description YouTube : « Outils d'IA utilisés dans cette vidéo : {{appName}} [lien de parrainage] »",
    ],
  },
  skillAngle: {
    title: "Publiez une compétence, gagnez quand d'autres la partagent",
    p1: "Chaque compétence que vous publiez a un lien partageable. Partagez-le vous-même et vous touchez les 10 % directs habituels. Quand un autre membre la partage avec son propre lien, vous touchez quand même 5 % de chaque paiement de ces utilisateurs, pour toujours.",
    p2: "Ce que la plupart des gens ratent : vous touchez les 5 % en tant que créateur de la compétence, même quand quelqu'un d'autre la partage. Un utilisateur trouve votre compétence dans l'annuaire, envoie le lien à un ami, cet ami s'inscrit : vous touchez 5 % de ses paiements. Automatiquement. La plateforme suit l'auteur de la compétence, pas celui qui a partagé le lien. Votre compétence travaille pour vous même quand ce n'est pas vous qui la promouvez.",
    p3: "Intégrez le lien de votre compétence dans un README GitHub. Postez-le sur un Discord de développeurs. Chaque personne qui s'inscrit par ce lien vous rapporte 10 %. Chaque personne qu'un autre amène vers votre compétence vous rapporte 5 %. Une même compétence, deux sources de revenus.",
  },
  math: {
    title: "Le calcul (vrais chiffres)",
    subtitle:
      "Votre lien (10 %) vs. votre compétence partagée par d'autres (5 %)",
    tableHeaderProfile: "Profil utilisateur",
    tableHeaderSpend: "Dépense mensuelle",
    tableHeaderDirect: "Direct seul (10 %)",
    tableHeaderSkill: "D'autres partagent votre compétence (5 %)",
    rows: [
      {
        profile: "Abonné Starter",
        spend: "{{planPrice}}/mois",
        direct: "{{planEarn}}/mois",
        skill: "{{planSkillEarn}}/mois",
      },
      {
        profile: "Starter + 1 pack de crédits",
        spend: "{{plusPackSpend}}/mois",
        direct: "{{plusPackEarn}}/mois",
        skill: "{{plusPackSkillEarn}}/mois",
      },
      {
        profile: "Utilisateur intensif : Starter + {{heavyPacks}} packs",
        spend: "{{heavySpend}}/mois",
        direct: "{{heavyEarn}}/mois",
        skill: "{{heavySkillEarn}}/mois",
      },
      {
        profile: "Gros utilisateur : Starter + {{powerPacks}} packs",
        spend: "{{powerSpend}}/mois",
        direct: "{{powerEarn}}/mois",
        skill: "{{powerSkillEarn}}/mois",
      },
    ],
    note: "Un seul gros utilisateur venu par votre lien vous rapporte {{powerEarn}}/mois. Soit {{powerVsPlan}} abonnés à la formule en un. Les développeurs paient déjà des outils d'IA. Ils convertissent vite et résilient rarement.",
    growthNote:
      "À mesure que {{appName}} ajoute des modèles et des capacités, le revenu par utilisateur augmente. Les filleuls d'aujourd'hui vous rapporteront plus l'an prochain, sans effort supplémentaire.",
  },
  chain: {
    title: "La chaîne : quand vos filleuls parrainent à leur tour",
    p1: "Quand vos filleuls parrainent d'autres personnes, vous touchez aussi une part de ces paiements. Le détail exact :",
    level0: "Vous → filleul direct : 10 % de chaque paiement, pour toujours",
    level1:
      "Leurs filleuls (niveau 2) : ~5 % de chaque paiement (la moitié de l'enveloppe de parrainage, qui fait 10 % au total)",
    level2: "Niveau 3 : ~2,5 % de chaque paiement",
    level3: "Niveau 4 : ~1,25 % de chaque paiement",
    level4: "Niveau 5 : ~0,625 % de chaque paiement",
    total:
      "Versement total maximal, tous bénéficiaires confondus : ~20 % d'un paiement donné",
    p2: "Pour être honnête : les bonus de chaîne fondent vite. Les vrais revenus viennent des 10 % directs et des 5 % liés aux compétences. Si vous construisez en public et que vos filleuls sont eux-mêmes développeurs, la chaîne finit par compter. Mais n'optimisez pas pour la profondeur. Optimisez pour des filleuls directs de qualité.",
  },
  crypto: {
    title: "Versement en crypto, sans compte bancaire",
    p1: "Les gains sont versés en BTC ou en USDC. Traitement sous 48 heures après validation. Le versement minimum est de {{minPayout}} : environ {{payoutPowerMonths}} mois d'un seul gros utilisateur, ou {{payoutPlanMonths}} mois d'abonnés sur Starter.",
    p2: "Ou convertissez instantanément vos gains en crédits sur la plateforme. Si vous utilisez vous-même {{appName}}, vos revenus de parrainage compensent votre propre consommation.",
  },
  close: {
    title: "Activez le robinet",
    p1: "Vous construisez, écrivez et parlez déjà d'outils d'IA. Ajouter un lien de parrainage ne coûte rien et prend cinq minutes. Publiez aussi une compétence, et vous gagnerez en plus quand d'autres la partagent.",
    p2: "L'effet cumulé (commissions récurrentes, revenu par utilisateur en hausse, chaîne de développeur à développeur) joue en votre faveur à mesure que vous construisez en public.",
    createCode: "Créer votre code de parrainage",
    joinDiscord: "Rejoindre le Discord",
  },
};
