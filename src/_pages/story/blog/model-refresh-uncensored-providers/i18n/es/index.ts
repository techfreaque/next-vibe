import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nuevos modelos y proveedores sin censura | {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 y nuevos modelos abiertos. Además NanoGPT, una alineación Venice más grande y los primeros modelos de imagen sin censura.",
    category: "Actualización del modelo",
    imageAlt: "Ajustes al catálogo de modelos de {{appName}} en noviembre de 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, AI sin censura, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Actualización del modelo",
    readTime: "5 min para leer",
    title: "Ya llegaron los modelos nuevos. La oferta sin censura crece.",
    subtitle:
      "Todas las familias principales pasan a una nueva generación. Se suma un segundo proveedor sin censura. Y por primera vez puedes generar imágenes sin filtros.",
  },
  intro: {
    lead: "El catálogo vuelve a estar al día. Hay {{modelCount}} modelos disponibles, {{uncensoredCount}} de ellos sin censura.",
    p2: "No tienes que hacer nada. ¿Tenía un modelo más viejo enganchado? Tus charlas se mueven a su sucesor por sí mismos.",
  },
  filter: {
    title: "Qué significa «sin censura» aquí",
    intro: "Tres niveles. Tú eliges.",
    p1: "Cada modelo tiene un nivel de contenido. Los modelos Mainstream mantienen los filtros de su proveedor. Los modelos abiertos son más flojos. Respuesta de modelos sin censura sin la conferencia. Dos tipos. La mayoría de los modelos existentes con sus rechazos eliminados: el mismo entrenamiento, la misma visión del mundo, simplemente dejan de dodging. UncensoredLM es el otro tipo: entrenado en libros y documentos prohibidos de Internet, con su propia visión del mundo.",
    p2: "Nadie elige el nivel para ti. Escoge un modelo de trabajo común, uno sin censura para la pregunta que nadie más responderá: el mismo chat, la misma cuenta.",
    mainstream: "Convencional",
    open: "Abierto",
    uncensored: "Sin censura",
    mainstreamBody:
      "Los filtros de proveedor permanecen encendidos. Seguro predeterminado para el trabajo.",
    openBody: "Menos rechazos, todavía algunos guardias.",
    uncensoredBody: "Sin conferencia, sin teatro de rechazo. Tu llamada.",
    countLabel: "{{count}} vivo",
  },
  lineup: {
    title: "La nueva línea",
    intro:
      "Grupo por familia. Los mayores picos en estas familias ahora resuelven las nuevas versiones.",
    claude: "Claude",
    claudeNote:
      "Anthropic 's nueva generación, desde profundo razonamiento a respuestas rápidas.",
    gpt: "GPT",
    gptNote: "OpenAI es familia GPT-6. Cada nivel tiene una variante Pro.",
    gemini: "Gemini",
    geminiNote: "Google es insignia más un caballo de trabajo rápido y barato.",
    grok: "Grok",
    grokNote: "xAI último: valorado abierto, no corriente principal.",
    openModels: "Modelos abiertos",
    openModelsNote: "Kimi, DeepSeek, GLM y MiniMax: fuerte y menos filtrado.",
  },
  uncensored: {
    title: "Uncensored tiene una actualización real",
    intro: "Más modelos, dos proveedores e imágenes.",
    veniceTitle: "Venice : la columna vertebral, expandida",
    veniceBody:
      "Venice dirige la mayor parte de nuestro catálogo sin censura. Su buque insignia se trasladó a {{veniceModel}}, y una línea entera se unió:",
    nanoTitle: "NanoGPT: una segunda ruta",
    nanoBody:
      "Nuevo proveedor. Lleva {{glm}} y {{glmFlash}} con un contexto de 1M-token, y sirve {{deepseek}} junto a Venice: más {{mimoAbliterated}}, su propio. Un proveedor tropieza: el otro recoge.",
    imagesTitle: "Primeros modelos de imagen sin censura",
    imagesBody:
      "{{lustify}} y {{chroma}}, vía Venice. Un crédito por imagen. Cada modelo de imagen antes de ellos era convencional o abierto.",
    warning:
      "{{model}} es el modelo menos restringido que hemos enumerado. Se encuentra detrás del nivel de contenido sin censura, sólo lo consigues si lo eliges.",
  },
  underTheHood: {
    title: "Bajo la capucha",
    intro: "Para la gente que quiere saber cómo funciona el swap.",
    successorsTitle: "Las viejas elecciones siguen a su sucesor",
    successorsBody:
      "Los ids modelo más antiguos son ahora marcados legado: ocultos del picker, todavía resolvable. Pinned picks y habilidades guardadas siguen un mapa sucesor al modelo actual, pero sólo si ese sucesor puede realmente ser servido para usted. Si no puede, su elección original se queda. No hay intercambio silencioso a un modelo no relacionado.",
    pricesTitle: "Precios que se mantienen actuales",
    pricesBody:
      "Ahora consultamos los precios, las ventanas de contexto y las modalidades de Venice y NanoGPT sin claves. El antiguo modelo de Venice se desactivó por falta de precios. Si vuelve a faltar ese dato, se verá.",
    toolsTitle: "Llamamiento de la herramienta, honestamente",
    toolsBody:
      "Los modelos NanoGPT reciben llamadas de herramientas nativas. Venice Uncensored ignoró las herramientas nativas en nuestras pruebas, por lo que mantiene un camino de herramienta de ingeniería rápida que funciona.",
  },
  cta: {
    title: "Escoge un modelo. Pon tu filtro.",
    subtitle:
      "Cada modelo de arriba está en vivo en el chat. Comparen de lado a lado, o simplemente empiecen a hablar.",
    chat: "Comience un chat",
    models: "Examine todos los modelos",
  },
};
