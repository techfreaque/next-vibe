import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a Gab AI: chats de IA sin censura comparados (2026)",
    description:
      "Compara Gab AI y Arya con {{appName}}, Grok, Perplexity, Venice y modelos locales. Elige según busques investigación política, chat privado o creación.",
    category: "Comparativa",
    imageAlt: "Alternativas a Gab AI comparadas lado a lado",
    keywords:
      "alternativa a Gab AI, alternativas a Gab AI, páginas como Gab AI, Gab AI Arya, Gab AI vs Venice, chatbot de IA conservador, IA sin censura, IA sin censura para política, IA sin sesgo político, IA libertad de expresión, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "9 min de lectura",
    title:
      "Alternativas a Gab AI para investigación, chat y contenido multimedia",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas según lo que dicen sus propias condiciones, precios y políticas de privacidad.",
  },
  intro: {
    lead: "Gab AI construyó una IA que habla de política, cultura y fe sin el sermón de las grandes tecnológicas. Eso funciona. La letra pequeña: nada de contenido adulto, tus chats en sus servidores y la API solo con un plan de pago.",
    p2: "Aquí va lo que Gab AI promete de verdad, dónde termina su libertad y {{count}} alternativas verificadas en sus propias páginas. Gab AI a {{gabDate}}, el resto a {{date}}. También decimos dónde nos ganan.",
    relation:
      "Para ser claros: somos clientes de Gab AI. {{gabAiExamples}} funciona en {{appName}} a través de la API del propio Gab.",
  },
  gab: {
    title: "Lo que te da Gab AI",
    intro:
      "Según su página de inicio, sus precios, sus condiciones de servicio, su política de privacidad y su página de API, leídos el {{gabDate}}.",
    models:
      "Modelos: {{gabModels}} modelos en una sola cuenta, de GPT, Claude, Gemini, DeepSeek, Qwen, Kimi, GLM y más. Arya es el modelo propio de Gab para hablar sin censura de política, cultura y fe.",
    filter:
      "Filtro: las condiciones exigen 18 años y prohíben contenido obsceno, sexualmente explícito o pornográfico, salvo desnudos con fines educativos o médicos. Sistemas automáticos pueden analizar tu contenido por seguridad y cumplimiento.",
    price:
      "Precio: {{gabFree}} créditos de registro tras verificar el correo. Plus cuesta {{plusMonth}} al mes o {{plusYear}} al año con {{plusCredits}} créditos al mes. Plus Premium cuesta {{premiumYear}} al año con {{premiumCredits}} al mes. Paquetes de créditos desde {{gabPackPrice}} por {{gabPackCredits}} créditos, que se acumulan.",
    gated:
      "Solo con Plus: Work, su modo agente, y la voz en directo. En el plan gratis, vídeo y música requieren créditos comprados. La API exige un plan Plus o Plus Premium activo.",
    privacy:
      "Privacidad: Gab ve tus prompts y las respuestas y guarda el historial de conversaciones. Mejorar sus modelos figura entre los fines. La política pide no dar por hecho que pasar por Gab elimina los datos identificativos. Los datos se guardan el tiempo necesario para prestar el servicio.",
    apps: "Apps: web, Mac, Windows, iPhone, iPad, Android y una extensión de navegador.",
    why: "Por qué la gente busca otra cosa: escribe ficción que las condiciones de Gab prohíben, quiere chats fuera de un servidor, quiere API sin suscripción o quiere contrastar la respuesta de Arya con otra visión del mundo.",
    sourceHome: "Página de inicio de Gab AI",
    sourcePricing: "Precios de Gab AI",
    sourceTerms: "Condiciones de servicio de Gab AI",
    sourcePrivacy: "Política de privacidad de Gab AI",
    sourceApi: "Página de API de Gab AI",
  },
  split: {
    title: "Libre en política, estricto con el contenido adulto",
    intro: "La libertad de Gab AI tiene una frontera clara. Es esta.",
    politics:
      "Política, cultura, fe: Arya responde sin los rodeos del discurso dominante. Es el producto, y cumple.",
    adult:
      "Ficción para adultos: prohibida por las condiciones. Dark romance, escenas explícitas, rol para adultos no reciben ayuda, y sistemas automáticos pueden analizar el contenido por cumplimiento.",
    us: "En {{appName}} funcionan las dos cosas: posturas a contracorriente con UncensoredLM o Arya, y ficción para adultos con modelos sin censura tras una confirmación única de que tienes 18 años. La ley sigue vigente.",
    unbiasedLink:
      "Una IA que defiende ambos lados: modelos comparados en política",
    writerLink:
      "Escritor de IA sin censura: ficción oscura y escenas para adultos",
    chanLink: "La skill de 4chan: greentext y pullas, sin filtro",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Lo deciden cinco preguntas.",
    worldview:
      "Visión del mundo: un modelo de la casa con una línea declarada, o varios que puedes enfrentar entre sí.",
    filter:
      "Filtro: libre solo en política, o también en ficción y contenido adulto. Quién analiza qué.",
    privacy:
      "Privacidad: dónde viven tus chats y si sirven para mejorar modelos.",
    price:
      "Precio: créditos gratis, suscripción o pago por uso. Y qué bloquea el plan gratis.",
    api: "API: si necesita suscripción y qué formatos habla.",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: varias visiones del mundo, un chat",
    intro:
      "{{modelCount}} modelos en un chat y un solo saldo. Eliges el modelo en cada mensaje, así que pones dos puntos de vista lado a lado.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, y el resultado es un modelo con opiniones políticas contrarias.",
    arya: "Arya también está aquí ({{gabAiExamples}}). Pregunta a Arya y luego haz la misma pregunta a UncensoredLM o a una versión abliterated de GLM en el mismo hilo.",
    aryaOff:
      "Versiones abliterated de GLM, DeepSeek y Kimi junto a Claude, GPT y Gemini. Haz la misma pregunta dos veces y compara.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta. Los chats privados se guardan solo en tu cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta. Planes desde {{subPrice}} al mes. Los modelos sin censura se desbloquean con una confirmación única de que tienes 18 años.",
    api: "API: los mismos modelos con endpoints compatibles con OpenAI y Anthropic. Cualquier plan desde {{apiSubPrice}} al mes la desbloquea.",
    weak: "Dónde somos más flojos: no hay plan plano, cada mensaje cuesta créditos según el modelo, y Gab lista {{gabModels}} modelos donde nosotros tenemos {{modelCount}}. Los paquetes de Gab funcionan sin plan; los nuestros recargan un plan activo y nunca caducan.",
    hubLink: "Chat de IA sin censura: todos los modelos, con contexto y precio",
    abliteratedLink: "Modelos abliterated para usar en el navegador",
    ownLink: "Ver {{ownModel}}",
    aryaLink: "Ver Gab AI Arya en {{appName}}",
  },
  list: {
    title: "Las {{count}} alternativas, una a una",
    intro:
      "Según sus propias páginas, verificadas el {{date}}. Qué es cada una, qué modelos tiene, qué permite su filtro, qué pasa con tus chats.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelos:",
    filter: "Filtro:",
    privacy: "Privacidad:",
    price: "Precio:",
    priceValue: "Gratis: {{free}}. De pago: {{plans}}.",
    pro: "Lo mejor:",
    con: "La pega:",
    forWho: "Elígela si:",
    versusLink: "{{appName}} vs {{name}}: la comparativa completa",
    visit: "Visitar {{name}}",
  },
  privacy: {
    title: "Privacidad: lee la política, no el eslogan",
    intro: "Lo que cada uno deja por escrito.",
    gab: "Gab AI: prompts, respuestas e historial se quedan en sus servidores, y mejorar los modelos figura entre los fines. Recoge tu dirección IP y tu ubicación aproximada.",
    us: "{{appName}} en incógnito: los chats viven en el almacenamiento local de tu navegador, no en nuestros servidores. Borra los datos del navegador y desaparecen.",
    local:
      "LM Studio: el modelo corre en tu equipo y el prompt nunca sale de él. El precio es tu propio hardware.",
    callout:
      "Todo modelo alojado ve el prompt al que responde. Un historial en el dispositivo aleja tus chats del servidor de una empresa, no del modelo.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "¿Cuál es la mejor alternativa a Gab AI?",
      a: "Depende de lo que eches de menos. Un modelo directo a contracorriente: uncensored.ai. Historial en el dispositivo y un filtro adulto que Pro puede apagar: Venice. Modelos sin censura más imágenes y vídeo en un plan: FreedomGPT. Pago por uso: NanoGPT. Privacidad total: LM Studio. Arya, UncensoredLM y modelos abliterated lado a lado en un chat: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a Gab AI?",
      a: "Sí. FreedomGPT empieza gratis sin cuenta, LM Studio es gratis en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, modelos sin censura incluidos tras una confirmación única de que tienes 18 años.",
    },
    arya: {
      q: "¿Puedo usar Arya fuera de Gab AI?",
      a: "Sí. {{appName}} ofrece {{gabAiExamples}} a través de la API de Gab: preguntas a Arya y contrastas su respuesta con {{ownModel}} o un modelo convencional en el mismo hilo.",
      aOff: "Arya es el modelo propio de Gab. En {{appName}} tienes {{ownModel}}, entrenado con libros y documentos prohibidos en el internet convencional, más modelos abliterated y convencionales en un chat.",
    },
    adult: {
      q: "¿Gab AI permite contenido adulto o NSFW?",
      a: "No. Sus condiciones prohíben contenido obsceno, sexualmente explícito o pornográfico, y sistemas automáticos pueden analizar el contenido por cumplimiento. NanoGPT no tiene una prohibición general de NSFW para adultos, Venice deja que los suscriptores Pro apaguen su filtro adulto, y {{appName}} abre sus modelos sin censura tras una confirmación única de que tienes 18 años.",
    },
    private: {
      q: "¿Qué alternativa es la más privada?",
      a: "Un programa local como LM Studio: los prompts nunca salen de tu dispositivo. Entre las opciones alojadas, Venice y el modo incógnito de {{appName}} guardan el historial en el navegador. Gab AI guarda el historial en sus servidores y cita la mejora de modelos entre sus fines.",
    },
    api: {
      q: "¿Qué alternativa tiene una API sin censura y sin suscripción?",
      a: "NanoGPT y OpenRouter cobran por uso, sin suscripción. Venice y uncensored.ai venden créditos de API. La API de Gab AI exige un plan Plus activo. En {{appName}} cualquier plan desde {{apiSubPrice}} al mes la desbloquea.",
    },
    freedomLink: "Alternativas a FreedomGPT, comparadas",
    kindsLink: "Abliterated, ajustado o con visión propia: los tres tipos",
  },
  cta: {
    title: "Escucha a todas las partes. Luego decide.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza en incógnito y haz la misma pregunta a dos modelos.",
    start: "Empezar un chat de incógnito",
    models: "Ver los modelos sin censura",
  },
};
