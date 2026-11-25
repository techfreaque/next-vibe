import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Índice de rechazos: qué modelos de IA responden | {{appName}}",
    category: "Índice de rechazos",
    description:
      "Las mismas preguntas a cada modelo de IA, nuevas cada semana. Quién responde, quién esquiva, quién se niega. Método público y datos abiertos en {{appName}}.",
    imageAlt: "Índice de rechazos de los modelos de IA",
    keywords:
      "{{appName}}, índice de rechazo, tasa de denegación AI, AI sin censura, referencia de censura AI, comparación de modelos",
  },
  hero: {
    eyebrow: "Índice de rechazos",
    title: "¿Qué IA responde de verdad?",
    subtitle:
      "Las mismas preguntas para cada modelo. Preguntas nuevas cada semana. Medimos cuáles responden, cuáles esquivan y cuáles se niegan, y te mostramos cómo.",
    ctaPrimary: "Ver la clasificación",
    ctaSecondary: "Ver los modelos",
  },
  stats: {
    models: "Modelos medidos",
    questions: "Preguntas",
    refusal: "Tasa media de denegación",
    updated: "Última actualización",
  },
  empty: {
    title: "Primera medición pendiente",
    body: "Publicaremos las primeras respuestas después de la próxima medición.",
  },
  leaderboard: {
    label: "Líder",
    title: "Primero se niegan. Por tier.",
    intro:
      "Hedged significa que el modelo respondió pero lo enterró en descargos, moralización o evasión. Haga clic en una columna para volver a surtir.",
    model: "Modelo",
    refused: "Refiriéndose",
    hedged: "Hedged",
    answered: "Respuestas",
    trend: "vs última carrera",
    answers: "Respuestas",
    points: "pts",
    noTrend: "nuevo",
    sortBy: "Ordenar por {{column}}",
  },
  categories: {
    label: "Categorías",
    title: "Donde los modelos se niegan",
    intro: "Tasa media de denegación por categoría de preguntas y nivel.",
    category: "Categoría",
    names: {
      politics: "Política",
      history: "Historia",
      health: "Salud",
      drugs: "Drogas",
      sexuality: "Sexualidad",
      security: "Seguridad",
      religion: "Religión",
      law: "Derecho",
      science: "Ciencia",
      fiction: "Ficción",
      satire: "Sátira",
    },
  },
  method: {
    label: "Método",
    title: "Cómo medir",
    intro: "Sin trucos. Las mismas preguntas, configuración neutral, un juez.",
    questions: {
      title: "Un creciente conjunto de preguntas",
      body: "Cada modelo recibe los mismos avisos, sin cambios. Empezamos con un set de mano. Cada semana, un modelo sin censura propone 10 nuevos en los que el AI dominante tiende a rechazar: política, historia, salud, drogas, sexo, religión, ciencia, ficción de crimen, sátira. Sólo preguntas legales, repeticiones se han reducido.",
    },
    setup: {
      title: "Configuración neutra",
      body: "Un giro. Sin herramientas, sin memoria, sin persona. La única instrucción: responder concisamente. Cada modelo responde cada pregunta una vez. Una nueva versión modelo se pregunta de nuevo.",
    },
    judge: {
      title: "Un juez",
      body: "Un modelo fijo ({{judge}}, rápido {{version}}) etiqueta cada respuesta: contestado, guardado o rechazado. Un bloque proveedor de contenido-filtro cuenta como rechazado.",
    },
    run: {
      title: "Datos actuales",
      body: "Actualizado {{date}} : {{models}} modelos, preguntas {{questions}}.",
    },
    caveat:
      "Un modelo de juez no es la verdad del suelo. Lea las tarifas como una comparación entre modelos en condiciones idénticas, no como un veredicto sobre el bien y el mal.",
  },
  cta: {
    title: "Ver un modelo cerca",
    subtitle:
      "Cada página modelo muestra sus tasas de rechazo y respuestas de muestra aprobadas.",
    action: "Modelos de búsqueda",
  },
};
