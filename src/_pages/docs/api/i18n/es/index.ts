import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} API Docs: OpenAI y Anthropic compatibles",
    description:
      "Una sola URL base, {{modelCount}} modelos de chat. Compatible con OpenAI y Anthropic, con streaming y llamadas a herramientas. Además imágenes, voz, vídeo y música. Pagas en créditos.",
    category: "API",
    imageAlt: "{{appName}} OpenAI-compatible API docs",
    keywords:
      "api, openai compatible, antropical compatible, finalizaciones de chat, respuestas api, mensajes api, codex cli, claude code, streaming, función calling, generación de imagen api, texto a speech api, susurre api, generación de vídeo api, generación de música api, {{appName}}",
  },
  toc: {
    title: "En esta página",
    mobileTitle: "Saltear",
    groups: {
      start: "Empieza.",
      chat: "Chat",
      media: "Medios",
      reference: "Referencia",
      integrations: "Integraciones",
    },
  },
  nav: {
    quickstart: "Quickstart",
    auth: "Autenticación",
    access: "Acceso y fijación de precios",
    models: "Modelos",
    chat: "Concluciones de chat",
    tools: "Herramienta de llamada",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Créditos y facturación",
    errors: "Errores y límites de tarifas",
    codingTools: "Herramientas de codificación",
    sdks: "Ejemplos de SDK",
    guides: "Guías",
    images: "Imágenes",
    speech: "Texto al discurso",
    transcriptions: "Transcripción",
    videos: "Video",
    music: "Música",
    mediaFiles: "Archivos de medios",
  },
  hero: {
    badge: "Referencia de API",
    title: "Una base URL.",
    titleHighlight: "Cada modelo.",
    subtitle:
      "Indique cualquier OpenAI o Anthropic SDK en {{appName}}. Codex CLI y Claude Code también. Imágenes, voz, vídeo y música en la misma llave. No hay nuevo cliente que aprender.",
    ctaKey: "Obtener una clave API",
    ctaPricing: "Ver planes",
    quickstartLink: "Quickstart en 3 pasos",
    facts: {
      models: "Modelos de chat {{modelCount}}",
      formats: "OpenAI + formato Anthropic",
      streaming: "Streaming y llamadas de herramientas",
      rate: "Solicitudes de {{rate}} por minuto por clave",
    },
  },
  code: {
    copy: "Copiar",
    wrap: "Líneas de trampa",
    copied: "Copiado",
    request: "Solicitud",
    response: "Respuesta",
    stream: "Corriente",
    showResponse: "Respuesta del ejemplo",
    showStream: "Transmisión de ejemplo",
    showObject: "Acabado objeto de trabajo",
  },
  quickstart: {
    title: "Quickstart",
    intro:
      "El API habla el OpenAI y el formato de cable Anthropic. Código que se ejecuta contra cualquiera de los dos cambios: la base URL y la clave.",
    baseUrlLabel: "OpenAI base URL",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Para Claude Code y los SDK Anthropic. No `/v1` al final: añaden `/v1/messages` ellos mismos.",
    baseUrlNote:
      "Cualquier local trabaja en el camino (en- US, de- DE, pl- PL). Sólo cambia el lenguaje de los mensajes de error.",
    envLabel: "O fijarlo una vez por cada OpenAI SDK",
    step1: {
      title: "Crear una clave",
      description:
        "Abra las teclas API en su cuenta, nombre la clave, copiarlo. Lo ves una vez.",
      cta: "Abra las teclas API",
    },
    step2: {
      title: "Establecer la base URL",
      description:
        "Trae la base URL en su cliente. Los clientes de Anthropic toman el segundo.",
    },
    step3: {
      title: "Enviar solicitud",
      description:
        "Pruébalo en un terminal, pon tu llave, ejecútalo. La misma llamada en Python y JavaScript.",
    },
  },
  access: {
    title: "Acceso y fijación de precios",
    intro:
      "El API se ejecuta en los mismos créditos que la aplicación chat. Sin plan API separado, sin cargos de asiento.",
    unlockTitle: "Lo que lo abre.",
    plan: "Cualquier plan, de {{subPrice}} al mes. Cada plan trae créditos mensuales.",
    grant:
      "Créditos otorgados por nuestro equipo, como créditos de los testers.",
    never:
      "Los créditos gratuitos nunca lo desbloquean: el subsidio mensual, la suscripción y bonificaciones de boletines informativos, los ingresos de remisión.",
    withoutTitle: "Sin compra",
    locked:
      "Las cuentas sin una compra no pueden crear claves, y cada llamada `/v1` responde HTTP 402 `paid_plan_required`.",
    topup:
      "¿Necesitas más créditos? Con una suscripción puedes recargar con paquetes desde {{packPrice}}. Los créditos de los paquetes nunca vencen.",
    ctaUnlock: "Ver planes",
    ctaKeys: "Abra las teclas API",
  },
  auth: {
    title: "Autenticación",
    intro:
      "Envíe su llave como señal de oso en cada solicitud. Las llaves comienzan con `sk-unb-`. Los clientes de Anthropic lo envían como `x-api-key`, y eso también funciona.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "Formato OpenAI",
    headerAnthropicTab: "Formato Anthropic",
    points: {
      hash: "Almacenamos un hachís, no la llave. Pérdelo y creas uno nuevo.",
      scope:
        "Una clave funciona en el API solamente: `/v1/models`, chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) y medios de comunicación (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). No puede tocar su cuenta, pagos o ajustes.",
      limit:
        "Hasta las teclas activas {{maxKeys}} por cuenta. Revoque cualquier clave en cualquier momento: deja de funcionar de inmediato.",
      missing:
        "Ninguna clave o una llave revocada devuelve 401. Una clave en una cuenta sin una compra devuelve 402.",
    },
  },
  models: {
    title: "Modelos",
    intro:
      "`GET /v1/models` enumera los modelos que tu clave puede llamar ahora mismo, con tamaño de contexto, soporte de herramientas y precios de crédito por millón de fichas. Use el id como el campo modelo en las solicitudes.",
    note: "La lista depende de su cuenta. Los ids desconocidos o no disponibles devuelven 404 `model_not_found`. La única asignación: en `/v1/messages`, Claude ids que Claude Code envía por defecto ir a nuestro nuevo Claude de la misma familia.",
    browse: "Examine todos los modelos con precios y filtros",
    media: {
      title: "Modelos de medios en la misma lista",
      body: "Los modelos de imagen, vídeo, música, voz y transcripción se encuentran en la misma lista. Cada entrada dice lo que hace y dónde llamarlo.",
      filename: "Medios de comunicación",
      points: {
        modality:
          "La modalidad es chat, imagen, vídeo, música, discurso o transcripción. endpoints enumera los caminos que toman el modelo.",
        pricing:
          "Los precios de los medios son por unidad: `credits_per_image`, `credits_per_second` (video), `credits_per_clip` (music), `credits_per_1k_characters` (speech), `credits_per_minute` (transcripción).",
        anthropic:
          "Los clientes de Anthropic (cabeza `anthropic-version`) solo obtienen modelos de chat. Modelos cuyo proveedor no está establecido en nuestro lado no están listados y responder 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Concluciones de chat",
    intro:
      "Completaciones estándar de chat OpenAI. Mensajes, un mensaje asistente. Entradas de texto e imagen (`image_url` como https URL o base64 datos URL).",
    nonStream: {
      title: "Incorporación",
      body: "Por defecto. Usted consigue un cuerpo JSON cuando se hace el modelo. `usage.credits_charged` es lo que esta llamada le costó.",
    },
    stream: {
      title: "Streaming",
      body: "Establecer `stream: true` para eventos de servidor en el formato OpenAI chunk, terminado por `data: [DONE]`. Añadir `stream_options.include_usage` para conseguir un trozo final con cuentas de token y `credits_charged`. Cerrar la conexión detiene la generación. Pagas sólo por lo que corrió.",
    },
    paramsTitle: "Campos de solicitud",
    paramsColumns: { field: "Campo", description: "¿Qué hace?" },
    params: {
      model: "Requerido. Un modelo id de `GET /v1/models`.",
      messages:
        "Requerido. sistema, desarrollador, usuario, asistente y mensajes de herramientas. El contenido de usuario puede ser una cadena o texto y partes `image_url`.",
      stream: "verdadero para eventos de servidor-sentido. Falso por defecto.",
      streamOptions: "`{ include_usage: true }` añade un trozo de uso final.",
      maxTokens:
        "`max_completion_tokens` tiene prioridad. Capped en {{maxTokens}}.",
      temperature: "0 a 2. Ignorado por modelos que no lo soportan.",
      topP: "0 a 1.",
      stop: "Una cadena de parada o una lista de ellos.",
      n: "Sólo 1 es compatible. Otros valores devuelven 400.",
      tools:
        "Herramientas de función que el modelo puede llamar. Vea la llamada de herramientas.",
      toolChoice: "ninguno, auto, requerido, o una función llamada.",
    },
  },
  tools: {
    title: "Herramienta de llamada",
    intro:
      "Función llamando funciona como OpenAI. Usted describe las funciones, el modelo decide llamar a uno, lo ejecuta y envía el resultado de vuelta. Nunca ejecutamos tus herramientas.",
    flow: {
      title: "El bucle",
      step1: "Envía herramientas con tus mensajes.",
      step2:
        "El modelo responde con `tool_calls` y `finish_reason: tool_calls`. Cada llamada tiene un id, un nombre de la función y los argumentos JSON -string.",
      step3:
        "Corre la función tú mismo. Apéndice el mensaje asistente, luego un mensaje de herramienta por llamada con su `tool_call_id`.",
      step4: "Vuelve a llamar. El modelo utiliza los resultados y respuestas.",
    },
    requestTitle: "1. Solicitud con herramientas",
    responseTitle: "2. El modelo pide una llamada",
    followUpTitle: "3. Regresar el resultado",
    sdkTitle: "El mismo bucle con el Python SDK",
    streamingTitle: "Streaming tool calls",
    streamingBody:
      "Con `stream: true`, las llamadas llegan como pedazos `delta.tool_calls`, dirigidos por índice. El primer trozo para un índice lleva id y `function.name`. Más tarde chunks apéndice a `function.arguments`. Concatenate ellos, luego parse el JSON cuando `finish_reason` es `tool_calls`. Cada OpenAI SDK hace esto por ti.",
    rules: {
      title: "Reglas",
      support:
        "El modelo debe soportar herramientas: comprobar `supports_tools` en `GET /v1/models`. Otros devuelven 400 `tools_not_supported`.",
      choice:
        "`tool_choice` ninguno, auto y trabajo requerido como en OpenAI. Nombrar una función que no está en herramientas devuelve 400.",
      names:
        "Nombres de función: letras, dígitos, subrayar, dash, hasta 64 caracteres.",
      billing:
        "Las definiciones de herramientas y los resultados de la herramienta son fichas de entrada. Las llamadas son fichas de salida. Ellos facturan como cualquier otro token.",
    },
  },
  billing: {
    title: "Créditos y facturación",
    intro:
      "La API usa los mismos créditos que la aplicación de chat y aplica las mismas tarifas. Un solo saldo, una sola factura.",
    points: {
      price:
        "Costo = fichas de entrada más fichas de salida al precio de crédito del modelo, lista por millón de fichas en `GET /v1/models`. Los modelos OpenRouter son la excepción: usted paga lo que el proveedor realmente cobraba por la llamada, además de nuestra marcación. Su precio listado es una estimación. Chat les factura de la misma manera.",
      usage:
        "Cada respuesta reporta `usage.credits_charged`. Su saldo está en la aplicación bajo Créditos.",
      preflight:
        "Antes de ejecutar una llamada, comprobamos si tu saldo cubre el costo máximo estimado. Si no alcanza, devolvemos HTTP 402 con `insufficient_credits`. La llamada no se ejecuta y no se cobra nada.",
      real: "Después de la llamada usted paga el uso real, no la estimación: la ficha cuenta los informes del proveedor, o el costo real del proveedor para los modelos OpenRouter. Si un proveedor no reporta ningún costo, la llamada se remonta al precio indicado.",
      media:
        "Los medios de comunicación llaman la factura de la misma manera: el costo real del proveedor más nuestra marcación donde el proveedor lo reporta, el precio por modelo enumerado de otra manera. Imágenes factura por imagen, discurso por personaje, transcripción por segundo de audio, vídeo cuando el clip está listo, música por clip.",
      topup:
        "¿Te quedaste sin créditos? Recarga con un paquete, renueva tu suscripción o pasa a un plan superior. Puedes hacer otra llamada de inmediato.",
    },
  },
  limits: {
    title: "Tasa límite",
    body: "Cada clave permite solicitudes {{rate}} por minuto por defecto. Con el límite consigues HTTP 429 con un encabezado `Retry-After` en segundos. Retrocede por tanto tiempo y reingrese. Los límites son por clave, así que dividir las cargas de trabajo pesadas a través de llaves.",
  },
  errors: {
    title: "Errores y límites de tarifas",
    intro:
      "Los errores usan el sobre OpenAI, por lo que los SDK elevan sus excepciones habituales. Rama en `error.code`, no en el mensaje.",
    shapeTitle: "Cuerpo de error",
    shapeOpenAi: "Formato OpenAI",
    shapeAnthropic: "Formato Anthropic",
    codesTitle: "Códigos de error",
    columns: { status: "HTTP", code: "code", meaning: "Significado" },
    rows: {
      missingKey:
        "No hay llave enviada. Enviar `Authorization: Bearer sk-unb-...`, o `x-api-key`.",
      invalidKey: "La llave está equivocada o revocada.",
      paid: "Todavía no hay compra en la cuenta. Cualquier plan lo desbloquea.",
      credits: "Saldo insuficiente para esta llamada. Recarga tus créditos.",
      cap: "Agotaste los créditos de pago y alcanzaste el límite diario de créditos gratis. Recarga tus créditos.",
      notFound: "El modelo no existe o no está disponible para usted.",
      invalid:
        "Mala solicitud: parámetro sin soporte, mal `tool_choice`, mala imagen URL.",
      contentPolicy:
        "El proveedor de medios rechazó el aviso. No se cobra nada. Rephrase o elija otro modelo.",
      consent:
        "Los modelos no censurados necesitan una confirmación de 18+ de una sola vez en su cuenta. Confirme una vez en la página de teclas API, luego vuelva a entrar.",
      rate: "Más solicitudes de {{rate}} por minuto para esta clave. Lea `Retry-After`.",
      upstream:
        "El proveedor de modelos falló. Seguro para volver a entrar. Las corrientes terminan con un evento de error.",
      balance:
        "No pudimos leer tu saldo. La llamada no se ejecutó. Inténtalo de nuevo.",
    },
    streamNote:
      "Los errores que ocurren a mitad de la corriente llegan como un evento `data:` con el mismo objeto de error, seguido por `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "Las respuestas OpenAI API, el formato Codex CLI habla. Los mismos modelos, claves, créditos y límites de tarifas como las terminaciones de chat.",
    request: {
      title: "Solicitud",
      body: "La entrada es una cadena o una lista de elementos de entrada. instrucciones es el indicador del sistema. La respuesta llega como elementos de salida. Cada OpenAI SDK también le da `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Establecer `stream: true` para el flujo de eventos de Respuestas: `response.created`, deltas de texto, luego `response.completed` con uso.",
    },
    points: {
      tools:
        "Herramientas: función, personalizado y `local_shell`. Las llamadas del modelo vuelven como elementos de salida. Envíe cada resultado como un elemento `function_call_output` con el mismo `call_id`.",
      reasoning:
        "Modelos de resonancia devuelven elementos de razonamiento al lado de la respuesta.",
      billing:
        "Billing, ids modelo, errores y límites de tarifas funcionan exactamente como las terminaciones de chat.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "Los mensajes Anthropic API, Claude Code formato y los SDKs Anthropic hablan. Utilice la base URL sin `/v1` : los clientes añaden `/v1/messages` ellos mismos.",
    request: {
      title: "Solicitud",
      body: "Solicitud de Mensajes Estándar: modelo, `max_tokens`, sistema, mensajes. El texto y los bloques de imagen en, texto y `tool_use` se bloquean.",
    },
    stream: {
      title: "Streaming",
      body: "Establecer `stream: true` para eventos de servidor Anthropic, desde `message_start` a `message_stop`.",
    },
    points: {
      auth: "Auth: `x-api-key` o `Authorization: Bearer`. Ambos tomen su llave de sk-unb.",
      models:
        "Modelo: cualquier id de `GET /v1/models`. El código Anthropic ids Claude envía por defecto, como `claude-sonnet-4-5-20250929`, mapa a nuestro modelo Claude.",
      tools:
        "Herramientas: `tool_use` bloquea hacia fuera, `tool_result` bloquea hacia atrás, como en el Anthropic API.",
      billing:
        "Los mismos créditos, los mismos precios, los mismos límites de tarifas que todos los demás puntos finales.",
    },
    countTokens: {
      title: "Cuento de fichas",
      body: "`POST /v1/messages/count_tokens` cuenta las fichas de entrada de una solicitud Mensajes sin ejecutar el modelo. El Claude Code lo llama a gestionar su contexto.",
    },
  },
  images: {
    title: "Imágenes",
    intro:
      "formato de imágenes OpenAI. Cualquier modelo con imagen de modalidad de `GET /v1/models`. Funciona con el cliente de imágenes de cada OpenAI SDK.",
    generate: {
      title: "Generar",
      body: "Envía JSON con estos campos. La respuesta enumera una url por imagen.",
    },
    params: {
      model:
        "Requerido. Cualquier id con la modalidad `image` de `GET /v1/models`.",
      prompt: "Requerido. Qué dibujar, hasta 2000 caracteres.",
      n: "Imágenes por llamada, 1 a {{maxImages}}. Cada uno está facturado.",
      size: "`WIDTHxHEIGHT` como `1024x1024`, o `auto`. Escogemos el tamaño más cercano de los renders modelo.",
      aspectRatio:
        "Nuestra extensión: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Gana sobre el tamaño.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` y `high` piden el nivel detallado donde el modelo tiene uno.",
      responseFormat:
        "`url` (predeterminado, un enlace firmado válido 7 días) o `b64_json`.",
    },
    edit: {
      title: "Editar una imagen",
      body: "Una imagen de entrada más un impulso. Carguelo como imagen de campo multiparto, o envíe `image_url` (https o datos base64 URL) en JSON. El modelo debe tomar entrada de imagen: `input_modalities` contiene imagen. Las máscaras no son compatibles; describir el cambio en el impulso.",
    },
    points: {
      size: "Escogemos el tamaño más cercano y la relación de los renders modelo.",
      format:
        "url es un enlace firmado con el archivo almacenado, válido 7 días sin llave. `b64_json` devuelve el bytes inline.",
      billing:
        "Billed por imagen. `credits_charged` en la respuesta dice lo que el costo de llamada.",
    },
  },
  speech: {
    title: "Texto al discurso",
    intro:
      "Texto en, audio bytes out. modelo es un id de voz de `GET /v1/models` (habla de moda), como `openai-nova`. El estilo OpenAI también funciona: modelo `tts-1` con voz nova.",
    points: {
      voices:
        "entrada hasta caracteres {{maxChars}}. velocidad 0.25 a 4 en OpenAI, NanoGPT y ElevenLabs voces.",
      formats:
        "`response_format` mp3 (default), opus, aac, flac, wav o pcm. Las que una voz entrega depende de su proveedor; otras responden 400 con la lista.",
      billing:
        "Billed per character. El encabezado `X-Credits-Charged` dice lo que la llamada costó.",
    },
  },
  transcriptions: {
    title: "Transcripción",
    intro:
      "Discurso al texto, formato OpenAI Whisper. Subir multiparte, la misma llamada SDK que ya usas.",
    transcribe: {
      title: "Transcribe",
      body: "archivo hasta {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), modelo como `whisper-1`, idioma opcional. `response_format` json, texto, srt, `verbose_json` o vt.",
    },
    translate: {
      title: "Traducir al inglés",
      body: "`POST /v1/audio/translations` : cualquier idioma hablado, texto en inglés. Corre en `whisper-1`. Los mismos formatos que las transcripciones.",
    },
    points: {
      billing: "Facturado por segundo de audio.",
    },
  },
  videos: {
    title: "Video",
    intro:
      "Async, en la forma de OpenAI 's video API. La llamada responde de inmediato con un trabajo. Votar, luego descargar el MP4.",
    create: {
      title: "Empieza un trabajo.",
      body: "modelo, rápido, segundos, tamaño o `aspect_ratio`, resolución, `negative_prompt`. La respuesta es un objeto de vídeo con el status queued.",
    },
    poll: {
      title: "Votación y descarga",
      body: "`GET /v1/videos/{id}` devuelve el estado (extraído, `in_progress`, completado, fallado), progreso y, cuando está hecho, una url firmada. La votación es gratuita y se salta el límite de velocidad. `GET /v1/videos/{id}/content` transmite el MP4.",
    },
    points: {
      image:
        "Imagen en vídeo: enviar `image_url` en JSON o `input_reference` como una carga multipartida. Se convierte en el primer marco.",
      billing:
        "Facturado cuando el video está listo, por segundo de vídeo. `credits_charged` muestra el costo.",
      failed: "Un trabajo fallido no cuesta nada. El error dice por qué.",
    },
  },
  music: {
    title: "Música",
    intro:
      "Asinc como el video. Iniciar un trabajo, encuesta `GET /v1/music/{id}`, descargar `GET /v1/music/{id}/content`.",
    startTitle: "Empieza un trabajo.",
    pollTitle: "Votación y descarga",
    points: {
      seconds:
        "segundos: unos 8, 20 o 30. El modelo puede redondearlo. Describir estilo, estado de ánimo, instrumentos y tempo en forma rápida.",
      billing:
        "Billed por clip una vez que esté listo. Un trabajo fallido no cuesta nada.",
    },
  },
  mediaFiles: {
    title: "Archivos de medios",
    intro:
      "Cada url en una respuesta mediática apunta aquí. El enlace firmado funciona sin una llave durante 7 días, por lo que puede entregarlo a un navegador o a un usuario. Con tu llave API el mismo camino funciona en cualquier momento.",
  },
  codingTools: {
    title: "Herramientas de codificación",
    intro:
      "Una base URL, una llave. Codex CLI y Claude Code conectan de forma nativa. OpenCode, Continue, Aider y Cline usan las terminaciones de chat. Escoge tu herramienta, copia el bloque, ejecutelo.",
    keyPage:
      "La página de teclas API muestra los mismos bloques con tu llave ya llenada.",
    keyPageCta: "Llévenlos con tu llave.",
    guide: "Lea la guía de herramientas de codificación",
  },
  sdks: {
    title: "SDK ejemplos",
    intro:
      "Los SDK oficiales OpenAI y Anthropic funcionan sin cambios. Establecer la base URL y la clave, mantener el resto de su código.",
    chat: "Chat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "Anthropic SDK",
    images: "Imágenes",
    speech: "Discurso",
    transcription: "Transcripción",
  },
  guides: {
    title: "Guías",
    intro:
      "Guías más completas: pasar de OpenAI u OpenRouter, usar modelos sin censura por API y conectar tu clave a herramientas de programación.",
  },
  cta: {
    title: "Desarrolla con todos los modelos.",
    subtitle:
      "Crea una clave, configura la URL en tu SDK y empieza a hacer solicitudes.",
    button: "Crear una tecla API",
    secondary: "Comparar planes",
  },
};
