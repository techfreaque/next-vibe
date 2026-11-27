import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternative non censurée à Azure OpenAI : API comparées | {{appName}}",
    description:
      "Azure filtre tout modèle par défaut et bannit les chatbots érotiques ou romantiques, même sans filtres. Alternatives : {{appName}}, Venice, API abliterated.",
    category: "Guide développeur",
    imageAlt: "Alternatives non censurées à Azure OpenAI, comparées",
    keywords:
      "alternative non censurée à Azure OpenAI, alternative à Azure OpenAI, désactiver le filtre de contenu Azure OpenAI, Azure OpenAI sans filtre de contenu, filtrage de contenu modifié Azure, désactiver l'abuse monitoring Azure, Azure OpenAI NSFW, API LLM sans filtre de contenu, API LLM non censurée, API modèles abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "10 min de lecture",
    title: "Alternatives non censurées à Azure OpenAI",
    subtitle:
      "Les filtres d'Azure, sa barrière d'approbation et son Code of Conduct, lus à la source. Puis {{count}} alternatives, honnêtes sur ce que chacune fait mieux. Vérifié le {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI filtre chaque modèle par défaut. Désactiver le filtre exige une demande approuvée. Et même approuvé, le Code of Conduct interdit toujours les chatbots érotiques et romantiques.",
    p2: "Si votre produit, c'est de la fiction, du jeu de rôle, des compagnons, du red-teaming ou simplement des réponses franches, c'est un mur, pas un réglage. Voici exactement ce qu'Azure autorise, ce qui le remplace, et le changement de code pour faire passer un client Azure OpenAI sur {{appName}}.",
  },
  azure: {
    title: "Ce qu'Azure filtre vraiment",
    intro: "Directement tiré des docs et politiques de Microsoft.",
    defaults:
      "Actif par défaut : Microsoft Foundry applique des réglages de sécurité par défaut à chaque modèle sauf Whisper. Vous pouvez seul les assouplir jusqu'à High only.",
    approval:
      "Désactivé uniquement sur approbation : les options No filters et Annotate only exigent une approbation pour le filtrage de contenu modifié. Seuls les clients gérés par une équipe de compte Microsoft ou relevant d'un programme éligible peuvent en faire la demande.",
    conduct:
      "Désactivé ne veut pas dire autorisé : le Code of Conduct interdit les contenus sexuellement explicites, y compris les contenus suggestifs et fétichistes, et bannit les chatbots érotiques, romantiques ou utilisés à des fins érotiques ou romantiques. La violence graphique, le gore et les discours de haine sont également interdits.",
    monitoring:
      "Abuse monitoring : les prompts et complétions signalés passent par défaut en revue automatisée, puis par le personnel de Microsoft si nécessaire. Les données restent dans un abuse monitoring store situé dans la zone géographique de votre ressource.",
    sunset:
      "Fin de l'opt-out : le journal des modifications de Microsoft du 17 novembre 2026 indique que Modified Abuse Monitoring ne sera plus disponible pour les modèles publiés à partir du 1 novembre 2026, à une date encore à annoncer.",
    models:
      "Aucun modèle non censuré : nous n'avons trouvé aucun modèle abliterated ou non censuré dans le catalogue. Des modèles DeepSeek et Llama sont listés, aucun n'est abliterated.",
    callout:
      "En clair : sur Azure, une application de fiction pour adultes ou de compagnons enfreint le Code of Conduct, quels que soient vos réglages de filtre.",
  },
  rules: {
    title:
      "Azure, Bedrock, Vertex et Together : ce que désactivé veut vraiment dire",
    intro:
      "Tous les hyperscalers vous laissent abaisser un filtre quelque part. Aucun ne change la politique d'utilisation, et aucun ne livre de poids non censurés.",
  },
  us: {
    title:
      "{{appName}} : des modèles non censurés sur une API OpenAI et Anthropic",
    intro:
      "{{modelCount}} modèles de chat derrière une seule clé, dont {{uncensored}} non censurés. Aucune couche de filtre au-dessus du modèle que vous choisissez.",
    models:
      "Modèles : Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM et Qwen à côté de {{uncensored}} modèles non censurés. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, résultat : un modèle aux opinions politiques à contre-courant.",
    formats:
      "Formats : OpenAI chat completions, l'API OpenAI Responses et l'API Anthropic Messages, plus image, vidéo, musique, voix et transcription avec la même clé.",
    consent:
      "Règles : les modèles non censurés se débloquent après un consentement 18+ unique sur votre compte. Pas de demande, pas d'équipe de compte.",
    billing:
      "Facturation : un seul solde de crédits, notre marge de {{markup}}% sur ce que nous payons en amont. N'importe quel abonnement à partir de {{apiSubPrice}} par mois débloque les clés API. Carte, PayPal ou crypto.",
    limits:
      "Limites : {{burst}} requêtes par minute et {{streams}} flux simultanés par clé comme plafond anti-abus. Les limites de débit en amont passent telles quelles.",
    weak: "Là où Azure nous bat : nous n'avons ni rapport SOC 2, ni BAA, ni SLA, ni choix de région. Chaque prompt passe par nous jusqu'au fournisseur qui sert le modèle. Notre marge de {{markup}}% nous rend plus chers au token que les routeurs abliterated ci-dessous. Pas d'endpoint d'embeddings non plus.",
    before: "Avant : le client Azure OpenAI",
    after: "Après : le même SDK, pointé vers {{appName}}",
    codeNote:
      "Trois choses changent. AzureOpenAI devient OpenAI avec une base_url. Le nom de votre déploiement devient un identifiant de modèle. Et content_filter_results disparaît des réponses, car il n'y a aucune couche de filtre à signaler.",
    docsLink: "Docs API : endpoints, authentification et limites",
    formatsLink: "API compatible OpenAI et Anthropic, expliquée",
    toolsLink: "Une seule clé dans Claude Code, Codex CLI, Aider et plus",
  },
  models: {
    title: "{{apiUncensored}} modèles non censurés dans l'API aujourd'hui",
    intro:
      "Chaque modèle non censuré que vous pouvez appeler, avec l'identifiant à passer dans model. Du moins cher au plus cher.",
    colModel: "Modèle",
    colId: "Identifiant API",
    colContext: "Contexte",
    colPrice: "Par message",
  },
  prices: {
    title: "Prix par token, le nôtre contre les hébergeurs les moins chers",
    intro:
      "Mêmes poids, hébergeurs différents. Nous ne sommes pas les moins chers au token. Vous payez pour une seule clé qui couvre modèles non censurés, ouverts et grand public, plus un chat web.",
  },
  list: {
    title: "Les alternatives, une par une",
    intro:
      "Tiré de leurs propres pages et listes de modèles, lues le {{date}}. Ce que c'est, où chacune gagne, et le revers.",
  },
  stay: {
    title: "Quand rester sur Azure",
    intro:
      "Parfois, le filtre est le prix de la paperasse dont vous avez besoin.",
    compliance:
      "Vous avez besoin de programmes de conformité, d'une résidence régionale des données et d'une équipe de compte. Les hyperscalers vendent cela. Bedrock, par exemple, liste ISO, SOC, CSA STAR, l'éligibilité HIPAA et FedRAMP High dans GovCloud.",
    privacy:
      "Vous avez besoin des conditions de données de Microsoft : les prompts et complétions ne sont pas accessibles à OpenAI et ne servent pas à entraîner des modèles de fondation sans votre autorisation.",
    sfw: "Votre produit est de toute façon tout public. Alors les réglages par défaut d'Azure vous coûtent peu.",
    callout:
      "Beaucoup d'équipes se partagent : Azure pour la charge réglementée, une deuxième clé pour la fiction, le jeu de rôle, la recherche et le red-teaming.",
  },
  faq: {
    title: "FAQ",
    off: {
      q: "Puis-je désactiver le filtre de contenu d'Azure OpenAI ?",
      a: "Seulement avec approbation. Les clients peuvent assouplir eux-mêmes les filtres jusqu'à High only. No filters et Annotate only exigent une demande approuvée de filtrage de contenu modifié, ouverte aux clients gérés par une équipe de compte Microsoft ou relevant d'un programme éligible.",
    },
    nsfw: {
      q: "Azure OpenAI autorise-t-il le NSFW ou les applications de compagnons avec les filtres désactivés ?",
      a: "Non. Le Code of Conduct de Microsoft interdit les contenus sexuellement explicites et bannit les chatbots érotiques ou romantiques. Les réglages de filtre ne changent pas le Code of Conduct.",
    },
    monitoring: {
      q: "Puis-je encore refuser l'abuse monitoring d'Azure ?",
      a: "Les clients approuvés le pouvaient. Le journal des modifications de Microsoft du 17 novembre 2026 indique que Modified Abuse Monitoring ne sera plus disponible pour les modèles publiés à partir du 1 novembre 2026, à une date encore à annoncer.",
    },
    best: {
      q: "Quelle est la meilleure alternative non censurée à Azure OpenAI ?",
      a: "Tokens abliterated les moins chers : OpenUncensored ou Refuseless. Énorme catalogue grand public : OpenRouter. Modèles non censurés maison de Venice : Venice. Prompts qui ne quittent jamais vos machines : Ollama, LM Studio ou vLLM. Modèles non censurés, ouverts et grand public plus un chat d'équipe sur une seule clé OpenAI et Anthropic : {{appName}}.",
    },
    sdk: {
      q: "Puis-je garder mon code SDK Azure OpenAI ?",
      a: "En grande partie. Remplacez AzureOpenAI par OpenAI, réglez base_url et votre clé, puis remplacez le nom du déploiement par un identifiant de modèle comme {{example}}. Les requêtes et réponses gardent la forme OpenAI.",
    },
    enterprise: {
      q: "{{appName}} propose-t-il SOC 2, un BAA ou un SLA ?",
      a: "Non. Si vous en avez besoin, gardez la charge réglementée chez un hyperscaler et utilisez {{appName}} là où les filtres gênent.",
    },
    apiLink: "API LLM non censurée : identifiants, code et limites",
    bedrockLink: "Alternatives non censurées à AWS Bedrock",
    openRouterLink: "Alternatives à OpenRouter, comparées",
    keysLink: "Gérer vos clés API",
  },
  cta: {
    title: "Même SDK. Aucune couche de filtre.",
    subtitle:
      "Testez d'abord les modèles dans le chat, {{guestCredits}} crédits gratuits par mois, sans compte. Branchez ensuite l'API.",
    start: "Essayer un modèle non censuré",
    docs: "Lire la doc de l'API",
  },
};
