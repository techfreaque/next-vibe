import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "{{modelCount}} modèles, une seule API compatible OpenAI et Anthropic | {{appName}}",
    description:
      "Une clé {{appName}} pour {{modelCount}} modèles. Chat completions OpenAI, Responses API et Anthropic Messages sur un seul endpoint. Compatible Claude Code et Codex CLI.",
    category: "Guide développeur",
    imageAlt: "{{appName}} : un seul endpoint d'API pour tous les modèles",
    keywords:
      "{{appName}}, alternative à OpenRouter, une API pour GPT Claude Gemini, API compatible OpenAI, API compatible OpenAI multi-modèles, endpoint compatible API Anthropic, Anthropic Messages API, Responses API, utiliser Claude Code avec d'autres modèles, fournisseur personnalisé Codex CLI, passerelle API LLM, API de modèles non censurés",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "11 min de lecture",
    title: "Une clé d'API. {{modelCount}} modèles. Trois formats.",
    subtitle:
      "{{appName}} parle les chat completions OpenAI, la Responses API d'OpenAI et l'Anthropic Messages API sur un seul endpoint. Votre SDK reste. Vos outils restent. Seule l'URL de base change.",
  },
  intro: {
    lead: "GPT chez OpenAI, Claude chez Anthropic, Gemini chez Google. Trois SDK, trois clés, trois factures, trois tableaux de bord. Ou pire : l'outil que vous aimez ne parle qu'un format, donc il n'a accès qu'aux modèles d'un seul fournisseur.",
    p2: "{{appName}} réunit {{modelCount}} modèles de chat de {{providerCount}} labos derrière une seule clé et un seul solde de crédits. Appelez-les au format OpenAI, au format Responses ou au format Anthropic. Les mêmes modèles sur chaque endpoint. Voici précisément comment ça marche, ce que ça coûte, et quand passer en direct ou par un routeur est le meilleur choix.",
    access:
      "Disons-le d'emblée : l'API demande un compte payant. N'importe quelle formule ({{subPrice}} par mois) ou un pack de crédits unique ({{packPrice}}) la débloque. Les crédits gratuits et les crédits bonus, non.",
    accessLink: "Débloquer l'API",
  },
  endpoints: {
    title: "Cinq endpoints, une seule clé",
    intro:
      "Chaque endpoint prend la même clé, débite le même solde et sert les mêmes modèles.",
    chat: "POST /v1/chat/completions : OpenAI Chat Completions. Streaming SSE qui se termine par data: [DONE], stream_options.include_usage, appels d'outils. Le format que parle presque tout client compatible OpenAI.",
    responses:
      "POST /v1/responses : la Responses API d'OpenAI, le format de Codex CLI. Streaming et outils. Sans état : store vaut false et previous_response_id est refusé avec un 400, envoyez donc l'entrée complète à chaque tour.",
    messages:
      "POST /v1/messages : l'Anthropic Messages API. Streaming et utilisation d'outils. C'est à elle que parlent Claude Code et les SDK Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens : ne coûte aucun crédit. Une estimation locale, sans appel de modèle, qui ne compte pas dans votre limite de requêtes par minute. Claude Code l'appelle en permanence pour dimensionner son contexte.",
    models:
      "GET /v1/models : tous les modèles que votre clé peut appeler maintenant, avec longueur de contexte, support des outils et prix. Un seul corps de réponse, lisible par les SDK OpenAI comme Anthropic.",
    auth: "L'authentification fonctionne de deux façons, sur chaque endpoint. Authorization: Bearer sk-unb-... pour les clients OpenAI et pour Claude Code avec ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... pour les SDK Anthropic. Les clés commencent par sk-unb-, s'affichent une seule fois et ne sont stockées que sous forme de hash. Créez-les dans Paramètres > Clés d'API, jusqu'à 20 clés actives par compte.",
    baseUrlLabel: "URL de base",
    baseUrlNote:
      "Pour les SDK OpenAI et les outils de type OpenAI. La locale fait partie du chemin. Elle ne règle que la langue des messages d'erreur, et toute locale prise en charge fonctionne, mais elle doit être présente.",
    anthropicBaseUrlLabel: "URL de base Anthropic",
    anthropicBaseUrlNote:
      "Pour les SDK Anthropic et Claude Code. Même URL sans /v1 : ils ajoutent eux-mêmes /v1/messages.",
  },
  samples: {
    title: "Code : votre SDK, notre URL de base",
    intro:
      "Aucune nouvelle bibliothèque cliente. Les SDK officiels OpenAI et Anthropic fonctionnent tels quels. Remplacez sk-unb-YOUR_KEY par votre clé.",
    curl: {
      title: "curl",
      body: "La preuve la plus rapide que votre clé fonctionne. Une chat completion toute simple, rien à installer.",
      caption: "Chat completions avec curl",
    },
    openai: {
      title: "SDK Python OpenAI",
      body: "Définissez base_url et api_key sur le client, puis appelez chat.completions.create comme d'habitude. N'importe quel modèle de GET /v1/models va dans le champ model, Claude et Gemini compris.",
      caption: "Chat completions avec le SDK OpenAI",
      responses:
        "Le même client parle aussi la Responses API. Appelez client.responses.create. Rappel : ici, elle est sans état. Passez toute la conversation en input à chaque tour.",
      responsesCaption: "Responses API avec le SDK OpenAI",
    },
    anthropic: {
      title: "SDK Python Anthropic",
      body: "Définissez base_url sans /v1 et votre clé comme api_key, puis appelez messages.create. Les modèles de raisonnement placent d'abord un bloc thinking : l'exemple affiche donc le bloc text, pas le premier bloc.",
      caption: "Messages API avec le SDK Anthropic",
      countTokens:
        "Besoin d'une taille avant d'envoyer ? count_tokens renvoie une estimation sans appeler de modèle. Aucun crédit dépensé.",
      countTokensCaption: "Compter les tokens avec curl",
    },
    models: {
      title: "Lister les modèles",
      body: "GET /v1/models fait foi. Il montre exactement quels ids votre clé peut appeler, avec longueur de contexte, support des outils et prix par token.",
      caption: "Lister les modèles avec curl",
    },
  },
  ids: {
    title: "Ids de modèles : les nôtres ou ceux du fournisseur",
    intro:
      "Inutile de réécrire les configs qui nomment déjà un modèle. Nous acceptons les graphies courantes.",
    ours: "Nos ids, tels que GET /v1/models les liste : claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Utilisez-les si vous partez de zéro.",
    vendor:
      "Les graphies des fournisseurs marchent aussi. Les ids Anthropic datés (claude-sonnet-4-5-20250929 devient claude-sonnet-4.5), les numéros de version avec tirets, les suffixes -latest, le suffixe de contexte [1m] et les ids à points comme gpt-5.5.",
    prefix:
      "Les préfixes de fournisseur comme anthropic/... ou openai/..., pour que les ids façon OpenRouter d'une config existante continuent de fonctionner.",
    claudeFallback:
      "Sur /v1/messages uniquement : un id Claude que votre compte ne peut pas appeler, comme les ids intégrés que Claude Code envoie pour ses appels en arrière-plan, bascule sur le Claude le plus récent de la même famille (Opus, Sonnet ou Haiku) auquel vous avez accès. Claude Code fonctionne sans variable d'environnement supplémentaire. Tout autre id inconnu renvoie 404 model_not_found.",
  },
  tools: {
    title: "Utiliser Claude Code et Codex CLI avec d'autres modèles",
    intro:
      "Les deux se connectent directement. Pas de proxy, pas de couche de traduction, rien à installer.",
    p1: "Chaque extrait utilise {{model}} par défaut. Il a passé de vrais tests sous Claude Code et Codex CLI, appelle les outils de façon fiable et coûte peu par token de sortie. Remplacez-le par n'importe quel id une fois que tout fonctionne.",
    claudeCode:
      "Voilà toute la réponse pour utiliser Claude Code avec d'autres modèles. ANTHROPIC_BASE_URL le fait pointer chez nous, ANTHROPIC_AUTH_TOKEN porte votre clé, et les variables de modèle décident de ce qui tourne. Remplacez l'id du modèle par n'importe quel id de GET /v1/models : GPT, Gemini, Kimi, DeepSeek ou un modèle non censuré. CLAUDE_CODE_MAX_CONTEXT_TOKENS est réglé sur la vraie fenêtre de contexte du modèle, pour que Claude Code compacte au bon moment.",
    codex:
      "Codex CLI reçoit un fournisseur de modèle personnalisé avec wire_api réglé sur responses. Il nous parle en Responses API exactement comme à OpenAI. Changez de modèle avec -m.",
    others:
      "OpenCode, Continue, Aider et Cline fonctionnent aussi, tous testés. Leurs configurations, les fichiers de config permanents et les pièges que nous avons rencontrés sont dans le guide des outils de code.",
    guideLink: "Configurer tous les outils de code",
  },
  picks: {
    title: "Quel modèle pour quelle tâche",
    intro:
      "Tous les modèles ci-dessous prennent en charge les appels d'outils. Cliquez sur un nom pour voir son prix et ses specs, copiez l'id dans votre code.",
    frontier: {
      title: "Frontière : le code et le raisonnement les plus durs",
      body: "Gros refactorings, codebases inconnues, longues chaînes de raisonnement. Prix par token plus élevé, moins de fausses pistes.",
    },
    cheap: {
      title: "Bon marché et rapides : boucles, volume, appels de fond",
      body: "Boucles d'agents qui envoient de gros prompts, traitements par lots, classification, les appels de fond que les outils de code lancent toute la journée. Une fraction des prix des modèles de pointe.",
    },
    uncensored: {
      title: "Non censurés : pas de refus réflexe",
      body: "GLM 5.3 Uncensored et Qwen 3.6 Plus Uncensored sont des modèles grand public dont on a retiré les refus. UncensoredLM v1.2 est différent : entraîné sur des livres et des documents bannis de l'internet grand public, pas seulement un modèle débridé. Même API, mêmes outils.",
    },
    compare:
      "Vous hésitez entre deux ? Les pages de comparaison mettent deux modèles côte à côte.",
    compareLink: "{{a}} vs {{b}}",
    allModels: "Les {{modelCount}} modèles",
  },
  billing: {
    title: "Ce que ça coûte",
    intro: "Des crédits, facturés au token. Aucuns frais par siège.",
    price:
      "La plupart des modèles sont facturés à leur prix par token affiché, plus notre marge. Les tokens d'entrée en cache sont facturés au prix cache du modèle. Les modèles servis via OpenRouter sont facturés au coût réel qu'OpenRouter a facturé pour l'appel, plus la même marge.",
    reported:
      "Chaque réponse indique usage.credits_charged. Vous n'avez jamais à deviner ce qu'un appel a coûté.",
    preflight:
      "Avant qu'un appel ne parte, votre solde est comparé à une estimation du pire cas. S'il ne suffit pas, vous recevez HTTP 402 insufficient_credits : rien ne s'exécute, rien n'est facturé.",
    abort:
      "Streaming : fermez la connexion et la génération s'arrête. Vous ne payez que ce qui a tourné. Pareil si le fournisseur lâche en plein stream.",
    chat: "Le chat et l'API sont facturés de la même manière. OpenRouter répartit un modèle sur plusieurs hébergeurs, et certains sont plus chers que le moins cher que nous affichons. Pour ces modèles, le prix affiché est donc une estimation, et usage.credits_charged donne le vrai chiffre. Si OpenRouter ne remonte aucun coût pour un appel, il est facturé au prix affiché.",
    paid: "Le même solde de crédits que l'application de chat, qui couvre aussi l'image, la vidéo, la musique, la voix et la recherche web. L'API elle-même demande un compte payant : un abonnement actif ou au moins un pack de crédits. Les crédits gratuits ne la débloquent pas.",
    sub: "Abonnement : {{subCredits}} crédits par mois pour {{subPrice}}.",
    pack: "Pack de crédits : {{packCredits}} crédits pour {{packPrice}}. Les packs n'expirent jamais. Paiement par carte ou en crypto.",
    link: "Voir les formules et les prix",
  },
  versus: {
    title: "En direct, via un routeur ou chez nous ?",
    intro: "Trois options honnêtes. Chacune est la bonne pour quelqu'un.",
    direct: {
      title: "En direct chez OpenAI, Anthropic ou Google",
      body: "Les nouveautés maison y arrivent en premier. Pas de marge d'intermédiaire. Les conditions d'un seul fournisseur à lire. Si vous n'utilisez que les modèles d'un seul fournisseur, allez en direct.",
    },
    router: {
      title: "Un agrégateur comme OpenRouter",
      body: "Beaucoup de modèles, paiement à l'usage. En toute transparence : une bonne partie de nos modèles est servie via OpenRouter. Si le simple routage vous suffit, allez-y.",
    },
    here: {
      title: "{{appName}}",
      body: "Une clé pour trois formats : chat completions, Responses et Anthropic Messages avec count_tokens. Claude Code et Codex CLI se connectent sans proxy. Les modèles non censurés côtoient les modèles grand public, derrière une confirmation 18+ unique. Le même solde paie l'application de chat et l'API, en crédits d'abonnement ou en packs. Et {{appName}} est open source et auto-hébergeable.",
    },
    verdict:
      "En résumé : un seul fournisseur, allez en direct. Du routage simple au format OpenAI, un routeur fait l'affaire. Vous voulez Claude Code, Codex CLI et les SDK OpenAI et Anthropic sur une seule clé, modèles non censurés compris, avec une application de chat sur le même solde ? C'est pour ça que nous l'avons construit.",
  },
  limits: {
    title: "Les limites à connaître",
    intro: "Pas de surprise en production. Voici les arêtes vives.",
    stateless:
      "Sans état. La Responses API tourne avec store à false et refuse previous_response_id. Envoyez l'historique complet à chaque tour. Cela vaut pour tous les endpoints.",
    maxTokens: "La sortie est plafonnée à {{maxTokens}} tokens par requête.",
    rateLimit:
      "{{rateLimit}} requêtes par minute et par clé par défaut. Au-delà, vous recevez un 429 avec un en-tête Retry-After. Les agents qui multiplient les appels méritent leur propre clé.",
    countTokens:
      "count_tokens est une estimation, pas le tokenizer exact du fournisseur. Parfait pour dimensionner le contexte, pas pour les calculs de facturation.",
    tools:
      "Les appels d'outils ne fonctionnent qu'avec les modèles qui les prennent en charge. Sinon, vous recevez 400 tools_not_supported. GET /v1/models indique supports_tools pour chaque modèle.",
    consent:
      "Les modèles non censurés demandent une confirmation 18+ unique sur la page des clés d'API. Sans elle, vous recevez 403 uncensored_consent_required, et rien n'est facturé.",
    localeUrl:
      "Les deux erreurs de configuration classiques, toutes deux en 404. Un : oublier la locale dans le chemin. L'URL de base est /api/<locale>/v1, pas /api/v1. Deux : garder /v1 dans l'URL de base Anthropic. Claude Code et les SDK Anthropic ajoutent eux-mêmes /v1/messages, donc /v1 en double et plus rien n'est trouvé.",
  },
  privacy: {
    title: "Ce que deviennent vos prompts",
    intro: "En bref : nous gardons la facture, pas la conversation.",
    noStore:
      "L'API n'enregistre aucune conversation et ne crée aucun fil. Ce qui reste chez nous, c'est la ligne de facturation : quel modèle, combien de crédits.",
    upstream:
      "Votre prompt part chez le fournisseur qui sert le modèle. Ses conditions s'appliquent à ce qu'il reçoit.",
    incognito:
      "Dans l'application de chat, les discussions incognito vivent uniquement dans le stockage local de votre navigateur, pas sur nos serveurs.",
    selfHost:
      "Envie d'un contrôle total ? {{appName}} est open source (MIT et GPL v3). Faites tourner votre propre instance avec vos propres clés de fournisseurs et payez-les directement.",
    selfHostLink: "L'auto-héberger",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "{{appName}} est-il une alternative à OpenRouter ?",
      a: "Pour beaucoup d'usages, oui : une clé, beaucoup de modèles, paiement au token. Les différences : {{appName}} parle nativement l'Anthropic Messages API et la Responses API d'OpenAI, pas seulement les chat completions. Il propose des modèles non censurés. Et l'application de chat tourne sur le même solde. Une bonne partie de nos modèles passe par OpenRouter en coulisses.",
    },
    claudeCode: {
      q: "Puis-je utiliser Claude Code avec des modèles autres que Claude ?",
      a: "Oui. Réglez ANTHROPIC_BASE_URL sur l'URL de base Anthropic de {{appName}}, mettez votre clé dans ANTHROPIC_AUTH_TOKEN et choisissez n'importe quel id de modèle dans GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek et les modèles non censurés tournent tous dans Claude Code de cette façon.",
    },
    sdk: {
      q: "Ai-je besoin d'un nouveau SDK ?",
      a: "Non. Utilisez les SDK officiels OpenAI et Anthropic. Changez l'URL de base et la clé. Rien d'autre.",
    },
    free: {
      q: "Existe-t-il une offre gratuite pour l'API ?",
      a: "Non. L'application de chat offre des crédits gratuits, l'API non. Elle demande un abonnement ({{subCredits}} crédits par mois pour {{subPrice}}) ou un pack de crédits ({{packCredits}} crédits pour {{packPrice}}). Un pack acheté une fois garde l'API active jusqu'à épuisement du solde.",
    },
    pricing: {
      q: "Le prix affiché est-il celui que je paie ?",
      a: "Pour la plupart des modèles, oui : prix par token affiché plus notre marge. Les modèles servis via OpenRouter sont facturés au coût réel qu'OpenRouter a facturé pour l'appel, plus la même marge, dans l'application de chat comme sur l'API. Leur prix affiché est une estimation. Chaque réponse indique le montant exact dans usage.credits_charged.",
    },
    models: {
      q: "Quels modèles puis-je appeler ?",
      a: "{{modelCount}} modèles de chat à ce jour : Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen et des modèles non censurés. GET /v1/models liste exactement ce que votre clé peut appeler, avec les prix.",
    },
    data: {
      q: "{{appName}} stocke-t-il mes prompts ?",
      a: "Pas via l'API. Aucune conversation n'est stockée, seulement la ligne de facturation : modèle et crédits débités. Le fournisseur qui sert le modèle voit bien le prompt, selon ses propres conditions.",
    },
    docsLink: "Lire la référence complète de l'API",
    pricingLink: "Voir les formules et les prix",
  },
  partners: {
    body: "Vous créez des outils ou du contenu pour les développeurs ? Le programme partenaire {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Rejoindre le programme partenaire",
  },
  cta: {
    title: "Une clé. Tous les modèles. Lancez-vous.",
    subtitle:
      "Créez une clé, changez une URL de base, gardez votre SDK. La documentation de l'API couvre chaque endpoint, chaque champ et chaque code d'erreur.",
    key: "Créer une clé d'API",
    docs: "Lire la doc de l'API",
  },
};
