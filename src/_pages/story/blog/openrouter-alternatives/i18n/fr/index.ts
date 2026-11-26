import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à OpenRouter, modèles non censurés | {{appName}}",
    description:
      "Comparez OpenRouter à Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT et {{appName}}. Frais, autohébergement, filtres et confidentialité.",
    category: "Guide développeur",
    imageAlt: "Alternatives à OpenRouter pour développeurs, comparées",
    keywords:
      "alternative à OpenRouter, alternatives à OpenRouter, OpenRouter contre NanoGPT, sites comme OpenRouter, passerelle API LLM, API LLM non censurée, une clé API pour tous les modèles, API compatible OpenAI, API compatible Anthropic, modèles non censurés OpenRouter, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "9 min de lecture",
    title: "Alternatives à OpenRouter pour le routage des modèles",
    subtitle:
      "{{count}} alternatives et {{appName}} comparées : formats d'API, modèles non censurés, frais. Vérifié le {{date}}.",
  },
  intro: {
    lead: "OpenRouter donne accès à plusieurs fournisseurs avec une clé API et propose un chat web. Son offre Standard affiche 5,5 % de frais de plateforme. Comparez les autres passerelles pour héberger le routeur vous-même, affiner les limites ou changer de facturation.",
    p2: "Nous avons comparé les passerelles hébergées, les proxys autohébergés et les applis avec des modèles sans censure à partir de leur documentation et de leurs tarifs officiels. Nous sommes aussi clients d’OpenRouter. {{openRouterModels}} de nos modèles passent par ce service.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Six questions tranchent.",
    catalog:
      "Catalogue : combien de modèles, de combien de labos, et ceux que vous utilisez aujourd'hui y sont-ils ?",
    uncensored:
      "Modèles non censurés : combien ont les refus retirés, et de quel type ?",
    formats:
      "Formats : seulement OpenAI chat completions, ou aussi la Responses API et l'API Anthropic Messages qu'utilisent les agents de code ?",
    billing:
      "Facturation : prix catalogue plus frais, marge ou abonnement ? Et que se passe-t-il à solde nul ?",
    data: "Données : les prompts sont-ils stockés, journalisés ou utilisés pour l'entraînement, et est-ce en opt-in ?",
    chat: "Chat : les gens qui n'écrivent jamais de code peuvent-ils utiliser les mêmes modèles dans un navigateur ?",
  },
  table: {
    title: "Toutes, côte à côte",
  },
  us: {
    title: "{{appName}} : une clé, tous les types de modèles",
    intro:
      "{{modelCount}} modèles de chat derrière une clé, dont {{uncensored}} non censurés.",
    models:
      "Modèles : Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM et Qwen à côté de {{uncensored}} modèles non censurés. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui en fait un modèle aux opinions politiques à contre-courant.",
    formats:
      "Formats : OpenAI chat completions, OpenAI Responses API et API Anthropic Messages. N'importe quel SDK ou agent de code pointe vers une seule URL de base.",
    billing:
      "Facturation : un seul solde de crédits, notre marge de {{markup}} % sur notre prix d'achat. Votre premier achat débloque les clés API, les formules démarrent à {{apiSubPrice}} par mois.",
    chat: "Chat : les mêmes modèles dans un chat web avec dossiers, outils, génération d'images, de vidéos et de musique. Les non-développeurs de l'équipe y ont accès aussi.",
    openRouter:
      "OpenRouter inclus : {{openRouterModels}} de nos modèles passent par OpenRouter. Mêmes modèles, un seul compte avec les modèles non censurés.",
    weak: "Là où nous sommes moins bons : le catalogue d'OpenRouter est bien plus grand, il permet d'apporter vos propres clés fournisseurs et de choisir le fournisseur à chaque requête, et ses prix restent plus proches du catalogue car nous ajoutons une marge. Pour un modèle rare, OpenRouter l'a probablement.",
    codeLabel: "Migrer un client OpenAI SDK : changer l'URL de base et la clé",
    docsLink: "Doc API : endpoints, authentification et limites",
    formatsLink: "API compatible OpenAI et Anthropic, expliquée",
    toolsLink: "Une seule clé dans Claude Code, Codex CLI, Aider et d'autres",
  },
  models: {
    title: "{{apiUncensored}} modèles non censurés à appeler dès aujourd'hui",
    intro:
      "Chaque modèle non censuré de l'API, avec l'identifiant à passer dans model. Du moins cher au plus cher.",
    colModel: "Modèle",
    colId: "ID API",
    colContext: "Contexte",
    colPrice: "Par message",
    footnote:
      "Prix d'un message de référence, notre marge de {{markup}} % comprise. L'étiquette sous chaque nom indique comment le modèle a été obtenu.",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifié le {{date}}. Ce qu'est chacune, comment fonctionne son API, quels modèles elle propose et ce qu'elle coûte.",
    heading: "{{number}}. {{name}} : {{kind}}",
    api: "API :",
    models: "Modèles :",
    price: "Prix :",
    priceValue: "Gratuit : {{free}}. Payant : {{plans}}.",
    pro: "Le meilleur :",
    con: "Le hic :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} contre {{name}} : le comparatif complet",
    visit: "Visiter {{name}}",
  },
  stay: {
    title: "Quand OpenRouter reste le bon choix",
    intro: "Parfois, l'original est le meilleur outil.",
    rare: "Il vous faut un modèle de niche ou un fournisseur précis que personne d'autre de cette liste ne sert.",
    callout:
      "Beaucoup d'équipes en utilisent deux : OpenRouter pour la longue traîne, une seconde clé pour les modèles non censurés et un chat pour toute l'équipe.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à OpenRouter ?",
      a: "Tout dépend de ce qui vous manque chez OpenRouter. Beaucoup de modèles non censurés, paiement à l'usage : NanoGPT. Uniquement des modèles non censurés, clé prépayée sans compte : OpenUncensored. Les modèles maison de Venice et la confidentialité : Venice. Local et gratuit : Ollama. Modèles non censurés, ouverts et grand public plus un chat d'équipe sur une seule clé : {{appName}}.",
    },
    cheaper: {
      q: "Existe-t-il une alternative moins chère à OpenRouter ?",
      a: "Comparez le prix par modèle, pas les frais. Les API en direct des fournisseurs évitent tout intermédiaire. Entre passerelles, les prix varient selon le modèle et changent souvent. Sur {{appName}}, vous payez notre prix d'achat plus {{markup}} % de marge, et chaque page modèle affiche le prix par message.",
    },
    uncensored: {
      q: "Quelle alternative à OpenRouter propose des modèles non censurés ?",
      a: "NanoGPT, OpenUncensored, Venice, uncensored.ai, Gab AI et {{appName}} servent des modèles non censurés via API. {{appName}} en a {{apiUncensored}} sur son API en ce moment, abliterated et affinés, à côté de {{ownModel}}.",
    },
    sdk: {
      q: "Puis-je garder mon code OpenAI SDK ?",
      a: "Oui. Changez l'URL de base et la clé API, gardez le reste. Les identifiants de modèles diffèrent d'une passerelle à l'autre, remplacez-les aussi. Exemple : {{example}}.",
    },
    anthropic: {
      q: "Ça marche avec les SDK Anthropic et les agents de code ?",
      a: "Sur {{appName}}, oui : l'API Anthropic Messages tourne à côté des formats OpenAI, donc Claude Code et les autres agents se connectent avec une seule clé, modèles non censurés compris.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à OpenRouter ?",
      a: "Ollama est gratuit si votre matériel tient le modèle. OpenRouter lui-même propose des modèles gratuits avec des limites quotidiennes. {{appName}} offre des crédits de chat gratuits chaque mois, l'API se débloque avec votre premier achat.",
    },
    apiLink: "API LLM non censurée : identifiants, code et limites",
    veniceLink: "Alternatives à Venice AI, comparées",
    keysLink: "Gérer vos clés API",
  },
  cta: {
    title: "Une clé. Tous les modèles. Moins de refus.",
    subtitle:
      "Testez d'abord les modèles dans le chat : {{guestCredits}} crédits gratuits par mois, sans compte.",
    start: "Essayer un modèle non censuré",
    docs: "Lire la doc API",
  },
};
