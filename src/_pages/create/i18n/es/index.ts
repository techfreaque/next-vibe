import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "AI generation",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Media Studio",
  navName: "Studio",
  hub: {
    metaTitle: "Estudio multimedia IA: imágenes, vídeo, música y voz",
    metaDescription:
      "Genera imágenes, clips de vídeo, música y voz, o transcribe audio. Modelos populares y sin censura, uno al lado del otro. Pagas por resultado.",
    keywords:
      "estudio multimedia IA, generador de imágenes IA sin censura, generador de vídeo IA, generador de música IA, texto a voz, voz a texto",
    title: "Estudio multimedia",
    subtitle:
      "Cinco herramientas. Todos los grandes modelos, también los sin censura. Pagas por resultado y te quedas con todo lo que creas.",
    from: "Desde {{price}}",
    free: "Gratis",
    models: "{{count}} modelos",
    voices: "{{count}} voces",
    open: "Abrir",
  },
  asyncProgress:
    "En marcha. El vídeo y la música suelen tardar de uno a tres minutos. El progreso también aparece en tu historial.",
  ooc: {
    title: "No tienes suficientes créditos gratis",
    need: "Esta generación cuesta {{amount}} créditos.",
    description:
      "Una cuenta gratuita recibe {{signedIn}} créditos al mes, {{max}} con la newsletter. Tras registrarte vuelves aquí con tus ajustes intactos.",
    signUp: "Regístrate gratis",
    defaults: "Ajustes más baratos",
    haveAccount: "¿Ya tienes cuenta?",
    logIn: "Inicia sesión",
  },
  moreOptions: "Más opciones",
  modelDefault: "Automático",
  model: "Modelo",
  voice: "Voz",
  estimate: "Costo estimado",
  credits: "Créditos {{amount}}",
  failed: "La generación falló",
  historyError:
    "No podía abrir su historia de Studio. Por favor, inténtalo de nuevo.",
  unavailable: "No hay modelo disponible para este generador ahora mismo.",
  file: "Archivo de audio",
  language: "Grabación del idioma",
  referenceAudio: "Audio de referencia URL",
  durationSeconds: "Longitud de grabación en segundos",
  duration: "Duración",
  ratio: "Relación entre los aspectos",
  size: "Tamaño",
  quality: "Calidad",
  reference: "Imagen de referencia URL",
  lastFrame: "Último marco URL",
  creating: "Generación · {{seconds}}",
  submitImage: "Generar imagen",
  submitVideo: "Generar vídeo",
  submitMusic: "Generar música",
  submitSpeech: "Generar discurso",
  submitTranscribe: "Transcribe audio",
  meteredCost: "La carga final utiliza el uso reportado del proveedor.",
  estimatePending: "Añade audio para calcular el coste.",
  needsCredits: "Requiere {{amount}} créditos",
  units: {
    image: "Créditos {{amount}} / imagen",
    video: "Créditos {{amount}} / sec",
    music: "Créditos {{amount}} / pista",
    speech: "Créditos {{amount}} / 1.000 caracteres",
    transcribe: "Créditos {{amount}} / min",
    tokenImage: "♥ créditos {{amount}} / imagen",
  },
  kinds: {
    image: {
      label: "Imagen",
      tab: "Imagen",
      pitch:
        "De texto a imagen, o retoca una referencia. Fotorrealista, anime, arte: lo que describas.",
      title: "Crear una imagen",
      metaTitle: "Generador de imagen AI sin censura - {{appName}}",
      description: "Describir una escena y elegir su encuadre.",
      keywords: "generador de imagen AI sin censura, arte AI, texto a imagen",
    },
    video: {
      label: "Video",
      tab: "Vídeo",
      pitch:
        "Un texto o un primer fotograma se convierte en un clip. Tú eliges duración, formato y resolución.",
      title: "Crear un vídeo",
      metaTitle: "Generador de vídeo AI - {{appName}}",
      description:
        "Ponga una escena en movimiento, desde el primer marco hasta el último.",
      keywords: "Generador de vídeo AI, texto a vídeo, imagen a vídeo",
    },
    music: {
      label: "Música",
      tab: "Música",
      pitch:
        "Una pista completa a partir de un prompt: ambiente, género, instrumentos, duración.",
      title: "Haz música",
      metaTitle: "Generador de música AI - {{appName}}",
      description:
        "Describir el estado de ánimo, los instrumentos y la longitud de su pista.",
      keywords: "Generador de música AI, texto a música, canción AI",
    },
    speech: {
      label: "Discurso",
      tab: "Voz",
      pitch: "Tu texto leído por voces naturales en muchos idiomas.",
      title: "Dale un mensaje a la voz.",
      metaTitle: "AI texto al discurso - {{appName}}",
      description: "Escoge una voz para leer tu guión en voz alta.",
      keywords: "texto a discurso, voz AI, TTS",
    },
    transcribe: {
      label: "Transcripción",
      tab: "Texto",
      pitch:
        "Sube una grabación y recibe texto limpio. Descárgalo como archivo.",
      title: "Transcribe audio",
      metaTitle: "Discurso de AI al texto - {{appName}}",
      description:
        "Convierta una grabación en una transcripción que puede descargar.",
      keywords: "texto, transcripción AI, audio a texto",
    },
  },
};
