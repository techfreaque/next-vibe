import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a Venice AI: privadas y sin censura (2026)",
    description:
      "Venice AI frente a {{appName}}, Maple, Proton Lumo, Duck.ai, NanoGPT y apps locales. Dónde se procesan tus mensajes, quién rechaza menos y qué cuesta extra.",
    category: "Comparativa",
    imageAlt: "Alternativas a Venice AI comparadas lado a lado",
    keywords:
      "alternativas a Venice AI, alternativa a Venice AI, webs como Venice AI, alternativa a Venice.ai, IA privada sin censura, alternativa de chat de IA sin censura, Venice AI vs NanoGPT, Venice AI vs FreedomGPT, IA sin censura con API, chat de IA privado, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "9 min de lectura",
    title: "Alternativas a Venice AI para conversaciones privadas",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas según lo que dicen sus propias páginas de precios, privacidad y filtros. Comprobado el {{date}}.",
  },
  intro: {
    lead: "Venice se hizo un nombre con dos promesas: privado y sin censura. Cumple buena parte de las dos. Pero el plan gratis se queda corto, el filtro adulto exige Pro y no todo el mundo quiere una capa de staking cripto al lado de su chat.",
    p2: "Así que aquí van las alternativas, comprobadas el {{date}} en sus propias páginas de precios, privacidad y filtros. Con total transparencia: compramos a Venice. {{appName}} enruta hoy {{veniceModels}} modelos a través de Venice, {{veniceUncensored}} de ellos sin censura. También decimos dónde gana Venice.",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Lo deciden cinco preguntas.",
    privacy:
      "Privacidad: ¿dónde se guardan tus chats y alguien entrena con ellos? En el dispositivo, en el servidor o usados para mejorar modelos.",
    models:
      "Modelos: ¿cuántos sin censura, de qué tipo, y tienes Claude, GPT y Gemini en el mismo sitio?",
    filter:
      "Filtro: ¿qué se permite en el plan gratis, qué exige pagar y hay verificación de edad?",
    price:
      "Precio: cuota gratis, suscripción o pago por uso. Y qué pasa cuando llegas al límite.",
    api: "API: ¿puedes llamar a los mismos modelos desde código, y en qué formato?",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: un chat, todo tipo de modelos",
    intro:
      "{{modelCount}} modelos en un chat y un solo saldo. El nivel de filtro lo eliges en cada mensaje.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. Cambia en mitad del chat. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias.",
    venice:
      "Venice dentro: {{veniceModels}} de nuestros modelos funcionan a través de Venice, entre ellos {{veniceExamples}}. Los mismos modelos, una sola cuenta con todo lo demás.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta. Los chats privados se guardan solo en tu cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta. Planes desde {{subPrice}} al mes. Los paquetes de créditos recargan un plan activo y no caducan nunca.",
    api: "API: los mismos modelos a través de endpoints compatibles con OpenAI y Anthropic. Cualquier plan desde {{apiSubPrice}} al mes la desbloquea.",
    weak: "Dónde flojeamos: el catálogo de Venice es más grande, y en sus propios modelos Venice es más barato por token, porque añadimos un margen sobre lo que pagamos. No hay capa de staking como VVV o DIEM.",
    directoryLink: "Todos los modelos abliterados, con contexto y precio",
    ownLink: "Ver {{ownModel}}",
  },
  list: {
    title: "Las {{count}} alternativas, una a una",
    intro:
      "Según sus propias páginas, comprobadas el {{date}}. Qué es cada una, qué modelos tiene, qué permite su filtro y qué pasa con tus chats.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelos:",
    filter: "Filtro:",
    privacy: "Privacidad:",
    price: "Precio:",
    priceValue: "Plan gratis: {{free}}. De pago: {{plans}}.",
    pro: "Lo mejor:",
    con: "La pega:",
    forWho: "Elígela si:",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    visit: "Visitar {{name}}",
  },
  privacy: {
    title: "Privacidad: la mejor carta de Venice",
    intro:
      "Casi todo el mundo mira Venice por la privacidad. Así se comparan los demás.",
    us: "En {{appName}}, los chats de incógnito viven en el almacenamiento local de tu navegador, no en nuestros servidores. Borra los datos del navegador y desaparecen.",
    transit:
      "Cualquier modelo alojado ve igualmente tu prompt. Venice, NanoGPT, nosotros: el mensaje tiene que llegar al servidor que ejecuta el modelo. Solo una herramienta local lo mantiene en tu equipo.",
    callout:
      "Un historial en el dispositivo mantiene tus chats fuera de los servidores de una empresa. No los oculta del modelo que escribe las respuestas.",
  },
  stay: {
    title: "Cuándo Venice sigue siendo la opción correcta",
    intro: "A veces el original es mejor trato.",
    crypto:
      "Tienes VVV o DIEM, o quieres pagar llamadas a la API sin cuenta. Nadie más en esta lista lo hace de la misma forma.",
    versusLink: "{{appName}} vs Venice: la comparativa completa",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a Venice AI?",
      a: "Depende de por qué te vas. Pago por uso y una lista enorme de modelos: NanoGPT. Privacidad total: LM Studio en tu propio equipo. Un modelo directo con visión propia del mundo: uncensored.ai. Modelos sin censura, abiertos y convencionales, más medios, en un chat y un solo saldo: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a Venice AI?",
      a: "Sí. FreedomGPT empieza gratis sin cuenta. LM Studio es gratis en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, modelos sin censura incluidos tras una confirmación 18+ única.",
    },
    private: {
      q: "¿Qué alternativa a Venice es la más privada?",
      a: "Una herramienta local como LM Studio: el modelo corre en tu dispositivo y los prompts nunca salen de él. Entre las opciones alojadas, NanoGPT y el modo incógnito de {{appName}} guardan el historial en tu navegador. Cualquier modelo alojado ve igualmente el prompt al que responde.",
    },
    api: {
      q: "¿Qué alternativa tiene una API sin censura?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter y {{appName}} ofrecen API compatibles con OpenAI. La oferta de modelos sin censura varía mucho: OpenRouter tiene pocos, NanoGPT muchos. En {{appName}}, cualquier plan desde {{apiSubPrice}} al mes desbloquea la API.",
    },
    same: {
      q: "¿Puedo usar los modelos de Venice en otro sitio?",
      a: "Algunos. {{appName}} ejecuta {{veniceModels}} modelos a través de Venice, entre ellos {{veniceExamples}}, en el mismo chat que Claude, GPT y el resto. OpenRouter y NanoGPT también tienen Venice Uncensored.",
    },
    account: {
      q: "¿Necesito una cuenta para probarlo?",
      a: "En {{appName}}, no: el chat de incógnito funciona sin cuenta. Una cuenta gratuita mantiene tus chats en todos tus dispositivos y sube la cuota gratis a {{freeCredits}} créditos al mes.",
    },
    noGpuLink: "Un LLM sin censura en línea, sin GPU",
    apiLink: "API de LLM sin censura: IDs, código y límites",
  },
  cta: {
    title: "Privado cuando quieras. Sin censura cuando haga falta.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza en incógnito y elige cualquier modelo.",
    start: "Empieza un chat de incógnito",
    models: "Compara todos los modelos",
  },
};
