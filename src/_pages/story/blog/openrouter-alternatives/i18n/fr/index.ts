import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives non censurées à OpenRouter, comparées | {{appName}}",
    description:
      "OpenRouter ne liste aucun modèle abliterated. Comparez OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice et {{appName}} : frais, confidentialité, API.",
    category: "Guide développeur",
    imageAlt:
      "Alternatives non censurées à OpenRouter pour les développeurs, comparées",
    keywords:
      "alternative non censurée à OpenRouter, alternative à OpenRouter, alternatives à OpenRouter, OpenRouter modèles non censurés, API de modèles abliterated, API LLM non censurée, sites comme OpenRouter, passerelle API LLM, API compatible OpenAI, API compatible Anthropic, OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, Featherless, OpenRouter vs NanoGPT, uncensored OpenRouter alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "11 min de lecture",
    title: "Alternatives non censurées à OpenRouter",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées sur la couverture non censurée, les formats d’API et les frais. Vérifié le {{date}}.",
  },
  intro: {
    lead: "OpenRouter met 477 modèles derrière une seule clé. Pour le non censuré, le rayon est maigre : 17 tunes de jeu de rôle ou non censurés, et pas un seul modèle abliterated.",
    p2: "Nous avons donc passé au crible des hébergeurs d’API non censurés, des hébergeurs de jeu de rôle à forfait fixe, des passerelles et des applis, d’après leur documentation, leurs tarifs et leurs listes de modèles. Nous achetons aussi de l’accès aux modèles chez OpenRouter : {{openRouterModels}} de nos modèles passent par lui.",
  },
  shelf: {
    title: "Ce qu’OpenRouter propose pour le non censuré",
    intro:
      "D’après sa liste publique de modèles et ses conditions, lues le {{orDate}}.",
    tunes:
      "17 modèles sur 477 correspondent à jeu de rôle ou non censuré par leur nom ou leur description : Venice Uncensored (un tune Dolphin Mistral 24B), Hermes 4 405B, Cydonia, Skyfall, Magnum v4 72B, Euryale, MythoMax et une poignée de modèles Aion RP.",
    abliterated:
      "Aucun identifiant de modèle ne contient abliterated ou uncensored. Les versions abliterated de GLM 5.3, DeepSeek V4.1 Flash et Kimi K3.1 Pro que vendent les routeurs non censurés n’y sont pas.",
    rules:
      "Règles : 18+, filtrage automatique du CSAM, sinon les conditions propres à chaque modèle. Les modèles standard continuent de refuser ce que leurs éditeurs refusent.",
    callout:
      "Besoin de poids abliterated ? OpenRouter est le mauvais routeur. Besoin de fine-tunes de jeu de rôle ? Il a un rayon correct.",
  },
  apis: {
    title: "Les alternatives d’API non censurées, une par une",
    intro:
      "Des services pensés pour l’API qui vendent des poids abliterated ou non censurés. D’après leurs propres pages, lues le {{marketDate}}.",
    visit: "Visiter {{name}}",
    openUncensored: {
      heading:
        "OpenUncensored : un routeur pour les seuls modèles non censurés",
      body: "58 modèles de texte, 20 d’image et 3 de vidéo, presque tous abliterated, routés vers Venice, NanoGPT, Refuseless et d’autres. Aucune commission sur les prix des fournisseurs, recharges dès 5 USD qui n’expirent jamais, et pas de compte : votre clé d’API est le compte. OpenAI, Responses et Anthropic Messages sur une seule URL de base.",
      catch:
        "Bémol : pas d’offre gratuite, pas de chat web (seulement une application de bureau) et des métadonnées de requêtes conservées jusqu’à deux ans.",
    },
    refuseless: {
      heading:
        "Refuseless : les versions abliterated les moins chères que nous ayons trouvées",
      body: "GLM 5.3, GLM 5.3 Flash, DeepSeek V4.1 Flash et Kimi K3.1 Pro en versions abliterated, avec 1M de contexte. DeepSeek V4.1 Flash abliterated est listé à 0,12 USD en entrée et 0,45 USD en sortie par million de tokens. Chat completions, Responses et Anthropic Messages, Claude Code compris.",
      catch:
        "Bémol : API uniquement, un e-mail vérifié est requis, et ses pages de tarifs, de confidentialité et de conditions ont bloqué notre lecteur.",
    },
    nearAi: {
      heading: "NEAR AI Cloud : des modèles abliterated en calcul confidentiel",
      body: "Attestation matérielle : ni NEAR ni l’hébergeur cloud ne peuvent lire vos prompts, d’après le service. Deux modèles abliterated : Qwen 3.8 27B à 0,04 USD en entrée et 1,35 USD en sortie par million de tokens, et DeepSeek V4.1 Flash 1017. Pas de dossier, pas de contrôle d’identité, paiement au token.",
      catch:
        "Bémol : format OpenAI uniquement, et un tout petit rayon non censuré.",
    },
    uncensoredLlmAi: {
      heading: "UncensoredLLM.ai : le plus grand catalogue non censuré",
      body: "332 modèles de chat plus 13 modèles d’image et de vidéo, avec un contrôle quotidien des refus. Formats OpenAI, Anthropic et Gemini sur une seule clé prépayée. Carte ou crypto dès 3 USD, et le solde n’expire jamais.",
      catch:
        "Bémol : ni revente ni API refacturée sans autorisation écrite. Les conditions de confidentialité n’étaient pas publiées sur les pages lues.",
    },
    abliterationAi: {
      heading:
        "abliteration.ai : ses propres modèles abliterated, la confidentialité par écrit",
      body: "Ses propres modèles abliterated aux formats OpenAI et Anthropic. Il affirme que les prompts et les sorties sont traités en mémoire, jamais stockés par défaut et jamais utilisés pour l’entraînement. Option de région UE, plus une passerelle de politiques pour vos propres règles.",
      catch:
        "Bémol : plus cher que Refuseless ou NEAR AI pour des poids similaires, et les modèles de base ne sont pas nommés.",
    },
    flatRate: {
      heading:
        "Featherless, Infermatic, Arli AI : le forfait fixe pour le jeu de rôle intensif",
      body: "Featherless liste plus de 50 000 modèles Hugging Face, dont 1 398 étiquetés abliterated, avec une offre Chat à 25 USD fixes. Infermatic vend des tunes de jeu de rôle 70B sélectionnés dès 9 USD par mois. Arli AI propose des forfaits à tokens illimités dès 15 USD avec des fine-tunes derestricted. Les trois affirment ne garder aucun journal de prompts.",
      catch:
        "Bémol : les forfaits personnels ne peuvent pas alimenter des applications, et vous avez de 1 à 6 requêtes parallèles.",
    },
    deepInfra: {
      heading: "DeepInfra : des modèles standard pas chers, aucun non censuré",
      body: "Parmi les moins chers au token pour les modèles ouverts standard : DeepSeek V4.1 Flash à 0,14 USD en entrée et 0,42 USD en sortie par million de tokens, 200 requêtes simultanées par modèle. Il affirme que les entrées d’API ne sont jamais stockées sur disque.",
      catch:
        "Bémol : aucun modèle non censuré ni de jeu de rôle dans son catalogue.",
    },
  },
  gateways: {
    title: "Si vous n’avez besoin que d’un routeur",
    intro:
      "Les passerelles routent vers les fournisseurs que vous configurez. Aucune n’ajoute de modèles non censurés.",
    vercel:
      "Vercel AI Gateway : hébergé, prix du token du fournisseur sans majoration, conçu pour l’AI SDK.",
    selfHost:
      "LiteLLM ou Bifrost : open source, auto-hébergés, avec vos propres clés de fournisseurs, budgets et fallbacks.",
    control:
      "Portkey, Cloudflare AI Gateway, Helicone : garde-fous, cache, journaux de requêtes et contrôle des dépenses en plus.",
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
    weak: "Là où nous sommes plus faibles : OpenRouter n’applique aucune majoration à l’inférence, seulement 5,5 % de frais sur les achats de crédits. Nous ajoutons {{markup}} % à ce que nous payons. Il vous laisse utiliser vos propres clés de fournisseurs, router uniquement vers des points d’accès sans rétention de données et choisir les fournisseurs à chaque requête. Nous n’avons rien de tout cela. Et les routeurs abliterated ci-dessus sont moins chers que nous sur chaque modèle que nous partageons.",
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
    title: "Les applis avec une API non censurée, une par une",
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
      a: "Cela dépend de ce qui vous manque chez OpenRouter. Des poids abliterated au prix du fournisseur : OpenUncensored, Refuseless ou NEAR AI Cloud. Le plus grand catalogue non censuré : UncensoredLLM.ai ou Featherless. Payer à l’usage en crypto : NanoGPT. Les modèles maison de Venice et ses modes de confidentialité : Venice. En local et gratuit : Ollama. Des modèles non censurés, ouverts et grand public, plus des médias et un chat d’équipe avec une seule clé : {{appName}}.",
    },
    cheaper: {
      q: "Existe-t-il une alternative moins chère à OpenRouter ?",
      a: "Comparez le prix par modèle, pas les frais. OpenRouter n’ajoute aucune majoration à l’inférence, OpenUncensored ne prend aucune commission, et Refuseless et NEAR AI Cloud listent les versions abliterated les moins chères que nous ayons trouvées. Chez {{appName}}, vous payez ce que nous payons plus {{markup}} % de marge, et chaque page de modèle affiche le prix par message.",
    },
    uncensored: {
      q: "Quelle alternative à OpenRouter propose des modèles non censurés ?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, UncensoredLLM.ai, abliteration.ai, NanoGPT, Venice, uncensored.ai, Gab AI et {{appName}} servent tous des modèles non censurés via une API. {{appName}} en a {{apiUncensored}} sur son API en ce moment, abliterated et affinés, à côté de {{ownModel}}.",
    },
    sdk: {
      q: "Puis-je garder mon code OpenAI SDK ?",
      a: "Oui. Changez l'URL de base et la clé API, gardez le reste. Les identifiants de modèles diffèrent d'une passerelle à l'autre, remplacez-les aussi. Exemple : {{example}}.",
    },
    anthropic: {
      q: "Ça marche avec les SDK Anthropic et les agents de code ?",
      a: "Chez {{appName}}, oui : l’API Anthropic Messages tourne à côté des formats OpenAI, si bien que Claude Code et d’autres agents se connectent avec une seule clé, modèles non censurés compris. OpenUncensored, Refuseless, NanoGPT et UncensoredLLM.ai parlent aussi Anthropic Messages. Venice n’a pas de point d’accès natif et envoie Claude Code vers un proxy local.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à OpenRouter ?",
      a: "Ollama est gratuit si votre matériel tient le modèle. OpenRouter lui-même propose 11 modèles gratuits avec des limites quotidiennes, et Infermatic a une offre web gratuite. {{appName}} offre des crédits de chat gratuits chaque mois, l’API se débloque avec votre premier achat.",
    },
    apiLink: "API LLM non censurée : identifiants, code et limites",
    veniceLink: "Alternatives à Venice AI, comparées",
    nanoGptLink: "Alternatives à NanoGPT, comparées",
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
