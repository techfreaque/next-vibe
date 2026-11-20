import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "{{modelCount}} generadores de video con IA: Kling, Seedance y más | {{appName}}",
    description:
      "Generadores de vídeo {{modelCount}} AI comparados: Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Texto e imagen a vídeo, precios reales, sin marca de agua de nosotros.",
    category: "Comparación de modelos",
    imageAlt: "{{appName}} : Generadores de vídeo AI comparados lado a lado",
    keywords:
      "lo mejor AI generador de vídeo, AI generador de vídeo, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagínate el video. Gemini Omni, Runway Gen-4.5, imagen a vídeo AI, texto a vídeo AI, AI generador de vídeo sin marca de agua, AI video generador precio por segundo, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Comparación de modelos",
    readTime: "10 min leer",
    title:
      "{{modelCount}} generadores de video con IA comparados. Un solo saldo.",
    subtitle:
      "Kling frente a Seedance, Veo frente a Sora, Wan, Hailuo, Grok Imagine y Gemini Omni. Compara el precio por segundo, la duración, el control de fotogramas y el sonido. Elige el modelo para tu escena y genérala desde cualquier chat en {{appName}}.",
  },
  intro: {
    lead: "Cada laboratorio llama a su modelo el mejor generador de vídeo AI. Cada uno quiere su propia aplicación, sus propios créditos, su propia suscripción. Quieres una cosa: el clip adecuado para el trabajo, a un precio que ves antes de que llegues a generar.",
    p2: "{{appName}} ejecuta modelos de vídeo {{modelCount}} de laboratorios {{labCount}} en un saldo de crédito: Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway y más. A continuación, todos ellos lado a lado, directamente de nuestro registro modelo en vivo: entradas, control de marcos, longitud, resolución, sonido y el precio real por segundo. Luego las selecciones por trabajo, la cabeza a cabeza, cómo hacer un clip de cualquier chat, y los límites que nadie pone en la página de aterrizaje.",
  },
  table: {
    title: "Todos los modelos de vídeo {{modelCount}}, lado a lado",
    intro:
      "Cada modelo actual de los laboratorios {{labCount}}, más barato por segundo primero. Los precios incluyen nuestra marca {{markup}} %. 1 crédito = {{creditValue}}.",
    colModel: "Modelo",
    colInput: "Input",
    colFrames: "Frames",
    colLength: "Duración",
    colResolution: "Resolución",
    colAudio: "Audio",
    colRate: "Créditos / sec",
    colClip: "Chat clip",
    i2v: "Texto o imagen",
    t2v: "Texto",
    v2v: "Texto y vídeo",
    videoAudio: "Video y audio",
    framesFirst: "Primer marco",
    framesFirstLast: "Primer y último marco",
    framesNone: "No control de marco",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} a {{max}} s",
    resolutionDefault: "Predeterminado del proveedor",
    audioYes: "Audio nativo",
    audioNo: "Silent",
    withImage: "Con imagen: {{credits}}",
    clipValue: "Créditos {{credits}}, {{seconds}} s",
    footnote:
      'Créditos / sec es la tasa en la resolución predeterminada del modelo. Cuando la resolución cambia el precio, la línea pequeña lista cada tarifa. "Con imagen" es la tasa cuando una imagen adjunta mueve el trabajo a la ruta de imagen de ese modelo. El clip de chat es lo que una solicitud de los costos de chat: Segundos {{seconds}}, se rompió a la longitud más cercana el soporte del modelo.',
    allModels: "Ver todos los modelos con las especificaciones completas",
  },
  picks: {
    title: "El mejor generador de vídeo AI para cada trabajo",
    intro:
      "No hay nada mejor. Hay el mejor ajuste para el disparo. Seis puestos de trabajo, los modelos que se ajustan a ellos, los hechos duros bajo cada uno.",
    factLine:
      "{{rate}} credits/s · hasta {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "La mejor calidad: el disparo final",
      body: "Cuando el clip es la entregable. Realismo cinematográfico, física creíble, pulido. Estos se sientan en la parte superior de la gama de precios, así que clave el impulso en un modelo barato primero, luego render aquí.",
    },
    budget: {
      title: "Los más baratos: borradores y volumen",
      body: "Incitaciones de prueba, iteran en movimiento, alimentan socialmente a volumen. Menos detalles, una factura mucho más pequeña. La mayoría de sus intentos pertenecen aquí.",
    },
    long: {
      title: "clips más largos: una toma continua",
      body: "Hasta los segundos de {{longestSeconds}} en un solo clip. Menos cortes, menos costuras cosidas. Establece la longitud en la página del generador de vídeo; una solicitud de chat pide segundos {{seconds}}.",
    },
    frames: {
      title: "Inicio y control de marco final",
      body: "Entrega el primer marco y el último, el modelo llena el movimiento entre. Transitions, product reveals, clean loops. Los modelos {{lastFrameCount}} toman un último marco.",
    },
    audio: {
      title: "Sonido nativo en el mismo paso",
      body: "Imagen y audio en una generación: ambiente, efectos y en algunos modelos de diálogo. No hay paso de sonido separado, sin sincronización a mano. Los modelos {{audioCount}} hacen el sonido nativamente.",
    },
    editing: {
      title: "Especialistas: avatares, sincronía de labios, edición",
      body: "No para escenas frescas desde un momento. Omnihuman 1.5 anima a una persona de una foto y una pista de audio. Lipsync 2 coincide con las bocas en las imágenes existentes a una nueva voz. Gen4 Aleph edita las imágenes existentes: añadir o eliminar objetos, reestilo, relight, cambiar el ángulo de la cámara.",
    },
  },
  versus: {
    title: "Cabeza a cabeza: las personas que buscan",
    intro:
      "Cuatro comparaciones que aparecen una y otra vez. Para qué se construye cada modelo, y cuándo escoger cuál.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} es la selección de valor de la línea Kling 3: movimiento animado, convincente, audio nativo, primer y último cuadro, clips hasta segundos {{aMax}}. La captura: 720p es el techo. {{b}} alcanza hasta 4K y toma la entrada de referencia que mantiene caracteres recurrentes consistentes a través de los disparos. Por segundo: créditos {{aRate}} para {{a}}, {{bRate}} para {{b}}. Bordes y clips sociales: {{a}}. Historias con la misma escena del personaje después de la escena: {{b}}.",
    veoSora:
      "{{a}} es el buque insignia de Google: realismo cinematográfico, audio nativo con diálogo y efectos, primer y último marco, una imagen como la toma de apertura, hasta 4K. {{b}} es OpenAI 's, conocida por la física creíble. En esta plataforma sólo se necesita texto, paisaje solamente. Longitud máxima: segundos {{aMax}} para {{a}}, {{bMax}} para {{b}}. Por segundo: créditos {{aRate}} contra {{bRate}}. Necesita sonido o una imagen inicial: {{a}}. Límite de texto puro, más tiempo tomar: {{b}}.",
    hailuoWan:
      "{{a}} va para la nitidez: salida 2K, audio nativo, primer y último marco, clips hasta segundos {{aMax}}. {{b}} va por longitud: hasta segundos {{bMax}} en una toma, audio nativo, control de marco, 480p a 1080p, más un nivel de 480p barato para los borradores. Por segundo: créditos {{aRate}} para {{a}}, {{bRate}} para {{b}}. Disparos cortos de crisis: {{a}}. Larga toma un presupuesto: {{b}}.",
    grokGemini:
      "{{a}} es de xAI: 480p a 1080p, un primer marco opcional, sin sonido, clips hasta segundos {{aMax}}. {{b}} es Google 's: audio nativo, primer y último cuadro, 360p hasta 4K, clips hasta segundos {{bMax}}. Por segundo: créditos {{aRate}} contra {{bRate}}. Control de sonido y marco: {{b}}. clips silenciosos rápidos a cualquier longitud de un segundo: {{a}}.",
    verdict:
      "Ningún modelo gana cada trabajo. Empieza barato: {{cheapestName}} se ejecuta en créditos {{minRate}} un segundo. Los modelos {{audioCount}} lo hacen de forma nativa. {{lastFrameCount}} toma un último marco. Pagar la prima sólo por el render que guardas.",
  },
  chat: {
    title: "Haga un vídeo de cualquier chat",
    intro:
      "No hay aplicación independiente, no hay cuenta nueva. Pregunte en cualquier chat en {{appName}} y el AI llama al generador de vídeo para usted.",
    steps: {
      ask: {
        title: "Describir el disparo",
        body: 'Asunto, movimiento, cámara, estado de ánimo. Palabras sencillas. "Un zorro pasa por la nieve fresca al amanecer, bajo tiro de rastreo." El AI lo convierte en una petición de generación.',
      },
      model: {
        title: "Utilice el predeterminado, o nombre un modelo",
        body: 'La configuración de vídeo de tu habilidad elige el modelo, {{defaultModel}} a menos que lo cambies. ¿Quieres otro? Dilo en el aviso: "usar Kling 3.0". El AI pasa ese modelo.',
      },
      image: {
        title: "Adjuntar una imagen para animarla",
        body: "Suelta una imagen y se convierte en el marco de apertura. Eso es imagen a vídeo. Si su modelo no puede tomar imágenes, el trabajo se mueve a la ruta de imagen de ese modelo, o al modelo más barato que toma uno.",
      },
      lastFrame: {
        title: "Pin el último marco",
        body: "Adjuntar una segunda imagen y decir que es el final. El modelo anima de uno a otro. Funciona en los modelos {{lastFrameCount}}, y ambos marcos deben ser imágenes. También puede añadir imágenes, audio o vídeo como referencias para guiar el look.",
      },
      result: {
        title: "Cuidado, quédatelo",
        body: "El clip juega justo en el chat y ahorra a su propio almacenamiento. Los chats Incognito lo mantienen atado a su sesión del navegador. Espera un minuto hasta varios minutos por clip.",
      },
    },
    toolPage:
      "Un intercambio. En el chat el AI no puede establecer longitud, resolución o relación de aspecto: cada clip de chat pide segundos {{seconds}} en la resolución predeterminada del modelo. ¿Necesitas control completo? La página del generador de vídeo establece el modelo, duración, relación de aspecto, resolución, primer y último marco, y un impulso negativo.",
    toolLink: "Abra el generador de vídeo",
  },
  pricing: {
    title: "Qué video de AI cuesta aquí",
    intro:
      "Créditos por segundos. Esa es toda la fórmula. Un saldo paga por cada modelo.",
    perSecond:
      "Cada modelo tiene una tasa por segundo: el precio del proveedor más nuestra marca {{markup}} %, redondeado hasta un décimo de un crédito. 1 crédito = {{creditValue}}.",
    cheapest:
      "El clip de chat más barato ahora mismo: {{cheapestClipName}}, {{cheapestClipCredits}} créditos ({{cheapestClipPrice}}). Tasa más baja: {{cheapestName}} en {{minRate}} créditos por segundo.",
    priciest:
      "Priciest chat clip: {{priciestClipName}}, {{priciestClipCredits}} credits ({{priciestClipPrice}}). Tarifa más alta: {{priciestName}} en {{maxRate}} créditos por segundo.",
    resolution:
      "La resolución más alta cuesta más por segundo en los modelos que precio por resolución. En la tabla se enumeran esas tasas.",
    failed:
      "Los créditos salen sólo después de que se entrega un clip. Trabajo fallido, rehusado, puntualidad: no pagas nada.",
    reported:
      "Rutas a través de la factura OpenRouter el costo real reportado del proveedor más el marcado, por lo que la carga final puede aterrizar ligeramente fuera de la mesa.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    link: "Ver planes y paquetes de crédito",
  },
  watermark: {
    title: "AI video sin marca de agua",
    intro:
      "{{appName}} no estalla nada en tu clip. Conseguiste el archivo crudo.",
    ours: "Sin marca de agua, sin logo, sin sobrecarga de nosotros. Usted descarga el vídeo exactamente como el modelo lo entregó.",
    provenance:
      "Algunos laboratorios incrustaron marcas de procedencia invisible o metadatos. Google pone SynthID en la salida de sus modelos de vídeo. OpenAI adjunta metadatos C2PA a clips Sora. Los que vienen del laboratorio, no de nosotros.",
    storage:
      "Cada clip guarda su propio almacenamiento. En los chats incognito se mantiene propiedad de su sesión del navegador.",
  },
  limits: {
    title: "Los límites, rectos",
    intro:
      "El vídeo es el modo difícil de generar AI. Conoce los bordes antes de pasar.",
    time: "Un clip tarda aproximadamente un minuto hasta varios minutos. Los trabajos largos pueden salir y un tiempo libre no cuesta nada.",
    cost: "El vídeo es el tipo de medios más caro en {{appName}}. Borrar en un modelo barato, hacer que el guardián de una prima.",
    filters:
      "Cada modelo de vídeo aquí viene de un laboratorio principal y corre detrás de la moderación de su proveedor. El contenido sexual explícito, figuras públicas reales, menores o gore pueden ser rechazados en el río arriba. Esa negativa es del proveedor, no la nuestra, y no le cuesta nada.",
    chatControls:
      "En chat, longitud, resolución y relación de aspecto se mantienen en sus defectos. La página del generador de vídeo los desbloquea a todos.",
    snap: "Cada modelo soporta su propio conjunto de longitudes. Una solicitud se ajusta a la más cercana, por lo que algunos clips de chat funcionan un poco más corto o más que los segundos {{seconds}}.",
    legacy:
      "Los modelos más antiguos {{legacyCount}} quedan fuera de esta tabla. Todavía se sientan en la lista de modelos completos.",
    callout:
      "Sin censura es nuestra promesa para los modelos de chat. El vídeo se ejecuta en modelos convencionales con filtros de sus proveedores. Ninguno de ellos expresa su contenido.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "¿Cuál es el mejor generador de vídeo AI?",
      a: "El que se ajusta al disparo. Realismo cinematográfico con sonido: Veo 3.1. Tomas largas continuas: Wan 3.0 o Seedance 2.5. Personajes consistentes en escenas: Seedance 2.0. Proyectos baratos: {{cheapestName}}. Una persona que habla de una foto: Omnihuman 1.5. Todos los {{modelCount}} funcionan con un saldo {{appName}}, para que puedas cambiar por clip.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance: ¿qué es mejor?",
      a: "Diferentes trabajos. Kling 3.0 Std es la opción de valor: movimiento animado, audio nativo, control de marco, capped a 720p. Seedance 2.0 cuesta más por segundo y sube a 4K, con entrada de referencia que mantiene un personaje consistente de disparo a tiro. Borrador de Kling, termina fotos sobre Seedance.",
    },
    imageToVideo: {
      q: "¿Cómo puedo convertir una imagen en un video con AI?",
      a: "Adjuntar la imagen en cualquier chat y describir el movimiento. Se convierte en el marco de apertura. Los modelos {{i2vCount}} de {{modelCount}} toman una imagen directamente; si la tuya no, el trabajo se mueve a una ruta que puede ser capaz de imagen. Añade una segunda imagen como el último marco en modelos que la soportan.",
    },
    watermark: {
      q: "¿Hay un generador de vídeo AI sin marca de agua?",
      a: "Si. {{appName}} no añade marca de agua, logo o sobreimpresión. Usted descarga el archivo crudo. Algunos laboratorios incrustaron marcas invisibles por su cuenta: Google 's SynthID en sus modelos de vídeo, metadatos C2PA en los clips Sora de OpenAI.",
    },
    cost: {
      q: "¿Cuánto cuesta la generación de vídeo AI?",
      a: "De {{cheapestClipPrice}} a {{priciestClipPrice}} por chat clip ahora mismo, dependiendo del modelo. Cada modelo tiene una tasa por segundo, precio del proveedor más marca {{markup}} %. 1 crédito = {{creditValue}}. Los trabajos fallidos no cuestan nada.",
    },
    free: {
      q: "¿Puedo hacer videos AI gratis?",
      a: "Las cuentas nuevas obtienen créditos gratis. El vídeo es una de las cosas más primitivas que puedes generar, por lo que cubren algunos clips al máximo. El clip más barato ahora es {{cheapestClipName}} en créditos {{cheapestClipCredits}}. Después de eso: un plan, desde {{subPrice}} al mes.",
    },
    length: {
      q: "¿Cuánto tiempo puede ser un vídeo AI?",
      a: "Hasta los segundos de {{longestSeconds}} en un clip, en {{longestName}}. La mayoría de los modelos se detienen bien antes de eso. Una solicitud de chat pide segundos {{seconds}}; establece una duración más larga en la página del generador de vídeo.",
    },
    uncensored: {
      q: "¿Hay un generador de vídeo AI sin censura?",
      a: "Aquí no, y no pretenderemos otra cosa. Cada modelo de vídeo en {{appName}} es un modelo de laboratorio principal detrás de los filtros de su proveedor. Ninguno de ellos expresa su contenido. Nuestros modelos sin censura son modelos de chat.",
    },
    modelsLink: "Examine todos los modelos con especificaciones y precios",
    pricingLink: "Ver planes y precios",
  },
  partners: {
    body: "¿Hacer contenido de vídeo AI? El programa de socios {{appName}} le paga una parte recurrente de cada pago que se refiere.",
    link: "Únase al programa partner",
  },
  cta: {
    title: "Escoge un modelo. Haz el disparo.",
    subtitle:
      "Control completo en la página del generador de vídeo: modelo, longitud, relación de aspecto, resolución, marcos. O simplemente pregunte en cualquier chat en {{appName}}.",
    generate: "Generar un vídeo",
    models: "Examine todos los modelos",
  },
};
