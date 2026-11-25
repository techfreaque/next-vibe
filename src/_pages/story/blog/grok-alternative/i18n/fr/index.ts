import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à Grok : moins de filtres, même chat | {{appName}}",
    description:
      "Alternatives à Grok pour la recherche web, les médias et le chat avec moins de refus : {{appName}}, Perplexity, Gemini, Venice et des applis locales.",
    category: "Comparatif",
    imageAlt: "Grok à côté d'alternatives non censurées",
    keywords:
      "alternative à Grok, alternatives à Grok, Grok non censuré, Grok est-il censuré, Grok sans compte X, Grok contre IA non censurée, sites comme Grok, Grok Imagine, IA sans filtre, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "7 min de lecture",
    title: "Alternatives à Grok pour la recherche, les médias et le chat",
    subtitle:
      "Comparez Grok à des assistants de recherche, des applis de création et des modèles qui refusent moins de demandes.",
  },
  intro: {
    lead: "Grok peut chercher sur X et sur le web, discuter à voix haute et générer des images et des vidéos. Ses règles d’utilisation fixent des limites. La meilleure alternative dépend des fonctions que vous utilisez le plus.",
    p2: "Ici : ce que Grok fait ou refuse, les alternatives classées selon ce que vous voulez vraiment, et comment garder {{grokName}} tout en ajoutant des modèles sans refus, dans un même fil. {{appName}} fait tourner {{grokName}} à côté de {{uncensored}} modèles non censurés.",
  },
  honest: {
    title: "Fonctions et limites de Grok",
    intro: "Le ton de la conversation et les règles d’utilisation.",
    looser:
      "Style. Grok propose le chat écrit et vocal. Le ton dépend du modèle et du mode choisis.",
    filtered:
      "Toujours filtré. xAI garde une politique d'utilisation et un entraînement de sécurité. Certaines demandes sont encore refusées, adoucies ou détournées.",
    shifts:
      "Les mises à jour des modèles et des règles peuvent modifier les réponses. Essayez les fonctions qui vous importent avec vos demandes habituelles.",
    catalog:
      "Notre catalogue classe {{grokName}} dans le niveau {{grokTier}}. Les règles du fournisseur s’appliquent toujours.",
    callout:
      "Vérifiez les fonctions du produit, les règles du fournisseur et le modèle que vous comptez utiliser.",
  },
  why: {
    title: "Pourquoi chercher une alternative à Grok",
    intro: "Trois raisons reviennent sans cesse.",
    policy:
      "Les règles. Le mordant de Grok dépend des réglages du moment chez xAI. Qui a besoin d'un comportement stable veut un modèle dont les refus ont été retirés des poids, pas assouplis dans un prompt.",
    account:
      "Le compte. Les applis de Grok vivent dans l'écosystème de X et de xAI. Tout le monde ne veut pas lier ses conversations à ce compte.",
    voice:
      "Une seule voix. Grok a une personnalité. Parfaite pour la répartie, mauvaise pour une réponse technique froide, le méchant d'un roman ou un point de vue qu'on lui a appris à éviter.",
  },
  alternatives: {
    title: "{{count}} alternatives à Grok, selon ce que vous voulez",
    intro:
      "Toutes tournent dans le même chat que Grok. Prix par message de référence, en direct depuis notre catalogue.",
    edge: {
      title: "Plus de mordant, même intelligence : {{model}}",
      body: "Un modèle grand public légèrement modifié pour ne plus esquiver les questions : abliterated. Fort en raisonnement et en code, il répond là où Grok refuse. {{price}} le message.",
    },
    reasoning: {
      title: "Raisonnement lourd, zéro sermon : {{model}}",
      body: "Le Kimi phare de Moonshot AI, abliterated. Des réponses longues et soignées sur les problèmes difficiles, refus retirés. {{price}} le message.",
    },
    cheap: {
      title: "Rapide et pas cher : {{model}}",
      body: "DeepSeek sans les refus. Vif, bon en code et en analyse, presque gratuit. {{price}} le message.",
    },
    contrary: {
      title: "À contre-courant, exprès : {{model}}",
      body: "{{model}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui en fait un modèle aux opinions politiques à contre-courant. Pas réglé pour faire le malin. Conçu pour contredire. {{price}} le message.",
    },
    roleplay: {
      title: "Personnages et fiction sombre : {{model}}",
      body: "Affiné pour le jeu de rôle. Reste dans son personnage, joue les scènes sombres et ne brise pas le quatrième mur pour vous mettre en garde. {{price}} le message.",
    },
    chatLink: "Discuter avec {{model}}",
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
  },
  models: {
    title: "Grok et les alternatives, côte à côte",
    intro: "Sous chaque nom : le niveau de contenu ou la méthode de décensure.",
    colModel: "Modèle",
    colContext: "Contexte",
    colStrengths: "Points forts",
    colPrice: "Par message",
    colChat: "Essayer",
    chatLink: "Discuter avec {{model}}",
    footnote:
      "Prix d'un message de référence, notre marge de {{markup}} % comprise.",
  },
  keep: {
    title: "Gardez Grok. Ajoutez le reste.",
    intro:
      "Pas besoin de choisir. {{grokName}} et les modèles non censurés partagent un chat et un solde.",
    steps: {
      ask: {
        title: "Commencez avec Grok",
        body: "Ouvrez un chat avec {{grokName}}. Répartie, avis sur l'actu, réponses rapides.",
      },
      switch: {
        title: "Changez quand il se dérobe",
        body: "Choisissez un modèle non censuré pour le message suivant. Toute la conversation suit, il répond donc en contexte.",
      },
      compare: {
        title: "Comparez sur le même prompt",
        body: "Envoyez un prompt aux deux et lisez les réponses côte à côte. Les pages comparatives ci-dessous donnent les caractéristiques.",
      },
    },
    compareLink: "{{a}} contre {{b}}",
  },
  imagine: {
    title: "Grok Imagine tourne aussi ici",
    intro:
      "{{imagineNames}} : les modèles d'image et de vidéo de xAI, avec les mêmes crédits. Sans compte X.",
    link: "Créer avec {{model}}",
  },
  faq: {
    title: "FAQ",
    uncensored: {
      q: "Grok est-il non censuré ?",
      a: "Non. Grok est plus détendu que ChatGPT ou Claude, mais xAI garde une politique d'utilisation et un entraînement de sécurité, et change souvent son comportement. Les modèles non censurés, eux, ont le comportement de refus retiré des poids.",
    },
    best: {
      q: "Quelle est la meilleure alternative à Grok ?",
      a: "Tout dépend de la tâche. Même intelligence, moins de refus : un modèle abliterated comme {{firstName}}. Des opinions à rebours du courant dominant : {{ownModel}}. Jeu de rôle : un modèle affiné pour le jeu de rôle. Tous tournent sur {{appName}} à côté de Grok, dans un même chat.",
    },
    account: {
      q: "Puis-je utiliser Grok sans compte X ?",
      a: "Oui, ici. {{grokName}} tourne dans le chat incognito de {{appName}}, sans aucun compte. {{guestCredits}} crédits gratuits par mois pour commencer.",
    },
    price: {
      q: "Combien coûte Grok ici ?",
      a: "Pas d'abonnement à part. Vous payez au message depuis un seul solde de crédits. Un message de référence avec {{grokName}} coûte {{grokPrice}}.",
    },
    api: {
      q: "Puis-je utiliser Grok et des modèles non censurés via une seule API ?",
      a: "Oui. Des endpoints compatibles OpenAI et Anthropic, une clé pour Grok, Claude, GPT et les modèles non censurés. Votre premier achat débloque les clés API, les formules démarrent à {{apiSubPrice}} par mois.",
    },
    imagine: {
      q: "Puis-je créer des images et des vidéos Grok Imagine ici ?",
      a: "Oui. {{imagineNames}} tournent sur les pages de création et depuis n'importe quel chat, facturés sur les mêmes crédits.",
    },
    chatLink: "Chat IA non censuré : choisissez un modèle et lancez-vous",
    chatgptLink: "Alternative à ChatGPT sans filtre",
    refusalLink: "Refusal Index : qui répond, qui refuse",
  },
  cta: {
    title: "L'aplomb de Grok, c'était le début. Pas la limite.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Commencez avec {{firstName}}.",
    start: "Lancer un chat non censuré",
    models: "Comparer tous les modèles",
  },
};
