import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA sin censura gratis: lo que te dan de verdad (2026)",
    description:
      "IA sin censura gratis, comprobada: Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama y {{appName}}. Límites, filtros, trampas.",
    category: "Guía",
    imageAlt: "Las IA sin censura gratis, comparadas",
    keywords:
      "IA sin censura gratis, IA sin censura gratuita, chat de IA sin censura gratis, IA sin filtros gratis, IA sin restricciones gratis, IA sin límites gratis, IA sin censura sin registro, IA sin censura en español, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía",
    readTime: "8 min de lectura",
    title: "IA sin censura gratis. Lo que gratis significa de verdad.",
    subtitle:
      "{{count}} opciones gratis y {{appName}}, comprobadas en sus propias páginas de precios, filtros y privacidad. Con todos los límites que la portada no cuenta.",
  },
  intro: {
    lead: "Gratis y sin censura: lo prometen muchos. Luego llega el límite diario tras tres respuestas, el modelo básico en lugar del bueno, la verificación del email antes de cualquier crédito o una descarga de 40 GB.",
    p2: "Esto es lo que cada opción te da gratis de verdad, según sus propias páginas (última comprobación el {{date}}). Para que conste: compramos modelos a algunos de estos proveedores y los ofrecemos en nuestro chat. Si gratis dan más, lo decimos.",
  },
  short: {
    title: "La respuesta corta",
    intro: "Tres frases antes de seguir.",
    local:
      "Solo la IA local es gratis y sin límites de verdad: Ollama o LM Studio en tu propio ordenador. Pagas con hardware en lugar de con dinero.",
    hosted:
      "La IA sin censura en la nube siempre es gratis con límite: respuestas al día, créditos al mes o un solo modelo básico.",
    us: "En {{appName}} recibes {{guestCredits}} créditos gratis al mes sin cuenta, para los {{modelCount}} modelos, también los {{uncensored}} sin censura.",
  },
  catch: {
    title: "Dónde está la trampa de la IA gratis",
    intro: "Cinco sitios donde lo gratis sale caro.",
    limit:
      "El límite: las cuotas diarias suelen agotarse en pocos mensajes. En una conversación larga cuenta cada respuesta.",
    models:
      "Los modelos: muchos planes gratis solo dan un modelo básico o propio. Los buenos están detrás de la suscripción.",
    account:
      "La cuenta: algunos servicios piden un email confirmado antes de cualquier crédito gratis. Otros arrancan al momento.",
    data: "Los datos: gratis no significa privado. Lee qué se registra y si tus chats sirven para entrenar un modelo.",
    hardware:
      "El hardware: en local un mensaje no cuesta nada, pero un buen modelo necesita mucha memoria y una tarjeta gráfica potente.",
    callout:
      "Todo modelo en la nube ve tu prompt, gratis o de pago. Solo una app local lo guarda en tu dispositivo.",
  },
  table: {
    title: "Todas las opciones gratis, lado a lado",
    intro:
      "En el móvil, desliza hacia el lado. Datos de los proveedores comprobados en sus propias páginas, la fecha va en cada entrada. Los datos de {{appName}} salen en directo de nuestra configuración.",
  },
  us: {
    title: "Lo que te llevas gratis en {{appName}}",
    intro:
      "Un chat, {{modelCount}} modelos, un solo saldo. Aquí gratis significa una cuota fija para cada modelo, no solo para el más flojo.",
    guest:
      "Sin cuenta: {{guestCredits}} créditos gratis al mes. Abres el chat y escribes. Sin email, sin número de teléfono.",
    account:
      "Con cuenta gratuita: {{freeCredits}} créditos al mes, {{maxCredits}} con el boletín. Los chats se guardan en todos tus dispositivos.",
    models:
      "Todos los modelos incluidos: {{uncensored}} sin censura junto a Claude, GPT, Gemini y modelos abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias.",
    consent:
      "Para los modelos sin censura confirmas una sola vez que tienes 18 años o más. Nadie vuelve a preguntar.",
    after:
      "Cuando se acaben los créditos: espera al mes siguiente o elige un plan desde {{subPrice}} al mes.",
    weak: "Donde flojeamos en lo gratis: créditos, no tarifa plana. Cuántos mensajes te da la cuota depende del modelo. Cada página de modelo hace la cuenta por ti.",
    hubLink: "Todos los modelos sin censura con contexto y precio",
    ownLink: "Ver {{ownModel}}",
  },
  list: {
    title: "Las {{count}} opciones gratis, una a una",
    intro:
      "Qué es cada una, qué da gratis, qué permite su filtro y qué pasa con tus chats.",
    heading: "{{number}}. {{name}}: {{kind}}",
    free: "Gratis:",
    filter: "Filtro:",
    privacy: "Privacidad:",
    con: "La pega:",
    forWho: "Elígela si:",
    checked: "Comprobado el {{date}}.",
    versusLink: "{{appName}} vs {{name}}: la comparación completa",
    visit: "Visitar {{name}}",
  },
  local: {
    title: "En local: la única IA sin límites",
    intro: "Ollama y LM Studio funcionan en tu propio ordenador.",
    cost: "Coste: nada por mensaje, sin límite diario. Pagas una vez el hardware y luego la luz.",
    quality:
      "Calidad: el techo lo pone tu ordenador. Los modelos pequeños van en casi cualquier portátil, los grandes necesitan mucha memoria gráfica.",
    privacy:
      "Privacidad: tus prompts nunca salen de tu dispositivo. Más no se puede.",
    link: "¿Sin un ordenador potente? Modelos sin censura online, sin GPU",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor IA sin censura gratis?",
      a: "Depende de tu dispositivo. Con un ordenador potente: Ollama o LM Studio, gratis y sin límites. En el navegador: {{appName}} da {{guestCredits}} créditos al mes para todos los modelos, Venice 10 prompts de texto al día en modelos básicos, uncensored.ai 3 respuestas al día.",
    },
    noAccount: {
      q: "¿Hay IA sin censura gratis y sin registro?",
      a: "Sí. En {{appName}} abres el chat de incógnito y escribes, sin cuenta y sin email. FreedomGPT también dice que se empieza sin tarjeta y sin cuenta. Gab AI solo da créditos gratis tras confirmar el email.",
    },
    unlimited: {
      q: "¿Hay IA sin censura gratis e ilimitada?",
      a: "Solo en local. Ollama y LM Studio no cuestan nada por mensaje en tu propio hardware. Todo plan gratis en la nube tiene límite, porque alguien paga las tarjetas gráficas en las que corre el modelo.",
    },
    language: {
      q: "¿La IA sin censura responde en español?",
      a: "Los modelos grandes responden en el idioma en el que escribes. Escribe en español y te contesta en español. Con los modelos locales pequeños conviene una prueba rápida, algunos se pasan al inglés en respuestas largas.",
    },
    api: {
      q: "¿Hay una API sin censura gratis?",
      a: "En local, sí: Ollama y LM Studio traen un servidor compatible con OpenAI en tu ordenador. OpenRouter da 50 peticiones gratis al día en sus modelos gratuitos, pero los sin censura escasean. En {{appName}} cualquier compra desbloquea la API, planes desde {{apiSubPrice}} al mes. Los créditos gratis son solo para el chat.",
    },
    legal: {
      q: "¿Es legal la IA sin censura?",
      a: "Un modelo que rechaza menos no cambia la ley. Lo que es ilegal fuera de internet lo sigue siendo en un chat, y además se aplican nuestras condiciones de uso. Esto no es asesoramiento legal. Si manejas datos sensibles, lee la política de privacidad del proveedor o trabaja en local.",
    },
    noSignUpLink: "Chat IA gratis sin registro: cómo funciona",
    kindsLink: "Abliterado, ajustado o con visión propia: los tres tipos",
  },
  cta: {
    title: "Pruébalo gratis. Sin cuenta.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes para cada modelo. Abre un chat de incógnito y haz tu primera pregunta.",
    start: "Chatea gratis",
    models: "Ver los modelos sin censura",
  },
};
