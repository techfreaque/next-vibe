import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API LLM non censurée : modèles abliterated | {{appName}}",
    description:
      "Modèles non censurés et abliterated via une API compatible OpenAI et Anthropic. Identifiants, prix comparés, règles de Vertex, Azure et Bedrock, code.",
    category: "Guide développeur",
    imageAlt: "API LLM non censurée avec des endpoints compatibles OpenAI",
    keywords:
      "API LLM non censurée, API IA sans censure, API modèles abliterated, LLM abliterated API, API LLM sans filtre de contenu, API compatible OpenAI non censurée, API LLM NSFW, Gemini API safety settings off, Vertex AI non censuré, Together AI non censuré, alternative non censurée à Azure OpenAI, alternative non censurée à Bedrock, modèles abliterated hébergés, alternative à l'API Venice, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "12 min de lecture",
    title: "API LLM non censurée. Votre SDK. Sans réflexe de refus.",
    subtitle:
      "{{count}} modèles non censurés derrière une seule clé compatible OpenAI et Anthropic. Identifiants, contexte et prix lus en direct dans notre registre.",
  },
  intro: {
    lead: "Votre application a besoin d'un modèle qui répond. Pas d'un modèle qui fait la morale, ni d'un modèle qui rejette la moitié de vos prompts de test. Les API grand public filtrent par conception, et faire tourner vous-même des poids abliterated, c'est louer des GPU.",
    p2: "{{appName}} sert {{count}} modèles non censurés sur les mêmes endpoints /v1 que n'importe quel modèle grand public. Changez la base URL, gardez le SDK OpenAI ou Anthropic, choisissez un identifiant non censuré. Voici la liste, le code, les prix face aux autres hébergeurs, ce que les grands clouds autorisent vraiment, et le revers honnête.",
    access:
      "D'emblée : l'API exige un compte payant. N'importe quel abonnement, à partir de {{subPrice}} par mois, la débloque. Les crédits gratuits et bonus, non.",
    accessLink: "Débloquer l'API",
  },
  models: {
    title: "{{count}} modèles non censurés dans l'API",
    intro:
      "Tous les modèles texte non censurés actuels, du moins cher au plus cher. Reprenez l'identifiant tel quel dans le champ model.",
    colModel: "Modèle",
    colId: "Identifiant",
    colContext: "Contexte",
    colTools: "Outils",
    colPrice: "Par message",
    yes: "Oui",
    no: "Non",
    footnote:
      "Par message signifie un échange de référence sur la route la moins chère. L'API facture au token, et chaque réponse indique le montant exact dans usage.credits_charged. GET /v1/models renvoie la même liste avec les prix par token.",
  },
  code: {
    title: "Une requête",
    intro:
      "Le modèle non censuré le moins cher en ce moment est {{example}}. Remplacez-le par n'importe quel identifiant du tableau.",
    prompt:
      "Donne-moi les meilleurs arguments pour et contre le nucléaire. Sans avertissement.",
    curl: "curl",
    python: "SDK Python OpenAI",
    anthropic:
      "Vous préférez le SDK Anthropic ou Claude Code ? Pointez-les vers la même base URL sans /v1 : ils appellent /v1/messages avec les mêmes modèles et la même clé.",
  },
  consent: {
    title: "La seule étape 18+",
    intro:
      "Les modèles non censurés sont réservés aux adultes. L'API le vérifie une fois.",
    where:
      "Confirmez une seule fois que vous avez 18 ans ou plus, sur la page des clés API.",
    link: "Ouvrir les clés API",
    error:
      "Sans cette confirmation, une requête vers un modèle non censuré renvoie 403 uncensored_consent_required, et rien n'est facturé.",
    once: "Ensuite, vos clés peuvent appeler les modèles non censurés.",
  },
  kinds: {
    title: "Quel modèle non censuré pour quel travail",
    intro:
      "Le tableau contient trois sortes de modèles. Ils ne se comportent pas pareil.",
    abliterated:
      "Abliterated : un modèle grand public ou ouvert dont le comportement de refus a été retiré des poids. Même entraînement, mêmes connaissances, même vision du monde. Il répond, c'est tout. Le choix par défaut pour la plupart des applications.",
    fineTuned:
      "Affiné : un modèle ouvert entraîné en plus sur des données non filtrées. Souvent plus libre dans le ton, apprécié pour la fiction et le jeu de rôle.",
    own: "{{ownModel}} : entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. À choisir quand vous voulez les positions que les modèles grand public ne donnent pas.",
    link: "Abliterated, affiné ou vision du monde propre : l'explication complète",
  },
  limits: {
    title: "Les limites à connaître",
    intro: "Les angles durs, avant la mise en production.",
    stateless:
      "Sans état. Aucune conversation n'est conservée chez nous. Envoyez l'historique complet à chaque tour.",
    maxTokens: "La sortie est plafonnée à {{maxTokens}} tokens par requête.",
    rateLimit:
      "Aucune limite de débit fixe. Facturation à la requête sur vos crédits, avec une protection anti-abus généreuse. Les 429 des fournisseurs de modèles passent avec un en-tête Retry-After.",
    tools:
      "Les appels d'outils ne marchent qu'avec les modèles qui les prennent en charge. Le tableau indique lesquels. Sinon, vous recevez 400 tools_not_supported.",
    refusals:
      "Non censuré ne veut pas dire infaillible. Un modèle peut encore refuser ou se tromper sur les faits. Testez vos prompts sur deux modèles avant de vous engager.",
  },
  privacy: {
    title: "Ce que deviennent vos prompts",
    intro: "Nous gardons la facture, pas la conversation.",
    noStore:
      "L'API ne crée aucun fil de discussion. Elle n'enregistre que la ligne de facturation : quel modèle, combien de crédits.",
    upstream:
      "Chaque prompt passe par nous jusqu'au fournisseur qui sert le modèle. Ses conditions s'appliquent à ce qu'il reçoit. Notre politique de confidentialité ne promet séparément ni absence de logs ni absence d'entraînement : jugez-nous sur ce qu'elle dit réellement.",
    callout:
      "Si vos prompts ne doivent jamais quitter votre infrastructure, faites tourner des poids abliterated sur votre propre matériel. Pour tout le reste, l'API se déploie plus vite.",
  },
  abliterated: {
    title: "API de modèles abliterated : qui sert quels poids",
    intro:
      "Les mêmes poids abliterated tournent chez plusieurs hébergeurs. Voici ce que chacun facture par token, lu aujourd'hui dans leurs listes de modèles publiques.",
    honest:
      "Lecture honnête : les routeurs gagnent sur le prix. OpenUncensored et Refuseless vendent GLM 5.3 Flash et DeepSeek V4.1 Flash abliterated à $0.12 en entrée. Notre prix affiché inclut une marge de {{markup}}%. Vous la payez pour une seule clé qui couvre modèles non censurés, ouverts et grand public, les médias, le format Anthropic et un chat que votre équipe peut utiliser.",
  },
  noFilter: {
    title:
      "API LLM sans filtre de contenu : ce que désactivé veut vraiment dire",
    intro:
      "Tous les grands clouds vous laissent abaisser un filtre. Aucun ne retire les refus appris du modèle ni sa politique d'utilisation.",
    vertex:
      "Vertex AI et l'API Gemini : les seuils de sécurité passent à OFF, et OFF est la valeur par défaut sur Vertex à partir de gemini-3.5-flash. La protection de l'enfance et les autres préjudices majeurs restent bloqués, et l'alignement de Gemini refuse encore. La Prohibited Use Policy de Google interdit les contenus sexuellement explicites et le contournement des filtres de sécurité, avec des exceptions pour le travail éducatif, documentaire, scientifique ou artistique. Poids personnels : auto-déploiement Model Garden sur des conteneurs vLLM ou TGI.",
    together:
      "Together AI : 24 modèles de chat serverless, aucun non censuré. Ses conditions interdisent les contenus obscènes et la pornographie. Vos propres poids tournent sur des endpoints dédiés à partir de $5.49 par heure de H100, et les uploads doivent être des fine-tunes d'une architecture que Together prend déjà en charge.",
    azure:
      "Azure OpenAI : filtres actifs par défaut, désactivables seulement après une demande approuvée, et le Code of Conduct interdit de toute façon les chatbots érotiques et romantiques.",
    bedrock:
      "AWS Bedrock : aucun filtre sans Guardrail attaché, mais les refus et la politique d'AWS restent. Les poids abliterated passent par Custom Model Import, facturé à la minute de capacité.",
    azureLink: "Alternatives non censurées à Azure OpenAI, en détail",
    bedrockLink: "Alternatives non censurées à AWS Bedrock, en détail",
  },
  others: {
    title: "Les autres API non censurées, sans détour",
    intro:
      "Nous ne sommes pas la seule option. Nous achetons nous-mêmes chez certains d'entre eux. Faits tirés de leur propre documentation, de leurs listes de modèles et de leurs pages de tarifs, lus le {{date}}.",
    versusLink: "{{appName}} vs {{name}} : comparaison complète",
    routerLink:
      "Quitter OpenRouter : une clé pour tous les modèles, trois formats d'API",
    openRouterAlternatives: "Alternatives à OpenRouter, comparées",
    veniceAlternatives: "Alternatives à Venice AI, comparées",
    freedomGptAlternatives: "Alternatives à FreedomGPT, comparées",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Existe-t-il une API LLM non censurée gratuite ?",
      a: "Pas chez nous. L'application de chat a des crédits gratuits, l'API non. N'importe quel abonnement, à partir de {{subPrice}} par mois, débloque les clés API. Les outils locaux comme Ollama offrent une API locale gratuite si votre matériel peut porter le modèle.",
    },
    ids: {
      q: "Quels identifiants de modèle sont non censurés ?",
      a: "{{count}} en ce moment, listés dans le tableau ci-dessus avec leur identifiant exact. GET /v1/models renvoie tous les modèles que votre clé peut appeler, avec les prix et la prise en charge des outils.",
    },
    sdk: {
      q: "L'API non censurée fonctionne-t-elle avec le SDK OpenAI ?",
      a: "Oui. Réglez base_url sur la base URL de {{appName}}, utilisez votre clé et mettez un identifiant non censuré dans le champ model. Le SDK Anthropic fonctionne aussi, avec la même base URL sans /v1.",
    },
    refuse: {
      q: "Un modèle non censuré ne refuse-t-il jamais ?",
      a: "Il refuse beaucoup moins, pas jamais. Les modèles abliterated perdent le réflexe de refus appris, mais peuvent encore décliner ou se tromper. Testez avec vos vrais prompts.",
    },
    logs: {
      q: "{{appName}} enregistre-t-il mes prompts d'API ?",
      a: "L'API n'écrit aucun fil de discussion, seulement la ligne de facturation : modèle et crédits débités. Chaque prompt passe par nous jusqu'au fournisseur qui sert le modèle, selon ses propres conditions. Notre politique de confidentialité ne promet pas séparément l'absence de logs. Si vous en avez besoin par contrat, hébergez vous-même.",
    },
    abliterated: {
      q: "Quelle API sert des modèles abliterated ?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice et {{appName}} servent tous des poids abliterated via une API compatible OpenAI. Les routeurs sont les moins chers au token. {{appName}} ajoute des modèles grand public, les médias et un chat web sur la même clé.",
    },
    noFilter: {
      q: "Existe-t-il une API LLM sans filtre de contenu ?",
      a: "Bedrock sans Guardrail et Gemini avec les réglages de sécurité sur OFF n'ajoutent aucune couche de filtre, mais leurs modèles gardent des refus appris et leurs politiques interdisent le contenu sexuel. Azure exige une demande approuvée pour désactiver les filtres. Pour des modèles qui ne refusent pas, utilisez des poids abliterated ou affinés : hébergés ici ou chez les routeurs ci-dessus, ou sur vos propres GPU.",
    },
    vertex: {
      q: "Puis-je désactiver les filtres de sécurité de Gemini ?",
      a: "Oui. Sur l'API Gemini, les catégories que vous ne réglez pas sont sur Off par défaut à partir de Gemini 2.5, et sur Vertex OFF est la valeur par défaut à partir de gemini-3.5-flash. Les préjudices majeurs comme la protection de l'enfance restent bloqués, les refus appris de Gemini restent, et la politique de Google interdit les contenus sexuellement explicites et le contournement des filtres de sécurité.",
    },
    local: {
      q: "Vaut-il mieux héberger soi-même des modèles abliterated ?",
      a: "Avec vos propres GPU et des règles strictes sur les données, oui. Un outil local expose une API compatible OpenAI sur votre machine. Si vous voulez des modèles non censurés de taille frontier sans louer de matériel, une API hébergée revient moins cher pour démarrer.",
    },
    docsLink: "Lire la référence complète de l'API",
    directoryLink: "Voir les modèles abliterated dans le chat",
  },
  cta: {
    title: "Testez d'abord. Branchez ensuite.",
    subtitle:
      "Tous les modèles du tableau tournent aussi dans l'application de chat. Testez vos prompts là-bas, puis copiez l'identifiant dans votre code.",
    chat: "Tester un modèle non censuré dans le chat",
    docs: "Lire la doc de l'API",
  },
};
