import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a NoFilterGPT: chats de IA sin censura (2026)",
    description:
      "Compara NoFilterGPT con Venice, Unrestricted.chat, {{appName}} y opciones locales como Ollama. Modelos, límites gratuitos, privacidad y acceso a la API.",
    category: "Comparativa",
    imageAlt: "Alternativas a NoFilterGPT comparadas una junto a otra",
    keywords:
      "alternativa a NoFilterGPT, alternativas a NoFilterGPT, sitios como NoFilterGPT, NoFilterGPT vs Venice, chat de IA sin censura, chat IA sin filtros, ChatGPT sin filtros, IA sin censura, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "8 min de lectura",
    title: "Alternativas a NoFilterGPT con más modelos para elegir",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas según lo que dicen sus propias páginas de precios, privacidad y filtros.",
  },
  intro: {
    lead: "NoFilterGPT vende una sola cosa: un chatbot que no te sermonea. Bien. Pero tienes un único modelo, un límite diario en el plan gratuito y una promesa de privacidad que tienes que creerte.",
    p2: "Aquí van las alternativas, verificadas en sus propias páginas. Competidores a {{date}}, NoFilterGPT a {{nfDate}}. Para ser claros: compramos modelos a algunos de ellos y los ofrecemos en nuestro chat, {{veniceModels}} solo a través de Venice. También decimos dónde ganan ellos.",
  },
  nfg: {
    title: "Lo que ofrece NoFilterGPT",
    intro:
      "Según su página de inicio y su política de privacidad, leídas el {{nfDate}}.",
    model:
      "Modelo: un modelo propio, descrito como basado en la arquitectura GPT sin las restricciones habituales. Sin modelo base declarado y sin selector de modelos.",
    price:
      "Precio: un plan Basic gratuito con mensajes limitados al día. Professional cuesta {{proPrice}} al mes con chats casi ilimitados, análisis de imágenes, generación de imágenes y acceso a la API.",
    media:
      "Multimedia: generación y edición de imágenes, vídeo a partir de una imagen, voz de entrada y salida.",
    privacy:
      "Privacidad: la página de inicio dice que no guarda las conversaciones y que cifra los chats. La política de privacidad añade que puede registrar direcciones IP por seguridad, que registra datos de uso y que el sitio usa Cloudflare Analytics.",
    payments: "Pagos: tarjetas a través de Stripe, además de ETH, BTC y USDC.",
    why: "Por qué la gente busca una alternativa: quiere elegir el modelo, comparar respuestas o comprobar una promesa de privacidad en una política que la detalle.",
    sourceHome: "Página de inicio de NoFilterGPT",
    sourcePrivacy: "Política de privacidad de NoFilterGPT",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Cinco preguntas lo deciden.",
    models:
      "Modelos: ¿un modelo de la casa o una elección real? Abliterados, de verdad sin censura, y ¿sigues teniendo Claude, GPT y Gemini en el mismo sitio?",
    filter:
      "Filtro: ¿qué se permite en el plan gratuito, qué requiere pago y hay verificación de edad?",
    privacy:
      "Privacidad: dónde quedan tus chats, qué se registra y si alguien entrena modelos con ellos.",
    price:
      "Precio: cuota gratuita, suscripción o pago por uso. Y qué pasa cuando llegas al límite.",
    api: "API: ¿puedes llamar a los mismos modelos desde tu código, y en qué formato?",
  },
  table: {
    title: "Todas, una junto a otra",
  },
  us: {
    title: "{{appName}}: todo tipo de modelos en un solo chat",
    intro:
      "{{modelCount}} modelos en un solo chat y con un solo saldo. Eliges el nivel de filtro en cada mensaje.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos vetados en el internet convencional, y el resultado es un modelo con opiniones políticas a contracorriente.",
    switch:
      "Cambia de modelo a mitad de conversación. Pregunta a un modelo sin censura y contrasta la respuesta con uno convencional.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta. Los chats privados se guardan solo en tu cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta. Planes desde {{subPrice}} al mes. Los paquetes de créditos recargan un plan activo y nunca caducan.",
    api: "API: los mismos modelos con endpoints compatibles con OpenAI y Anthropic. Cualquier plan desde {{apiSubPrice}} al mes la desbloquea.",
    weak: "Donde somos más flojos: no hay plan ilimitado. Cada mensaje cuesta créditos y el precio depende del modelo que elijas.",
    hubLink: "Chat de IA sin censura: todos los modelos con contexto y precio",
    ownLink: "Ver {{ownModel}}",
  },
  list: {
    title: "Las {{count}} alternativas, una a una",
    intro:
      "Según sus propias páginas, verificadas el {{date}}. Qué es cada una, qué modelos tiene, qué permite su filtro y qué pasa con tus chats.",
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
    intro:
      "Sin registros es una promesa fuerte. Esto es lo que cada uno pone por escrito.",
    nfg: "NoFilterGPT: la página de inicio dice que no guarda los chats. Su política de privacidad dice que puede registrar direcciones IP y datos de uso, y que Cloudflare procesa los datos de las peticiones.",
    us: "En {{appName}}, los chats de incógnito viven en el almacenamiento local de tu navegador, no en nuestros servidores. Borra los datos del navegador y desaparecen.",
    transit:
      "Todo modelo alojado ve tu prompt. NoFilterGPT, Venice, nosotros: el mensaje tiene que llegar al servidor que ejecuta el modelo. Solo un programa local lo mantiene en tu equipo.",
    callout:
      "Un historial en el dispositivo mantiene tus chats fuera de los servidores de una empresa. No los oculta del modelo que escribe las respuestas.",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a NoFilterGPT?",
      a: "Depende de lo que te falte. Un gran catálogo e historial en el dispositivo: Venice. Un modelo directo con su propia visión del mundo: uncensored.ai. Pago por uso: NanoGPT. Privacidad total: LM Studio en tu propio equipo. Modelos sin censura, abiertos y convencionales, más multimedia, en un solo chat con un solo saldo: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratuita a NoFilterGPT?",
      a: "Sí. FreedomGPT empieza gratis y sin cuenta. LM Studio es gratis en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, modelos sin censura incluidos tras una única confirmación de mayoría de edad.",
    },
    models: {
      q: "¿Qué modelo usa NoFilterGPT?",
      a: "Su página de inicio describe un modelo propio basado en la arquitectura GPT y no nombra ningún modelo base. En {{appName}} cada modelo tiene su propia página con el laboratorio, la ventana de contexto y el precio. Sabes quién te responde.",
    },
    private: {
      q: "¿Qué alternativa es la más privada?",
      a: "Un programa local como LM Studio: el modelo se ejecuta en tu dispositivo y los prompts nunca salen de él. Entre los servicios alojados, Venice y el modo incógnito de {{appName}} guardan el historial en el navegador. Aun así, todo modelo alojado ve el prompt que responde.",
    },
    api: {
      q: "¿Qué alternativa tiene una API sin censura?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI y {{appName}} ofrecen API compatibles con OpenAI. NoFilterGPT incluye su API en el plan Professional. En {{appName}} cualquier plan desde {{apiSubPrice}} al mes desbloquea la API.",
    },
    account: {
      q: "¿Necesito una cuenta para probarlo?",
      a: "En {{appName}} no: el chat de incógnito funciona sin cuenta. Una cuenta gratuita guarda los chats en todos tus dispositivos y sube la cuota gratuita a {{freeCredits}} créditos al mes.",
    },
    chatgptLink: "Una alternativa a ChatGPT sin filtros",
    kindsLink: "Abliterados, ajustados o con visión propia: los tres tipos",
  },
  cta: {
    title: "Elige el modelo. No solo el filtro.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza en incógnito y prueba cualquier modelo.",
    start: "Iniciar un chat de incógnito",
    models: "Ver los modelos sin censura",
  },
};
