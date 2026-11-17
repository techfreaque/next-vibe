import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Documentation de l'API {{appName}} : compatible OpenAI et Anthropic",
    description:
      "Une seule URL de base, {{modelCount}} modèles. Chat completions et Responses API d'OpenAI, Messages API d'Anthropic, streaming, appels d'outils. Codex CLI et Claude Code se connectent directement. Paiement au token, en crédits.",
    category: "API",
    imageAlt: "Documentation de l'API {{appName}} compatible OpenAI",
    keywords:
      "api, compatible openai, compatible anthropic, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, appel de fonctions, {{appName}}",
  },
  nav: {
    quickstart: "Démarrage rapide",
    auth: "Authentification",
    models: "Modèles",
    chat: "Chat completions",
    tools: "Appels d'outils",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Crédits et facturation",
    limits: "Limites de débit",
    errors: "Erreurs",
    codingTools: "Outils de développement",
  },
  hero: {
    badge: "Compatible OpenAI et Anthropic",
    title: "Une seule URL de base.",
    titleHighlight: "Tous les modèles.",
    subtitle:
      "Branchez n'importe quel SDK OpenAI ou Anthropic sur {{appName}}. Codex CLI et Claude Code aussi. {{modelCount}} modèles, streaming, appels d'outils. Votre clé, vos crédits, aucun nouveau client à apprendre.",
    ctaKey: "Obtenir une clé API",
    ctaPricing: "Voir les formules",
  },
  quickstart: {
    title: "Appelez un modèle en 60 secondes",
    intro:
      "L'API parle le format d'échange d'OpenAI et celui d'Anthropic. Si votre code tourne avec l'un des deux, il tourne ici après deux changements : l'URL de base et la clé.",
    baseUrlLabel: "URL de base",
    anthropicBaseUrlLabel: "URL de base Anthropic",
    anthropicBaseUrlNote:
      "Pour Claude Code et les SDK Anthropic. Même URL sans /v1 : ils ajoutent eux-mêmes /v1/messages.",
    baseUrlNote:
      "Toute locale fonctionne dans le chemin (en-US, de-DE, pl-PL). Elle ne change que la langue des messages d'erreur.",
    step1: {
      title: "Obtenez une clé",
      description:
        "Créez une clé sk-unb dans Paramètres > Clés API. Elle n'est affichée qu'une fois.",
    },
    step2: {
      title: "Envoyez une requête",
      description: "Du HTTP simple. Fonctionne depuis n'importe quel langage.",
    },
    step3: {
      title: "Ou utilisez un SDK OpenAI",
      description: "Changez baseURL et apiKey. Rien d'autre.",
      python: "Python",
      node: "Node.js",
    },
  },
  access: {
    title: "Compte payant requis",
    body: "Les clés et les appels /v1 nécessitent un compte payant : n'importe quelle formule, dès {{subPrice}} par mois. Les comptes gratuits peuvent créer des clés et lire cette documentation, mais chaque appel renvoie HTTP 402 paid_plan_required jusqu'au premier achat. Les crédits gratuits et les crédits bonus ne débloquent pas l'API. Chaque formule inclut des crédits mensuels. Besoin de plus ? Les abonnés rechargent avec des packs de crédits qui n'expirent jamais.",
    cta: "Débloquer l'API",
  },
  auth: {
    title: "Authentification",
    intro:
      "Envoyez votre clé comme jeton Bearer à chaque requête. Les clés commencent par sk-unb-. Les clients Anthropic l'envoient dans x-api-key, ce qui fonctionne aussi.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    points: {
      hash: "Nous stockons une empreinte (hash), pas la clé. Si vous la perdez, créez-en une nouvelle.",
      scope:
        "Une clé fonctionne uniquement sur l'API : /v1/models, /v1/chat/completions, /v1/responses et /v1/messages. Elle ne peut pas toucher à votre compte, à vos paiements ni à vos paramètres.",
      limit:
        "Jusqu'à 20 clés actives par compte. Révoquez une clé à tout moment : elle cesse aussitôt de fonctionner.",
      missing:
        "Sans clé ou avec une clé révoquée, la réponse est 401. Une clé dont le compte n'a pas de formule payante renvoie 402.",
    },
  },
  models: {
    title: "GET /v1/models",
    intro:
      "Liste les modèles que votre clé peut appeler maintenant, avec la taille du contexte, la prise en charge des outils et le prix en crédits par million de tokens. Utilisez l'id comme champ model dans vos requêtes.",
    note: "La liste dépend de votre compte. Les ids inconnus ou indisponibles renvoient 404 model_not_found. Une seule correspondance : sur /v1/messages, les ids Claude que Claude Code envoie par défaut pointent vers notre Claude le plus récent de la même famille.",
  },
  chat: {
    title: "POST /v1/chat/completions",
    intro:
      "Les chat completions OpenAI standard. Des messages en entrée, un message de l'assistant en sortie. Entrées texte et image (image_url en URL https ou en data URL base64).",
    nonStream: {
      title: "Sans streaming",
      body: "Le mode par défaut. Vous recevez un seul corps JSON quand le modèle a terminé. usage.credits_charged indique ce que cet appel vous a coûté.",
    },
    stream: {
      title: "Streaming",
      body: "Passez stream: true pour recevoir des server-sent events au format chunk d'OpenAI, terminés par data: [DONE]. Ajoutez stream_options.include_usage pour obtenir un dernier chunk avec le nombre de tokens et credits_charged. Fermer la connexion arrête la génération. Vous ne payez que ce qui a tourné.",
    },
    paramsTitle: "Champs de la requête",
    paramsColumns: { field: "Champ", description: "Rôle" },
    params: {
      model: "Obligatoire. Un id de modèle issu de GET /v1/models.",
      messages:
        "Obligatoire. Messages system, developer, user, assistant et tool. Le contenu user peut être une chaîne ou des parties text et image_url.",
      stream: "true pour les server-sent events. false par défaut.",
      streamOptions: "{ include_usage: true } ajoute un dernier chunk d'usage.",
      maxTokens:
        "Plafond de tokens générés. max_completion_tokens est prioritaire. Limité à 32768.",
      temperature:
        "De 0 à 2. Ignoré par les modèles qui ne le prennent pas en charge.",
      topP: "De 0 à 1.",
      stop: "Une chaîne d'arrêt ou une liste de chaînes.",
      n: "Seul 1 est pris en charge. Toute autre valeur renvoie 400.",
      tools: "Les fonctions que le modèle peut appeler. Voir Appels d'outils.",
      toolChoice: "none, auto, required, ou une fonction nommée.",
    },
  },
  tools: {
    title: "Appels d'outils",
    intro:
      "Le function calling fonctionne comme chez OpenAI. Vous décrivez des fonctions, le modèle décide d'en appeler une, vous l'exécutez et renvoyez le résultat. Nous n'exécutons jamais vos outils.",
    flow: {
      title: "La boucle",
      step1: "Envoyez tools avec vos messages.",
      step2:
        "Le modèle répond avec tool_calls et finish_reason: tool_calls. Chaque appel a un id, un nom de fonction et des arguments sous forme de chaîne JSON.",
      step3:
        "Exécutez vous-même la fonction. Ajoutez le message de l'assistant, puis un message tool par appel avec son tool_call_id.",
      step4: "Rappelez l'API. Le modèle utilise les résultats et répond.",
    },
    requestTitle: "1. Requête avec outils",
    responseTitle: "2. Le modèle demande un appel",
    followUpTitle: "3. Renvoyez le résultat",
    sdkTitle: "La même boucle avec le SDK Python",
    streamingTitle: "Appels d'outils en streaming",
    streamingBody:
      "Avec stream: true, les appels arrivent sous forme de chunks delta.tool_calls, repérés par index. Le premier chunk d'un index porte id et function.name. Les chunks suivants complètent function.arguments. Concaténez-les, puis parsez le JSON quand finish_reason vaut tool_calls. Tous les SDK OpenAI le font pour vous.",
    rules: {
      title: "Règles",
      support:
        "Le modèle doit prendre en charge les outils : vérifiez supports_tools dans GET /v1/models. Les autres renvoient 400 tools_not_supported.",
      choice:
        "tool_choice none, auto et required fonctionnent comme chez OpenAI. Nommer une fonction absente de tools renvoie 400.",
      names:
        "Noms de fonction : lettres, chiffres, tiret bas, tiret, 64 caractères maximum.",
      billing:
        "Les définitions et les résultats d'outils sont des tokens d'entrée. Les appels sont des tokens de sortie. Ils sont facturés comme tous les autres tokens.",
    },
  },
  billing: {
    title: "Crédits et facturation",
    intro:
      "L'API puise dans les mêmes crédits que l'app de chat, facturés selon les mêmes règles. Un seul solde, une seule facture.",
    points: {
      price:
        "Coût = tokens d'entrée plus tokens de sortie au prix en crédits du modèle, indiqué par million de tokens dans GET /v1/models. Exception : les modèles OpenRouter. Vous payez ce que le fournisseur a réellement facturé pour l'appel, plus notre marge. Leur prix affiché est une estimation. Le chat les facture de la même manière.",
      usage:
        "Chaque réponse indique usage.credits_charged. Votre solde se trouve dans l'app, sous Crédits.",
      preflight:
        "Avant chaque appel, nous comparons votre solde à une estimation du pire cas. Solde insuffisant : HTTP 402 insufficient_credits, rien ne tourne, rien n'est facturé.",
      real: "Après l'appel, vous payez l'usage réel, pas l'estimation : le nombre de tokens annoncé par le fournisseur, ou le coût réel du fournisseur pour les modèles OpenRouter. Si un fournisseur n'indique aucun coût, l'appel est facturé au prix affiché.",
      topup:
        "Plus de crédits ? Rechargez avec un pack, renouvelez ou passez à une formule supérieure. L'appel suivant fonctionne immédiatement.",
    },
  },
  limits: {
    title: "Limites de débit",
    body: "Chaque clé autorise par défaut 60 requêtes par minute. Au-delà, vous recevez HTTP 429 avec un en-tête Retry-After en secondes. Attendez ce délai, puis réessayez. Les limites s'appliquent par clé : répartissez les charges lourdes sur plusieurs clés.",
  },
  errors: {
    title: "Erreurs",
    intro:
      "Les erreurs utilisent l'enveloppe d'OpenAI, donc les SDK lèvent leurs exceptions habituelles. Basez votre logique sur error.code, pas sur le message.",
    columns: { status: "HTTP", code: "code", meaning: "Signification" },
    rows: {
      missingKey:
        "Aucune clé envoyée. Envoyez Authorization: Bearer sk-unb-..., ou x-api-key.",
      invalidKey: "Clé erronée ou révoquée.",
      paid: "Aucune formule ni aucun achat de crédits sur le compte pour l'instant. N'importe quelle formule débloque l'accès.",
      credits: "Solde insuffisant pour cet appel. Rechargez.",
      cap: "Le solde payant est vide et le plafond quotidien de crédits gratuits est atteint. Rechargez.",
      notFound: "Le modèle n'existe pas ou ne vous est pas accessible.",
      invalid:
        "Requête invalide : paramètre non pris en charge, tool_choice incorrect, URL d'image invalide.",
      rate: "Plus de 60 requêtes par minute pour cette clé. Lisez Retry-After.",
      upstream:
        "Le fournisseur du modèle a échoué. Vous pouvez réessayer sans risque. Les streams se terminent par un événement d'erreur.",
      balance:
        "Impossible de lire votre solde, donc rien n'a tourné. Réessayez.",
    },
    streamNote:
      "Les erreurs survenues en cours de stream arrivent sous forme d'événement data: avec le même objet error, suivi de data: [DONE].",
  },
  responses: {
    title: "POST /v1/responses",
    intro:
      "La Responses API d'OpenAI, le format que parle Codex CLI. Mêmes modèles, même clé, mêmes crédits et mêmes limites de débit que les chat completions.",
    request: {
      title: "Requête",
      body: "input est une chaîne ou une liste d'éléments d'entrée. instructions est le prompt système. La réponse arrive sous forme d'éléments de sortie. Tous les SDK OpenAI fournissent aussi output_text.",
    },
    stream: {
      title: "Streaming",
      body: "Passez stream: true pour le flux d'événements Responses : response.created, les deltas de texte, puis response.completed avec l'usage.",
    },
    points: {
      tools:
        "Outils : function, custom et local_shell. Les appels du modèle reviennent sous forme d'éléments de sortie. Renvoyez chaque résultat comme élément function_call_output avec le même call_id.",
      reasoning:
        "Les modèles de raisonnement renvoient des éléments reasoning à côté de la réponse.",
      billing:
        "La facturation, les ids de modèle, les erreurs et les limites de débit fonctionnent exactement comme pour les chat completions.",
    },
    sdkTitle: "Avec le SDK Python d'OpenAI",
  },
  messages: {
    title: "POST /v1/messages",
    intro:
      "La Messages API d'Anthropic, le format que parlent Claude Code et les SDK Anthropic. Utilisez l'URL de base sans /v1 : les clients ajoutent eux-mêmes /v1/messages.",
    request: {
      title: "Requête",
      body: "Requête Messages standard : model, max_tokens, system, messages. Blocs texte et image en entrée, blocs texte et tool_use en sortie.",
    },
    stream: {
      title: "Streaming",
      body: "Passez stream: true pour les server-sent events d'Anthropic, de message_start à message_stop.",
    },
    points: {
      auth: "Authentification : x-api-key ou Authorization: Bearer. Les deux acceptent votre clé sk-unb.",
      models:
        "Modèle : n'importe quel id de GET /v1/models. Les ids Anthropic que Claude Code envoie par défaut, comme claude-sonnet-4-5-20250929, pointent vers notre modèle Claude correspondant.",
      tools:
        "Outils : blocs tool_use en sortie, blocs tool_result en retour, comme dans l'API Anthropic.",
      billing:
        "Mêmes crédits, mêmes prix, mêmes limites de débit que tous les autres endpoints.",
    },
    countTokens: {
      title: "POST /v1/messages/count_tokens",
      body: "Compte les tokens d'entrée d'une requête Messages sans faire tourner le modèle. Claude Code l'appelle pour gérer son contexte.",
    },
    sdkTitle: "Avec le SDK Python d'Anthropic",
  },
  codingTools: {
    title: "Utilisez-la dans votre agent de code",
    intro:
      "Une URL de base, une clé. Codex CLI et Claude Code se connectent nativement. OpenCode, Continue, Aider et Cline passent par les chat completions. Copiez un bloc, exécutez-le.",
    keyPage:
      "La page des clés API affiche les mêmes blocs, avec votre clé déjà renseignée.",
    keyPageCta: "Les obtenir avec votre clé",
    guide: "Lire le guide des outils de développement",
  },
  cta: {
    title: "Construisez sur tous les modèles.",
    subtitle: "Créez une clé, pointez votre SDK ici, livrez.",
    button: "Créer une clé API",
    secondary: "Comparer les formules",
  },
};
