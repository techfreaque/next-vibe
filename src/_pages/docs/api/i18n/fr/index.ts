import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Documentation de l'API {{appName}} : compatible OpenAI et Anthropic",
    description:
      "Une seule URL de base, {{modelCount}} modèles de chat. Chat completions et Responses API d'OpenAI, Messages API d'Anthropic, streaming, appels d'outils. Plus images, synthèse vocale, transcription, vidéo et musique au format OpenAI. Codex CLI et Claude Code se connectent directement. Paiement en crédits.",
    category: "API",
    imageAlt: "Documentation de l'API {{appName}} compatible OpenAI",
    keywords:
      "api, compatible openai, compatible anthropic, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, appel de fonctions, api génération d'images, api synthèse vocale, api whisper, api génération vidéo, api génération musicale, {{appName}}",
  },
  toc: {
    title: "Sur cette page",
    mobileTitle: "Aller à",
    groups: {
      start: "Premiers pas",
      chat: "Chat",
      media: "Médias",
      reference: "Référence",
      integrations: "Intégrations",
    },
  },
  nav: {
    quickstart: "Démarrage rapide",
    auth: "Authentification",
    access: "Accès et tarifs",
    models: "Modèles",
    chat: "Chat completions",
    tools: "Appels d'outils",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Crédits et facturation",
    errors: "Erreurs et limites",
    codingTools: "Outils de développement",
    sdks: "Exemples SDK",
    images: "Images",
    speech: "Synthèse vocale",
    transcriptions: "Transcription",
    videos: "Vidéo",
    music: "Musique",
    mediaFiles: "Fichiers média",
  },
  hero: {
    badge: "Référence API",
    title: "Une seule URL de base.",
    titleHighlight: "Tous les modèles.",
    subtitle:
      "Branchez n'importe quel SDK OpenAI ou Anthropic sur {{appName}}. Codex CLI et Claude Code aussi. Images, voix, vidéo et musique avec la même clé. Aucun nouveau client à apprendre.",
    ctaKey: "Obtenir une clé API",
    ctaPricing: "Voir les formules",
    quickstartLink: "Démarrage rapide en 3 étapes",
    facts: {
      models: "{{modelCount}} modèles de chat",
      formats: "Formats OpenAI et Anthropic",
      streaming: "Streaming et appels d'outils",
      rate: "{{rate}} requêtes par minute par clé",
    },
  },
  code: {
    copy: "Copier",
    wrap: "Retour à la ligne",
    copied: "Copié",
    request: "Requête",
    response: "Réponse",
    stream: "Flux",
    showResponse: "Exemple de réponse",
    showStream: "Exemple de flux",
    showObject: "Objet de tâche terminé",
  },
  quickstart: {
    title: "Démarrage rapide",
    intro:
      "L'API parle le format d'échange d'OpenAI et celui d'Anthropic. Si votre code tourne avec l'un des deux, il tourne ici après deux changements : l'URL de base et la clé.",
    baseUrlLabel: "URL de base OpenAI",
    anthropicBaseUrlLabel: "URL de base Anthropic",
    anthropicBaseUrlNote:
      "Pour Claude Code et les SDK Anthropic. Sans `/v1` à la fin : ils ajoutent eux-mêmes `/v1/messages`.",
    baseUrlNote:
      "Toute locale fonctionne dans le chemin (en-US, de-DE, pl-PL). Elle ne change que la langue des messages d'erreur.",
    envLabel: "Ou définissez-la une fois pour tous les SDK OpenAI",
    step1: {
      title: "Créez une clé",
      description:
        "Ouvrez Clés API dans votre compte, nommez la clé, copiez-la. Elle ne s'affiche qu'une fois.",
      cta: "Ouvrir les clés API",
    },
    step2: {
      title: "Réglez l'URL de base",
      description:
        "Remplacez l'URL de base dans votre client. Les clients Anthropic prennent la seconde.",
    },
    step3: {
      title: "Envoyez une requête",
      description:
        "Collez-la dans un terminal, ajoutez votre clé, lancez. Le même appel en Python et en JavaScript.",
    },
  },
  access: {
    title: "Accès et tarifs",
    intro:
      "L'API utilise les mêmes crédits que l'app de chat. Pas de formule API à part, pas de frais par siège.",
    unlockTitle: "Ce qui débloque l'API",
    plan: "N'importe quelle formule, dès {{subPrice}} par mois. Chaque formule inclut des crédits mensuels.",
    grant: "Les crédits attribués par notre équipe, comme les crédits de test.",
    never:
      "Les crédits gratuits ne la débloquent jamais : allocation mensuelle, bonus d'inscription et de newsletter, gains de parrainage.",
    withoutTitle: "Sans achat",
    locked:
      "Un compte sans achat ne peut pas créer de clé, et chaque appel `/v1` renvoie HTTP 402 `paid_plan_required`.",
    topup:
      "Besoin de plus ? Les abonnés rechargent avec des packs de crédits dès {{packPrice}}. Les crédits des packs n'expirent jamais.",
    ctaUnlock: "Voir les formules",
    ctaKeys: "Ouvrir les clés API",
  },
  auth: {
    title: "Authentification",
    intro:
      "Envoyez votre clé comme jeton Bearer à chaque requête. Les clés commencent par `sk-unb-`. Les clients Anthropic l'envoient dans `x-api-key`, ce qui fonctionne aussi.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "Format OpenAI",
    headerAnthropicTab: "Format Anthropic",
    points: {
      hash: "Nous stockons une empreinte (hash), pas la clé. Si vous la perdez, créez-en une nouvelle.",
      scope:
        "Une clé fonctionne uniquement sur l'API : `/v1/models`, chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) et médias (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). Elle ne peut pas toucher à votre compte, à vos paiements ni à vos paramètres.",
      limit:
        "Jusqu'à {{maxKeys}} clés actives par compte. Révoquez une clé à tout moment : elle cesse aussitôt de fonctionner.",
      missing:
        "Sans clé ou avec une clé révoquée, la réponse est 401. Une clé sur un compte sans aucun achat renvoie 402.",
    },
  },
  models: {
    title: "Modèles",
    intro:
      "`GET /v1/models` liste les modèles que votre clé peut appeler maintenant, avec la taille du contexte, la prise en charge des outils et le prix en crédits par million de tokens. Utilisez l'id comme champ model dans vos requêtes.",
    note: "La liste dépend de votre compte. Les ids inconnus ou indisponibles renvoient 404 `model_not_found`. Une seule correspondance : sur `/v1/messages`, les ids Claude que Claude Code envoie par défaut pointent vers notre Claude le plus récent de la même famille.",
    browse: "Parcourir tous les modèles avec prix et filtres",
    media: {
      title: "Les modèles média dans la même liste",
      body: "Modèles d'image, de vidéo, de musique, de voix et de transcription figurent dans la même liste. Chaque entrée dit ce que fait le modèle et où l'appeler.",
      filename: "entrée média",
      points: {
        modality:
          "modality vaut chat, image, video, music, speech ou transcription. endpoints liste les chemins qui acceptent le modèle.",
        pricing:
          "Les prix média sont à l'unité : `credits_per_image`, `credits_per_second` (vidéo), `credits_per_clip` (musique), `credits_per_1k_characters` (voix), `credits_per_minute` (transcription).",
        anthropic:
          "Les clients Anthropic (en-tête `anthropic-version`) ne reçoivent que les modèles de chat. Les modèles dont le fournisseur n'est pas configuré chez nous ne sont pas listés et répondent 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Chat completions",
    intro:
      "Les chat completions OpenAI standard. Des messages en entrée, un message de l'assistant en sortie. Entrées texte et image (`image_url` en URL https ou en data URL base64).",
    nonStream: {
      title: "Sans streaming",
      body: "Le mode par défaut. Vous recevez un seul corps JSON quand le modèle a terminé. `usage.credits_charged` indique ce que cet appel vous a coûté.",
    },
    stream: {
      title: "Streaming",
      body: "Passez `stream: true` pour recevoir des server-sent events au format chunk d'OpenAI, terminés par `data: [DONE]`. Ajoutez `stream_options.include_usage` pour obtenir un dernier chunk avec le nombre de tokens et `credits_charged`. Fermer la connexion arrête la génération. Vous ne payez que ce qui a tourné.",
    },
    paramsTitle: "Champs de la requête",
    paramsColumns: { field: "Champ", description: "Rôle" },
    params: {
      model: "Obligatoire. Un id de modèle issu de `GET /v1/models`.",
      messages:
        "Obligatoire. Messages system, developer, user, assistant et tool. Le contenu user peut être une chaîne ou des parties text et `image_url`.",
      stream: "true pour les server-sent events. false par défaut.",
      streamOptions:
        "`{ include_usage: true }` ajoute un dernier chunk d'usage.",
      maxTokens:
        "Plafond de tokens générés. `max_completion_tokens` est prioritaire. Limité à {{maxTokens}}.",
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
        "Le modèle répond avec `tool_calls` et `finish_reason: tool_calls`. Chaque appel a un id, un nom de fonction et des arguments sous forme de chaîne JSON.",
      step3:
        "Exécutez vous-même la fonction. Ajoutez le message de l'assistant, puis un message tool par appel avec son `tool_call_id`.",
      step4: "Rappelez l'API. Le modèle utilise les résultats et répond.",
    },
    requestTitle: "1. Requête avec outils",
    responseTitle: "2. Le modèle demande un appel",
    followUpTitle: "3. Renvoyez le résultat",
    sdkTitle: "La même boucle avec le SDK Python",
    streamingTitle: "Appels d'outils en streaming",
    streamingBody:
      "Avec `stream: true`, les appels arrivent sous forme de chunks `delta.tool_calls`, repérés par index. Le premier chunk d'un index porte id et `function.name`. Les chunks suivants complètent `function.arguments`. Concaténez-les, puis parsez le JSON quand `finish_reason` vaut `tool_calls`. Tous les SDK OpenAI le font pour vous.",
    rules: {
      title: "Règles",
      support:
        "Le modèle doit prendre en charge les outils : vérifiez `supports_tools` dans `GET /v1/models`. Les autres renvoient 400 `tools_not_supported`.",
      choice:
        "`tool_choice` none, auto et required fonctionnent comme chez OpenAI. Nommer une fonction absente de tools renvoie 400.",
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
        "Coût = tokens d'entrée plus tokens de sortie au prix en crédits du modèle, indiqué par million de tokens dans `GET /v1/models`. Exception : les modèles OpenRouter. Vous payez ce que le fournisseur a réellement facturé pour l'appel, plus notre marge. Leur prix affiché est une estimation. Le chat les facture de la même manière.",
      usage:
        "Chaque réponse indique `usage.credits_charged`. Votre solde se trouve dans l'app, sous Crédits.",
      preflight:
        "Avant chaque appel, nous comparons votre solde à une estimation du pire cas. Solde insuffisant : HTTP 402 `insufficient_credits`, rien ne tourne, rien n'est facturé.",
      real: "Après l'appel, vous payez l'usage réel, pas l'estimation : le nombre de tokens annoncé par le fournisseur, ou le coût réel du fournisseur pour les modèles OpenRouter. Si un fournisseur n'indique aucun coût, l'appel est facturé au prix affiché.",
      media:
        "Les appels média se facturent de la même façon : le coût réel du fournisseur plus notre marge quand il le communique, sinon le prix listé du modèle. Images à l'unité, voix au caractère, transcription à la seconde d'audio, vidéo une fois le clip prêt, musique au clip.",
      topup:
        "Plus de crédits ? Rechargez avec un pack, renouvelez ou passez à une formule supérieure. L'appel suivant fonctionne immédiatement.",
    },
  },
  limits: {
    title: "Limites de débit",
    body: "Chaque clé autorise par défaut {{rate}} requêtes par minute. Au-delà, vous recevez HTTP 429 avec un en-tête `Retry-After` en secondes. Attendez ce délai, puis réessayez. Les limites s'appliquent par clé : répartissez les charges lourdes sur plusieurs clés.",
  },
  errors: {
    title: "Erreurs et limites",
    intro:
      "Les erreurs utilisent l'enveloppe d'OpenAI, donc les SDK lèvent leurs exceptions habituelles. Basez votre logique sur `error.code`, pas sur le message.",
    shapeTitle: "Corps d'erreur",
    shapeOpenAi: "Format OpenAI",
    shapeAnthropic: "Format Anthropic",
    codesTitle: "Codes d'erreur",
    columns: { status: "HTTP", code: "code", meaning: "Signification" },
    rows: {
      missingKey:
        "Aucune clé envoyée. Envoyez `Authorization: Bearer sk-unb-...`, ou `x-api-key`.",
      invalidKey: "Clé erronée ou révoquée.",
      paid: "Aucun achat sur le compte pour l'instant. N'importe quelle formule débloque l'accès.",
      credits: "Solde insuffisant pour cet appel. Rechargez.",
      cap: "Le solde payant est vide et le plafond quotidien de crédits gratuits est atteint. Rechargez.",
      notFound: "Le modèle n'existe pas ou ne vous est pas accessible.",
      invalid:
        "Requête invalide : paramètre non pris en charge, `tool_choice` incorrect, URL d'image invalide.",
      contentPolicy:
        "Le fournisseur média a refusé le prompt. Rien n'est facturé. Reformulez ou choisissez un autre modèle.",
      consent:
        "Les modèles non censurés demandent une confirmation unique de majorité (18+) sur votre compte. Confirmez une fois sur la page des clés API, puis relancez.",
      rate: "Plus de {{rate}} requêtes par minute pour cette clé. Lisez `Retry-After`.",
      upstream:
        "Le fournisseur du modèle a échoué. Vous pouvez réessayer sans risque. Les streams se terminent par un événement d'erreur.",
      balance:
        "Impossible de lire votre solde, donc rien n'a tourné. Réessayez.",
    },
    streamNote:
      "Les erreurs survenues en cours de stream arrivent sous forme d'événement data: avec le même objet error, suivi de `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "La Responses API d'OpenAI, le format que parle Codex CLI. Mêmes modèles, même clé, mêmes crédits et mêmes limites de débit que les chat completions.",
    request: {
      title: "Requête",
      body: "input est une chaîne ou une liste d'éléments d'entrée. instructions est le prompt système. La réponse arrive sous forme d'éléments de sortie. Tous les SDK OpenAI fournissent aussi `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Passez `stream: true` pour le flux d'événements Responses : `response.created`, les deltas de texte, puis `response.completed` avec l'usage.",
    },
    points: {
      tools:
        "Outils : function, custom et `local_shell`. Les appels du modèle reviennent sous forme d'éléments de sortie. Renvoyez chaque résultat comme élément `function_call_output` avec le même `call_id`.",
      reasoning:
        "Les modèles de raisonnement renvoient des éléments reasoning à côté de la réponse.",
      billing:
        "La facturation, les ids de modèle, les erreurs et les limites de débit fonctionnent exactement comme pour les chat completions.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "La Messages API d'Anthropic, le format que parlent Claude Code et les SDK Anthropic. Utilisez l'URL de base sans `/v1` : les clients ajoutent eux-mêmes `/v1/messages`.",
    request: {
      title: "Requête",
      body: "Requête Messages standard : model, `max_tokens`, system, messages. Blocs texte et image en entrée, blocs texte et `tool_use` en sortie.",
    },
    stream: {
      title: "Streaming",
      body: "Passez `stream: true` pour les server-sent events d'Anthropic, de `message_start` à `message_stop`.",
    },
    points: {
      auth: "Authentification : `x-api-key` ou `Authorization: Bearer`. Les deux acceptent votre clé sk-unb.",
      models:
        "Modèle : n'importe quel id de `GET /v1/models`. Les ids Anthropic que Claude Code envoie par défaut, comme `claude-sonnet-4-5-20250929`, pointent vers notre modèle Claude correspondant.",
      tools:
        "Outils : blocs `tool_use` en sortie, blocs `tool_result` en retour, comme dans l'API Anthropic.",
      billing:
        "Mêmes crédits, mêmes prix, mêmes limites de débit que tous les autres endpoints.",
    },
    countTokens: {
      title: "Compter les tokens",
      body: "`POST /v1/messages/count_tokens` compte les tokens d'entrée d'une requête Messages sans faire tourner le modèle. Claude Code l'appelle pour gérer son contexte.",
    },
  },
  images: {
    title: "Images",
    intro:
      "Format d'images OpenAI. N'importe quel modèle avec modality image dans `GET /v1/models`. Fonctionne avec le client images de chaque SDK OpenAI.",
    generate: {
      title: "Générer",
      body: "Envoyez du JSON avec ces champs. La réponse donne une url par image.",
    },
    params: {
      model:
        "Obligatoire. N'importe quel id avec modality `image` dans `GET /v1/models`.",
      prompt: "Obligatoire. Ce qu'il faut dessiner, jusqu'à 2000 caractères.",
      n: "Images par appel, de 1 à {{maxImages}}. Chacune est facturée.",
      size: "`LARGEURxHAUTEUR` comme `1024x1024`, ou `auto`. Nous prenons la taille la plus proche que le modèle sait rendre.",
      aspectRatio:
        "Notre extension : `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Prime sur size.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` et `high` demandent le niveau détaillé quand le modèle en a un.",
      responseFormat:
        "`url` (par défaut, lien signé valable 7 jours) ou `b64_json`.",
    },
    edit: {
      title: "Modifier une image",
      body: "Une image d'entrée plus un prompt. Envoyez-la dans le champ multipart image, ou via `image_url` (https ou data URL base64) en JSON. Le modèle doit accepter une image : `input_modalities` contient image. Les masques ne sont pas pris en charge ; décrivez la retouche dans le prompt.",
    },
    points: {
      size: "Nous choisissons la taille et le format les plus proches que le modèle produit.",
      format:
        "url est un lien signé vers le fichier stocké, valable 7 jours sans clé. `b64_json` renvoie les octets directement dans la réponse.",
      billing:
        "Facturé par image. `credits_charged` dans la réponse indique le coût de l'appel.",
    },
  },
  speech: {
    title: "Synthèse vocale",
    intro:
      "Du texte en entrée, des octets audio en sortie. model est un ID de voix de `GET /v1/models` (modality speech), comme `openai-nova`. La syntaxe OpenAI marche aussi : model `tts-1` avec voice nova.",
    points: {
      voices:
        "input jusqu'à {{maxChars}} caractères. speed de 0.25 à 4 sur les voix OpenAI, NanoGPT et ElevenLabs.",
      formats:
        "`response_format` mp3 (par défaut), opus, aac, flac, wav ou pcm. Les formats disponibles dépendent du fournisseur de la voix ; les autres répondent 400 avec la liste.",
      billing:
        "Facturé au caractère. L'en-tête `X-Credits-Charged` indique le coût de l'appel.",
    },
  },
  transcriptions: {
    title: "Transcription",
    intro:
      "La parole en texte, au format OpenAI Whisper. Upload multipart, le même appel SDK que vous utilisez déjà.",
    transcribe: {
      title: "Transcrire",
      body: "file jusqu'à {{maxMb}} Mo (mp3, mp4, m4a, wav, webm, ogg, flac), model comme `whisper-1`, language en option. `response_format` json, text, srt, `verbose_json` ou vtt.",
    },
    translate: {
      title: "Traduire en anglais",
      body: "`POST /v1/audio/translations` : n'importe quelle langue parlée en entrée, du texte anglais en sortie. Tourne sur `whisper-1`. Mêmes formats que la transcription.",
    },
    points: {
      billing: "Facturé à la seconde d'audio.",
    },
  },
  videos: {
    title: "Vidéo",
    intro:
      "Asynchrone, au format de l'API vidéo d'OpenAI. L'appel répond tout de suite avec une tâche. Suivez-la, puis téléchargez le MP4.",
    create: {
      title: "Lancer une tâche",
      body: "model, prompt, seconds, size ou `aspect_ratio`, resolution, `negative_prompt`. La réponse est un objet vidéo avec status queued.",
    },
    poll: {
      title: "Suivre et télécharger",
      body: "`GET /v1/videos/{id}` renvoie status (queued, `in_progress`, completed, failed), progress et, une fois terminé, une url signée. Le suivi est gratuit et ne compte pas dans la limite de débit. `GET /v1/videos/{id}/content` envoie le MP4.",
    },
    points: {
      image:
        "Image vers vidéo : envoyez `image_url` en JSON ou `input_reference` en upload multipart. Elle devient la première image du clip.",
      billing:
        "Facturé une fois la vidéo prête, à la seconde de vidéo. `credits_charged` indique le coût.",
      failed: "Une tâche échouée ne coûte rien. error en donne la raison.",
    },
  },
  music: {
    title: "Musique",
    intro:
      "Asynchrone, comme la vidéo. Lancez la tâche, suivez `GET /v1/music/{id}`, téléchargez `GET /v1/music/{id}/content`.",
    startTitle: "Lancer une tâche",
    pollTitle: "Suivre et télécharger",
    points: {
      seconds:
        "seconds : environ 8, 20 ou 30. Le modèle peut arrondir. Décrivez style, ambiance, instruments et tempo dans prompt.",
      billing:
        "Facturé au clip une fois prêt. Une tâche échouée ne coûte rien.",
    },
  },
  mediaFiles: {
    title: "Fichiers média",
    intro:
      "Chaque url d'une réponse média pointe ici. Le lien signé fonctionne sans clé pendant 7 jours : donnez-le à un navigateur ou à un utilisateur. Avec votre clé API, le même chemin fonctionne à tout moment.",
  },
  codingTools: {
    title: "Outils de développement",
    intro:
      "Une URL de base, une clé. Codex CLI et Claude Code se connectent nativement. OpenCode, Continue, Aider et Cline passent par les chat completions. Choisissez l'outil, copiez le bloc, exécutez-le.",
    keyPage:
      "La page des clés API affiche les mêmes blocs, avec votre clé déjà renseignée.",
    keyPageCta: "Les obtenir avec votre clé",
    guide: "Lire le guide des outils de développement",
  },
  sdks: {
    title: "Exemples SDK",
    intro:
      "Les SDK officiels d'OpenAI et d'Anthropic fonctionnent tels quels. Réglez l'URL de base et la clé, gardez le reste de votre code.",
    chat: "Chat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "SDK Anthropic",
    images: "Images",
    speech: "Voix",
    transcription: "Transcription",
  },
  cta: {
    title: "Construisez sur tous les modèles.",
    subtitle: "Créez une clé, pointez votre SDK ici, livrez.",
    button: "Créer une clé API",
    secondary: "Comparer les formules",
  },
};
