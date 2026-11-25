import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a Claude: con y sin filtros (2026)",
    description:
      "Claude se queda sin mensajes y rechaza ficción. Compara {{appName}}, ChatGPT, Gemini, Grok, DeepSeek, Kimi, Venice, NanoGPT, OpenRouter: precio y filtros.",
    category: "Comparativa",
    imageAlt: "Alternativas a Claude, con y sin filtros, comparadas",
    keywords:
      "alternativas a Claude, alternativa a Claude, alternativa a Claude AI, webs como Claude, alternativa a Claude sin límites, alternativa a Claude sin filtro, alternativa a Claude sin censura, Claude vs ChatGPT, Claude vs Gemini, alternativa a Claude Pro, Claude alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "10 min de lectura",
    title: "Alternativas a Claude, con y sin filtros",
    subtitle:
      "{{count}} alternativas y {{appName}}, desde asistentes convencionales hasta modelos sin censura. Comprobadas en sus propias páginas el {{date}}.",
  },
  intro: {
    lead: "Claude es de lo mejor que hay para escribir y programar. También se queda sin mensajes en el peor momento, y su política de uso prohíbe el chat erótico en todos los planes.",
    p2: "Así que hay dos tipos de alternativas: otros asistentes convencionales para cuando llegas al límite, y modelos sin censura para lo que Claude rechaza. Aquí van las dos, comprobadas el {{date}}. Nosotros también ofrecemos Claude, así que decimos dónde sigue ganando.",
  },
  subject: {
    title: "Claude hoy",
    intro:
      "Según las páginas de precios, política de uso y privacidad de Anthropic.",
    plans:
      "Precio: gratis con límites que se reinician cada 5 horas y cada semana. De pago: {{plans}}. Anthropic no publica cifras exactas de mensajes y confirmó que endurece los límites en las horas punta de los días laborables.",
    filter:
      "Filtro: la política de uso prohíbe el contenido sexual explícito y el chat erótico, y el contenido que glorifica la violencia gráfica. No hay plan para adultos.",
    privacy:
      "Privacidad: tú eliges si los chats entrenan el modelo. Con el entrenamiento activado, los chats anonimizados se guardan hasta cinco años. Desactivado, 30 días.",
    extra:
      "Medios: no genera imágenes ni video. Claude dibuja gráficos y diagramas a partir de código y tiene modo de voz.",
  },
  why: {
    title: "Por qué la gente busca otra opción",
    intro: "Cuatro motivos, cada uno de una fuente pública.",
    limits:
      "Límites de uso. Anthropic confirmó en marzo de 2026 que acorta los límites de 5 horas en las horas punta.",
    refusals:
      "Rechazos. Los modelos Claude más recientes ponen pegas a premisas de ficción y malinterpretan la intención.",
    adult:
      "Sin plan para adultos. El chat erótico está prohibido en todos los planes y en todas las apps.",
    price:
      "Precio. Más uso significa Max por 100 USD o Ultra por 200 USD al mes.",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Lo deciden cinco preguntas.",
    one: "Calidad: escritura, código y razonamiento en tus propias tareas, no en benchmarks.",
    two: "Límites: topes de mensajes, ventanas de reinicio o pago por uso sin tope.",
    three: "Filtro: qué rechaza el modelo y si puedes elegir otro.",
    four: "Privacidad: ajustes de entrenamiento, retención y qué se queda en tu dispositivo.",
    five: "Extras: imágenes, video, búsqueda web, una API, y el precio de cada cosa.",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: Claude más modelos sin sus normas",
    intro:
      "{{modelCount}} modelos en un chat, Claude incluido. Cambias de modelo en cada mensaje y mantienes el hilo.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias.",
    fit: "Sin ventana de 5 horas: pagas por mensaje desde un solo saldo, así que sigues mientras tengas créditos. Imágenes, video y música van con el mismo saldo.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta. Planes: {{planList}}.",
    api: "API: endpoints compatibles con OpenAI y Anthropic, Claude incluido. Cualquier compra la desbloquea.",
    weak: "Dónde gana Claude: Claude Code, Projects y Cowork son apps propias de Anthropic, y un uso diario intensivo del propio Claude sale más barato con un plan de Claude que por mensaje con nuestro margen del {{markup}} %. Claude en {{appName}} también sigue la política de Anthropic.",
    ownLink: "Ver {{ownModel}}",
    directoryLink: "Todos los modelos abliterados, con contexto y precio",
  },
  list: {
    title: "Las alternativas documentadas, una a una",
    intro:
      "Las plataformas con perfil completo en nuestros datos de comparación, comprobadas en sus propias páginas. ChatGPT, Gemini, Grok y los demás asistentes están en la tabla de arriba.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelos:",
    filter: "Filtro:",
    price: "Precio:",
    priceValue: "Plan gratis: {{free}}. De pago: {{plans}}.",
    pro: "Lo mejor:",
    con: "La pega:",
    forWho: "Elígela si:",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    visit: "Visitar {{name}}",
  },
  stay: {
    title: "Cuándo Claude sigue siendo la opción correcta",
    intro: "Para mucho trabajo, lo es.",
    one: "Programas todo el día en Claude Code y el plan te lo cubre.",
    two: "Vives en Projects y quieres las apps propias de Anthropic en todos tus dispositivos.",
    three: "Lo que escribes nunca toca contenido que su política prohíbe.",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a Claude?",
      a: "Como asistente general: ChatGPT o Gemini. Para investigar con fuentes: Perplexity. Para modelos abiertos con menos rechazos: Kimi, GLM o DeepSeek. Para modelos sin censura junto a Claude en el mismo hilo: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a Claude?",
      a: "ChatGPT, Gemini, Grok, DeepSeek y Mistral tienen planes gratis con límites. LM Studio y Ollama son gratis en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, Claude incluido.",
    },
    filter: {
      q: "¿Existe un Claude sin censura?",
      a: "No. Los pesos de Claude son cerrados y su política se aplica en todas partes. Lo que funciona es otro modelo para las escenas que Claude rechaza. En {{appName}}, {{uncensored}} modelos sin censura se desbloquean tras una confirmación 18+ única, en el mismo hilo que Claude.",
    },
    privacy: {
      q: "¿Qué alternativa a Claude es la más privada?",
      a: "Un modelo local en LM Studio u Ollama nunca envía tu prompt a ningún sitio. En la nube, busca la opción de no entrenar y una retención corta. El modo incógnito de {{appName}} guarda el historial del chat en tu navegador.",
    },
    move: {
      q: "¿Puedo seguir usando Claude después de cambiar?",
      a: "Sí. {{appName}}, OpenRouter, NanoGPT y Poe ofrecen modelos Claude. Usa Claude para lo que mejor hace y cambia de modelo para el resto.",
    },
  },
  cta: {
    title: "Quédate con Claude. Sin sus muros.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Claude y modelos sin censura en un solo chat.",
    start: "Empieza un chat de incógnito",
    models: "Compara todos los modelos",
  },
};
