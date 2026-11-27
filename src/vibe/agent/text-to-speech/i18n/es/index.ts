// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/es";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Discurso",
    tts: "Texto a texto",
    ai: "IA",
  },

  post: {
    title: "Texto para el discurso",
    titleShort: "Texto para el discurso",
    dynamicTitle: "Discurso: {{text}}",
    description:
      "Convertir texto en discurso. Pase el texto y una voz id. Utilice la herramienta de modelos (modelType =audio) para ver los modelos de voz disponibles. Cada uno tiene un id único para pasar como parámetro de voz. Costo: por personaje a la velocidad de la voz elegida (ver la herramienta de modelos). Devuelve audioUrl.",
    form: {
      title: "Texto a la conversión del habla",
      description: "Escriba texto para convertir al discurso",
    },
    text: {
      label: "Texto",
      description: "Texto para convertir al discurso (máximo 5000 caracteres)",
      placeholder: "Escriba el texto que desea convertir al discurso...",
    },
    voice: {
      label: "Voz",
      description:
        "Modelo de voz. Utilice la herramienta de modelos (modelType =audio) para navegar por las voces disponibles y sus ids.",
    },
    download: "Descargar",
    response: {
      title: "Resultado de audio",
      description: "El audio del discurso generado",
      success: "Operación completada",
      audioUrl: "Audio URL",
      creditCost: "Créditos utilizados",
    },
    submitButton: {
      label: "Habla.",
      loadingText: "Sintetizando...",
    },
    errors: {
      validation_failed: {
        title: "Error de validación",
        description: "El texto o los parámetros proporcionados son inválidos",
      },
      network_error: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes iniciar sesión para usar texto a palabra",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para usar texto a palabra",
      },
      not_found: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      server_error: {
        title: "Error del servidor",
        description: "Se produjo un error al convertir el texto en el discurso",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      noTtsProviderConfigured:
        "No se configura ningún proveedor de texto a palabra. Agregue OPENAI_API_KEY, EDEN_AI_API_KEY, o ELEVENLABS_API_KEY, o conecte un proveedor de inferencia del sistema.",
      notConfigured:
        "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
      conversionFailed: "Sintetización del discurso falló: {{error}}",
      providerUnavailable:
        "El proveedor de voz no está disponible temporalmente. No se descontaron créditos. Inténtalo de nuevo en un momento o elige otra voz.",
      noText: "No se proporcionó texto",
      noAudioUrl: "No se recibió ningún URL de audio del proveedor",
      audioFetchFailed:
        "Incapaz de crear el archivo de audio. Por favor, inténtelo de nuevo.",
      providerError: "Error del proveedor: {{error}}",
      internalError: "Error del servidor interno",
      unsupportedProvider: "Proveedor TTS sin soporte para voz: {{voiceId}}",
      creditsFailed: "Fallado para deducir créditos: {{error}}",
      balanceCheckFailed:
        "Incapaz de comprobar su saldo de crédito. Por favor, inténtelo de nuevo.",
      insufficientCredits:
        "Créditos insuficientes para convertir el texto a voz. Saldo: {{balance}}, mínimo requerido: {{minimum}}. Recarga para continuar.",
    },
    success: {
      title: "Operación completada",
      description: "Texto convertido al discurso con éxito",
      conversionComplete: "Sintetización de discursos terminada con éxito",
    },
  },
  languages: {
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    es: "Español",
    sk: "Eslovaco",
    hi: "Hindi",
    fr: "Francés",
    it: "Italiano",
  },
  models: {
    descriptions: {
      qwen3Ryan:
        "Ryan lee en voz alta en 10 idiomas, incluido el alemán, con el modelo de voz abierto Qwen3.",
      orpheusTara:
        "Tara lee en inglés con una entonación expresiva y efectos de voz.",
      openaiAlloy:
        "Aleación OpenAI - Voz equilibrada y neutral para el contenido profesional",
      openaiNova:
        "OpenAI Nova - Caliente, voz amigable ideal para aplicaciones conversales",
      openaiOnyx:
        "OpenAI Onyx - Voz profunda y autorizada para el contenido formal",
      openaiEcho: "OpenAI Echo - Voz clara y articulada con ritmo natural",
      openaiShimmer:
        "OpenAI Shimmer - Voz expresiva y dinámica para contenido atractivo",
      openaiFable: "OpenAI Fable - Voz expresiva, narrativa",
      elevenlabsRachel:
        "ElevenLabs Rachel - Voz femenina natural con rango emocional",
      elevenlabsJosh:
        "ElevenLabs Josh - Voz masculina natural con tono de conversación",
      elevenlabsBella:
        "ElevenLabs Bella - Caliente voz femenina con entrega suave",
      elevenlabsAdam:
        "ElevenLabs Adam - Voz masculina profesional para la creación de contenido",
      elevenlabsRachelTurbo:
        "ElevenLabs Rachel Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
      elevenlabsJoshTurbo:
        "ElevenLabs Josh Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
      elevenlabsBellaTurbo:
        "ElevenLabs Bella Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
      elevenlabsAdamTurbo:
        "ElevenLabs Adam Turbo - La misma voz en v4 Turbo. La mitad del precio, respuestas casi instantáneas.",
      kokoroBella:
        "Kokoro Bella - Modelo de 82M de peso abierto, cálida voz femenina americana. Sin filtro de contenido.",
      kokoroSarah:
        "Kokoro Sarah - Modelo de 82M de peso abierto, clara voz femenina americana. Sin filtro de contenido.",
      kokoroNicole:
        "Kokoro Nicole - Modelo de 82M de peso abierto, suave voz femenina de bajo llave. Sin filtro de contenido.",
      kokoroAdam:
        "Kokoro Adam - Modelo 82M de peso abierto, voz masculina americana estable. Sin filtro de contenido.",
      kokoroMichael:
        "Kokoro Michael - Modelo de 82M de peso abierto, voz masculina americana segura. Sin filtro de contenido.",
      kokoroEmma:
        "Kokoro Emma - Modelo de 82M de peso abierto, voz femenina británica. Sin filtro de contenido.",
      kokoroGeorge:
        "Kokoro George - Modelo 82M de peso abierto, voz masculina británica. Sin filtro de contenido.",
      voxtralPaul:
        "Voxtral Mini lee textos en inglés con la voz neutra de Paul.",
      inworldAshley:
        "Inworld Ashley - Voz femenina rápida y de bajo costo con entrega animada.",
      inworldCraig:
        "Inworld Craig - Voz masculina británica rápida y de bajo costo.",
      xaiEve:
        "xAI Eve - Voz femenina expresiva con controles de emoción inline.",
      geminiZephyr:
        "Gemini Zephyr - Voz femenina brillante, 100+ idiomas, instrucciones de entrega.",
      geminiPuck:
        "Gemini Puck - Voz masculina alta, 100+ idiomas, instrucciones de entrega.",
    },
    names: modelTranslations.names,
  },
};
