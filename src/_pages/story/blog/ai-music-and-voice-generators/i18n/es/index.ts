import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Música, voz y transcripción con IA | {{appName}}",
    description:
      "{{musicCount}} modelos de música con IA, {{voiceCount}} voces de texto a voz, {{sttCount}} modelos de transcripción. Alternativas a Suno, precios reales por clip y minuto. Créditos gratis.",
    category: "Comparación de modelos",
    imageAlt:
      "{{appName}} : Modelos de música, voz y transcripción AI comparados",
    keywords:
      "AI generador de música, alternativa Suno, AI generador de canciones, AI generador de ritmo, Lyria 3, ElevenLabs Música, Sonauto, MusicGen, AI texto a discurso, AI generador de voz, AI generador de voz créditos gratis, texto a voces de discurso, ElevenLabs alternativa, Kokoro TTS, Gemini TTS, discurso al texto, AI transcripción, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Comparación de modelos",
    readTime: "11 min leer",
    title: "Canciones, ritmos, voces y transcripciones. Una sola cuenta.",
    subtitle:
      "{{musicCount}} modelos de música, {{voiceCount}} voces y {{sttCount}} modelos de transcripción con un solo saldo en {{appName}}. Cuánto cuesta cada clip, minuto u hora y qué modelo conviene para cada tarea.",
  },
  intro: {
    lead: "Una aplicación de música. Una aplicación de voz. Una aplicación de transcripción. Tres suscripciones, tres entradas, tres montones de créditos que caducan. Todo lo que querías era un jingle, una voz y una transcripción.",
    p2: "{{appName}} ejecuta modelos de audio {{modelCount}} de laboratorios {{labCount}} en un saldo de crédito. Cada número de abajo viene en vivo de nuestro registro modelo: longitudes, voces, niveles, precios reales. Cuatro trabajos, cuatro respuestas:",
    songs:
      "Canciones con voces: Sonauto, ElevenLabs Music, Lyria 3 Pro. Sube a los segundos de {{longestMusic}}.",
    beats:
      "Beats and instrumentals: MusicGen Stereo, ModelosLab Music Gen, Lyria 3.",
    voiceovers:
      "Voces y lectura de voz: voces {{voiceCount}}, {{cheapVoiceMinute}} a {{priceyVoiceMinute}} por minuto de discurso.",
    transcription:
      "Transcripción: {{sttCount}}, {{cheapSttHour}} a {{priceySttHour}} por hora de audio.",
  },
  tiers: {
    mainstream: "Convencional",
    open: "Abierto",
    uncensored: "Sin censura",
  },
  music: {
    title: "Generador de música AI: todos los modelos {{musicCount}}",
    intro:
      "El clip más barato primero. Los precios incluyen nuestra marca {{markup}} %. 1 crédito = {{creditValue}}.",
    colModel: "Modelo",
    colLength: "Longitud del clip",
    colTier: "Tier",
    colCredits: "Créditos / clip",
    colPrice: "Precio / clip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Un precio por clip, cualquier longitud que elijas. Pida una longitud que el modelo no ofrece y la solicitud se ajusta al más cercano que hace.",
    factLine: "Créditos {{credits}} ({{price}}) por clip · {{length}}",
    picks: {
      songs: {
        title: "Canciones con voces",
        body: "Un cantante y un gancho. Describir el género, el humor, la voz y de qué se trata la canción. Estos modelos se construyen para canciones que cantan.",
      },
      beats: {
        title: "Beats and instrumentals",
        body: 'Música de fondo, bucles para un video, un ritmo para violar. Sin voces. Género de nombre, tempo e instrumentos: "lo-fi hip hop, 85 bpm, polvoriento piano, vinilo crackle".',
      },
      short: {
        title: "clips cortos, picaduras, jingles",
        body: "Intros, sonidos de notificación, un corte de podcast. Corto y barato. Haz diez, guarda uno.",
      },
    },
    suno: "¿Buscando una alternativa de Suno? Suno y Udio no están en {{appName}}. Lo que obtienes en su lugar: modelos de música {{musicCount}} en un solo saldo, desde {{cheapMusicPrice}} a clip, sin suscripción adicional. La captura honesta: los clips se detienen en segundos {{longestMusic}}. Las pistas completas de tres minutos todavía pertenecen a las aplicaciones de canciones dedicadas.",
    toolLink: "Abre el generador de música",
  },
  voices: {
    title: "Texto AI al discurso: Voces {{voiceCount}} comparadas",
    intro:
      "El más barato primero. Billed per character of text. La última columna calcula un minuto de discurso sobre los caracteres {{charsPerMinute}}.",
    colVoice: "Voz",
    colCharacter: "Sonido",
    colTier: "Tier",
    colCredits: "Créditos / 1.000 chars",
    colMinute: "Alrededor de 1 min de discurso",
    gender: {
      male: "Hombre",
      female: "Mujer",
      neutral: "Neutral",
    },
    style: {
      conversational: "conversaciones",
      warm: "cálido",
      deep: "profundo",
      expressive: "expresiva",
      calm: "Calma.",
      friendly: "amigable",
      authoritative: "autoritativa",
      clear: "clara",
      soft: "suave",
      steady: "constante",
      confident: "confiada",
      british: "Británicas",
      lively: "vivaz",
      bright: "brillante",
      upbeat: "Subtítulo",
    },
    footnote:
      "Las tarifas incluyen nuestra marca {{markup}} %. El minuto es una estimación: los conversadores rápidos y las palabras largas lo cambian. Pagas por los personajes que envías, no los segundos que vuelvas.",
    factLine:
      "Créditos {{credits}} / 1.000 chars · sobre {{minute}} por minuto · {{character}}",
    picks: {
      everyday: {
        title: "Todos los días de lectura-salud",
        body: "Limpio, claro, barato lo suficiente para salir. {{defaultVoice}} es la voz predeterminada para leer respuestas en voz alta.",
      },
      natural: {
        title: "Lo más natural: voces que publicas",
        body: "Gama emocional, estimulación humana. Para la narración YouTube, anuncios, muestras de audiolibro. Las voces más bonitas aquí, así que termina el guión primero y renderiza una vez.",
      },
      multilingual: {
        title: "Muchos idiomas, una voz",
        body: "Las voces Gemini hablan más de 100 idiomas y siguen instrucciones de entrega: más lento, susurrado, excitado.",
      },
      expressive: {
        title: "Personajes y narración",
        body: "Más drama, más rango. Construido para ficción, personajes de juego, escenas de juego.",
      },
      budget: {
        title: "Más barato, sin filtro de contenido",
        body: "Kokoro es un modelo 82M de peso abierto. Las voces {{uncensoredVoiceCount}} Kokoro se sientan en nuestro nivel sin censura: ningún filtro de contenido en lo que leen. También son las voces más baratas en la plataforma.",
      },
    },
    languages:
      "Cada voz aquí está sintonizada para el inglés. Las voces Gemini manejan 100 idiomas más. El resto puede leer otros idiomas, a menudo con acento. Pruebe una frase antes de hacer un guión completo.",
    toolLink: "Texto abierto al discurso",
  },
  stt: {
    title: "transcripción AI: discurso {{sttCount}} a los modelos de texto",
    intro:
      "Los más baratos por minuto primero. Facturado por segundo de audio. Los precios incluyen nuestra marca {{markup}} %.",
    colModel: "Modelo",
    colTier: "Tier",
    colCredits: "Créditos / minuto",
    colHour: "Precio / hora",
    footnote:
      "Cuando un proveedor informa de su costo real para un trabajo, facturamos que costó más el marcado. Una carga final puede aterrizar ligeramente fuera de la mesa.",
    factLine: "Créditos {{credits}} / minuto · {{hour}} por hora",
    picks: {
      cheapest: {
        title: "Más barato: horas de audio para centavos",
        body: "Whisper de peso abierto, 99 idiomas. Una suscripción cubre las horas de audio {{subSttHours}} a este ritmo.",
      },
      accuracy: {
        title: "Precisión primero",
        body: "Menos palabras equivocadas, mejor detección de idiomas. Para entrevistas, citas, cualquier cosa que publiques. {{defaultStt}} es el predeterminado para la entrada de voz.",
      },
      languages: {
        title: "Muchos idiomas",
        body: "Whisper cubre 99 idiomas, Nemotron 40 locales. Voxtral es el modelo de transcripción Mistral, construido para grabaciones de hasta 10 minutos.",
      },
      fast: {
        title: "Rápida y ruidosa.",
        body: "Baja latencia, se mantiene en habitaciones ruidosas. Hecho para notas de voz rápidas y dictado.",
      },
    },
    toolLink: "Discurso abierto al texto",
  },
  chat: {
    title: "Cómo funciona en el chat",
    intro:
      "No hay aplicación separada. Música, voz y transcripción viven dentro de cada chat en {{appName}}.",
    steps: {
      song: {
        title: "Pide una canción",
        body: 'Tipo "Haga una introducción de 30 segundos sintwave para mi podcast". El AI llama al generador de música con el modelo musical de tu habilidad, {{defaultMusic}} a menos que lo hayas cambiado. Nombra otro modelo en el aviso para cambiar.',
      },
      voice: {
        title: "Escucha cualquier respuesta",
        body: "Pulse el icono del altavoz en una respuesta y se lee en voz alta en la voz de su habilidad, {{defaultVoice}} por defecto. Establecer una voz diferente por habilidad.",
      },
      dictate: {
        title: "Hablar en lugar de escribir",
        body: "Toca el micrófono y habla. {{defaultStt}} transscribe tus palabras en la entrada, o la grabación va directamente a los modelos que entienden el audio.",
      },
      transcribe: {
        title: "Transcribe archivos enteros",
        body: "Reuniones, entrevistas, memos de voz: suban a archivos {{sttMaxFiles}} en el discurso a la página de texto y eligen el modelo.",
      },
      call: {
        title: "Modo de llamada",
        body: "Sin manos. Hablas, el AI responde en voz alta, contestas. Voz en, voz fuera, el mismo saldo.",
      },
    },
    toolPages:
      "¿Quieres un control completo? Cada trabajo tiene su propia página: elegir el modelo o la voz, fijar la longitud del clip, pegar un largo script.",
  },
  pricing: {
    title: "Lo que la música y la voz AI cuestan aquí",
    intro:
      "Tres fórmulas, un saldo. Precio del proveedor más nuestra marca {{markup}} %. 1 crédito = {{creditValue}}.",
    music:
      "Música: un precio plano por clip. De {{cheapMusicCredits}} credits ({{cheapMusicPrice}}) en {{cheapMusicName}} a {{priceyMusicCredits}} credits ({{priceyMusicPrice}}) en {{priceyMusicName}}.",
    voice:
      "Voz: por personaje. De {{cheapVoiceCredits}} créditos por 1.000 caracteres en {{cheapVoiceName}} a {{priceyVoiceCredits}} en {{priceyVoiceName}}.",
    stt: "Transcripción: por segundo de audio. Desde {{cheapSttCredits}} créditos por minuto en {{cheapSttName}} a {{priceySttCredits}} en {{priceySttName}}.",
    failed:
      "Los créditos salen solo una vez que tengas el resultado. Trabajo fallido, tiempo libre, no se le dio el aviso: no pagas nada.",
    free: "Gratis: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with the newsletter. {{freeCredits}} credits buy {{freeClips}} clips on {{cheapMusicName}}, or about {{freeVoiceMinutes}} minutes of {{cheapVoiceName}}.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    link: "Ver planes y paquetes de crédito",
  },
  limits: {
    title: "Los límites, rectos",
    intro: "Conoce los bordes antes de gastar un crédito.",
    musicLength:
      "Los clips de música ejecutan los segundos de {{longestMusic}} como máximo. Sin pistas de tres minutos, sin extender un clip.",
    musicFlat:
      "Un clip cuesta lo mismo a cada longitud. Los clips cortos son la manera barata de probar un aviso, no un descuento.",
    noSuno: "No Suno, no Udio. Sus API no están en {{appName}}.",
    ttsLength:
      "Texto al discurso lleva hasta caracteres {{ttsMaxChars}} por petición. Escribirlos más largos: dividirlos.",
    sttFiles:
      "La transcripción lleva hasta los archivos {{sttMaxFiles}} por solicitud, {{sttMaxMb}} MB cada uno.",
    noCloning:
      "No hay clonación de voz. Eliges de las voces de la mesa. No puedes subir la tuya.",
    filters:
      "La mayoría de los modelos de música y voz corren detrás de la moderación de su proveedor. Se puede rechazar un aviso previo. Esa negativa no cuesta nada.",
    callout:
      "Antes de publicar: verifique los términos del proveedor para el uso comercial de la música generada y las voces. Las reglas difieren por laboratorio, y cambian.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "¿Cuál es el mejor generador de música AI?",
      a: "Depende de la pista. Canciones con voces: Sonauto o ElevenLabs Music. Carriles cortos pulido: Lyria 3 Pro. Beats and loops: MusicGen Stereo. Los más baratos: {{cheapMusicName}} en {{cheapMusicPrice}} a clip. Todos los {{musicCount}} funcionan con un saldo {{appName}}, así que cambia por clip.",
    },
    suno: {
      q: "¿Hay una buena alternativa Suno?",
      a: "Para canciones cortas y ritmos, sí: Sonauto, ElevenLabs Music y Google 's Lyria 3 corren aquí en un saldo, desde {{cheapMusicPrice}} a clip, sin suscripción adicional. Para canciones completas de tres minutos, aún no: los clips aquí paran en segundos {{longestMusic}}.",
    },
    vocals: {
      q: "¿Puede AI hacer canciones con voces?",
      a: "Sí. Pregunte a Sonauto, ElevenLabs Music o Lyria 3 Pro para una canción y describir el tema, el estado de ánimo y el cantante. Modelos instrumentales como MusicGen Stereo hacen música sin voz.",
    },
    bestVoice: {
      q: "¿Qué generador de voz AI suena más natural?",
      a: "Para lectura diaria, las voces OpenAI como {{defaultVoice}} suenan limpias y cuestan poco. Más expresivo: xAI Eve e Inworld. Para muchos idiomas: Gemini. Por el precio más bajo y sin filtro: Kokoro.",
    },
    free: {
      q: "¿Hay un generador de voz AI con créditos gratis?",
      a: "Sí. Créditos gratuitos {{guestCredits}} al mes sin cuenta, {{freeCredits}} con una cuenta gratuita, {{maxCredits}} con el boletín informativo. En {{cheapVoiceName}} que es sobre los minutos de habla {{freeVoiceMinutes}}. Los mismos créditos pagan por música y transcripción.",
    },
    transcribeCost: {
      q: "¿Cuánto cuesta la transcripción AI?",
      a: "Desde {{cheapSttHour}} por hora de audio en {{cheapSttName}} a {{priceySttHour}} en {{priceySttName}}. Billado por segundo. Los trabajos fallidos no cuestan nada.",
    },
    cloning: {
      q: "¿Puedo clonar mi propia voz?",
      a: "No. {{appName}} ofrece voces preparadas {{voiceCount}}. Sin clonar, sin subir tu propia voz.",
    },
    uncensored: {
      q: "¿Hay un modelo de texto a voz sin censura?",
      a: "Sí. {{uncensoredVoiceCount}} Kokoro voces se sientan en nuestro nivel sin censura: un modelo de peso abierto sin filtro de contenido en lo que lee. La mayoría de los modelos de música y las otras voces corren detrás de los filtros de su proveedor.",
    },
    modelsLink: "Examine todos los modelos con especificaciones y precios",
    videoLink: "¿Necesitas vídeo también? Generadores de vídeo AI comparados",
    pricingLink: "Ver planes y precios",
  },
  partners: {
    body: "¿Hacer música, podcasts o contenido de voz? El programa de socios {{appName}} le paga una parte recurrente de cada pago que se refiere.",
    link: "Únase al programa partner",
  },
  cta: {
    title: "Elige un modelo. Pulsa reproducir.",
    subtitle:
      "Canciones, ritmos, voces y transcripciones de un saldo. Comience con créditos gratuitos {{guestCredits}}, sin cuenta necesaria.",
    music: "Haz música",
    voice: "Generar una voz",
    transcribe: "Transcribe audio",
    models: "Examine todos los modelos",
  },
};
