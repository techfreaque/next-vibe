import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a FreedomGPT: IA sin censura comparadas (2026)",
    description:
      "Compara FreedomGPT con {{appName}}, Venice y Poe en la nube, o con LM Studio, Ollama y Jan sin conexión. Precios, filtros y privacidad.",
    category: "Comparativa",
    imageAlt: "Alternativas a FreedomGPT comparadas lado a lado",
    keywords:
      "alternativa a FreedomGPT, alternativas a FreedomGPT, páginas como FreedomGPT, apps como FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, alternativa a FreedomGPT de escritorio, IA sin censura, chat IA sin filtros, IA sin restricciones, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "9 min de lectura",
    title: "Alternativas a FreedomGPT en la nube y sin conexión",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas según lo que dicen sus propias páginas de precios, privacidad y filtros.",
  },
  intro: {
    lead: "FreedomGPT vende una sola suscripción para cientos de modelos, algunos sin censura. Buena idea. Las pegas: nunca dice cuáles son esos modelos sin censura, su política de privacidad no promete privacidad y su app de escritorio lleva años sin actualizarse.",
    p2: "Aquí va lo que FreedomGPT promete de verdad, lo que compran sus créditos y {{count}} alternativas verificadas en sus propias páginas. FreedomGPT a {{fgDate}}, el resto a {{date}}. También decimos dónde nos ganan.",
    relation:
      "Para ser claros: somos clientes de FreedomGPT. {{freedomGptExamples}} funciona en {{appName}} a través de la API de la propia FreedomGPT.",
  },
  fg: {
    title: "Lo que te da FreedomGPT",
    intro:
      "Según su página de inicio, su página de precios, sus términos, su política de privacidad y la documentación de su API, leídos el {{fgDate}}.",
    models:
      "Modelos: la página de inicio presume de más de 400 modelos en una suscripción y nombra ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama y más. Promete opciones sin censura, pero no nombra ningún modelo sin censura. Su API usa por defecto un modelo llamado Liberty y no dice qué es.",
    filter:
      "Filtro: sus términos permiten el uso solo para fines legales y éticos y no detallan nada más. No indica una edad mínima.",
    price:
      "Precio: prueba gratis sin tarjeta y sin cuenta. Pro cuesta {{proPrice}} al mes por {{proCredits}} créditos. Sus propias estimaciones: unos {{replyCost}} créditos por respuesta premium, {{imageCost}} por imagen, {{videoCost}} por un vídeo de cinco segundos.",
    bonus:
      "Bono de registro: 100 créditos, pero solo para cuentas nuevas de Google, Apple o X que cumplan los requisitos. Si te registras con correo y contraseña, no recibes nada.",
    privacy:
      "Privacidad: la página de inicio te dice que no des por hecho el anonimato ni la retención cero. La política de privacidad dice que FreedomGPT puede recopilar y guardar cualquier información que facilites, que los usuarios no tienen ninguna expectativa de privacidad y que los mensajes van a proveedores de IA para generar las respuestas. No indica ningún plazo de retención.",
    apps: "Apps y API: web, iPhone y Android. La API tiene endpoints de chat, imagen, llamadas telefónicas y video, pero las respuestas llegan en el formato propio de FreedomGPT, no en el esquema de OpenAI, y la documentación no lista precios por token. El último commit de su app de escritorio de código abierto es del {{desktopDate}}.",
    why: "Por qué la gente busca otra cosa: quiere saber qué compra de verdad un mes, una app sin conexión que siga mantenida o una política que deje los chats fuera de un servidor.",
    sourceHome: "Página de inicio de FreedomGPT",
    sourcePricing: "Precios de FreedomGPT",
    sourcePrivacy: "Política de privacidad de FreedomGPT",
    sourceTerms: "Términos de servicio de FreedomGPT",
    sourceApi: "Documentación de API de FreedomGPT",
    sourceRepo: "Repositorio de la app de escritorio de FreedomGPT",
  },
  credits: {
    title: "Lo que compran {{proPrice}} al mes en FreedomGPT",
    intro:
      "{{proCredits}} créditos divididos entre las estimaciones de FreedomGPT. Una cosa, o una mezcla.",
    replies:
      "Unas {{replies}} respuestas premium, a {{replyCost}} créditos cada una.",
    images: "O unas {{images}} imágenes, a {{imageCost}} créditos cada una.",
    videos:
      "O {{videos}} vídeos de cinco segundos, a {{videoCost}} créditos cada uno.",
    us: "En {{appName}} cada página de modelo muestra su precio actual por mensaje antes de enviar, y los planes empiezan en {{subPrice}} al mes por {{subCredits}} créditos. Los modelos baratos estiran un plan mucho, los punteros menos. Tú ves cuál es cuál.",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Lo deciden cinco preguntas.",
    models:
      "Modelos: cuántos sin censura, de qué tipo (abliterated o realmente sin censura) y si Claude, GPT y Gemini están en el mismo sitio.",
    filter:
      "Filtro: qué prohíben de verdad las condiciones y si la etiqueta sin censura significa que el modelo responde.",
    privacy:
      "Privacidad: dónde viven tus chats, quién más los recibe y cuánto tiempo los guarda alguien.",
    price:
      "Precio: cuántas respuestas, imágenes y vídeos compra un mes. No solo el precio de tarifa.",
    offline:
      "Sin conexión: ¿hay una opción local mantenida o solo una app en la nube?",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: los modelos sin censura, con nombre y precio",
    intro:
      "{{modelCount}} modelos en un chat y un solo saldo. Eliges el modelo en cada mensaje, y cada modelo tiene su propia página.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, y el resultado es un modelo con opiniones políticas contrarias.",
    liberty:
      "Liberty, el modelo propio de FreedomGPT, también está aquí ({{freedomGptExamples}}), junto a versiones abliterated de GLM, DeepSeek y Kimi. Compara su respuesta con otro modelo en el mismo hilo.",
    libertyOff:
      "Versiones abliterated de GLM, DeepSeek y Kimi junto a Claude, GPT y Gemini. Compara respuestas en el mismo hilo.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta. Los chats privados se guardan solo en tu cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta. Planes desde {{subPrice}} al mes. Los modelos sin censura se desbloquean con una confirmación única de que tienes 18 años.",
    open: "Código abierto: toda la plataforma está en GitHub y en desarrollo activo. Si quieres tu propia instancia, la alojas tú.",
    weak: "Dónde somos más flojos: no hay plan plano para todo, y el vídeo aquí también cuesta créditos de verdad. El arranque gratis y sin cuenta de FreedomGPT es tan fácil como el nuestro.",
    hubLink: "Chat de IA sin censura: todos los modelos, con contexto y precio",
    abliteratedLink: "Modelos abliterated para usar en el navegador",
    libertyLink: "Ver FreedomGPT Liberty en {{appName}}",
    ownLink: "Ver {{ownModel}}",
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
    fg: "FreedomGPT: su política dice que los usuarios no tienen ninguna expectativa de privacidad y que puede guardar todo lo que le facilites. Los mensajes van a proveedores de IA. No indica plazo de retención. Su propia página de inicio dice que no des por hecho el anonimato.",
    us: "{{appName}} en incógnito: los chats viven en el almacenamiento local de tu navegador, no en nuestros servidores. Borra los datos del navegador y desaparecen.",
    local:
      "LM Studio y Ollama: el modelo corre en tu equipo y el prompt nunca sale de él. El precio es tu propio hardware.",
    callout:
      "Todo modelo alojado ve el prompt al que responde. Un historial en el dispositivo aleja tus chats del servidor de una empresa, no del modelo.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "¿Cuál es la mejor alternativa a FreedomGPT?",
      a: "Depende de lo que eches de menos. Historial en el dispositivo y gran catálogo: Venice. Pago por uso sin suscripción: NanoGPT. Un modelo directo con su propia visión del mundo: uncensored.ai. Totalmente sin conexión: LM Studio u Ollama. Modelos sin censura, abiertos y convencionales con precio público por mensaje, en un solo chat: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a FreedomGPT?",
      a: "Sí. Ollama es gratis y de código abierto en tu propio hardware, LM Studio es gratis en local. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, modelos sin censura incluidos tras una confirmación única de que tienes 18 años.",
    },
    liberty: {
      q: "¿Puedo usar FreedomGPT Liberty en otro sitio?",
      a: "Sí. {{appName}} ofrece {{freedomGptExamples}} a través de la API de FreedomGPT, así que usas Liberty junto a otros {{uncensored}} modelos sin censura y contrastas sus respuestas.",
      aOff: "Liberty es el modelo propio de FreedomGPT. En {{appName}} tienes otros {{uncensored}} modelos sin censura, abliterated y realmente sin censura, en un solo chat.",
    },
    desktop: {
      q: "¿Sigue mantenida la app de escritorio de FreedomGPT?",
      a: "Su repositorio de código abierto en GitHub muestra el último commit el {{desktopDate}}. Para trabajar sin conexión hoy, las opciones mantenidas son Ollama y LM Studio.",
    },
    private: {
      q: "¿Qué alternativa es la más privada?",
      a: "Un programa local: Ollama o LM Studio dejan cada prompt en tu dispositivo. Entre las opciones alojadas, Venice y el modo incógnito de {{appName}} guardan el historial en el navegador. La política de FreedomGPT comparte los mensajes con proveedores de IA externos.",
    },
    api: {
      q: "¿Qué alternativa tiene una API sin censura?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI y {{appName}} ofrecen API compatibles con OpenAI. FreedomGPT también tiene una, pero en su propio formato de respuesta y sin precios en la documentación. Para pesos abliterados solo por API, OpenUncensored, Refuseless y NEAR AI Cloud los venden a precio del proveedor. En {{appName}}, cualquier plan desde {{apiSubPrice}} al mes desbloquea la API.",
    },
    gabLink: "Alternativas a Gab AI, comparadas",
    nofilterLink: "Alternativas a NoFilterGPT, comparadas",
    noGpuLink: "Modelos sin censura sin tarjeta gráfica",
    openRouterLink: "Alternativas a OpenRouter sin censura, comparadas",
    apiLink: "API de LLM sin censura: IDs de modelos, código y límites",
  },
  cta: {
    title: "Sabe lo que pagas. Luego pregunta lo que quieras.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza en incógnito y prueba cualquier modelo.",
    start: "Empezar un chat de incógnito",
    models: "Ver los modelos sin censura",
  },
};
