import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT sans filtre : l'alternative non censurée | {{appName}}",
    description:
      "Alternatives à ChatGPT qui refusent moins : {{appName}}, Venice, NanoGPT et les applis locales comparés. Modèles, limites et confidentialité.",
    category: "Guide",
    imageAlt: "{{appName}} : une alternative à ChatGPT sans filtre",
    keywords:
      "alternative à ChatGPT, alternative à ChatGPT sans filtres, alternative à ChatGPT non censurée, ChatGPT sans restrictions, chat IA sans filtre, IA non censurée, UncensoredLM, IA non censurée pour la politique, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "7 min de lecture",
    title: "Alternatives à ChatGPT avec moins de refus",
    subtitle:
      "Comparez les modèles grand public, ouverts et sans censure sur {{appName}}. Voyez ce que change le choix du modèle et combien coûte chaque option.",
  },
  intro: {
    lead: "ChatGPT applique les protections d’OpenAI. GPT les conserve sur {{appName}}. Pour discuter avec moins de restrictions, choisissez un autre modèle. Il peut lui aussi refuser une demande ou se tromper.",
    p2: "{{appName}} réunit {{modelCount}} modèles de chat répartis en trois catégories, avec un solde de crédits commun.",
  },
  exists: {
    title: "Existe-t-il un ChatGPT sans filtres ?",
    p1: "ChatGPT applique les protections d’OpenAI. Sur {{appName}}, elles continuent de s’appliquer lorsque vous choisissez GPT.",
    p2: "Pour discuter avec moins de restrictions, choisissez un modèle de la catégorie sans censure sur {{appName}}. Vous pouvez commencer dans votre navigateur sans créer de compte.",
  },
  tiers: {
    title: "Que veut vraiment dire « sans filtres » ?",
    intro: "Chaque modèle a un niveau de contenu. Il y en a trois.",
    mainstream:
      "Grand public ({{count}} modèles). Les protections du fournisseur s’appliquent.",
    open: "Ouverts ({{count}} modèles). Les refus dépendent du modèle.",
    uncensored:
      "Sans censure ({{count}} modèles). Ces modèles sont regroupés selon leur façon d’aborder les sujets sensibles.",
    vendorRefusals:
      "Sur {{appName}}, vous choisissez quel modèle répond. Les protections propres à ce modèle continuent de s’appliquer.",
    twoKinds:
      "Certains modèles sans censure utilisent l’ablitération ou un entraînement complémentaire pour réduire les refus. UncensoredLM a été entraîné sur des livres et des documents bannis de l’internet grand public. Il exprime ainsi des opinions politiques à contre-courant. Vérifiez ses affirmations auprès de vos sources.",
    modelsLink: "Parcourir tous les modèles par niveau de filtrage",
  },
  switch: {
    title: "Puis-je changer de modèle en pleine discussion ?",
    intro: "Oui. Vous pouvez choisir un autre modèle pour le prochain message.",
    p1: "Lorsque vous changez de modèle dans une discussion, vous gardez l’historique. Le nouveau modèle peut utiliser la partie qui tient dans sa fenêtre de contexte.",
    p2: "Vous pouvez rédiger un premier jet avec un modèle et en choisir un autre pour le retravailler dans le même chat.",
    caveat:
      "Chaque modèle applique ses propres protections au brouillon et à votre prochaine demande.",
  },
  picks: {
    title: "Quel modèle utiliser à la place de ChatGPT ?",
    intro:
      "Partez de la tâche. Chaque nom renvoie à la page du modèle, avec prix et specs.",
    builtUncensored: {
      title: "Politique et points de vue",
      body: "UncensoredLM peut offrir un autre point de vue sur les sujets politiques ou controversés. Vérifiez ses affirmations auprès de vos sources.",
    },
    everyday: {
      title: "Tâches du quotidien",
      body: "Essayez ces modèles grand public pour la rédaction, le code et l’analyse.",
    },
    open: {
      title: "Modèles ouverts pour le code et le raisonnement",
      body: "Essayez ces modèles ouverts pour programmer ou résoudre un problème. Comparez leurs réponses à la même question.",
    },
    unfiltered: {
      title: "Modèles sans censure pour l’analyse",
      body: "Essayez ces modèles pour l’analyse, le code ou les textes longs. Ils peuvent encore refuser une demande.",
    },
    fiction: {
      title: "Jeu de rôle et fiction sombre",
      body: "Pour suivre une histoire au fil des échanges, comparez les fenêtres de contexte. Vérifiez si le modèle accepte aussi les images en entrée.",
    },
    cheap: {
      title: "Modèles plus économiques",
      body: "Consultez le coût estimé sur chaque fiche. Des demandes et réponses plus longues peuvent consommer davantage de crédits.",
    },
    compare:
      "Comparez les paires disponibles selon le prix, la fenêtre de contexte et les fonctionnalités.",
    compareLink: "Comparer {{a}} et {{b}}",
    guideLink: "Lire le guide de tous les modèles non censurés",
  },
  privacy: {
    title: "Un chat IA sans filtre est-il privé ?",
    intro: "Ça dépend du dossier. Voici exactement ce qui se passe.",
    incognito:
      "Les discussions incognito sont stockées dans le stockage local de votre navigateur. La conversation n'est pas enregistrée sur nos serveurs (les médias générés sont stockés temporairement pour des raisons techniques). Effacez les données de votre navigateur et tout disparaît.",
    transit:
      "Chaque message passe tout de même par notre serveur pour rejoindre le fournisseur du modèle qui rédige la réponse. C'est le cas de toute IA hébergée. La consommation de crédits est enregistrée pour que la facturation fonctionne.",
    memory:
      "La mémoire est désactivée en incognito. La mémoire persistante nécessite un compte gratuit et le dossier privé.",
    private:
      "Les discussions privées sont enregistrées sur le serveur et visibles uniquement par votre compte. Ouvrez-les depuis n'importe quel appareil où vous êtes connecté.",
    callout:
      "En bref : l'incognito garde votre historique hors de nos serveurs. Il ne cache pas vos messages au modèle qui y répond.",
  },
  pricing: {
    title: "Combien ça coûte ?",
    intro: "Des crédits. Un seul solde pour tous les modèles.",
    free: "Gratuit : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec un compte et la newsletter. Assez pour essayer plusieurs modèles sur vos propres prompts.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    oneBalance:
      "Le même solde couvre la génération d'images, de vidéos et de musique, la saisie et la lecture vocales, et la recherche web.",
    metered:
      "Chaque message coûte des crédits selon le modèle. Les modèles flash coûtent une fraction d'un modèle de pointe. Chaque page de modèle affiche le prix.",
    link: "Voir les formules et les packs de crédits",
  },
  chatgptBetter: {
    title: "Quand ChatGPT est-il le meilleur choix ?",
    intro: "Parfois. Voici quand.",
    oneVendor:
      "Vous n'utilisez que des modèles OpenAI et ne tombez jamais sur un refus. Dans ce cas, un seul éditeur, une seule appli, un seul abonnement, c'est plus simple.",
    flatRate:
      "Vous voulez un forfait fixe sans jamais penser au coût par message. Les crédits sont décomptés à l'usage, et une utilisation quotidienne intensive des modèles de pointe finit par chiffrer.",
    firstFeatures:
      "Vous voulez les nouveautés d'un labo dès le jour de leur sortie. Les labos lancent souvent leurs nouvelles fonctionnalités d'abord dans leurs propres applis.",
    wantFilter:
      "Vous voulez le filtre. Le compte d'un enfant ou un lieu de travail aux règles strictes a besoin de garde-fous. Vous pouvez rester ici sur le niveau grand public, mais un produit verrouillé peut mieux convenir.",
  },
  limits: {
    title: "Quels sont les inconvénients ?",
    intro:
      "Sans filtres, il y a des compromis. Connaissez-les avant de changer.",
    smaller:
      "La plupart des modèles non censurés sont plus petits que les modèles de pointe. Plusieurs sont conçus pour la conversation et la fiction, pas pour l'analyse poussée. UncensoredLM est fait pour des réponses franches, pas pour le code. Sur le raisonnement le plus exigeant et les longues tâches de code, les meilleurs modèles grand public restent devant.",
    tools:
      "Tous les modèles non censurés ne prennent pas en charge les appels d'outils. Vérifiez la page du modèle avant de compter sur la recherche web ou d'autres outils.",
    vendor:
      "Les modèles grand public conservent les protections de leur fournisseur. Les modèles sans censure peuvent aussi refuser une demande.",
    responsibility:
      "Vérifiez les informations importantes avant de partager une réponse ou de prendre une décision sur cette base.",
  },
  faq: {
    filters: {
      q: "Peut-on désactiver les protections de GPT dans une alternative à ChatGPT ?",
      a: "Sur {{appName}}, GPT conserve les protections de son fournisseur. Si vous choisissez un modèle sans censure, c’est cet autre modèle qui répond, avec son propre fonctionnement.",
    },
    title: "FAQ",
    free: {
      q: "{{appName}} est-il gratuit ?",
      a: "Sans compte : {{guestCredits}} crédits gratuits par mois. Compte gratuit : {{freeCredits}}. Compte + newsletter : {{maxCredits}}. Au-delà : une formule, dès {{subPrice}} par mois.",
    },
    account: {
      q: "Ai-je besoin d'un compte ?",
      a: "Non. Le chat incognito fonctionne sans. Il vous faut un compte pour la mémoire et pour les discussions enregistrées sur le serveur.",
    },
    api: {
      q: "Puis-je utiliser ces modèles dans mes propres outils ?",
      a: "Oui. Chaque formule payante inclut une API compatible OpenAI. Une seule clé, tous les modèles, non censurés compris.",
    },
    openSource: {
      q: "{{appName}} est-il open source ?",
      a: "Oui. Le code est open source sous licences MIT et GPL v3, et vous pouvez faire tourner votre propre instance.",
    },
    apiLink: "Configurer l'API dans vos outils de code",
    selfHostLink: "Héberger votre propre instance",
  },
  partners: {
    body: "Vous animez une chaîne, une newsletter ou une communauté autour de l'IA ? Le programme partenaire {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Voir le programme partenaire",
  },
  cta: {
    title: "Choisissez un modèle et lancez la discussion",
    subtitle:
      "Commencez sans compte avec jusqu’à {{guestCredits}} crédits gratuits par mois.",
    chat: "Essayer un chat IA sans censure",
    models: "Comparer tous les modèles",
  },
};
