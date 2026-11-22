import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "Skills de IA",
    keywords: "skill de IA, {{name}}, {{appName}}, chat de IA sin censura",
  },
  breadcrumb: {
    skills: "Skills",
  },
  hero: {
    tryGeneric: "Prueba esta skill",
  },
  publishedBy: "Publicada por {{name}}",
  madeBy: "De {{name}}",
  startChat: "Empezar chat",
  chatWith: "Chatea con {{name}}",
  guest: "Sin registro",
  chatModel: "Modelo de chat",
  facts: {
    runsOn: "Funciona con",
    content: "Contenido",
    perMessage: "Por mensaje",
    versions: "Versiones",
    goodAt: "Su fuerte",
    keepInMind: "Ten en cuenta",
  },
  prompts: {
    intro:
      "Cada uno abre el chat con {{name}}, ya escrito y listo para enviar.",
    start: "Empieza con uno de estos",
  },
  story: {
    title: "Quién es {{name}}",
  },
  model: {
    credits: "{{cost}} créditos",
    creditsAbout: "~{{cost}} créditos",
    fixedPrice: "{{cost}} créditos por mensaje",
    estimatedPrice: "Unos {{cost}} créditos por mensaje",
    free: "Mensajes gratis",
    perMessageHint:
      "Mensaje típico: {{input}} tokens de entrada, {{output}} de salida. Varía según la longitud.",
    perMessageWithImageHint:
      "Mensaje típico: {{input}} tokens de entrada, {{output}} de salida, una imagen. Varía según la longitud.",
  },
  actions: {
    shareEarn: "Comparte y gana",
    addToSkills: "Añadir a mis skills",
    added: "Añadida a tus skills",
    addFailed: "No se pudo. Inténtalo de nuevo",
  },
  tier: {
    mainstream:
      "{{name}} funciona con {{model}}, un modelo de los grandes laboratorios con sus propios filtros de seguridad. Puede rechazar peticiones delicadas.",
    open: "{{name}} funciona con {{model}}, un modelo open-weight con filtros más ligeros. Trata más temas y se niega menos que los bots de los grandes laboratorios.",
    uncensored:
      "{{name}} funciona con {{model}}, hecho para conversar sin filtros de temas. Verificación 18+ una sola vez antes del primer mensaje.",
    ownWorldview:
      "{{model}} está entrenado con libros y documentos vetados en el internet mainstream. {{name}} te da opiniones políticas a contracorriente. Verificación 18+ una sola vez antes del primer mensaje.",
    abliterated:
      "{{model}} es un modelo mainstream sin el reflejo de negarse. {{name}} responde en lugar de sermonear. Verificación 18+ una sola vez antes del primer mensaje.",
    fineTuned:
      "{{model}} está reentrenado para quitar las negativas habituales. {{name}} responde donde los bots mainstream se escabullen. Verificación 18+ una sola vez antes del primer mensaje.",
  },
  share: {
    text: "¿Conoces a alguien a quien le gustaría {{name}}? Comparte el enlace y gana con lo que gaste.",
  },
  related: {
    similar: "Skills similares",
    moreFrom: "Más de {{name}}",
  },
};
