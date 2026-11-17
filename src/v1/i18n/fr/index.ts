import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",

  tags: {
    api: "API compatible OpenAI",
  },

  openai: {
    missingKey:
      "Clé API manquante. Envoyez-la sous la forme 'Authorization: Bearer <key>' ou 'x-api-key: <key>'. Créez une clé dans Paramètres > Clés API.",
    invalidKey:
      "Clé API invalide ou révoquée. Vérifiez la clé ou créez-en une nouvelle dans Paramètres > Clés API.",
    authUnavailable:
      "Impossible de vérifier votre clé API pour le moment. Votre clé n'a pas été rejetée. Réessayez dans {{seconds}} s.",
    modelNotFound:
      "Le modèle '{{model}}' n'existe pas ou ne vous est pas accessible. Listez vos modèles avec GET /v1/models.",
    paidRequired:
      "L'API nécessite un compte payant : n'importe quelle formule, dès {{subPrice}} par mois. Choisissez-la sur {{url}}.",
    toolsUnsupportedByModel:
      "Ce modèle ne prend pas en charge les appels d'outils. Choisissez un modèle compatible ou retirez 'tools'.",
    badToolArguments:
      "Les arguments de l'appel d'outil '{{name}}' ne sont pas du JSON valide.",
    toolChoiceUnknown:
      "tool_choice désigne '{{name}}', qui ne figure pas dans 'tools'.",
    toolMessageNeedsId: "Le message tool {{param}} nécessite un tool_call_id.",
    nUnsupported: "Seul n=1 est pris en charge.",
    badImageUrl:
      "image_url doit être une URL http(s) ou une data: URL en base64.",
    insufficientCredits:
      "Crédits insuffisants. Cet appel nécessite environ {{cost}}, vous avez {{balance}}. Rechargez pour continuer.",
    rateLimited:
      "Limite de débit atteinte : {{limit}} requêtes par minute pour cette clé. Réessayez dans {{seconds}} s.",
    upstreamFailed: "Le fournisseur du modèle a échoué : {{error}}",
    balanceCheckFailed:
      "Impossible de vérifier votre solde de crédits. Rien n'a été exécuté. Réessayez.",
  },

  models: {
    get: {
      title: "Modèles compatibles OpenAI",
      titleShort: "Modèles v1",
      description:
        "Liste les modèles que votre clé API peut appeler. Format de liste OpenAI. Authentifiez-vous avec Authorization: Bearer <key>.",
      response: { object: "Type d'objet" },
      success: {
        title: "Modèles listés",
        description: "Les modèles disponibles pour cette clé API",
      },
    },
  },

  completions: {
    post: {
      title: "Chat completions compatibles OpenAI",
      titleShort: "Chat completions v1",
      description:
        "Appelez n'importe quel modèle au format chat completions d'OpenAI. Facturé sur vos crédits aux prix du chat. Prend en charge stream: true.",
      fields: {
        model: {
          label: "Modèle",
          description: "ID du modèle issu de GET /v1/models",
        },
        messages: {
          label: "Messages",
          description: "Tableau de messages OpenAI (system, user, assistant)",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events",
        },
        streamOptions: {
          label: "Options de streaming",
          description:
            "{ include_usage: true } ajoute un dernier chunk d'usage",
        },
        maxTokens: {
          label: "Tokens max",
          description: "Plafond de tokens générés",
        },
        maxCompletionTokens: {
          label: "Tokens de complétion max",
          description: "Identique à max_tokens ; prioritaire",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage, de 0 à 2",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        stop: {
          label: "Arrêt",
          description: "Séquence d'arrêt ou liste de séquences",
        },
        n: {
          label: "Choix",
          description: "Seul 1 est pris en charge",
        },
        tools: {
          label: "Outils",
          description:
            "Fonctions OpenAI que le modèle peut appeler : [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Choix d'outil",
          description:
            "none, auto, required, ou {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Appels d'outils parallèles",
          description: "Accepté pour compatibilité ; le modèle décide",
        },
      },
      response: { object: "Type d'objet" },
      success: {
        title: "Complétion créée",
        description: "Le modèle a répondu",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id n'est pas pris en charge : les réponses ne sont pas stockées. Envoyez la conversation complète dans 'input' avec store: false (Codex CLI le fait par défaut).",
    badInputItem:
      "{{param}} est inutilisable : les images doivent être des URL http(s) ou des data: URL en base64, et les éléments d'outil nécessitent un call_id.",
    post: {
      title: "Responses API d'OpenAI",
      titleShort: "Responses v1",
      description:
        "Appelez n'importe quel modèle au format Responses d'OpenAI, celui que parle Codex CLI. Sans état : envoyez la conversation complète dans input. Prend en charge le streaming, les outils function, custom et local_shell, ainsi que les éléments reasoning.",
      fields: {
        model: {
          label: "Modèle",
          description: "ID du modèle issu de GET /v1/models",
        },
        input: {
          label: "Entrée",
          description:
            "Une chaîne, ou la conversation sous forme d'éléments Responses (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instructions",
          description: "Instructions système pour le modèle",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events Responses",
        },
        tools: {
          label: "Outils",
          description:
            "Outils function, custom et local_shell. Les outils hébergés (web_search, ...) sont ignorés.",
        },
        toolChoice: {
          label: "Choix d'outil",
          description: "none, auto, required, ou {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Appels d'outils parallèles",
          description: "Accepté pour compatibilité ; le modèle décide",
        },
        maxOutputTokens: {
          label: "Tokens de sortie max",
          description: "Plafond de tokens générés",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage, de 0 à 2",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        reasoning: {
          label: "Raisonnement",
          description:
            "Accepté pour compatibilité. Les modèles de raisonnement renvoient des éléments reasoning dans tous les cas.",
        },
        text: {
          label: "Format du texte",
          description:
            "{format:{type:'json_schema', schema}} demande une sortie JSON",
        },
        store: {
          label: "Stockage",
          description: "Les réponses ne sont jamais stockées ; envoyez false",
        },
        previousResponseId: {
          label: "ID de la réponse précédente",
          description:
            "Non pris en charge : envoyez plutôt la conversation complète",
        },
        include: {
          label: "Inclure",
          description:
            "Accepté pour compatibilité. Les éléments reasoning portent toujours encrypted_content pour la relecture.",
        },
      },
      response: { object: "Type d'objet" },
      success: {
        title: "Réponse créée",
        description: "Le modèle a répondu",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} contient un bloc de contenu inutilisable : les images doivent être en base64 ou des URL http(s).",
    post: {
      title: "Messages API d'Anthropic",
      titleShort: "Messages v1",
      description:
        "Appelez n'importe quel modèle au format Messages d'Anthropic, celui que parle Claude Code. Clé dans x-api-key ou Authorization: Bearer. Prend en charge le streaming, les outils et les blocs thinking.",
      fields: {
        model: {
          label: "Modèle",
          description:
            "ID du modèle issu de GET /v1/models. Les ids Claude comme claude-sonnet-4-5-20250929 pointent vers notre modèle Claude correspondant.",
        },
        messages: {
          label: "Messages",
          description:
            "Messages Anthropic : tours user et assistant avec des blocs text, image, tool_use, tool_result et thinking",
        },
        system: {
          label: "Système",
          description: "Prompt système : une chaîne ou des blocs de texte",
        },
        maxTokens: {
          label: "Tokens max",
          description: "Plafond de tokens générés",
        },
        stream: {
          label: "Streaming",
          description: "Envoyer la réponse en server-sent events Anthropic",
        },
        tools: {
          label: "Outils",
          description:
            "Outils client : [{name, description, input_schema}]. Les outils serveur (web_search, ...) sont ignorés.",
        },
        toolChoice: {
          label: "Choix d'outil",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Séquences d'arrêt",
          description: "Chaînes qui terminent la réponse",
        },
        temperature: {
          label: "Température",
          description: "Température d'échantillonnage",
        },
        topP: {
          label: "Top P",
          description: "Échantillonnage nucleus, de 0 à 1",
        },
        thinking: {
          label: "Réflexion",
          description:
            "Accepté pour compatibilité. Les modèles de raisonnement renvoient des blocs thinking dans tous les cas.",
        },
      },
      response: { type: "Type d'objet" },
      success: { title: "Message créé", description: "Le modèle a répondu" },
    },
  },

  countTokens: {
    post: {
      title: "Comptage de tokens Anthropic",
      titleShort: "Comptage de tokens v1",
      description:
        "Estime les tokens d'entrée d'une requête Messages d'Anthropic. Aucun appel au modèle, aucun crédit consommé.",
      fields: {
        action: { label: "Action", description: "Toujours count_tokens" },
        model: { label: "Modèle", description: "ID du modèle" },
        messages: { label: "Messages", description: "Messages Anthropic" },
        system: { label: "Système", description: "Prompt système" },
        tools: { label: "Outils", description: "Définitions d'outils" },
      },
      response: { inputTokens: "Tokens d'entrée" },
      success: {
        title: "Tokens comptés",
        description: "Tokens d'entrée estimés",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "Génération d'images compatible OpenAI",
        titleShort: "v1 images",
        description:
          "Générez des images avec n'importe quel modèle d'image de GET /v1/models. Format d'images OpenAI : url (signée, valable 7 jours) ou b64_json. Facturé par image.",
        success: {
          title: "Images générées",
          description: "Les images sont stockées et liées",
        },
      },
      edits: {
        title: "Retouche d'image compatible OpenAI",
        titleShort: "v1 retouche d'image",
        description:
          "Retouchez une image avec un prompt, sur un modèle qui accepte une image en entrée. Envoyez-la en multipart 'image' ou via 'image_url'. Facturé par image.",
        success: {
          title: "Image retouchée",
          description: "L'image retouchée est stockée et liée",
        },
      },
    },
    speech: {
      title: "Synthèse vocale compatible OpenAI",
      titleShort: "v1 voix",
      description:
        "Transformez du texte en voix. Renvoie les octets audio (mp3 par défaut). Facturé au caractère.",
      success: { title: "Voix générée", description: "Le fichier audio" },
    },
    transcriptions: {
      title: "Transcription compatible OpenAI",
      titleShort: "v1 transcriptions",
      description:
        "Transcrivez un fichier audio (multipart 'file', jusqu'à 25 Mo). JSON, texte, SRT, WebVTT ou JSON détaillé avec segments. Facturé à la seconde d'audio.",
      success: {
        title: "Audio transcrit",
        description: "La transcription",
      },
    },
    translations: {
      title: "Traduction audio compatible OpenAI",
      titleShort: "v1 traductions",
      description:
        "Transformez un fichier audio directement en texte anglais avec Whisper. Mêmes formats et même facturation que la transcription.",
      success: {
        title: "Audio traduit",
        description: "La transcription en anglais",
      },
    },
    videos: {
      create: {
        title: "Génération de vidéo (asynchrone)",
        titleShort: "v1 vidéos",
        description:
          "Lance une tâche vidéo au format de l'API vidéo d'OpenAI. Répond tout de suite avec la tâche ; suivez-la via GET /v1/videos/{id}, téléchargez via GET /v1/videos/{id}/content. Facturé une fois la vidéo prête.",
        success: {
          title: "Tâche vidéo en file",
          description: "Suivez-la par son id",
        },
      },
      get: {
        title: "Statut d'une tâche vidéo",
        titleShort: "v1 statut vidéo",
        description:
          "Statut, progression et URL du résultat d'une tâche vidéo. Le suivi est gratuit et ne compte pas dans la limite de débit.",
        success: {
          title: "Tâche vidéo",
          description: "État actuel de la tâche",
        },
      },
      content: {
        title: "Téléchargement vidéo",
        titleShort: "v1 fichier vidéo",
        description: "Le fichier vidéo final d'une tâche terminée.",
        success: { title: "Fichier vidéo", description: "Les octets MP4" },
      },
    },
    music: {
      create: {
        title: "Génération de musique (asynchrone)",
        titleShort: "v1 musique",
        description:
          "Lance une tâche musicale. Répond tout de suite avec la tâche ; suivez-la via GET /v1/music/{id}, téléchargez via GET /v1/music/{id}/content. Facturé par clip une fois prêt.",
        success: {
          title: "Tâche musicale en file",
          description: "Suivez-la par son id",
        },
      },
      get: {
        title: "Statut d'une tâche musicale",
        titleShort: "v1 statut musique",
        description:
          "Statut et URL du résultat d'une tâche musicale. Le suivi est gratuit et ne compte pas dans la limite de débit.",
        success: {
          title: "Tâche musicale",
          description: "État actuel de la tâche",
        },
      },
      content: {
        title: "Téléchargement musique",
        titleShort: "v1 fichier musique",
        description: "Le fichier audio final d'une tâche musicale terminée.",
        success: { title: "Fichier musical", description: "Les octets audio" },
      },
    },
    file: {
      title: "Téléchargement de fichier média",
      titleShort: "v1 fichier média",
      description:
        "Téléchargez un fichier produit par un appel média. L'URL signée fonctionne sans clé pendant 7 jours ; votre clé API fonctionne à tout moment.",
      success: { title: "Fichier", description: "Les octets du fichier" },
    },
    fields: {
      model: {
        label: "Modèle",
        imageDescription:
          "ID de modèle d'image de GET /v1/models (modality: image)",
        speechDescription:
          "Un ID de voix de GET /v1/models (modality: speech), par ex. openai-nova. Ou tts-1 plus une voix.",
        transcriptionDescription:
          "ID de modèle de transcription de GET /v1/models (modality: transcription). whisper-1 fonctionne.",
        translationDescription:
          "Un modèle Whisper servi par OpenAI : whisper-1 ou openai-whisper",
        videoDescription:
          "ID de modèle vidéo de GET /v1/models (modality: video)",
        musicDescription:
          "ID de modèle musical de GET /v1/models (modality: music)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "Ce qu'il faut dessiner, jusqu'à 2000 caractères",
        editDescription: "Ce qu'il faut changer dans l'image",
        transcriptionDescription:
          "Accepté pour compatibilité ; tous les fournisseurs ne le reçoivent pas",
        videoDescription:
          "Ce qui se passe dans le clip, jusqu'à 2000 caractères",
        musicDescription: "Style, ambiance, instruments, tempo",
      },
      n: {
        label: "Images",
        description: "Nombre d'images, de 1 à 4. Chacune est facturée.",
      },
      size: {
        label: "Taille",
        imageDescription:
          "LARGEURxHAUTEUR comme 1024x1024 ou 1536x1024, ou auto. Choisit la taille et le format les plus proches que le modèle gère.",
        videoDescription:
          "LARGEURxHAUTEUR comme 1280x720. Fixe le format et, si le modèle le propose, la résolution.",
      },
      aspectRatio: {
        label: "Format",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 ou 21:9. Prioritaire sur size.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 ou 9:21. Prioritaire sur size.",
      },
      quality: {
        label: "Qualité",
        description:
          "standard, hd, low, medium, high ou auto. hd et high demandent le niveau détaillé quand le modèle en a un.",
      },
      style: {
        label: "Style",
        description:
          "Accepté pour compatibilité. Décrivez le style dans le prompt.",
      },
      responseFormat: {
        label: "Format de réponse",
        imageDescription:
          "url (par défaut, lien signé valable 7 jours) ou b64_json",
        speechDescription:
          "mp3 (par défaut), opus, aac, flac, wav ou pcm. Les formats disponibles dépendent du fournisseur de la voix.",
        transcriptionDescription:
          "json (par défaut), text, srt, verbose_json ou vtt",
      },
      user: {
        label: "Utilisateur",
        description:
          "L'ID de votre utilisateur final. Accepté pour compatibilité.",
      },
      image: {
        label: "Image",
        description: "L'image à retoucher, en fichier multipart",
      },
      imageUrl: {
        label: "URL de l'image",
        description:
          "L'image à retoucher en URL http(s) ou en data: URL base64, pour les requêtes JSON",
        videoDescription:
          "Première image en URL http(s) ou en data: URL base64 (image vers vidéo)",
      },
      mask: {
        label: "Masque",
        description: "Non pris en charge. Décrivez la retouche dans le prompt.",
      },
      input: {
        label: "Texte",
        description: "Le texte à lire, jusqu'à 4096 caractères",
      },
      voice: {
        label: "Voix",
        description:
          "Avec un nom de modèle OpenAI (tts-1) : alloy, nova, onyx, echo, shimmer ou fable. Ou n'importe quel ID de voix de GET /v1/models.",
      },
      speed: {
        label: "Vitesse",
        description:
          "De 0.25 à 4.0. Appliquée par les voix OpenAI, NanoGPT et ElevenLabs.",
      },
      instructions: {
        label: "Instructions",
        description:
          "Accepté pour compatibilité ; les voix lisent le texte tel quel",
      },
      file: {
        label: "Fichier",
        description:
          "Le fichier audio : mp3, mp4, m4a, wav, webm, ogg ou flac, jusqu'à 25 Mo",
      },
      language: {
        label: "Langue",
        description:
          "Code ISO-639-1 de la langue parlée, par ex. en ou fr. Par défaut : la langue de l'URL.",
      },
      temperature: {
        label: "Température",
        description: "Accepté pour compatibilité",
      },
      seconds: {
        label: "Secondes",
        videoDescription:
          "Durée du clip. Ajustée aux durées que propose le modèle.",
        musicDescription:
          "Durée voulue : environ 8, 20 ou 30 secondes. Le modèle peut arrondir.",
      },
      resolution: {
        label: "Résolution",
        description: "par ex. 720p ou 1080p, quand le modèle laisse le choix",
      },
      negativePrompt: {
        label: "Prompt négatif",
        description:
          "Ce qui ne doit pas apparaître dans le clip, si le modèle le gère",
      },
      inputReference: {
        label: "Référence d'entrée",
        description: "Première image envoyée en multipart (image vers vidéo)",
      },
      jobId: { label: "ID de tâche", description: "L'id renvoyé par POST" },
      threadId: {
        label: "Dossier",
        description: "Dossier de stockage du fichier",
      },
      filename: {
        label: "Nom de fichier",
        description: "Nom du fichier stocké",
      },
      expires: {
        label: "Expiration",
        description: "Heure Unix à laquelle le lien signé cesse de fonctionner",
      },
      sig: { label: "Signature", description: "Signature du lien" },
    },
    response: {
      created: "Créé",
      object: "Type d'objet",
      text: "Texte",
      id: "ID de tâche",
      status: "Statut",
    },
    errors: {
      badSize:
        "size '{{size}}' n'est ni LARGEURxHAUTEUR (comme 1024x1024) ni auto.",
      maskUnsupported:
        "Les masques ne sont pas pris en charge. Décrivez la retouche dans le prompt.",
      oneImageOnly: "Une image par retouche. Envoyez un seul 'image'.",
      imageTooLarge: "L'image dépasse {{max}} Mo.",
      imageRequired:
        "Envoyez l'image à retoucher : champ multipart 'image', ou 'image_url' en JSON.",
      modelCannotEdit:
        "{{model}} n'accepte pas d'image en entrée. Choisissez un modèle image vers image dans GET /v1/models (input_modalities contient image).",
      storageFailed:
        "Le fichier a été généré mais n'a pas pu être stocké. Réessayez.",
      voiceNotFound:
        "Aucune voix '{{voice}}' disponible pour vous. Listez les voix avec GET /v1/models (modality: speech), ou utilisez le modèle tts-1 avec la voix nova.",
      formatUnsupported:
        "{{voice}} fournit {{supported}}. Demandez l'un de ces formats en response_format.",
      audioTooLarge: "Le fichier audio dépasse 25 Mo.",
      fileRequired: "Envoyez l'audio dans le champ multipart 'file'.",
      translationUnsupported:
        "{{model}} ne traduit pas. La traduction vers l'anglais passe par whisper-1.",
      jobNotFound: "Aucune tâche {{kind}} '{{id}}' sur ce compte.",
      jobNotReady:
        "La tâche {{kind}} '{{id}}' est {{status}}. Téléchargez-la quand son statut est completed.",
      jobInterrupted:
        "La tâche s'est arrêtée au redémarrage de son serveur. Rien n'a été facturé. Relancez-la.",
      jobNotCreated:
        "La tâche n'a pas pu être enregistrée. Rien n'a été facturé. Réessayez.",
      mediaNotFound:
        "Fichier introuvable, ou lien expiré. Récupérez un lien frais depuis la tâche, ou envoyez votre clé API.",
      modelNoImageInput:
        "{{model}} n'accepte pas d'image de départ. Choisissez un modèle image vers vidéo dans GET /v1/models, ou retirez l'image.",
      modelNeedsImage:
        "{{model}} anime une image. Envoyez input_reference ou image_url.",
      resolutionUnsupported:
        "{{model}} produit {{supported}}. Demandez l'une de ces résolutions en resolution.",
    },
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Requête invalide",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Une clé API valide est requise",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue s'est produite",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau s'est produite",
    },
    forbidden: { title: "Accès interdit", description: "Accès refusé" },
    notFound: { title: "Introuvable", description: "Modèle introuvable" },
    conflict: {
      title: "Conflit",
      description: "La requête entre en conflit avec l'état actuel",
    },
  },
};
