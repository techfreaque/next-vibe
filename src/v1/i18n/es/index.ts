import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",

  tags: {
    api: "OpenAI -compatible API",
  },

  promptCache: {
    label: "Caché del prompt",
    description:
      "Guarda en caché el inicio compartido del prompt y elige cuánto tiempo se conserva.",
  },
  openai: {
    missingKey:
      "Falta la llave de API. Envíelo como 'Autorización: Bearer <key>' o 'x-api-key: <key> '. Cree una clave bajo las teclas Ajustes √≥ API.",
    invalidKey:
      "Llave API inválida o revocada. Revise la llave o cree una nueva bajo las teclas Settings √® API.",
    authUnavailable:
      "No pude verificar tu llave API ahora mismo. Tu llave no fue rechazada. Entrada en {{seconds}} s.",
    modelNotFound:
      "El modelo ' {{model}} ' no existe o no está disponible para usted. Lista tus modelos con GET /v1/models.",
    paidRequired:
      "El API necesita una cuenta pagada: cualquier plan, desde {{subPrice}} al mes. Añadir uno en {{url}}.",
    toolsUnsupportedByModel:
      "Este modelo no admite llamadas de herramientas. Escoja un modelo con soporte de herramientas o retírelo.",
    badToolArguments:
      "Los argumentos de la llamada de herramienta ' {{name}} ' no son válidos JSON.",
    toolChoiceUnknown:
      'tool_choice nombra "{{name}}", que no está en "herramientas".',
    toolMessageNeedsId:
      "Mensaje de la herramienta {{param}} necesita un tool_call_id.",
    nUnsupported: "Sólo N=1 es compatible.",
    badImageUrl: "image_url debe ser un http(s) URL o un base64 datos: URL.",
    insufficientCredits:
      "Créditos insuficientes. Esta llamada necesita acerca de {{cost}}, usted tiene {{balance}}. Arriba para continuar.",
    rateLimited:
      "Límite de tarifas alcanzado: solicitudes {{limit}} por minuto para esta clave. Entrada en {{seconds}} s.",
    upstreamFailed: "El proveedor de modelos falló: {{error}}",
    balanceCheckFailed:
      "No pude verificar su saldo de crédito. No se corrió nada. Inténtalo de nuevo.",
  },

  models: {
    get: {
      title: "OpenAI - modelos compatibles",
      titleShort: "v1 modelos",
      description:
        "Lista los modelos que tu tecla API puede llamar. Formato de lista OpenAI. Autenticate con Autorización: Bearer <key>.",
      response: { object: "Tipo de objeto" },
      success: {
        title: "Modelos enumerados",
        description: "Los modelos disponibles para esta tecla API",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI -compatibles finalizaciones de chat",
      titleShort: "v1 finalizaciones de chat",
      description:
        "Llame a cualquier modelo con el formato OpenAI de terminación de chat. Billed contra tus créditos a precios de chat. Soporta el flujo: cierto.",
      fields: {
        model: {
          label: "Modelo",
          description: "Modelo ID de GET /v1/models",
        },
        messages: {
          label: "Mensajes",
          description:
            "matriz de mensajes OpenAI (sistema, usuario, asistente)",
        },
        stream: {
          label: "Corriente",
          description: "Enviar la respuesta como eventos de servidor-enviado",
        },
        streamOptions: {
          label: "Opciones de secuencia",
          description:
            "{ include_usage : verdadero } añade un pedazo de uso final",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Atado superior en fichas generadas",
        },
        maxCompletionTokens: {
          label: "Número máximo de fichas de terminación",
          description: "Igual que max_tokens ; tiene precedencia",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura de muestreo, 0 a 2",
        },
        topP: {
          label: "Top P",
          description: "muestreo en núcleo, 0 a 1",
        },
        stop: {
          label: "Para.",
          description: "Parar la secuencia o lista de ellos",
        },
        n: {
          label: "Elecciones",
          description: "Sólo 1 es compatible",
        },
        tools: {
          label: "Herramientas",
          description:
            "Herramientas de función OpenAI el modelo puede llamar: [{type:'function', function:{name, description, parameters}]",
        },
        toolChoice: {
          label: "Elección de la herramienta",
          description:
            "ninguno, auto, requerido o {tipo:'función', función: {name} }",
        },
        parallelToolCalls: {
          label: "Llamadas de herramientas paralelas",
          description: "Aceptado para compatibilidad; el modelo decide",
        },
      },
      response: { object: "Tipo de objeto" },
      success: {
        title: "Terminación creada",
        description: "El modelo respondió",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id no es compatible: las respuestas no se almacenan. Envíe la conversación completa en 'input' con la tienda: false (Codex CLI hace esto por defecto).",
    badInputItem:
      "{{param}} no es utilizable: las imágenes deben ser http(s) o datos base64: URLs y elementos de herramientas necesitan un call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 respuestas",
      description:
        "Llame a cualquier modelo con el formato OpenAI Responses, el Codex CLI habla. Apátridas: enviar la conversación completa en entrada. Admite herramientas de streaming, función, personalizadas y local_shell, y elementos de razonamiento.",
      fields: {
        model: { label: "Modelo", description: "Modelo ID de GET /v1/models" },
        input: {
          label: "Input",
          description:
            "Una cadena, o la conversación como artículos de Respuestas (mensaje, function_call, function_call_output, razonamiento,...)",
        },
        instructions: {
          label: "Instrucciones",
          description: "Instrucciones del sistema para el modelo",
        },
        stream: {
          label: "Corriente",
          description:
            "Enviar la respuesta como Respuestas eventos servidor-enviado",
        },
        tools: {
          label: "Herramientas",
          description:
            "herramientas de función, personalizadas y local_shell. Las herramientas anfitrionas (web_search,...) se saltan.",
        },
        toolChoice: {
          label: "Elección de la herramienta",
          description: "ninguno, auto, requerido o {tipo: 'función', nombre}",
        },
        parallelToolCalls: {
          label: "Llamadas de herramientas paralelas",
          description: "Aceptado para compatibilidad; el modelo decide",
        },
        maxOutputTokens: {
          label: "Tokens de salida máxima",
          description: "Atado superior en fichas generadas",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura de muestreo, 0 a 2",
        },
        topP: { label: "Top P", description: "muestreo en núcleo, 0 a 1" },
        reasoning: {
          label: "Razonamiento",
          description:
            "Aceptado para compatibilidad. Modelos de resonancia devuelven elementos de razonamiento de cualquier manera.",
        },
        text: {
          label: "Formato de texto",
          description:
            "{format:{type:' json_schema ', schema} pide salida JSON",
        },
        store: {
          label: "Store",
          description: "Las respuestas nunca se almacenan; envían falsas",
        },
        previousResponseId: {
          label: "Respuesta anterior ID",
          description:
            "No compatible: enviar la conversación completa en su lugar",
        },
        include: {
          label: "Incluido",
          description:
            "Aceptado para compatibilidad. Los elementos de resonancia siempre llevan encrypted_content para la repetición.",
        },
      },
      response: { object: "Tipo de objeto" },
      success: {
        title: "Respuesta creada",
        description: "El modelo respondió",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} tiene un bloque de contenido que no podemos usar: las imágenes deben ser URLs base64 o http(s).",
    post: {
      title: "Anthropic Mensajes API",
      titleShort: "v1 mensajes",
      description:
        "Llame a cualquier modelo con el formato Anthropic Mensajes, el código Claude habla. Clave como x-api-key o Autorización: Bearer. Soporta streaming, herramientas y bloques de pensamiento.",
      fields: {
        model: {
          label: "Modelo",
          description:
            "Modelo ID de GET /v1/models. Claude ids como claude-sonnet-4-5-20250929 mapa a nuestro modelo Claude con juego.",
        },
        messages: {
          label: "Mensajes",
          description:
            "Mensajes Anthropic: usuario y asistente se convierte con texto, imagen, tool_use, tool_result y bloques de pensamiento",
        },
        system: {
          label: "Sistema",
          description: "Inmediación del sistema: bloques de cadena o texto",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Atado superior en fichas generadas",
        },
        stream: {
          label: "Corriente",
          description: "Enviar la respuesta como eventos de servidor Anthropic",
        },
        tools: {
          label: "Herramientas",
          description:
            "Herramientas del cliente: [{name, description, input_schema }]. Las herramientas de servidor (web_search,...) se saltan.",
        },
        toolChoice: {
          label: "Elección de la herramienta",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Detener secuencias",
          description: "Criaturas que terminan la respuesta",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura de muestreo",
        },
        topP: { label: "Top P", description: "muestreo en núcleo, 0 a 1" },
        thinking: {
          label: "Razonando",
          description:
            "Aceptado para compatibilidad. Los modelos de resonancia devuelven bloques de pensamiento de cualquier manera.",
        },
      },
      response: { type: "Tipo de objeto" },
      success: { title: "Mensaje creado", description: "El modelo respondió" },
    },
  },

  countTokens: {
    post: {
      title: "Cuenta de token Anthropic",
      titleShort: "v1 contar fichas",
      description:
        "Estimar las fichas de entrada de una solicitud de Mensajes Anthropic. Sin llamada modelo, sin créditos.",
      fields: {
        action: { label: "Medida", description: "Siempre count_tokens" },
        model: { label: "Modelo", description: "Modelo ID" },
        messages: { label: "Mensajes", description: "Mensajes Anthropic" },
        system: { label: "Sistema", description: "Inmediata del sistema" },
        tools: {
          label: "Herramientas",
          description: "Definiciones de herramientas",
        },
      },
      response: { inputTokens: "Tokens de entrada" },
      success: {
        title: "Tokens counted",
        description: "Tokens de insumos estimados",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "OpenAI -compatible generación de imagen",
        titleShort: "v1 imágenes",
        description:
          "Genera imágenes con cualquier modelo de imagen de GET /v1/models. formato de imágenes OpenAI: url (firmado, válido 7 días) o b64_json. Billado por imagen.",
        success: {
          title: "Imágenes generadas",
          description: "Las imágenes se almacenan y vinculan",
        },
      },
      edits: {
        title: "OpenAI - edición de imagen compatible",
        titleShort: "v1 ediciones de imagen",
        description:
          "Editar una imagen con un impulso, en un modelo que toma la entrada de imagen. Subirlo como 'image' multiparte o enviar ' image_url '. Billado por imagen.",
        success: {
          title: "Imagen editada",
          description: "La imagen editada está almacenada y conectada",
        },
      },
    },
    speech: {
      title: "OpenAI - texto compatible con el discurso",
      titleShort: "v1 discurso",
      description:
        "Convertir texto en discurso. Respuestas con los bytes de audio (mp3 por defecto). Billed per character.",
      success: {
        title: "Discurso generado",
        description: "El archivo de audio",
      },
    },
    transcriptions: {
      title: "OpenAI - transcripción compatible",
      titleShort: "v1 transcripciones",
      description:
        "Transcribe un archivo de audio (multipart 'file', hasta 25 MB). JSON, texto, SRT, WebVTT o verbose JSON con segmentos. Facturado por segundo de audio.",
      success: { title: "Audio transcrito", description: "La transcripción" },
    },
    translations: {
      title: "OpenAI - traducción de audio compatible",
      titleShort: "v1 traducciones",
      description:
        "Transcribe un archivo de audio directamente al texto inglés con Whisper. Los mismos formatos y facturación como transcripciones.",
      success: {
        title: "Audio traducido",
        description: "La transcripción inglesa",
      },
    },
    videos: {
      create: {
        title: "Generación de vídeo (sincronización)",
        titleShort: "v1 videos",
        description:
          "Iniciar un trabajo de vídeo en la forma de OpenAI 's video API. Respuestas de inmediato con el trabajo; encuesta GET /v1/videos/ {id}, descargar GET /v1/videos/ {id} /content. Facturado cuando el video está listo.",
        success: {
          title: "Trabajo de video queued",
          description: "Contaminarlo por id",
        },
      },
      get: {
        title: "Situación del empleo en vídeo",
        titleShort: "v1 estado de vídeo",
        description:
          "Estado, progreso y resultado URL de un trabajo de vídeo. La votación es gratuita y no cuenta con el límite de tarifas.",
        success: {
          title: "Trabajo de vídeo",
          description: "Estado de empleo actual",
        },
      },
      content: {
        title: "Descarga de vídeo",
        titleShort: "v1 contenido de vídeo",
        description: "El archivo de vídeo terminado de un trabajo completado.",
        success: { title: "Archivo de vídeo", description: "Los bytes MP4" },
      },
    },
    music: {
      create: {
        title: "Generación de música (async)",
        titleShort: "v1 música",
        description:
          "Empieza un trabajo de música. Respuestas de inmediato con el trabajo; encuesta GET /v1/music/ {id}, descargar GET /v1/music/ {id} /content. Facturado por clip cuando esté listo.",
        success: {
          title: "Trabajo de música queued",
          description: "Contaminarlo por id",
        },
      },
      get: {
        title: "Estado del trabajo musical",
        titleShort: "v1 estado de música",
        description:
          "Estado y resultado URL de un trabajo musical. La votación es gratuita y no cuenta con el límite de tarifas.",
        success: {
          title: "Trabajo musical",
          description: "Estado de empleo actual",
        },
      },
      content: {
        title: "Descarga de música",
        titleShort: "v1 contenido de música",
        description:
          "El archivo de audio terminado de un trabajo de música completado.",
        success: {
          title: "Archivo de música",
          description: "Los bytes de audio",
        },
      },
    },
    file: {
      title: "Descarga de archivos multimedia",
      titleShort: "v1 archivo multimedia",
      description:
        "Descargue un archivo de una llamada de medios producida. El URL firmado funciona sin una llave durante 7 días; tu llave API funciona en cualquier momento.",
      success: { title: "Archivo", description: "El archivo bytes" },
    },
    fields: {
      model: {
        label: "Modelo",
        imageDescription:
          "Modelo de imagen ID de GET /v1/models (modalidad: imagen)",
        speechDescription:
          "Una voz ID de GET /v1/models (modalidad: discurso), por ejemplo, openai-nova. O tts-1 más una voz.",
        transcriptionDescription:
          "Modelo de transcripción ID de GET /v1/models (modalidad: transcripción). susurros-1 obras.",
        translationDescription:
          "Un modelo Whisper servido por OpenAI : susurro-1 o openai-whisper",
        videoDescription:
          "Modelo de vídeo ID de GET /v1/models (modalidad: video)",
        musicDescription:
          "Modelo musical ID de GET /v1/models (modalidad: música)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "Qué dibujar, hasta 2000 caracteres",
        editDescription: "Qué cambiar en la imagen",
        transcriptionDescription:
          "Aceptado para compatibilidad; no pasó a cada proveedor",
        videoDescription: "Lo que pasa en el clip, hasta 2000 caracteres",
        musicDescription: "Estilo, humor, instrumentos, tempo",
      },
      n: {
        label: "Imágenes",
        description: "Cuantas imágenes, 1 a 4. Cada uno está facturado.",
      },
      size: {
        label: "Tamaño",
        imageDescription:
          "WIDTHxHEIGHT like 1024x1024 or 1536x1024, or auto. Elija el tamaño más cercano y la relación que el modelo soporta.",
        videoDescription:
          "WIDTHxHEIGHT like 1280x720. Establece la relación de aspecto y, donde el modelo lo ofrece, la resolución.",
      },
      aspectRatio: {
        label: "Relación entre los aspectos",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 ó 21:9. Gana sobre el tamaño.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 o 9:21. Gana sobre el tamaño.",
      },
      quality: {
        label: "Calidad",
        description:
          "estándar, hd, bajo, mediano, alto o auto. hd y alto piden el nivel detallado donde el modelo tiene uno.",
      },
      style: {
        label: "Estilo",
        description:
          "Aceptado para compatibilidad. Ponga el estilo en el aviso.",
      },
      responseFormat: {
        label: "Formato de respuesta",
        imageDescription:
          "url (predeterminado, un enlace firmado válido 7 días) o b64_json",
        speechDescription:
          "mp3 (default), opus, aac, flac, wav o pcm. Cualesquiera que una voz puede entregar depende de su proveedor.",
        transcriptionDescription:
          "json (default), text, srt, verbose_json o vtt",
      },
      user: {
        label: "Usuario",
        description: "Su usuario final ID. Aceptado para compatibilidad.",
      },
      image: {
        label: "Imagen",
        description: "La imagen para editar, como un archivo multiparto subir",
      },
      imageUrl: {
        label: "Imagen URL",
        description:
          "La imagen para editar como http(s) URL o base64 datos: URL, para las solicitudes JSON",
        videoDescription:
          "Primer marco como http(s) URL o base64 datos: URL (image-to-video)",
      },
      mask: {
        label: "Máscara",
        description: "No es compatible. Describir la edición en el aviso.",
      },
      input: {
        label: "Input",
        description: "El texto para hablar, hasta 4096 caracteres",
      },
      voice: {
        label: "Voz",
        description:
          "Con un nombre de modelo OpenAI (tts-1): aleación, nova, ónix, eco, brillo o fábula. O cualquier voz ID de GET /v1/models.",
      },
      speed: {
        label: "Velocidad",
        description:
          "0.25 a 4.0. Aplicado por voces OpenAI, NanoGPT y ElevenLabs.",
      },
      instructions: {
        label: "Instrucciones",
        description:
          "Aceptada para compatibilidad; las voces leen la entrada como escrita",
      },
      file: {
        label: "Archivo",
        description:
          "El archivo de audio: mp3, mp4, m4a, wav, webm, ogg o flac, hasta 25 MB",
      },
      language: {
        label: "Idioma",
        description:
          "ISO-639 -1 código del idioma hablado, por ejemplo en o de. Default: el local en el URL.",
      },
      temperature: {
        label: "Temperatura",
        description: "Aceptado para compatibilidad",
      },
      seconds: {
        label: "Segundos",
        videoDescription:
          "Longitud del clip. Ajustado a las longitudes que ofrece el modelo.",
        musicDescription:
          "Longitud deseada: unos 8, 20 o 30 segundos. El modelo puede redondearlo.",
      },
      resolution: {
        label: "Resolución",
        description:
          "por ejemplo 720p o 1080p, donde el modelo ofrece una opción",
      },
      negativePrompt: {
        label: "Inmediatamente negativo",
        description: "Qué mantener fuera del clip, donde el modelo lo soporta",
      },
      inputReference: {
        label: "Referencia de insumos",
        description:
          "Primer marco como una subida de imagen multiparte (imagen a vídeo)",
      },
      jobId: { label: "Job ID", description: "El id POST regresó" },
      threadId: {
        label: "Folder",
        description: "Carpeta de almacenamiento del archivo",
      },
      filename: {
        label: "Nombre del archivo",
        description: "Nombre del archivo almacenado",
      },
      expires: {
        label: "Expires",
        description: "Unix time el enlace firmado deja de funcionar",
      },
      sig: { label: "Firma", description: "Firma del enlace" },
    },
    response: {
      created: "Creado",
      object: "Tipo de objeto",
      text: "Texto",
      id: "Job ID",
      status: "Situación",
    },
    errors: {
      badSize:
        "tamaño ' {{size}} ' no es WIDTHxHEIGHT (como 1024x1024) o auto.",
      maskUnsupported:
        "Las máscaras no son compatibles. Describe el cambio en el impulso.",
      oneImageOnly: "Una imagen por edición. Envía una sola 'imagen'.",
      imageTooLarge: "La imagen es más grande que {{max}} MB.",
      imageRequired:
        "Envíe la imagen para editar: 'image' de campo multiparte, o ' image_url' en JSON.",
      modelCannotEdit:
        "{{model}} no toma una imagen de entrada. Elija un modelo de imagen a imagen de GET /v1/models (input_modalities contiene imagen).",
      storageFailed:
        "El archivo se generó pero no se pudo almacenar. Inténtalo de nuevo.",
      voiceNotFound:
        "No hay voz ' {{voice}}' disponible para usted. Listar voces con GET /v1/models (modalidad: discurso), o utilizar el modelo tts-1 con voz nova.",
      formatUnsupported:
        "{{voice}} entrega {{supported}}. Pida uno de esos como response_format.",
      audioTooLarge: "El archivo de audio es más grande que 25 MB.",
      fileRequired: "Sube el audio como 'file' de campo multiparte.",
      translationUnsupported:
        "{{model}} no puede traducir. La traducción al inglés funciona en susurro-1.",
      jobNotFound: "No hay trabajo de {{kind}} ' {{id}}' en esta cuenta.",
      jobNotReady:
        "El trabajo {{kind}} ' {{id}}' es {{status}}. Descárguelo una vez que se complete su estado.",
      jobInterrupted:
        "El trabajo se detuvo cuando su servidor reiniciaba. Nada fue cargado. Repítelo.",
      jobNotCreated:
        "El trabajo no podía salvarse. Nada fue cargado. Inténtalo de nuevo.",
      mediaNotFound:
        "El archivo no encontrado, o el enlace caducó. Obtenga un nuevo enlace del trabajo, o envíe su llave API.",
      modelNoImageInput:
        "{{model}} no toma una imagen de primer marco. Elija un modelo de imagen a vídeo de GET /v1/models, o suelte la imagen.",
      modelNeedsImage:
        "{{model}} anima una imagen. Enviar input_reference o image_url.",
      resolutionUnsupported:
        "{{model}} renderiza {{supported}}. Pida a uno de ellos como resolución.",
    },
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Solicitud inválida",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Se requiere una llave API válida",
    },
    server: {
      title: "Error del servidor",
      description: "Error del servidor interno",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    network: { title: "Error de red", description: "Ocurrió un error de red" },
    forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Modelo no encontrado",
    },
    conflict: {
      title: "Conflicto",
      description: "Solicite conflictos con el Estado",
    },
  },
};
